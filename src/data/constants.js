// src/data/constants.js
// Clinical constants and classification systems

// Clinical significance scoring system
export const CLINICAL_SIGNIFICANCE = {
    PRIMARY_PATHOGEN: 3,      // Always significant when isolated
    OPPORTUNISTIC: 2,         // Significant in certain hosts/sites
    COLONIZER: 1,            // Rarely pathogenic
    CONTAMINANT: 0           // Usually contamination
};

// Resistance mechanism categories
export const RESISTANCE_MECHANISMS = {
    ENZYMATIC: 'enzymatic',           // Beta-lactamases, aminoglycoside-modifying enzymes
    TARGET_MODIFICATION: 'target',    // PBP modifications, ribosomal methylation
    EFFLUX: 'efflux',                // Multi-drug efflux pumps
    PERMEABILITY: 'permeability',    // Porin loss, outer membrane changes
    BYPASS: 'bypass',                // Alternative metabolic pathways
    INTRINSIC: 'intrinsic'           // Natural resistance mechanisms
};

// Laboratory identification test categories
export const LAB_TESTS = {
    GRAM_STAIN: 'gram_stain',
    MORPHOLOGY: 'morphology',
    BIOCHEMICAL: 'biochemical',
    GROWTH_CHARACTERISTICS: 'growth',
    MOLECULAR: 'molecular'
};

// Gram stain categories
export const GRAM_STAIN_TYPES = {
    POSITIVE: 'Gram-positive',
    NEGATIVE: 'Gram-negative',
    VARIABLE: 'Gram-variable'
};

// Common bacterial morphologies
export const MORPHOLOGIES = {
    ROD: 'rod',
    COCCI: 'cocci',
    COCCOBACILLUS: 'coccobacillus',
    DIPLOCOCCUS: 'diplococcus',
    SPIROCHETE: 'spirochete',
    FILAMENTOUS: 'filamentous',
    PLEOMORPHIC: 'pleomorphic'
};

// Antibiotic breakpoint categories
export const BREAKPOINT_CATEGORIES = {
    SUSCEPTIBLE: 'S',
    INTERMEDIATE: 'I',
    RESISTANT: 'R'
};

// Clinical Decision Engine Constants
export const SEVERITY_LEVELS = {
    MILD: 1,
    MODERATE: 2,
    SEVERE: 3,
    CRITICAL: 4
};

export const RESISTANCE_RISK_FACTORS = {
    HIGH_ESBL_RATE: 'high_esbl',
    ICU_ADMISSION: 'icu',
    PRIOR_ANTIBIOTICS: 'prior_abx',
    IMMUNOCOMPROMISED: 'immunocompromised',
    SEVERE_ILLNESS: 'severe_illness',
    MULTIPLE_COMORBIDITIES: 'multiple_comorbidities'
};

export const EPIDEMIOLOGY_THRESHOLDS = {
    LOW_ESBL_RATE: 0.15,        // <15%
    HIGH_ESBL_RATE: 0.30,       // >30%
    LOW_CARBAPENEM_RESISTANCE: 0.05,  // <5%
    HIGH_CARBAPENEM_RESISTANCE: 0.15, // >15%
    LOW_MRSA_RATE: 0.25,        // <25%
    HIGH_MRSA_RATE: 0.50,       // >50%
    LOW_VRE_RATE: 0.10,         // <10%
    HIGH_VRE_RATE: 0.25         // >25%
};

export const DEFAULT_EPIDEMIOLOGY = {
    esblRate: {
        enterobacterales: 0.12, // 12% baseline
        klebsiella: 0.18,
        escherichia: 0.08,
        enterobacter: 0.25
    },
    carbapenemResistance: {
        enterobacterales: 0.03,
        klebsiella: 0.05,
        acinetobacter: 0.25,
        pseudomonas: 0.15
    },
    mrsaRate: 0.35,
    vreRate: 0.15
};

export const CLINICAL_STATUS_LEVELS = {
    STABLE: { value: 'stable', label: 'Estable', severity: SEVERITY_LEVELS.MILD },
    MODERATE: { value: 'moderate', label: 'Moderadamente enfermo', severity: SEVERITY_LEVELS.MODERATE },
    SEVERE: { value: 'severe', label: 'Gravemente enfermo', severity: SEVERITY_LEVELS.SEVERE },
    CRITICAL: { value: 'critical', label: 'Estado crítico/shock', severity: SEVERITY_LEVELS.CRITICAL }
};

export const INFECTION_SEVERITY_MAPPING = {
    'Skin and soft tissues': SEVERITY_LEVELS.MILD,
    'Genitourinary': SEVERITY_LEVELS.MILD,
    'Respiratory': SEVERITY_LEVELS.MODERATE,
    'Gastrointestinal': SEVERITY_LEVELS.MODERATE,
    'Bone tissue': SEVERITY_LEVELS.MODERATE,
    'Cardiovascular': SEVERITY_LEVELS.SEVERE,
    'Central nervous system': SEVERITY_LEVELS.SEVERE,
    'Bacteremia/Sepsis': SEVERITY_LEVELS.SEVERE
};

export const INSTITUTION_TYPES = {
    COMMUNITY: { 
        value: 'community', 
        label: 'Hospital Comunitario',
        esblMultiplier: 0.8,
        carbapenemMultiplier: 0.7
    },
    ACADEMIC: { 
        value: 'academic', 
        label: 'Centro Académico',
        esblMultiplier: 1.2,
        carbapenemMultiplier: 1.3
    },
    TERTIARY: { 
        value: 'tertiary', 
        label: 'Centro de Referencia',
        esblMultiplier: 1.5,
        carbapenemMultiplier: 1.8
    }
};

// Syndrome-specific penetration requirements
export const PENETRATION_REQUIREMENTS = {
    CNS_CRITICAL: {
        type: 'CNS_critical',
        description: 'Blood-brain barrier penetration essential',
        excellent: ['Ceftriaxone', 'Ceftazidime', 'Meropenem', 'Metronidazole', 'Linezolid'],
        good: ['Ciprofloxacin', 'Levofloxacin', 'Penicillin G'],
        moderate: ['Vancomycin'],  // Poor CSF penetration unless high dose
        poor: ['Cefazolin', 'Oxacillin', 'Gentamicin', 'Tobramycin', 'Amikacin'],
        avoid: ['First-generation cephalosporins', 'Most aminoglycosides']
    },
    BONE_SPECIFIC: {
        type: 'bone_specific',
        description: 'Bone tissue penetration essential',
        excellent: ['Ciprofloxacin', 'Levofloxacin', 'Clindamycin', 'Rifampin'],
        good: ['Linezolid', 'Doxycycline', 'Minocycline'],
        moderate: ['Vancomycin', 'Ceftriaxone'],
        poor: ['Gentamicin', 'Tobramycin', 'Amikacin'],
        avoid: ['Aminoglycosides for oral sequential therapy']
    },
    URINARY_SPECIFIC: {
        type: 'urinary_specific',
        description: 'Urinary concentration more important than serum',
        excellent: ['Nitrofurantoin', 'Fosfomycin', 'Ciprofloxacin'],
        good: ['Levofloxacin', 'Ceftriaxone', 'Ceftazidime'],
        moderate: ['Ampicillin', 'Cefazolin'],
        poor: ['Clindamycin', 'Vancomycin'],
        avoid: ['Antibiotics without urinary concentration']
    },
    PROSTATE_SPECIFIC: {
        type: 'prostate_specific', 
        description: 'Prostate tissue penetration essential',
        excellent: ['Ciprofloxacin', 'Levofloxacin', 'Trimethoprim-sulfamethoxazole'],
        good: ['Doxycycline', 'Minocycline'],
        moderate: ['Ceftriaxone'],
        poor: ['Vancomycin', 'Gentamicin', 'Cefazolin'],
        avoid: ['Most beta-lactams', 'Aminoglycosides']
    },
    SYSTEMIC: {
        type: 'systemic',
        description: 'Good systemic distribution required',
        excellent: ['Most IV antibiotics with good tissue distribution'],
        good: ['Standard parenteral antibiotics'],
        moderate: [],
        poor: [],
        avoid: ['Topical-only agents']
    },
    GOOD: {
        type: 'good',
        description: 'Standard tissue penetration adequate',
        excellent: ['Most antibiotics'],
        good: [],
        moderate: [],
        poor: [],
        avoid: []
    }
};

// Syndrome-specific coverage requirements  
export const COVERAGE_REQUIREMENTS = {
    ANAEROBIC_ESSENTIAL: {
        required: ['Metronidazole', 'Clindamycin', 'Piperacillin-tazobactam', 'Meropenem'],
        indication: 'Intra-abdominal infections, aspiration pneumonia'
    },
    ATYPICAL_COVERAGE: {
        required: ['Azithromycin', 'Clarithromycin', 'Doxycycline', 'Levofloxacin', 'Moxifloxacin'],
        indication: 'Community-acquired pneumonia with atypical pathogens'
    },
    ANTI_PSEUDOMONAS: {
        required: ['Piperacillin-tazobactam', 'Ceftazidime', 'Cefepime', 'Meropenem', 'Ciprofloxacin'],
        indication: 'Healthcare-associated pneumonia, severe infections'
    },
    BIOFILM_ACTIVITY: {
        required: ['Rifampin', 'Daptomycin', 'Linezolid'],
        indication: 'Device-associated infections, chronic osteomyelitis'
    }
};