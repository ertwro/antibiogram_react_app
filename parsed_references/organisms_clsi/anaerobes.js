// CLSI Table 2J: Anaerobes Breakpoints
// Refactored into groups to improve readability and reduce redundancy.
// Corrected Piperacillin-Tazobactam breakpoints for specific Gram-Positive groups.

export default {
  // Base organism entries for inheritance pattern
  "Bacteroides_fragilis": {
    category: "Anaerobes",
    clsi_table: "Table 2J",
    source: "CLSI M100-Ed34",
    epidemiology: "Most common anaerobe causing intra-abdominal infections, abscess formation.",
    common_resistance_mechanisms: ["Beta-lactamase production"],
    intrinsic_resistance: ["penicillin", "ampicillin"],
    antibiotics: {
      "amoxicillin-clavulanate": { clsi: { mic_breakpoints: {S: "≤4/2", I: "8/4", R: "≥16/8"}, tier: 1 } },
      "ampicillin-sulbactam": { clsi: { mic_breakpoints: {S: "≤8/4", I: "16/8", R: "≥32/16"}, tier: 1 } },
      "piperacillin-tazobactam": { clsi: { mic_breakpoints: {S: "≤64/4", I: "128/4", R: "≥128/4"}, tier: 1 } },
      "ticarcillin-clavulanate": { clsi: { mic_breakpoints: {S: "≤32/2", I: "64/2", R: "≥128/2"}, tier: 2 } },
      "cefoxitin": { clsi: { mic_breakpoints: {S: "≤16", I: "32", R: "≥64"}, tier: 2 } },
      "cefotetan": { clsi: { mic_breakpoints: {S: "≤16", I: "32", R: "≥64"}, tier: 2 } },
      "ceftriaxone": { clsi: { mic_breakpoints: {S: "≤32", I: "64", R: "≥128"}, tier: 2 } },
      "doripenem": { clsi: { mic_breakpoints: {S: "≤2", I: "4", R: "≥8"}, tier: 2 } },
      "ertapenem": { clsi: { mic_breakpoints: {S: "≤4", I: "8", R: "≥16"}, tier: 1 } },
      "imipenem": { clsi: { mic_breakpoints: {S: "≤4", I: "8", R: "≥16"}, tier: 1 } },
      "imipenem-relebactam": { clsi: { mic_breakpoints: {S: "≤4/2", I: "8/2", R: "≥16/2"}, tier: 3 } },
      "meropenem": { clsi: { mic_breakpoints: {S: "≤4", I: "8", R: "≥16"}, tier: 1 } },
      "clindamycin": { clsi: { mic_breakpoints: {S: "≤2", I: "4", R: "≥8"}, tier: 1 } },
      "metronidazole": { clsi: { mic_breakpoints: {S: "≤8", I: "16", R: "≥32"}, tier: 1 } },
      "moxifloxacin": { clsi: { mic_breakpoints: {S: "≤2", I: "4", R: "≥8"}, tier: 2 } },
      "tetracycline": { clsi: { mic_breakpoints: {S: "≤4", I: "8", R: "≥16"}, tier: 2 } },
      "chloramphenicol": { clsi: { mic_breakpoints: {S: "≤8", I: "16", R: "≥32"}, tier: 3 } }
    }
  },

  "Parabacteroides_distasonis": {
    category: "Anaerobes",
    clsi_table: "Table 2J",
    source: "CLSI M100-Ed34",
    epidemiology: "Intra-abdominal infections, clinically similar to B. fragilis.",
    breakpoint_base: "Bacteroides_fragilis",
    specific_breakpoints: {}
  },

  "Bacteroides_thetaiotaomicron": {
    category: "Anaerobes",
    clsi_table: "Table 2J",
    source: "CLSI M100-Ed34",
    epidemiology: "Common gut commensal, opportunistic pathogen. Recommended ATCC strain for routine QC.",
    breakpoint_base: "Bacteroides_fragilis",
    specific_breakpoints: {}
  },

  "Prevotella_sp": {
    category: "Anaerobes",
    clsi_table: "Table 2J",
    source: "CLSI M100-Ed34",
    epidemiology: "Oral, dental, URT infections, aspiration pneumonia, PID.",
    common_resistance_mechanisms: ["Beta-lactamase production common", "Increasing clindamycin resistance"],
    intrinsic_resistance: [],
    antibiotics: {
      "penicillin": {
        clsi: { mic_breakpoints: {S: "≤0.25", I: "0.5", R: "≥1"}, tier: 1 },
        clinical_intelligence: {
          note: "Often ineffective for Prevotella due to beta-lactamase."
        }
      },
      "amoxicillin-clavulanate": { clsi: { mic_breakpoints: {S: "≤4/2", I: "8/4", R: "≥16/8"}, tier: 1 } },
      "piperacillin-tazobactam": { clsi: { mic_breakpoints: {S: "≤64/4", I: "128/4", R: "≥128/4"}, tier: 1 } },
      "ceftriaxone": { clsi: { mic_breakpoints: {S: "≤32", I: "64", R: "≥128"}, tier: 4 } },
      "meropenem": { clsi: { mic_breakpoints: {S: "≤4", I: "8", R: "≥16"}, tier: 2 } },
      "clindamycin": { clsi: { mic_breakpoints: {S: "≤2", I: "4", R: "≥8"}, tier: 1 } },
      "metronidazole": { clsi: { mic_breakpoints: {S: "≤8", I: "16", R: "≥32"}, tier: 1 } }
    }
  },

  "Fusobacterium_sp": {
    category: "Anaerobes",
    clsi_table: "Table 2J",
    source: "CLSI M100-Ed34",
    epidemiology: "Lemierre's syndrome (F. necrophorum), periodontal disease, intra-abdominal infections.",
    common_resistance_mechanisms: ["Beta-lactamase production is rare"],
    breakpoint_base: "Prevotella_sp",
    specific_breakpoints: {
      "penicillin": {
        clsi: { mic_breakpoints: {S: "≤0.25", I: "0.5", R: "≥1"}, tier: 1 },
        clinical_intelligence: {
          note: "Penicillin is drug of choice for F. necrophorum."
        }
      }
    }
  },

  "Clostridium_perfringens": {
    category: "Anaerobes",
    clsi_table: "Table 2J",
    source: "CLSI M100-Ed34",
    epidemiology: "Gas gangrene (myonecrosis), food poisoning, soft tissue infections.",
    common_resistance_mechanisms: [],
    intrinsic_resistance: [],
    antibiotics: {
      "penicillin": {
        clsi: { mic_breakpoints: {S: "≤0.25", I: "0.5", R: "≥1"}, tier: 1 },
        clinical_intelligence: {
          note: "Drug of choice; typically susceptible. For gas gangrene, use high-dose penicillin with clindamycin."
        }
      },
      "ampicillin": { clsi: { mic_breakpoints: {S: "≤0.5", I: "1", R: "≥2"}, tier: 1 } },
      "clindamycin": { clsi: { mic_breakpoints: {S: "≤2", I: "4", R: "≥8"}, tier: 1 } },
      "meropenem": { clsi: { mic_breakpoints: {S: "≤4", I: "8", R: "≥16"}, tier: 1 } },
      "metronidazole": { clsi: { mic_breakpoints: {S: "≤8", I: "16", R: "≥32"}, tier: 1 } }
    }
  },

  "Clostridium_septicum": {
    category: "Anaerobes",
    clsi_table: "Table 2J",
    source: "CLSI M100-Ed34",
    epidemiology: "Associated with malignancy (colon cancer), spontaneous gas gangrene.",
    breakpoint_base: "Clostridium_perfringens",
    specific_breakpoints: {}
  },

  "Paeniclostridium_sordellii": {
    category: "Anaerobes",
    clsi_table: "Table 2J",
    source: "CLSI M100-Ed34",
    epidemiology: "Toxic shock syndrome (gynecologic infections), skin/soft tissue infections.",
    breakpoint_base: "Clostridium_perfringens",
    specific_breakpoints: {}
  },

  "Actinomyces_sp": {
    category: "Anaerobes",
    clsi_table: "Table 2J",
    source: "CLSI M100-Ed34",
    epidemiology: "Actinomycosis (cervicofacial, thoracic, abdominal).",
    common_resistance_mechanisms: [],
    intrinsic_resistance: ["metronidazole"],
    antibiotics: {
      "penicillin": {
        clsi: { mic_breakpoints: {S: "≤0.25", I: "0.5", R: "≥1"}, tier: 1 },
        clinical_intelligence: {
          note: "Penicillin is highly active against Actinomyces."
        }
      },
      "amoxicillin": {
        clsi: { mic_breakpoints: {S: "≤0.25", I: "0.5", R: "≥1"}, tier: 1 },
        clinical_intelligence: { note: "Good oral step-down therapy for actinomycosis." }
      },
      "piperacillin-tazobactam": { clsi: { mic_breakpoints: {S: "≤64/4", I: "128/4", R: "≥128/4"}, tier: 1 } },
      "meropenem": { clsi: { mic_breakpoints: {S: "≤4", I: "8", R: "≥16"}, tier: 1 } },
      "clindamycin": { clsi: { mic_breakpoints: {S: "≤2", I: "4", R: "≥8"}, tier: 1 } }
    }
  },

  "Cutibacterium_acnes": {
    category: "Anaerobes",
    clsi_table: "Table 2J",
    source: "CLSI M100-Ed34",
    epidemiology: "Prosthetic joint and device-related infections.",
    common_resistance_mechanisms: [],
    intrinsic_resistance: ["metronidazole"],
    antibiotics: {
      "penicillin": {
        clsi: { mic_breakpoints: {S: "≤0.06", I: null, R: "≥0.12"}, tier: 1 },
        clinical_intelligence: {
          note: "Breakpoints for C. acnes are significantly stricter."
        }
      },
      "piperacillin-tazobactam": { clsi: { mic_breakpoints: {S: "≤64/4", I: "128/4", R: "≥128/4"}, tier: 1 } },
      "meropenem": { clsi: { mic_breakpoints: {S: "≤4", I: "8", R: "≥16"}, tier: 1 } },
      "clindamycin": { clsi: { mic_breakpoints: {S: "≤2", I: "4", R: "≥8"}, tier: 1 } }
    }
  },
  // STANDALONE BACTERIA WITH UNIQUE PROFILES

  "Clostridioides_difficile": {
    category: "Anaerobes",
    clsi_table: "Not in general Table 2J",
    common_resistance_mechanisms: ["Metronidazole resistance emerging", "Quinolone resistance"],
    epidemiology: "Antibiotic-associated colitis, hospital-acquired diarrhea",
    note: "This organism has unique therapeutic agents not listed in the general anaerobe table and specific breakpoints.",
    antibiotics: {
      "metronidazole": {
        clsi: { mic_breakpoints: {S: "≤2", I: null, R: "≥4"}, tier: 1 },
        clinical_intelligence: { note: "Traditional for mild-moderate disease, but resistance is emerging." }
      },
      "vancomycin": {
        clsi: { mic_breakpoints: {S: "≤2", I: null, R: "≥4"}, tier: 1, note: "Not in general Anaerobes Table 2J." },
        clinical_intelligence: { note: "First-line for severe C. diff colitis (oral route)." }
      },
      "fidaxomicin": {
        clsi: { mic_breakpoints: {S: "≤4", I: null, R: "≥8"}, tier: 2, note: "Not in general Anaerobes Table 2J." },
        clinical_intelligence: { note: "Preferred for recurrent C. diff due to lower recurrence rates." }
      }
    }
  },

  "Finegoldia_magna": {
    category: "Anaerobes",
    clsi_table: "Table 2J (Gram-Positive Anaerobic Coccus)",
    source: "CLSI M100-Ed34",
    common_resistance_mechanisms: ["Clindamycin resistance can occur"],
    epidemiology: "Skin/soft tissue, bone/joint infections.",
    intrinsic_resistance: ["metronidazole"],
    note: "As a gram-positive coccus, it is intrinsically resistant to metronidazole.",
    antibiotics: {
      "penicillin": { clsi: { mic_breakpoints: {S: "≤0.5", I: "1", R: "≥2"}, tier: 1 } },
      "amoxicillin-clavulanate": { clsi: { mic_breakpoints: {S: "≤4/2", I: "8/4", R: "≥16/8"}, tier: 1 } },
      "piperacillin-tazobactam": { clsi: { mic_breakpoints: {S: "≤64/4", I: "128/4", R: "≥128/4"}, tier: 1 } },
      "meropenem": { clsi: { mic_breakpoints: {S: "≤4", I: "8", R: "≥16"}, tier: 1 } },
      "clindamycin": { clsi: { mic_breakpoints: {S: "≤2", I: "4", R: "≥8"}, tier: 1 } }
    }
  },

  "Eggerthella_lenta": {
    category: "Anaerobes",
    clsi_table: "Table 2J",
    source: "CLSI M100-Ed34",
    common_resistance_mechanisms: ["Resistance to beta-lactams and clindamycin can occur"],
    epidemiology: "Bacteremia, intra-abdominal infections, often in immunocompromised patients.",
    intrinsic_resistance: ["metronidazole"],
    note: "Belongs to non-spore-forming, gram-positive anaerobic rods often resistant to metronidazole. Susceptibility testing is crucial.",
    antibiotics: {
      "piperacillin-tazobactam": { clsi: { mic_breakpoints: {S: "≤64/4", I: "128/4", R: "≥128/4"}, tier: 1 } },
      "meropenem": { clsi: { mic_breakpoints: {S: "≤4", I: "8", R: "≥16"}, tier: 1 } },
      "clindamycin": { clsi: { mic_breakpoints: {S: "≤2", I: "4", R: "≥8"}, tier: 1 } },
      "chloramphenicol": { clsi: { mic_breakpoints: {S: "≤8", I: "16", R: "≥32"}, tier: 2 } }
    }
  }
};
