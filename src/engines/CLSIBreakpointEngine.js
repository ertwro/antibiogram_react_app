// src/engines/CLSIBreakpointEngine.js
// --- CLSI M100-Ed34 Breakpoint Interpretation Engine ---
// Integrates with your comprehensive CLSI database for accurate MIC interpretation

// Import all 13 CLSI organism modules
import enterobacteralesBreakpoints from '../../parsed_references/organisms_clsi/enterobacterales.js';
import staphylococcusBreakpoints from '../../parsed_references/organisms_clsi/staphylococcus.js';
import enterococcusBreakpoints from '../../parsed_references/organisms_clsi/enterococcus.js';
import streptococcusBreakpoints from '../../parsed_references/organisms_clsi/streptococcus.js';
import pseudomonasBreakpoints from '../../parsed_references/organisms_clsi/pseudomonas.js';
import acinetobacterBreakpoints from '../../parsed_references/organisms_clsi/acinetobacter.js';
import haemophilusBreakpoints from '../../parsed_references/organisms_clsi/haemophilus.js';
import neisseriaBreakpoints from '../../parsed_references/organisms_clsi/neisseria.js';
import anaerobsBreakpoints from '../../parsed_references/organisms_clsi/anaerobes.js';
import burkholderiaBreakpoints from '../../parsed_references/organisms_clsi/burkholderia.js';
import stenotrophomonasBreakpoints from '../../parsed_references/organisms_clsi/stenotrophomonas.js';
import otherNonEnterobacteralesBreakpoints from '../../parsed_references/organisms_clsi/other_non_enterobacterales.js';

export class CLSIBreakpointEngine {
  constructor() {
    // Load all CLSI organism modules
    this.clsiDatabase = {
      'enterobacterales': enterobacteralesBreakpoints,
      'staphylococcus': staphylococcusBreakpoints,
      'enterococcus': enterococcusBreakpoints,
      'streptococcus': streptococcusBreakpoints,
      'pseudomonas': pseudomonasBreakpoints,
      'acinetobacter': acinetobacterBreakpoints,
      'haemophilus': haemophilusBreakpoints,
      'neisseria': neisseriaBreakpoints,
      'anaerobes': anaerobsBreakpoints,
      'burkholderia': burkholderiaBreakpoints,
      'stenotrophomonas': stenotrophomonasBreakpoints,
      'other_non_enterobacterales': otherNonEnterobacteralesBreakpoints
    };
    
    // Debug: Check if modules loaded correctly
    console.log('🔍 Debug: Checking imported modules:');
    console.log('enterobacteralesBreakpoints:', enterobacteralesBreakpoints);
    console.log('enterobacteralesBreakpoints.default:', enterobacteralesBreakpoints.default);
    
    Object.entries(this.clsiDatabase).forEach(([key, value]) => {
      if (!value) {
        console.warn(`CLSIBreakpointEngine: Module not loaded for ${key}:`, value);
      } else {
        console.log(`✅ ${key}: Module loaded successfully`);
      }
    });

    // Site-specific breakpoint modifications
    this.siteSpecificBreakpoints = this.initializeSiteSpecificBreakpoints();
    
    // Organism to CLSI category mapping
    this.organismMapping = this.initializeOrganismMapping();
    
    console.log('🧪 CLSIBreakpointEngine initialized with M100-Ed34 database');
  }

  /**
   * CORE FUNCTION: MIC → S/I/R Interpretation with Clinical Context
   * @param {string} organism - Bacterial organism
   * @param {string} antibiotic - Antibiotic name  
   * @param {string|number} micValue - MIC value (e.g., "≤1", "2", "≥32")
   * @param {string} infectionSite - Site of infection for context
   * @returns {Object} Complete interpretation with confidence and context
   */
  async interpretMIC(organism, antibiotic, micValue, infectionSite = null) {
    try {
      console.log(`🧪 interpretMIC called with: organism="${organism}", antibiotic="${antibiotic}"`);
      
      // 1. Map organism to CLSI category
      const clsiCategory = this.mapOrganismToCLSICategory(organism);
      console.log(`🧪 CLSI category mapped: "${organism}" -> "${clsiCategory}"`);
      
      if (!clsiCategory) {
        throw new Error(`No CLSI category found for organism: ${organism}`);
      }

      // 2. Get organism-specific breakpoints
      const organismBreakpoints = this.getOrganismBreakpoints(clsiCategory, organism);
      console.log(`🧪 Organism breakpoints:`, organismBreakpoints ? 'Found' : 'Not found');
      
      // 3. Get antibiotic-specific breakpoints
      const antibioticBreakpoints = this.getAntibioticBreakpoints(
        organismBreakpoints, antibiotic, infectionSite
      );
      console.log(`🧪 Antibiotic breakpoints for ${antibiotic}:`, antibioticBreakpoints ? 'Found' : 'Not found');
      
      if (!antibioticBreakpoints) {
        console.log(`❌ No breakpoints found for ${antibiotic} vs ${organism}`);
        console.log(`🧪 Available antibiotics in organism breakpoints:`, 
          organismBreakpoints?.antibiotics ? Object.keys(organismBreakpoints.antibiotics) : 'No antibiotics section');
        return {
          interpretation: 'NA',
          confidence: 'low',
          reason: 'no_breakpoints',
          note: `No CLSI breakpoints available for ${antibiotic} vs ${organism}`,
          micValue: micValue
        };
      }

      // 4. Check for intrinsic resistance
      const intrinsicCheck = this.checkIntrinsicResistance(clsiCategory, organism, antibiotic);
      if (intrinsicCheck.isIntrinsic) {
        return {
          interpretation: 'R',
          confidence: 'high',
          reason: 'intrinsic_resistance',
          note: intrinsicCheck.note,
          micValue: micValue,
          breakpoints: antibioticBreakpoints
        };
      }

      // 5. Perform MIC interpretation
      const interpretation = this.performBreakpointComparison(micValue, antibioticBreakpoints);
      
      // 6. Apply clinical context and special considerations
      const finalInterpretation = this.applyClinicalContext(
        interpretation, organism, antibiotic, infectionSite, antibioticBreakpoints
      );

      return {
        ...finalInterpretation,
        micValue: micValue,
        breakpoints: antibioticBreakpoints,
        clsiCategory: clsiCategory,
        siteModified: infectionSite && this.hasSiteSpecificBreakpoints(antibiotic, infectionSite)
      };

    } catch (error) {
      console.error('CLSIBreakpointEngine error:', error);
      return {
        interpretation: 'ERROR',
        confidence: 'none',
        reason: 'interpretation_error',
        note: error.message,
        micValue: micValue
      };
    }
  }

  /**
   * Get breakpoints for an antibiotic against an organism
   * Used for S/I/R button functionality 
   */
  async getBreakpoints(organism, antibiotic, infectionSite = null) {
    try {
      // 1. Map organism to CLSI category
      const clsiCategory = this.mapOrganismToCLSICategory(organism);
      
      if (!clsiCategory) {
        return null;
      }

      // 2. Get organism-specific breakpoints
      const organismBreakpoints = this.getOrganismBreakpoints(clsiCategory, organism);
      
      // 3. Get antibiotic-specific breakpoints
      const antibioticBreakpoints = this.getAntibioticBreakpoints(
        organismBreakpoints, antibiotic, infectionSite
      );
      
      return antibioticBreakpoints;

    } catch (error) {
      console.error('getBreakpoints error:', error);
      return null;
    }
  }

  /**
   * Map organism to CLSI category using your sophisticated mapping
   */
  mapOrganismToCLSICategory(organism) {
    // Convert to lowercase for consistent matching
    const normalizedOrganism = organism.toLowerCase();
    console.log(`🔍 Mapping organism: "${organism}" -> normalized: "${normalizedOrganism}"`);
    
    // Direct mappings for common organisms (lowercase keys)
    const directMappings = {
      'escherichia_coli': 'enterobacterales',
      'escherichiacoli': 'enterobacterales',
      'ecolienteroaggregative': 'enterobacterales', // E. coli enteroaggregative
      'klebsiella_pneumoniae': 'enterobacterales',
      'klebsiellaaerogenes': 'enterobacterales',
      'klebsiellaspoxytocapneumoniaevariicola': 'enterobacterales',
      'klebsiellasprhinoscleromatisozaenae': 'enterobacterales',
      'enterobacter_cloacae_complex': 'enterobacterales',
      'enterobactercloacaecomplex': 'enterobacterales',
      'citrobacter_freundii': 'enterobacterales',
      'citrobacterfreundii': 'enterobacterales',
      'citrobacterkoseri': 'enterobacterales',
      'serratia_marcescens': 'enterobacterales',
      'serratiamarcescens': 'enterobacterales',
      'proteus_mirabilis': 'enterobacterales',
      'proteusspmirabilispennerivulgaris': 'enterobacterales',
      'morganellamorganii': 'enterobacterales',
      'providenciaspstuartiirettgerialcalificiens': 'enterobacterales',
      'staphylococcus_aureus_mrsa': 'staphylococcus',
      'staphylococcus_aureus_mssa': 'staphylococcus',
      'staphylococcus_epidermidis': 'staphylococcus',
      'enterococcus_faecalis': 'enterococcus',
      'enterococcus_faecium': 'enterococcus',
      'streptococcus_pneumoniae': 'streptococcus',
      'streptococcus_pyogenes': 'streptococcus',
      'pseudomonas_aeruginosa': 'pseudomonas',
      'acinetobacter_baumannii': 'acinetobacter',
      'haemophilus_influenzae': 'haemophilus',
      'neisseria_gonorrhoeae': 'neisseria',
      'neisseria_meningitidis': 'neisseria'
    };

    if (directMappings[normalizedOrganism]) {
      const category = directMappings[normalizedOrganism];
      console.log(`✅ Direct mapping found: ${normalizedOrganism} -> ${category}`);
      return category;
    }

    // Pattern-based mapping for organism families (case-insensitive)
    if (normalizedOrganism.includes('escherichia') || normalizedOrganism.includes('ecoli') ||
        normalizedOrganism.includes('klebsiella') || normalizedOrganism.includes('enterobacter') ||
        normalizedOrganism.includes('citrobacter') || normalizedOrganism.includes('serratia') ||
        normalizedOrganism.includes('proteus') || normalizedOrganism.includes('morganella') ||
        normalizedOrganism.includes('providencia')) {
      console.log(`✅ Pattern mapping found: ${normalizedOrganism} -> enterobacterales`);
      return 'enterobacterales';
    }

    if (normalizedOrganism.includes('staphylococcus')) {
      return 'staphylococcus';
    }

    if (normalizedOrganism.includes('enterococcus')) {
      return 'enterococcus';
    }

    if (normalizedOrganism.includes('streptococcus')) {
      return 'streptococcus';
    }

    if (normalizedOrganism.includes('pseudomonas')) {
      return 'pseudomonas';
    }

    if (normalizedOrganism.includes('acinetobacter')) {
      return 'acinetobacter';
    }

    // Default for unmapped organisms
    return 'other_non_enterobacterales';
  }

  /**
   * Get organism-specific breakpoints from CLSI database
   */
  getOrganismBreakpoints(clsiCategory, specificOrganism) {
    const categoryData = this.clsiDatabase[clsiCategory];
    console.log(`🔍 getOrganismBreakpoints: category="${clsiCategory}", organism="${specificOrganism}"`);
    console.log(`🔍 Category data available:`, categoryData ? 'Yes' : 'No');
    
    if (!categoryData) {
      console.warn(`CLSI category not found: ${clsiCategory}. Available categories:`, Object.keys(this.clsiDatabase));
      // Return default enterobacterales data as fallback
      return this.clsiDatabase['enterobacterales'] || {};
    }

    console.log(`🔍 Available tables in ${clsiCategory}:`, Object.keys(categoryData));

    // Try specific organism first, then fall back to category default
    const specificKey = this.findSpecificOrganismKey(categoryData, specificOrganism);
    console.log(`🔍 Specific organism key found:`, specificKey);
    
    if (specificKey && categoryData[specificKey]) {
      console.log(`✅ Using specific organism data for: ${specificKey}`);
      return categoryData[specificKey];
    }

    // Fall back to first table in category (usually the main table)
    const firstTable = Object.keys(categoryData)[0];
    console.log(`🔄 Falling back to first table: ${firstTable}`);
    
    // For enterobacterales, we need to go one level deeper to find organism-specific data
    if (clsiCategory === 'enterobacterales' && categoryData[firstTable]) {
      const tableData = categoryData[firstTable];
      console.log(`🔍 Available organisms in ${firstTable}:`, Object.keys(tableData));
      
      // Look for E. coli data for any E. coli variant
      if (specificOrganism.includes('ecoli') || specificOrganism.includes('escherichia')) {
        const ecoliKey = Object.keys(tableData).find(key => 
          key.toLowerCase().includes('escherichia') || key.toLowerCase().includes('coli')
        );
        if (ecoliKey && tableData[ecoliKey]) {
          console.log(`✅ Using E. coli breakpoints for ${specificOrganism}: ${ecoliKey}`);
          return tableData[ecoliKey];
        }
      }
      
      // For other enterobacterales, use the first organism in the table
      const firstOrganism = Object.keys(tableData)[0];
      if (firstOrganism && tableData[firstOrganism]) {
        console.log(`✅ Using ${firstOrganism} breakpoints for ${specificOrganism}`);
        return tableData[firstOrganism];
      }
    }
    
    return categoryData[firstTable];
  }

  /**
   * Find specific organism key in CLSI data
   */
  findSpecificOrganismKey(categoryData, organism) {
    const keys = Object.keys(categoryData);
    
    // Look for exact match
    for (const key of keys) {
      if (key.includes(organism) || organism.includes(key.replace(/_/g, ' '))) {
        return key;
      }
    }

    // Look for genus match
    const genus = organism.split('_')[0];
    for (const key of keys) {
      if (key.includes(genus)) {
        return key;
      }
    }

    return null;
  }

  /**
   * Get antibiotic-specific breakpoints with site modifications
   */
  getAntibioticBreakpoints(organismBreakpoints, antibiotic, infectionSite) {
    // Normalize antibiotic name
    const normalizedAntibiotic = this.normalizeAntibioticName(antibiotic);
    
    // Check for site-specific breakpoints first
    if (infectionSite && this.siteSpecificBreakpoints[infectionSite] && 
        this.siteSpecificBreakpoints[infectionSite][normalizedAntibiotic]) {
      return this.siteSpecificBreakpoints[infectionSite][normalizedAntibiotic];
    }

    // Get standard breakpoints
    if (organismBreakpoints.antibiotics && organismBreakpoints.antibiotics[normalizedAntibiotic]) {
      return organismBreakpoints.antibiotics[normalizedAntibiotic];
    }

    // Try alternative names
    const alternatives = this.getAlternativeAntibioticNames(normalizedAntibiotic);
    for (const alt of alternatives) {
      if (organismBreakpoints.antibiotics && organismBreakpoints.antibiotics[alt]) {
        return organismBreakpoints.antibiotics[alt];
      }
    }

    return null;
  }

  /**
   * Perform actual MIC vs breakpoint comparison
   */
  performBreakpointComparison(micValue, breakpoints) {
    const numericMIC = this.parseNumericMIC(micValue);
    
    if (breakpoints.mic_breakpoints) {
      const susceptible = this.parseBreakpointValue(breakpoints.mic_breakpoints.S);
      const resistant = this.parseBreakpointValue(breakpoints.mic_breakpoints.R);
      const intermediate = breakpoints.mic_breakpoints.I ? 
        this.parseBreakpointValue(breakpoints.mic_breakpoints.I) : null;

      if (numericMIC <= susceptible) {
        return {
          interpretation: 'S',
          confidence: 'high',
          reason: 'mic_breakpoint',
          note: `MIC ${micValue} ≤ ${susceptible} (Susceptible)`
        };
      }

      if (numericMIC >= resistant) {
        return {
          interpretation: 'R',
          confidence: 'high', 
          reason: 'mic_breakpoint',
          note: `MIC ${micValue} ≥ ${resistant} (Resistant)`
        };
      }

      if (intermediate && numericMIC >= intermediate && numericMIC < resistant) {
        return {
          interpretation: 'I',
          confidence: 'high',
          reason: 'mic_breakpoint',
          note: `MIC ${micValue} = ${intermediate} (Intermediate)`
        };
      }

      // Default to intermediate if between S and R
      return {
        interpretation: 'I',
        confidence: 'moderate',
        reason: 'mic_breakpoint',
        note: `MIC ${micValue} between breakpoints (Intermediate)`
      };
    }

    return {
      interpretation: 'NA',
      confidence: 'none',
      reason: 'no_mic_breakpoints',
      note: 'No MIC breakpoints available'
    };
  }

  /**
   * Parse MIC value to numeric for comparison
   */
  parseNumericMIC(micValue) {
    if (typeof micValue === 'number') {
      return micValue;
    }

    const strValue = String(micValue).trim();
    
    // Handle ≤, ≥ operators
    if (strValue.includes('≤') || strValue.includes('<=')) {
      return parseFloat(strValue.replace(/[≤<=]/g, ''));
    }
    
    if (strValue.includes('≥') || strValue.includes('>=')) {
      return parseFloat(strValue.replace(/[≥>=]/g, ''));
    }

    // Handle ranges (e.g., "2-4")
    if (strValue.includes('-')) {
      const [min, max] = strValue.split('-').map(v => parseFloat(v.trim()));
      return (min + max) / 2; // Use average
    }

    // Handle fractions (e.g., "1/2")
    if (strValue.includes('/')) {
      const [num, den] = strValue.split('/').map(v => parseFloat(v.trim()));
      return num / den;
    }

    return parseFloat(strValue) || 0;
  }

  /**
   * Parse breakpoint value (handles ≤, ≥ operators)
   */
  parseBreakpointValue(breakpointStr) {
    if (!breakpointStr) return null;
    
    const strValue = String(breakpointStr).trim();
    return parseFloat(strValue.replace(/[≤≥<>=]/g, '')) || 0;
  }

  /**
   * Check for intrinsic resistance
   */
  checkIntrinsicResistance(clsiCategory, organism, antibiotic) {
    const categoryData = this.clsiDatabase[clsiCategory];
    
    // Check organism-specific intrinsic resistance
    const organismData = this.getOrganismBreakpoints(clsiCategory, organism);
    if (organismData && organismData.intrinsic_resistance && 
        organismData.intrinsic_resistance.includes(antibiotic)) {
      return {
        isIntrinsic: true,
        note: `${organism} is intrinsically resistant to ${antibiotic}`
      };
    }

    // Check category-level intrinsic resistance patterns
    const intrinsicPatterns = {
      'enterococcus': ['cephalexin', 'cefazolin', 'ceftriaxone', 'ceftazidime'],
      'anaerobes': ['aminoglycosides', 'fluoroquinolones'],
      'gram_positive': ['aztreonam', 'colistin']
    };

    if (intrinsicPatterns[clsiCategory] && 
        intrinsicPatterns[clsiCategory].includes(antibiotic)) {
      return {
        isIntrinsic: true,
        note: `${clsiCategory} are intrinsically resistant to ${antibiotic}`
      };
    }

    return { isIntrinsic: false };
  }

  /**
   * Get intrinsic resistance list for organism
   */
  getIntrinsicResistance(organism) {
    try {
      const clsiCategory = this.mapOrganismToCLSICategory(organism);
      const organismData = this.getOrganismBreakpoints(clsiCategory, organism);
      
      return organismData?.intrinsic_resistance || [];
    } catch (error) {
      console.warn(`Error getting intrinsic resistance for ${organism}:`, error.message);
      return [];
    }
  }

  /**
   * Apply clinical context and special considerations
   */
  applyClinicalContext(interpretation, organism, antibiotic, infectionSite, breakpoints) {
    // Apply special considerations from CLSI
    if (breakpoints.special_considerations) {
      interpretation.specialConsiderations = breakpoints.special_considerations;
    }

    // Apply condition-specific notes
    if (breakpoints.condition) {
      interpretation.condition = breakpoints.condition;
    }

    return interpretation;
  }

  /**
   * Initialize site-specific breakpoint modifications
   */
  initializeSiteSpecificBreakpoints() {
    return {
      'CNS_meningitis': {
        'ceftriaxone': {
          mic_breakpoints: { S: '≤0.5', I: '1', R: '≥2' }
        },
        'meropenem': {
          mic_breakpoints: { S: '≤0.25', I: '0.5', R: '≥1' }
        },
        'vancomycin': {
          mic_breakpoints: { S: '≤1', I: '2', R: '≥4' }
        }
      },
      'GU_UTI_uncomplicated': {
        'ampicillin': {
          mic_breakpoints: { S: '≤8', I: '16', R: '≥32' }
        },
        'nitrofurantoin': {
          mic_breakpoints: { S: '≤32', I: '64', R: '≥128' }
        }
      }
    };
  }

  /**
   * Initialize organism mapping
   */
  initializeOrganismMapping() {
    // This could be expanded based on your bacterial database
    return {};
  }

  /**
   * Normalize antibiotic names for consistent lookup
   */
  normalizeAntibioticName(antibiotic) {
    const normalizations = {
      'tmp-smx': 'trimethoprim-sulfamethoxazole',
      'pip-tazo': 'piperacillin-tazobactam',
      'amp-sulb': 'ampicillin-sulbactam',
      'amox-clav': 'amoxicillin-clavulanate'
    };

    const normalized = antibiotic.toLowerCase().replace(/\s+/g, '-');
    return normalizations[normalized] || normalized;
  }

  /**
   * Get alternative names for antibiotics
   */
  getAlternativeAntibioticNames(antibiotic) {
    const alternatives = {
      'trimethoprim-sulfamethoxazole': ['tmp-smx', 'cotrimoxazole', 'trimethoprim_sulfamethoxazole'],
      'piperacillin-tazobactam': ['pip-tazo', 'piperacillin_tazobactam'],
      'ampicillin-sulbactam': ['amp-sulb', 'ampicillin_sulbactam'],
      'amoxicillin-clavulanate': ['amox-clav', 'amoxicillin_clavulanate']
    };

    return alternatives[antibiotic] || [];
  }

  /**
   * Check if site-specific breakpoints exist
   */
  hasSiteSpecificBreakpoints(antibiotic, infectionSite) {
    return !!(this.siteSpecificBreakpoints[infectionSite] && 
              this.siteSpecificBreakpoints[infectionSite][antibiotic]);
  }
}

export default CLSIBreakpointEngine;