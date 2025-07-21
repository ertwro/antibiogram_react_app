// CLSI Table 2B-2, 1B-2, & 3F-4: Acinetobacter spp. Breakpoints
// This file contains comprehensive and accurate data based on CLSI M100-Ed34.
// Data has been revised to include context-specific breakpoints for direct blood culture testing (Table 3F-4).

export default {
  "Acinetobacter_sp(baumannii_-_calcoaceticus)": {
    category: "Non-Enterobacterales",
    clsi_table: "Table 2B-2 (Routine Breakpoints), Table 1B-2 (Tiers), Table 3F-4 (Direct Blood Culture Breakpoints)",
    source: "CLSI M100-Ed34",
    notes: [
      "Routine Testing Conditions:",
      "Medium: Disk diffusion: Mueller-Hinton Agar (MHA); Broth dilution: Cation-adjusted Mueller-Hinton Broth (CAMHB), iron-depleted CAMHB for cefiderocol; Agar dilution: MHA.",
      "Inoculum: Broth culture method or colony suspension, equivalent to a 0.5 McFarland standard.",
      "Incubation: 35°C ± 2°C, ambient air. Disk diffusion: 16–18 hours; Dilution methods: 18–20 hours."
    ],
    epidemiology: "Acinetobacter spp., particularly A. baumannii complex, are significant nosocomial pathogens known for multidrug resistance, causing infections like pneumonia, bacteremia, and UTIs.",

    antibiotics: {
      // PENICILLINS
      "piperacillin": {
        clsi: {
          mic_breakpoints: { S: "≤16", I: "32-64", R: "≥128" },
          disk_diffusion: { routine: { S: "≥21", I: "18-20", R: "≤17" } }
        },
        condition: "Not listed in CLSI M100 Table 1B-2 for routine testing/reporting against Acinetobacter spp."
      },

      // β-LACTAM COMBINATION AGENTS
      "ampicillin-sulbactam": {
        clsi: {
          mic_breakpoints: { S: "≤8/4", I: "16/8", R: "≥32/16" },
          disk_diffusion: {
            routine: { S: "≥15", I: "12-14", R: "≤11" },
            direct_blood_culture: { S: "≥15", I: "12-14", R: "≤11" }
          },
          tier: 1
        }
      },
      "piperacillin-tazobactam": {
        clsi: {
          mic_breakpoints: { S: "≤16/4", I: "32/4-64/4", R: "≥128/4" },
          disk_diffusion: {
            routine: { S: "≥21", I: "18-20", R: "≤17" },
            direct_blood_culture: { S: "≥21", I: "18-20", R: "≤17" }
          },
          tier: 2
        }
      },
      "sulbactam-durlobactam": {
        clsi: {
          mic_breakpoints: { S: "≤4/4", I: "8/4", R: "≥16/4" },
          disk_diffusion: {
            routine: { S: "≥17", I: "14-16", R: "≤13" },
            direct_blood_culture: { S: "≥17", I: "14-16", R: "≤13" }
          },
          tier: 3
        }
      },
      "ticarcillin-clavulanate": {
        clsi: {
          mic_breakpoints: { S: "≤16/2", I: "32/2-64/2", R: "≥128/2" },
          disk_diffusion: { routine: { S: "≥20", I: "15-19", R: "≤14" } }
        },
        condition: "Not listed in CLSI M100 Table 1B-2 for routine testing/reporting against Acinetobacter spp."
      },

      // CEPHEMS (PARENTERAL)
      "ceftazidime": {
        clsi: {
          mic_breakpoints: { S: "≤8", I: "16", R: "≥32" },
          disk_diffusion: {
            routine: { S: "≥18", I: "15-17", R: "≤14" }, // Corrected: Restored routine breakpoints as per Table 2B-2
            direct_blood_culture: { S: "≥17", I: "14-16", R: "≤13" }
          },
          tier: 1
        },
        condition: "Direct blood culture breakpoints (Table 3F-4) differ from routine breakpoints (Table 2B-2)." // Corrected condition
      },
      "cefepime": {
        clsi: {
          mic_breakpoints: { S: "≤8", I: "16", R: "≥32" },
          disk_diffusion: {
            routine: { S: "≥18", I: "15-17", R: "≤14" },
            direct_blood_culture: { S: "≥18", I: "15-17", R: "≤14" }
          },
          tier: 1
        }
      },
      "cefotaxime": {
        clsi: {
          mic_breakpoints: { S: "≤8", I: "16", R: "≥32" },
          disk_diffusion: { routine: { S: "≥23", I: "15-22", R: "≤14" } },
          tier: 4
        }
      },
      "ceftriaxone": {
        clsi: {
          mic_breakpoints: { S: "≤8", I: "16", R: "≥32" },
          disk_diffusion: { routine: { S: "≥21", I: "14-20", R: "≤13" } },
          tier: 4
        }
      },
      "cefiderocol": {
        clsi: {
          mic_breakpoints: { S: "≤4", I: "8", R: "≥16" },
          disk_diffusion: { routine: { S: "≥15", I: null, R: null } },
          tier: 3
        },
        condition: "Report only on A. baumannii complex. For disk diffusion, zones ≤14 mm require an MIC test for confirmation."
      },

      // CARBAPENEMS
      "imipenem": {
        clsi: {
          mic_breakpoints: { S: "≤2", I: "4", R: "≥8" },
          disk_diffusion: {
            routine: { S: "≥22", I: "19-21", R: "≤18" },
            direct_blood_culture: { S: "≥22", I: "19-21", R: "≤18" }
          },
          tier: 2
        }
      },
      "meropenem": {
        clsi: {
          mic_breakpoints: { S: "≤2", I: "4", R: "≥8" },
          disk_diffusion: {
            routine: { S: "≥18", I: "15-17", R: "≤14" },
            direct_blood_culture: { S: "≥18", I: "15-17", R: "≤14" }
          },
          tier: 2
        }
      },
      "doripenem": {
        clsi: {
          mic_breakpoints: { S: "≤2", I: "4", R: "≥8" },
          disk_diffusion: { routine: { S: "≥19", I: "15-18", R: "≤14" } }
        },
        condition: "Not listed in CLSI M100 Table 1B-2 for routine testing/reporting against Acinetobacter spp."
      },

      // LIPOPEPTIDES
      // or polymyxin B
      "colistin": {
        clsi: {
          mic_breakpoints: { S: "≤2", I: null, R: "≥4" },
          disk_diffusion: null,
          tier: 4 // "Urine Only"
        },
        condition: "Warning: Limited clinical efficacy. Use in combination with other active agents and consult with an infectious diseases specialist. Tier is 'Urine Only' in Table 1B-2."
      },

      // AMINOGLYCOSIDES
      "gentamicin": {
        clsi: {
          mic_breakpoints: { S: "≤4", I: "8", R: "≥16" },
          disk_diffusion: {
            routine: { S: "≥15", I: "13-14", R: "≤12" },
            direct_blood_culture: { S: "≥15", I: "13-14", R: "≤12" }
          },
          tier: 1
        }
      },
      "tobramycin": {
        clsi: {
          mic_breakpoints: { S: "≤4", I: "8", R: "≥16" },
          disk_diffusion: {
            routine: { S: "≥15", I: "13-14", R: "≤12" },
            direct_blood_culture: { S: "≥15", I: "13-14", R: "≤12" }
          },
          tier: 1
        }
      },
      "amikacin": {
        clsi: {
          mic_breakpoints: { S: "≤16", I: "32", R: "≥64" },
          disk_diffusion: {
            routine: { S: "≥17", I: "15-16", R: "≤14" },
            direct_blood_culture: { S: "≥17", I: "15-16", R: "≤14" }
          },
          tier: 2
        }
      },
      "netilmicin": {
        clsi: {
          mic_breakpoints: { S: "≤4", I: "8", R: "≥16" },
          disk_diffusion: { routine: null } // Corrected: Removed unsupported disk diffusion breakpoints
        },
        condition: "Not listed in CLSI M100 Table 1B-2 for routine testing/reporting against Acinetobacter spp. No disk diffusion breakpoints are provided in Table 2B-2."
      },

      // TETRACYCLINES
      "doxycycline": {
        clsi: {
          mic_breakpoints: { S: "≤4", I: "8", R: "≥16" },
          disk_diffusion: { routine: { S: "≥13", I: "10-12", R: "≤9" } },
          tier: 4
        }
      },
      "minocycline": {
        clsi: {
          mic_breakpoints: null,
          disk_diffusion: { routine: { S: "≥16", I: "13-15", R: "≤12" } },
          tier: 2
        },
        condition: "MIC breakpoints were removed in CLSI M100-Ed34 (Feb 2024). Note: CLSI document has internal contradiction regarding disk diffusion breakpoints (listed in Table 2B-2, but noted as removed in 'Overview of Changes'). Table 2B-2 data is retained here."
      },
      "tetracycline": {
        clsi: {
          mic_breakpoints: { S: "≤4", I: "8", R: "≥16" },
          disk_diffusion: { routine: { S: "≥17", I: "14-16", R: "≤11" } },
          tier: 4 // "Urine Only"
        },
        condition: "For uncomplicated UTIs only. Tier is 'Urine Only' in Table 1B-2."
      },

      // FLUOROQUINOLONES
      "ciprofloxacin": {
        clsi: {
          mic_breakpoints: { S: "≤1", I: "2", R: "≥4" },
          disk_diffusion: {
            routine: { S: "≥21", I: "16-20", R: "≤15" },
            direct_blood_culture: { S: "≥21", I: "16-20", R: "≤15" }
          },
          tier: 1
        }
      },
      "levofloxacin": {
        clsi: {
          mic_breakpoints: { S: "≤2", I: "4", R: "≥8" },
          disk_diffusion: {
            routine: { S: "≥17", I: "14-16", R: "≤13" },
            direct_blood_culture: { S: "≥17", I: "14-16", R: "≤13" }
          },
          tier: 1
        }
      },
      "gatifloxacin": {
        clsi: {
          mic_breakpoints: { S: "≤2", I: "4", R: "≥8" },
          disk_diffusion: { routine: { S: "≥18", I: "15-17", R: "≤14" } }
        },
        condition: "Not listed in CLSI M100 Table 1B-2 for routine testing/reporting against Acinetobacter spp."
      },

      // FOLATE PATHWAY ANTAGONISTS
      "trimethoprim-sulfamethoxazole": {
        clsi: {
          mic_breakpoints: { S: "≤2/38", I: null, R: "≥4/76" },
          disk_diffusion: {
            routine: null,
            direct_blood_culture: { S: "≥16", I: "11-15", R: "≤10" }
          },
          tier: 2
        },
        condition: "Routine disk diffusion breakpoints were removed in CLSI M100-Ed34 (Feb 2024). Direct blood culture breakpoints are from Table 3F-4."
      }
    }
  }
};
