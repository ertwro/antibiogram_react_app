// STANDARDIZED SCHEMA TEMPLATE FOR ORGANISM BREAKPOINT FILES
// This template defines the consistent structure all organism files should follow

export const STANDARD_ORGANISM_SCHEMA = {
  // Primary organism entry - each organism should have this structure
  "Organism_Name": {
    // Required base properties
    category: "Category Name (e.g., Enterobacterales, Staphylococcus spp., etc.)",
    clsi_table: "Table reference (e.g., Table 2A-1, Table 2C, etc.)",
    source: "CLSI M100-Ed34",
    
    // Optional inheritance properties (for organisms that inherit from others)
    breakpoint_base: "Base_Organism_Name", // Optional: if this organism inherits from another
    
    // Epidemiology and clinical context
    epidemiology: "Brief clinical description of organism significance",
    common_resistance_mechanisms: ["resistance mechanism 1", "resistance mechanism 2"],
    intrinsic_resistance: ["antibiotic1", "antibiotic2"], // Antibiotics this organism is intrinsically resistant to
    
    // Optional notes array for complex clinical information
    notes: [
      "Important clinical note 1",
      "Important clinical note 2"
    ],
    
    // Antibiotics - standardized structure for ALL antibiotics
    antibiotics: {
      "antibiotic_name": {
        clsi: {
          // MIC breakpoints - always use this structure
          mic_breakpoints: {
            S: "≤value",
            I: "value", // null if no intermediate category
            R: "≥value"
          },
          
          // Disk diffusion breakpoints - consistent structure
          disk_diffusion: {
            routine: { S: "≥value", I: "value-range", R: "≤value" },
            direct_blood_culture: { S: "≥value", I: "value-range", R: "≤value" } // Optional
          },
          
          // Tier classification for reporting priority
          tier: 1, // 1 = primary, 2 = secondary, 3 = supplemental, 4 = special use
          
          // Optional: Special conditions or notes
          condition: "Special condition text if applicable"
        },
        
        // Optional: Clinical intelligence for enhanced decision support
        clinical_intelligence: {
          note: "Clinical guidance",
          warning: "Important warning if applicable",
          if_resistant: {
            implications: ["Clinical implication 1"],
            alternatives: ["alternative drug 1", "alternative drug 2"]
          },
          if_susceptible: {
            confidence: "Clinical confidence note",
            dosing_notes: "Dosing guidance"
          },
          special_testing: {
            description: "Special testing requirement",
            interpretation: "How to interpret results"
          }
        }
      }
    },
    
    // Optional: Specific breakpoints for inheritance-based organisms
    specific_breakpoints: {
      // Only include antibiotics that differ from the base organism
      "antibiotic_name": {
        // Same structure as above, but only for overrides
      }
    }
  }
};

export const INHERITANCE_PATTERNS = {
  // Pattern 1: Direct inheritance (like Staphylococcus species)
  direct_inheritance: {
    breakpoint_base: "Base_Organism_Name",
    specific_breakpoints: {
      // Only antibiotics that differ from base
    }
  },
  
  // Pattern 2: Category-based inheritance (like Enterobacterales)
  category_inheritance: {
    category: "Category_Name",
    note: "Breakpoints as for Base_Organism except for intrinsic resistance",
    intrinsic_resistance: ["specific_antibiotics"]
  },
  
  // Pattern 3: Shared properties with members (like Anaerobes groups)
  grouped_inheritance: {
    shared_properties: {
      category: "Category_Name",
      common_resistance_mechanisms: [],
      intrinsic_resistance: []
    },
    members: {
      "Member_1": { epidemiology: "specific info" },
      "Member_2": { epidemiology: "specific info" }
    },
    antibiotics: {
      // Shared antibiotics for all members
    }
  }
};

export const VALIDATION_RULES = {
  required_fields: ["category", "clsi_table", "source", "antibiotics"],
  antibiotic_required_fields: ["clsi"],
  clsi_required_fields: ["mic_breakpoints", "tier"],
  valid_tiers: [1, 2, 3, 4],
  valid_breakpoint_operators: ["≤", "≥", "=", "<", ">"],
  
  // Inheritance validation
  inheritance_rules: {
    if_breakpoint_base_exists: {
      must_have: ["specific_breakpoints"],
      cannot_have_full: ["antibiotics"] // Should only have specific overrides
    }
  }
};