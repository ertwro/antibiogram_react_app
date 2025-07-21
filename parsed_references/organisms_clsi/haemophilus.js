// CLSI Table 2E: Haemophilus spp. Breakpoints
// Final correction based on CLSI M100-Ed34.
// Corrected explanatory notes for Ceftolozane-tazobactam to align with CLSI comment 14.
// Synced H. parainfluenzae antibiotic panel with H. influenzae as per CLSI guidelines.

export default {
  "Haemophilus_influenzae": {
    category: "Haemophilus spp.",
    clsi_table: "Table 2E",
    common_resistance_mechanisms: ["Beta-lactamase production (TEM-1)", "AmpC rare"],
    epidemiology: "Respiratory infections, meningitis (rare post-vaccine)",
    intrinsic_resistance: [],

    antibiotics: {
      // Beta-lactamase testing critical
      ampicillin: {
        clsi: {
          mic_breakpoints: {S: "≤1", I: "2", R: "≥4"},
          disk_diffusion: { routine: { S: "≥22", I: "19-21", R: "≤18"}},
          tier: 1,
          source: "CLSI M100-Ed34 Table 2E"
        },
        clinical_intelligence: {
          special_testing: {
            beta_lactamase_test: "Required for all isolates",
            interpretation: "Positive = ampicillin resistant regardless of MIC"
          }
        }
      },

      "amoxicillin-clavulanate": {
        clsi: {
          mic_breakpoints: {S: "≤2/2", I: "2.1/2", R: "≥4/2"},
          disk_diffusion: { routine: { S: "≥20", I: "17-19", R: "≤16"}},
          tier: 1,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      "ampicillin-sulbactam": {
        clsi: {
          mic_breakpoints: {S: "≤2/4", I: "2.1/4", R: "≥4/2"},
          disk_diffusion: { routine: { S: "≥21", I: "19-20", R: "≤18"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      "piperacillin-tazobactam": {
        clsi: {
          mic_breakpoints: {S: "≤1/4", I: "2/4", R: "≥4/4"},
          disk_diffusion: { routine: {note: "Additional disk correlate data are pending before disk diffusion breakpoints with the dosage regimen listed in Table 2 Dosages can be established"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      // Parenteral Cephalosporins
      cefotaxime: {
        clsi: {
          mic_breakpoints: {S: "≤2", I: "null", R: "≥4"},
          disk_diffusion: { routine: { S: "≥26", I: "null", R: "≤25"}},
          tier: 1,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      ceftriaxone: {
        clsi: {
          mic_breakpoints: {S: "≤2", I: "null", R: "≥4"},
          disk_diffusion: { routine: { S: "≥26", I: "null", R: "≤25"}},
          tier: 1,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      cefepime: {
        clsi: {
          mic_breakpoints: {S: "≤2", I: "null", R: "≥4"},
          disk_diffusion: { routine: { S: "≥26", I: "null", R: "≤25"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      cefazolin: {
        clsi: {
          mic_breakpoints: {S: "≤2", I: "null", R: "≥4"},
          disk_diffusion: { routine: { S: "≥26", I: "null", R: "≤25"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      cefuroxime_parenteral: {
        clsi: {
          mic_breakpoints: {S: "≤4", I: "8", R: "≥16"},
          disk_diffusion: { routine: { S: "≥20", I: "17-19", R: "≤16"}},
          tier: 1,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      cefamandole: {
        clsi: {
          mic_breakpoints: {S: "≤4", I: "8", R: "≥16"},
          disk_diffusion: { routine: { S: "≥26", I: "null", R: "≤25"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      cefonicid: {
        clsi: {
          mic_breakpoints: {S: "≤2", I: "null", R: "≥4"},
          disk_diffusion: { routine: { S: "≥26", I: "null", R: "≤25"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      ceftizoxime: {
        clsi: {
          mic_breakpoints: {S: "≤2", I: "null", R: "≥4"},
          disk_diffusion: { routine: { S: "≥26", I: "null", R: "≤25"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      moxalactam: {
        clsi: {
          mic_breakpoints: {S: "≤4", I: "8", R: "≥16"},
          disk_diffusion: { routine: { S: "≥26", I: "null", R: "≤25"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      "ceftolozane-tazobactam": {
        clsi: {
          mic_breakpoints: {S: "≤0.5/4", I: "null", R: "≥1/4"},
          disk_diffusion: { routine: {note: "Additional disk correlate data are pending before disk diffusion breakpoints with the dosage regimen listed in Table 2 Dosages can be established"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      // Oral cephalosporins
      cefaclor: {
        clsi: {
          mic_breakpoints: {S: "≤4", I: "8", R: "≥16"},
          disk_diffusion: { routine: { S: "≥20", I: "17-19", R: "≤16"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      cefuroxime_oral: {
        clsi: {
          mic_breakpoints: {S: "≤4", I: "8", R: "≥16"},
          disk_diffusion: { routine: { S: "≥23", I: "15-22", R: "≤14"}},
          tier: 1,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      cefdinir: {
        clsi: {
          mic_breakpoints: {S: "≤1", I: "null", R: "≥2"},
          disk_diffusion: { routine: { S: "≥20", I: "null", R: "≤19"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      cefixime: {
        clsi: {
          mic_breakpoints: {S: "≤1", I: "null", R: "≥2"},
          disk_diffusion: { routine: { S: "≥19", I: "null", R: "≤18"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      cefpodoxime: {
        clsi: {
          mic_breakpoints: {S: "≤0.5", I: "null", R: "≥1"},
          disk_diffusion: { routine: { S: "≥26", I: "null", R: "≤25"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      cefprozil: {
        clsi: {
          mic_breakpoints: {S: "≤8", I: "16", R: "≥32"},
          disk_diffusion: { routine: { S: "≥18", I: "15-17", R: "≤14"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      cefetamet: {
        clsi: {
          mic_breakpoints: {S: "≤2", I: "null", R: "≥4"},
          disk_diffusion: { routine: { S: "≥18", I: "15-17", R: "≤14"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      cefoxitin: {
        clsi: {
          mic_breakpoints: {S: "≤4", I: "8", R: "≥16"},
          disk_diffusion: { routine: { S: "≥17", I: "14-16", R: "≤13"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      loracarbef: {
        clsi: {
          mic_breakpoints: {S: "≤8", I: "16", R: "≥32"},
          disk_diffusion: { routine: { S: "≥18", I: "15-17", R: "≤14"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      // Other Beta-lactams
      aztreonam: {
        clsi: {
          mic_breakpoints: {S: "≤4", I: "null", R: "≥8"},
          disk_diffusion: { routine: { S: "≥26", I: "null", R: "≤25"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      // Carbapenems
      meropenem: {
        clsi: {
          mic_breakpoints: {S: "≤0.5", I: "null", R: "≥1"},
          disk_diffusion: { routine: { S: "≥20", I: "null", R: "≤19"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      ertapenem: {
        clsi: {
          mic_breakpoints: {S: "≤0.5", I: "null", R: "≥1"},
          disk_diffusion: { routine: { S: "≥19", I: "null", R: "≤18"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      imipenem: {
        clsi: {
          mic_breakpoints: {S: "≤4", I: "null", R: "≥8"},
          disk_diffusion: { routine: { S: "≥16", I: "null", R: "≤15"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      doripenem: {
        clsi: {
          mic_breakpoints: {S: "≤0.5", I: "null", R: "≥1"},
          disk_diffusion: { routine: { S: "≥19", I: "null", R: "≤18"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      // Macrolides
      azithromycin: {
        clsi: {
          mic_breakpoints: {S: "≤2", I: "4", R: "≥8"},
          disk_diffusion: { routine: { S: "≥18", I: "14-17", R: "≤13"}},
          tier: 1,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      clarithromycin: {
        clsi: {
          mic_breakpoints: {S: "≤8", I: "16", R: "≥32"},
          disk_diffusion: { routine: { S: "≥13", I: "11-12", R: "≤10"}},
          tier: 1,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      dirithromycin: {
        clsi: {
          mic_breakpoints: {S: "≤0.5", I: "1", R: "≥2"},
          disk_diffusion: { routine: { S: "≥18", I: "14-17", R: "≤13"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      // Quinolones
      ciprofloxacin: {
        clsi: {
          mic_breakpoints: {S: "≤1", I: "null", R: "≥2"},
          disk_diffusion: { routine: { S: "≥21", I: "null", R: "≤20"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      levofloxacin: {
        clsi: {
          mic_breakpoints: {S: "≤2", I: "null", R: "≥4"},
          disk_diffusion: { routine: { S: "≥17", I: "null", R: "≤16"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      moxifloxacin: {
        clsi: {
          mic_breakpoints: {S: "≤0.5", I: "1", R: "≥2"},
          disk_diffusion: { routine: { S: "≥18", I: "null", R: "≤17"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      gemifloxacin: {
        clsi: {
          mic_breakpoints: {S: "≤0.03", I: "null", R: "≥0.06"},
          disk_diffusion: { routine: { S: "≥16", I: "null", R: "≤15"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      gatifloxacin: {
        clsi: {
          mic_breakpoints: {S: "≤0.5", I: "null", R: "≥1"},
          disk_diffusion: { routine: { S: "≥18", I: "null", R: "≤17"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      grepafloxacin: {
        clsi: {
          mic_breakpoints: {S: "≤0.5", I: "null", R: "≥1"},
          disk_diffusion: { routine: { S: "≥24", I: "null", R: "≤23"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      lomefloxacin: {
        clsi: {
          mic_breakpoints: {S: "≤0.5", I: "null", R: "≥1"},
          disk_diffusion: { routine: { S: "≥22", I: "null", R: "≤21"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      norfloxacin: {
        clsi: {
          mic_breakpoints: {S: "≤2", I: "null", R: "≥4"},
          disk_diffusion: { routine: { S: "≥17", I: "null", R: "≤16"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      ofloxacin: {
        clsi: {
          mic_breakpoints: {S: "≤1", I: "null", R: "≥2"},
          disk_diffusion: { routine: { S: "≥18", I: "null", R: "≤17"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      sparfloxacin: {
        clsi: {
          mic_breakpoints: {S: "≤0.5", I: "1", R: "≥2"},
          disk_diffusion: { routine: { S: "≥19", I: "null", R: "≤18"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      trovafloxacin: {
        clsi: {
          mic_breakpoints: {S: "≤0.5", I: "1", R: "≥2"},
          disk_diffusion: { routine: { S: "≥22", I: "null", R: "≤21"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      fleroxacin: {
        clsi: {
          mic_breakpoints: {S: "≤2", I: "null", R: "≥4"},
          disk_diffusion: { routine: { S: "≥19", I: "null", R: "≤18"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      // Folate Pathway Antagonists
      "trimethoprim-sulfamethoxazole": {
        clsi: {
          mic_breakpoints: {S: "≤0.5/9.5", I: "1/19-2/38", R: "≥4/76"},
          disk_diffusion: { routine: { S: "≥16", I: "11-15", R: "≤10"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      // Other agents
      tetracycline: {
        clsi: {
          mic_breakpoints: {S: "≤2", I: "4", R: "≥8"},
          disk_diffusion: { routine: { S: "≥29", I: "26-28", R: "≤25"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      chloramphenicol: {
        clsi: {
          mic_breakpoints: {S: "≤2", I: "4", R: "≥8"},
          disk_diffusion: { routine: { S: "≥29", I: "26-28", R: "≤25"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      rifampin: {
        clsi: {
          mic_breakpoints: {S: "≤1", I: "2", R: "≥4"},
          disk_diffusion: { routine: { S: "≥20", I: "17-19", R: "≤16"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      lefamulin: {
        clsi: {
          mic_breakpoints: {S: "≤2", I: "null", R: "≥4"},
          disk_diffusion: { routine: {note: "May be appropriate only for prophylaxis of case contacts. These breakpoints do not apply to therapy of patients with invasive H. influenzae disease."}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      }
    }
  },

  // H. parainfluenzae - Panel updated to match H. influenzae per CLSI M100-Ed34.
  "Haemophilus_parainfluenzae": {
    category: "Haemophilus spp.",
    clsi_table: "Table 2E",
    common_resistance_mechanisms: ["Beta-lactamase production (less common than H. influenzae)"],
    epidemiology: "Upper respiratory tract infections, endocarditis (HACEK group)",
    intrinsic_resistance: [],

    antibiotics: {
      // Beta-lactamase testing critical
      ampicillin: {
        clsi: {
          mic_breakpoints: {S: "≤1", I: "2", R: "≥4"},
          disk_diffusion: { routine: { S: "≥22", I: "19-21", R: "≤18"}},
          tier: 1,
          source: "CLSI M100-Ed34 Table 2E"
        },
        clinical_intelligence: {
          special_testing: {
            beta_lactamase_test: "Required for all isolates",
            interpretation: "Positive = ampicillin resistant"
          }
        }
      },

      "amoxicillin-clavulanate": {
        clsi: {
          mic_breakpoints: {S: "≤2/2", I: "2.1/2", R: "≥4/2"},
          disk_diffusion: { routine: { S: "≥20", I: "17-19", R: "≤16"}},
          tier: 1,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      "ampicillin-sulbactam": {
        clsi: {
          mic_breakpoints: {S: "≤2/4", I: "2.1/4", R: "≥4/2"},
          disk_diffusion: { routine: { S: "≥21", I: "19-20", R: "≤18"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      "piperacillin-tazobactam": {
        clsi: {
          mic_breakpoints: {S: "≤1/4", I: "2/4", R: "≥4/4"},
          disk_diffusion: { routine: {note: "Additional disk correlate data are pending before disk diffusion breakpoints with the dosage regimen listed in Table 2 Dosages can be established"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      // Parenteral Cephalosporins
      cefotaxime: {
        clsi: {
          mic_breakpoints: {S: "≤2", I: "null", R: "≥4"},
          disk_diffusion: { routine: { S: "≥26", I: "null", R: "≤25"}},
          tier: 1,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      ceftriaxone: {
        clsi: {
          mic_breakpoints: {S: "≤2", I: "null", R: "≥4"},
          disk_diffusion: { routine: { S: "≥26", I: "null", R: "≤25"}},
          tier: 1,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      cefepime: {
        clsi: {
          mic_breakpoints: {S: "≤2", I: "null", R: "≥4"},
          disk_diffusion: { routine: { S: "≥26", I: "null", R: "≤25"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      cefazolin: {
        clsi: {
          mic_breakpoints: {S: "≤2", I: "null", R: "≥4"},
          disk_diffusion: { routine: { S: "≥26", I: "null", R: "≤25"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      cefuroxime_parenteral: {
        clsi: {
          mic_breakpoints: {S: "≤4", I: "8", R: "≥16"},
          disk_diffusion: { routine: { S: "≥20", I: "17-19", R: "≤16"}},
          tier: 1,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      cefamandole: {
        clsi: {
          mic_breakpoints: {S: "≤4", I: "8", R: "≥16"},
          disk_diffusion: { routine: { S: "≥26", I: "null", R: "≤25"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      cefonicid: {
        clsi: {
          mic_breakpoints: {S: "≤2", I: "null", R: "≥4"},
          disk_diffusion: { routine: { S: "≥26", I: "null", R: "≤25"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      ceftizoxime: {
        clsi: {
          mic_breakpoints: {S: "≤2", I: "null", R: "≥4"},
          disk_diffusion: { routine: { S: "≥26", I: "null", R: "≤25"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      moxalactam: {
        clsi: {
          mic_breakpoints: {S: "≤4", I: "8", R: "≥16"},
          disk_diffusion: { routine: { S: "≥26", I: "null", R: "≤25"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      "ceftolozane-tazobactam": {
        clsi: {
          mic_breakpoints: {S: "≤0.5/4", I: "null", R: "≥1/4"},
          disk_diffusion: { routine: {note: "Additional disk correlate data are pending before disk diffusion breakpoints with the dosage regimen listed in Table 2 Dosages can be established"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      // Oral cephalosporins
      cefaclor: {
        clsi: {
          mic_breakpoints: {S: "≤4", I: "8", R: "≥16"},
          disk_diffusion: { routine: { S: "≥20", I: "17-19", R: "≤16"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      cefuroxime_oral: {
        clsi: {
          mic_breakpoints: {S: "≤4", I: "8", R: "≥16"},
          disk_diffusion: { routine: { S: "≥23", I: "15-22", R: "≤14"}},
          tier: 1,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      cefdinir: {
        clsi: {
          mic_breakpoints: {S: "≤1", I: "null", R: "≥2"},
          disk_diffusion: { routine: { S: "≥20", I: "null", R: "≤19"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      cefixime: {
        clsi: {
          mic_breakpoints: {S: "≤1", I: "null", R: "≥2"},
          disk_diffusion: { routine: { S: "≥19", I: "null", R: "≤18"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      cefpodoxime: {
        clsi: {
          mic_breakpoints: {S: "≤0.5", I: "null", R: "≥1"},
          disk_diffusion: { routine: { S: "≥26", I: "null", R: "≤25"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      cefprozil: {
        clsi: {
          mic_breakpoints: {S: "≤8", I: "16", R: "≥32"},
          disk_diffusion: { routine: { S: "≥18", I: "15-17", R: "≤14"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      cefetamet: {
        clsi: {
          mic_breakpoints: {S: "≤2", I: "null", R: "≥4"},
          disk_diffusion: { routine: { S: "≥18", I: "15-17", R: "≤14"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      cefoxitin: {
        clsi: {
          mic_breakpoints: {S: "≤4", I: "8", R: "≥16"},
          disk_diffusion: { routine: { S: "≥17", I: "14-16", R: "≤13"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      loracarbef: {
        clsi: {
          mic_breakpoints: {S: "≤8", I: "16", R: "≥32"},
          disk_diffusion: { routine: { S: "≥18", I: "15-17", R: "≤14"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      // Other Beta-lactams
      aztreonam: {
        clsi: {
          mic_breakpoints: {S: "≤4", I: "null", R: "≥8"},
          disk_diffusion: { routine: { S: "≥26", I: "null", R: "≤25"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      // Carbapenems
      meropenem: {
        clsi: {
          mic_breakpoints: {S: "≤0.5", I: "null", R: "≥1"},
          disk_diffusion: { routine: { S: "≥20", I: "null", R: "≤19"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      ertapenem: {
        clsi: {
          mic_breakpoints: {S: "≤0.5", I: "null", R: "≥1"},
          disk_diffusion: { routine: { S: "≥19", I: "null", R: "≤18"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      imipenem: {
        clsi: {
          mic_breakpoints: {S: "≤4", I: "null", R: "≥8"},
          disk_diffusion: { routine: { S: "≥16", I: "null", R: "≤15"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      doripenem: {
        clsi: {
          mic_breakpoints: {S: "≤0.5", I: "null", R: "≥1"},
          disk_diffusion: { routine: { S: "≥19", I: "null", R: "≤18"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      // Macrolides
      azithromycin: {
        clsi: {
          mic_breakpoints: {S: "≤2", I: "4", R: "≥8"},
          disk_diffusion: { routine: { S: "≥18", I: "14-17", R: "≤13"}},
          tier: 1,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      clarithromycin: {
        clsi: {
          mic_breakpoints: {S: "≤8", I: "16", R: "≥32"},
          disk_diffusion: { routine: { S: "≥13", I: "11-12", R: "≤10"}},
          tier: 1,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      dirithromycin: {
        clsi: {
          mic_breakpoints: {S: "≤0.5", I: "1", R: "≥2"},
          disk_diffusion: { routine: { S: "≥18", I: "14-17", R: "≤13"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      // Quinolones
      ciprofloxacin: {
        clsi: {
          mic_breakpoints: {S: "≤1", I: "null", R: "≥2"},
          disk_diffusion: { routine: { S: "≥21", I: "null", R: "≤20"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      levofloxacin: {
        clsi: {
          mic_breakpoints: {S: "≤2", I: "null", R: "≥4"},
          disk_diffusion: { routine: { S: "≥17", I: "null", R: "≤16"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      moxifloxacin: {
        clsi: {
          mic_breakpoints: {S: "≤0.5", I: "1", R: "≥2"},
          disk_diffusion: { routine: { S: "≥18", I: "null", R: "≤17"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      gemifloxacin: {
        clsi: {
          mic_breakpoints: {S: "≤0.03", I: "null", R: "≥0.06"},
          disk_diffusion: { routine: { S: "≥16", I: "null", R: "≤15"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      gatifloxacin: {
        clsi: {
          mic_breakpoints: {S: "≤0.5", I: "null", R: "≥1"},
          disk_diffusion: { routine: { S: "≥18", I: "null", R: "≤17"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      grepafloxacin: {
        clsi: {
          mic_breakpoints: {S: "≤0.5", I: "null", R: "≥1"},
          disk_diffusion: { routine: { S: "≥24", I: "null", R: "≤23"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      lomefloxacin: {
        clsi: {
          mic_breakpoints: {S: "≤0.5", I: "null", R: "≥1"},
          disk_diffusion: { routine: { S: "≥22", I: "null", R: "≤21"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      norfloxacin: {
        clsi: {
          mic_breakpoints: {S: "≤2", I: "null", R: "≥4"},
          disk_diffusion: { routine: { S: "≥17", I: "null", R: "≤16"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      ofloxacin: {
        clsi: {
          mic_breakpoints: {S: "≤1", I: "null", R: "≥2"},
          disk_diffusion: { routine: { S: "≥18", I: "null", R: "≤17"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      sparfloxacin: {
        clsi: {
          mic_breakpoints: {S: "≤0.5", I: "1", R: "≥2"},
          disk_diffusion: { routine: { S: "≥19", I: "null", R: "≤18"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      trovafloxacin: {
        clsi: {
          mic_breakpoints: {S: "≤0.5", I: "1", R: "≥2"},
          disk_diffusion: { routine: { S: "≥22", I: "null", R: "≤21"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      fleroxacin: {
        clsi: {
          mic_breakpoints: {S: "≤2", I: "null", R: "≥4"},
          disk_diffusion: { routine: { S: "≥19", I: "null", R: "≤18"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      // Folate Pathway Antagonists
      "trimethoprim-sulfamethoxazole": {
        clsi: {
          mic_breakpoints: {S: "≤0.5/9.5", I: "1/19-2/38", R: "≥4/76"},
          disk_diffusion: { routine: { S: "≥16", I: "11-15", R: "≤10"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      // Other agents
      tetracycline: {
        clsi: {
          mic_breakpoints: {S: "≤2", I: "4", R: "≥8"},
          disk_diffusion: { routine: { S: "≥29", I: "26-28", R: "≤25"}},
          tier: 2,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      chloramphenicol: {
        clsi: {
          mic_breakpoints: {S: "≤2", I: "4", R: "≥8"},
          disk_diffusion: { routine: { S: "≥29", I: "26-28", R: "≤25"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      rifampin: {
        clsi: {
          mic_breakpoints: {S: "≤1", I: "2", R: "≥4"},
          disk_diffusion: { routine: { S: "≥20", I: "17-19", R: "≤16"}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      },

      lefamulin: {
        clsi: {
          mic_breakpoints: {S: "≤2", I: "null", R: "≥4"},
          disk_diffusion: { routine: {note: "May be appropriate only for prophylaxis of case contacts. These breakpoints do not apply to therapy of patients with invasive H. influenzae disease."}},
          tier: 3,
          source: "CLSI M100-Ed34 Table 2E"
        }
      }
    }
  }
};
