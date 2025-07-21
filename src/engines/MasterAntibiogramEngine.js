// src/engines/MasterAntibiogramEngine.js
// --- Master Orchestrator for World-Class Antibiogram System ---
// Coordinates the 4-phase specialist workflow and integrates all 8 intelligence layers

import { CLSIBreakpointEngine } from './CLSIBreakpointEngine.js';
import { ResistancePatternEngine } from './ResistancePatternEngine.js';
import { TherapeuticStrategyComparatorEngine } from './TherapeuticStrategyComparatorEngine.js';
import { CLSIReportingEngine } from './CLSIReportingEngine.js';
import { getBacteriaDatabase } from '../data/microbiologyData.js';
import { antibioticsData } from '../data/antibiotics.js';

export class MasterAntibiogramEngine {
  constructor() {
    // Initialize all intelligence layers
    this.clsiEngine = new CLSIBreakpointEngine();
    this.resistanceEngine = new ResistancePatternEngine();
    this.comparatorEngine = new TherapeuticStrategyComparatorEngine();
    this.clsiReportingEngine = new CLSIReportingEngine();
    
    // Load core databases
    this.bacteriaDatabase = getBacteriaDatabase();
    this.antibioticsDatabase = antibioticsData;
    
    console.log('🧠 MasterAntibiogramEngine initialized with full intelligence layers');
    console.log('   📊 CLSI tier-based reporting engine active');
  }

  /**
   * MAIN WORKFLOW: Complete 4-Phase Specialist Interpretation
   * @param {Object} params - Complete antibiogram parameters
   * @returns {Object} Complete clinical interpretation with comparative analysis
   */
  async interpretAntibiogram({
    organism,
    infectionSite,
    micData,
    interpretations = null,
    resistanceAnalysis = null,
    detectedMechanisms = null,
    patientData = {},
    localEpidemiology = {},
    mode = 'simple'
  }) {
    console.log(`🔬 Starting ${mode} mode antibiogram interpretation for ${organism}`);
    
    try {
      // PHASE 1: Setting the Stage - Gathering the Clues
      const phase1 = await this.executePhase1(organism, infectionSite);
      
      // PHASE 2: Initial Interpretation & Red Flags (use provided interpretations if available)
      const phase2 = interpretations ? 
        { 
          micData: micData,
          interpretations: interpretations,
          clinicalOverrides: {},
          warnings: [],
          susceptibleAgents: this.filterSusceptibleAgents(interpretations),
          resistantPattern: this.analyzeResistantPattern(interpretations)
        } :
        await this.executePhase2(organism, micData, infectionSite, phase1);
      
      // PHASE 3: Resistance Mechanism Detection (use provided analysis if available)
      const phase3 = resistanceAnalysis ? 
        {
          detectedMechanisms: resistanceAnalysis,
          confirmationTests: this.generateConfirmationTests(detectedMechanisms || []),
          finalInterpretations: interpretations,
          interpretationChanges: [],
          mechanismEducation: this.generateMechanismEducation(detectedMechanisms || [])
        } :
        await this.executePhase3(organism, phase2, micData);
      
      // PHASE 4: Final Plan - Comparative Analysis or Simple Recommendations
      const phase4 = await this.executePhase4({
        ...phase1,
        ...phase2, 
        ...phase3,
        patientData,
        infectionSite,
        localEpidemiology,
        mode
      });
      
      return {
        success: true,
        mode: mode,
        organism: organism,
        infectionSite: infectionSite,
        phases: {
          phase1: phase1,
          phase2: phase2,
          phase3: phase3,
          phase4: phase4
        },
        clinicalSummary: this.generateClinicalSummary(phase1, phase2, phase3, phase4),
        educationalInsights: this.generateEducationalContent(phase1, phase2, phase3, phase4),
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ MasterAntibiogramEngine error:', error);
      return {
        success: false,
        error: error.message,
        fallbackRecommendations: this.generateFallbackRecommendations(organism, infectionSite)
      };
    }
  }

  /**
   * PHASE 1: Setting the Stage - Understanding Context
   */
  async executePhase1(organism, infectionSite) {
    console.log('📋 Phase 1: Setting the Stage');
    
    // 1. Load organism profile from bacterial database
    const organismProfile = this.bacteriaDatabase[organism] || null;
    if (!organismProfile) {
      throw new Error(`Unknown organism: ${organism}`);
    }
    
    // 2. Get intrinsic resistance patterns
    const intrinsicResistance = this.clsiEngine.getIntrinsicResistance(organism);
    
    // 3. Get site-specific considerations
    const siteConsiderations = this.getSiteSpecificConsiderations(infectionSite);
    
    // 4. Generate initial antibiotic panel (filtered for intrinsic resistance)
    const initialPanel = this.generateInitialAntibioticPanel(organism, intrinsicResistance);
    
    return {
      organism: organism,
      organismProfile: organismProfile,
      infectionSite: infectionSite,
      intrinsicResistance: intrinsicResistance,
      siteConsiderations: siteConsiderations,
      initialPanel: initialPanel,
      educationalNotes: this.generatePhase1Education(organism, intrinsicResistance)
    };
  }

  /**
   * PHASE 2: Initial Interpretation & Red Flags
   */
  async executePhase2(organism, micData, infectionSite, phase1Data) {
    console.log('🚩 Phase 2: Initial Interpretation & Red Flags');
    
    const interpretations = {};
    const warnings = [];
    const clinicalOverrides = {};
    
    // Process each MIC value
    for (const [antibiotic, micValue] of Object.entries(micData)) {
      // 1. Basic CLSI interpretation
      const interpretation = await this.clsiEngine.interpretMIC(
        organism, antibiotic, micValue, infectionSite
      );
      interpretations[antibiotic] = interpretation;
      
      // 2. Check for clinical overrides (site-specific ineffectiveness)
      const override = this.checkClinicalOverrides(organism, antibiotic, interpretation, infectionSite);
      if (override) {
        clinicalOverrides[antibiotic] = override;
        warnings.push(override.warning);
      }
      
      // 3. Check for paradoxical results
      const paradox = this.checkParadoxicalResults(organism, antibiotic, interpretation, interpretations);
      if (paradox) {
        warnings.push(paradox);
      }
    }
    
    return {
      micData: micData,
      interpretations: interpretations,
      clinicalOverrides: clinicalOverrides,
      warnings: warnings,
      susceptibleAgents: this.filterSusceptibleAgents(interpretations),
      resistantPattern: this.analyzeResistantPattern(interpretations)
    };
  }

  /**
   * PHASE 3: The Deep Dive - Inferring Resistance Mechanisms
   */
  async executePhase3(organism, phase2Data, micData) {
    console.log('🔍 Phase 3: Resistance Mechanism Detection');
    
    // 1. Analyze resistance patterns to detect mechanisms
    const detectedMechanisms = await this.resistanceEngine.analyzePattern(
      organism, 
      phase2Data.interpretations
    );
    
    // 2. Generate confirmation test recommendations
    const confirmationTests = this.generateConfirmationTests(detectedMechanisms.detectedPatterns);
    
    // 3. Apply mechanism-based overrides (the "Aha!" moment)
    const finalInterpretations = this.applyMechanismOverrides(
      phase2Data.interpretations,
      detectedMechanisms.detectedPatterns
    );
    
    // 4. Calculate changes made by mechanism detection
    const interpretationChanges = this.calculateInterpretationChanges(
      phase2Data.interpretations,
      finalInterpretations
    );
    
    return {
      detectedMechanisms: detectedMechanisms,
      confirmationTests: confirmationTests,
      finalInterpretations: finalInterpretations,
      interpretationChanges: interpretationChanges,
      mechanismEducation: this.generateMechanismEducation(detectedMechanisms.detectedPatterns)
    };
  }

  /**
   * PHASE 4: Final Plan - Comparative Analysis or Simple Recommendations
   */
  async executePhase4(allPhaseData) {
    console.log(`🎯 Phase 4: ${allPhaseData.mode === 'advanced' ? 'Therapeutic Comparison' : 'Simple Recommendations'}`);
    
    // Get viable treatment options from final interpretations
    const viableOptions = this.extractViableOptions(allPhaseData.finalInterpretations);
    
    if (allPhaseData.mode === 'simple') {
      return this.generateSimpleRecommendations(viableOptions, allPhaseData);
    } else {
      return this.generateAdvancedComparison(viableOptions, allPhaseData);
    }
  }

  /**
   * Generate Simple Mode Recommendations
   */
  generateSimpleRecommendations(viableOptions, allPhaseData) {
    // Generate CLSI tier-based recommendations with stewardship guidance
    const clsiReport = this.generateCLSITierRecommendations(viableOptions, allPhaseData);
    
    // Rank options by CLSI tiers and stewardship criteria
    const rankedOptions = this.rankOptionsByTierCriteria(viableOptions, allPhaseData, clsiReport);
    
    return {
      mode: 'simple',
      primaryRecommendation: rankedOptions[0] || null,
      alternatives: rankedOptions.slice(1, 4),
      clsiTierReport: clsiReport,
      clinicalAlerts: this.generateClinicalAlerts(allPhaseData.detectedMechanisms),
      dosing: this.getDosingRecommendations(rankedOptions[0], allPhaseData.patientData),
      monitoring: this.getMonitoringRequirements(rankedOptions[0]),
      duration: this.getTreatmentDuration(rankedOptions[0], allPhaseData.infectionSite)
    };
  }

  /**
   * Generate Advanced Mode Therapeutic Comparison
   */
  async generateAdvancedComparison(viableOptions, allPhaseData) {
    try {
      // Handle case where no viable options exist (MDR organism)
      if (viableOptions.length === 0) {
        console.log('⚠️ No viable options - generating MDR recommendations');
        return this.generateMDRRecommendations(allPhaseData);
      }

      // Convert viable options to the format expected by comparator
      const interpretations = {};
      viableOptions.forEach(option => {
        interpretations[option.antibiotic] = option.interpretation;
      });

      return await this.comparatorEngine.generateTherapeuticComparison({
        organism: allPhaseData.organism,
        infectionSite: allPhaseData.infectionSite,
        patientData: allPhaseData.patientData,
        interpretations: interpretations,
        resistanceAnalysis: allPhaseData.detectedMechanisms,
        mode: 'advanced'
      });
    } catch (error) {
      console.error('Advanced comparison failed:', error);
      
      // Handle case where no viable options exist in fallback
      if (viableOptions.length === 0) {
        return this.generateMDRRecommendations(allPhaseData);
      }
      
      // Fallback to simple structured results
      return {
        strategies: viableOptions.map((option, index) => ({
          primary: option.antibiotic,
          agents: [option.antibiotic],
          type: 'single_agent',
          recommendation: index === 0 ? 'preferred' : 'alternative',
          totalScore: 80 - (index * 10),
          scores: {
            efficacy: 80 - (index * 5),
            safety: 75,
            stewardship: 70,
            pharmacology: 80
          },
          rationale: `${option.interpretation.interpretation} by CLSI standards`
        })),
        metadata: {
          totalOptions: viableOptions.length,
          preferredOptions: 1,
          analysisDate: new Date().toISOString()
        },
        recommendations: {
          firstLine: viableOptions.slice(0, 2).map(option => ({
            agents: [option.antibiotic],
            totalScore: 80
          })),
          alternatives: viableOptions.slice(2, 4).map(option => ({
            agents: [option.antibiotic],
            totalScore: 70
          }))
        }
      };
    }
  }

  /**
   * Generate comprehensive clinical summary
   */
  generateClinicalSummary(phase1, phase2, phase3, phase4) {
    return {
      organism: phase1.organism,
      site: phase1.infectionSite,
      resistanceMechanisms: phase3.detectedMechanisms.detectedPatterns.map(p => p.type),
      keyFindings: [
        ...phase2.warnings.map(w => w.message),
        ...phase3.interpretationChanges.map(c => `${c.antibiotic}: ${c.oldResult} → ${c.newResult} (${c.reason})`)
      ],
      recommendation: phase4.mode === 'simple' ? phase4.primaryRecommendation : phase4.preferredStrategy,
      clinicalPearls: this.extractClinicalPearls(phase1, phase2, phase3, phase4)
    };
  }

  /**
   * Generate educational content for learning
   */
  generateEducationalContent(phase1, phase2, phase3, phase4) {
    return {
      intrinsicResistanceExplanation: this.explainIntrinsicResistance(phase1.intrinsicResistance),
      mechanismExplanations: this.explainDetectedMechanisms(phase3.detectedMechanisms),
      clinicalReasoningSteps: this.explainReasoningSteps(phase1, phase2, phase3, phase4),
      literatureReferences: this.generateReferences(phase1.organism, phase3.detectedMechanisms),
      similarCases: this.findSimilarCases(phase1.organism, phase3.detectedMechanisms)
    };
  }

  // ============ HELPER METHODS ============

  getSiteSpecificConsiderations(infectionSite) {
    const considerations = {
      'CNS_meningitis': {
        penetrationRequired: 'CNS_critical',
        bactericidalRequired: true,
        dosing: 'high_dose',
        notes: 'Blood-brain barrier penetration essential'
      },
      'GU_UTI_uncomplicated': {
        penetrationRequired: 'urinary_specific', 
        bactericidalRequired: false,
        dosing: 'standard',
        notes: 'Urinary concentration more important than serum'
      },
      'BS_bacteremia': {
        penetrationRequired: 'systemic',
        bactericidalRequired: true,
        dosing: 'aggressive',
        notes: 'Early adequate therapy critical'
      }
    };
    
    return considerations[infectionSite] || considerations.default;
  }

  generateInitialAntibioticPanel(organism, intrinsicResistance) {
    // Get standard panel based on organism category
    const standardPanel = this.getStandardAntibioticPanel(organism);
    
    // Filter out intrinsically resistant antibiotics
    return standardPanel.filter(antibiotic => !intrinsicResistance.includes(antibiotic));
  }

  /**
   * Get standard antibiotic panel based on organism category
   */
  getStandardAntibioticPanel(organism) {
    // Map organism to CLSI category
    const clsiCategory = this.clsiEngine.mapOrganismToCLSICategory(organism);
    
    // Define standard panels by CLSI category
    const standardPanels = {
      'enterobacterales': [
        'ampicillin', 'ampicillin-sulbactam', 'piperacillin-tazobactam', 
        'cefazolin', 'ceftriaxone', 'ceftazidime', 'cefepime',
        'ertapenem', 'imipenem', 'meropenem',
        'gentamicin', 'tobramycin', 'amikacin',
        'ciprofloxacin', 'levofloxacin',
        'trimethoprim-sulfamethoxazole', 'nitrofurantoin'
      ],
      'staphylococcus': [
        'penicillin', 'oxacillin', 'ampicillin',
        'cefazolin', 'ceftriaxone',
        'gentamicin', 'clindamycin', 'erythromycin',
        'ciprofloxacin', 'levofloxacin',
        'trimethoprim-sulfamethoxazole', 'tetracycline',
        'vancomycin', 'linezolid', 'daptomycin'
      ],
      'enterococcus': [
        'penicillin', 'ampicillin', 'vancomycin',
        'gentamicin', 'streptomycin',
        'ciprofloxacin', 'levofloxacin',
        'tetracycline', 'chloramphenicol',
        'linezolid', 'daptomycin'
      ],
      'streptococcus': [
        'penicillin', 'ampicillin',
        'ceftriaxone', 'cefotaxime',
        'vancomycin', 'erythromycin', 'clindamycin',
        'levofloxacin', 'moxifloxacin',
        'trimethoprim-sulfamethoxazole'
      ],
      'pseudomonas': [
        'piperacillin', 'piperacillin-tazobactam',
        'ceftazidime', 'cefepime', 'aztreonam',
        'imipenem', 'meropenem', 'doripenem',
        'gentamicin', 'tobramycin', 'amikacin',
        'ciprofloxacin', 'levofloxacin',
        'colistin'
      ],
      'acinetobacter': [
        'ampicillin-sulbactam', 'piperacillin-tazobactam',
        'ceftazidime', 'cefepime',
        'imipenem', 'meropenem', 'doripenem',
        'gentamicin', 'tobramycin', 'amikacin',
        'ciprofloxacin', 'levofloxacin',
        'trimethoprim-sulfamethoxazole',
        'tigecycline', 'colistin'
      ],
      'haemophilus': [
        'ampicillin', 'amoxicillin-clavulanate',
        'ceftriaxone', 'cefotaxime', 'cefuroxime',
        'azithromycin', 'clarithromycin',
        'ciprofloxacin', 'levofloxacin',
        'trimethoprim-sulfamethoxazole',
        'tetracycline', 'chloramphenicol'
      ],
      'other_non_enterobacterales': [
        'ampicillin', 'amoxicillin-clavulanate',
        'ceftriaxone', 'ceftazidime',
        'imipenem', 'meropenem',
        'gentamicin', 'tobramycin',
        'ciprofloxacin', 'levofloxacin',
        'trimethoprim-sulfamethoxazole',
        'tetracycline', 'doxycycline'
      ]
    };
    
    // Return appropriate panel or default to enterobacterales
    return standardPanels[clsiCategory] || standardPanels['enterobacterales'];
  }

  checkClinicalOverrides(organism, antibiotic, interpretation, infectionSite) {
    // Known clinical failures despite in vitro susceptibility
    const overrides = {
      'Daptomycin': {
        'RESP_pneumonia': 'Clinically ineffective due to pulmonary surfactant inactivation'
      },
      'Piperacillin-Tazobactam': {
        'BS_bacteremia': 'Risk of treatment failure in E. coli bacteremia despite susceptibility'
      }
    };
    
    if (overrides[antibiotic] && overrides[antibiotic][infectionSite] && interpretation.interpretation === 'S') {
      return {
        originalInterpretation: interpretation,
        overriddenInterpretation: 'Clinically Ineffective',
        reason: overrides[antibiotic][infectionSite],
        warning: {
          level: 'high',
          message: `${antibiotic}: ${overrides[antibiotic][infectionSite]}`
        }
      };
    }
    
    return null;
  }

  extractViableOptions(finalInterpretations) {
    console.log('🔍 Extracting viable options from finalInterpretations:', finalInterpretations);
    
    const viableOptions = Object.entries(finalInterpretations)
      .filter(([antibiotic, interpretation]) => 
        interpretation.interpretation === 'S' || interpretation.interpretation === 'I'
      )
      .map(([antibiotic, interpretation]) => ({
        antibiotic: antibiotic,
        interpretation: interpretation,
        micValue: interpretation.micValue,
        confidence: interpretation.confidence
      }));
    
    console.log('🎯 Viable options found:', viableOptions);
    console.log('🎯 Number of viable options:', viableOptions.length);
    
    return viableOptions;
  }

  /**
   * Generate recommendations for MDR organisms with no viable options
   */
  generateMDRRecommendations(allPhaseData) {
    const mdrStrategies = [
      {
        primary: 'Infectious Disease Consultation',
        agents: ['ID Consult Required'],
        type: 'consultation',
        recommendation: 'preferred',
        totalScore: 95,
        scores: {
          efficacy: 90,
          safety: 95,
          stewardship: 100,
          pharmacology: 95
        },
        rationale: 'No standard therapies effective - specialist guidance required',
        keyBenefits: ['Expert resistance interpretation', 'Alternative agent selection', 'Combination therapy guidance']
      },
      {
        primary: 'Consider Combination Therapy',
        agents: ['Multiple Agents'],
        type: 'combination',
        recommendation: 'alternative',
        totalScore: 75,
        scores: {
          efficacy: 85,
          safety: 60,
          stewardship: 70,
          pharmacology: 85
        },
        rationale: 'Synergistic combinations may overcome resistance',
        keyBenefits: ['Potential synergy', 'Resistance suppression', 'Broader coverage']
      },
      {
        primary: 'Repeat Susceptibility Testing',
        agents: ['Extended Panel'],
        type: 'diagnostic',
        recommendation: 'consider',
        totalScore: 70,
        scores: {
          efficacy: 80,
          safety: 90,
          stewardship: 80,
          pharmacology: 30
        },
        rationale: 'Extended testing may identify viable options',
        keyBenefits: ['Additional agents tested', 'Molecular resistance profiling', 'Treatment options expansion']
      }
    ];

    return {
      strategies: mdrStrategies,
      metadata: {
        analysisType: 'mdr_scenario',
        totalOptions: 0,
        mdrDetected: true,
        analysisDate: new Date().toISOString(),
        clinicalAlert: 'MULTIDRUG RESISTANT ORGANISM - SPECIALIST CONSULTATION RECOMMENDED'
      },
      recommendations: {
        firstLine: [mdrStrategies[0]],
        alternatives: mdrStrategies.slice(1),
        durationGuidance: 'Duration depends on specialist recommendations and clinical response',
        clinicalNotes: [
          'No standard therapies show in vitro activity',
          'Consider extended susceptibility panel',
          'Infectious disease consultation strongly recommended',
          'Source control may be critical for treatment success'
        ]
      }
    };
  }

  generateFallbackRecommendations(organism, infectionSite) {
    return {
      message: 'Unable to complete advanced interpretation. Providing basic guidance.',
      recommendations: [
        'Consult infectious disease specialist',
        'Consider broad-spectrum empiric therapy',
        'Obtain additional susceptibility testing'
      ]
    };
  }

  /**
   * Filter susceptible agents from interpretations
   */
  filterSusceptibleAgents(interpretations) {
    return Object.entries(interpretations)
      .filter(([antibiotic, result]) => result.interpretation === 'S')
      .map(([antibiotic, result]) => antibiotic);
  }

  /**
   * Analyze resistant pattern from interpretations
   */
  analyzeResistantPattern(interpretations) {
    const resistant = Object.entries(interpretations)
      .filter(([antibiotic, result]) => result.interpretation === 'R')
      .map(([antibiotic, result]) => antibiotic);
      
    return {
      resistantAntibiotics: resistant,
      resistancePercentage: (resistant.length / Object.keys(interpretations).length) * 100,
      isMultidrugResistant: resistant.length >= 3
    };
  }

  /**
   * Generate confirmation tests for detected mechanisms
   */
  generateConfirmationTests(detectedPatterns) {
    const tests = [];
    
    for (const pattern of detectedPatterns) {
      switch (pattern.type) {
        case 'esbl':
          tests.push({
            test: 'ESBL Phenotypic Confirmation',
            method: 'Clavulanate enhancement test',
            indication: 'Confirm ESBL production'
          });
          break;
        case 'ampc':
          tests.push({
            test: 'AmpC Detection',
            method: 'Boronic acid inhibition test',
            indication: 'Differentiate AmpC from ESBL'
          });
          break;
        case 'carbapenemase':
          tests.push({
            test: 'Carbapenemase Detection',
            method: 'Modified Hodge Test or PCR',
            indication: 'Confirm carbapenemase production'
          });
          break;
        case 'mrsa':
          tests.push({
            test: 'mecA Gene Detection',
            method: 'PCR or latex agglutination',
            indication: 'Confirm methicillin resistance'
          });
          break;
      }
    }
    
    return tests;
  }

  /**
   * Generate mechanism education content
   */
  generateMechanismEducation(detectedPatterns) {
    const education = [];
    
    for (const pattern of detectedPatterns) {
      education.push({
        mechanism: pattern.type,
        explanation: this.getMechanismExplanation(pattern.type),
        clinicalImpact: this.getMechanismClinicalImpact(pattern.type)
      });
    }
    
    return education;
  }

  getMechanismExplanation(mechanismType) {
    const explanations = {
      esbl: 'Extended-spectrum beta-lactamases are enzymes that destroy most penicillins and cephalosporins',
      ampc: 'AmpC beta-lactamases are inducible enzymes that can be turned on during antibiotic therapy',
      carbapenemase: 'Carbapenemases destroy our most powerful antibiotics including carbapenems',
      mrsa: 'MRSA has altered penicillin-binding proteins that make all beta-lactams ineffective'
    };
    
    return explanations[mechanismType] || 'Unknown resistance mechanism';
  }

  getMechanismClinicalImpact(mechanismType) {
    const impacts = {
      esbl: 'Use carbapenems for serious infections, avoid cephalosporins',
      ampc: 'Prefer cefepime over 3rd generation cephalosporins',
      carbapenemase: 'Last-resort therapy required, consider combination treatment',
      mrsa: 'Use anti-MRSA agents like vancomycin, linezolid, or daptomycin'
    };
    
    return impacts[mechanismType] || 'Consult infectious disease specialist';
  }

  /**
   * Rank options by simple criteria for simple mode
   */
  /**
   * Generate CLSI tier-based recommendations
   */
  generateCLSITierRecommendations(viableOptions, allPhaseData) {
    try {
      // Convert viable options to MIC format for CLSI engine
      const micResults = {};
      viableOptions.forEach(option => {
        micResults[option.antibiotic] = option.interpretation.mic || '≤1';
      });

      // Clinical context for stewardship scoring
      const clinicalContext = {
        infection_site: this.mapInfectionSite(allPhaseData.infectionSite),
        severe_infection: allPhaseData.patientData?.severity === 'severe',
        patient_factors: allPhaseData.patientData
      };

      // Generate comprehensive CLSI report
      const clsiReport = this.clsiReportingEngine.generateAntibiogramReport(
        allPhaseData.organism,
        micResults,
        clinicalContext
      );

      return clsiReport;
    } catch (error) {
      console.warn('CLSI tier reporting not available, using fallback:', error.message);
      return {
        error: 'CLSI database not available',
        fallback: true,
        tier1_results: viableOptions.slice(0, 3),
        recommendations: ['Standard empiric therapy guidelines apply']
      };
    }
  }

  /**
   * Rank options using CLSI tiers and stewardship criteria
   */
  rankOptionsByTierCriteria(viableOptions, allPhaseData, clsiReport) {
    return viableOptions
      .map(option => ({
        ...option,
        score: this.calculateTierBasedScore(option, allPhaseData, clsiReport)
      }))
      .sort((a, b) => b.score - a.score);
  }

  /**
   * Calculate score using CLSI tiers and stewardship principles
   */
  calculateTierBasedScore(option, allPhaseData, clsiReport) {
    let score = 50; // Base score
    
    // Higher score for susceptible vs intermediate
    if (option.interpretation.interpretation === 'S') score += 30;
    if (option.interpretation.interpretation === 'I') score += 10;
    
    // CLSI tier-based scoring
    if (clsiReport && !clsiReport.error) {
      const tier1Results = clsiReport.tier1_results || [];
      const tier2Results = clsiReport.tier2_results || [];
      
      // Tier 1 agents get priority
      if (tier1Results.some(r => r.antibiotic === option.antibiotic)) {
        score += 25;
      }
      // Tier 2 agents get moderate priority
      else if (tier2Results.some(r => r.antibiotic === option.antibiotic)) {
        score += 15;
      }
      
      // Stewardship guidance from CLSI report
      if (clsiReport.stewardshipGuidance?.primaryRecommendations) {
        const isPrimary = clsiReport.stewardshipGuidance.primaryRecommendations.some(
          rec => rec.antibiotic === option.antibiotic && rec.priority === 'preferred'
        );
        if (isPrimary) score += 20;
      }
    } else {
      // Fallback to simple criteria when CLSI not available
      score += this.calculateFallbackScore(option, allPhaseData);
    }
    
    // Site-specific considerations
    const penetration = this.getAntibioticPenetration(option.antibiotic, allPhaseData.infectionSite);
    if (penetration === 'excellent') score += 15;
    if (penetration === 'good') score += 10;
    
    return score;
  }

  /**
   * Fallback scoring when CLSI database not available
   */
  calculateFallbackScore(option, allPhaseData) {
    let fallbackScore = 0;
    
    // Preferred antibiotics for organism
    const preferredForOrganism = this.getPreferredAntibiotics(allPhaseData.organism);
    if (preferredForOrganism.includes(option.antibiotic)) fallbackScore += 20;
    
    // Basic stewardship principles
    if (this.isNarrowSpectrum(option.antibiotic)) fallbackScore += 15;
    if (this.isFirstLine(option.antibiotic)) fallbackScore += 10;
    
    return fallbackScore;
  }

  /**
   * Map internal infection site to CLSI reporting format
   */
  mapInfectionSite(site) {
    const mapping = {
      'Urinary Tract': 'urinary_tract',
      'Respiratory Tract': 'respiratory',
      'Skin and Soft Tissue': 'skin_soft_tissue',
      'Intra-abdominal': 'intraabdominal',
      'Bloodstream': 'bloodstream',
      'CNS': 'cns'
    };
    
    return mapping[site] || 'other';
  }

  /**
   * Helper methods for antibiotic classification
   */
  isNarrowSpectrum(antibiotic) {
    const narrowSpectrum = [
      'ampicillin', 'cefazolin', 'clindamycin', 'erythromycin',
      'trimethoprim-sulfamethoxazole', 'nitrofurantoin'
    ];
    return narrowSpectrum.includes(antibiotic);
  }

  isFirstLine(antibiotic) {
    const firstLine = [
      'amoxicillin-clavulanate', 'ceftriaxone', 'ciprofloxacin',
      'trimethoprim-sulfamethoxazole', 'cephalexin'
    ];
    return firstLine.includes(antibiotic);
  }

  rankOptionsBySimpleCriteria(viableOptions, allPhaseData) {
    return viableOptions
      .map(option => ({
        ...option,
        score: this.calculateSimpleScore(option, allPhaseData)
      }))
      .sort((a, b) => b.score - a.score);
  }

  calculateSimpleScore(option, allPhaseData) {
    let score = 50; // Base score
    
    // Higher score for susceptible vs intermediate
    if (option.interpretation.interpretation === 'S') score += 30;
    if (option.interpretation.interpretation === 'I') score += 10;
    
    // Preferred antibiotics for organism
    const preferredForOrganism = this.getPreferredAntibiotics(allPhaseData.organism);
    if (preferredForOrganism.includes(option.antibiotic)) score += 20;
    
    // Site-specific considerations
    const penetration = this.getAntibioticPenetration(option.antibiotic, allPhaseData.infectionSite);
    if (penetration === 'excellent') score += 15;
    if (penetration === 'good') score += 10;
    
    return score;
  }

  getPreferredAntibiotics(organism) {
    // Simplified preferences by organism type
    if (organism?.toLowerCase().includes('escherichia')) {
      return ['ciprofloxacin', 'trimethoprim-sulfamethoxazole', 'nitrofurantoin'];
    }
    return [];
  }

  getAntibioticPenetration(antibiotic, infectionSite) {
    // Simplified penetration scoring
    const penetrationMap = {
      'ciprofloxacin': { 'GU_UTI_uncomplicated': 'excellent' },
      'nitrofurantoin': { 'GU_UTI_uncomplicated': 'excellent' },
      'trimethoprim-sulfamethoxazole': { 'GU_UTI_uncomplicated': 'good' }
    };
    
    return penetrationMap[antibiotic]?.[infectionSite] || 'moderate';
  }

  /**
   * Generate educational content for Phase 1
   */
  generatePhase1Education(organism, intrinsicResistance) {
    return {
      organismProfile: `Understanding ${organism} characteristics and expected resistance patterns`,
      intrinsicResistanceExplanation: intrinsicResistance.length > 0 ? 
        `This organism is naturally resistant to: ${intrinsicResistance.join(', ')}` :
        'No significant intrinsic resistance patterns for this organism',
      keyLearningPoints: [
        'Organism identification guides antibiotic panel selection',
        'Intrinsic resistance prevents clinical errors',
        'Site-specific factors affect treatment choices'
      ]
    };
  }

  /**
   * Get dosing recommendations
   */
  getDosingRecommendations(option, patientData) {
    if (!option) return null;
    
    return {
      antibiotic: option.antibiotic,
      standardDose: 'Standard dosing per guidelines',
      renalAdjustment: patientData.creatinine > 2 ? 'Consider dose reduction' : 'No adjustment needed',
      hepaticAdjustment: patientData.hasHepaticDisease ? 'Monitor closely' : 'No adjustment needed'
    };
  }

  /**
   * Get monitoring requirements
   */
  getMonitoringRequirements(option) {
    if (!option) return [];
    
    const monitoring = {
      'vancomycin': ['Trough levels', 'Renal function'],
      'gentamicin': ['Peak/trough levels', 'Renal function', 'Hearing'],
      'daptomycin': ['CPK levels'],
      'linezolid': ['CBC', 'Visual changes']
    };
    
    return monitoring[option.antibiotic] || ['Standard monitoring'];
  }

  /**
   * Get treatment duration
   */
  getTreatmentDuration(option, infectionSite) {
    if (!option) return 'Consult guidelines';
    
    const durations = {
      'GU_UTI_uncomplicated': '3-5 days',
      'GU_UTI_complicated': '7-14 days',
      'RESP_CAP': '7-10 days',
      'BS_bacteremia': '14 days'
    };
    
    return durations[infectionSite] || '7-14 days';
  }

  /**
   * Generate clinical alerts
   */
  generateClinicalAlerts(detectedMechanisms) {
    const alerts = [];
    
    if (detectedMechanisms?.detectedPatterns) {
      for (const pattern of detectedMechanisms.detectedPatterns) {
        alerts.push({
          level: pattern.confidence === 'high' ? 'high' : 'medium',
          message: `${pattern.type.toUpperCase()} detected - ${this.getMechanismClinicalImpact(pattern.type)}`
        });
      }
    }
    
    return alerts;
  }

  /**
   * Extract clinical pearls from analysis phases
   */
  extractClinicalPearls(phase1, phase2, phase3, phase4) {
    const pearls = [];
    
    // Resistance mechanism pearls
    if (phase3.detectedMechanisms?.detectedPatterns) {
      for (const pattern of phase3.detectedMechanisms.detectedPatterns) {
        pearls.push(`${pattern.type.toUpperCase()} mechanism detected: ${this.getMechanismClinicalImpact(pattern.type)}`);
      }
    }
    
    // Interpretation change pearls
    if (phase3.interpretationChanges && phase3.interpretationChanges.length > 0) {
      pearls.push(`Expert interpretation modified ${phase3.interpretationChanges.length} results based on resistance patterns`);
    }
    
    // Site-specific pearls
    if (phase1.siteConsiderations) {
      if (phase1.siteConsiderations.bactericidalRequired) {
        pearls.push('Bactericidal therapy preferred for this infection site');
      }
      if (phase1.siteConsiderations.penetrationRequired === 'CNS_critical') {
        pearls.push('Blood-brain barrier penetration is critical - verify CNS activity');
      }
    }
    
    // Warning pearls
    if (phase2.warnings && phase2.warnings.length > 0) {
      pearls.push(`Clinical alerts identified: Consider alternative agents despite in vitro activity`);
    }
    
    // Treatment strategy pearls
    if (phase4) {
      if (phase4.mode === 'combination' && phase4.combinationTherapy) {
        pearls.push(`Combination therapy recommended for enhanced coverage or synergy`);
      }
      if (phase4.stewardshipGuidance) {
        pearls.push(`Stewardship consideration: ${phase4.stewardshipGuidance}`);
      }
    }
    
    // Default pearl if none found
    if (pearls.length === 0) {
      pearls.push('Standard CLSI interpretation guidelines applied');
    }
    
    return pearls;
  }

  /**
   * Check for paradoxical results in interpretations
   */
  checkParadoxicalResults(organism, antibiotic, interpretation, interpretations) {
    // Simple paradox detection - can be expanded
    if (interpretation.interpretation === 'S' && antibiotic.includes('ampicillin')) {
      // Check if related beta-lactams are resistant
      const relatedResistant = Object.entries(interpretations).some(([drug, result]) => 
        drug.includes('cefazolin') && result.interpretation === 'R'
      );
      
      if (relatedResistant) {
        return {
          level: 'medium',
          message: `Paradoxical result: ${antibiotic} susceptible but related beta-lactams resistant`
        };
      }
    }
    
    return null;
  }

  /**
   * Apply mechanism-based overrides to interpretations
   */
  applyMechanismOverrides(originalInterpretations, detectedMechanisms) {
    const finalInterpretations = { ...originalInterpretations };
    
    // Apply overrides based on detected mechanisms
    for (const mechanism of detectedMechanisms || []) {
      if (mechanism.type === 'esbl') {
        // Override cephalosporin results for ESBL
        Object.keys(finalInterpretations).forEach(antibiotic => {
          if (antibiotic.includes('ceftriaxone') || antibiotic.includes('ceftazidime')) {
            if (finalInterpretations[antibiotic].interpretation === 'S') {
              finalInterpretations[antibiotic] = {
                ...finalInterpretations[antibiotic],
                interpretation: 'R',
                overrideReason: 'ESBL production makes cephalosporins clinically ineffective'
              };
            }
          }
        });
      }
    }
    
    return finalInterpretations;
  }

  /**
   * Calculate changes made by mechanism detection
   */
  calculateInterpretationChanges(originalInterpretations, finalInterpretations) {
    const changes = [];
    
    Object.keys(originalInterpretations).forEach(antibiotic => {
      const original = originalInterpretations[antibiotic];
      const final = finalInterpretations[antibiotic];
      
      if (original.interpretation !== final.interpretation) {
        changes.push({
          antibiotic: antibiotic,
          oldResult: original.interpretation,
          newResult: final.interpretation,
          reason: final.overrideReason || 'Mechanism-based override'
        });
      }
    });
    
    return changes;
  }

  /**
   * Explain intrinsic resistance patterns
   */
  explainIntrinsicResistance(intrinsicResistance) {
    if (!intrinsicResistance || intrinsicResistance.length === 0) {
      return 'No significant intrinsic resistance patterns identified';
    }
    
    return `This organism naturally resists: ${intrinsicResistance.join(', ')}. These agents should not be tested or reported.`;
  }

  /**
   * Explain detected resistance mechanisms
   */
  explainDetectedMechanisms(detectedMechanisms) {
    if (!detectedMechanisms?.detectedPatterns) {
      return 'No specific resistance mechanisms detected';
    }
    
    return detectedMechanisms.detectedPatterns.map(pattern => ({
      mechanism: pattern.type,
      explanation: this.getMechanismExplanation(pattern.type),
      clinicalImpact: this.getMechanismClinicalImpact(pattern.type)
    }));
  }

  /**
   * Explain clinical reasoning steps
   */
  explainReasoningSteps(phase1, phase2, phase3) {
    const steps = [];
    
    steps.push({
      step: 1,
      title: 'Organism Identification',
      description: `Identified ${phase1.organism} with known characteristics`
    });
    
    steps.push({
      step: 2,
      title: 'CLSI Interpretation',
      description: `Applied CLSI breakpoints for ${Object.keys(phase2.interpretations).length} antibiotics`
    });
    
    if (phase3.detectedMechanisms?.detectedPatterns?.length > 0) {
      steps.push({
        step: 3,
        title: 'Resistance Mechanism Detection',
        description: `Detected ${phase3.detectedMechanisms.detectedPatterns.length} resistance mechanism(s)`
      });
    }
    
    steps.push({
      step: 4,
      title: 'Clinical Recommendations',
      description: 'Generated evidence-based treatment recommendations'
    });
    
    return steps;
  }

  /**
   * Generate literature references
   */
  generateReferences(organism, detectedMechanisms) {
    const references = [
      'CLSI M100-Ed34: Performance Standards for Antimicrobial Susceptibility Testing',
      'IDSA Guidelines for Antimicrobial Therapy'
    ];
    
    if (detectedMechanisms?.detectedPatterns?.length > 0) {
      references.push('Bush K, Bradford PA. Epidemiology of β-lactamase-producing pathogens. Clin Microbiol Rev. 2020');
    }
    
    return references;
  }

  /**
   * Find similar cases for educational purposes
   */
  findSimilarCases() {
    return [
      {
        case: 'Similar organism with standard susceptibility pattern',
        outcome: 'Standard therapy successful'
      },
      {
        case: 'Similar resistance pattern in clinical practice',
        outcome: 'Alternative agent required for cure'
      }
    ];
  }
}

export default MasterAntibiogramEngine;