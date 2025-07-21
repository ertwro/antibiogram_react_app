// scripts/generate-clsi-index.js
// Generate comprehensive CLSI breakpoints database from organisms_clsi files

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLSI_DIR = 'parsed_references/organisms_clsi';
const OUTPUT_FILE = 'src/data/generatedCLSIIndex.js';

function getAllCLSIFiles(dir) {
  let files = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      
      try {
        const stat = fs.statSync(fullPath);
        
        if (stat.isFile() && item.endsWith('.js') && !item.includes('schema')) {
          files.push(item);
          console.log(`✓ Found CLSI file: ${item}`);
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

function extractOrganismCategory(filename) {
  const baseName = filename.replace('.js', '');
  const categoryMap = {
    'enterobacterales': 'Enterobacterales',
    'staphylococcus': 'Staphylococcus spp.',
    'enterococcus': 'Enterococcus spp.', 
    'streptococcus': 'Streptococcus spp.',
    'pseudomonas': 'Pseudomonas aeruginosa',
    'acinetobacter': 'Acinetobacter spp.',
    'haemophilus': 'Haemophilus spp.',
    'neisseria': 'Neisseria spp.',
    'anaerobes': 'Anaerobes',
    'burkholderia': 'Burkholderia cepacia complex',
    'stenotrophomonas': 'Stenotrophomonas maltophilia',
    'other_non_enterobacterales': 'Other Non-Enterobacterales'
  };
  
  return categoryMap[baseName] || baseName;
}

function processCLSIData(clsiData, category) {
  const processedData = {
    category,
    organisms: {},
    tieringRules: {},
    specialConsiderations: {}
  };

  // Process each organism in the CLSI data
  Object.entries(clsiData).forEach(([tableKey, tableData]) => {
    if (typeof tableData === 'object' && tableData !== null) {
      Object.entries(tableData).forEach(([organismKey, organismData]) => {
        if (organismData.antibiotics) {
          const organismName = organismKey.replace(/_/g, ' ');
          
          processedData.organisms[organismName] = {
            clsi_table: organismData.clsi_table || tableKey,
            category: organismData.category || category,
            source: organismData.source || 'CLSI M100-Ed34',
            antibiotics: {}
          };

          // Process antibiotics with tier classification
          Object.entries(organismData.antibiotics).forEach(([antibiotic, data]) => {
            const antibioticName = antibiotic.replace(/_/g, '-');
            
            processedData.organisms[organismName].antibiotics[antibioticName] = {
              ...data,
              tier: determineTier(antibiotic, data, category),
              reportingPriority: getReportingPriority(antibiotic, data, category)
            };
          });
        }
      });
    }
  });

  return processedData;
}

function determineTier(antibiotic, data, category) {
  // Tier 1: Primary agents for routine testing/reporting
  const tier1Agents = [
    'ampicillin', 'amoxicillin-clavulanate', 'piperacillin-tazobactam',
    'ceftriaxone', 'ceftazidime', 'cefepime',
    'meropenem', 'imipenem', 'ertapenem',
    'ciprofloxacin', 'levofloxacin',
    'trimethoprim-sulfamethoxazole',
    'gentamicin', 'amikacin',
    'vancomycin', 'linezolid',
    'clindamycin', 'erythromycin'
  ];

  // Tier 2: Secondary agents for selective reporting
  const tier2Agents = [
    'ampicillin-sulbactam', 'ticarcillin-clavulanate',
    'cefazolin', 'cefoxitin', 'cefotaxime',
    'aztreonam', 'doripenem',
    'moxifloxacin', 'nitrofurantoin',
    'tobramycin', 'doxycycline',
    'azithromycin', 'clarithromycin'
  ];

  // Special tier classifications based on organism category
  if (category === 'Enterobacterales') {
    if (['cefepime'].includes(antibiotic)) {
      return 'Tier 1'; // Cefepime is Tier 1 for certain Enterobacterales
    }
  }

  if (category === 'Staphylococcus spp.') {
    if (['cefoxitin', 'oxacillin'].includes(antibiotic)) {
      return 'Tier 1'; // For MRSA detection
    }
  }

  if (tier1Agents.includes(antibiotic)) return 'Tier 1';
  if (tier2Agents.includes(antibiotic)) return 'Tier 2';
  
  return 'Tier 3'; // Specialized or investigational agents
}

function getReportingPriority(antibiotic, data, category) {
  // Determine reporting priority based on clinical significance
  const alwaysReport = [
    'ampicillin', 'vancomycin', 'meropenem', 'ceftriaxone', 
    'ciprofloxacin', 'trimethoprim-sulfamethoxazole'
  ];

  const conditionalReport = [
    'nitrofurantoin', 'cefazolin', 'ampicillin-sulbactam'
  ];

  if (data.condition || data.special_considerations) {
    return 'conditional';
  }

  if (alwaysReport.includes(antibiotic)) {
    return 'primary';
  }

  if (conditionalReport.includes(antibiotic)) {
    return 'conditional';
  }

  return 'secondary';
}

async function loadCLSIFile(filePath) {
  try {
    // Use dynamic import for ES modules
    const module = await import(path.resolve(filePath));
    return module.default || module;
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message);
    return null;
  }
}

async function generateIndexFile() {
  console.log('🔍 Scanning CLSI directory...');
  console.log(`📁 Looking in: ${CLSI_DIR}`);
  
  if (!fs.existsSync(CLSI_DIR)) {
    console.error(`❌ CLSI directory not found: ${CLSI_DIR}`);
    console.log('   Creating placeholder index for future compatibility...');
    generatePlaceholderIndex();
    return;
  }
  
  const clsiFiles = getAllCLSIFiles(CLSI_DIR);
  console.log(`📋 Found ${clsiFiles.length} CLSI organism files`);
  
  if (clsiFiles.length === 0) {
    console.log('⚠️ No CLSI files found - generating placeholder index');
    generatePlaceholderIndex();
    return;
  }

  const clsiDatabase = {};
  const categoryStats = {};

  // Process each CLSI file
  for (const file of clsiFiles) {
    try {
      const fullPath = path.join(CLSI_DIR, file);
      const category = extractOrganismCategory(file);
      
      console.log(`📊 Processing ${category}...`);
      
      const clsiData = await loadCLSIFile(fullPath);
      if (clsiData) {
        const processedData = processCLSIData(clsiData, category);
        clsiDatabase[category] = processedData;
        
        const organismCount = Object.keys(processedData.organisms).length;
        categoryStats[category] = organismCount;
        console.log(`   ✓ ${organismCount} organisms processed`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}: ${error.message}`);
    }
  }

  // Generate the comprehensive index file
  const content = generateIndexContent(clsiDatabase, categoryStats);
  
  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write the generated file
  fs.writeFileSync(OUTPUT_FILE, content);
  
  console.log('✅ Generated CLSI index:');
  console.log(`   📊 Categories: ${Object.keys(clsiDatabase).length}`);
  console.log(`   🦠 Total organisms: ${Object.values(categoryStats).reduce((a, b) => a + b, 0)}`);
  console.log(`   💾 Output: ${OUTPUT_FILE}`);
  
  // Print category breakdown
  console.log('\n📊 Category breakdown:');
  Object.entries(categoryStats).forEach(([category, count]) => {
    console.log(`   ${category}: ${count} organisms`);
  });
}

function generateIndexContent(clsiDatabase, categoryStats) {
  const databaseCode = JSON.stringify(clsiDatabase, null, 2);
  
  return `// Auto-generated file - DO NOT EDIT MANUALLY
// Generated by scripts/generate-clsi-index.js

// CLSI M100-Ed34 Breakpoints Database
export const clsiDatabase = ${databaseCode};

// Database statistics
export const clsiStats = {
  totalCategories: ${Object.keys(clsiDatabase).length},
  totalOrganisms: ${Object.values(categoryStats).reduce((a, b) => a + b, 0)},
  categoryBreakdown: ${JSON.stringify(categoryStats, null, 2)},
  lastGenerated: '${new Date().toISOString()}'
};

// Helper functions for CLSI data access
export function getCLSIDatabase() {
  return clsiDatabase;
}

export function getCLSICategories() {
  return Object.keys(clsiDatabase);
}

export function getOrganismsByCategory(category) {
  return clsiDatabase[category]?.organisms || {};
}

export function getCLSIBreakpoints(organismName, antibiotic) {
  for (const category of Object.values(clsiDatabase)) {
    const organism = category.organisms[organismName];
    if (organism?.antibiotics[antibiotic]) {
      return organism.antibiotics[antibiotic];
    }
  }
  return null;
}

export function getTierAntibiotics(organismName, tier = 'Tier 1') {
  const antibiotics = [];
  
  for (const category of Object.values(clsiDatabase)) {
    const organism = category.organisms[organismName];
    if (organism) {
      Object.entries(organism.antibiotics).forEach(([antibiotic, data]) => {
        if (data.tier === tier) {
          antibiotics.push({
            name: antibiotic,
            ...data
          });
        }
      });
      break; // Found organism, stop searching
    }
  }
  
  return antibiotics;
}

export function getReportingPriorityAntibiotics(organismName, priority = 'primary') {
  const antibiotics = [];
  
  for (const category of Object.values(clsiDatabase)) {
    const organism = category.organisms[organismName];
    if (organism) {
      Object.entries(organism.antibiotics).forEach(([antibiotic, data]) => {
        if (data.reportingPriority === priority) {
          antibiotics.push({
            name: antibiotic,
            ...data
          });
        }
      });
      break;
    }
  }
  
  return antibiotics;
}

export function findOrganismCategory(organismName) {
  for (const [categoryName, category] of Object.entries(clsiDatabase)) {
    if (category.organisms[organismName]) {
      return categoryName;
    }
  }
  return null;
}

export function validateBreakpoint(organismName, antibiotic, mic) {
  const breakpoints = getCLSIBreakpoints(organismName, antibiotic);
  if (!breakpoints?.mic_breakpoints) return null;
  
  const { S, I, SDD, R } = breakpoints.mic_breakpoints;
  
  // Parse MIC value (handle ≤, ≥ symbols)
  const numericMic = parseFloat(mic.replace(/[≤≥]/g, ''));
  
  if (S && numericMic <= parseFloat(S.replace(/[≤≥]/g, ''))) {
    return 'S';
  } else if (SDD && numericMic <= parseFloat(SDD.replace(/[≤≥]/g, ''))) {
    return 'SDD';
  } else if (I && numericMic <= parseFloat(I.replace(/[≤≥]/g, ''))) {
    return 'I';
  } else {
    return 'R';
  }
}

// Tier-based reporting logic
export class CLSIReportingEngine {
  constructor() {
    this.database = clsiDatabase;
  }

  generateReport(organismName, micResults = {}) {
    const category = findOrganismCategory(organismName);
    if (!category) {
      return {
        error: 'Organism not found in CLSI database',
        organism: organismName
      };
    }

    const organism = this.database[category].organisms[organismName];
    const report = {
      organism: organismName,
      category,
      clsi_table: organism.clsi_table,
      source: organism.source,
      tier1_results: [],
      tier2_results: [],
      tier3_results: [],
      special_considerations: [],
      recommendations: []
    };

    // Process each antibiotic result
    Object.entries(micResults).forEach(([antibiotic, mic]) => {
      const breakpointData = organism.antibiotics[antibiotic];
      if (breakpointData) {
        const interpretation = validateBreakpoint(organismName, antibiotic, mic);
        const result = {
          antibiotic,
          mic,
          interpretation,
          tier: breakpointData.tier,
          reportingPriority: breakpointData.reportingPriority,
          condition: breakpointData.condition,
          special_considerations: breakpointData.special_considerations
        };

        // Categorize by tier
        if (breakpointData.tier === 'Tier 1') {
          report.tier1_results.push(result);
        } else if (breakpointData.tier === 'Tier 2') {
          report.tier2_results.push(result);
        } else {
          report.tier3_results.push(result);
        }

        // Collect special considerations
        if (breakpointData.special_considerations) {
          report.special_considerations.push({
            antibiotic,
            note: breakpointData.special_considerations
          });
        }
      }
    });

    // Generate clinical recommendations
    report.recommendations = this.generateRecommendations(report);

    return report;
  }

  generateRecommendations(report) {
    const recommendations = [];

    // Check for resistance patterns
    const resistantTier1 = report.tier1_results.filter(r => r.interpretation === 'R').length;
    const totalTier1 = report.tier1_results.length;

    if (resistantTier1 > totalTier1 * 0.5) {
      recommendations.push({
        type: 'warning',
        message: 'High resistance to first-line agents detected. Consider advanced diagnostics.'
      });
    }

    // Check for carbapenem resistance
    const carbapenemResistant = report.tier1_results.some(r => 
      r.antibiotic.includes('meropenem') || 
      r.antibiotic.includes('imipenem') || 
      r.antibiotic.includes('ertapenem')
    ) && report.tier1_results.some(r => r.interpretation === 'R');

    if (carbapenemResistant) {
      recommendations.push({
        type: 'critical',
        message: 'Carbapenem resistance detected. Notify infection control and ID specialist.'
      });
    }

    return recommendations;
  }
}

console.log('🧬 CLSI database loaded with', Object.keys(clsiDatabase).length, 'categories');
console.log('   Total organisms:', clsiStats.totalOrganisms);
`;
}

function generatePlaceholderIndex() {
  console.log('🔧 Generating placeholder CLSI index...');
  
  const placeholderContent = `// Auto-generated placeholder - CLSI database not yet available
// Generated by scripts/generate-clsi-index.js

// Placeholder CLSI database
export const clsiDatabase = {};

// Database statistics
export const clsiStats = {
  totalCategories: 0,
  totalOrganisms: 0,
  categoryBreakdown: {},
  lastGenerated: '${new Date().toISOString()}'
};

// Helper functions with fallbacks
export function getCLSIDatabase() {
  console.warn('CLSI database not yet available. Please run: npm run build:clsi');
  return {};
}

export function getCLSICategories() {
  console.warn('CLSI database not yet available. Please run: npm run build:clsi');
  return [];
}

export function getOrganismsByCategory(category) {
  console.warn('CLSI database not yet available. Please run: npm run build:clsi');
  return {};
}

export function getCLSIBreakpoints(organismName, antibiotic) {
  console.warn('CLSI database not yet available. Please run: npm run build:clsi');
  return null;
}

export function getTierAntibiotics(organismName, tier = 'Tier 1') {
  console.warn('CLSI database not yet available. Please run: npm run build:clsi');
  return [];
}

export function getReportingPriorityAntibiotics(organismName, priority = 'primary') {
  console.warn('CLSI database not yet available. Please run: npm run build:clsi');
  return [];
}

export function findOrganismCategory(organismName) {
  console.warn('CLSI database not yet available. Please run: npm run build:clsi');
  return null;
}

export function validateBreakpoint(organismName, antibiotic, mic) {
  console.warn('CLSI database not yet available. Please run: npm run build:clsi');
  return null;
}

// Placeholder reporting engine
export class CLSIReportingEngine {
  constructor() {
    console.warn('CLSI database not yet available. Please run: npm run build:clsi');
  }

  generateReport(organismName, micResults = {}) {
    return {
      error: 'CLSI database not yet available',
      organism: organismName
    };
  }

  generateRecommendations(report) {
    return [];
  }
}

console.log('⚠️ CLSI database placeholder loaded');
console.log('   Run "npm run build:clsi" when organism files are available');
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