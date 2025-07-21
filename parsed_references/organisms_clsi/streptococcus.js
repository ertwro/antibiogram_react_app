// CLSI Tables 2G, 2H: Streptococcus spp. Breakpoints
// Final version, fully corrected and refactored with all contextual notes from CLSI M100 Ed34 PDF analysis.

// --- Helper Objects for Refactoring ---

// Common data for beta-hemolytics where susceptibility is inferred from Penicillin
const inferredFromPenicillin_Beta = {
  clsi: { tier: 2, note: "Susceptibility can be inferred from penicillin." }
};

// --- Main Breakpoint Definitions ---

export default {
  // S. pneumoniae - Corrected and expanded per CLSI M100 Table 2G
  "Streptococcus_pneumoniae": {
    category: "Streptococcus spp.",
    clsi_table: "Table 2G",
    source: "CLSI M100-Ed34 Table 2G",
    common_resistance_mechanisms: ["Penicillin resistance (PBP mutations)", "Macrolide resistance (ermB, mefA)", "Quinolone resistance (gyrA, parC mutations)"],
    epidemiology: "Community-acquired pneumonia (CAP), meningitis, bacteremia, otitis media, sinusitis.",

    antibiotics: {
      penicillin: {
        clsi: {
          mic_breakpoints: {
            meningitis: {S: "≤0.06", I: "0.12-0.25", R: "≥0.5"},
            non_meningitis_parenteral: {S: "≤2", I: "4", R: "≥8"},
            non_meningitis_oral: {S: "≤0.06", I: "0.12-1", R: "≥2"}
          },
          disk_diffusion: { routine: {note: "Oxacillin disk (1 ug) screens for penicillin resistance. Zone ≤19 mm suggests resistance. MIC method required for definitive result."} },
          tier: 1
        }
      },
      amoxicillin: { clsi: { mic_breakpoints: {S: "≤2", I: "4", R: "≥8"}, tier: 1 } },
      "amoxicillin-clavulanate": { clsi: { mic_breakpoints: {S: "≤2/1", I: "4/2", R: "≥8/4"}, tier: 1 } },
      cefotaxime: { clsi: { mic_breakpoints: { meningitis: {S: "≤0.5", I: "1", R: "≥2"}, non_meningitis: {S: "≤1", I: "2", R: "≥4"} }, tier: 1 } },
      ceftriaxone: { clsi: { mic_breakpoints: { meningitis: {S: "≤0.5", I: "1", R: "≥2"}, non_meningitis: {S: "≤1", I: "2", R: "≥4"} }, tier: 1 } },
      cefepime: { clsi: { mic_breakpoints: { meningitis: {S: "≤0.5", I: "1", R: "≥2"}, non_meningitis: {S: "≤1", I: "2", R: "≥4"} }, tier: 2 } },
      ceftaroline: { clsi: { mic_breakpoints: {S: "≤0.25", I: "0.5", R: "≥1"}, tier: 2 } },

      // Oral Cephalosporins
      cefuroxime: { clsi: { mic_breakpoints: {S: "≤0.5", I: "1", R: "≥2"}, tier: 2, note: "(oral)" } },
      cefpodoxime: { clsi: { mic_breakpoints: {S: "≤0.5", I: "1", R: "≥2"}, tier: 2, note: "(oral)" } },
      cefprozil: { clsi: { mic_breakpoints: { S: "≤0.5", I: "1", R: "≥2" }, tier: 2, note: "(oral)" } },
      cefdinir: { clsi: { mic_breakpoints: {S: "≤0.5", I: "1", R: "≥2"}, tier: 2, note: "(oral)" } },
      cefixime: { clsi: { mic_breakpoints: { S: "≤0.5", I: "1", R: "≥2" }, tier: 2, note: "(oral)" } },
      cefaclor: { clsi: { mic_breakpoints: { S: "≤0.5", I: "1", R: "≥2" }, tier: 2, note: "(oral)" } }, // Corrected breakpoints
      loracarbef: { clsi: { mic_breakpoints: { S: "≤0.5", I: "1", R: "≥2" }, tier: 2, note: "(oral)" } }, // Corrected breakpoints

      // Carbapenems
      meropenem: { clsi: { mic_breakpoints: { meningitis: {S: "≤0.25", I: "0.5", R: "≥1"}, non_meningitis: {S: "≤0.25", I: "0.5", R: "≥1"} }, tier: 2 } },
      imipenem: { clsi: { mic_breakpoints: {S: "≤0.12", I: "0.25", R: "≥0.5"}, tier: 2 } },
      ertapenem: { clsi: { mic_breakpoints: {S: "≤0.5", I: "1", R: "≥2"}, tier: 2 } },
      doripenem: { clsi: { mic_breakpoints: {S: "≤0.25", I: "0.5", R: "≥1"}, tier: 3 } },

      // Macrolides & Lincosamides
      erythromycin: { clsi: { mic_breakpoints: { S: "≤0.25", I: "0.5", R: "≥1" }, disk_diffusion: { routine: { S: "≥21", I: "16-20", R: "≤15" } }, tier: 1 } },
      azithromycin: { clsi: { mic_breakpoints: {S: "≤0.5", I: "1", R: "≥2"}, disk_diffusion: { routine: { S: "≥18", I: "14-17", R: "≤13"} }, tier: 1 } },
      clarithromycin: { clsi: { mic_breakpoints: {S: "≤0.25", I: "0.5", R: "≥1"}, disk_diffusion: { routine: { S: "≥21", I: "17-20", R: "≤16"} }, tier: 1 } },
      dirithromycin: { clsi: { mic_breakpoints: { S: "≤0.25", I: "0.5", R: "≥1" }, disk_diffusion: { routine: { S: "≥19", I: "14-17", R: "≤13" } }, tier: 2 } },
      clindamycin: { clsi: { mic_breakpoints: {S: "≤0.25", I: "0.5", R: "≥1"}, disk_diffusion: { routine: { S: "≥19", I: "16-18", R: "≤15"} }, tier: 2, note: "Requires D-zone test for inducible resistance if erythromycin-resistant." } },

      // Fluoroquinolones
      levofloxacin: { clsi: { mic_breakpoints: {S: "≤2", I: "4", R: "≥8"}, disk_diffusion: { routine: { S: "≥17", I: "14-16", R: "≤13"} }, tier: 1 } },
      moxifloxacin: { clsi: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, disk_diffusion: { routine: { S: "≥18", I: "15-17", R: "≤14"} }, tier: 1 } },
      ofloxacin: { clsi: { mic_breakpoints: {S: "≤2", I: "4", R: "≥8"}, disk_diffusion: { routine: { S: "≥16", I: "13-15", R: "≤12"} }, tier: 2 } },
      gemifloxacin: { clsi: { mic_breakpoints: {S: "≤0.25", I: "0.5", R: "≥1"}, disk_diffusion: { routine: { S: "≥18", I: "15-17", R: "≤14"} }, tier: 2 } },
      sparfloxacin: { clsi: { mic_breakpoints: {S: "≤0.5", I: "1", R: "≥2"}, disk_diffusion: { routine: { S: "≥19", I: "16-18", R: "≤15"} }, tier: 3 } },

      // Other classes
      vancomycin: { clsi: { mic_breakpoints: {S: "≤1"}, tier: 1, note: "Results from S. pneumoniae isolated from CSF can also be tested against vancomycin using the MIC or disk diffusion method." } }, // Added contextual note
      linezolid: { clsi: { mic_breakpoints: {S: "≤2", I: "null", R: "≥4"}, disk_diffusion: { routine: { S: "≥21", I: "null", R: "≤20"} }, tier: 2 } },
      "trimethoprim-sulfamethoxazole": { clsi: { mic_breakpoints: {S: "≤0.5/9.5", I: "1/19-2/38", R: "≥4/76"}, disk_diffusion: { routine: { S: "≥19", I: "16-18", R: "≤15"} }, tier: 1 } },
      rifampin: { clsi: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, disk_diffusion: { routine: { S: "≥19", I: "17-18", R: "≤16"} }, tier: 3, note: "Should not be used as monotherapy." } },
      tetracycline: { clsi: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, disk_diffusion: { routine: { S: "≥28", I: "25-27", R: "≤24"} }, tier: 2 } },
      doxycycline: { clsi: { mic_breakpoints: {S: "≤0.25", I: "0.5", R: "≥1"}, tier: 2 } },
      chloramphenicol: { clsi: { mic_breakpoints: {S: "≤4", I: "8", R: "≥16"}, disk_diffusion: { routine: { S: "≥21", I: "17-20", R: "≤16"} }, tier: 3 } },
      lefamulin: { clsi: { mic_breakpoints: {S: "≤0.5"}, tier: 3 } },
      fosfomycin: { clsi: { mic_breakpoints: { S: "≤32", R: "≥64" }, note: "Breakpoints apply only to E. coli from uncomplicated UTI; use with caution for other organisms/sites.", tier: 3 } },
      "quinupristin-dalfopristin": { clsi: { mic_breakpoints: { S: "≤1", I: "2", R: "≥4" }, disk_diffusion: { routine: { S: "≥19", I: "16-18", R: "≤15" } }, tier: 3 } }
    }

  },

  "Streptococcus_beta_hemolytic_group": {
    category: "Streptococcus spp.",
    clsi_table: "Table 2H-1",
    source: "CLSI M100-Ed34 Table 2H-1",
    note: "Includes S. pyogenes (Group A), S. agalactiae (Group B), and S. dysgalactiae. Small colony-forming β-hemolytic S. anginosus group strains should use viridans group breakpoints (Table 2H-2).",
    epidemiology: "Pharyngitis, cellulitis, necrotizing fasciitis (S. pyogenes), neonatal sepsis, meningitis (S. agalactiae).",

    antibiotics: {
      penicillin: { clsi: { mic_breakpoints: {S: "≤0.12"}, disk_diffusion: { routine: { S: "≥24 (ampicillin disk)"} }, tier: 1, note: "Resistance is extremely rare. Susceptibility can be assumed." } },
      ampicillin: inferredFromPenicillin_Beta,
      "ampicillin-sulbactam": inferredFromPenicillin_Beta,
      "piperacillin-tazobactam": inferredFromPenicillin_Beta,
      cefazolin: inferredFromPenicillin_Beta,
      cefotaxime: inferredFromPenicillin_Beta,
      ceftriaxone: inferredFromPenicillin_Beta,
      "cefuroxime (oral)": inferredFromPenicillin_Beta,
      meropenem: { clsi: { ...inferredFromPenicillin_Beta.clsi, mic_breakpoints: {S: "≤0.5"} } },
      doripenem: { clsi: { ...inferredFromPenicillin_Beta.clsi, mic_breakpoints: {S: "≤0.12"} } },
      ertapenem: { clsi: { ...inferredFromPenicillin_Beta.clsi, mic_breakpoints: {S: "≤1"} } },

      erythromycin: { clsi: { mic_breakpoints: { S: "≤0.5", I: "1", R: "≥2" }, disk_diffusion: { routine: { S: "≥21", I: "16-20", R: "≤15" } }, tier: 2 } },
      azithromycin: { clsi: { mic_breakpoints: {S: "≤0.5", I: "1", R: "≥2"}, disk_diffusion: { routine: { S: "≥18", I: "14-17", R: "≤13"} }, tier: 2 } },
      clarithromycin: { clsi: { mic_breakpoints: {S: "≤0.25", I: "0.5", R: "≥1"}, disk_diffusion: { routine: { S: "≥21", I: "17-20", R: "≤16"} }, tier: 2 } },
      dirithromycin: { clsi: { mic_breakpoints: { S: "≤0.5", I: "1", R: "≥2" }, disk_diffusion: { routine: { S: "≥19", I: "14-17", R: "≤13" } }, tier: 2 } },
      clindamycin: { clsi: { mic_breakpoints: {S: "≤0.25", I: "0.5", R: "≥1"}, disk_diffusion: { routine: { S: "≥19", I: "16-18", R: "≤15"} }, tier: 2, note: "Requires D-zone test for inducible resistance if erythromycin-resistant." } },

      levofloxacin: { clsi: { mic_breakpoints: {S: "≤2", I: "4", R: "≥8"}, disk_diffusion: { routine: { S: "≥17", I: "14-16", R: "≤13"} }, tier: 2 } },
      moxifloxacin: { clsi: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, tier: 2 } },
      gatifloxacin: { clsi: { mic_breakpoints: {S: "≤0.5", I: "1", R: "≥2"}, tier: 2 } },
      ofloxacin: { clsi: { mic_breakpoints: {S: "≤2", I: "4", R: "≥8"}, tier: 2 } },
      trovafloxacin: { clsi: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, tier: 3 } },

      tetracycline: { clsi: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, disk_diffusion: { routine: { S: "≥23", I: "19-22", R: "≤18"} }, tier: 2 } },
      vancomycin: { clsi: { mic_breakpoints: {S: "≤1"}, tier: 2 } },
      linezolid: { clsi: { mic_breakpoints: {S: "≤2", R: "≥4"}, disk_diffusion: { routine: { S: "≥21"} }, tier: 2 } },
      daptomycin: { clsi: { mic_breakpoints: {S: "≤1"}, tier: 3 } },
      chloramphenicol: { clsi: { mic_breakpoints: {S: "≤4", I: "8", R: "≥16"}, disk_diffusion: { routine: { S: "≥21"} }, tier: 3 } },
      "quinupristin-dalfopristin": { clsi: { mic_breakpoints: { S: "≤1", I: "2", R: "≥4" }, disk_diffusion: { routine: { S: "≥19", I: "16-18", R: "≤15" } }, tier: 3, note: "Report only on S. pyogenes." } },

      ceftaroline: { clsi: { mic_breakpoints: {S: "≤0.12"}, tier: 3 } },
      dalbavancin: { clsi: { mic_breakpoints: {S: "≤0.12"}, tier: 3, note: "Report only on S. pyogenes, S. agalactiae, and S. dysgalactiae." } },
      oritavancin: { clsi: { mic_breakpoints: {S: "≤0.12"}, tier: 3, note: "Report only on S. pyogenes, S. agalactiae, and S. dysgalactiae." } },
      telavancin: { clsi: { mic_breakpoints: { S: "≤0.12" }, tier: 3 } },
      tedizolid: { clsi: { mic_breakpoints: {S: "≤0.5"}, disk_diffusion: { routine: { S: "≥20"} }, tier: 3, note: "S. agalactiae that test susceptible to linezolid by MIC are also considered susceptible to tedizolid. However, some organisms that are nonsusceptible to linezolid may be susceptible to tedizolid." } } // Corrected contextual note
    }

  },

  "Streptococcus_viridans_group": {
    category: "Streptococcus spp.",
    clsi_table: "Table 2H-2",
    source: "CLSI M100-Ed34 Table 2H-2",
    note: "Includes S. mitis group, S. mutans group, S. salivarius group, S. sanguinis group, and the S. anginosus group.",
    epidemiology: "Bacteremia, endocarditis, abscesses. Normal flora of oral cavity, GI and GU tracts.",

    antibiotics: {
      penicillin: { clsi: { mic_breakpoints: { endocarditis_and_other_serious_infections: {S: "≤0.12", I: "0.25-2", R: "≥4"}, other_infections: {S: "≤2", I: "0.5-4", R: "≥8"} }, disk_diffusion: { routine: {note: "MIC method should be used for penicillin susceptibility testing."} }, tier: 1 } },
      ampicillin: { clsi: { mic_breakpoints: { endocarditis_and_other_serious_infections: {S: "≤0.12", I: "0.25-2", R: "≥4"}, other_infections: {S: "≤2", I: "0.5-4", R: "≥8"} }, tier: 1 } },
      cefotaxime: { clsi: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, tier: 1 } },
      ceftriaxone: { clsi: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, tier: 1 } },
      cefepime: { clsi: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, tier: 2 } },
      "ceftolozane-tazobactam": { clsi: { mic_breakpoints: { S: "≤8/4" }, tier: 3 } },
      ertapenem: { clsi: { mic_breakpoints: {S: "≤0.5"}, tier: 2 } },
      meropenem: { clsi: { mic_breakpoints: {S: "≤0.5", I: "1", R: "≥2"}, tier: 2 } },
      doripenem: { clsi: { mic_breakpoints: {S: "≤0.12"}, tier: 2 } },
      vancomycin: { clsi: { mic_breakpoints: {S: "≤1"}, tier: 1 } },
      dalbavancin: { clsi: { mic_breakpoints: {S: "≤0.25"}, tier: 3 } },
      oritavancin: { clsi: { mic_breakpoints: {S: "≤0.12"}, tier: 3 } },
      telavancin: { clsi: { mic_breakpoints: {S: "≤0.06"}, tier: 3 } },
      daptomycin: { clsi: { mic_breakpoints: {S: "≤1"}, tier: 3 } },
      erythromycin: { clsi: { mic_breakpoints: { S: "≤0.5", I: "1", R: "≥2" }, disk_diffusion: { routine: { S: "≥21", I: "16-20", R: "≤15" } }, tier: 2 } },
      clarithromycin: { clsi: { mic_breakpoints: { S: "≤0.25", I: "0.5", R: "≥1" }, disk_diffusion: { routine: { S: "≥21", I: "17-20", R: "≤16" } }, tier: 2 } },
      dirithromycin: { clsi: { mic_breakpoints: { S: "≤0.5", I: "1", R: "≥2" }, disk_diffusion: { routine: { S: "≥19", I: "14-17", R: "≤13" } }, tier: 2 } },
      clindamycin: { clsi: { mic_breakpoints: {S: "≤0.25", I: "0.5", R: "≥1"}, disk_diffusion: { routine: { S: "≥19", I: "16-18", R: "≤15"} }, tier: 2, note: "Requires D-zone test for inducible resistance if erythromycin-resistant." } },
      tetracycline: { clsi: { mic_breakpoints: { S: "≤1", I: "2", R: "≥4" }, disk_diffusion: { routine: { S: "≥23", I: "19-22", R: "≤18" } }, tier: 2 } },
      levofloxacin: { clsi: { mic_breakpoints: {S: "≤2", I: "4", R: "≥8"}, tier: 2 } },
      moxifloxacin: { clsi: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, tier: 2 } },
      gatifloxacin: { clsi: { mic_breakpoints: {S: "≤0.25", I: "0.5", R: "≥1"}, tier: 2 } },
      ofloxacin: { clsi: { mic_breakpoints: {S: "≤2", I: "4", R: "≥8"}, tier: 2 } },
      trovafloxacin: { clsi: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, tier: 3 } },
      chloramphenicol: { clsi: { mic_breakpoints: { S: "≤4", I: "8", R: "≥16" }, disk_diffusion: { routine: { S: "≥21", I: "18-20", R: "≤17" } }, tier: 3 } },
      "quinupristin-dalfopristin": { clsi: { mic_breakpoints: { S: "≤1", I: "2", R: "≥4" }, disk_diffusion: { routine: { S: "≥19", I: "16-18", R: "≤15" } }, tier: 3 } },
      linezolid: { clsi: { mic_breakpoints: {S: "≤2"}, disk_diffusion: { routine: { S: "≥21"} }, tier: 2 } },
      tedizolid: { clsi: { mic_breakpoints: { S: "≤0.25" }, disk_diffusion: { routine: { S: "≥18" } }, tier: 3, note: "S. anginosus group test susceptible to linezolid by MIC are also considered susceptible to tedizolid. However, some organisms that are nonsusceptible to linezolid may be susceptible to tedizolid." } }
    }

  }
};
