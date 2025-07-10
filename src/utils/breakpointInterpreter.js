// src/utils/breakpointInterpreter.js
// --- CLSI Breakpoint Interpretation Engine ---
// Comprehensive MIC interpretation system with clinical context integration
// Supports CLSI M100 standards with organism-specific breakpoints

// CLSI M100 breakpoint database (key examples - expandable)
export const BREAKPOINTS = {
  // Enterobacterales breakpoints
  enterobacterales: {
    'Ampicillin': { S: '≤8', I: '16', R: '≥32' },
    'Amoxicillin-Clavulanate': { S: '≤8/4', I: '16/8', R: '≥32/16' },
    'Piperacillin-Tazobactam': { S: '≤16/4', I: '32/4', R: '≥128/4' },
    'Cefazolin': { S: '≤2', I: '4', R: '≥8' },
    'Ceftriaxone': { S: '≤1', I: '2', R: '≥4' },
    'Ceftazidime': { S: '≤4', I: '8', R: '≥16' },
    'Cefepime': { S: '≤2', I: '4-8', R: '≥16' },
    'Ertapenem': { S: '≤0.5', I: '1', R: '≥2' },
    'Imipenem': { S: '≤1', I: '2', R: '≥4' },
    'Meropenem': { S: '≤1', I: '2', R: '≥4' },
    'Ciprofloxacin': { S: '≤0.25', I: '0.5', R: '≥1' },
    'Levofloxacin': { S: '≤0.5', I: '1', R: '≥2' },
    'Gentamicin': { S: '≤4', I: '8', R: '≥16' },
    'Tobramycin': { S: '≤4', I: '8', R: '≥16' },
    'Amikacin': { S: '≤16', I: '32', R: '≥64' },
    'Trimethoprim-Sulfamethoxazole': { S: '≤2/38', I: '4/76', R: '≥4/76' },
    'Tetracycline': { S: '≤4', I: '8', R: '≥16' },
    'Tigecycline': { S: '≤2', I: '4', R: '≥8' }
  },

  // Staphylococcus aureus breakpoints
  saureus: {
    'Penicillin': { S: '≤0.12', I: null, R: '≥0.25' },
    'Oxacillin': { S: '≤2', I: null, R: '≥4' },
    'Cefazolin': { S: '≤8', I: '16', R: '≥32' },
    'Ceftriaxone': { S: '≤8', I: '16-32', R: '≥64' },
    'Clindamycin': { S: '≤0.5', I: '1-2', R: '≥4' },
    'Erythromycin': { S: '≤0.5', I: '1-4', R: '≥8' },
    'Vancomycin': { S: '≤2', I: '4-8', R: '≥16' },
    'Teicoplanin': { S: '≤8', I: '16', R: '≥32' },
    'Linezolid': { S: '≤4', I: null, R: '≥8' },
    'Daptomycin': { S: '≤1', I: null, R: '≥1' },
    'Ciprofloxacin': { S: '≤1', I: '2', R: '≥4' },
    'Levofloxacin': { S: '≤2', I: '4', R: '≥8' },
    'Gentamicin': { S: '≤4', I: '8', R: '≥16' },
    'Rifampin': { S: '≤1', I: '2', R: '≥4' },
    'Trimethoprim-Sulfamethoxazole': { S: '≤2/38', I: null, R: '≥4/76' },
    'Tetracycline': { S: '≤4', I: '8', R: '≥16' }
  },

  // Enterococcus breakpoints  
  enterococcus: {
    'Ampicillin': { S: '≤8', I: null, R: '≥16' },
    'Penicillin': { S: '≤8', I: null, R: '≥16' },
    'Vancomycin': { S: '≤4', I: '8-16', R: '≥32' },
    'Teicoplanin': { S: '≤8', I: '16', R: '≥32' },
    'Linezolid': { S: '≤2', I: '4', R: '≥8' },
    'Daptomycin': { S: '≤4', I: null, R: '≥4' },
    'Chloramphenicol': { S: '≤8', I: '16', R: '≥32' },
    'Ciprofloxacin': { S: '≤1', I: '2', R: '≥4' },
    'Levofloxacin': { S: '≤2', I: '4', R: '≥8' },
    'Erythromycin': { S: '≤0.5', I: '1-4', R: '≥8' },
    'Tetracycline': { S: '≤4', I: '8', R: '≥16' },
    'Nitrofurantoin': { S: '≤32', I: '64', R: '≥128' }
  },

  // Pseudomonas aeruginosa breakpoints
  paeruginosa: {
    'Piperacillin': { S: '≤16', I: '32-64', R: '≥128' },
    'Piperacillin-Tazobactam': { S: '≤16/4', I: '32/4-64/4', R: '≥128/4' },
    'Ceftazidime': { S: '≤8', I: '16', R: '≥32' },
    'Cefepime': { S: '≤8', I: '16', R: '≥32' },
    'Aztreonam': { S: '≤8', I: '16', R: '≥32' },
    'Imipenem': { S: '≤2', I: '4', R: '≥8' },
    'Meropenem': { S: '≤2', I: '4', R: '≥8' },
    'Doripenem': { S: '≤1', I: '2', R: '≥4' },
    'Ciprofloxacin': { S: '≤1', I: '2', R: '≥4' },
    'Levofloxacin': { S: '≤2', I: '4', R: '≥8' },
    'Gentamicin': { S: '≤4', I: '8', R: '≥16' },
    'Tobramycin': { S: '≤4', I: '8', R: '≥16' },
    'Amikacin': { S: '≤16', I: '32', R: '≥64' },
    'Polymyxin B': { S: '≤2', I: '4', R: '≥4' },
    'Colistin': { S: '≤2', I: null, R: '≥4' }
  }
};

// Site-specific breakpoint modifications
export const SITE_SPECIFIC_BREAKPOINTS = {
  meningitis: {
    'Ceftriaxone': {
      enterobacterales: { S: '≤0.5', I: '1', R: '≥2' },
      saureus: { S: '≤0.5', I: '1', R: '≥2' }
    },
    'Meropenem': {
      enterobacterales: { S: '≤0.25', I: '0.5', R: '≥1' }
    },
    'Vancomycin': {
      saureus: { S: '≤1', I: '2', R: '≥4' }
    }
  },
  endocarditis: {
    'Gentamicin': {
      enterococcus: { S: '≤500', I: null, R: '>500' } // High-level resistance
    }
  }
};

// Quality control ranges for verification
export const QC_RANGES = {
  'E. coli ATCC 25922': {
    'Ampicillin': '2-8',
    'Ciprofloxacin': '0.004-0.015',
    'Gentamicin': '0.25-1'
  },
  'S. aureus ATCC 29213': {
    'Oxacillin': '0.12-0.5',
    'Vancomycin': '1-4',
    'Ciprofloxacin': '0.12-0.5'
  }
};

/**
 * CLSI Breakpoint Interpretation Engine
 */
export class BreakpointInterpreter {
  
  /**
   * Interpret MIC value according to CLSI standards
   * @param {string} organism - Bacterial organism identifier
   * @param {string} antibiotic - Antibiotic name
   * @param {number|string} mic - MIC value
   * @param {string} site - Infection site (optional)
   * @returns {Object} Interpretation result
   */
  interpretMIC(organism, antibiotic, mic, site = null) {
    const result = {
      organism,
      antibiotic,
      mic,
      interpretation: 'NA',
      breakpoints: null,
      warnings: [],
      notes: [],
      confidence: 'high'
    };

    // Get appropriate breakpoints
    const breakpoints = this.getBreakpoints(organism, antibiotic, site);
    if (!breakpoints) {
      result.warnings.push('No CLSI breakpoints available');
      result.confidence = 'low';
      return result;
    }

    result.breakpoints = breakpoints;

    // Convert MIC to numeric for comparison
    const numericMIC = this.parseNumericMIC(mic);
    if (numericMIC === null) {
      result.warnings.push('Invalid MIC format');
      result.confidence = 'low';
      return result;
    }

    // Apply interpretation logic
    result.interpretation = this.applyBreakpointLogic(numericMIC, breakpoints);
    
    // Add clinical context
    result.notes = this.getClinicalNotes(organism, antibiotic, result.interpretation, site);
    
    // Quality control check
    this.performQualityCheck(organism, antibiotic, numericMIC, result);

    return result;
  }

  /**
   * Get appropriate breakpoints for organism/antibiotic combination
   */
  getBreakpoints(organism, antibiotic, site) {
    // Map organism IDs to breakpoint categories
    const organismMap = {
      'saureus': 'saureus',
      'ecoli': 'enterobacterales',
      'kpneumoniae': 'enterobacterales',
      'enterobacter': 'enterobacterales',
      'paeruginosa': 'paeruginosa',
      'enterococcus': 'enterococcus'
    };

    const category = organismMap[organism];
    if (!category || !BREAKPOINTS[category]) {
      return null;
    }

    // Check for site-specific modifications
    if (site && SITE_SPECIFIC_BREAKPOINTS[site]?.[antibiotic]?.[category]) {
      return SITE_SPECIFIC_BREAKPOINTS[site][antibiotic][category];
    }

    return BREAKPOINTS[category][antibiotic];
  }

  /**
   * Parse MIC value to numeric format
   */
  parseNumericMIC(mic) {
    if (typeof mic === 'number') return mic;
    
    const micStr = String(mic).trim();
    
    // Handle comparison operators
    if (micStr.startsWith('≤') || micStr.startsWith('<=')) {
      return parseFloat(micStr.substring(1));
    }
    if (micStr.startsWith('≥') || micStr.startsWith('>=')) {
      return parseFloat(micStr.substring(1));
    }
    if (micStr.startsWith('>')) {
      return parseFloat(micStr.substring(1)) * 2; // Conservative interpretation
    }
    if (micStr.startsWith('<')) {
      return parseFloat(micStr.substring(1)) / 2; // Conservative interpretation
    }

    // Handle combination drugs (e.g., "8/4")
    if (micStr.includes('/')) {
      return parseFloat(micStr.split('/')[0]);
    }

    // Direct numeric parsing
    const parsed = parseFloat(micStr);
    return isNaN(parsed) ? null : parsed;
  }

  /**
   * Apply breakpoint interpretation logic
   */
  applyBreakpointLogic(mic, breakpoints) {
    // Parse breakpoint thresholds
    const sThreshold = this.parseNumericMIC(breakpoints.S);
    const rThreshold = this.parseNumericMIC(breakpoints.R);
    
    if (mic <= sThreshold) {
      return 'S';
    }
    
    if (mic >= rThreshold) {
      return 'R';
    }
    
    // Intermediate category (if exists)
    if (breakpoints.I) {
      return 'I';
    }
    
    // No intermediate category - unusual case
    return 'I';
  }

  /**
   * Generate clinical interpretation notes
   */
  getClinicalNotes(organism, antibiotic, interpretation, site) {
    const notes = [];

    // Organism-specific notes
    if (organism === 'saureus' && antibiotic === 'Oxacillin') {
      if (interpretation === 'R') {
        notes.push('MRSA - avoid all beta-lactam antibiotics');
      } else {
        notes.push('MSSA - beta-lactams preferred over vancomycin');
      }
    }

    if (organism === 'enterococcus' && antibiotic === 'Vancomycin') {
      if (interpretation === 'R') {
        notes.push('VRE - contact infection control');
      }
    }

    // Site-specific considerations
    if (site === 'meningitis') {
      if (interpretation === 'I') {
        notes.push('Intermediate result for CNS infection - consider alternative');
      }
    }

    // Stewardship considerations
    if (antibiotic.includes('Carbapenem') && interpretation === 'S') {
      notes.push('Carbapenem-sensitive - consider de-escalation to narrower spectrum');
    }

    return notes;
  }

  /**
   * Perform quality control checks
   */
  performQualityCheck(organism, antibiotic, mic, result) {
    // Check for unusual resistance patterns
    if (organism === 'ecoli' && antibiotic === 'Ampicillin' && mic <= 2) {
      result.warnings.push('Unusual: E. coli ampicillin-sensitive - verify identification');
    }

    if (organism === 'paeruginosa' && antibiotic === 'Cefazolin' && mic <= 8) {
      result.warnings.push('Unusual: P. aeruginosa cephalosporin-sensitive - verify identification');
    }

    // Check for extremely high or low MICs
    if (mic > 1024) {
      result.warnings.push('Extremely high MIC - verify testing');
    }

    if (mic < 0.001) {
      result.warnings.push('Extremely low MIC - verify testing');
    }
  }

  /**
   * Batch interpret multiple MIC results
   */
  batchInterpret(organism, micResults, site = null) {
    const results = {};
    
    Object.entries(micResults).forEach(([antibiotic, mic]) => {
      results[antibiotic] = this.interpretMIC(organism, antibiotic, mic, site);
    });

    return results;
  }

  /**
   * Generate antibiogram summary
   */
  generateAntibiogramSummary(interpretations) {
    const summary = {
      totalAntibiotics: Object.keys(interpretations).length,
      susceptible: 0,
      intermediate: 0,
      resistant: 0,
      patterns: [],
      recommendations: []
    };

    Object.values(interpretations).forEach(result => {
      switch (result.interpretation) {
        case 'S': summary.susceptible++; break;
        case 'I': summary.intermediate++; break;
        case 'R': summary.resistant++; break;
      }
    });

    // Calculate resistance percentage
    summary.resistanceRate = (summary.resistant / summary.totalAntibiotics * 100).toFixed(1);
    
    // Add pattern recognition
    summary.patterns = this.identifyKeyPatterns(interpretations);
    
    return summary;
  }

  /**
   * Identify key resistance patterns for summary
   */
  identifyKeyPatterns(interpretations) {
    const patterns = [];

    // Check for key resistance markers
    if (interpretations.Oxacillin?.interpretation === 'R') {
      patterns.push('MRSA phenotype detected');
    }
    
    if (interpretations.Vancomycin?.interpretation === 'R') {
      patterns.push('Vancomycin resistance detected');
    }

    const carbapenems = ['Meropenem', 'Imipenem', 'Ertapenem'];
    const carbapenemResistant = carbapenems.some(
      drug => interpretations[drug]?.interpretation === 'R'
    );
    
    if (carbapenemResistant) {
      patterns.push('Carbapenem resistance detected');
    }

    return patterns;
  }
}

// Export singleton instance
export const breakpointInterpreter = new BreakpointInterpreter();

/**
 * Convenience function for MIC interpretation
 */
export function interpretMIC(organism, antibiotic, mic, site = null) {
  return breakpointInterpreter.interpretMIC(organism, antibiotic, mic, site);
}

/**
 * Convenience function for batch interpretation
 */
export function interpretAntibiogram(organism, micResults, site = null) {
  const interpretations = breakpointInterpreter.batchInterpret(organism, micResults, site);
  const summary = breakpointInterpreter.generateAntibiogramSummary(interpretations);
  
  return {
    interpretations,
    summary
  };
}