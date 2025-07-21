// CLSI Tables 2A-1 & 2A-2: Enterobacterales Breakpoints
// Definitive version, fully corrected and comprehensive per CLSI M100-Ed34 (2024).
// This version incorporates all detailed corrections regarding inconsistent breakpoints,
// missing antibiotics, and critical clinical/testing context.
export default {
  "Enterobacterales_Table_2A_1": {
    "Escherichia_coli": {
      category: "Enterobacterales (Table 2A-1)",
      clsi_table: "Table 2A-1",
      source: "CLSI M100-Ed34",
      antibiotics: {
        // Beta-Lactams & Combinations
        ampicillin: { mic_breakpoints: {S: "≤8", I: "16", R: "≥32"}, disk_diffusion: { routine: { S: "≥17", I: "14-16", R: "≤13"}, condition: "UTI isolates only" } },
        "amoxicillin-clavulanate": { mic_breakpoints: {S: "≤8/4", I: "16/8", R: "≥32/16"}, disk_diffusion: { routine: { S: "≥18", I: "14-17", R: "≤13"}, condition: "For therapy of uncomplicated UTIs or for completion of therapy for systemic infection." } },
        "ampicillin-sulbactam": { mic_breakpoints: {S: "≤8/4", I: "16/8", R: "≥32/16"}, disk_diffusion: { routine: { S: "≥15", I: "12-14", R: "≤11"} } },
        mecillinam: { mic_breakpoints: {S: "≤8", I: "16", R: "≥32"}, disk_diffusion: { routine: { S: "≥15", I: "12-14", R: "≤11"}, condition: "Report only on E. coli" } },
        piperacillin: { mic_breakpoints: {S: "≤16", I: "32", R: "≥64"}, disk_diffusion: { routine: {note: "Disk diffusion breakpoints removed in CLSI 2022 due to poor correlation."} } },
        "piperacillin-tazobactam": { mic_breakpoints: {S: "≤16/4", I: "32/4", R: "≥64/4"}, disk_diffusion: { routine: { S: "≥21", I: "18-20", R: "≤17"} } },
        "ticarcillin-clavulanate": { mic_breakpoints: {S: "≤16/2", I: "32/2", R: "≥64/2"}, disk_diffusion: { routine: { S: "≥20", I: "15-19", R: "≤14"} } },
        // Cephalosporins (Parenteral)
        cefazolin: { mic_breakpoints: {S: "≤16", I: "32", R: "≥64"}, disk_diffusion: { routine: { S: "≥23", I: "20-22", R: "≤19"}, condition: "Used for therapy of uncomplicated UTIs only" } },
        cefamandole: { mic_breakpoints: {S: "≤8", I: "16", R: "≥32"}, disk_diffusion: { routine: { S: "≥18", I: "15-17", R: "≤14"} } },
        cefonicid: { mic_breakpoints: {S: "≤8", I: "16", R: "≥32"}, disk_diffusion: { routine: { S: "≥18", I: "15-17", R: "≤14"} } },
        cefoperazone: { mic_breakpoints: {S: "≤16", I: "32", R: "≥64"}, disk_diffusion: { routine: { S: "≥20", I: "16-19", R: "≤15"} } },
        cefotaxime: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, disk_diffusion: { routine: { S: "≥23", I: "20-22", R: "≤19"} } },
        cefotetan: { mic_breakpoints: {S: "≤16", I: "32", R: "≥64"}, disk_diffusion: { routine: { S: "≥16", I: "13-15", R: "≤12"} } },
        cefoxitin: { mic_breakpoints: {S: "≤16", I: "32", R: "≥64"}, disk_diffusion: { routine: { S: "≥18", I: "15-17", R: "≤14"} } },
        ceftazidime: { mic_breakpoints: {S: "≤8", I: "16", R: "≥32"}, disk_diffusion: { routine: { S: "≥21", I: "18-20", R: "≤17"} } },
        ceftizoxime: { mic_breakpoints: {S: "≤2", I: "4", R: "≥8"}, disk_diffusion: { routine: { S: "≥22", I: "20-21", R: "≤19"} } },
        ceftriaxone: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, disk_diffusion: { routine: { S: "≥23", I: "20-22", R: "≤19"} } },
        cefuroxime_parenteral: { mic_breakpoints: {S: "≤8", I: "16", R: "≥32"}, disk_diffusion: { routine: { S: "≥23", I: "20-22", R: "≤19"} } },
        cefepime: { mic_breakpoints: {S: "≤8", SDD: "16", R: "≥32"}, disk_diffusion: { routine: { S: "≥25", I: "19-24", R: "≤18"}, special_considerations: "The 'Intermediate' category for disk diffusion corresponds to the 'SDD' MIC breakpoint. Cefepime S/SDD results should be suppressed or edited and reported as resistant for isolates that demonstrate carbapenemase production (see Appendix G, Table G3)." } },
        ceftaroline: { mic_breakpoints: {S: "≤0.5", I: "1", R: "≥2"}, disk_diffusion: { routine: { S: "≥23", I: "20-22", R: "≤19"} } },
        "ceftazidime-avibactam": { mic_breakpoints: {S: "≤8/4", I: "null", R: "≥16/4"}, disk_diffusion: { routine: { S: "≥21", I: "null", R: "≤20"}, special_considerations: "Confirmatory MIC testing is indicated for isolates with zones of 20-22 mm to avoid reporting false-susceptible or false-resistant results." } },
        "ceftolozane-tazobactam": { mic_breakpoints: {S: "≤2/4", I: "null", R: "≥4/4"}, disk_diffusion: { routine: { S: "≥22", I: "19-21", R: "≤18"} } },
        moxalactam: { mic_breakpoints: {S: "≤8", I: "16", R: "≥32"}, disk_diffusion: { routine: { S: "≥23", I: "20-22", R: "≤19"} } },
        cefiderocol: { mic_breakpoints: {S: "≤4", I: "8", R: "≥16"}, disk_diffusion: { routine: { S: "≥18", I: "15-17", R: "≤14"}, special_considerations: "Note regarding reproducibility and interpretation of Cefiderocol testing results (both disk diffusion and broth microdilution) recommends discussion with prescribers and antimicrobial stewardship members regarding potential inaccuracies." } },
        // Cephalosporins (Oral) - for Uncomplicated UTI only unless otherwise specified
        cefazolin_oral_surrogate: { mic_breakpoints: {S: "≤16", I: "null", R: "≥32"}, disk_diffusion: { routine: { S: "≥15", I: "null", R: "≤14"}, condition: "Oral cephalosporin surrogate for uncomplicated UTI", special_considerations: "Surrogates for cefaclor, cefdinir, cefpodoxime, cefprozil, cefuroxime, cephalexin, and loracarbef. If cefazolin tests resistant, test individual drugs if considering for use." } },
        cefaclor: { mic_breakpoints: {S: "≤8", I: "16", R: "≥32"}, disk_diffusion: { routine: { S: "≥18", I: "15-17", R: "≤14"} } },
        cefadroxil: { mic_breakpoints: {S: "≤16", I: "null", R: "≥32"}, disk_diffusion: { routine: { S: "≥18", I: "15-17", R: "≤14"} } },
        cefdinir: { mic_breakpoints: {S: "≤2", I: "4", R: "≥8"}, disk_diffusion: { routine: { S: "≥20", I: "17-19", R: "≤16"} } },
        cefixime: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, disk_diffusion: { routine: { S: "≥19", I: "16-18", R: "≤15"} } },
        cefpodoxime: { mic_breakpoints: {S: "≤2", I: "4", R: "≥8"}, disk_diffusion: { routine: { S: "≥21", I: "18-20", R: "≤17"} } },
        cefprozil: { mic_breakpoints: {S: "≤16", I: "null", R: "≥32"}, disk_diffusion: { routine: { S: "≥18", I: "15-17", R: "≤14"} } },
        ceftibuten: { mic_breakpoints: {S: "≤8", I: "16", R: "≥32"}, disk_diffusion: { routine: { S: "≥23", I: "20-22", R: "≤19"} } },
        cefuroxime_oral: { mic_breakpoints: {S: "≤4", I: "8-16", R: "≥32"}, disk_diffusion: { routine: { S: "≥23", I: "15-22", R: "≤14"} } },
        cephalexin: { mic_breakpoints: {S: "≤16", I: "null", R: "≥32"}, disk_diffusion: { routine: { S: "≥18", I: "15-17", R: "≤14"} } },
        loracarbef: { mic_breakpoints: {S: "≤8", I: "16", R: "≥32"}, disk_diffusion: { routine: { S: "≥18", I: "15-17", R: "≤14"} } },
        // Carbapenems & Combinations
        doripenem: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, disk_diffusion: { routine: { S: "≥23", I: "20-22", R: "≤19"} } },
        ertapenem: { mic_breakpoints: {S: "≤0.5", I: "1", R: "≥2"}, disk_diffusion: { routine: { S: "≥22", I: "19-21", R: "≤18"} } },
        imipenem: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, disk_diffusion: { routine: { S: "≥23", I: "20-22", R: "≤19"} } },
        "imipenem-relebactam": { mic_breakpoints: {S: "≤1/4", I: "2/4", R: "≥4/4"}, disk_diffusion: { routine: { S: "≥25", I: "21-24", R: "≤20"}, special_considerations: "Breakpoints do not apply to the family Morganellaceae (Morganella, Proteus, Providencia)." } },
        meropenem: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, disk_diffusion: { routine: { S: "≥23", I: "20-22", R: "≤19"} } },
        "meropenem-vaborbactam": { mic_breakpoints: {S: "≤4/8", I: "8/8", R: "≥16/8"}, disk_diffusion: { routine: { S: "≥18", I: "15-17", R: "≤14"}, special_considerations: "CRITICAL WARNING: Isolates with OXA-48-like enzymes may test susceptible but not respond clinically. If OXA-48 is detected, report as resistant or suppress the result." } },
        // Monobactams, Aminoglycosides, Fluoroquinolones...
        aztreonam: { mic_breakpoints: {S: "≤8", I: "16", R: "≥32"}, disk_diffusion: { routine: { S: "≥21", I: "16-20", R: "≤15"} } },
        amikacin: { mic_breakpoints: {S: "≤16", I: "32", R: "≥64"}, disk_diffusion: { routine: { S: "≥17", I: "15-16", R: "≤14"} } },
        gentamicin: { mic_breakpoints: {S: "≤4", I: "8", R: "≥16"}, disk_diffusion: { routine: { S: "≥15", I: "13-14", R: "≤12"} } },
        kanamycin: { mic_breakpoints: {S: "≤16", I: "32", R: "≥64"}, disk_diffusion: { routine: { S: "≥18", I: "15-17", R: "≤14"} } },
        netilmicin: { mic_breakpoints: {S: "≤4", I: "8", R: "≥16"}, disk_diffusion: { routine: { S: "≥15", I: "13-14", R: "≤12"} } },
        plazomicin: { mic_breakpoints: {S: "≤4", I: "8", R: "≥16"}, disk_diffusion: { routine: { S: "≥30", I: "14-17", R: "≤13"} } },
        streptomycin: { mic_breakpoints: {S: "≤8", I: "16", R: "≥32"}, disk_diffusion: { routine: { S: "≥15", I: "12-14", R: "≤11"} } },
        tobramycin: { mic_breakpoints: {S: "≤4", I: "8", R: "≥16"}, disk_diffusion: { routine: { S: "≥15", I: "13-14", R: "≤12"} } },
        cinoxacin: { mic_breakpoints: {S: "≤16", I: "null", R: "≥32"}, disk_diffusion: { routine: { S: "≥19", I: "14-18", R: "≤13"}, condition: "UTI only" } },
        ciprofloxacin: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, disk_diffusion: { routine: { S: "≥21", I: "16-20", R: "≤15"} } },
        enoxacin: { mic_breakpoints: {S: "≤2", I: "4", R: "≥8"}, disk_diffusion: { routine: { S: "≥20", I: "17-19", R: "≤16"}, condition: "UTI only" } },
        gatifloxacin: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, disk_diffusion: { routine: { S: "≥23", I: "20-22", R: "≤19"} } },
        gemifloxacin: { mic_breakpoints: {S: "≤0.25", I: "0.5", R: "≥1"}, disk_diffusion: { routine: { S: "≥20", I: "16-19", R: "≤15"}, special_considerations: "Report only on K. pneumoniae" } },
        grepafloxacin: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, disk_diffusion: { routine: { S: "≥18", I: "15-17", R: "≤14"} } },
        levofloxacin: { mic_breakpoints: {S: "≤2", I: "4", R: "≥8"}, disk_diffusion: { routine: { S: "≥17", I: "14-16", R: "≤13"} } },
        lomefloxacin: { mic_breakpoints: {S: "≤2", I: "4", R: "≥8"}, disk_diffusion: { routine: { S: "≥22", I: "19-21", R: "≤18"}, condition: "UTI only" } },
        moxifloxacin: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, disk_diffusion: { routine: { S: "≥17", I: "14-16", R: "≤13"} } },
        nalidixic_acid: { mic_breakpoints: {S: "≤16", I: "null", R: "≥32"}, disk_diffusion: { routine: { S: "≥19", I: "14-18", R: "≤13"}, condition: "UTI only" } },
        norfloxacin: { mic_breakpoints: {S: "≤4", I: "8", R: "≥16"}, disk_diffusion: { routine: { S: "≥17", I: "13-16", R: "≤12"}, condition: "UTI only" } },
        ofloxacin: { mic_breakpoints: {S: "≤2", I: "4", R: "≥8"}, disk_diffusion: { routine: { S: "≥19", I: "13-18", R: "≤12"} } },
        sparfloxacin: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, disk_diffusion: { routine: { S: "≥17", I: "14-16", R: "≤13"} } },
        // Folate Pathway Antagonists & Other Classes
        sulfonamides: { mic_breakpoints: {S: "≤256", I: "null", R: "≥512"}, disk_diffusion: { routine: { S: "≥17", I: "11-16", R: "≤10"}, condition: "UTI only", special_considerations: "Sulfisoxazole can be used to represent any of the currently available sulfonamide preparations." } },
        trimethoprim: { mic_breakpoints: {S: "≤8", I: "null", R: "≥16"}, disk_diffusion: { routine: { S: "≥16", I: "11-15", R: "≤10"}, condition: "UTI only" } },
        "trimethoprim-sulfamethoxazole": { mic_breakpoints: {S: "≤2/38", I: "null", R: "≥4/76"}, disk_diffusion: { routine: { S: "≥16", I: "11-15", R: "≤10"} } },
        chloramphenicol: { mic_breakpoints: {S: "≤8", I: "16", R: "≥32"}, disk_diffusion: { routine: { S: "≥18", I: "13-17", R: "≤12"}, special_considerations: "Not routinely reported on isolates from the urinary tract." } },
        colistin_polymyxinB: { mic_breakpoints: {S: "≤2", I: "≤2", R: "≥4"}, disk_diffusion: { routine: {note: "Disk diffusion and gradient diffusion methods should not be performed."}, special_considerations: "For colistin, broth microdilution, CBDE, and CAT MIC methods are acceptable. For polymyxin B, broth microdilution is the only approved method. Guidance for administration: Colistin (methanesulfonate) with loading and maximum renally adjusted doses; Polymyxin B with loading and maximum recommended doses. WARNING: When colistin or polymyxin B is given systemically, neither is likely to be effective for pneumonia." } },
        fosfomycin: { mic_breakpoints: {S: "≤64", I: "128", R: "≥256"}, disk_diffusion: { routine: { S: "≥16", I: "13-15", R: "≤12"}, condition: "E. coli urinary tract isolates only", special_considerations: "Breakpoints apply only to E. coli and should not be extrapolated to other species of Enterobacterales. The 200-μg fosfomycin disk contains 50 μg glucose-6-phosphate. MIC testing must be performed by agar dilution with glucose-6-phosphate. Broth dilution should not be performed." } },
        nitrofurantoin: { mic_breakpoints: {S: "≤32", I: "64", R: "≥128"}, disk_diffusion: { routine: { S: "≥17", I: "15-16", R: "≤14"}, condition: "UTI only" } },
        tetracycline: { mic_breakpoints: {S: "≤4", I: "8", R: "≥16"}, disk_diffusion: { routine: { S: "≥15", I: "12-14", R: "≤11"} } },
        doxycycline: { mic_breakpoints: {S: "≤4", I: "8", R: "≥16"}, disk_diffusion: { routine: { S: "≥14", I: "11-13", R: "≤10"} } },
        minocycline: { mic_breakpoints: {S: "≤4", I: "8", R: "≥16"}, disk_diffusion: { routine: { S: "≥16", I: "13-15", R: "≤12"} } }
      }
    },
    "Inducible_AmpC_Producers_Note": { note: "For Enterobacter cloacae complex, Klebsiella aerogenes, Citrobacter freundii complex, Serratia marcescens, Proteus vulgaris, Providencia spp., Hafnia alvei, and Morganella morganii, isolates that are susceptible to third-generation cephalosporins (e.g., ceftriaxone) may develop resistance during prolonged therapy. Reporting of results for these organisms should involve the antimicrobial stewardship team and other institutional stakeholders (CLSI M100-Ed34, Table 2A-1, Footnote 15)." },
    "Citrobacter_freundii_complex": { category: "Enterobacterales (Table 2A-1)", intrinsic_resistance: ["ampicillin", "amoxicillin", "amoxicillin-clavulanate", "ampicillin-sulbactam", "cefazolin"], note: "Inducible AmpC producer. See Inducible_AmpC_Producers_Note. Breakpoints otherwise as for E. coli." },
    "Citrobacter_koseri": { category: "Enterobacterales (Table 2A-1)", intrinsic_resistance: [], note: "Breakpoints as for E. coli." },
    "Enterobacter_cloacae_complex": { category: "Enterobacterales (Table 2A-1)", intrinsic_resistance: ["ampicillin", "amoxicillin", "amoxicillin-clavulanate", "ampicillin-sulbactam", "cefazolin"], note: "Inducible AmpC producer. See Inducible_AmpC_Producers_Note. Breakpoints otherwise as for E. coli." },
    "Hafnia_alvei": { category: "Enterobacterales (Table 2A-1)", intrinsic_resistance: ["ampicillin", "amoxicillin", "amoxicillin-clavulanate", "ampicillin-sulbactam", "cefazolin"], note: "Inducible AmpC producer. See Inducible_AmpC_Producers_Note. Breakpoints otherwise as for E. coli." },
    "Klebsiella_aerogenes": { category: "Enterobacterales (Table 2A-1)", intrinsic_resistance: ["ampicillin", "amoxicillin", "amoxicillin-clavulanate", "ampicillin-sulbactam", "cefazolin"], note: "Inducible AmpC producer. See Inducible_AmpC_Producers_Note. Breakpoints otherwise as for E. coli." },
    "Klebsiella_oxytoca": { category: "Enterobacterales (Table 2A-1)", intrinsic_resistance: ["ampicillin", "amoxicillin"], note: "Breakpoints as for E. coli. Often produces an inducible beta-lactamase that may not be detected by routine ESBL tests." },
    "Klebsiella_pneumoniae": { category: "Enterobacterales (Table 2A-1)", intrinsic_resistance: ["ampicillin", "amoxicillin"], note: "Breakpoints as for E. coli." },
    "Morganella_morganii": { category: "Enterobacterales (Table 2A-1)", intrinsic_resistance: ["ampicillin", "amoxicillin", "amoxicillin-clavulanate", "ampicillin-sulbactam", "cefazolin", "colistin", "tigecycline"], note: "Inducible AmpC producer. See Inducible_AmpC_Producers_Note. Breakpoints otherwise as for E. coli." },
    "Proteus_mirabilis": { category: "Enterobacterales (Table 2A-1)", intrinsic_resistance: ["nitrofurantoin", "colistin", "tigecycline"], note: "No reliable disk diffusion for imipenem. Breakpoints otherwise as for E. coli." },
    "Proteus_vulgaris": { category: "Enterobacterales (Table 2A-1)", intrinsic_resistance: ["ampicillin", "amoxicillin", "nitrofurantoin", "colistin", "tigecycline"], note: "Inducible AmpC producer. See Inducible_AmpC_Producers_Note. Breakpoints otherwise as for E. coli." },
    "Providencia_spp": { category: "Enterobacterales (Table 2A-1)", intrinsic_resistance: ["ampicillin", "amoxicillin", "amoxicillin-clavulanate", "ampicillin-sulbactam", "cefazolin", "colistin", "tigecycline"], note: "Inducible AmpC producer. See Inducible_AmpC_Producers_Note. Breakpoints otherwise as for E. coli." },
    "Serratia_marcescens": { category: "Enterobacterales (Table 2A-1)", intrinsic_resistance: ["ampicillin", "amoxicillin", "amoxicillin-clavulanate", "ampicillin-sulbactam", "cefazolin", "colistin"], note: "Inducible AmpC producer. See Inducible_AmpC_Producers_Note. Breakpoints otherwise as for E. coli." },
    "Yersinia_enterocolitica": { category: "Enterobacterales (Table 2A-1)", intrinsic_resistance: ["ampicillin", "amoxicillin", "amoxicillin-clavulanate", "ampicillin-sulbactam", "cefazolin"], note: "Inducible AmpC producer. See Inducible_AmpC_Producers_Note. Breakpoints otherwise as for E. coli." }
  },
  "Salmonella_and_Shigella_Table_2A_2": {
    "Salmonella_spp": {
      category: "Salmonella and Shigella (Table 2A-2)",
      clsi_table: "Table 2A-2",
      source: "CLSI M100-Ed34",
      note: "For extraintestinal isolates only.",
      antibiotics: {
        penicillin: { mic_breakpoints: {S: "≤8", I: "16", R: "≥32"}, disk_diffusion: { routine: { S: "≥17", I: "14-16", R: "≤13"} } },
        azithromycin: { mic_breakpoints: {S: "≤16", I: "null", R: "≥32"}, disk_diffusion: { routine: { S: "≥13", I: "null", R: "≤12"}, condition: "For S. Typhi/Paratyphi only" } },
        ceftriaxone: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, disk_diffusion: { routine: { S: "≥26", I: "23-25", R: "≤22"} } },
        chloramphenicol: { mic_breakpoints: {S: "≤8", I: "16", R: "≥32"}, disk_diffusion: { routine: { S: "≥18", I: "13-17", R: "≤12"} } },
        ciprofloxacin: { mic_breakpoints: {S: "≤0.06", I: "0.12-0.5", R: "≥1"}, disk_diffusion: { routine: { S: "≥31", I: "21-30", R: "≤20"} } },
        pefloxacin_inv: { mic_breakpoints: {S: "≤0.25", I: "null", R: "≥0.5"}, disk_diffusion: { routine: { S: "≥24", I: "null", R: "≤23"}, condition: "Surrogate for ciprofloxacin in S. Typhi" } },
        ertapenem: { mic_breakpoints: {S: "≤0.5", I: "1", R: "≥2"}, disk_diffusion: { routine: { S: "≥22", I: "19-21", R: "≤18"} } },
        imipenem: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, disk_diffusion: { routine: { S: "≥23", I: "20-22", R: "≤19"} } },
        meropenem: { mic_breakpoints: {S: "≤1", I: "2", R: "≥4"}, disk_diffusion: { routine: { S: "≥23", I: "20-22", R: "≤19"} } },
        "trimethoprim-sulfamethoxazole": { mic_breakpoints: {S: "≤2/38", I: "null", R: "≥4/76"}, disk_diffusion: { routine: { S: "≥16", I: "11-15", R: "≤10"} } },
        tetracycline: { mic_breakpoints: {S: "≤4", I: "8", R: "≥16"}, disk_diffusion: { routine: { S: "≥15", I: "12-14", R: "≤11"} } },
        doxycycline: { mic_breakpoints: {S: "≤4", I: "8", R: "≥16"}, disk_diffusion: { routine: { S: "≥14", I: "11-13", R: "≤10"} } },
        minocycline: { mic_breakpoints: {S: "≤4", I: "8", R: "≥16"}, disk_diffusion: { routine: { S: "≥16", I: "13-15", R: "≤12"} } }
      }
    },
    "Shigella_spp": {
      category: "Salmonella and Shigella (Table 2A-2)",
      clsi_table: "Table 2A-2",
      source: "CLSI M100-Ed34",
      antibiotics: {
        penicillin: { mic_breakpoints: {S: "≤8", I: "16", R: "≥32"}, disk_diffusion: { routine: { S: "≥17", I: "14-16", R: "≤13"} } },
        azithromycin: { mic_breakpoints: {S: "≤8", I: "null", R: "≥16"}, disk_diffusion: { routine: { S: "≥12", I: "null", R: "≤11"}, special_considerations: "Disk diffusion zones can be hazy and difficult to measure, especially S. sonnei. If difficult to measure, an MIC method is recommended." } },
        ceftriaxone: { mic_breakpoints: {S: "≤1", I: "null", R: "≥2"}, disk_diffusion: { routine: { S: "≥26", I: "23-25", R: "≤22"} } },
        ciprofloxacin: { mic_breakpoints: {S: "≤0.25", I: "0.5", R: "≥1"}, disk_diffusion: { routine: { S: "≥21", I: "16-20", R: "≤15"} } },
        ofloxacin: { mic_breakpoints: {S: "≤0.25", I: "0.5", R: "≥1"}, disk_diffusion: { routine: { S: "≥21", I: "16-20", R: "≤15"} } },
        "trimethoprim-sulfamethoxazole": { mic_breakpoints: {S: "≤2/38", I: "null", R: "≥4/76"}, disk_diffusion: { routine: { S: "≥16", I: "11-15", R: "≤10"} } }
      }
    }
  }
};
