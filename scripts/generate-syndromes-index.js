// scripts/generate-syndromes-index.js
// Generate import index for syndromes JSON files

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SYNDROMES_DIR = 'parsed_references/syndromes_json';
const OUTPUT_FILE = 'src/data/generatedSyndromesIndex.js';

function getAllJsonFiles(dir, baseDir = dir) {
    let files = [];
    
    try {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
            const fullPath = path.join(dir, item);
            
            try {
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory() && !item.startsWith('.')) {
                    // Recursively scan subdirectories (skip hidden directories)
                    files = files.concat(getAllJsonFiles(fullPath, baseDir));
                } else if (item.endsWith('.json') && !item.startsWith('.') && !item.includes('schema')) {
                    // Validate JSON file before including (skip hidden files and schema files)
                    try {
                        const content = fs.readFileSync(fullPath, 'utf8');
                        JSON.parse(content); // Validate JSON syntax
                        
                        const relativePath = path.relative(baseDir, fullPath);
                        files.push(relativePath);
                        console.log(`✓ Valid JSON: ${relativePath}`);
                    } catch (jsonError) {
                        console.warn(`⚠️ Invalid JSON skipped: ${fullPath} - ${jsonError.message}`);
                    }
                } else if (item.includes('schema')) {
                    console.log(`⏭️ Skipping schema file: ${item}`);
                } else if (item.startsWith('.')) {
                    console.log(`⏭️ Skipping hidden file: ${item}`);
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

function generateSyndromeId(filePath) {
    // Convert file path to valid JS identifier
    return filePath
        .replace(/\.json$/, '')
        .replace(/[^a-zA-Z0-9]/g, '_')
        .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
        .replace(/_+/g, '_'); // Collapse multiple underscores
}

function categorizeSyndromes(files) {
    const categories = {};
    
    for (const file of files) {
        const parts = file.split(path.sep);
        const mainCategory = parts[0] || 'general';
        
        if (!categories[mainCategory]) {
            categories[mainCategory] = [];
        }
        
        categories[mainCategory].push(file);
    }
    
    return categories;
}

function generateIndexFile() {
    console.log('🔍 Scanning syndromes directory...');
    console.log(`📁 Looking in: ${SYNDROMES_DIR}`);
    
    if (!fs.existsSync(SYNDROMES_DIR)) {
        console.error(`❌ Syndromes directory not found: ${SYNDROMES_DIR}`);
        console.log('   Creating placeholder index for future compatibility...');
        generatePlaceholderIndex();
        return;
    }
    
    const jsonFiles = getAllJsonFiles(SYNDROMES_DIR);
    console.log(`📋 Found ${jsonFiles.length} valid syndrome JSON files`);
    
    if (jsonFiles.length === 0) {
        console.log('⚠️ No valid JSON files found - generating placeholder index');
        generatePlaceholderIndex();
        return;
    }
    
    const categories = categorizeSyndromes(jsonFiles);
    
    // Generate file paths mapping for runtime loading
    const filePathsEntries = jsonFiles.map(file => {
        const id = generateSyndromeId(file);
        const parts = file.split(path.sep);
        const category = parts[0];
        const subcategory = parts.length > 2 ? parts[1] : null;
        const filename = parts[parts.length - 1].replace('.json', '');
        
        // Try to read the title from the JSON file
        let title = filename; // fallback to filename
        try {
            const fullPath = path.join(SYNDROMES_DIR, file);
            const content = fs.readFileSync(fullPath, 'utf8');
            const jsonData = JSON.parse(content);
            if (jsonData.documentMetadata && jsonData.documentMetadata.title) {
                title = jsonData.documentMetadata.title;
            }
        } catch (error) {
            console.warn(`⚠️ Could not read title from ${file}, using filename`);
        }
        
        return `  '${id}': {
    id: '${id}',
    filePath: './syndromes_json/${file.replace(/\\/g, '/')}',
    category: '${category}',
    subcategory: ${subcategory ? `'${subcategory}'` : 'null'},
    filename: '${filename}',
    title: '${title.replace(/'/g, "\\'")}',
    loaded: false,
    data: null
  }`;
    }).join(',\n');
    
    // Generate categories mapping
    const categoryEntries = Object.entries(categories).map(([category, files]) => {
        const syndromeIds = files.map(file => `'${generateSyndromeId(file)}'`);
        return `  '${category}': [${syndromeIds.join(', ')}]`;
    }).join(',\n');
    
    const content = `// Auto-generated file - DO NOT EDIT MANUALLY
// Generated by scripts/generate-syndromes-index.js

// Syndromes file paths for runtime loading
const syndromeFilePaths = {
${filePathsEntries}
};

// Categories mapping
export const syndromeCategories = {
${categoryEntries}
};

// Runtime loading cache
let loadedSyndromes = {};
let isLoading = false;

// Helper functions
export async function getSyndromesDatabase() {
  if (Object.keys(loadedSyndromes).length === 0 && !isLoading) {
    await loadAllSyndromes();
  }
  return loadedSyndromes;
}

export function getSyndromeCategories() {
  return syndromeCategories;
}

export async function getSyndromesByCategory(category) {
  const database = await getSyndromesDatabase();
  const categoryIds = syndromeCategories[category] || [];
  return categoryIds.map(id => database[id]).filter(Boolean);
}

export async function searchSyndromes(searchTerm) {
  const database = await getSyndromesDatabase();
  const term = searchTerm.toLowerCase();
  return Object.values(database).filter(syndrome => 
    syndrome.title.toLowerCase().includes(term) ||
    syndrome.filename.toLowerCase().includes(term) ||
    syndrome.category.toLowerCase().includes(term) ||
    (syndrome.subcategory && syndrome.subcategory.toLowerCase().includes(term)) ||
    (syndrome.data?.documentMetadata?.title && syndrome.data.documentMetadata.title.toLowerCase().includes(term))
  );
}

// Dynamically resolve the correct base path
function resolveBasePath() {
  // Check if we're on GitHub Pages
  if (window.location.hostname === 'ertwro.github.io' && window.location.pathname.startsWith('/antibiogram_react_app')) {
    return '/antibiogram_react_app';
  }
  // Otherwise use relative paths
  return '.';
}

// Load all syndromes data asynchronously
async function loadAllSyndromes() {
  if (isLoading) return;
  isLoading = true;
  
  try {
    const basePath = resolveBasePath();
    const loadPromises = Object.entries(syndromeFilePaths).map(async ([id, syndromeInfo]) => {
      try {
        // Resolve the full path based on current context
        const fullPath = syndromeInfo.filePath.replace('./', \`\${basePath}/\`);
        const response = await fetch(fullPath);
        if (response.ok) {
          const data = await response.json();
          return {
            id,
            ...syndromeInfo,
            data,
            loaded: true
          };
        } else {
          console.warn(\`Failed to load syndrome: \${fullPath}\`);
          return {
            id,
            ...syndromeInfo,
            data: { error: 'Failed to load' },
            loaded: false
          };
        }
      } catch (error) {
        console.warn(\`Error loading syndrome \${id}:\`, error);
        return {
          id,
          ...syndromeInfo,
          data: { error: error.message },
          loaded: false
        };
      }
    });
    
    const results = await Promise.all(loadPromises);
    
    results.forEach(result => {
      loadedSyndromes[result.id] = result;
    });
    
    console.log('🧬 Syndromes database loaded with', Object.keys(loadedSyndromes).length, 'syndromes');
  } catch (error) {
    console.error('Failed to load syndromes database:', error);
  } finally {
    isLoading = false;
  }
}

export function getCategoryDisplayName(category) {
  const displayNames = {
    'CNS': 'Sistema Nervioso Central',
    'cardiovascular': 'Cardiovascular',
    'genitourinary': 'Genitourinario',
    'head_and_neck': 'Cabeza y Cuello',
    'infectious_syndromes': 'Síndromes Infecciosos',
    'intra-abdominal': 'Intraabdominal',
    'lower_respiratory': 'Respiratorio Inferior',
    'lymph_nodes-spleen': 'Ganglios y Bazo',
    'musculoskeletal': 'Musculoesquelético',
    'ocular': 'Ocular',
    'skin_and_soft_tissues': 'Piel y Tejidos Blandos',
    'upper_respiratory': 'Respiratorio Superior',
    'Duration of Therapy, Antibacterial': 'Duración de Terapia',
    'Lyme_disease': 'Enfermedad de Lyme',
    'Toxin_mediated': 'Mediado por Toxinas'
  };
  
  return displayNames[category] || category;
}

console.log('🧬 Syndromes database loaded with', Object.keys(loadedSyndromes).length, 'syndromes');

// Development mode detection
export const isDevelopmentMode = true;
export const isPlaceholder = false;
`;

    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write the generated file
    fs.writeFileSync(OUTPUT_FILE, content);
    
    console.log('✅ Generated syndromes index:');
    console.log(`   📁 Categories: ${Object.keys(categories).length}`);
    console.log(`   📄 Total syndromes: ${jsonFiles.length}`);
    console.log(`   💾 Output: ${OUTPUT_FILE}`);
    
    // Print category summary
    console.log('\n📊 Category breakdown:');
    Object.entries(categories).forEach(([category, files]) => {
        console.log(`   ${getCategoryDisplayName(category)}: ${files.length} syndromes`);
    });
}

function getCategoryDisplayName(category) {
  const displayNames = {
    'CNS': 'Sistema Nervioso Central',
    'cardiovascular': 'Cardiovascular',
    'genitourinary': 'Genitourinario',
    'head_and_neck': 'Cabeza y Cuello',
    'infectious_syndromes': 'Síndromes Infecciosos',
    'intra-abdominal': 'Intraabdominal',
    'lower_respiratory': 'Respiratorio Inferior',
    'lymph_nodes-spleen': 'Ganglios y Bazo',
    'musculoskeletal': 'Musculoesquelético',
    'ocular': 'Ocular',
    'skin_and_soft_tissues': 'Piel y Tejidos Blandos',
    'upper_respiratory': 'Respiratorio Superior',
    'Duration of Therapy, Antibacterial': 'Duración de Terapia',
    'Lyme_disease': 'Enfermedad de Lyme',
    'Toxin_mediated': 'Mediado por Toxinas'
  };
  
  return displayNames[category] || category;
}

function generatePlaceholderIndex() {
    console.log('🔧 Generating placeholder syndromes index...');
    
    const placeholderContent = `// Auto-generated placeholder - syndromes database not yet available
// Generated by scripts/generate-syndromes-index.js

// Placeholder syndromes database - will be populated when JSON files are added
export const syndromesDatabase = {};

// Placeholder categories mapping
export const syndromeCategories = {};

// Helper functions with fallbacks
export function getSyndromesDatabase() {
  return syndromesDatabase;
}

export function getSyndromeCategories() {
  return syndromeCategories;
}

export function getSyndromesByCategory(category) {
  console.warn('Syndromes database not yet available. Please run: npm run build:syndromes');
  return [];
}

export function searchSyndromes(searchTerm) {
  console.warn('Syndromes database not yet available. Please run: npm run build:syndromes');
  return [];
}

export function getCategoryDisplayName(category) {
  const displayNames = {
    'CNS': 'Sistema Nervioso Central',
    'cardiovascular': 'Cardiovascular',
    'genitourinary': 'Genitourinario',
    'head_and_neck': 'Cabeza y Cuello',
    'infectious_syndromes': 'Síndromes Infecciosos',
    'intra-abdominal': 'Intraabdominal',
    'lower_respiratory': 'Respiratorio Inferior',
    'lymph_nodes-spleen': 'Ganglios y Bazo',
    'musculoskeletal': 'Musculoesquelético',
    'ocular': 'Ocular',
    'skin_and_soft_tissues': 'Piel y Tejidos Blandos',
    'upper_respiratory': 'Respiratorio Superior',
    'Duration of Therapy, Antibacterial': 'Duración de Terapia',
    'Lyme_disease': 'Enfermedad de Lyme',
    'Toxin_mediated': 'Mediado por Toxinas'
  };
  
  return displayNames[category] || category;
}

// Development mode detection
export const isDevelopmentMode = true;
export const isPlaceholder = true;

console.log('⚠️ Syndromes database placeholder loaded');
console.log('   Run "npm run build:syndromes" when JSON files are available');
`;

    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(OUTPUT_FILE, placeholderContent);
    console.log(`✅ Placeholder index created: ${OUTPUT_FILE}`);
}

// Add file watching capability for development
function watchForChanges() {
    if (fs.existsSync(SYNDROMES_DIR)) {
        console.log('👀 Watching for syndromes file changes...');
        fs.watch(SYNDROMES_DIR, { recursive: true }, (eventType, filename) => {
            if (filename && filename.endsWith('.json')) {
                console.log(`📝 Syndromes file changed: ${filename}`);
                console.log('🔄 Regenerating index...');
                setTimeout(generateIndexFile, 1000); // Debounce
            }
        });
    }
}

// ES module check for direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
    const args = process.argv.slice(2);
    
    if (args.includes('--watch')) {
        generateIndexFile();
        watchForChanges();
    } else {
        generateIndexFile();
    }
}

export { generateIndexFile, generatePlaceholderIndex, watchForChanges };