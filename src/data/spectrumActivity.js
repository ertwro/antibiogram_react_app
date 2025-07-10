// src/data/spectrumActivity.js
// SAGA Spectrum Activity Database Module
// Parsed from SAGA CSV data with antibiotic-bacteria activity relationships

// Import the cleaned SAGA data
import sagaData from './sagaSpectrumData.json' with { type: 'json' };

// Activity level constants
export const ACTIVITY_LEVELS = {
    HIGHLY_ACTIVE: 'highly_active',
    ACTIVE: 'active', 
    VARIABLE: 'variable',
    INACTIVE: 'inactive',
    UNKNOWN: 'unknown'
};

// Activity level display mapping
export const ACTIVITY_DISPLAY = {
    'highly_active': '++',
    'active': '+',
    'variable': '±',
    'inactive': '0',
    'unknown': '?'
};

// Activity level scoring (for algorithmic use)
export const ACTIVITY_SCORES = {
    'highly_active': 3,
    'active': 2,
    'variable': 1,
    'inactive': 0,
    'unknown': 0
};

// Export the raw SAGA data
export const sagaSpectrumData = sagaData;

/**
 * Get antibiotic spectrum for a specific bacteria
 * @param {string} bacteriumName - Name from SAGA data (e.g., "S. aureus MSSA")
 * @returns {Object} Object with antibiotic activities
 */
export const getBacteriumSpectrum = (bacteriumName) => {
    return sagaData.bacteria_spectra[bacteriumName] || {};
};

/**
 * Get bacterial activity for a specific antibiotic
 * @param {string} antibioticName - Antibiotic name (e.g., "Penicillin G")
 * @returns {Object} Object with bacterial activities
 */
export const getAntibioticSpectrum = (antibioticName) => {
    return sagaData.antibiotic_spectra[antibioticName] || {};
};

/**
 * Get activity level between specific antibiotic and bacterium
 * @param {string} antibioticName - Antibiotic name
 * @param {string} bacteriumName - Bacterium name
 * @returns {string} Activity level
 */
export const getActivity = (antibioticName, bacteriumName) => {
    const spectrum = getAntibioticSpectrum(antibioticName);
    return spectrum[bacteriumName] || 'unknown';
};

/**
 * Get activity score for algorithmic processing
 * @param {string} antibioticName - Antibiotic name
 * @param {string} bacteriumName - Bacterium name
 * @returns {number} Activity score (0-3)
 */
export const getActivityScore = (antibioticName, bacteriumName) => {
    const activity = getActivity(antibioticName, bacteriumName);
    return ACTIVITY_SCORES[activity] || 0;
};

/**
 * Filter antibiotics by activity level against a bacterium
 * @param {string} bacteriumName - Bacterium name
 * @param {string} minActivityLevel - Minimum activity level
 * @returns {Array} Array of active antibiotics
 */
export const getActiveAntibiotics = (bacteriumName, minActivityLevel = 'active') => {
    const spectrum = getBacteriumSpectrum(bacteriumName);
    const minScore = ACTIVITY_SCORES[minActivityLevel] || 1;
    
    return Object.entries(spectrum)
        .filter(([antibiotic, activity]) => ACTIVITY_SCORES[activity] >= minScore)
        .map(([antibiotic, activity]) => ({
            antibiotic,
            activity,
            score: ACTIVITY_SCORES[activity]
        }))
        .sort((a, b) => b.score - a.score); // Sort by highest activity first
};

/**
 * Filter bacteria by susceptibility to an antibiotic
 * @param {string} antibioticName - Antibiotic name
 * @param {string} minActivityLevel - Minimum activity level
 * @returns {Array} Array of susceptible bacteria
 */
export const getSusceptibleBacteria = (antibioticName, minActivityLevel = 'active') => {
    const spectrum = getAntibioticSpectrum(antibioticName);
    const minScore = ACTIVITY_SCORES[minActivityLevel] || 1;
    
    return Object.entries(spectrum)
        .filter(([bacterium, activity]) => ACTIVITY_SCORES[activity] >= minScore)
        .map(([bacterium, activity]) => ({
            bacterium,
            activity,
            score: ACTIVITY_SCORES[activity]
        }))
        .sort((a, b) => b.score - a.score);
};

/**
 * Get comprehensive antibiotic recommendations for a bacterium
 * @param {string} bacteriumName - Bacterium name
 * @returns {Object} Categorized antibiotic recommendations
 */
export const getAntibioticRecommendations = (bacteriumName) => {
    const spectrum = getBacteriumSpectrum(bacteriumName);
    
    const recommendations = {
        firstLine: [], // highly_active
        secondLine: [], // active
        variable: [], // variable
        notRecommended: [] // inactive
    };
    
    Object.entries(spectrum).forEach(([antibiotic, activity]) => {
        const recommendation = {
            antibiotic,
            activity,
            display: ACTIVITY_DISPLAY[activity],
            score: ACTIVITY_SCORES[activity]
        };
        
        switch (activity) {
            case 'highly_active':
                recommendations.firstLine.push(recommendation);
                break;
            case 'active':
                recommendations.secondLine.push(recommendation);
                break;
            case 'variable':
                recommendations.variable.push(recommendation);
                break;
            case 'inactive':
                recommendations.notRecommended.push(recommendation);
                break;
        }
    });
    
    // Sort each category by antibiotic name
    Object.keys(recommendations).forEach(category => {
        recommendations[category].sort((a, b) => a.antibiotic.localeCompare(b.antibiotic));
    });
    
    return recommendations;
};

/**
 * Map SAGA bacteria names to our database keys
 * @param {string} sagaBacteriumName - Bacterium name from SAGA
 * @returns {string|null} Database key or null if not mapped
 */
export const mapToDbKey = (sagaBacteriumName) => {
    return sagaData.database_key_mapping[sagaBacteriumName] || null;
};

/**
 * Get spectrum data for our database bacteria
 * @param {string} dbKey - Database key (e.g., "staphaureus")
 * @returns {Object} Spectrum data for database bacterium
 */
export const getDbBacteriumSpectrum = (dbKey) => {
    // Find SAGA bacteria names that map to this database key
    const sagaNames = Object.entries(sagaData.database_key_mapping)
        .filter(([sagaName, mappedKey]) => mappedKey === dbKey)
        .map(([sagaName]) => sagaName);
    
    if (sagaNames.length === 0) return {};
    
    // For bacteria with multiple variants (like MSSA/MRSA), merge the spectra
    const mergedSpectrum = {};
    
    sagaNames.forEach(sagaName => {
        const spectrum = getBacteriumSpectrum(sagaName);
        Object.entries(spectrum).forEach(([antibiotic, activity]) => {
            // Use the most restrictive (lowest) activity level if conflicting
            if (!mergedSpectrum[antibiotic] || ACTIVITY_SCORES[activity] < ACTIVITY_SCORES[mergedSpectrum[antibiotic]]) {
                mergedSpectrum[antibiotic] = activity;
            }
        });
    });
    
    return mergedSpectrum;
};

// Export metadata
export const getSpectrumMetadata = () => ({
    antibiotics: sagaData.antibiotics,
    bacteria: sagaData.bacteria,
    mappedBacteria: Object.keys(sagaData.database_key_mapping),
    counts: {
        antibiotics: sagaData.metadata.antibiotics_count,
        bacteria: sagaData.metadata.bacteria_count,
        mappings: Object.keys(sagaData.database_key_mapping).length
    }
});