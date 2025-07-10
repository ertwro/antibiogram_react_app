// src/data/antibiotics.js
// --- Enhanced Antibiotic Pharmacology Database ---
// Comprehensive drug-specific information derived from clinical references
// Integrates PK/PD parameters, resistance patterns, and stewardship considerations

// Drug classification system
export const DRUG_FAMILIES = {
  PENICILLIN: 'penicillin',
  BETALACTAM: 'betalactam',
  CARBAPENEM: 'carbapenem',
  FLUOROQUINOLONE: 'fluoroquinolone',
  AMINOGLYCOSIDE: 'aminoglycoside',
  GLYCOPEPTIDE: 'glycopeptide',
  LINCOSAMIDE: 'lincosamide',
  MACROLIDE: 'macrolide',
  OXAZOLIDINONE: 'oxazolidinone',
  SULFA: 'sulfa',
  LIPOPEPTIDE: 'lipopeptide',
  NITROFURAN: 'nitrofuran',
  TETRACYCLINE: 'tetracycline',
  POLYMYXIN: 'polymyxin'
};

// PK/PD optimization targets
export const PKPD_TARGETS = {
  TIME_DEPENDENT: 'Time > MIC',
  CONCENTRATION_DEPENDENT: 'Cmax/MIC',
  AUC_DEPENDENT: 'AUC/MIC'
};

// Pregnancy risk categories
export const PREGNANCY_CATEGORIES = {
  A: 'Category A - No risk demonstrated',
  B: 'Category B - No evidence of risk in humans',
  C: 'Category C - Risk cannot be ruled out',
  D: 'Category D - Positive evidence of risk',
  X: 'Category X - Contraindicated in pregnancy'
};

export const antibioticsData = {
  // === PENICILLINS ===
  
  'Oxacillin': {
    classification: {
      family: DRUG_FAMILIES.PENICILLIN,
      subclass: 'Antistaphylococcal penicillin',
      generation: null
    },
    mechanism: {
      target: 'Penicillin-binding proteins (PBPs)',
      action: 'Inhibits cell wall synthesis',
      bactericidal: true,
      pkpdIndex: PKPD_TARGETS.TIME_DEPENDENT
    },
    spectrum: {
      gramPositive: ['MSSA', 'Streptococcus spp.', 'Non-enterococcal Group D strep'],
      gramNegative: [],
      anaerobes: ['Clostridium spp.'],
      atypicals: [],
      notes: 'Narrow spectrum, MSSA-specific'
    },
    dosing: {
      adult: {
        standard: '2g IV q4h',
        severe: '2g IV q4h (12g/day maximum)',
        renal: {
          normal: '≥50 mL/min - No adjustment',
          mild: '30-49 mL/min - No adjustment', 
          moderate: '10-29 mL/min - 50% dose reduction',
          severe: '<10 mL/min - 25-50% dose reduction'
        },
        hepatic: 'No adjustment required',
        infusion: 'Administer over 30 minutes'
      },
      pediatric: {
        standard: '150-200 mg/kg/day IV divided q6h',
        maximum: '12g/day',
        neonatal: 'Adjust based on gestational age'
      }
    },
    monitoring: {
      levels: false,
      parameters: [],
      targets: {},
      clinicalResponse: 'Monitor for clinical improvement within 48-72 hours'
    },
    resistance: {
      mechanisms: ['Beta-lactamase production', 'PBP alterations'],
      crossResistance: ['Penicillin', 'Ampicillin', 'Amoxicillin'],
      testing: 'Cefoxitin disk screening for mecA'
    },
    safety: {
      pregnancyCategory: PREGNANCY_CATEGORIES.B,
      lactation: 'Compatible',
      blackBoxWarning: false,
      majorAdverseEffects: [
        'Hypersensitivity reactions',
        'Clostridioides difficile-associated diarrhea',
        'Thrombophlebitis'
      ],
      contraindications: ['Penicillin allergy'],
      monitoring: ['Signs of allergic reaction', 'CBC with prolonged use']
    },
    interactions: {
      drugDrug: [
        'Probenecid - increases serum levels',
        'Warfarin - may enhance anticoagulant effect'
      ],
      foodDrug: []
    },
    stewardship: {
      preferredFor: ['MSSA infections', 'Skin and soft tissue infections'],
      avoid: ['MRSA', 'Gram-negative infections'],
      deEscalation: 'Preferred over vancomycin for MSSA',
      resistance: 'Low resistance development risk'
    }
  },
  'Penicillin G': {
    classification: {
      family: DRUG_FAMILIES.PENICILLIN,
      subclass: 'Natural penicillin',
      generation: null
    },
    mechanism: {
      target: 'Penicillin-binding proteins (PBPs)',
      action: 'Inhibits cell wall synthesis',
      bactericidal: true,
      pkpdIndex: PKPD_TARGETS.TIME_DEPENDENT
    },
    spectrum: {
      gramPositive: ['Streptococcus spp.', 'Non-beta-lactamase producing staphylococci'],
      gramNegative: ['Neisseria meningitidis', 'Neisseria gonorrhoeae (if susceptible)'],
      anaerobes: ['Clostridium spp.', 'Peptostreptococcus', 'Fusobacterium'],
      spirochetes: ['Treponema pallidum', 'Borrelia burgdorferi'],
      notes: 'Narrow spectrum, activity against spirochetes'
    },
    dosing: {
      adult: {
        standard: '2-4 million units IV q4-6h',
        severe: '18-24 million units/day continuous infusion',
        meningitis: '24 million units/day divided q4h',
        syphilis: '18-24 million units/day for 10-14 days',
        renal: {
          normal: '≥50 mL/min - No adjustment',
          mild: '30-49 mL/min - No adjustment',
          moderate: '10-29 mL/min - Reduce dose by 25-50%',
          severe: '<10 mL/min - Reduce dose by 50-75%'
        },
        hepatic: 'No adjustment required'
      },
      pediatric: {
        standard: '100,000-400,000 units/kg/day divided q4-6h',
        meningitis: '450,000 units/kg/day divided q4h',
        maximum: '24 million units/day'
      }
    },
    monitoring: {
      levels: false,
      parameters: [],
      targets: {},
      clinicalResponse: 'Monitor for clinical improvement'
    },
    resistance: {
      mechanisms: ['Beta-lactamase production'],
      crossResistance: ['Ampicillin', 'Amoxicillin'],
      prevalence: 'High resistance in S. aureus (>90%)'
    },
    safety: {
      pregnancyCategory: PREGNANCY_CATEGORIES.B,
      lactation: 'Compatible',
      blackBoxWarning: false,
      majorAdverseEffects: [
        'Hypersensitivity reactions',
        'CNS toxicity (high doses)',
        'Electrolyte disturbances (potassium/sodium load)'
      ],
      contraindications: ['Penicillin allergy'],
      monitoring: ['Electrolytes with high doses', 'Signs of allergic reaction']
    },
    interactions: {
      drugDrug: [
        'Probenecid - increases serum levels',
        'Methotrexate - may increase toxicity'
      ],
      foodDrug: []
    },
    stewardship: {
      preferredFor: ['Neurosyphilis', 'Group A/B/C streptococcal infections', 'Clostridial infections'],
      avoid: ['Most staphylococcal infections', 'Gram-negative infections'],
      deEscalation: 'Narrow spectrum preferred when appropriate',
      resistance: 'Consider local resistance patterns'
    }
  },

  'Piperacillin-Tazobactam': {
    classification: {
      family: DRUG_FAMILIES.BETALACTAM,
      subclass: 'Antipseudomonal penicillin with beta-lactamase inhibitor',
      generation: null
    },
    mechanism: {
      target: 'Penicillin-binding proteins (PBPs)',
      action: 'Inhibits cell wall synthesis; tazobactam inhibits beta-lactamases',
      bactericidal: true,
      pkpdIndex: PKPD_TARGETS.TIME_DEPENDENT
    },
    spectrum: {
      gramPositive: ['MSSA', 'Streptococcus spp.', 'Enterococcus faecalis'],
      gramNegative: [
        'Escherichia coli', 'Klebsiella spp.', 'Proteus spp.',
        'Pseudomonas aeruginosa', 'Enterobacter spp.', 'Citrobacter spp.',
        'Serratia marcescens', 'Haemophilus influenzae'
      ],
      anaerobes: ['Bacteroides fragilis group', 'Prevotella', 'Peptostreptococcus'],
      atypicals: [],
      notes: 'Broad spectrum including antipseudomonal activity'
    },
    dosing: {
      adult: {
        standard: '4.5g IV q6h or q8h',
        extendedInfusion: '4.5g IV over 4 hours q8h (preferred for P. aeruginosa)',
        severe: '4.5g IV q6h (extended infusion)',
        renal: {
          normal: '≥40 mL/min - No adjustment',
          mild: '20-39 mL/min - 3.375g q6h',
          moderate: '<20 mL/min - 2.25g q6h',
          hemodialysis: '2.25g q8h + 0.75g after each dialysis'
        },
        hepatic: 'No adjustment required'
      },
      pediatric: {
        standard: '300-400 mg/kg/day (piperacillin component) divided q6-8h',
        maximum: '18g/day piperacillin component',
        neonatal: 'Adjust based on gestational age'
      }
    },
    monitoring: {
      levels: false,
      parameters: [],
      targets: {
        efficacy: '≥50% fT>MIC for bacteriostatic effect',
        optimal: '≥100% fT>MIC for bactericidal effect'
      },
      clinicalResponse: 'Monitor for clinical improvement within 48-72 hours'
    },
    resistance: {
      mechanisms: [
        'ESBL production (limited protection)',
        'AmpC beta-lactamases',
        'Carbapenemases',
        'Efflux pumps (P. aeruginosa)'
      ],
      crossResistance: ['Other penicillins'],
      surveillance: 'Monitor for ESBL and carbapenemase producers'
    },
    safety: {
      pregnancyCategory: PREGNANCY_CATEGORIES.B,
      lactation: 'Compatible',
      blackBoxWarning: false,
      majorAdverseEffects: [
        'Hypersensitivity reactions',
        'Clostridioides difficile-associated diarrhea',
        'Thrombocytopenia',
        'Bleeding (platelet dysfunction)'
      ],
      contraindications: ['Penicillin allergy'],
      monitoring: ['CBC', 'Platelet function', 'Signs of bleeding']
    },
    interactions: {
      drugDrug: [
        'Vancomycin - potential nephrotoxicity',
        'Aminoglycosides - physical incompatibility',
        'Warfarin - enhanced anticoagulant effect'
      ],
      foodDrug: []
    },
    stewardship: {
      preferredFor: [
        'Hospital-acquired pneumonia',
        'Complicated intra-abdominal infections',
        'Febrile neutropenia',
        'Pseudomonas aeruginosa infections'
      ],
      avoid: ['Uncomplicated community-acquired infections'],
      deEscalation: 'Consider narrower spectrum based on cultures',
      resistance: 'High resistance development risk with monotherapy'
    }
  },
  // === CEPHALOSPORINS ===
  
  'Cefazolin': {
    classification: {
      family: DRUG_FAMILIES.BETALACTAM,
      subclass: 'First-generation cephalosporin',
      generation: 1
    },
    mechanism: {
      target: 'Penicillin-binding proteins (PBPs)',
      action: 'Inhibits cell wall synthesis',
      bactericidal: true,
      pkpdIndex: PKPD_TARGETS.TIME_DEPENDENT
    },
    spectrum: {
      gramPositive: ['MSSA', 'Streptococcus spp.', 'Non-enterococcal Group D strep'],
      gramNegative: ['E. coli', 'Klebsiella pneumoniae', 'Proteus mirabilis'],
      anaerobes: [],
      atypicals: [],
      notes: 'Narrow spectrum, excellent staphylococcal activity'
    },
    dosing: {
      adult: {
        standard: '1-2g IV q8h',
        severe: '2g IV q6-8h',
        prophylaxis: '1-2g IV 30-60 minutes before incision',
        renal: {
          normal: '≥55 mL/min - No adjustment',
          mild: '35-54 mL/min - No adjustment',
          moderate: '11-34 mL/min - 50% dose or q12h',
          severe: '≤10 mL/min - 25% dose or q24h'
        },
        hepatic: 'No adjustment required'
      },
      pediatric: {
        standard: '100-150 mg/kg/day divided q8h',
        maximum: '6g/day',
        prophylaxis: '30 mg/kg IV pre-operatively'
      }
    },
    monitoring: {
      levels: false,
      parameters: [],
      targets: {},
      clinicalResponse: 'Monitor for clinical improvement'
    },
    resistance: {
      mechanisms: ['Beta-lactamase production (limited spectrum)'],
      crossResistance: ['Other first-generation cephalosporins'],
      stability: 'Stable against most gram-positive beta-lactamases'
    },
    safety: {
      pregnancyCategory: PREGNANCY_CATEGORIES.B,
      lactation: 'Compatible',
      blackBoxWarning: false,
      majorAdverseEffects: [
        'Hypersensitivity reactions',
        'Clostridioides difficile-associated diarrhea',
        'Thrombophlebitis'
      ],
      contraindications: ['Cephalosporin allergy'],
      monitoring: ['Signs of allergic reaction']
    },
    interactions: {
      drugDrug: ['Probenecid - increases serum levels'],
      foodDrug: []
    },
    stewardship: {
      preferredFor: ['Surgical prophylaxis', 'MSSA skin/soft tissue infections'],
      avoid: ['MRSA', 'Enterococcal infections', 'Gram-negative infections beyond basic spectrum'],
      deEscalation: 'Excellent de-escalation choice for susceptible organisms',
      resistance: 'Low resistance development risk'
    }
  },
  'Ceftriaxone': {
    classification: {
      family: DRUG_FAMILIES.BETALACTAM,
      subclass: 'Third-generation cephalosporin',
      generation: 3
    },
    mechanism: {
      target: 'Penicillin-binding proteins (PBPs)',
      action: 'Inhibits cell wall synthesis',
      bactericidal: true,
      pkpdIndex: PKPD_TARGETS.TIME_DEPENDENT
    },
    spectrum: {
      gramPositive: ['MSSA', 'Streptococcus spp.', 'S. pneumoniae'],
      gramNegative: [
        'E. coli', 'Klebsiella spp.', 'Proteus spp.', 'Enterobacter spp.',
        'H. influenzae', 'N. gonorrhoeae', 'N. meningitidis'
      ],
      anaerobes: ['Limited activity'],
      atypicals: [],
      notes: 'Broad gram-negative spectrum, excellent CNS penetration'
    },
    dosing: {
      adult: {
        standard: '1-2g IV q24h',
        meningitis: '2g IV q12h',
        gonorrhea: '500mg IM single dose',
        renal: {
          normal: '≥10 mL/min - No adjustment',
          severe: '<10 mL/min - Consider dose reduction if concurrent hepatic impairment'
        },
        hepatic: 'Max 2g/day if severe hepatic impairment + renal impairment'
      },
      pediatric: {
        standard: '50-75 mg/kg/day IV q24h',
        meningitis: '100 mg/kg/day IV divided q12h',
        maximum: '4g/day'
      }
    },
    monitoring: {
      levels: false,
      parameters: [],
      targets: {},
      clinicalResponse: 'Monitor for clinical improvement'
    },
    resistance: {
      mechanisms: ['ESBL production', 'AmpC beta-lactamases'],
      crossResistance: ['Other third-generation cephalosporins'],
      surveillance: 'Monitor for ESBL producers'
    },
    safety: {
      pregnancyCategory: PREGNANCY_CATEGORIES.B,
      lactation: 'Compatible',
      blackBoxWarning: false,
      majorAdverseEffects: [
        'Hypersensitivity reactions',
        'Biliary sludging/pseudolithiasis',
        'Clostridioides difficile-associated diarrhea'
      ],
      contraindications: ['Cephalosporin allergy', 'Neonates with hyperbilirubinemia'],
      monitoring: ['Hepatic function with prolonged use']
    },
    interactions: {
      drugDrug: [
        'Calcium-containing solutions - precipitation',
        'Probenecid - increases serum levels'
      ],
      foodDrug: []
    },
    stewardship: {
      preferredFor: ['Community-acquired pneumonia', 'Meningitis', 'Gonorrhea'],
      avoid: ['ESBL producers', 'Enterococcal infections', 'Pseudomonas'],
      deEscalation: 'Good de-escalation choice for susceptible gram-negatives',
      resistance: 'Monitor for ESBL emergence'
    }
  },

  // === CARBAPENEMS ===
  
  'Meropenem': {
    classification: {
      family: DRUG_FAMILIES.CARBAPENEM,
      subclass: 'Carbapenem',
      generation: null
    },
    mechanism: {
      target: 'Penicillin-binding proteins (PBPs)',
      action: 'Inhibits cell wall synthesis',
      bactericidal: true,
      pkpdIndex: PKPD_TARGETS.TIME_DEPENDENT
    },
    spectrum: {
      gramPositive: ['MSSA', 'Streptococcus spp.', 'Enterococcus faecalis'],
      gramNegative: [
        'E. coli', 'Klebsiella spp.', 'Enterobacter spp.', 'Citrobacter spp.',
        'Pseudomonas aeruginosa', 'Acinetobacter spp.', 'ESBL producers'
      ],
      anaerobes: ['Bacteroides fragilis group', 'Clostridium spp.'],
      atypicals: [],
      notes: 'Broadest beta-lactam spectrum, excellent for ESBL producers'
    },
    dosing: {
      adult: {
        standard: '1g IV q8h',
        severe: '2g IV q8h',
        extendedInfusion: '1-2g IV over 3-4 hours q8h (preferred)',
        meningitis: '2g IV q8h',
        renal: {
          normal: '≥50 mL/min - No adjustment',
          mild: '26-49 mL/min - 1g q12h',
          moderate: '10-25 mL/min - 500mg q12h',
          severe: '<10 mL/min - 500mg q24h'
        },
        hepatic: 'No adjustment required'
      },
      pediatric: {
        standard: '60 mg/kg/day divided q8h',
        meningitis: '120 mg/kg/day divided q8h',
        maximum: '6g/day'
      }
    },
    monitoring: {
      levels: false,
      parameters: [],
      targets: {
        efficacy: '≥40% fT>MIC for bacteriostatic effect',
        optimal: '≥100% fT>MIC for bactericidal effect'
      },
      clinicalResponse: 'Monitor for clinical improvement within 48-72 hours'
    },
    resistance: {
      mechanisms: [
        'Carbapenemase production (KPC, NDM, OXA-48)',
        'Porin loss + ESBL/AmpC',
        'Efflux pumps'
      ],
      crossResistance: ['Other carbapenems'],
      surveillance: 'Monitor for carbapenemase producers (CRE)'
    },
    safety: {
      pregnancyCategory: PREGNANCY_CATEGORIES.B,
      lactation: 'Compatible',
      blackBoxWarning: false,
      majorAdverseEffects: [
        'Seizures (especially with renal impairment)',
        'Hypersensitivity reactions',
        'Clostridioides difficile-associated diarrhea'
      ],
      contraindications: ['Carbapenem allergy'],
      monitoring: ['Neurological status', 'Renal function']
    },
    interactions: {
      drugDrug: [
        'Valproic acid - decreases levels significantly',
        'Probenecid - increases serum levels'
      ],
      foodDrug: []
    },
    stewardship: {
      preferredFor: [
        'ESBL producers',
        'Severe hospital-acquired infections',
        'Polymicrobial intra-abdominal infections'
      ],
      avoid: ['Uncomplicated infections', 'MRSA', 'Enterococcus faecium'],
      deEscalation: 'Reserved for multidrug-resistant organisms',
      resistance: 'Extremely high resistance development risk - use judiciously'
    }
  },

  // === GLYCOPEPTIDES ===
  
  'Vancomycin': {
    classification: {
      family: DRUG_FAMILIES.GLYCOPEPTIDE,
      subclass: 'Glycopeptide',
      generation: null
    },
    mechanism: {
      target: 'D-alanyl-D-alanine terminus of peptidoglycan',
      action: 'Inhibits cell wall synthesis',
      bactericidal: true,
      pkpdIndex: PKPD_TARGETS.AUC_DEPENDENT
    },
    spectrum: {
      gramPositive: [
        'MRSA', 'MSSA', 'Streptococcus spp.', 'Enterococcus faecalis',
        'C. difficile (oral)', 'Coagulase-negative staphylococci'
      ],
      gramNegative: [],
      anaerobes: ['Clostridium spp.'],
      atypicals: [],
      notes: 'Gram-positive only, MRSA drug of choice'
    },
    dosing: {
      adult: {
        loading: '25-30 mg/kg IV (max 3g)',
        maintenance: '15-20 mg/kg IV q8-12h',
        continuous: 'Loading dose then 1.5-2g/day continuous infusion',
        oral: '125-500mg PO q6h (C. difficile only)',
        renal: {
          normal: '≥60 mL/min - q8-12h based on levels',
          mild: '40-59 mL/min - q12-24h based on levels',
          moderate: '20-39 mL/min - q24-48h based on levels',
          severe: '<20 mL/min - Loading dose then individualize'
        },
        hepatic: 'No adjustment required'
      },
      pediatric: {
        standard: '40-60 mg/kg/day divided q6-8h',
        severe: '60-80 mg/kg/day divided q6h',
        maximum: 'No established maximum'
      }
    },
    monitoring: {
      levels: true,
      parameters: ['AUC24', 'Trough (if AUC unavailable)'],
      targets: {
        auc24: '400-600 μg•hr/mL',
        trough: '15-20 μg/mL (complicated infections)',
        troughAlternative: '10-15 μg/mL (uncomplicated infections)'
      },
      frequency: 'Daily until stable, then 2-3 times weekly'
    },
    resistance: {
      mechanisms: ['vanA/vanB gene clusters', 'Thickened cell wall (VISA)'],
      crossResistance: ['Teicoplanin (vanA)'],
      surveillance: 'Monitor for VISA/VRSA'
    },
    safety: {
      pregnancyCategory: PREGNANCY_CATEGORIES.C,
      lactation: 'Compatible',
      blackBoxWarning: false,
      majorAdverseEffects: [
        'Nephrotoxicity',
        'Ototoxicity',
        'Red man syndrome (infusion-related)',
        'Thrombocytopenia'
      ],
      contraindications: ['Previous serious hypersensitivity'],
      monitoring: ['Renal function', 'Hearing assessment', 'Drug levels']
    },
    interactions: {
      drugDrug: [
        'Aminoglycosides - enhanced nephrotoxicity',
        'Piperacillin-tazobactam - potential nephrotoxicity',
        'Loop diuretics - enhanced ototoxicity'
      ],
      foodDrug: []
    },
    stewardship: {
      preferredFor: ['MRSA infections', 'C. difficile colitis (oral)'],
      avoid: ['MSSA (use beta-lactam instead)', 'Empiric therapy without MRSA risk'],
      deEscalation: 'Switch to beta-lactam if MSSA identified',
      resistance: 'Monitor for heteroresistance (VISA)'
    }
  }

  // Note: Additional antibiotics will be added systematically from the comprehensive PDF database
  // Current entries represent key examples of the enhanced data structure
};

// Helper functions for antibiotic database operations
export const getAntibioticsByFamily = (family) => {
  return Object.entries(antibioticsData)
    .filter(([, data]) => data.classification?.family === family)
    .map(([name, data]) => ({ name, ...data }));
};

export const getAntibioticSpectrum = (antibioticName) => {
  const antibiotic = antibioticsData[antibioticName];
  if (!antibiotic?.spectrum) return null;
  
  return {
    gramPositive: antibiotic.spectrum.gramPositive || [],
    gramNegative: antibiotic.spectrum.gramNegative || [],
    anaerobes: antibiotic.spectrum.anaerobes || [],
    atypicals: antibiotic.spectrum.atypicals || [],
    notes: antibiotic.spectrum.notes || ''
  };
};

export const getDosing = (antibioticName, patientAge, renalFunction) => {
  const antibiotic = antibioticsData[antibioticName];
  if (!antibiotic?.dosing) return null;
  
  const dosing = patientAge < 18 ? antibiotic.dosing.pediatric : antibiotic.dosing.adult;
  
  // Add renal adjustment logic
  let adjustedDosing = { ...dosing };
  if (renalFunction && antibiotic.dosing.adult?.renal) {
    const renalAdjustment = getRenalAdjustment(renalFunction, antibiotic.dosing.adult.renal);
    adjustedDosing.renalAdjustment = renalAdjustment;
  }
  
  return adjustedDosing;
};

export const getRenalAdjustment = (creatinineClearance, renalData) => {
  if (creatinineClearance >= 60) return renalData.normal || 'No adjustment';
  if (creatinineClearance >= 30) return renalData.mild || 'No adjustment';
  if (creatinineClearance >= 15) return renalData.moderate || 'Dose adjustment required';
  return renalData.severe || 'Contraindicated';
};

export const getStewardshipGuidance = (antibioticName, indication) => {
  const antibiotic = antibioticsData[antibioticName];
  if (!antibiotic?.stewardship) return null;
  
  return {
    preferredFor: antibiotic.stewardship.preferredFor || [],
    avoid: antibiotic.stewardship.avoid || [],
    deEscalation: antibiotic.stewardship.deEscalation || '',
    resistance: antibiotic.stewardship.resistance || '',
    appropriate: antibiotic.stewardship.preferredFor.includes(indication)
  };
};

export const getMonitoringRequirements = (antibioticName) => {
  const antibiotic = antibioticsData[antibioticName];
  if (!antibiotic?.monitoring) return null;
  
  return {
    levels: antibiotic.monitoring.levels || false,
    parameters: antibiotic.monitoring.parameters || [],
    targets: antibiotic.monitoring.targets || {},
    frequency: antibiotic.monitoring.frequency || 'As needed',
    safety: antibiotic.safety?.monitoring || []
  };
};

export const checkDrugInteractions = (antibioticName, concomitantMedications = []) => {
  const antibiotic = antibioticsData[antibioticName];
  if (!antibiotic?.interactions) return [];
  
  const interactions = [];
  
  // Check drug-drug interactions
  antibiotic.interactions.drugDrug?.forEach(interaction => {
    const [drug, effect] = interaction.split(' - ');
    if (concomitantMedications.some(med => 
      med.toLowerCase().includes(drug.toLowerCase())
    )) {
      interactions.push({
        type: 'drug-drug',
        drug: drug,
        effect: effect,
        severity: 'moderate' // Could be enhanced with severity levels
      });
    }
  });
  
  return interactions;
};

export const getPregnancySafety = (antibioticName) => {
  const antibiotic = antibioticsData[antibioticName];
  if (!antibiotic?.safety) return null;
  
  return {
    category: antibiotic.safety.pregnancyCategory || 'Unknown',
    lactation: antibiotic.safety.lactation || 'Unknown',
    contraindications: antibiotic.safety.contraindications || [],
    adverseEffects: antibiotic.safety.majorAdverseEffects || []
  };
};

