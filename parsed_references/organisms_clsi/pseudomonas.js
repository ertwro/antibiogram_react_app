// CLSI Table 2B-1: Pseudomonas aeruginosa Breakpoints
// Final comprehensive version, aligned with available CLSI M100-Ed34 data.
// This version includes all specified categories for P. aeruginosa.
// Corrected based on detailed user-provided analysis.

export default {
  "Pseudomonas_aeruginosa": {
    "category": "Pseudomonas aeruginosa",
    "clsi_table": "Table 2B-1",
    "source": "CLSI M100-Ed34",
    "notes": [
      "Susceptibility testing is recommended for all clinically significant isolates.",
      "Resistance to one agent in a class may not predict resistance to other agents in the same class.",
      "For some agents, such as aminoglycosides, routine reporting for systemic infections is no longer recommended due to poor predictive value."
    ],
    "common_resistance_mechanisms": [
      "Intrinsic resistance (low outer membrane permeability, efflux pumps like MexAB-OprM, constitutive AmpC β-lactamase)",
      "Acquired resistance through mutations (e.g., in gyrA/parC for fluoroquinolones, loss of OprD porin for carbapenems)",
      "Horizontal gene transfer of resistance genes (e.g., extended-spectrum β-lactamases - ESBLs, carbapenemases like KPC, NDM, VIM, IMP, and OXA-type enzymes)",
      "Adaptive resistance mechanisms, such as biofilm formation."
    ],
    "epidemiology": "A common cause of healthcare-associated infections, particularly ventilator-associated pneumonia, bloodstream infections, urinary tract infections, and infections in immunocompromised hosts (e.g., cystic fibrosis, burn patients, neutropenia). It is an opportunistic pathogen found in moist environments.",
    "antibiotics": {
      // PENICILLINS / BETA-LACTAMASE INHIBITOR COMBINATIONS
      "piperacillin": { "clsi": { "mic_breakpoints": { "S": "≤16", "I": "32", "R": "≥64" }, "disk_diffusion_breakpoints": { "S": "≥22", "I": "18-21", "R": "≤17" }, "tier": 1 }},
      "piperacillin-tazobactam": { "clsi": { "mic_breakpoints": { "S": "≤16/4", "I": "32/4-64/4", "R": "≥128/4" }, "disk_diffusion_breakpoints": { "S": "≥22", "I": "18-21", "R": "≤17" }, "tier": 1 }},
      "ticarcillin-clavulanic acid": { "clsi": { "mic_breakpoints": { "S": "≤16/2", "I": "32/2-64/2", "R": "≥128/2" }, "disk_diffusion_breakpoints": { "S": "≥20", "I": "15-19", "R": "≤14" }, "tier": 1 }},

      // CEPHALOSPORINS
      "ceftazidime": { "clsi": { "mic_breakpoints": { "S": "≤8", "I": "16", "R": "≥32" }, "disk_diffusion_breakpoints": { "S": "≥21", "I": "18-20", "R": "≤17" }, "tier": 1 }},
      "cefepime": { "clsi": { "mic_breakpoints": { "S": "≤8", "I": "16", "R": "≥32" }, "disk_diffusion_breakpoints": { "S": "≥18", "I": "15-17", "R": "≤14" }, "tier": 1 }},
      "ceftazidime-avibactam": { "clsi": { "mic_breakpoints": { "S": "≤8/4", "R": ">8/4" }, "disk_diffusion_breakpoints": { "S": "≥21", "I": null, "R": "≤20" }, "tier": 3 }},
      "ceftolozane-tazobactam": { "clsi": { "mic_breakpoints": { "S": "≤4/4", "I": "8/4", "R": "≥16/4" }, "disk_diffusion_breakpoints": { "S": "≥21", "I": "18-20", "R": "≤17" }, "tier": 3 }},
      "cefiderocol": { "clsi": { "mic_breakpoints": { "S": "≤4", "I": "8", "R": "≥16" }, "disk_diffusion_breakpoints": { "S": "≥18", "I": "13-17", "R": "≤12" }, "tier": 3, "condition": "The accuracy and reproducibility of cefiderocol testing results can be significantly affected by iron concentration and inoculum preparation, potentially leading to false-resistant or false-susceptible results. Discussion with prescribers and antimicrobial stewardship members is recommended due to potential inaccuracies." }},

      // MONOBACTAMS
      "aztreonam": { "clsi": { "mic_breakpoints": { "S": "≤8", "I": "16", "R": "≥32" }, "disk_diffusion_breakpoints": { "S": "≥22", "I": "16-21", "R": "≤15" }, "tier": 4 }},

      // CARBAPENEMS
      // CORRECTED: Disk diffusion breakpoints updated
      "meropenem": { "clsi": { "mic_breakpoints": { "S": "≤2", "I": "4", "R": "≥8" }, "disk_diffusion_breakpoints": { "S": "≥19", "I": "16-18", "R": "≤15" }, "tier": 2 }},
      // CORRECTED: Disk diffusion breakpoints updated
      "imipenem": { "clsi": { "mic_breakpoints": { "S": "≤2", "I": "4", "R": "≥8" }, "disk_diffusion_breakpoints": { "S": "≥22", "I": "19-21", "R": "≤19" }, "tier": 2 }},
      // CORRECTED: Disk diffusion breakpoints updated
      "doripenem": { "clsi": { "mic_breakpoints": { "S": "≤1", "I": "2", "R": "≥4" }, "disk_diffusion_breakpoints": { "S": "≥19", "I": "16-18", "R": "≤15" }, "tier": 2 }},
      "imipenem-relebactam": { "clsi": { "mic_breakpoints": { "S": "≤1/4", "I": "2/4", "R": "≥4/4" }, "disk_diffusion_breakpoints": { "S": "≥23", "I": "19-22", "R": "≤18" }, "tier": 3 }},

      // AMINOGLYCOSIDES
      "amikacin": { "clsi": { "mic_breakpoints": { "S": "≤16", "I": "32", "R": "≥64" }, "disk_diffusion_breakpoints": { "S": "≥17", "I": "15-16", "R": "≤14" }, "tier": 2, "condition": "Primarily for urinary tract isolates. For other sites, clinical efficacy is not well established." }},
      "gentamicin": { "clsi": { "mic_breakpoints": { "S": "≤4", "I": "8", "R": "≥16" }, "disk_diffusion_breakpoints": { "S": "≥15", "I": "13-14", "R": "≤12" }, "tier": 2, "condition": "Clinical outcomes data for monotherapy for systemic infections are limited; combination therapy should be considered for most non-UTI indications." }},
      "tobramycin": { "clsi": { "mic_breakpoints": { "S": "≤4", "I": "8", "R": "≥16" }, "disk_diffusion_breakpoints": { "S": "≥15", "I": "13-14", "R": "≤12" }, "tier": 1 }},
      "netilmicin": { "clsi": { "mic_breakpoints": { "S": "≤8", "I": "16", "R": "≥32" }, "disk_diffusion_breakpoints": { "S": "≥15", "I": "13-14", "R": "≤12" }, "tier": 2 }},

      // FLUOROQUINOLONES
      // CORRECTED: Disk diffusion breakpoints updated
      "ciprofloxacin": { "clsi": { "mic_breakpoints": { "S": "≤0.5", "I": "1", "R": "≥2" }, "disk_diffusion_breakpoints": { "S": "≥25", "I": "19-24", "R": "≤18" }, "tier": 1 }},
      // CORRECTED: Disk diffusion breakpoints updated
      "levofloxacin": { "clsi": { "mic_breakpoints": { "S": "≤1", "I": "2", "R": "≥4" }, "disk_diffusion_breakpoints": { "S": "≥22", "I": "15-21", "R": "≤14" }, "tier": 1 }},
      "lomefloxacin": { "clsi": { "mic_breakpoints": { "S": "≤2", "I": "4", "R": "≥8" }, "disk_diffusion_breakpoints": { "S": "≥22", "I": "19-21", "R": "≤18" }, "tier": 1 }},
      "norfloxacin": { "clsi": { "mic_breakpoints": { "S": "≤4", "I": "8", "R": "≥16" }, "disk_diffusion_breakpoints": { "S": "≥17", "I": "13-16", "R": "≤12" }, "tier": 1 }},
      "ofloxacin": { "clsi": { "mic_breakpoints": { "S": "≤4", "I": "8", "R": "≥16" }, "disk_diffusion_breakpoints": { "S": "≥16", "I": "13-15", "R": "≤12" }, "tier": 1 }},
      "gatifloxacin": { "clsi": { "mic_breakpoints": { "S": "≤4", "I": "8", "R": "≥16" }, "disk_diffusion_breakpoints": { "S": "≥18", "I": "15-17", "R": "≤14" }, "tier": 1 }},

      // POLYMYXINS
      "colistin": { "clsi": { "mic_breakpoints": { "S": "≤2", "I": null, "R": "≥4" }, "disk_diffusion_breakpoints": null, "tier": 3, "condition": "WARNING: Limited clinical efficacy even with intermediate results; use in combination therapy is recommended. Broth microdilution is the only recommended method; disk diffusion is unreliable." }},
      "polymyxin B": { "clsi": { "mic_breakpoints": { "S": "≤2", "I": null, "R": "≥4" }, "disk_diffusion_breakpoints": null, "tier": 3, "condition": "WARNING: Limited clinical efficacy even with intermediate results; use in combination therapy is recommended. Broth microdilution is the only recommended method; disk diffusion is unreliable." }}
    }

  }
}
