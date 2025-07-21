// scripts/generate-antibiotics-index.js
// Generate comprehensive antibiotics database from JSON files

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ANTIBIOTICS_DIR = 'parsed_references/antibacterial_drugs_json';
const OUTPUT_FILE = 'src/data/generatedAntibioticsIndex.js';

// Drug family mapping for classification
const DRUG_FAMILY_MAPPING = {
  'penicillins': 'PENICILLIN',
  'cephalosporins': 'CEPHALOSPORIN', 
  'carbapenems': 'CARBAPENEM',
  'monobactams': 'MONOBACTAM',
  'fluoroquinolones': 'FLUOROQUINOLONE',
  'aminoglycosides': 'AMINOGLYCOSIDE',
  'glycolipopeptides': 'GLYCOPEPTIDE',
  'lincosamides': 'LINCOSAMIDE',
  'macrolides': 'MACROLIDE',
  'oxazolidinones': 'OXAZOLIDINONE',
  'antifolates': 'ANTIFOLATE',
  'tetracyclines': 'TETRACYCLINE',
  'polymyxins': 'POLYMYXIN',
  'rifamycins': 'RIFAMYCIN',
  'streptogramins': 'STREPTOGRAMIN',
  'pleuromutilins': 'PLEUROMUTILIN',
  'nitroimidazoles': 'NITROIMIDAZOLE',
  'chloramphenicol': 'CHLORAMPHENICOL',
  'fosfomycin_disodium_iv': 'FOSFOMYCIN',
  'fusidic_acid': 'FUSIDIC_ACID',
  'telithromycin': 'KETOLIDE',
  'tigecycline': 'GLYCYLCYCLINE'
};

function getAllJsonFiles(dir, baseDir = dir) {
  let files = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      
      try {
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Skip certain directories
          if (item === 'antibacterials_by_syndrome') {
            console.log(`⏭️ Skipping syndrome-specific directory: ${item}`);
            continue;
          }
          files = files.concat(getAllJsonFiles(fullPath, baseDir));
        } else if (item.endsWith('.json') && !item.includes('overview') && !item.includes('resistance_genotypes')) {
          // Skip overview files and resistance genotype files
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            const drugData = JSON.parse(content);
            
            // Only include files with drug_name (actual drug files)
            if (drugData.drug_name && !drugData.drug_name.includes('Overview')) {
              const relativePath = path.relative(baseDir, fullPath);
              files.push(relativePath);
              console.log(`✓ Valid drug: ${drugData.drug_name} (${relativePath})`);
            } else {
              console.log(`⏭️ Skipping non-drug file: ${fullPath}`);
            }
          } catch (jsonError) {
            console.warn(`⚠️ Invalid JSON skipped: ${fullPath} - ${jsonError.message}`);
          }
        }
      } catch (statError) {
        console.warn(`⚠️ Cannot access: ${fullPath} - ${statError.message}`);
      }
    }
  } catch (readError) {
    console.warn(`⚠️ Cannot read directory: ${dir} - ${readError.message}`);
  }
  
  return files;
}

function generateDrugId(drugName) {
  // Convert drug name to valid JS identifier
  return drugName
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
    .replace(/_+/g, '_'); // Collapse multiple underscores
}

function getDrugFamily(filePath) {
  const pathParts = filePath.split(path.sep);
  const familyDir = pathParts[0];
  return DRUG_FAMILY_MAPPING[familyDir] || 'OTHER';
}

function getSubclass(filePath, drugData) {
  const pathParts = filePath.split(path.sep);
  
  // Extract subclass from directory structure
  if (pathParts.length > 2) {
    const subDir = pathParts[1];
    return subDir.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  
  // Fallback to drug family
  const family = getDrugFamily(filePath);
  return family.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function extractPKPDIndex(drugData) {
  const pk = drugData.pharmacology?.pk_pd_index;
  if (pk) {
    if (pk.includes('T>MIC') || pk.includes('Time')) return 'TIME_DEPENDENT';
    if (pk.includes('Cmax') || pk.includes('Peak')) return 'CONCENTRATION_DEPENDENT';
    if (pk.includes('AUC')) return 'AUC_DEPENDENT';
  }
  return 'TIME_DEPENDENT'; // Default for most antibiotics
}

function extractSpectrum(drugData) {
  const spectrum = drugData.antimicrobial_spectrum || {};
  return {
    preferred: spectrum.preferred || [],
    alternative: spectrum.alternative || [],
    notes: spectrum.notes || ''
  };
}

function extractDosing(drugData) {
  const usage = drugData.usage_and_dosing || {};
  const adult = usage.adult_dose || {};
  const pediatric = usage.pediatric_dose || {};
  const renal = drugData.renal_adjustment || {};
  const hepatic = drugData.hepatic_adjustment || {};
  
  return {
    adult: {
      standard: adult.usual_dose || 'See prescribing information',
      severe: adult.severe_infection_dose || adult.usual_dose || 'See prescribing information',
      renal: {
        normal: renal.crcl_or_egfr || 'No adjustment',
        mild: renal.crcl_or_egfr || 'No adjustment',
        moderate: renal.crcl_or_egfr || 'Reduce dose',
        severe: renal.crcl_or_egfr || 'Reduce dose significantly'
      },
      hepatic: hepatic.mild_impairment_child_pugh_a || 'No adjustment required',
      infusion: 'Standard IV administration'
    },
    pediatric: {
      standard: pediatric.standard || pediatric.usual_dose || 'See pediatric guidelines',
      maximum: pediatric.maximum || 'Adult maximum',
      neonatal: pediatric.neonatal || 'Specialized dosing required'
    }
  };
}

function extractSafety(drugData) {
  const pregnancy = drugData.pregnancy_risk || {};
  const adverse = drugData.adverse_effects || {};
  
  // Extract major adverse effects from different sections
  const adverseEffects = [];
  if (adverse.gi) adverseEffects.push(adverse.gi);
  if (adverse.allergic_reactions?.rash) adverseEffects.push('Allergic reactions');
  if (adverse.hematologic) adverseEffects.push(adverse.hematologic);
  if (adverse.fever) adverseEffects.push('Fever');
  
  return {
    pregnancyCategory: pregnancy.fda_risk_category || 'Category C - Risk cannot be ruled out',
    lactation: pregnancy.lactation || 'Use with caution',
    blackBoxWarning: false, // Would need to be specified in data
    majorAdverseEffects: adverseEffects.slice(0, 5) // Limit to top 5
  };
}

function extractInteractions(drugData) {
  const interactions = drugData.major_drug_interactions || [];
  
  // Handle case where interactions might not be an array
  if (!Array.isArray(interactions)) {
    console.warn(`Non-array interactions found for ${drugData.drug_name}: ${typeof interactions}`);
    return [];
  }
  
  return interactions.map(interaction => ({
    drug: interaction.drug || 'Unknown',
    effect: interaction.effect || 'Unknown effect',
    management: interaction.management || 'Monitor closely'
  }));
}

function generateIndexFile() {
  console.log('🔍 Scanning antibiotics directory...');
  console.log(`📁 Looking in: ${ANTIBIOTICS_DIR}`);
  
  if (!fs.existsSync(ANTIBIOTICS_DIR)) {
    console.error(`❌ Antibiotics directory not found: ${ANTIBIOTICS_DIR}`);
    console.log('   Creating placeholder index for future compatibility...');
    generatePlaceholderIndex();
    return;
  }
  
  const jsonFiles = getAllJsonFiles(ANTIBIOTICS_DIR);
  console.log(`💊 Found ${jsonFiles.length} valid antibiotic JSON files`);
  
  if (jsonFiles.length === 0) {
    console.log('⚠️ No valid JSON files found - generating placeholder index');
    generatePlaceholderIndex();
    return;
  }
  
  // Process each drug file
  const drugEntries = [];
  const familyStats = {};
  
  for (const file of jsonFiles) {
    try {
      const fullPath = path.join(ANTIBIOTICS_DIR, file);
      const content = fs.readFileSync(fullPath, 'utf8');
      const drugData = JSON.parse(content);
      
      const drugName = drugData.drug_name;
      const drugId = generateDrugId(drugName);
      const family = getDrugFamily(file);
      const subclass = getSubclass(file, drugData);
      
      // Track family statistics
      familyStats[family] = (familyStats[family] || 0) + 1;
      
      const drugEntry = {
        id: drugId,
        name: drugName,
        tradename: drugData.tradename || '',
        classification: {
          family: family,
          subclass: subclass,
          generation: null // Could be extracted if available
        },
        mechanism: {
          target: 'Beta-lactam target', // Would need mechanism mapping
          action: 'Inhibits bacterial cell wall synthesis',
          bactericidal: true, // Default, could be refined
          pkpdIndex: extractPKPDIndex(drugData)
        },
        spectrum: extractSpectrum(drugData),
        dosing: extractDosing(drugData),
        monitoring: {
          levels: drugData.pharmacology?.pk_pd_index?.includes('AUC') || false,
          parameters: [],
          targets: {},
          clinicalResponse: 'Monitor for clinical improvement within 48-72 hours'
        },
        resistance: {
          mechanisms: [], // Would need resistance mechanism mapping
          crossResistance: [],
          testing: 'Standard susceptibility testing'
        },
        safety: extractSafety(drugData),
        interactions: extractInteractions(drugData),
        stewardship: {
          preferredIndications: drugData.antimicrobial_spectrum?.preferred || [],
          avoidanceRecommendations: [],
          deEscalationGuidance: 'De-escalate based on culture results',
          resistanceRisk: 'Standard monitoring'
        },
        pharmacology: {
          oral_absorption: drugData.pharmacology?.oral_absorption_percent || null,
          protein_binding: drugData.pharmacology?.protein_binding_percent || null,
          half_life: drugData.pharmacology?.avg_serum_half_life_hr || null,
          elimination: drugData.pharmacology?.elimination || 'Renal',
          csf_penetration: drugData.pharmacology?.csf_blood_percent || null,
          preparations: drugData.pharmacology?.preparations || ''
        },
        rawData: drugData // Keep original data for advanced features
      };
      
      drugEntries.push(drugEntry);
      
    } catch (error) {
      console.error(`❌ Error processing ${file}: ${error.message}`);
    }
  }
  
  // Generate the index file content
  const drugEntriesCode = drugEntries.map(drug => 
    `  '${drug.name}': ${JSON.stringify(drug, null, 4).replace(/^/gm, '  ')}`
  ).join(',\n');
  
  const familyStatsCode = Object.entries(familyStats).map(([family, count]) =>
    `  ${family}: ${count}`
  ).join(',\n');
  
  const content = `// Auto-generated file - DO NOT EDIT MANUALLY
// Generated by scripts/generate-antibiotics-index.js

// Drug classification constants
export const DRUG_FAMILIES = {
  PENICILLIN: 'PENICILLIN',
  CEPHALOSPORIN: 'CEPHALOSPORIN',
  CARBAPENEM: 'CARBAPENEM',
  MONOBACTAM: 'MONOBACTAM',
  FLUOROQUINOLONE: 'FLUOROQUINOLONE',
  AMINOGLYCOSIDE: 'AMINOGLYCOSIDE',
  GLYCOPEPTIDE: 'GLYCOPEPTIDE',
  LINCOSAMIDE: 'LINCOSAMIDE',
  MACROLIDE: 'MACROLIDE',
  OXAZOLIDINONE: 'OXAZOLIDINONE',
  ANTIFOLATE: 'ANTIFOLATE',
  TETRACYCLINE: 'TETRACYCLINE',
  POLYMYXIN: 'POLYMYXIN',
  RIFAMYCIN: 'RIFAMYCIN',
  STREPTOGRAMIN: 'STREPTOGRAMIN',
  PLEUROMUTILIN: 'PLEUROMUTILIN',
  NITROIMIDAZOLE: 'NITROIMIDAZOLE',
  CHLORAMPHENICOL: 'CHLORAMPHENICOL',
  FOSFOMYCIN: 'FOSFOMYCIN',
  FUSIDIC_ACID: 'FUSIDIC_ACID',
  KETOLIDE: 'KETOLIDE',
  GLYCYLCYCLINE: 'GLYCYLCYCLINE',
  OTHER: 'OTHER'
};

// PK/PD optimization targets
export const PKPD_TARGETS = {
  TIME_DEPENDENT: 'Time > MIC',
  CONCENTRATION_DEPENDENT: 'Cmax/MIC',
  AUC_DEPENDENT: 'AUC/MIC'
};

// Pregnancy risk categories
export const PREGNANCY_CATEGORIES = {
  A: 'Category A - No risk demonstrated',
  B: 'Category B - No evidence of risk in humans',
  C: 'Category C - Risk cannot be ruled out',
  D: 'Category D - Positive evidence of risk',
  X: 'Category X - Contraindicated in pregnancy'
};

// Comprehensive antibiotics database
export const antibioticsData = {
${drugEntriesCode}
};

// Database statistics
export const databaseStats = {
  totalDrugs: ${drugEntries.length},
  familyBreakdown: {
${familyStatsCode}
  },
  lastGenerated: '${new Date().toISOString()}'
};

// Helper functions
export function getAntibioticsDatabase() {
  return antibioticsData;
}

export function getDrugsByFamily(family) {
  return Object.values(antibioticsData).filter(drug => 
    drug.classification.family === family
  );
}

export function searchDrugs(searchTerm) {
  const term = searchTerm.toLowerCase();
  return Object.values(antibioticsData).filter(drug =>
    drug.name.toLowerCase().includes(term) ||
    drug.tradename.toLowerCase().includes(term) ||
    drug.classification.family.toLowerCase().includes(term) ||
    drug.classification.subclass.toLowerCase().includes(term)
  );
}

export function getDrugByName(name) {
  return antibioticsData[name] || null;
}

export function getDrugFamilies() {
  return DRUG_FAMILIES;
}

export function getDatabaseStats() {
  return databaseStats;
}

console.log('💊 Antibiotics database loaded with', Object.keys(antibioticsData).length, 'drugs');
console.log('   Family distribution:', databaseStats.familyBreakdown);
`;

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write the generated file
  fs.writeFileSync(OUTPUT_FILE, content);
  
  console.log('✅ Generated antibiotics index:');
  console.log(`   💊 Total drugs: ${drugEntries.length}`);
  console.log(`   📊 Drug families: ${Object.keys(familyStats).length}`);
  console.log(`   💾 Output: ${OUTPUT_FILE}`);
  
  // Print family breakdown
  console.log('\n📊 Drug family breakdown:');
  Object.entries(familyStats).forEach(([family, count]) => {
    console.log(`   ${family}: ${count} drugs`);
  });
}

function generatePlaceholderIndex() {
  console.log('🔧 Generating placeholder antibiotics index...');
  
  const placeholderContent = `// Auto-generated placeholder - antibiotics database not yet available
// Generated by scripts/generate-antibiotics-index.js

// Drug classification constants
export const DRUG_FAMILIES = {
  PENICILLIN: 'PENICILLIN',
  CEPHALOSPORIN: 'CEPHALOSPORIN',
  CARBAPENEM: 'CARBAPENEM',
  OTHER: 'OTHER'
};

export const PKPD_TARGETS = {
  TIME_DEPENDENT: 'Time > MIC',
  CONCENTRATION_DEPENDENT: 'Cmax/MIC',
  AUC_DEPENDENT: 'AUC/MIC'
};

export const PREGNANCY_CATEGORIES = {
  A: 'Category A - No risk demonstrated',
  B: 'Category B - No evidence of risk in humans',
  C: 'Category C - Risk cannot be ruled out',
  D: 'Category D - Positive evidence of risk',
  X: 'Category X - Contraindicated in pregnancy'
};

// Placeholder antibiotics database
export const antibioticsData = {};

// Database statistics
export const databaseStats = {
  totalDrugs: 0,
  familyBreakdown: {},
  lastGenerated: '${new Date().toISOString()}'
};

// Helper functions with fallbacks
export function getAntibioticsDatabase() {
  console.warn('Antibiotics database not yet available. Please run: npm run build:antibiotics');
  return {};
}

export function getDrugsByFamily(family) {
  console.warn('Antibiotics database not yet available. Please run: npm run build:antibiotics');
  return [];
}

export function searchDrugs(searchTerm) {
  console.warn('Antibiotics database not yet available. Please run: npm run build:antibiotics');
  return [];
}

export function getDrugByName(name) {
  console.warn('Antibiotics database not yet available. Please run: npm run build:antibiotics');
  return null;
}

export function getDrugFamilies() {
  return DRUG_FAMILIES;
}

export function getDatabaseStats() {
  return databaseStats;
}

// Development mode detection
export const isDevelopmentMode = true;
export const isPlaceholder = true;

console.log('⚠️ Antibiotics database placeholder loaded');
console.log('   Run "npm run build:antibiotics" when JSON files are available');
`;

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(OUTPUT_FILE, placeholderContent);
  console.log(`✅ Placeholder index created: ${OUTPUT_FILE}`);
}

// ES module check for direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  generateIndexFile();
}

export { generateIndexFile, generatePlaceholderIndex };