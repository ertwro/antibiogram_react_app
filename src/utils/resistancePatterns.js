// src/utils/resistancePatterns.js
// --- Advanced Resistance Pattern Recognition Engine ---
// Sophisticated algorithms for detecting resistance phenotypes from susceptibility data
// Mimics infectious disease specialist pattern recognition for clinical decision support

import { bacteriaDatabase } from '../data/microbiologyData.js';
import { DRUG_FAMILIES } from '../data/antibiotics.js';

// Resistance pattern detection confidence levels
export const CONFIDENCE_LEVELS = {
  HIGH: 'high',        // >95% confidence
  MODERATE: 'moderate', // 75-95% confidence  
  LOW: 'low',          // 50-75% confidence
  UNCERTAIN: 'uncertain' // <50% confidence
};

// Resistance phenotype classifications
export const RESISTANCE_PHENOTYPES = {
  ESBL: 'esbl',
  AMPC: 'ampc', 
  CARBAPENEMASE: 'carbapenemase',
  MLSB: 'mlsb',
  VANCOMYCIN_RESISTANT: 'vre',
  METHICILLIN_RESISTANT: 'mrsa',
  FLUOROQUINOLONE_RESISTANT: 'fqr',
  AMINOGLYCOSIDE_RESISTANT: 'agr',
  MULTIDRUG_RESISTANT: 'mdr'
};

// CLSI interpretation standards
export const INTERPRETATION = {
  SUSCEPTIBLE: 'S',
  INTERMEDIATE: 'I', 
  RESISTANT: 'R',
  NOT_APPLICABLE: 'NA'
};

/**
 * Main resistance pattern analyzer
 * Analyzes susceptibility patterns to detect resistance mechanisms
 */
export class ResistancePatternAnalyzer {
  constructor() {
    this.detectionRules = this.initializeDetectionRules();
  }

  /**
   * Analyze susceptibility pattern for resistance mechanisms
   * @param {string} organism - Bacterial organism identifier
   * @param {Object} susceptibilityData - S/I/R data with MIC values
   * @returns {Object} Detected resistance patterns with confidence levels
   */
  analyzePattern(organism, susceptibilityData) {
    const results = {
      organism,
      detectedPatterns: [],
      warnings: [],
      recommendations: [],
      confidence: CONFIDENCE_LEVELS.UNCERTAIN
    };

    // Get organism-specific rules
    const organismData = bacteriaDatabase[organism];
    if (!organismData) {
      results.warnings.push('Unknown organism - limited pattern recognition');
      return results;
    }

    // Apply detection algorithms
    const patterns = [
      this.detectESBL(organism, susceptibilityData),
      this.detectAmpC(organism, susceptibilityData), 
      this.detectCarbapenemase(organism, susceptibilityData),
      this.detectMRSA(organism, susceptibilityData),
      this.detectVRE(organism, susceptibilityData),
      this.detectMLSb(organism, susceptibilityData),
      this.detectFluoroquinoloneResistance(organism, susceptibilityData),
      this.detectAminoglycosideResistance(organism, susceptibilityData)
    ].filter(pattern => pattern.detected);

    results.detectedPatterns = patterns;
    results.confidence = this.calculateOverallConfidence(patterns);
    results.recommendations = this.generateRecommendations(patterns);
    results.warnings = this.generateWarnings(patterns, susceptibilityData);

    return results;
  }

  /**
   * ESBL (Extended-Spectrum Beta-Lactamase) Detection
   * Key indicators: 3rd gen cephalosporin resistance + carbapenem sensitivity
   */
  detectESBL(organism, susceptibilityData) {
    const pattern = {
      type: RESISTANCE_PHENOTYPES.ESBL,
      detected: false,
      confidence: CONFIDENCE_LEVELS.UNCERTAIN,
      evidence: [],
      mechanism: 'Extended-spectrum beta-lactamase production'
    };

    // Only applicable to Enterobacterales
    if (!this.isEnterobacterales(organism)) {
      return pattern;
    }

    const indicators = {
      ceftriaxoneR: susceptibilityData.Ceftriaxone === INTERPRETATION.RESISTANT,
      ceftazidimeR: susceptibilityData.Ceftazidime === INTERPRETATION.RESISTANT,
      cefotaximeR: susceptibilityData.Cefotaxime === INTERPRETATION.RESISTANT,
      meropenemS: susceptibilityData.Meropenem === INTERPRETATION.SUSCEPTIBLE,
      ertapenemS: susceptibilityData.Ertapenem === INTERPRETATION.SUSCEPTIBLE,
      piptazEffect: this.checkPiperacillinTazobactamEffect(susceptibilityData)
    };

    let score = 0;

    // 3rd generation cephalosporin resistance (primary indicator)
    if (indicators.ceftriaxoneR) {
      score += 2;
      pattern.evidence.push('Ceftriaxone resistance');
    }
    if (indicators.ceftazidimeR) {
      score += 2; 
      pattern.evidence.push('Ceftazidime resistance');
    }
    if (indicators.cefotaximeR) {
      score += 2;
      pattern.evidence.push('Cefotaxime resistance');
    }

    // Carbapenem sensitivity (supporting evidence)
    if (indicators.meropenemS && indicators.ertapenemS) {
      score += 1;
      pattern.evidence.push('Carbapenem sensitivity (excludes carbapenemase)');
    }

    // Beta-lactamase inhibitor effect
    if (indicators.piptazEffect) {
      score += 1;
      pattern.evidence.push('Beta-lactamase inhibitor restores activity');
    }

    // Determine confidence based on evidence
    if (score >= 4) {
      pattern.detected = true;
      pattern.confidence = score >= 5 ? CONFIDENCE_LEVELS.HIGH : CONFIDENCE_LEVELS.MODERATE;
    } else if (score >= 2) {
      pattern.detected = true;
      pattern.confidence = CONFIDENCE_LEVELS.LOW;
    }

    return pattern;
  }

  /**
   * AmpC Beta-Lactamase Detection
   * Key indicators: Resistance to 1st/2nd gen cephalosporins + some 3rd gen
   */
  detectAmpC(organism, susceptibilityData) {
    const pattern = {
      type: RESISTANCE_PHENOTYPES.AMPC,
      detected: false,
      confidence: CONFIDENCE_LEVELS.UNCERTAIN,
      evidence: [],
      mechanism: 'AmpC beta-lactamase production'
    };

    // Check if organism can produce AmpC
    const ampCProducers = ['ecoli', 'kpneumoniae', 'enterobacter', 'citrobacter', 'serratia'];
    if (!ampCProducers.includes(organism)) {
      return pattern;
    }

    const indicators = {
      cefazolinR: susceptibilityData.Cefazolin === INTERPRETATION.RESISTANT,
      cefoxitinR: susceptibilityData.Cefoxitin === INTERPRETATION.RESISTANT,
      ceftriaxoneR: susceptibilityData.Ceftriaxone === INTERPRETATION.RESISTANT,
      meropenemS: susceptibilityData.Meropenem === INTERPRETATION.SUSCEPTIBLE,
      noInhibitorEffect: !this.checkBetaLactamaseInhibitorEffect(susceptibilityData)
    };

    let score = 0;

    if (indicators.cefazolinR) {
      score += 2;
      pattern.evidence.push('Cefazolin resistance');
    }
    if (indicators.cefoxitinR) {
      score += 2;
      pattern.evidence.push('Cefoxitin resistance (AmpC indicator)');
    }
    if (indicators.noInhibitorEffect) {
      score += 1;
      pattern.evidence.push('No beta-lactamase inhibitor effect');
    }
    if (indicators.meropenemS) {
      score += 1;
      pattern.evidence.push('Carbapenem sensitivity');
    }

    if (score >= 3) {
      pattern.detected = true;
      pattern.confidence = score >= 4 ? CONFIDENCE_LEVELS.HIGH : CONFIDENCE_LEVELS.MODERATE;
    }

    return pattern;
  }

  /**
   * Carbapenemase Detection  
   * Key indicators: Carbapenem resistance with specific patterns
   */
  detectCarbapenemase(organism, susceptibilityData) {
    const pattern = {
      type: RESISTANCE_PHENOTYPES.CARBAPENEMASE,
      detected: false,
      confidence: CONFIDENCE_LEVELS.UNCERTAIN,
      evidence: [],
      mechanism: 'Carbapenemase production (KPC, NDM, OXA-48, etc.)'
    };

    const indicators = {
      meropenemR: susceptibilityData.Meropenem === INTERPRETATION.RESISTANT,
      ertapenemR: susceptibilityData.Ertapenem === INTERPRETATION.RESISTANT,
      imipenemR: susceptibilityData.Imipenem === INTERPRETATION.RESISTANT,
      doripenemR: susceptibilityData.Doripenem === INTERPRETATION.RESISTANT
    };

    let carbapenemResistantCount = 0;

    Object.entries(indicators).forEach(([drug, resistant]) => {
      if (resistant) {
        carbapenemResistantCount++;
        pattern.evidence.push(`${drug.replace('R', '')} resistance`);
      }
    });

    // Multiple carbapenem resistance strongly suggests carbapenemase
    if (carbapenemResistantCount >= 2) {
      pattern.detected = true;
      pattern.confidence = carbapenemResistantCount >= 3 ? CONFIDENCE_LEVELS.HIGH : CONFIDENCE_LEVELS.MODERATE;
    } else if (carbapenemResistantCount === 1) {
      pattern.detected = true;
      pattern.confidence = CONFIDENCE_LEVELS.LOW;
      pattern.evidence.push('Single carbapenem resistance - consider alternative mechanisms');
    }

    return pattern;
  }

  /**
   * MRSA (Methicillin-Resistant S. aureus) Detection
   */
  detectMRSA(organism, susceptibilityData) {
    const pattern = {
      type: RESISTANCE_PHENOTYPES.METHICILLIN_RESISTANT,
      detected: false,
      confidence: CONFIDENCE_LEVELS.UNCERTAIN,
      evidence: [],
      mechanism: 'mecA-mediated methicillin resistance'
    };

    if (organism !== 'saureus') {
      return pattern;
    }

    const indicators = {
      oxacillinR: susceptibilityData.Oxacillin === INTERPRETATION.RESISTANT,
      cefoxitinR: susceptibilityData.Cefoxitin === INTERPRETATION.RESISTANT,
      methicillinR: susceptibilityData.Methicillin === INTERPRETATION.RESISTANT
    };

    // Cefoxitin is preferred screening test
    if (indicators.cefoxitinR) {
      pattern.detected = true;
      pattern.confidence = CONFIDENCE_LEVELS.HIGH;
      pattern.evidence.push('Cefoxitin resistance (mecA screen)');
    } else if (indicators.oxacillinR) {
      pattern.detected = true;
      pattern.confidence = CONFIDENCE_LEVELS.MODERATE;
      pattern.evidence.push('Oxacillin resistance');
    } else if (indicators.methicillinR) {
      pattern.detected = true;
      pattern.confidence = CONFIDENCE_LEVELS.MODERATE;
      pattern.evidence.push('Methicillin resistance');
    }

    return pattern;
  }

  /**
   * VRE (Vancomycin-Resistant Enterococcus) Detection
   */
  detectVRE(organism, susceptibilityData) {
    const pattern = {
      type: RESISTANCE_PHENOTYPES.VANCOMYCIN_RESISTANT,
      detected: false,
      confidence: CONFIDENCE_LEVELS.UNCERTAIN,
      evidence: [],
      mechanism: 'vanA/vanB-mediated vancomycin resistance'
    };

    if (!organism.includes('enterococcus')) {
      return pattern;
    }

    const vancomycinR = susceptibilityData.Vancomycin === INTERPRETATION.RESISTANT;
    const teicoplaninR = susceptibilityData.Teicoplanin === INTERPRETATION.RESISTANT;

    if (vancomycinR) {
      pattern.detected = true;
      pattern.evidence.push('Vancomycin resistance');
      
      if (teicoplaninR) {
        pattern.confidence = CONFIDENCE_LEVELS.HIGH;
        pattern.evidence.push('Teicoplanin resistance (suggests vanA)');
        pattern.mechanism = 'vanA-mediated resistance (high-level)';
      } else {
        pattern.confidence = CONFIDENCE_LEVELS.MODERATE;
        pattern.mechanism = 'Possible vanB-mediated resistance';
      }
    }

    return pattern;
  }

  /**
   * MLSb (Macrolide-Lincosamide-Streptogramin B) Resistance Detection
   */
  detectMLSb(organism, susceptibilityData) {
    const pattern = {
      type: RESISTANCE_PHENOTYPES.MLSB,
      detected: false,
      confidence: CONFIDENCE_LEVELS.UNCERTAIN,
      evidence: [],
      mechanism: 'MLSb resistance (ribosomal methylation)'
    };

    // Primarily relevant for gram-positive organisms
    if (!this.isGramPositive(organism)) {
      return pattern;
    }

    const indicators = {
      erythromycinR: susceptibilityData.Erythromycin === INTERPRETATION.RESISTANT,
      clindamycinR: susceptibilityData.Clindamycin === INTERPRETATION.RESISTANT,
      azithromycinR: susceptibilityData.Azithromycin === INTERPRETATION.RESISTANT
    };

    if (indicators.erythromycinR && indicators.clindamycinR) {
      pattern.detected = true;
      pattern.confidence = CONFIDENCE_LEVELS.HIGH;
      pattern.evidence.push('Erythromycin and clindamycin resistance');
      pattern.mechanism = 'Constitutive MLSb resistance';
    } else if (indicators.erythromycinR && !indicators.clindamycinR) {
      pattern.detected = true;
      pattern.confidence = CONFIDENCE_LEVELS.MODERATE;
      pattern.evidence.push('Erythromycin resistance with clindamycin sensitivity');
      pattern.mechanism = 'Possible inducible MLSb (D-test indicated)';
    }

    return pattern;
  }

  /**
   * Fluoroquinolone Resistance Detection
   */
  detectFluoroquinoloneResistance(organism, susceptibilityData) {
    const pattern = {
      type: RESISTANCE_PHENOTYPES.FLUOROQUINOLONE_RESISTANT,
      detected: false,
      confidence: CONFIDENCE_LEVELS.UNCERTAIN,
      evidence: [],
      mechanism: 'Target modification (gyrA/parC mutations) or efflux'
    };

    const fluoroquinolones = ['Ciprofloxacin', 'Levofloxacin', 'Moxifloxacin'];
    const resistantCount = fluoroquinolones.filter(
      drug => susceptibilityData[drug] === INTERPRETATION.RESISTANT
    ).length;

    if (resistantCount >= 2) {
      pattern.detected = true;
      pattern.confidence = CONFIDENCE_LEVELS.HIGH;
      pattern.evidence.push(`Multiple fluoroquinolone resistance (${resistantCount}/3)`);
    } else if (resistantCount === 1) {
      pattern.detected = true;
      pattern.confidence = CONFIDENCE_LEVELS.MODERATE;
      pattern.evidence.push('Single fluoroquinolone resistance');
    }

    return pattern;
  }

  /**
   * Aminoglycoside Resistance Detection
   */
  detectAminoglycosideResistance(organism, susceptibilityData) {
    const pattern = {
      type: RESISTANCE_PHENOTYPES.AMINOGLYCOSIDE_RESISTANT,
      detected: false,
      confidence: CONFIDENCE_LEVELS.UNCERTAIN,
      evidence: [],
      mechanism: 'Aminoglycoside-modifying enzymes or ribosomal methylation'
    };

    const aminoglycosides = ['Gentamicin', 'Tobramycin', 'Amikacin'];
    const resistantCount = aminoglycosides.filter(
      drug => susceptibilityData[drug] === INTERPRETATION.RESISTANT
    ).length;

    if (resistantCount >= 2) {
      pattern.detected = true;
      pattern.confidence = resistantCount === 3 ? CONFIDENCE_LEVELS.HIGH : CONFIDENCE_LEVELS.MODERATE;
      pattern.evidence.push(`Multiple aminoglycoside resistance (${resistantCount}/3)`);
    }

    return pattern;
  }

  // Helper methods
  isEnterobacterales(organism) {
    const enterobacterales = ['ecoli', 'kpneumoniae', 'enterobacter', 'citrobacter', 'serratia'];
    return enterobacterales.includes(organism);
  }

  isGramPositive(organism) {
    const gramPositive = ['saureus', 'enterococcus', 'streptococcus'];
    return gramPositive.some(gp => organism.includes(gp));
  }

  checkPiperacillinTazobactamEffect(susceptibilityData) {
    const piperacillin = susceptibilityData.Piperacillin;
    const piptaz = susceptibilityData['Piperacillin-Tazobactam'];
    
    return piperacillin === INTERPRETATION.RESISTANT && 
           (piptaz === INTERPRETATION.SUSCEPTIBLE || piptaz === INTERPRETATION.INTERMEDIATE);
  }

  checkBetaLactamaseInhibitorEffect(susceptibilityData) {
    const ampicillin = susceptibilityData.Ampicillin;
    const amoxiclav = susceptibilityData['Amoxicillin-Clavulanate'];
    
    return ampicillin === INTERPRETATION.RESISTANT &&
           (amoxiclav === INTERPRETATION.SUSCEPTIBLE || amoxiclav === INTERPRETATION.INTERMEDIATE);
  }

  calculateOverallConfidence(patterns) {
    if (!patterns.length) return CONFIDENCE_LEVELS.UNCERTAIN;
    
    const confidenceScores = {
      [CONFIDENCE_LEVELS.HIGH]: 4,
      [CONFIDENCE_LEVELS.MODERATE]: 3,
      [CONFIDENCE_LEVELS.LOW]: 2,
      [CONFIDENCE_LEVELS.UNCERTAIN]: 1
    };

    const avgScore = patterns.reduce((sum, pattern) => 
      sum + confidenceScores[pattern.confidence], 0) / patterns.length;

    if (avgScore >= 3.5) return CONFIDENCE_LEVELS.HIGH;
    if (avgScore >= 2.5) return CONFIDENCE_LEVELS.MODERATE;
    if (avgScore >= 1.5) return CONFIDENCE_LEVELS.LOW;
    return CONFIDENCE_LEVELS.UNCERTAIN;
  }

  generateRecommendations(patterns) {
    const recommendations = [];

    patterns.forEach(pattern => {
      switch (pattern.type) {
        case RESISTANCE_PHENOTYPES.ESBL:
          recommendations.push('Consider carbapenem therapy for serious infections');
          recommendations.push('Avoid cephalosporins and penicillins');
          break;
        case RESISTANCE_PHENOTYPES.CARBAPENEMASE:
          recommendations.push('Consult infectious disease specialist');
          recommendations.push('Consider colistin, tigecycline, or newer agents');
          break;
        case RESISTANCE_PHENOTYPES.METHICILLIN_RESISTANT:
          recommendations.push('Use vancomycin, linezolid, or daptomycin');
          recommendations.push('Avoid all beta-lactam antibiotics');
          break;
        case RESISTANCE_PHENOTYPES.VANCOMYCIN_RESISTANT:
          recommendations.push('Consider linezolid, daptomycin, or tigecycline');
          recommendations.push('Contact infection control');
          break;
      }
    });

    return [...new Set(recommendations)]; // Remove duplicates
  }

  generateWarnings(patterns, susceptibilityData) {
    const warnings = [];

    // Check for unusual patterns
    const carbapenemResistant = susceptibilityData.Meropenem === INTERPRETATION.RESISTANT;
    const cephalosporinSensitive = susceptibilityData.Ceftriaxone === INTERPRETATION.SUSCEPTIBLE;

    if (carbapenemResistant && cephalosporinSensitive) {
      warnings.push('Unusual pattern: Carbapenem resistance with cephalosporin sensitivity - verify results');
    }

    // Check for incomplete panels
    const importantDrugs = ['Meropenem', 'Vancomycin', 'Ceftriaxone'];
    const missingResults = importantDrugs.filter(drug => !susceptibilityData[drug]);
    
    if (missingResults.length > 0) {
      warnings.push(`Important antimicrobials not tested: ${missingResults.join(', ')}`);
    }

    return warnings;
  }

  initializeDetectionRules() {
    // Future enhancement: Load organism-specific detection rules
    return {};
  }
}

/**
 * Cross-resistance predictor
 * Predicts likely resistance to untested antibiotics based on detected patterns
 */
export class CrossResistancePredictor {
  
  /**
   * Predict cross-resistance based on detected patterns
   * @param {Array} detectedPatterns - Resistance patterns from analyzer
   * @param {string} organism - Bacterial organism
   * @returns {Object} Predicted resistance patterns
   */
  predictCrossResistance(detectedPatterns) {
    const predictions = {};

    detectedPatterns.forEach(pattern => {
      const crossResistance = this.getCrossResistanceRules(pattern.type);
      Object.assign(predictions, crossResistance);
    });

    return predictions;
  }

  getCrossResistanceRules(resistanceType) {
    const rules = {
      [RESISTANCE_PHENOTYPES.ESBL]: {
        'Ampicillin': INTERPRETATION.RESISTANT,
        'Amoxicillin': INTERPRETATION.RESISTANT,
        'Cefazolin': INTERPRETATION.RESISTANT,
        'Cefuroxime': INTERPRETATION.RESISTANT,
        'Ceftriaxone': INTERPRETATION.RESISTANT,
        'Ceftazidime': INTERPRETATION.RESISTANT
      },
      [RESISTANCE_PHENOTYPES.CARBAPENEMASE]: {
        'Meropenem': INTERPRETATION.RESISTANT,
        'Imipenem': INTERPRETATION.RESISTANT,
        'Ertapenem': INTERPRETATION.RESISTANT,
        'Ceftriaxone': INTERPRETATION.RESISTANT,
        'Ceftazidime': INTERPRETATION.RESISTANT,
        'Piperacillin-Tazobactam': INTERPRETATION.RESISTANT
      },
      [RESISTANCE_PHENOTYPES.METHICILLIN_RESISTANT]: {
        'Oxacillin': INTERPRETATION.RESISTANT,
        'Cefazolin': INTERPRETATION.RESISTANT,
        'Ceftriaxone': INTERPRETATION.RESISTANT,
        'Ampicillin': INTERPRETATION.RESISTANT
      }
    };

    return rules[resistanceType] || {};
  }
}

// Export singleton instances
export const resistanceAnalyzer = new ResistancePatternAnalyzer();
export const crossResistancePredictor = new CrossResistancePredictor();

/**
 * Convenience function for complete resistance analysis
 * @param {string} organism - Bacterial organism identifier
 * @param {Object} susceptibilityData - S/I/R interpretation data
 * @returns {Object} Complete resistance analysis results
 */
export function analyzeResistancePattern(organism, susceptibilityData) {
  const analysis = resistanceAnalyzer.analyzePattern(organism, susceptibilityData);
  const crossResistance = crossResistancePredictor.predictCrossResistance(
    analysis.detectedPatterns
  );
  
  return {
    ...analysis,
    crossResistancePredictions: crossResistance
  };
}