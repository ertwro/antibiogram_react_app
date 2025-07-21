// CLSI Breakpoints for Various Other Non-Enterobacterales and Organisms covered by M45
// Data sourced and compiled from CLSI M100-Ed34 and M45 guidelines.
// WARNING: This file has been corrected and expanded based on expert review.
// Many organisms listed here are NOT in the main M100 tables; their recommendations
// are found in the CLSI M45 document.

export default {
  // Recommendations for Vibrio spp. are found in CLSI M45.
  "Vibrio_spp": {
    category: "Other Non-Enterobacterales",
    clsi_table: "Refer to CLSI M45",
    source: "CLSI M45",
    notes: [
      "Breakpoints for Vibrio spp. are provided in CLSI M45. The data here is based on M45.",
      "Breakpoints apply to V. cholerae, V. parahaemolyticus, V. vulnificus, V. alginolyticus, and V. damsela.",
      "MIC testing is the recommended method."
    ],
    epidemiology: "Causes gastrointestinal illness (cholera), wound infections, and septicemia, often associated with exposure to contaminated water or raw seafood.",
    intrinsic_resistance: ["Polymyxins (for V. cholerae)"],
    antibiotics: {
      ceftriaxone: { clsi: { mic_breakpoints: {S: "≤16", I: "32", R: "≥64"}, tier: 1 }},
      ciprofloxacin: { clsi: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, tier: 1 }},
      tetracycline: { clsi: { mic_breakpoints: {S: "≤4", I: "8", R: "≥16"}, tier: 1 }},
      doxycycline: { clsi: { mic_breakpoints: {S: "≤4", I: "8", R: "≥16"}, tier: 1 }},
      minocycline: { clsi: { mic_breakpoints: {S: "≤4", I: "8", R: "≥16"}, tier: 1 }},
      "trimethoprim-sulfamethoxazole": { clsi: { mic_breakpoints: {S: "≤2/38", I: null, R: "≥4/76"}, tier: 2 }}
    }
  },

  // Recommendations for Burkholderia pseudomallei are found in CLSI M45.
  "Burkholderia_pseudomallei": {
    category: "Other Non-Enterobacterales",
    clsi_table: "Refer to CLSI M45",
    source: "CLSI M45",
    notes: [
      "Breakpoints for B. pseudomallei are provided in CLSI M45. The listed agents are key recommendations.",
      "This is a BSL-3 pathogen; all manipulations must be performed with appropriate safety precautions.",
      "MIC testing is required; disk diffusion is unreliable."
    ],
    epidemiology: "Causative agent of melioidosis, a serious infection endemic in Southeast Asia and northern Australia.",
    intrinsic_resistance: ["Penicillin", "Ampicillin", "Gentamicin", "Tobramycin", "Polymyxins"],
    antibiotics: {
      ceftazidime: { clsi: { mic_breakpoints: {S: "≤8", I: "16", R: "≥32"}, tier: 1 }},
      imipenem: { clsi: { mic_breakpoints: {S: "≤4", I: "8", R: "≥16"}, tier: 1 }},
      "trimethoprim-sulfamethoxazole": { clsi: { mic_breakpoints: {S: "≤2/38", R: "≥4/76"}, tier: 1 }}
    }
  },

  // Recommendations for Burkholderia mallei are found in CLSI M45.
  "Burkholderia_mallei": {
    category: "Other Non-Enterobacterales",
    clsi_table: "Refer to CLSI M45",
    source: "CLSI M45",
    notes: [
      "Breakpoints for B. mallei are provided in CLSI M45. The listed agents are key recommendations and are identical to those for B. pseudomallei.",
      "Closely related to B. pseudomallei.",
      "This is a BSL-3 pathogen and potential bioterrorism agent."
    ],
    epidemiology: "Causative agent of glanders, a serious disease primarily affecting horses, but can be transmitted to humans.",
    intrinsic_resistance: ["Penicillin", "Ampicillin", "Gentamicin", "Tobramycin", "Polymyxins"],
    antibiotics: {
      ceftazidime: { clsi: { mic_breakpoints: {S: "≤8", I: "16", R: "≥32"}, tier: 1 }},
      imipenem: { clsi: { mic_breakpoints: {S: "≤4", I: "8", R: "≥16"}, tier: 1 }},
      "trimethoprim-sulfamethoxazole": { clsi: { mic_breakpoints: {S: "≤2/38", R: "≥4/76"}, tier: 1 }}
    }
  },

  // Recommendations for Aeromonas spp. are found in CLSI M45.
  "Aeromonas_spp": {
    category: "Other Non-Enterobacterales",
    clsi_table: "Refer to CLSI M45",
    source: "CLSI M45",
    notes: ["Breakpoints for Aeromonas spp. are provided in CLSI M45."],
    epidemiology: "Associated with wound infections (often water-related), diarrhea, and bacteremia in immunocompromised individuals.",
    intrinsic_resistance: ["Ampicillin", "Amoxicillin", "Cefazolin"],
    antibiotics: {
      ceftriaxone: { clsi: { mic_breakpoints: {S: "≤16", I: "32", R: "≥64"}, tier: 1 }},
      ciprofloxacin: { clsi: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, tier: 1 }},
      levofloxacin: { clsi: { mic_breakpoints: {S: "≤2", I: "4", R: "≥8"}, tier: 1 }},
      "trimethoprim-sulfamethoxazole": { clsi: { mic_breakpoints: {S: "≤2/38", R: "≥4/76"}, tier: 1 }}
    }
  },

  // Recommendations for Pasteurella multocida are found in CLSI M45.
  "Pasteurella_multocida": {
    category: "Other Non-Enterobacterales",
    clsi_table: "Refer to CLSI M45",
    source: "CLSI M45",
    notes: ["Breakpoints for P. multocida are provided in CLSI M45, not Table 2K of M100. These breakpoints are specific to this organism and differ from the general 'Other Non-Enterobacterales' table."],
    epidemiology: "Commonly isolated from soft tissue infections resulting from animal bites or scratches (especially cats and dogs).",
    intrinsic_resistance: [],
    antibiotics: {
      penicillin: { clsi: { mic_breakpoints: {S: "≤0.5", R: "≥1"}, tier: 1 }},
      ampicillin: { clsi: { mic_breakpoints: {S: "≤1", R: "≥2"}, tier: 1 }},
      ceftriaxone: { clsi: { mic_breakpoints: {S: "≤1", R: "≥2"}, tier: 1 }},
      doxycycline: { clsi: { mic_breakpoints: {S: "≤1", R: "≥2"}, tier: 1 }},
      levofloxacin: { clsi: { mic_breakpoints: {S: "≤0.25", R: "≥0.5"}, tier: 1 }}
    }
  },

  // Recommendations for Listeria monocytogenes are found in CLSI M45.
  "Listeria_monocytogenes": {
    category: "Gram-Positive Bacilli",
    clsi_table: "Refer to CLSI M45",
    source: "CLSI M45",
    notes: ["Breakpoints for L. monocytogenes are provided in CLSI M45, not Table 2L of M100. These breakpoints are specific to this organism."],
    epidemiology: "Causative agent of listeriosis, a serious foodborne illness leading to bacteremia and meningitis, primarily affecting pregnant women, newborns, and immunocompromised adults.",
    intrinsic_resistance: ["Cephalosporins (all generations)", "Fosfomycin"],
    antibiotics: {
      penicillin: { clsi: { mic_breakpoints: {S: "≤0.25", R: "≥0.5"}, tier: 1 }},
      ampicillin: { clsi: { mic_breakpoints: {S: "≤0.5", R: "≥1"}, tier: 1 }},
      meropenem: { clsi: { mic_breakpoints: {S: "≤0.25", R: "≥0.5"}, tier: 1 }},
      "trimethoprim-sulfamethoxazole": { clsi: { mic_breakpoints: {S: "≤0.5/9.5", R: "≥1/19"}, tier: 1 }}
    }
  },

  // Recommendations for Moraxella catarrhalis are found in CLSI M45.
  "Moraxella_catarrhalis": {
    category: "Gram-Negative Cocci",
    clsi_table: "Refer to CLSI M45",
    source: "CLSI M45",
    notes: [
      "Interpretive criteria are provided in CLSI M45 and differ from the general 'Other Non-Enterobacterales' table.",
      "Beta-lactamase testing must be performed on all isolates. A positive test predicts resistance to ampicillin and amoxicillin."
    ],
    epidemiology: "A common cause of otitis media and sinusitis in children and respiratory tract infections, such as bronchitis and pneumonia, in adults with chronic lung disease.",
    intrinsic_resistance: [],
    antibiotics: {
      ampicillin: { clsi: { note: "Beta-lactamase testing is the primary determinant of resistance.", tier: 1 }},
      "amoxicillin-clavulanate": { clsi: { mic_breakpoints: {S: "≤4/2", R: "≥8/4"}, tier: 1 }},
      azithromycin: { clsi: { mic_breakpoints: {S: "≤0.25", I: null, R: "≥0.5"}, tier: 1 }},
      ceftriaxone: { clsi: { mic_breakpoints: {S: "≤2", R: "≥4"}, tier: 1 }},
      "trimethoprim-sulfamethoxazole": { clsi: { mic_breakpoints: {S: "≤0.5/9.5", R: "≥1/19"}, tier: 1 }},
      tetracycline: { clsi: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, tier: 2 }}
    }
  },

  // --- NEWLY ADDED PLACEHOLDERS BASED ON REVIEW ---
  // The following organisms are referenced in M100 to have guidance in M45,
  // but specific breakpoints are not included in this file.

  "Bacillus_spp": {
    category: "Gram-Positive Bacilli",
    clsi_table: "Refer to CLSI M45",
    source: "CLSI M45",
    notes: ["CLSI M100 defers to M45 for Bacillus spp. (excluding B. anthracis). Breakpoints are not specified here."],
    epidemiology: "Ubiquitous environmental bacteria; some species can be opportunistic pathogens.",
    intrinsic_resistance: [],
    antibiotics: { /* TODO: Populate from CLSI M45 */ }
},

"Campylobacter_jejuni_coli": {
category: "Gram-Negative Bacilli",
clsi_table: "Refer to CLSI M45",
source: "CLSI M45",
notes: ["CLSI M100 defers to M45 for Campylobacter jejuni/coli. Breakpoints are not specified here."],
epidemiology: "A leading cause of bacterial gastroenteritis worldwide.",
intrinsic_resistance: [],
antibiotics: { /* TODO: Populate from CLSI M45 */ }
},

"Corynebacterium_spp": {
category: "Gram-Positive Bacilli",
clsi_table: "Refer to CLSI M45",
source: "CLSI M45",
notes: ["CLSI M100 defers to M45 for Corynebacterium spp. (including C. diphtheriae). Breakpoints are not specified here."],
epidemiology: "Part of normal skin flora, but some species (like C. diphtheriae) are significant pathogens.",
intrinsic_resistance: [],
antibiotics: { /* TODO: Populate from CLSI M45 */ }
},

"Erysipelothrix_rhusiopathiae": {
category: "Gram-Positive Bacilli",
clsi_table: "Refer to CLSI M45",
source: "CLSI M45",
notes: ["CLSI M100 defers to M45 for Erysipelothrix rhusiopathiae. Breakpoints are not specified here."],
epidemiology: "Causes erysipeloid, an occupational disease affecting butchers, fishermen, and veterinarians.",
intrinsic_resistance: [],
antibiotics: { /* TODO: Populate from CLSI M45 */ }
},

"Gemella_spp": {
category: "Gram-Positive Cocci",
clsi_table: "Refer to CLSI M45",
source: "CLSI M45",
notes: ["CLSI M100 defers to M45 for Gemella spp. Breakpoints are not specified here."],
epidemiology: "Commensal organisms of the oral cavity and upper respiratory tract; can cause endocarditis.",
intrinsic_resistance: [],
antibiotics: { /* TODO: Populate from CLSI M45 */ }
},

"HACEK_group": {
category: "Gram-Negative Bacilli",
clsi_table: "Refer to CLSI M45",
source: "CLSI M45",
notes: [
"CLSI M100 defers to M45 for the HACEK group. Breakpoints are not specified here.",
"Includes Aggregatibacter spp., Cardiobacterium spp., Eikenella corrodens, and Kingella spp."
],
epidemiology: "A group of fastidious gram-negative bacteria known to cause endocarditis.",
intrinsic_resistance: [],
antibiotics: { /* TODO: Populate from CLSI M45 */ }
},

"Helicobacter_pylori": {
category: "Gram-Negative Bacilli",
clsi_table: "Refer to CLSI M45",
source: "CLSI M45",
notes: ["CLSI M100 defers to M45 for Helicobacter pylori. Breakpoints are not specified here."],
epidemiology: "Associated with peptic ulcers, gastritis, and an increased risk of gastric cancer.",
intrinsic_resistance: [],
antibiotics: { /* TODO: Populate from CLSI M45 */ }
},

"Lactobacillus_spp": {
category: "Gram-Positive Bacilli",
clsi_table: "Refer to CLSI M45",
source: "CLSI M45",
notes: ["CLSI M100 defers to M45 for Lactobacillus spp. Breakpoints are not specified here."],
epidemiology: "Part of the normal microbiota, but can be opportunistic pathogens, particularly in immunocompromised hosts.",
intrinsic_resistance: ["Vancomycin"],
antibiotics: { /* TODO: Populate from CLSI M45 */ }
},

"Lactococcus_spp": {
category: "Gram-Positive Cocci",
clsi_table: "Refer to CLSI M45",
source: "CLSI M45",
notes: ["CLSI M100 defers to M45 for Lactococcus spp. Breakpoints are not specified here."],
epidemiology: "Rarely cause human infections but can be associated with endocarditis.",
intrinsic_resistance: [],
antibiotics: { /* TODO: Populate from CLSI M45 */ }
},

"Leuconostoc_spp": {
category: "Gram-Positive Cocci",
clsi_table: "Refer to CLSI M45",
source: "CLSI M45",
notes: ["CLSI M100 defers to M45 for Leuconostoc spp. Breakpoints are not specified here."],
epidemiology: "Opportunistic pathogens, particularly in patients receiving vancomycin, to which they are intrinsically resistant.",
intrinsic_resistance: ["Vancomycin"],
antibiotics: { /* TODO: Populate from CLSI M45 */ }
},

"Serratia_marcescens": {
category: "Enterobacterales",
clsi_table: "Refer to CLSI M45",
source: "CLSI M45",
notes: [
"While typically covered in Enterobacterales tables (Table 2A), M100 may defer to M45 for specific testing scenarios or resistance mechanisms.",
"Breakpoints are not specified here pending clarification of the specific M45 context."
],
epidemiology: "An opportunistic pathogen associated with healthcare-associated infections.",
intrinsic_resistance: ["Colistin"],
antibiotics: { /* TODO: Populate from CLSI M45 */ }
}
};
