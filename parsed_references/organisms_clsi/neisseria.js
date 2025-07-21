// CLSI Tables 2F, 2I: Neisseria spp. Breakpoints
// Complete coverage for N. gonorrhoeae and N. meningitidis, updated with CLSI M100-Ed34 data.

export default {
"Neisseria_gonorrhoeae": {
    category: "Neisseria spp.",
    clsi_table: "Table 2F",
    common_resistance_mechanisms: ["Penicillin resistance (plasmid and chromosomal)", "Quinolone resistance", "Cephalosporin resistance emerging"],
    epidemiology: "Sexually transmitted infection, increasing MDR",
    intrinsic_resistance: [],
    antibiotics: {
        ampicillin: {
            clsi: {
                mic_breakpoints: { S: "≤0.12", I: "0.12-1", R: "≥2" },
                disk_diffusion: { routine: { S: "≥47", I: "27-46", R: "≤26" },
                tier: 2,
                source: "CLSI M100-Ed34 Table 2F"
                }
            }
        },
        azithromycin: {
            clsi: {
                mic_breakpoints: { S: "≤1", I: null, R: "≥2" },
                disk_diffusion: { routine: { S: "≥13", I: "11-15", R: "≤10" },
                tier: 1,
                source: "CLSI M100-Ed34 Table 2F"
                },
                clinical_intelligence: {
                    if_resistant: {
                        implications: ["Increasing resistance rates"],
                        alternatives: ["ceftriaxone monotherapy"]
                    }
                }
            }
        },
        cefepime: {
            clsi: {
                mic_breakpoints: { S: "≤0.5", I: null, R: "≥1" },
                disk_diffusion: { routine: { S: "≥31", I: null, R: "≤30" },
                tier: 3,
                source: "CLSI M100-Ed34 Table 2F"
                }
            }
        },
        cefixime: {
            clsi: {
                mic_breakpoints: { S: "≤0.25", I: null, R: "≥0.5" },
                disk_diffusion: { routine: { S: "≥31", I: null, R: "≤30" },
                tier: 2,
                source: "CLSI M100-Ed34 Table 2F"
                }
            }
        },
        cefotaxime: {
            clsi: {
                mic_breakpoints: { S: "≤0.5", I: null, R: "≥1" },
                disk_diffusion: { routine: { S: "≥31", I: null, R: "≤30" },
                tier: 2,
                source: "CLSI M100-Ed34 Table 2F"
                }
            }
        },
        cefoxitin: {
            clsi: {
                mic_breakpoints: { S: "≤0.5", I: null, R: "≥1" },
                disk_diffusion: { routine: { S: "≥30", I: null, R: "≤29" },
                tier: 3,
                source: "CLSI M100-Ed34 Table 2F"
                }
            }
        },
        ceftriaxone: {
            clsi: {
                mic_breakpoints: { S: "≤0.25", I: null, R: "≥0.5" },
                disk_diffusion: { routine: { S: "≥35", I: null, R: "≤34" },
                tier: 1,
                source: "CLSI M100-Ed34 Table 2F"
                },
                clinical_intelligence: {
                    if_susceptible: {
                        confidence: "Current first-line therapy",
                        dosing_notes: "Single dose IM for uncomplicated infection"
                    },
                    if_resistant: {
                        implications: ["Emerging resistance - public health concern"],
                        alternatives: ["spectinomycin", "combination therapy"]
                    }
                }
            }
        },
        chloramphenicol: {
            clsi: {
                mic_breakpoints: { S: "≤8", I: "null", R: "≥16" },
                disk_diffusion: { routine: { S: "≥18", I: "13-17", R: "≤12" },
                tier: 3,
                source: "CLSI M100-Ed34 Table 2F"
                }
            }
        },
        ciprofloxacin: {
            clsi: {
                mic_breakpoints: { S: "≤0.06", I: null, R: "≥0.12" },
                disk_diffusion: { routine: { S: "≥21", I: "17-20", R: "≤16" },
                tier: 2,
                source: "CLSI M100-Ed34 Table 2F"
                }
            }
        },
        ertapenem: {
            clsi: {
                mic_breakpoints: { S: "≤0.5", I: "1", R: "≥2" },
                disk_diffusion: { routine: { S: "≥22", I: "19-21", R: "≤18" },
                tier: 3,
                source: "CLSI M100-Ed34 Table 2F"
                }
            }
        },
        imipenem: {
            clsi: {
                mic_breakpoints: { S: "≤0.5", I: "1", R: "≥2" },
                disk_diffusion: { routine: { S: "≥23", I: "20-22", R: "≤19" },
                tier: 3,
                source: "CLSI M100-Ed34 Table 2F"
                }
            }
        },
        meropenem: {
            clsi: {
                mic_breakpoints: { S: "≤0.5", I: "1", R: "≥2" },
                disk_diffusion: { routine: { S: "≥23", I: "20-22", R: "≤19" },
                tier: 3,
                source: "CLSI M100-Ed34 Table 2F"
                }
            }
        },
        ofloxacin: {
            clsi: {
                mic_breakpoints: { S: "≤0.06", I: null, R: "≥0.12" },
                disk_diffusion: { routine: { S: "≥19", I: "13-15", R: "≤12" },
                tier: 2,
                source: "CLSI M100-Ed34 Table 2F"
                }
            }
        },
        penicillin: {
            clsi: {
                mic_breakpoints: { S: "≤0.06", I: "0.12-1", R: "≥2" },
                disk_diffusion: { routine: { S: "≥47", I: "27-46", R: "≤26" },
                tier: 1,
                source: "CLSI M100-Ed34 Table 2F"
                },
                clinical_intelligence: {
                    if_resistant: {
                        implications: ["PPNG or chromosomal resistance"],
                        alternatives: ["ceftriaxone", "spectinomycin"]
                    }
                }
            }
        },
        spectinomycin: {
            clsi: {
                mic_breakpoints: { S: "≤64", I: null, R: "≥128" },
                disk_diffusion: { routine: { S: "≥18", I: "15-17", R: "≤14" },
                tier: 2,
                source: "CLSI M100-Ed34 Table 2F"
                },
                clinical_intelligence: {
                    if_susceptible: {
                        confidence: "Alternative for beta-lactam resistant strains",
                        dosing_notes: "Single IM dose"
                    }
                }
            }
        },
        sulfisoxazole: {
            clsi: {
                mic_breakpoints: { S: "≤256", I: null, R: "≥512" },
                disk_diffusion: { routine: { S: "≥17", I: "13-16", R: "≤12" },
                tier: 3,
                source: "CLSI M100-Ed34 Table 2F"
                }
            }
        },
        tetracycline: {
            clsi: {
                mic_breakpoints: { S: "≤1", I: "2", R: "≥4" },
                disk_diffusion: { routine: { S: "≥19", I: "15-18", R: "≤14" },
                tier: 2,
                source: "CLSI M100-Ed34 Table 2F"
                }
            }
        },
        "trimethoprim-sulfamethoxazole": {
            clsi: {
                mic_breakpoints: { S: "≤0.5/9.5", I: "0.25/4.75", R: "≥0.5/9.5" },
                disk_diffusion: { routine: { S: "≥26", I: "20-25", R: "≤19" },
                tier: 3,
                source: "CLSI M100-Ed34 Table 2F"
                }
            }
        }
    }
},
"Neisseria_meningitidis": {
    category: "Neisseria spp.",
    clsi_table: "Table 2I",
    common_resistance_mechanisms: ["Penicillin resistance (PBP mutations)", "Quinolone resistance rare"],
    epidemiology: "Meningitis, meningococcemia - laboratory safety critical",
    intrinsic_resistance: [],
    antibiotics: {
        ampicillin: {
            clsi: {
                mic_breakpoints: { S: "≤0.12", I: "0.12-0.25", R: "≥0.5" },
                disk_diffusion: { routine: { note: "Not provided" } },
                tier: 1,
                source: "CLSI M100-Ed34 Table 2I"
            }
        },
        azithromycin: {
            clsi: {
                mic_breakpoints: { S: "≤2", I: null, R: "≥4" },
                disk_diffusion: { routine: { S: "≥20", I: null, R: "≤19" } },
                tier: 2,
                source: "CLSI M100-Ed34 Table 2I"
            }
        },
        cefotaxime: {
            clsi: {
                mic_breakpoints: { S: "≤0.12", I: null, R: "≥0.25" },
                disk_diffusion: { routine: { S: "≥34", I: null, R: "≤33" } },
                tier: 1,
                source: "CLSI M100-Ed34 Table 2I"
            }
        },
        ceftriaxone: {
            clsi: {
                mic_breakpoints: { S: "≤0.12", I: null, R: "≥0.25" },
                disk_diffusion: { routine: { S: "≥34", I: null, R: "≤33" } },
                tier: 1,
                source: "CLSI M100-Ed34 Table 2I"
            }
        },
        chloramphenicol: {
            clsi: {
                mic_breakpoints: { S: "≤2", I: null, R: "≥4" },
                disk_diffusion: { routine: { S: "≥26", I: "20-25", R: "≤19" } },
                tier: 2,
                source: "CLSI M100-Ed34 Table 2I"
            }
        },
        ciprofloxacin: {
            clsi: {
                mic_breakpoints: { S: "≤0.03", I: null, R: "≥0.06" },
                disk_diffusion: { routine: { S: "≥41", I: null, R: "≤40" } },
                tier: 2,
                source: "CLSI M100-Ed34 Table 2I"
            },
            clinical_intelligence: {
                if_susceptible: {
                    confidence: "Alternative for prophylaxis",
                    dosing_notes: "Close contact prophylaxis"
                }
            }
        },
        levofloxacin: {
            clsi: {
                mic_breakpoints: { S: "≤0.03", I: null, R: "≥0.06" },
                disk_diffusion: { routine: { S: "≥32", I: null, R: "≤31" } },
                tier: 2,
                source: "CLSI M100-Ed34 Table 2I"
            }
        },
        meropenem: {
            clsi: {
                mic_breakpoints: { S: "≤0.25", I: null, R: "≥0.5" },
                disk_diffusion: { routine: { note: "Not provided" } },
                tier: 2,
                source: "CLSI M100-Ed34 Table 2I"
            }
        },
        minocycline: {
            clsi: {
                mic_breakpoints: { S: "≤2", I: null, R: "≥4" },
                disk_diffusion: { routine: { S: "≥26", I: "20-25", R: "≤19" } },
                tier: 2,
                source: "CLSI M100-Ed34 Table 2I"
            }
        },
        penicillin: {
            clsi: {
                mic_breakpoints: { S: "≤0.06", I: "0.12-0.25", R: "≥0.5" },
                disk_diffusion: { routine: { note: "Disk diffusion not suitable for reporting" } },
                tier: 1,
                source: "CLSI M100-Ed34 Table 2I"
            },
            clinical_intelligence: {
                if_susceptible: {
                    confidence: "Drug of choice if susceptible",
                    dosing_notes: "High-dose IV for meningitis"
                }
            }
        },
        rifampin: {
            clsi: {
                mic_breakpoints: { S: "≤1", I: null, R: "≥2" },
                disk_diffusion: { routine: { S: "≥25", I: null, R: "≤24" } },
                tier: 2,
                source: "CLSI M100-Ed34 Table 2I"
            },
            clinical_intelligence: {
                if_susceptible: {
                    confidence: "Used for chemoprophylaxis",
                    dosing_notes: "Close contact prophylaxis"
                }
            }
        },
        sulfisoxazole: {
            clsi: {
                mic_breakpoints: { S: "≤32", I: null, R: "≥64" },
                disk_diffusion: { routine: { S: "≥26", I: "20-25", R: "≤19" } },
                tier: 3,
                source: "CLSI M100-Ed34 Table 2I"
            }
        },
        tetracycline: {
            clsi: {
                mic_breakpoints: { S: "≤2", I: null, R: "≥4" },
                disk_diffusion: { routine: { S: "≥26", I: "20-25", R: "≤19" } },
                tier: 2,
                source: "CLSI M100-Ed34 Table 2I"
            }
        },
        "trimethoprim-sulfamethoxazole": {
            clsi: {
                mic_breakpoints: { S: "≤0.5/9.5", I: "0.25/4.75", R: "≥0.5/9.5" },
                disk_diffusion: { routine: { S: "≥26", I: "20-25", R: "≤19" } },
                tier: 2,
                source: "CLSI M100-Ed34 Table 2I"
            }
        }
    }
}
};
