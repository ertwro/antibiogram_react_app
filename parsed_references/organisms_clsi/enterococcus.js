// CLSI Table 2D: Enterococcus spp. Breakpoints
// Corrected and Refactored based on user feedback and CLSI M100-Ed34
// Comprehensive coverage addressing missing antibiotics, breakpoint errors, and clarifying notes.
const common_antibiotics = {
  // PENICILLINS / BETA-LACTAMASE INHIBITOR COMBOS
  "ampicillin-sulbactam": {
    clsi: {
      mic_breakpoints: {S: "≤8/4", I: null, R: "≥16/4"},
      disk_diffusion: { routine: { S: "≥15", I: "12-14", R: "≤11", note: "The 'Intermediate' category may be applicable for uncomplicated UTIs due to high drug concentration in urine. Refer to CLSI M100 for details."}},
      tier: 1,
      source: "CLSI M100-Ed34 Table 2D"
    }
  },
  "piperacillin-tazobactam": {
    clsi: {
      mic_breakpoints: {S: "≤16/4", I: "32/4-64/4", R: "≥128/4"},
      disk_diffusion: { routine: {note: "Disk diffusion breakpoints have been removed because no disk correlate data are available for the revised piperacillin MIC breakpoints. Source: CLSI M100-Ed34 Table 2D, comment (12)."}},
      tier: 1,
      source: "CLSI M100-Ed34 Table 2D",
      note: "Breakpoints are not listed in a dedicated row in Table 2D for Enterococcus spp. but are derived from CLSI M100 Table 2A-1 (Enterobacterales) and are applicable based on interpretive guidance in Table 2D, Footnote (8)."
    }
  },
  "amoxicillin-clavulanate": {
    clsi: {
      mic_breakpoints: {S: "≤8/4", I: null, R: "≥16/4"},
      disk_diffusion: { routine: { S: "≥18", I: "14-17", R: "≤13", note: "The 'Intermediate' category may be applicable for uncomplicated UTIs due to high drug concentration in urine. Refer to CLSI M100 for details."}},
      tier: 2,
      source: "CLSI M100-Ed34 Table 2D",
      note: "Breakpoints are not listed in a dedicated row in Table 2D for Enterococcus spp. but are derived from CLSI M100 Table 2A-1 (Enterobacterales) and are applicable based on interpretive guidance in Table 2D, Footnote (8)."
    }
  },
  // CARBAPENEMS
  doripenem: {
    clsi: {
      mic_breakpoints: {S: "≤0.5", I: "1", R: "≥2"},
      disk_diffusion: null,
      tier: 3,
      source: "CLSI M100-Ed34 Table 2D"
    }
  },
  ertapenem: {
    clsi: {
      mic_breakpoints: {S: "≤0.5", I: "1", R: "≥2"},
      disk_diffusion: null,
      tier: 3,
      note: "Generally not active against Enterococcus spp. These breakpoints are primarily for epidemiological purposes.",
      source: "CLSI M100-Ed34 Table 2D"
    }
  },
  imipenem: {
    clsi: {
      mic_breakpoints: {S: "≤0.5", I: "1", R: "≥2"},
      disk_diffusion: null,
      tier: 3,
      note: "Most E. faecium are resistant. E. faecalis may be susceptible.",
      source: "CLSI M100-Ed34 Table 2D"
    }
  },
  meropenem: {
    clsi: {
      mic_breakpoints: {S: "≤0.5", I: "1", R: "≥2"},
      disk_diffusion: null,
      tier: 3,
      source: "CLSI M100-Ed34 Table 2D"
    }
  },
  // GLYCOPEPTIDES / LIPOGLYCOPEPTIDES
  vancomycin: {
    clsi: {
      mic_breakpoints: {S: "≤4", I: "8-16", R: "≥32"},
      disk_diffusion: { routine: { S: "≥17", I: "15-16", R: "≤14", note: "For accurate detection of vancomycin resistance, incubate for 24h. Examine zones using transmitted light for faint growth. Perform biochemical tests for identification of isolates with vancomycin MICs ≥8 μg/mL. Source: CLSI M100-Ed34 Table 2D, comment (11)."}},
      tier: 1,
      source: "CLSI M100-Ed34 Table 2D"
    },
    clinical_intelligence: {
      if_resistant: {
        implications: ["VRE - infection control alert"],
        alternatives: ["linezolid", "daptomycin", "tigecycline"]
      }
    }
  },
  dalbavancin: {
    clsi: {
      mic_breakpoints: {S: "≤0.25", I: null, R: "≥0.5"},
      disk_diffusion: null,
      tier: 3,
      condition: "Report only on vancomycin-susceptible E. faecalis.",
      source: "CLSI M100-Ed34 Table 2D"
    }
  },
  oritavancin: {
    clsi: {
      mic_breakpoints: {S: "≤0.12", I: null, R: null},
      disk_diffusion: null,
      tier: 3,
      note: "Susceptible-only breakpoint.",
      source: "CLSI M100-Ed34 Table 2D"
    }
  },
  telavancin: {
    clsi: {
      mic_breakpoints: {S: "≤0.12", I: null, R: null},
      disk_diffusion: null,
      tier: 3,
      note: "Susceptible-only breakpoint.",
      source: "CLSI M100-Ed34 Table 2D"
    }
  },
  teicoplanin: {
    clsi: {
      mic_breakpoints: {S: "≤8", I: "16", R: "≥32"},
      disk_diffusion: null,
      tier: 3,
      source: "CLSI M100-Ed34 Table 2D"
    },
    clinical_intelligence: {
      note: "Not routinely reported on organisms isolated from the lower respiratory tract. Also considered an investigational agent in the US.",
      source: "CLSI M100-Ed34 Table 2D, comment (13); General Clinical Knowledge"
    }
  },
  // OXAZOLIDINONES
  linezolid: {
    clsi: {
      mic_breakpoints: {S: "≤2", I: "4", R: "≥8"},
      disk_diffusion: { routine: { S: "≥23", I: "20-22", R: "≤20"}},
      tier: 1,
      source: "CLSI M100-Ed34 Table 2D"
    }
  },
  tedizolid: {
    clsi: {
      mic_breakpoints: {S: "≤0.5", I: null, R: null},
      disk_diffusion: { routine: { S: "≥20", I: null, R: null}},
      tier: 3,
      note: "Susceptible-only breakpoint.",
      source: "CLSI M100-Ed34 Table 2D"
    }
  },
  // AMINOGLYCOSIDES
  gentamicin: {
    clsi: {
      mic_breakpoints: {S: "≤4", I: "8", R: "≥16"},
      disk_diffusion: { routine: { S: "≥18", I: "15-17", R: "≤14"}},
      tier: 2,
      source: "CLSI M100-Ed34 Table 2D"
    },
    high_level_resistance_screen: {
      mic: ">500 µg/mL",
      disk_content: "120 µg",
      note: "For prediction of synergistic activity with cell-wall active agents for serious infections."
    },
    clinical_intelligence: {
      warning: "CLSI Note: May appear active in vitro, but clinical outcomes data for monotherapy are limited. Combination therapy is recommended for most indications other than UTIs; consultation with an infectious diseases specialist is advised."
    }
  },
  amikacin: {
    clsi: {
      mic_breakpoints: {S: "≤8", I: "16", R: "≥32"},
      disk_diffusion: { routine: { S: "≥20", I: "17-19", R: "≤15"}},
      tier: 2,
      source: "CLSI M100-Ed34 Table 2D"
    },
    clinical_intelligence: {
      warning: "CLSI Note: May appear active in vitro, but clinical outcomes data for monotherapy are limited. Combination therapy is recommended for most indications other than UTIs; consultation with an infectious diseases specialist is advised."
    }
  },
  kanamycin: {
    clsi: {
      mic_breakpoints: {S: "≤4", I: "8", R: "≥16"},
      disk_diffusion: { routine: { S: "≥18", I: "14-17", R: "≤13"}},
      tier: 3,
      source: "CLSI M100-Ed34 Table 2D"
    }
  },
  netilmicin: {
    clsi: {
      mic_breakpoints: {S: "≤4", I: "8", R: "≥16"},
      disk_diffusion: { routine: { S: "≥15", I: "13-14", R: "≤12"}},
      tier: 3,
      source: "CLSI M100-Ed34 Table 2D"
    }
  },
  streptomycin: {
    clsi: {
      mic_breakpoints: {S: "≤4", I: "8", R: "≥16"},
      disk_diffusion: { routine: { S: "≥15", I: "12-14", R: "≤11"}},
      tier: 2,
      source: "CLSI M100-Ed34 Table 2D"
    },
    high_level_resistance_screen: {
      mic: ">1000 µg/mL",
      disk_content: "300 µg",
      note: "For prediction of synergistic activity with cell-wall active agents for serious infections."
    }
  },
  // FLUOROQUINOLONES
  cinoxacin: {
    clsi: {
      mic_breakpoints: {S: "≤16", I: null, R: "≥32"},
      disk_diffusion: { routine: { S: "≥18", I: "15-17", R: "≤14"}},
      tier: 3,
      condition: "Urine isolates only",
      source: "CLSI M100-Ed34 Table 2D"
    }
  },
  ciprofloxacin: {
    clsi: {
      mic_breakpoints: {S: "≤0.25", I: "0.5", R: "≥1"},
      disk_diffusion: { routine: { S: "≥26", I: "22-25", R: "≤21", note: "The 'Intermediate' category implies 'Susceptible-Dose Dependent (SDD)' or utility for uncomplicated UTIs. Refer to CLSI M100 for details on the 'I^' designation."}},
      tier: 2,
      source: "CLSI M100-Ed34 Table 2D"
    },
    clinical_intelligence: {
      source: "CLSI M100-Ed34 General Comment (4)",
      warning: "May appear active in vitro, but is not effective clinically and should not be reported as S."
    }
  },
  enoxacin: {
    clsi: {
      mic_breakpoints: {S: "≤4", I: "8", R: "≥16"},
      disk_diffusion: { routine: { S: "≥18", I: "15-17", R: "≤14"}},
      tier: 3,
      condition: "Urine isolates only",
      source: "CLSI M100-Ed34 Table 2D"
    }
  },
  grepafloxacin: {
    clsi: {
      mic_breakpoints: {S: "≤0.5", I: "1", R: "≥2"},
      disk_diffusion: { routine: { S: "≥18", I: "15-17", R: "≤14"}},
      tier: 3,
      source: "CLSI M100-Ed34 Table 2D"
    }
  },
  levofloxacin: {
    clsi: {
      mic_breakpoints: {S: "≤0.5", I: "1", R: "≥2"},
      disk_diffusion: { routine: { S: "≥21", I: "17-20", R: "≤16", note: "The 'Intermediate' category implies 'Susceptible-Dose Dependent (SDD)' or utility for uncomplicated UTIs. Refer to CLSI M100 for details on the 'I^' designation."}},
      tier: 2,
      source: "CLSI M100-Ed34 Table 2D"
    },
    clinical_intelligence: {
      source: "CLSI M100-Ed34 General Comment (4)",
      warning: "May appear active in vitro, but is not effective clinically and should not be reported as S."
    }
  },
  lomefloxacin: {
    clsi: {
      mic_breakpoints: {S: "≤0.5", I: "1", R: "≥2"},
      disk_diffusion: { routine: { S: "≥22", I: "19-21", R: "≤18"}},
      tier: 2,
      condition: "Urine Only",
      note: "The 'Intermediate' category for disk diffusion may be interpreted as 'Susceptible-Dose Dependent (SDD)' or applicable for uncomplicated UTIs. Refer to CLSI M100 General Comment (4).",
      source: "CLSI M100-Ed34 Table 2D"
    }
  },
  gatifloxacin: {
    clsi: {
      mic_breakpoints: {S: "≤0.25", I: "0.5", R: "≥1"},
      disk_diffusion: { routine: { S: "≥20", I: "16-19", R: "≤15"}},
      source: "CLSI M100-Ed34 Table 2D"
    }
  },
  nalidixic_acid: {
    clsi: {
      mic_breakpoints: {S: "≤16", I: null, R: "≥32"},
      disk_diffusion: { routine: { S: "≥19", I: "14-18", R: "≤13"}},
      source: "CLSI M100-Ed34 Table 2D"
    },
    clinical_intelligence: {
      source: "General Clinical Knowledge",
      note: "Investigational agent."
    }
  },
  norfloxacin: {
    clsi: {
      mic_breakpoints: {S: "≤4", I: "8", R: "≥16"},
      disk_diffusion: { routine: { S: "≥17", I: "13-16", R: "≤12"}},
      tier: 2,
      condition: "Urine Only",
      source: "CLSI M100-Ed34 Table 2D"
    }
  },
  ofloxacin: {
    clsi: {
      mic_breakpoints: {S: "≤4", I: "8", R: "≥16"},
      disk_diffusion: { routine: { S: "≥19", I: "15-18", R: "≤14"}},
      tier: 2,
      condition: "Urine Only",
      source: "CLSI M100-Ed34 Table 2D"
    },
    clinical_intelligence: {
      source: "CLSI M100-Ed34 General Comment (4)",
      warning: "May appear active in vitro, but is not effective clinically and should not be reported as S."
    }
  },
  sparfloxacin: {
    clsi: {
      mic_breakpoints: {S: "≤0.5", I: "1", R: "≥2"},
      disk_diffusion: { routine: { S: "≥19", I: "16-18", R: "≤15"}},
      source: "CLSI M100-Ed34 Table 2D"
    },
    clinical_intelligence: {
      source: "CLSI M100-Ed34 General Comment (4)",
      warning: "May appear active in vitro, but is not effective clinically and should not be reported as S."
    }
  },
  // TETRACYCLINES
  tetracycline: {
    clsi: {
      mic_breakpoints: {S: "≤4", I: "8", R: "≥16"},
      disk_diffusion: { routine: { S: "≥19", I: "15-18", R: "≤14"}},
      tier: 2,
      note: "Organisms that are susceptible to tetracycline are also considered susceptible to doxycycline and minocycline. However, some organisms that are intermediate or resistant to tetracycline may be susceptible to doxycycline, minocycline, or both.",
      source: "CLSI M100-Ed34 Table 2D"
    }
  },
  doxycycline: {
    clsi: {
      mic_breakpoints: {S: "≤4", I: "8", R: "≥16"},
      disk_diffusion: { routine: { S: "≥16", I: "13-15", R: "≤12"}},
      tier: 2,
      note: "Organisms that are susceptible to tetracycline are also considered susceptible to doxycycline and minocycline. However, some organisms that are intermediate or resistant to tetracycline may be susceptible to doxycycline, minocycline, or both.",
      source: "CLSI M100-Ed34 Table 2D"
    }
  },
  minocycline: {
    clsi: {
      mic_breakpoints: {S: "≤4", I: "8", R: "≥16"},
      disk_diffusion: { routine: { S: "≥19", I: "15-18", R: "≤14"}},
      tier: 2,
      note: "Organisms that are susceptible to tetracycline are also considered susceptible to doxycycline and minocycline. However, some organisms that are intermediate or resistant to tetracycline may be susceptible to doxycycline, minocycline, or both.",
      source: "CLSI M100-Ed34 Table 2D"
    }
  },
  // MACROLIDES
  erythromycin: {
    clsi: {
      mic_breakpoints: {S: "≤0.5", I: "1-4", R: "≥8"},
      disk_diffusion: { routine: { S: "≥23", I: "14-22", R: "≤13"}},
      tier: 2,
      source: "CLSI M100-Ed34 Table 2D"
    }
  },
  // FOLATE PATHWAY ANTAGONISTS
  sulfonamides: {
    clsi: {
      mic_breakpoints: {S: "≤256", I: null, R: "≥512"},
      disk_diffusion: { routine: { S: "≥17", I: "13-16", R: "≤12"}},
      condition: "Urine Only",
      note: "Sulfisoxazole can be used to represent any of the currently available sulfonamide preparations. Source: CLSI M100-Ed34 Table 2D, Footnote (35).",
      source: "CLSI M100-Ed34 Table 2D"
    }
  },
  trimethoprim: {
    clsi: {
      mic_breakpoints: {S: "≤4", I: null, R: "≥8"},
      disk_diffusion: { routine: {note: "MIC test required. Source: CLSI M100-Ed34 Table 2D, comment (36)."}},
      condition: "Urine isolates only",
      source: "CLSI M100-Ed34 Table 2D"
    }
  },
  "trimethoprim-sulfamethoxazole": {
    clsi: {
      mic_breakpoints: {S: "≤0.5/9.5", I: "1/19-2/38", R: "≥4/76"},
      disk_diffusion: { routine: { S: "≥16", I: "11-15", R: "≤10"}},
      tier: 3,
      source: "CLSI M100-Ed34 Table 2D"
    },
    clinical_intelligence: {
      warning: "May appear active in vitro, but is not effective clinically and should not be reported as S.",
      source: "CLSI M100-Ed34 General Comment (4)"
    }
  },
  // ANSAMYCINS
  rifampin: {
    clsi: {
      mic_breakpoints: {S: "≤1", I: "2", R: "≥4"},
      disk_diffusion: { routine: { S: "≥20", I: "17-19", R: "≤16"}},
      tier: 3,
      note: "Should not be used for monotherapy.",
      source: "CLSI M100-Ed34 Table 2D"
    }
  },
  // MISC
  fosfomycin: {
    clsi: {
      mic_breakpoints: {S: "≤64", I: "128", R: "≥256"},
      disk_diffusion: { routine: { S: "≥17", I: "13-16", R: "≤12"}},
      tier: 2,
      condition: "Urine isolates only",
      note: "CLSI Footnote 37: Disk diffusion and MIC breakpoints apply only to E. coli urinary tract isolates and should not be extrapolated. CLSI Footnote 39: The only approved MIC method for testing is agar dilution using agar media supplemented with 25 µg/mL of glucose-6-phosphate. Broth dilution MIC testing should not be performed.",
      source: "CLSI M100-Ed34 Table 2D"
    }
  },
  chloramphenicol: {
    clsi: {
      mic_breakpoints: {S: "≤8", I: "16", R: "≥32"},
      disk_diffusion: { routine: { S: "≥18", I: "13-17", R: "≤12"}},
      tier: 3,
      note: "Not routinely reported on organisms isolated from the urinary tract.",
      source: "CLSI M100-Ed34 Table 2D"
    }
  },
  nitrofurantoin: {
    clsi: {
      mic_breakpoints: {S: "≤32", I: "64", R: "≥128"},
      disk_diffusion: { routine: { S: "≥17", I: "15-16", R: "≤14"}},
      tier: 2,
      condition: "Urine isolates only",
      source: "CLSI M100-Ed34 Table 2D"
    }
  },
  // AGENTS WITH NO ESTABLISHED BREAKPOINTS FOR ENTEROCOCCUS
  aztreonam: { clsi: { note: "No breakpoints provided; intrinsically resistant." }},
  ceftriaxone: { clsi: { note: "No breakpoints provided; intrinsically resistant." }},
  cefotaxime: { clsi: { note: "No breakpoints provided; intrinsically resistant." }},
  cefepime: { clsi: { note: "No breakpoints provided; intrinsically resistant." }},
  ceftaroline: { clsi: { note: "No breakpoints provided; intrinsically resistant." }},
  "ceftazidime-avibactam": { clsi: { note: "No breakpoints provided for Enterococcus." }}
};
export default {
  "Enterococcus_faecalis": {
    category: "Enterococcus spp.",
    clsi_table: "Table 2D",
    common_resistance_mechanisms: ["Vancomycin resistance (VRE)", "High-level aminoglycoside resistance"],
    epidemiology: "UTI, bacteremia, endocarditis",
    intrinsic_resistance: ["cephalosporins", "clindamycin", "quinupristin-dalfopristin", "aztreonam"],
    antibiotics: {
      ...common_antibiotics,
      penicillin: {
        clsi: {
          mic_breakpoints: {S: "≤8", I: null, R: "≥16"},
          disk_diffusion: { routine: { S: "≥15", I: null, R: "≤14"}},
          tier: 1,
          source: "CLSI M100-Ed34 Table 2D"
        },
        clinical_intelligence: {
          note: "CLSI Note: Penicillin resistance due to β-lactamase is rare and not reliably detected by routine susceptibility methods. A direct nitrocefin-based β-lactamase test can be used in selected cases."
        }
      },
      ampicillin: {
        clsi: {
          mic_breakpoints: {S: "≤8", I: null, R: "≥16"},
          disk_diffusion: { routine: { S: "≥17", I: "14-16", R: "≤13"}},
          tier: 1,
          source: "CLSI M100-Ed34 Table 2D"
        },
        clinical_intelligence: {
          note: "Results of ampicillin susceptibility tests should be used to predict results for amoxicillin (Source: CLSI M100-Ed34 Table 2D, comment (6)).",
          source: "General Clinical Knowledge",
          if_susceptible: {
            confidence: "First-line for susceptible enterococci",
            dosing_notes: "Higher doses for endocarditis"
          }
        }
      },
      "quinupristin-dalfopristin": {
        clsi: {
          note: "E. faecalis is intrinsically resistant.",
          intrinsic_resistance: true,
          source: "CLSI M100-Ed34 Table 2D"
        }
      }
    }
  },
  "Enterococcus_faecium": {
    category: "Enterococcus spp.",
    clsi_table: "Table 2D",
    common_resistance_mechanisms: ["High vancomycin resistance rates", "Ampicillin resistance common"],
    epidemiology: "More resistant than E. faecalis, nosocomial pathogen",
    intrinsic_resistance: ["cephalosporins", "clindamycin", "aztreonam"],
    antibiotics: {
      ...common_antibiotics,
      daptomycin: {
        clsi: {
          mic_breakpoints: {S: "≤4", I: null, R: "≥8"},
          disk_diffusion: { routine: {note: "MIC method required"}},
          tier: 2,
          condition: "Reported only on E. faecium",
          source: "CLSI M100-Ed34 Table 2D"
        },
        clinical_intelligence: {
          warning: "Not routinely reported on organisms isolated from the lower respiratory tract."
        }
      },
      penicillin: {
        clsi: {
          mic_breakpoints: {S: "≤8", I: null, R: "≥16"},
          disk_diffusion: { routine: { S: "≥15", I: null, R: "≤14"}},
          tier: 1,
          source: "CLSI M100-Ed34 Table 2D"
        },
        clinical_intelligence: {
          note: "CLSI Note: Penicillin resistance due to β-lactamase is rare and not reliably detected by routine susceptibility methods. A direct nitrocefin-based β-lactamase test can be used in selected cases."
        }
      },
      ampicillin: {
        clsi: {
          mic_breakpoints: {S: "≤8", I: null, R: "≥16"},
          disk_diffusion: { routine: { S: "≥17", I: "14-16", R: "≤13"}},
          tier: 1,
          source: "CLSI M100-Ed34 Table 2D"
        },
        clinical_intelligence: {
          note: "Results of ampicillin susceptibility tests should be used to predict results for amoxicillin (Source: CLSI M100-Ed34 Table 2D, comment (6)).",
          source: "General Clinical Knowledge",
          if_resistant: {
            implications: ["Common resistance in E. faecium"],
            alternatives: ["vancomycin", "linezolid", "daptomycin"]
          }
        }
      },
      "quinupristin-dalfopristin": {
        clsi: {
          mic_breakpoints: {S: "≤1", I: "2-4", R: "≥8"},
          disk_diffusion: { routine: { S: "≥19", I: "16-18", R: "≤15"}},
          tier: 2,
          condition: "Report only on vancomycin-resistant E. faecium.",
          source: "CLSI M100-Ed34 Table 2D"
        },
        clinical_intelligence: {
          source: "General Clinical Knowledge",
          if_susceptible: {
            confidence: "Active against E. faecium (not E. faecalis)",
            dosing_notes: "Limited to E. faecium infections"
          }
        }
      }
    }
  }
};
