// CLSI Table 2B-3: Burkholderia cepacia complex Breakpoints
// Data sourced from CLSI M100-Ed34 guidelines.
// Corrected to include Chloramphenicol based on analysis.

export default {
  "Burkholderia_cepacia_complex": {
    category: "Non-Enterobacterales",
    clsi_table: "Table 2B-3",
    source: "CLSI M100-Ed34",
    notes: [
      "Disk diffusion methods are known to be unreliable for this organism group, and their use is discouraged.",
      "MIC-based testing is strongly recommended for all agents to ensure accuracy."
    ],
    common_resistance_mechanisms: ["Efflux pumps (a major contributor to resistance)", "Beta-lactamase production (e.g., PenA)", "Target site modifications"],
    epidemiology: "A significant opportunistic pathogen, especially in patients with cystic fibrosis and chronic granulomatous disease. It is also a known cause of nosocomial outbreaks, often linked to contaminated medical products and devices.",
    intrinsic_resistance: ["Many beta-lactams", "Aminoglycosides (variable efficacy)", "Polymyxins"],

    antibiotics: {
      ceftazidime: {
        clsi: {
          mic_breakpoints: {S: "≤8", I: "16", R: "≥32"},
          disk_diffusion: {
            routine: { note: "Unreliable, MIC testing required." },
            tier: 1,
            source: "CLSI M100-Ed34 Table 2B-3"
          }
        }
      },
      chloramphenicol: {
        clsi: {
          mic_breakpoints: {S: "≤8", I: "16", R: "≥32"},
          disk_diffusion: {
            routine: { note: "Unreliable, MIC testing required." },
            notes: ["Not routinely reported on organisms isolated from the urinary tract."],
            tier: 2, // Tier assumed as it's not a primary agent
            source: "CLSI M100-Ed34 Table 2B-3"
          }
        }
      },
      levofloxacin: {
        clsi: {
          mic_breakpoints: {S: "≤2", I: "4", R: "≥8"},
          disk_diffusion: {
            routine: { note: "Unreliable, MIC testing required." },
            tier: 1,
            source: "CLSI M100-Ed34 Table 2B-3"
          }
        }
      },
      meropenem: {
        clsi: {
          mic_breakpoints: {S: "≤4", I: "8", R: "≥16"},
          disk_diffusion: {
            routine: { note: "Unreliable, MIC testing required." },
            tier: 1,
            source: "CLSI M100-Ed34 Table 2B-3"
          }
        }
      },
      minocycline: {
        clsi: {
          mic_breakpoints: {S: "≤4", I: "8", R: "≥16"},
          disk_diffusion: {
            routine: { note: "Unreliable, MIC testing required." },
            tier: 1,
            source: "CLSI M100-Ed34 Table 2B-3"
          }
        }
      },
      "ticarcillin-clavulanate": {
        clsi: {
          mic_breakpoints: {S: "≤16/2", I: "32/2-64/2", R: "≥128/2"},
          disk_diffusion: {
            routine: { note: "Unreliable, MIC testing required." },
            tier: 2,
            source: "CLSI M100-Ed34 Table 2B-3"
          }
        }
      },
      "trimethoprim-sulfamethoxazole": {
        clsi: {
          mic_breakpoints: {S: "≤2/38", I: null, R: "≥4/76"},
          disk_diffusion: {
            routine: { note: "Unreliable, MIC testing required." },
            tier: 1,
            source: "CLSI M100-Ed34 Table 2B-3"
          }
        }
      }
    }
  }
};
