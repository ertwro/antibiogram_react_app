// src/data/microbiologyData.js
// --- Clean Modular Microbiology Database ---
// Compartmentalized pathogen database with laboratory identification, resistance mechanisms, 
// clinical significance, and sophisticated antibiogram interpretation capabilities.
// Updated for JSON-based loading system to handle 150+ organisms

// Import constants
export {
    CLINICAL_SIGNIFICANCE,
    RESISTANCE_MECHANISMS,
    LAB_TESTS,
    GRAM_STAIN_TYPES,
    MORPHOLOGIES,
    BREAKPOINT_CATEGORIES
} from './constants.js';

// Import all organisms from generated index (automatically updated on build)
import { bacteriaDatabase as generatedBacteriaDatabase, bacteriaByName, getBacteriaCount } from './generatedBacteriaIndex.js';

// Import helper functions
import { 
    getSearchableList as getSearchableListHelper,
    filterByGramStain,
    filterByClsiCategory,
    searchBacteria,
    validateBacterium,
    mergeDatabases,
    interpretMICBreakpoint,
    getTreatmentRecommendations
} from './helpers/databaseHelpers.js';

// Import spectrum activity functions
import {
    getDbBacteriumSpectrum,
    getActiveAntibiotics,
    getAntibioticRecommendations,
    ACTIVITY_LEVELS,
    ACTIVITY_DISPLAY,
    ACTIVITY_SCORES
} from './spectrumActivity.js';

// Use the automatically generated bacteria database (updated on every build)
const bacteriaDatabase = generatedBacteriaDatabase;
const databaseLoaded = true;

console.log(`✅ Loaded ${getBacteriaCount()} Enterobacterales organisms from generated index`);
console.log(`🦠 Available organisms:`, Object.keys(bacteriaDatabase).sort());

// Synchronous getter for database (always loaded at build time)
export const getBacteriaDatabase = () => {
    return bacteriaDatabase;
};

// Async getter for database (maintains compatibility)
export const loadBacteriaDatabase = async () => {
    return bacteriaDatabase;
};

// Check if database is loaded (always true now)
export const isDatabaseLoaded = () => true;
export const getDatabaseLoadingStatus = () => ({
    loaded: databaseLoaded,
    count: bacteriaDatabase ? Object.keys(bacteriaDatabase).length : 0
});

// Export helper functions
export {
    filterByGramStain,
    filterByClsiCategory,
    searchBacteria,
    validateBacterium,
    mergeDatabases,
    interpretMICBreakpoint,
    getTreatmentRecommendations,
    getDbBacteriumSpectrum,
    getActiveAntibiotics,
    getAntibioticRecommendations,
    ACTIVITY_LEVELS,
    ACTIVITY_DISPLAY,
    ACTIVITY_SCORES
};

// Main searchable list function (updated for async loading)
export const getSearchableList = () => {
    const db = getBacteriaDatabase();
    return getSearchableListHelper(db);
};

// Additional utility functions for new structure
export const getGramPositiveBacteria = () => {
    const db = getBacteriaDatabase();
    return filterByGramStain(db, 'Positive');
};

export const getGramNegativeBacteria = () => {
    const db = getBacteriaDatabase();
    return filterByGramStain(db, 'Negative');
};

export const getEnterobacterales = () => {
    const db = getBacteriaDatabase();
    return filterByClsiCategory(db, 'Enterobacterales (excluding Salmonella/Shigella)');
};

// Database statistics - Updated for new structure
export const getDatabaseStats = () => {
    const db = getBacteriaDatabase();
    const bacteria = Object.values(db);
    const gramPositive = bacteria.filter(b => b.identity?.classification?.gramStain === 'Positive');
    const gramNegative = bacteria.filter(b => b.identity?.classification?.gramStain === 'Negative');
    const withClinicalAlerts = bacteria.filter(b => b.resistanceProfile?.clinicalAlerts?.length > 0);
    const withTreatmentRegimens = bacteria.filter(b => b.treatment?.regimens?.length > 0);
    const withBreakpoints = bacteria.filter(b => b.laboratoryProfile?.antimicrobialBreakpoints?.length > 0);
    
    return {
        total: bacteria.length,
        gramPositive: gramPositive.length,
        gramNegative: gramNegative.length,
        withClinicalAlerts: withClinicalAlerts.length,
        withTreatmentRegimens: withTreatmentRegimens.length,
        withBreakpoints: withBreakpoints.length,
        clsiCategories: [...new Set(bacteria.map(b => b.identity?.clsiCategory).filter(Boolean))].length,
        genera: [...new Set(bacteria.map(b => b.taxonomy?.genus).filter(Boolean))].length
    };
};

// Spectrum-specific utility functions
export const getAntibioticActivity = (bacteriumKey, antibioticName) => {
    const db = getBacteriaDatabase();
    const bacterium = db[bacteriumKey];
    if (!bacterium?.spectrumActivity) return 'unknown';
    return bacterium.spectrumActivity[antibioticName] || 'unknown';
};

export const getEffectiveAntibiotics = (bacteriumKey, minActivityLevel = 'active') => {
    const db = getBacteriaDatabase();
    const bacterium = db[bacteriumKey];
    if (!bacterium?.spectrumActivity) return [];
    
    const minScore = ACTIVITY_SCORES[minActivityLevel] || 1;
    
    return Object.entries(bacterium.spectrumActivity)
        .filter(([antibiotic, activity]) => ACTIVITY_SCORES[activity] >= minScore)
        .map(([antibiotic, activity]) => ({
            antibiotic,
            activity,
            display: ACTIVITY_DISPLAY[activity],
            score: ACTIVITY_SCORES[activity]
        }))
        .sort((a, b) => b.score - a.score);
};

export const findBacteriaSusceptibleTo = (antibioticName, minActivityLevel = 'active') => {
    const db = getBacteriaDatabase();
    const minScore = ACTIVITY_SCORES[minActivityLevel] || 1;
    
    return Object.entries(db)
        .filter(([key, bacterium]) => {
            const activity = bacterium.spectrumActivity?.[antibioticName];
            return activity && ACTIVITY_SCORES[activity] >= minScore;
        })
        .map(([key, bacterium]) => ({
            key,
            name: bacterium.name,
            activity: bacterium.spectrumActivity[antibioticName],
            display: ACTIVITY_DISPLAY[bacterium.spectrumActivity[antibioticName]],
            score: ACTIVITY_SCORES[bacterium.spectrumActivity[antibioticName]]
        }))
        .sort((a, b) => b.score - a.score);
};

// Backwards compatibility - deprecated, use getBacteriaDatabase()
// Note: This is a function call, not a variable declaration
export { getBacteriaDatabase as bacteriaDatabase };