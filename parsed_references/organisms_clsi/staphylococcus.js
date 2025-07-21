// CLSI Table 2C: Staphylococcus spp. Breakpoints
// Final comprehensive version, fully aligned with detailed CLSI M100-Ed34 analysis.
// This version includes all specified categories and uses a base entry for S. aureus
// with specific overrides for other species.

export default {
  // Staphylococcus aureus acts as the base entry for "All staphylococci" breakpoints.
  "Staphylococcus_aureus": {
    category: "Staphylococcus spp.",
    clsi_table: "Table 2C",
    source: "CLSI M100-Ed34",
    notes: [
      "Breakpoints for S. aureus also apply to S. aureus complex (e.g., S. argenteus, S. schweitzeri).",
      "Oxacillin resistance predicts resistance to all other penicillins, beta-lactam/beta-lactamase inhibitor combinations, cephalosporins (except ceftaroline), and carbapenems."
    ],
    common_resistance_mechanisms: ["mecA-mediated methicillin resistance (MRSA)", "Inducible clindamycin resistance (MLSb)", "Fluoroquinolone resistance"],
    epidemiology: "Major pathogen in skin/soft tissue infections, bacteremia, endocarditis, and osteomyelitis.",

    antibiotics: {
      // PENICILLINS
      penicillin: { clsi: { mic_breakpoints: {S: "≤0.12", I: null, R: "≥0.25"}, tier: 1 }},
      oxacillin: { clsi: { mic_breakpoints: {S: "≤2", R: "≥4"}, tier: 1 }},

      // CEPHALOSPORINS
      ceftaroline: { clsi: { mic_breakpoints: {S: "≤1", I: "2-4", R: "≥8"}, tier: 1 }},
      cefoxitin: { clsi: { mic_breakpoints: {S: "≤2", I: "4", R: "≥8"}, tier: 2 }},
      cefazolin: { clsi: { mic_breakpoints: {S: "≤2", I: "4", R: "≥8"}, tier: 2 }},
      ceftriaxone: { clsi: { mic_breakpoints: {S: "≤2", I: "4", R: "≥8"}, tier: 2 }},
      cefotaxime: { clsi: { mic_breakpoints: {S: "≤2", I: "4", R: "≥8"}, tier: 2 }},
      cefepime: { clsi: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, tier: 2 }},
      ceftazidime: { clsi: { mic_breakpoints: {S: "≤8", I: "16", R: "≥32"}, tier: 2 }},
      ceftizoxime: { clsi: { mic_breakpoints: {S: "≤2", I: "4", R: "≥8"}, tier: 2 }},
      "cefuroxime (oral)": { clsi: { mic_breakpoints: {S: "≤4", I: "8", R: "≥16"}, tier: 2 }},

      // CARBAPENEMS
      imipenem: { clsi: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, tier: 2 }},
      meropenem: { clsi: { mic_breakpoints: {S: "≤0.25", I: "0.5", R: "≥1"}, tier: 2 }},

      // AMINOGLYCOSIDES
      gentamicin: { clsi: { mic_breakpoints: {S: "≤1", I: "2-4", R: "≥8"}, tier: 2, condition: "Should only be used in combination with other active agents." }},

      // GLYCOPEPTIDES & LIPOGLYCOPEPTIDES
      vancomycin: { clsi: { mic_breakpoints: {S: "≤2", I: "4-8", R: "≥16"}, tier: 1 }},
      telavancin: { clsi: { mic_breakpoints: {S: "≤8", I: "16", R: "≥32"}, tier: 2 }},
      teicoplanin: { clsi: { mic_breakpoints: {S: "≤8", I: "16", R: "≥32"}, tier: 3, condition: "Investigational"}},
      dalbavancin: { clsi: { mic_breakpoints: {S: "≤0.12", R: "≥0.25"}, tier: 2 }},
      oritavancin: { clsi: { mic_breakpoints: {S: "≤0.12", R: "≥0.25"}, tier: 2 }},

      // OTHER PROTEIN SYNTHESIS INHIBITORS
      daptomycin: { clsi: { mic_breakpoints: {S: "≤1", I: null, R: "≥2"}, tier: 1 }},
      linezolid: { clsi: { mic_breakpoints: {S: "≤4", I: null, R: "≥8"}, tier: 1 }},
      tedizolid: { clsi: { mic_breakpoints: {S: "≤0.5", I: null, R: "≥1"}, tier: 1 }},
      clindamycin: { clsi: { mic_breakpoints: {S: "≤0.5", I: "1-2", R: "≥4"}, tier: 1 }},
      erythromycin: { clsi: { mic_breakpoints: {S: "≤0.5", I: "1-4", R: "≥8"}, tier: 2 }},
      azithromycin: { clsi: { mic_breakpoints: {S: "≤0.5", I: "1-4", R: "≥8"}, tier: 2 }},
      clarithromycin: { clsi: { mic_breakpoints: {S: "≤0.5", I: "1-4", R: "≥8"}, tier: 2 }},
      dirithromycin: { clsi: { mic_breakpoints: {S: "≤2", I: "4", R: "≥8"}, tier: 3 }},
      "quinupristin-dalfopristin": { clsi: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, tier: 3, condition: "Report only on MSSA." }},

      // TETRACYCLINES
      tetracycline: { clsi: { mic_breakpoints: {S: "≤4", I: "8", R: "≥16"}, tier: 1 }},
      doxycycline: { clsi: { mic_breakpoints: {S: "≤4", I: "8", R: "≥16"}, tier: 1 }},
      minocycline: { clsi: { mic_breakpoints: {S: "≤4", I: "8", R: "≥16"}, tier: 1 }},

      // FLUOROQUINOLONES
      levofloxacin: { clsi: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, tier: 2 }},
      ciprofloxacin: { clsi: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, tier: 2 }},
      ofloxacin: { clsi: { mic_breakpoints: {S: "≤2", I: "4", R: "≥8"}, tier: 2 }},
      gatifloxacin: { clsi: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, tier: 2 }},
      grepafloxacin: { clsi: { mic_breakpoints: {S: "≤0.5", I: "1", R: "≥2"}, tier: 3 }},
      lomefloxacin: { clsi: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, tier: 3 }},
      norfloxacin: { clsi: { mic_breakpoints: {S: "≤8", I: "16", R: "≥32"}, tier: 3, condition: "For uncomplicated UTIs only." }},
      sparfloxacin: { clsi: { mic_breakpoints: {S: "≤0.5", I: "1", R: "≥2"}, tier: 3 }},
      pleroxacin: { clsi: { mic_breakpoints: {S: "≤2", I: "4", R: "≥8"}, tier: 3, condition: "Investigational" }},

      // FOLATE PATHWAY ANTAGONISTS
      "trimethoprim-sulfamethoxazole": { clsi: { mic_breakpoints: {S: "≤2/38", I: null, R: "≥4/76"}, tier: 1 }},
      sulfonamides: { clsi: { mic_breakpoints: {S: "≤256", R: "≥512"}, tier: 3, condition: "For uncomplicated UTIs only." }},
      trimethoprim: { clsi: { mic_breakpoints: {S: "≤10", R: "≥16"}, tier: 3, condition: "For uncomplicated UTIs only." }},

      // OTHER AGENTS
      rifampin: { clsi: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, tier: 2, condition: "Rifampin should not be used alone for antimicrobial therapy." }},
      nitrofurantoin: { clsi: { mic_breakpoints: {S: "≤32", I: "64", R: "≥128"}, tier: 2, condition: "Not routinely reported on organisms isolated from the urinary tract." }},
      chloramphenicol: { clsi: { mic_breakpoints: {S: "≤8", I: "16", R: "≥32"}, tier: 3, condition: "Not routinely reported on organisms isolated from the urinary tract." }}
    }

  },

  "Staphylococcus_argenteus": {
    category: "Staphylococcus spp. (S. aureus complex)",
    clsi_table: "Table 2C",
    source: "CLSI M100-Ed34",
    epidemiology: "Coagulase-positive species within the S. aureus complex; use S. aureus breakpoints.",
    breakpoint_base: "Staphylococcus_aureus",
    specific_breakpoints: {}
  },

  "Staphylococcus_schweitzeri": {
    category: "Staphylococcus spp. (S. aureus complex)",
    clsi_table: "Table 2C",
    source: "CLSI M100-Ed34",
    epidemiology: "Coagulase-positive species within the S. aureus complex; use S. aureus breakpoints.",
    breakpoint_base: "Staphylococcus_aureus",
    specific_breakpoints: {}
  },

  // Coagulase-negative Staphylococcus species
  "Staphylococcus_epidermidis": {
    category: "Staphylococcus spp.",
    clsi_table: "Table 2C",
    source: "CLSI M100-Ed34",
    epidemiology: "Prosthetic device infections, catheter-associated bacteremia.",
    breakpoint_base: "Staphylococcus_aureus",
    specific_breakpoints: {
      oxacillin: { clsi: { mic_breakpoints: {S: "≤0.5", R: "≥1"}, tier: 1 }},
      vancomycin: { clsi: { mic_breakpoints: {S: "≤4", I: "8-16", R: "≥32"}, tier: 1 }}
    }
  },

  "Staphylococcus_haemolyticus": {
    category: "Staphylococcus spp.",
    clsi_table: "Table 2C",
    source: "CLSI M100-Ed34",
    epidemiology: "Associated with nosocomial infections, particularly line-associated bacteremia.",
    breakpoint_base: "Staphylococcus_aureus",
    specific_breakpoints: {
      oxacillin: { clsi: { mic_breakpoints: {S: "≤0.5", R: "≥1"}, tier: 1 }},
      vancomycin: { clsi: { mic_breakpoints: {S: "≤4", I: "8-16", R: "≥32"}, tier: 1 }}
    }
  },

  "Staphylococcus_saprophyticus": {
    category: "Staphylococcus spp.",
    clsi_table: "Table 2C",
    source: "CLSI M100-Ed34",
    epidemiology: "A leading cause of uncomplicated urinary tract infections (UTIs) in young females.",
    breakpoint_base: "Staphylococcus_aureus",
    specific_breakpoints: {
      oxacillin: { clsi: { mic_breakpoints: {S: "≤0.5", R: "≥1"}, tier: 1 }},
      vancomycin: { clsi: { mic_breakpoints: {S: "≤4", I: "8-16", R: "≥32"}, tier: 1 }}
    }
  },

  "Staphylococcus_lugdunensis": {
    category: "Staphylococcus spp.",
    clsi_table: "Table 2C",
    source: "CLSI M100-Ed34",
    epidemiology: "Aggressive CoNS; can cause native valve endocarditis mimicking S. aureus.",
    breakpoint_base: "Staphylococcus_aureus",
    specific_breakpoints: {
      oxacillin: { clsi: { mic_breakpoints: {S: "≤2", R: "≥4"}, tier: 1 }},
      vancomycin: { clsi: { mic_breakpoints: {S: "≤4", I: "8-16", R: "≥32"}, tier: 1 }}
    }
  },

  "Staphylococcus_schleiferi": {
    category: "Staphylococcus spp.",
    clsi_table: "Table 2C",
    source: "CLSI M100-Ed34",
    epidemiology: "Associated with skin, soft tissue, and bone infections; often in veterinary medicine.",
    breakpoint_base: "Staphylococcus_aureus",
    specific_breakpoints: {
      oxacillin: { clsi: { mic_breakpoints: {S: "≤0.5", R: "≥1"}, tier: 1 }},
      vancomycin: { clsi: { mic_breakpoints: {S: "≤4", I: "8-16", R: "≥32"}, tier: 1 }}
    }
  },

  "Staphylococcus_pseudintermedius": {
    category: "Staphylococcus spp.",
    clsi_table: "Table 2C",
    source: "CLSI M100-Ed34",
    epidemiology: "Primarily a veterinary pathogen (dogs), can cause zoonotic infections in humans.",
    breakpoint_base: "Staphylococcus_aureus",
    specific_breakpoints: {
      oxacillin: { clsi: { mic_breakpoints: {S: "≤0.5", R: "≥1"}, tier: 1 }},
      vancomycin: { clsi: { mic_breakpoints: {S: "≤4", I: "8-16", R: "≥32"}, tier: 1 }}
    }
  },

  "Staphylococcus_spp_unidentified": {
    category: "Staphylococcus spp.",
    clsi_table: "Table 2C",
    source: "CLSI M100-Ed34",
    epidemiology: "Represents Staphylococcus spp. not listed above or not identified to the species level.",
    breakpoint_base: "Staphylococcus_aureus",
    specific_breakpoints: {
      oxacillin: { clsi: { mic_breakpoints: {S: "≤0.5", R: "≥1"}, tier: 1 }},
      vancomycin: { clsi: { mic_breakpoints: {S: "≤4", I: "8-16", R: "≥32"}, tier: 1 }}
    }
  }
};
