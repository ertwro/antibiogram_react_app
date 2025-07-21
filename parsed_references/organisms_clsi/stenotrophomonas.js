// CLSI Table 2B-4 & 1B-4: Stenotrophomonas maltophilia Breakpoints
// This file contains comprehensive and accurate data based on CLSI M100-Ed34.
// Data has been revised to correct breakpoints, tiers, and conditions.

export default {
  "Stenotrophomonas_maltophilia": {
    category: "Non-Enterobacterales",
    clsi_table: "Table 2B-4 (Breakpoints), Table 1B-4 (Tiers)",
    source: "CLSI M100-Ed34",
    notes: [
      "Routine Testing Conditions:",
      "Medium: Disk diffusion: Mueller-Hinton Agar (MHA); Broth dilution: Cation-adjusted Mueller-Hinton Broth (CAMHB).",
      "Inoculum: Broth culture method or colony suspension, equivalent to a 0.5 McFarland standard.",
      "Incubation: 35°C ± 2°C, ambient air. Disk diffusion: 16-20 hours; Dilution methods: 20-24 hours.",
      "S. maltophilia is intrinsically resistant to carbapenems and aminoglycosides. Testing these agents is not recommended."
    ],
    epidemiology: "An opportunistic pathogen, commonly associated with healthcare-associated infections, particularly in immunocompromised patients, those with cystic fibrosis, or individuals with indwelling medical devices.",

    antibiotics: {
      // PRIMARY AGENTS
      "trimethoprim-sulfamethoxazole": {
        clsi: {
          mic_breakpoints: { S: "≤2/38", I: null, R: "≥4/76" },
          disk_diffusion: { routine: { S: "≥16", I: "11-15", R: "≤10" } },
          tier: 1
        },
        condition: "Should not be used alone for antimicrobial therapy. Breakpoints are based on a 1:19 ratio of trimethoprim to sulfamethoxazole."
      },
      "levofloxacin": {
        clsi: {
          mic_breakpoints: { S: "≤2", I: "4", R: "≥8" },
          disk_diffusion: { routine: { S: "≥17", I: "14-16", R: "≤13" } },
          tier: 1
        },
        condition: "Levofloxacin should not be used alone for antimicrobial therapy."
      },
      "minocycline": {
        clsi: {
          mic_breakpoints: { S: "≤4", I: "8", R: "≥16" },
          disk_diffusion: { routine: { S: "≥26", I: "21-25", R: "≤20" } }, // Corrected breakpoints
          tier: 1
        },
        condition: "Susceptibility to minocycline predicts susceptibility for doxycycline and tetracycline."
      },

      // SECONDARY / ALTERNATIVE AGENTS
      "cefiderocol": {
        clsi: {
          mic_breakpoints: { S: "≤1", I: null, R: "≥4" },
          disk_diffusion: { routine: { S: "≥15", I: null, R: null } },
          tier: 3
        },
        condition: "Testing accuracy is markedly affected by iron concentration and inoculum preparation, and may vary by manufacturer. False-resistant or false-susceptible results may occur. Discussion with prescribers is recommended."
      },
      "ticarcillin-clavulanic acid": {
        clsi: {
          mic_breakpoints: { S: "≤16/2", I: "32/2-64/2", R: "≥128/2" },
          disk_diffusion: { routine: { S: "≥20", I: "15-19", R: "≤14" } }
        },
        condition: "Not listed in CLSI M100 Table 1B-4 and has no assigned tier. Breakpoints are for ticarcillin concentration at a fixed 2 µg/mL of clavulanic acid."
      },
      "chloramphenicol": {
        clsi: {
          mic_breakpoints: { S: "≤8", I: "16", R: "≥32" },
          disk_diffusion: { routine: { S: "≥18", I: "13-17", R: "≤12" } }
        },
        condition: "Not listed in CLSI M100 Table 1B-4 and has no assigned tier. Not routinely reported on organisms isolated from the urinary tract."
      }
    }

  }
};
