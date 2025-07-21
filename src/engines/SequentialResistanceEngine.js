// Sequential Resistance Pattern Engine - Following Clinical Lecture Methodology
// Implements the step-by-step approach: Ampicillin → 1st Gen → 3rd Gen → Inhibitors → Carbapenems

let antimicrobialResistanceDatabase = null;

// Load database asynchronously for browser environment
const loadDatabase = async () => {
  try {
    const basePath = import.meta.env.BASE_URL || '/';
    const dbPath = basePath === '/' ? '/antimicrobial_resistance.json' : `${basePath}antimicrobial_resistance.json`;
    
    const response = await fetch(dbPath);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    antimicrobialResistanceDatabase = await response.json();
    console.log('🧬 Antimicrobial resistance database loaded for sequential analysis');
    return antimicrobialResistanceDatabase;
  } catch (error) {
    console.warn('⚠️ Could not load antimicrobial resistance database:', error.message);
    return null;
  }
};

export const CONFIDENCE_LEVELS = {
  HIGH: 'high',
  MODERATE: 'moderate', 
  LOW: 'low',
  UNCERTAIN: 'uncertain'
};

export class SequentialResistanceEngine {
  constructor() {
    this.resistanceDB = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      this.resistanceDB = await loadDatabase();
      this.isInitialized = true;
      console.log('🔬 Sequential Resistance Engine initialized with clinical methodology');
    } catch (error) {
      console.error('❌ Failed to initialize Sequential Resistance Engine:', error);
      throw error;
    }
  }

  /**
   * SEQUENTIAL ANTIBIOGRAM INTERPRETATION
   * Following the exact methodology from the clinical lecture
   */
  async analyzePattern(organism, susceptibilityPattern) {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    console.log(`🔬 SEQUENTIAL ANALYSIS for ${organism}`);
    console.log(`📋 Following clinical methodology: Ampicillin → 1st Gen → 3rd Gen → Inhibitors → Carbapenems`);
    
    const results = {
      organism,
      totalAntibiotics: Object.keys(susceptibilityPattern).length,
      detectedPatterns: [],
      warnings: [],
      overallConfidence: CONFIDENCE_LEVELS.UNCERTAIN,
      mechanismOverrides: {},
      sequentialSteps: []
    };

    try {
      // STEP 1: Always start with AMPICILLIN (the foundation)
      const step1 = this.analyzeAmpicillin(susceptibilityPattern);
      results.sequentialSteps.push(step1);
      console.log(`STEP 1 - Ampicillin: ${step1.interpretation} → ${step1.conclusion}`);

      // STEP 2: If ampicillin resistant → check 1st generation cephalosporin  
      let step2 = null;
      if (step1.interpretation === 'R') {
        step2 = this.analyze1stGenCephalosporin(susceptibilityPattern);
        results.sequentialSteps.push(step2);
        console.log(`STEP 2 - 1st Gen Ceph: ${step2.interpretation} → ${step2.conclusion}`);
      }

      // STEP 3: If 1st gen resistant → check 3rd generation cephalosporins
      let step3 = null;
      if (step2?.interpretation === 'R') {
        step3 = this.analyze3rdGenCephalosporin(susceptibilityPattern);
        results.sequentialSteps.push(step3);
        console.log(`STEP 3 - 3rd Gen Ceph: ${step3.interpretation} → ${step3.conclusion}`);
      }

      // STEP 4: If 3rd gen resistant → differentiate ESBL vs AmpC using inhibitors
      let step4 = null;
      if (step3?.interpretation === 'R') {
        step4 = this.analyzeInhibitors(susceptibilityPattern);
        results.sequentialSteps.push(step4);
        console.log(`STEP 4 - Inhibitors: ${step4.interpretation} → ${step4.conclusion}`);
      }

      // STEP 5: Check carbapenems for resistance level
      const step5 = this.analyzeCarbapenems(susceptibilityPattern);
      results.sequentialSteps.push(step5);
      console.log(`STEP 5 - Carbapenems: ${step5.interpretation} → ${step5.conclusion}`);

      // Generate final conclusions based on sequential logic
      results.detectedPatterns = this.generateSequentialConclusions(results.sequentialSteps);
      
      // Set overall confidence
      results.overallConfidence = results.detectedPatterns.length > 0 ? CONFIDENCE_LEVELS.MODERATE : CONFIDENCE_LEVELS.UNCERTAIN;

      console.log(`✅ Sequential analysis complete: ${results.detectedPatterns.length} mechanisms identified`);

      return results;

    } catch (error) {
      console.error('❌ Sequential analysis failed:', error);
      results.warnings.push({
        level: 'error',
        message: `Sequential analysis failed: ${error.message}`
      });
      return results;
    }
  }

  // STEP 1: Ampicillin Analysis (The Foundation)
  analyzeAmpicillin(susceptibilityPattern) {
    const ampResult = susceptibilityPattern['ampicillin'];
    
    if (!ampResult) {
      return {
        step: 1,
        antibiotic: 'ampicillin',
        interpretation: 'Not tested',
        conclusion: 'Cannot perform sequential analysis without ampicillin',
        mechanism: null
      };
    }

    return {
      step: 1,
      antibiotic: 'ampicillin', 
      interpretation: ampResult.interpretation,
      micValue: ampResult.micValue,
      conclusion: ampResult.interpretation === 'R' ? 
        'Penicillinase suspected → Check 1st gen cephalosporin' : 
        'No penicillinase → Wild type or other mechanisms',
      mechanism: null // Don't set mechanism yet - need more data
    };
  }

  // STEP 2: 1st Generation Cephalosporin Analysis  
  analyze1stGenCephalosporin(susceptibilityPattern) {
    // Look for cefazolin (most common 1st gen)
    const firstGenOptions = ['cefazolin', 'cephalexin', 'cefadroxil'];
    let result = null;
    let antibiotic = null;

    for (const ab of firstGenOptions) {
      if (susceptibilityPattern[ab]) {
        result = susceptibilityPattern[ab];
        antibiotic = ab;
        break;
      }
    }

    if (!result) {
      return {
        step: 2,
        antibiotic: '1st gen cephalosporin',
        interpretation: 'Not tested',
        conclusion: 'Cannot differentiate resistance mechanisms without 1st gen data',
        mechanism: null
      };
    }

    return {
      step: 2,
      antibiotic: antibiotic,
      interpretation: result.interpretation,
      micValue: result.micValue,
      conclusion: result.interpretation === 'R' ? 
        'Extended β-lactamase suspected → Check 3rd gen cephalosporins to differentiate ESBL vs AmpC' : 
        'Simple penicillinase only → Manageable with 1st gen cephalosporins',
      mechanism: null // Don't set mechanism yet - need inhibitor data to differentiate ESBL vs AmpC
    };
  }

  // STEP 3: 3rd Generation Cephalosporin Analysis
  analyze3rdGenCephalosporin(susceptibilityPattern) {
    const thirdGenOptions = ['ceftriaxone', 'ceftazidime', 'cefotaxime'];
    const resistantThirdGen = [];
    
    for (const ab of thirdGenOptions) {
      if (susceptibilityPattern[ab]?.interpretation === 'R') {
        resistantThirdGen.push(ab);
      }
    }

    const hasResistance = resistantThirdGen.length > 0;
    const allTested = thirdGenOptions.filter(ab => susceptibilityPattern[ab]).length;

    return {
      step: 3,
      antibiotic: '3rd gen cephalosporins',
      interpretation: hasResistance ? 'R' : 'S',
      resistantDrugs: resistantThirdGen,
      testedDrugs: allTested,
      conclusion: hasResistance ? 
        'ESBL or AmpC production → Use inhibitors to differentiate' : 
        'Sensitive to 3rd gen → Simple penicillinase only',
      mechanism: null // Wait for step 4 to differentiate ESBL vs AmpC
    };
  }

  // STEP 4: Inhibitor Analysis (Key Differentiation)
  analyzeInhibitors(susceptibilityPattern) {
    // Look for beta-lactamase inhibitor combinations
    const inhibitorCombos = [
      'amoxicillin-clavulanate', 
      'piperacillin-tazobactam',
      'ampicillin-sulbactam'
    ];
    
    const sensitiveInhibitors = [];
    const resistantInhibitors = [];
    
    for (const combo of inhibitorCombos) {
      if (susceptibilityPattern[combo]) {
        if (susceptibilityPattern[combo].interpretation === 'S') {
          sensitiveInhibitors.push(combo);
        } else {
          resistantInhibitors.push(combo);
        }
      }
    }

    let conclusion, mechanism;
    if (sensitiveInhibitors.length > 0) {
      conclusion = 'ESBL confirmed → Clavulanic acid synergy present (Class A β-lactamase)';
      mechanism = 'esbl';
    } else if (resistantInhibitors.length > 0) {
      conclusion = 'AmpC β-lactamase confirmed → Clavulanic acid ineffective (Class C β-lactamase)';
      mechanism = 'ampc';
    } else {
      conclusion = 'Cannot differentiate ESBL vs AmpC without inhibitor combination data';
      mechanism = null; // Cannot determine mechanism without inhibitor data
    }

    return {
      step: 4,
      antibiotic: 'inhibitor combinations',
      interpretation: sensitiveInhibitors.length > 0 ? 'S' : 'R',
      sensitiveInhibitors,
      resistantInhibitors,
      conclusion,
      mechanism
    };
  }

  // STEP 5: Carbapenem Analysis
  analyzeCarbapenems(susceptibilityPattern) {
    const carbapenems = ['meropenem', 'imipenem', 'ertapenem'];
    const resistantCarbapenems = [];
    const sensitiveCarbapenems = [];
    
    for (const carb of carbapenems) {
      if (susceptibilityPattern[carb]) {
        if (susceptibilityPattern[carb].interpretation === 'R') {
          resistantCarbapenems.push(carb);
        } else {
          sensitiveCarbapenems.push(carb);
        }
      }
    }

    const hasResistance = resistantCarbapenems.length > 0;
    let conclusion, mechanism;

    if (hasResistance) {
      conclusion = 'Carbapenemase suspected → High-level resistance';
      mechanism = 'carbapenemase';
    } else if (sensitiveCarbapenems.length > 0) {
      conclusion = 'Carbapenem sensitive → ESBL/AmpC manageable';
      mechanism = null;
    } else {
      conclusion = 'Carbapenems not tested';
      mechanism = null;
    }

    return {
      step: 5,
      antibiotic: 'carbapenems',
      interpretation: hasResistance ? 'R' : 'S',
      resistantCarbapenems,
      sensitiveCarbapenems,
      conclusion,
      mechanism
    };
  }

  // Generate final conclusions based on sequential steps
  generateSequentialConclusions(steps) {
    const mechanisms = [];
    
    // Analyze pattern for simple penicillinase
    const ampStep = steps.find(s => s.step === 1);
    const firstGenStep = steps.find(s => s.step === 2);
    const thirdGenStep = steps.find(s => s.step === 3);
    
    // Simple penicillinase detection: Ampicillin R + 1st gen S (or 3rd gen S)
    if (ampStep?.interpretation === 'R' && 
        (firstGenStep?.interpretation === 'S' || thirdGenStep?.interpretation === 'S')) {
      mechanisms.push({
        type: 'penicillinase',
        confidence: CONFIDENCE_LEVELS.HIGH,
        evidence: [
          `Step 1: ${ampStep.conclusion}`,
          firstGenStep?.interpretation === 'S' ? `Step 2: 1st gen cephalosporin sensitive` : `Step 3: 3rd gen cephalosporin sensitive`,
          'Pattern consistent with simple penicillinase (TEM-1, SHV-1)'
        ],
        clinicalImplications: [
          'Use β-lactamase inhibitor combinations (amoxicillin-clavulanate, piperacillin-tazobactam)',
          'Cephalosporins remain effective',
          'Carbapenems effective but unnecessary'
        ]
      });
    }
    
    // Extract confirmed mechanisms from definitive steps
    for (const step of steps) {
      if (step.mechanism) {
        switch (step.mechanism) {
          case 'esbl':
            mechanisms.push({
              type: 'esbl',
              confidence: CONFIDENCE_LEVELS.HIGH,
              evidence: [`Step ${step.step}: ${step.conclusion}`],
              clinicalImplications: [
                'Avoid cephalosporins and aztreonam',
                'Carbapenems preferred for serious infections',
                'Beta-lactamase inhibitor combinations may be effective'
              ]
            });
            break;
          case 'ampc':
            mechanisms.push({
              type: 'ampc', 
              confidence: CONFIDENCE_LEVELS.HIGH,
              evidence: [`Step ${step.step}: ${step.conclusion}`],
              clinicalImplications: [
                'Avoid beta-lactamase inhibitor combinations (clavulanic acid ineffective)',
                'Cefepime may be effective (4th generation)',
                'Carbapenems preferred for serious infections',
                'Consider boronic acid inhibitors (avibactam) if available'
              ]
            });
            break;
          case 'carbapenemase':
            mechanisms.push({
              type: 'carbapenemase',
              confidence: CONFIDENCE_LEVELS.HIGH,
              evidence: [`Step ${step.step}: ${step.conclusion}`],
              clinicalImplications: [
                'Extremely limited treatment options',
                'Consider ceftazidime-avibactam, cefiderocol, or polymyxins',
                'Infectious disease consultation required',
                'Combination therapy may be necessary'
              ]
            });
            break;
        }
      }
    }

    return mechanisms;
  }
}