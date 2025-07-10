#!/usr/bin/env node
// Automatic JSON data synchronization script
// Copies JSON files from source to public directory during build

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '..', 'parsed_references', 'bacteria_json', 'enterobacterales');
const targetDir = path.join(__dirname, '..', 'public', 'parsed_references', 'bacteria_json', 'enterobacterales');

console.log('🔄 Synchronizing JSON data files...\n');

// Ensure target directory exists
fs.mkdirSync(targetDir, { recursive: true });

// Copy all JSON files
const jsonFiles = fs.readdirSync(sourceDir).filter(file => file.endsWith('.json'));

let copiedCount = 0;
let updatedCount = 0;

jsonFiles.forEach(filename => {
    const sourcePath = path.join(sourceDir, filename);
    const targetPath = path.join(targetDir, filename);
    
    const sourceStats = fs.statSync(sourcePath);
    let shouldCopy = true;
    
    if (fs.existsSync(targetPath)) {
        const targetStats = fs.statSync(targetPath);
        if (sourceStats.mtime <= targetStats.mtime) {
            shouldCopy = false;
        } else {
            updatedCount++;
        }
    } else {
        copiedCount++;
    }
    
    if (shouldCopy) {
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`✅ ${filename} ${fs.existsSync(targetPath) ? 'updated' : 'copied'}`);
    }
});

console.log(`\n📊 Synchronization complete:`);
console.log(`📄 Total files: ${jsonFiles.length}`);
console.log(`🆕 New files: ${copiedCount}`);
console.log(`🔄 Updated files: ${updatedCount}`);
console.log(`⏭️  Unchanged files: ${jsonFiles.length - copiedCount - updatedCount}`);

if (copiedCount > 0 || updatedCount > 0) {
    console.log('\n🎉 JSON data synchronized successfully!');
} else {
    console.log('\n✨ All files are already up to date.');
}