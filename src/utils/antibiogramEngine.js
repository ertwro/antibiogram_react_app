// src/utils/antibiogramEngine.js
// --- Intelligent Antibiogram Interpretation Engine ---
// Comprehensive clinical decision support system that integrates resistance pattern recognition,
// MIC interpretation, and clinical context to provide infectious disease specialist-level recommendations

import { analyzeResistancePattern } from './resistancePatterns.js';
import { interpretAntibiogram, breakpointInterpreter } from './breakpointInterpreter.js';
import { antibioticsData, getStewardshipGuidance, getDosing, getMonitoringRequirements, checkDrugInteractions, getPregnancySafety } from '../data/antibiotics.js';

// Clinical severity levels for treatment selection
export const SEVERITY_LEVELS = {
  MILD: 'mild',           // Outpatient treatment appropriate
  MODERATE: 'moderate',   // May require hospitalization  
  SEVERE: 'severe',       // ICU-level care, aggressive therapy
  CRITICAL: 'critical'    // Life-threatening, last-resort agents
};

// Treatment preference rankings
export const TREATMENT_TIERS = {
  FIRST_LINE: 'first_line',       // Preferred empiric/targeted therapy
  SECOND_LINE: 'second_line',     // Alternative when first-line unavailable
  THIRD_LINE: 'third_line',       // Reserved for resistance/intolerance
  LAST_RESORT: 'last_resort'      // Only when no other options
};

// Infection site classifications for treatment optimization
export const INFECTION_SITES = {
  BLOOD: 'bloodstream',
  PNEUMONIA: 'pneumonia', 
  MENINGITIS: 'meningitis',
  ENDOCARDITIS: 'endocarditis',
  SKIN_SOFT_TISSUE: 'skin_soft_tissue',
  INTRA_ABDOMINAL: 'intra_abdominal',
  URINARY_TRACT: 'urinary_tract',
  BONE_JOINT: 'bone_joint',
  OTHER: 'other'
};

/**
 * Intelligent Antibiogram Interpretation Engine
 * Provides comprehensive clinical decision support based on susceptibility testing
 */
export class AntibiogramInterpreter {
  
  /**
   * Main interpretation function - processes complete antibiogram data
   * @param {Object} params - Analysis parameters
   * @param {string} params.organism - Bacterial organism identifier
   * @param {Object} params.micData - MIC values for tested antibiotics
   * @param {Object} params.patientData - Patient demographics and clinical data
   * @param {string} params.infectionSite - Site of infection
   * @param {string} params.severity - Clinical severity level
   * @param {Array} params.allergies - Patient drug allergies
   * @returns {Object} Comprehensive interpretation and recommendations
   */
  interpretAntibiogram(params) {
    const {
      organism,
      micData,
      patientData = {},
      infectionSite = INFECTION_SITES.OTHER,
      severity = SEVERITY_LEVELS.MODERATE,
      allergies = []
    } = params;

    // Initialize result structure
    const result = {
      organism,
      infectionSite,
      severity,
      timestamp: new Date().toISOString(),
      
      // Core interpretation results
      micInterpretations: {},
      resistanceAnalysis: {},
      clinicalRecommendations: [],
      stewardshipGuidance: {},
      
      // Treatment recommendations
      recommendedTherapy: null,
      alternativeOptions: [],
      contraindications: [],
      
      // Clinical considerations
      monitoringRequirements: [],
      drugInteractions: [],
      pregnancyConsiderations: {},
      
      // Quality metrics
      confidence: 'moderate',
      warnings: [],
      limitations: []
    };

    try {
      // Step 1: Interpret MIC values using CLSI breakpoints
      const micAnalysis = interpretAntibiogram(organism, micData, infectionSite);
      result.micInterpretations = micAnalysis.interpretations;
      result.summary = micAnalysis.summary;

      // Step 2: Analyze resistance patterns
      const susceptibilityData = this.convertMICsToSIR(micAnalysis.interpretations);
      result.resistanceAnalysis = analyzeResistancePattern(organism, susceptibilityData);

      // Step 3: Generate treatment recommendations
      const treatmentOptions = this.generateTreatmentOptions({
        organism,
        interpretations: result.micInterpretations,
        resistancePatterns: result.resistanceAnalysis.detectedPatterns,
        infectionSite,
        severity,
        patientData,
        allergies
      });

      result.recommendedTherapy = treatmentOptions.primary;
      result.alternativeOptions = treatmentOptions.alternatives;
      result.contraindications = treatmentOptions.contraindications;

      // Step 4: Add clinical guidance
      result.stewardshipGuidance = this.generateStewardshipGuidance(
        result.recommendedTherapy,
        result.resistanceAnalysis,
        severity
      );

      result.monitoringRequirements = this.getMonitoringPlan(
        result.recommendedTherapy
      );

      // Step 5: Safety considerations
      if (patientData.medications) {
        result.drugInteractions = this.checkAllInteractions(
          [result.recommendedTherapy, ...result.alternativeOptions],
          patientData.medications
        );
      }

      if (patientData.isPregnant || patientData.gender === 'Female') {
        result.pregnancyConsiderations = this.assessPregnancySafety(
          [result.recommendedTherapy, ...result.alternativeOptions]
        );
      }

      // Step 6: Quality assessment
      result.confidence = this.assessOverallConfidence(result);
      result.warnings = this.generateClinicalWarnings(result);
      result.limitations = this.identifyLimitations(micData);

    } catch (error) {
      result.warnings.push(`Analysis error: ${error.message}`);
      result.confidence = 'low';
    }

    return result;
  }

  /**
   * Convert MIC interpretations to S/I/R format for resistance analysis
   */
  convertMICsToSIR(interpretations) {
    const sirData = {};
    Object.entries(interpretations).forEach(([antibiotic, result]) => {
      sirData[antibiotic] = result.interpretation;
    });
    return sirData;
  }

  /**
   * Generate treatment recommendations based on susceptibility and clinical context
   */
  generateTreatmentOptions(params) {
    const {
      organism,
      interpretations,
      resistancePatterns,
      infectionSite,
      severity,
      patientData,
      allergies
    } = params;

    const options = {
      primary: null,
      alternatives: [],
      contraindications: []
    };

    // Get all susceptible antibiotics
    const susceptibleAntibiotics = Object.entries(interpretations)
      .filter(([, result]) => result.interpretation === 'S')
      .map(([antibiotic]) => antibiotic);

    // Apply clinical selection criteria
    const rankedOptions = this.rankTreatmentOptions({
      susceptibleAntibiotics,
      organism,
      infectionSite,
      severity,
      resistancePatterns,
      patientData,
      allergies
    });

    if (rankedOptions.length > 0) {
      options.primary = rankedOptions[0];
      options.alternatives = rankedOptions.slice(1, 4); // Top 3 alternatives
    }

    // Identify contraindications
    options.contraindications = this.identifyContraindications(
      Object.keys(interpretations),
      allergies
    );

    return options;
  }

  /**
   * Rank treatment options based on clinical appropriateness
   */
  rankTreatmentOptions(params) {
    const {
      susceptibleAntibiotics,
      organism,
      infectionSite,
      severity,
      resistancePatterns,
      patientData,
      allergies
    } = params;

    const scoredOptions = susceptibleAntibiotics.map(antibiotic => {
      const score = this.calculateTreatmentScore({
        antibiotic,
        organism,
        infectionSite,
        severity,
        resistancePatterns,
        patientData,
        allergies
      });

      return {
        antibiotic,
        score: score.total,
        reasoning: score.factors,
        tier: this.assignTreatmentTier(score.total),
        dosing: this.getOptimalDosing(antibiotic, patientData, infectionSite)
      };
    });

    // Sort by score (highest first)
    return scoredOptions
      .sort((a, b) => b.score - a.score)
      .filter(option => option.score > 0); // Exclude contraindicated options
  }

  /**
   * Calculate treatment appropriateness score
   */
  calculateTreatmentScore(params) {
    const {
      antibiotic,
      organism,
      infectionSite,
      severity,
      resistancePatterns,
      patientData,
      allergies
    } = params;

    const factors = {};
    let total = 50; // Base score

    const antibioticData = antibioticsData[antibiotic];
    if (!antibioticData) {
      factors.noData = -100;
      return { total: -100, factors };
    }

    // Stewardship appropriateness
    const stewardship = getStewardshipGuidance(antibiotic, infectionSite);
    if (stewardship?.appropriate) {
      factors.stewardshipAppropriate = +20;
      total += 20;
    }

    // Spectrum optimization (prefer narrow spectrum when appropriate)
    const spectrumScore = this.assessSpectrumAppropriate(antibiotic, organism, resistancePatterns);
    factors.spectrumOptimization = spectrumScore;
    total += spectrumScore;

    // Site-specific considerations
    const siteScore = this.assessSiteSpecificActivity(antibiotic, infectionSite);
    factors.siteSpecific = siteScore;
    total += siteScore;

    // Severity-appropriate choice
    const severityScore = this.assessSeverityAppropriateness(antibiotic, severity);
    factors.severityAppropriate = severityScore;
    total += severityScore;

    // Safety profile
    const safetyScore = this.assessSafetyProfile(antibiotic, patientData);
    factors.safetyProfile = safetyScore;
    total += safetyScore;

    // Allergy considerations
    if (this.hasAllergyContraindication(antibiotic, allergies)) {
      factors.allergyContraindication = -100;
      total = -100;
    }

    // Resistance risk
    const resistanceRisk = this.assessResistanceRisk(antibiotic, resistancePatterns);
    factors.resistanceRisk = resistanceRisk;
    total += resistanceRisk;

    // PK/PD optimization potential
    const pkpdScore = this.assessPKPDOptimization(antibiotic);
    factors.pkpdOptimization = pkpdScore;
    total += pkpdScore;

    return { total: Math.max(total, -100), factors };
  }

  /**
   * Assess spectrum appropriateness (prefer narrow when possible)
   */
  assessSpectrumAppropriate(antibiotic, organism, resistancePatterns) {
    const antibioticData = antibioticsData[antibiotic];
    if (!antibioticData?.spectrum) return 0;

    // Prefer narrow-spectrum agents when appropriate
    const spectrumBreadth = this.calculateSpectrumBreadth(antibioticData.spectrum);
    
    // Bonus for narrow spectrum against susceptible organism
    if (spectrumBreadth < 3) return +10;
    
    // Penalty for overly broad spectrum without resistance indication
    if (spectrumBreadth > 6 && resistancePatterns.length === 0) return -5;
    
    return 0;
  }

  /**
   * Calculate spectrum breadth score
   */
  calculateSpectrumBreadth(spectrum) {
    const categories = ['gramPositive', 'gramNegative', 'anaerobes', 'atypicals'];
    return categories.reduce((sum, category) => {
      return sum + (spectrum[category]?.length || 0);
    }, 0);
  }

  /**
   * Assess site-specific antibiotic activity
   */
  assessSiteSpecificActivity(antibiotic, infectionSite) {
    const sitePreferences = {
      [INFECTION_SITES.MENINGITIS]: {
        preferred: ['Ceftriaxone', 'Meropenem', 'Vancomycin'],
        avoid: ['Gentamicin', 'Tobramycin'] // Poor CNS penetration
      },
      [INFECTION_SITES.ENDOCARDITIS]: {
        preferred: ['Penicillin G', 'Oxacillin', 'Vancomycin', 'Gentamicin'],
        avoid: []
      },
      [INFECTION_SITES.PNEUMONIA]: {
        preferred: ['Ceftriaxone', 'Piperacillin-Tazobactam', 'Levofloxacin'],
        avoid: []
      }
    };

    const preferences = sitePreferences[infectionSite];
    if (!preferences) return 0;

    if (preferences.preferred.includes(antibiotic)) return +15;
    if (preferences.avoid.includes(antibiotic)) return -20;
    
    return 0;
  }

  /**
   * Assess severity-appropriate antibiotic selection
   */
  assessSeverityAppropriateness(antibiotic, severity) {
    const severityPreferences = {
      [SEVERITY_LEVELS.CRITICAL]: {
        preferred: ['Meropenem', 'Vancomycin', 'Piperacillin-Tazobactam'],
        avoid: ['Oral agents']
      },
      [SEVERITY_LEVELS.SEVERE]: {
        preferred: ['Ceftriaxone', 'Piperacillin-Tazobactam', 'Vancomycin'],
        avoid: []
      },
      [SEVERITY_LEVELS.MILD]: {
        preferred: ['Cefazolin', 'Penicillin G', 'Oral agents'],
        avoid: ['Meropenem', 'Vancomycin'] // Reserve for serious infections
      }
    };

    const preferences = severityPreferences[severity];
    if (!preferences) return 0;

    if (preferences.preferred.includes(antibiotic)) return +10;
    if (preferences.avoid.includes(antibiotic)) return -15;
    
    return 0;
  }

  /**
   * Assess patient safety profile
   */
  assessSafetyProfile(antibiotic, patientData) {
    const antibioticData = antibioticsData[antibiotic];
    if (!antibioticData?.safety) return 0;

    let score = 0;

    // Renal function considerations
    if (patientData.creatinine > 2.0) {
      const renalDosing = getDosing(antibiotic, patientData.age, 30); // Assume moderate impairment
      if (renalDosing?.renalAdjustment && renalDosing.renalAdjustment !== 'Contraindicated') {
        score += 5; // Bonus for available renal dosing
      } else if (renalDosing?.renalAdjustment === 'Contraindicated') {
        score -= 50; // Major penalty
      }
    }

    // Age-specific considerations
    if (patientData.age >= 65) {
      if (antibioticData.safety.majorAdverseEffects?.includes('Nephrotoxicity')) {
        score -= 10; // Caution in elderly
      }
    }

    // Pregnancy considerations
    if (patientData.isPregnant) {
      const pregnancySafety = getPregnancySafety(antibiotic);
      if (pregnancySafety?.category === 'Category A' || pregnancySafety?.category === 'Category B') {
        score += 15;
      } else if (pregnancySafety?.category === 'Category D' || pregnancySafety?.category === 'Category X') {
        score -= 50;
      }
    }

    return score;
  }

  /**
   * Check for allergy contraindications
   */
  hasAllergyContraindication(antibiotic, allergies) {
    if (!allergies || allergies.length === 0) return false;

    const antibioticData = antibioticsData[antibiotic];
    if (!antibioticData) return false;

    // Direct drug allergy
    if (allergies.includes(antibiotic)) return true;

    // Drug family cross-reactivity
    const drugFamily = antibioticData.classification?.family;
    if (drugFamily) {
      // Check for beta-lactam cross-reactivity
      if (drugFamily.includes('betalactam') || drugFamily.includes('penicillin')) {
        if (allergies.some(allergy => 
          allergy.toLowerCase().includes('penicillin') || 
          allergy.toLowerCase().includes('beta-lactam')
        )) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Assess resistance development risk
   */
  assessResistanceRisk(antibiotic, resistancePatterns) {
    const antibioticData = antibioticsData[antibiotic];
    if (!antibioticData?.stewardship) return 0;

    let score = 0;

    // High resistance risk antibiotics
    if (antibioticData.stewardship.resistance?.includes('high resistance development risk')) {
      score -= 10;
    }

    // Carbapenem stewardship
    if (antibioticData.classification?.family === 'carbapenem') {
      if (resistancePatterns.some(p => p.type === 'esbl')) {
        score += 15; // Appropriate for ESBL
      } else {
        score -= 10; // Reserve carbapenems
      }
    }

    return score;
  }

  /**
   * Assess PK/PD optimization potential
   */
  assessPKPDOptimization(antibiotic) {
    const antibioticData = antibioticsData[antibiotic];
    if (!antibioticData?.dosing) return 0;

    let score = 0;

    // Extended infusion available for time-dependent antibiotics
    if (antibioticData.dosing.adult?.extendedInfusion) {
      score += 5; // PK/PD optimization possible
    }

    // Continuous infusion protocols
    if (antibioticData.dosing.adult?.continuous) {
      score += 5;
    }

    return score;
  }

  /**
   * Assign treatment tier based on score
   */
  assignTreatmentTier(score) {
    if (score >= 80) return TREATMENT_TIERS.FIRST_LINE;
    if (score >= 60) return TREATMENT_TIERS.SECOND_LINE;
    if (score >= 40) return TREATMENT_TIERS.THIRD_LINE;
    if (score > 0) return TREATMENT_TIERS.LAST_RESORT;
    return 'contraindicated';
  }

  /**
   * Get optimal dosing recommendations
   */
  getOptimalDosing(antibiotic, patientData, infectionSite) {
    const baseDosing = getDosing(antibiotic, patientData.age, patientData.creatinineClearance);
    
    // Site-specific dosing modifications
    const siteModifications = {
      [INFECTION_SITES.MENINGITIS]: 'Use high-dose regimen for CNS penetration',
      [INFECTION_SITES.ENDOCARDITIS]: 'Consider extended treatment duration',
      [INFECTION_SITES.BONE_JOINT]: 'Prolonged therapy may be required'
    };

    // Severity-based modifications
    return {
      ...baseDosing,
      siteSpecificNotes: siteModifications[infectionSite]
    };
  }

  /**
   * Generate stewardship guidance
   */
  generateStewardshipGuidance(recommendedTherapy, resistanceAnalysis, severity) {
    const guidance = {
      appropriateness: 'appropriate',
      deEscalationOpportunity: false,
      durationGuidance: '',
      monitoringRecommendations: [],
      alternatives: []
    };

    if (!recommendedTherapy) return guidance;

    const stewardship = getStewardshipGuidance(recommendedTherapy.antibiotic);
    
    if (stewardship) {
      guidance.deEscalationOpportunity = stewardship.deEscalation?.includes('de-escalation');
      guidance.durationGuidance = this.getDurationGuidance(severity);
    }

    return guidance;
  }

  /**
   * Get monitoring plan for recommended therapy
   */
  getMonitoringPlan(recommendedTherapy) {
    const monitoring = [];

    if (recommendedTherapy) {
      const requirements = getMonitoringRequirements(recommendedTherapy.antibiotic);
      if (requirements) {
        monitoring.push({
          antibiotic: recommendedTherapy.antibiotic,
          ...requirements
        });
      }
    }

    return monitoring;
  }

  /**
   * Check drug interactions for all recommended therapies
   */
  checkAllInteractions(therapies, medications) {
    const interactions = [];

    therapies.forEach(therapy => {
      if (therapy?.antibiotic) {
        const drugInteractions = checkDrugInteractions(therapy.antibiotic, medications);
        if (drugInteractions.length > 0) {
          interactions.push({
            antibiotic: therapy.antibiotic,
            interactions: drugInteractions
          });
        }
      }
    });

    return interactions;
  }

  /**
   * Assess pregnancy safety for recommended therapies
   */
  assessPregnancySafety(therapies) {
    const safety = {};

    therapies.forEach(therapy => {
      if (therapy?.antibiotic) {
        safety[therapy.antibiotic] = getPregnancySafety(therapy.antibiotic);
      }
    });

    return safety;
  }

  /**
   * Assess overall analysis confidence
   */
  assessOverallConfidence(result) {
    let confidence = 'moderate';

    // High confidence criteria
    if (result.recommendedTherapy && 
        result.resistanceAnalysis.confidence === 'high' &&
        result.summary.resistanceRate < 20) {
      confidence = 'high';
    }

    // Low confidence criteria
    if (!result.recommendedTherapy ||
        result.warnings.length > 2 ||
        result.summary.resistanceRate > 70) {
      confidence = 'low';
    }

    return confidence;
  }

  /**
   * Generate clinical warnings
   */
  generateClinicalWarnings(result) {
    const warnings = [];

    // High resistance rate warning
    if (result.summary?.resistanceRate > 50) {
      warnings.push('High resistance rate detected - consider alternative diagnostics');
    }

    // Multiple resistance patterns
    if (result.resistanceAnalysis.detectedPatterns?.length > 2) {
      warnings.push('Multiple resistance mechanisms detected - consult infectious disease specialist');
    }

    // Limited treatment options
    if (result.alternativeOptions.length < 2) {
      warnings.push('Limited treatment options available - consider combination therapy');
    }

    return warnings;
  }

  /**
   * Identify analysis limitations
   */
  identifyLimitations(micData) {
    const limitations = [];

    // Limited antibiotic panel
    if (Object.keys(micData).length < 5) {
      limitations.push('Limited antibiotic testing panel');
    }

    // Missing key antibiotics
    const keyAntibiotics = ['Meropenem', 'Vancomycin', 'Ceftriaxone'];
    const missingKey = keyAntibiotics.filter(ab => !micData[ab]);
    if (missingKey.length > 0) {
      limitations.push(`Key antibiotics not tested: ${missingKey.join(', ')}`);
    }

    return limitations;
  }

  /**
   * Get duration guidance for antibiotic therapy
   */
  getDurationGuidance(severity) {
    const durationMap = {
      [SEVERITY_LEVELS.MILD]: '5-7 days',
      [SEVERITY_LEVELS.MODERATE]: '7-10 days',
      [SEVERITY_LEVELS.SEVERE]: '10-14 days',
      [SEVERITY_LEVELS.CRITICAL]: '14-21 days'
    };

    return durationMap[severity] || '7-10 days';
  }

  /**
   * Identify contraindications
   */
  identifyContraindications(antibiotics, allergies) {
    const contraindications = [];

    antibiotics.forEach(antibiotic => {
      const reasons = [];

      // Allergy contraindications
      if (this.hasAllergyContraindication(antibiotic, allergies)) {
        reasons.push('Allergy contraindication');
      }

      // Clinical contraindications
      const antibioticData = antibioticsData[antibiotic];
      if (antibioticData?.safety?.contraindications) {
        antibioticData.safety.contraindications.forEach(contraindication => {
          // Add specific logic for patient-specific contraindications
          reasons.push(contraindication);
        });
      }

      if (reasons.length > 0) {
        contraindications.push({
          antibiotic,
          reasons
        });
      }
    });

    return contraindications;
  }
}

// Export singleton instance
export const antibiogramInterpreter = new AntibiogramInterpreter();

/**
 * Convenience function for complete antibiogram analysis
 * @param {Object} params - Analysis parameters
 * @returns {Object} Complete interpretation results
 */
export function analyzeAntibiogram(params) {
  return antibiogramInterpreter.interpretAntibiogram(params);
}

/**
 * Quick susceptibility check for specific antibiotic
 * @param {string} organism - Bacterial organism
 * @param {string} antibiotic - Antibiotic name
 * @param {number} mic - MIC value
 * @param {string} site - Infection site
 * @returns {Object} Interpretation result
 */
export function quickSusceptibilityCheck(organism, antibiotic, mic, site = null) {
  return breakpointInterpreter.interpretMIC(organism, antibiotic, mic, site);
}