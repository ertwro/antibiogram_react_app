// src/data/helpers/databaseHelpers.js
// Helper functions for bacterial database operations - New JSON Structure
// Optimized for scalability to handle 150+ organisms efficiently

// Performance cache for search results
let searchListCache = null;
let cacheVersion = null;

/**
 * Helper function to get searchable bacterial list from new JSON structure
 * Optimized with caching for performance with 150+ organisms
 * @param {Object} bacteriaDatabase - The bacterial database object
 * @returns {Array} Array of searchable bacterial objects
 */
export const getSearchableList = (bacteriaDatabase) => {
    // Check if we can use cached version
    const currentVersion = JSON.stringify(Object.keys(bacteriaDatabase));
    if (searchListCache && cacheVersion === currentVersion) {
        return searchListCache;
    }

    // Generate new search list with performance optimizations
    const searchList = Object.entries(bacteriaDatabase).map(([key, bacteria]) => {
        // Pre-process search terms for efficiency
        const baseTerms = [
            bacteria._originalData?.identity?.bacteriumName,
            bacteria.identity?.bacteriumName,
            bacteria.name,
            bacteria.taxonomy?.genus,
            bacteria.taxonomy?.species,
            bacteria.identity?.classification?.gramStain,
            bacteria.identity?.clsiCategory
        ].filter(Boolean).filter(term => typeof term === 'string').map(term => term.toLowerCase());

        const aliasTerms = (bacteria._originalData?.identity?.aliases || bacteria.identity?.aliases || [])
            .filter(alias => typeof alias === 'string')
            .map(alias => alias.toLowerCase());
        
        const syndromeTerms = (bacteria._originalData?.clinicalProfile?.clinicalSyndromes || bacteria.clinicalProfile?.clinicalSyndromes || [])
            .map(s => s.syndromeName)
            .filter(name => typeof name === 'string')
            .map(name => name.toLowerCase());
        
        const mechanismTerms = (bacteria._originalData?.resistanceProfile?.majorMechanisms || bacteria.resistanceProfile?.majorMechanisms || [])
            .map(rm => rm.mechanismName)
            .filter(name => typeof name === 'string')
            .map(name => name.toLowerCase());

        const allSearchTerms = [...baseTerms, ...aliasTerms, ...syndromeTerms, ...mechanismTerms];

        // Extract genus from bacterium name if no taxonomy exists
        const bacteriumName = bacteria._originalData?.identity?.bacteriumName || bacteria.identity?.bacteriumName || bacteria.name || 'Unknown';
        const safeName = typeof bacteriumName === 'string' ? bacteriumName : 'Unknown';
        const genus = bacteria._originalData?.identity?.classification?.taxonomy?.genus || 
                     bacteria.taxonomy?.genus || 
                     safeName.split(' ')[0] || '';
        const species = bacteria._originalData?.identity?.classification?.taxonomy?.species ||
                       bacteria.taxonomy?.species || 
                       safeName.split(' ')[1] || '';

        return {
            id: key,
            name: safeName,
            gramStain: bacteria._originalData?.identity?.classification?.gramStain || 
                      bacteria.identity?.classification?.gramStain || 'unknown',
            clinicalSignificance: 2, // Default for new structure
            significance: 2,
            taxonomy: {
                genus: genus,
                species: species,
                family: bacteria.taxonomy?.family || '',
                order: bacteria.taxonomy?.order || '',
                class: bacteria.taxonomy?.class || '',
                phylum: bacteria.taxonomy?.phylum || '',
                domain: bacteria.taxonomy?.domain || 'Bacteria'
            },
            clsiCategory: bacteria.identity?.clsiCategory,
            aliases: bacteria.identity?.aliases || [],
            clinicalSyndromes: bacteria.clinicalProfile?.clinicalSyndromes || [],
            resistanceMechanisms: bacteria.resistanceProfile?.majorMechanisms || [],
            clinicalAlerts: bacteria.resistanceProfile?.clinicalAlerts || [],
            searchTerms: allSearchTerms,
            // Add indexed fields for faster filtering
            _indexed: {
                name: bacteriumName.toLowerCase(),
                genus: genus.toLowerCase(),
                gramStain: bacteria.identity?.classification?.gramStain?.toLowerCase() || '',
                clsiCategory: bacteria.identity?.clsiCategory?.toLowerCase() || ''
            }
        };
    });

    // Cache the results
    searchListCache = searchList;
    cacheVersion = currentVersion;
    
    return searchList;
};

/**
 * Filter bacteria by Gram stain type - New JSON Structure
 * @param {Object} bacteriaDatabase - The bacterial database object
 * @param {string} gramStainType - 'Positive' or 'Negative'
 * @returns {Object} Filtered bacteria database
 */
export const filterByGramStain = (bacteriaDatabase, gramStainType) => {
    return Object.fromEntries(
        Object.entries(bacteriaDatabase).filter(([key, bacteria]) => 
            bacteria.identity?.classification?.gramStain === gramStainType
        )
    );
};

/**
 * Filter bacteria by CLSI category - New JSON Structure
 * @param {Object} bacteriaDatabase - The bacterial database object
 * @param {string} clsiCategory - CLSI category name
 * @returns {Object} Filtered bacteria database
 */
export const filterByClsiCategory = (bacteriaDatabase, clsiCategory) => {
    return Object.fromEntries(
        Object.entries(bacteriaDatabase).filter(([key, bacteria]) => 
            bacteria.identity?.clsiCategory === clsiCategory
        )
    );
};

/**
 * Search bacteria by name, taxonomy, or clinical features - New JSON Structure
 * @param {Object} bacteriaDatabase - The bacterial database object
 * @param {string} searchTerm - Search term
 * @returns {Object} Filtered bacteria database
 */
export const searchBacteria = (bacteriaDatabase, searchTerm) => {
    const term = searchTerm.toLowerCase();
    return Object.fromEntries(
        Object.entries(bacteriaDatabase).filter(([key, bacteria]) => {
            const searchableFields = [
                bacteria.identity?.bacteriumName,
                bacteria.name,
                bacteria.taxonomy?.genus,
                bacteria.taxonomy?.species,
                bacteria.taxonomy?.family,
                bacteria.identity?.clsiCategory,
                ...(bacteria.identity?.aliases || []),
                ...(bacteria.clinicalProfile?.clinicalSyndromes || [])
                    .map(s => s.syndromeName)
            ].filter(Boolean);
            
            return searchableFields.some(field => 
                field.toLowerCase().includes(term)
            );
        })
    );
};

/**
 * Validate bacterial database entry structure - New JSON Structure
 * @param {Object} bacterium - Single bacterium object
 * @returns {Object} Validation result with isValid and errors
 */
export const validateBacterium = (bacterium) => {
    const errors = [];
    
    // Required fields for new structure
    if (!bacterium.identity) errors.push('Missing identity section');
    if (!bacterium.clinicalProfile) errors.push('Missing clinicalProfile section');
    if (!bacterium.resistanceProfile) errors.push('Missing resistanceProfile section');
    if (!bacterium.treatment) errors.push('Missing treatment section');
    if (!bacterium.laboratoryProfile) errors.push('Missing laboratoryProfile section');
    
    // Validate identity section
    if (bacterium.identity) {
        if (!bacterium.identity.bacteriumName) errors.push('Missing bacteriumName in identity');
        if (!bacterium.identity.clsiCategory) errors.push('Missing clsiCategory in identity');
        if (!bacterium.identity.classification) errors.push('Missing classification in identity');
    }
    
    // Validate clinical profile
    if (bacterium.clinicalProfile) {
        if (!bacterium.clinicalProfile.summary) errors.push('Missing summary in clinicalProfile');
    }
    
    // Validate resistance profile
    if (bacterium.resistanceProfile) {
        if (!bacterium.resistanceProfile.majorMechanisms) errors.push('Missing majorMechanisms in resistanceProfile');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Merge multiple bacterial databases
 * @param {...Object} databases - Multiple bacterial database objects
 * @returns {Object} Merged bacterial database
 */
export const mergeDatabases = (...databases) => {
    return databases.reduce((merged, db) => {
        return { ...merged, ...db };
    }, {});
};

/**
 * Get MIC breakpoint interpretation for an antibiotic
 * @param {Object} bacterium - Bacterium object
 * @param {string} antibiotic - Antibiotic name
 * @param {number} micValue - MIC value
 * @returns {Object} Interpretation result
 */
export const interpretMICBreakpoint = (bacterium, antibiotic, micValue) => {
    const labProfile = bacterium.laboratoryProfile;
    if (!labProfile?.antimicrobialBreakpoints) return null;
    
    for (const tier of labProfile.antimicrobialBreakpoints) {
        for (const agent of tier.agents) {
            if (agent.agentName.toLowerCase() === antibiotic.toLowerCase()) {
                const breakpoint = agent.breakpointSets[0]?.mic;
                if (!breakpoint) continue;
                
                // Parse breakpoint values
                const sBreakpoint = parseFloat(breakpoint.s_breakpoint?.replace('≤ ', '').replace('≥ ', ''));
                const rBreakpoint = parseFloat(breakpoint.r_breakpoint?.replace('≤ ', '').replace('≥ ', ''));
                
                if (micValue <= sBreakpoint) {
                    return { interpretation: 'S', category: 'Susceptible', tier: tier.tier };
                } else if (micValue >= rBreakpoint) {
                    return { interpretation: 'R', category: 'Resistant', tier: tier.tier };
                } else {
                    return { interpretation: 'I', category: 'Intermediate', tier: tier.tier };
                }
            }
        }
    }
    return null;
};

/**
 * Get treatment recommendations based on resistance pattern and patient context
 * @param {Object} bacterium - Bacterium object
 * @param {Object} patientContext - Patient context (age, infection location, etc.)
 * @param {Object} resistancePattern - Resistance pattern from antibiogram
 * @returns {Array} Treatment recommendations
 */
export const getTreatmentRecommendations = (bacterium, patientContext, resistancePattern) => {
    const treatment = bacterium.treatment;
    if (!treatment?.regimens) return [];
    
    // Filter regimens based on patient context
    const applicableRegimens = treatment.regimens.filter(regimen => {
        const context = regimen.context;
        
        // Check patient population
        if (context.patientPopulation) {
            const ageGroup = patientContext.age >= 18 ? 'Adult' : 'Pediatric';
            if (!context.patientPopulation.includes(ageGroup)) return false;
        }
        
        // Check infection source
        if (context.isolateSource && patientContext.infectionLocation) {
            if (context.isolateSource !== patientContext.infectionLocation) return false;
        }
        
        return true;
    });
    
    return applicableRegimens.map(regimen => ({
        ...regimen,
        applicabilityScore: calculateApplicabilityScore(regimen, patientContext, resistancePattern)
    })).sort((a, b) => b.applicabilityScore - a.applicabilityScore);
};

/**
 * Calculate applicability score for treatment regimen
 * @param {Object} regimen - Treatment regimen
 * @param {Object} patientContext - Patient context
 * @param {Object} resistancePattern - Resistance pattern
 * @returns {number} Applicability score
 */
function calculateApplicabilityScore(regimen, patientContext, resistancePattern) {
    let score = 0;
    
    // Prefer primary recommendations
    if (regimen.recommendations[0]?.preference === 'Primary') score += 10;
    
    // Consider resistance pattern
    if (regimen.context.condition?.includes('ESBL') && resistancePattern?.hasESBL) score += 5;
    if (regimen.context.condition?.includes('Carbapenem') && resistancePattern?.hasCarbapenemase) score += 5;
    
    // Consider severity
    if (regimen.context.condition?.includes('Severe') && patientContext.severity === 'severe') score += 5;
    
    return score;
}

// === PERFORMANCE OPTIMIZATIONS FOR 150+ ORGANISMS ===

/**
 * Clear search cache - useful when database is updated
 */
export const clearSearchCache = () => {
    searchListCache = null;
    cacheVersion = null;
};

/**
 * Batch process bacteria for efficient operations
 * @param {Array} operations - Array of operation functions
 * @param {Object} bacteriaDatabase - The bacterial database
 * @param {number} batchSize - Size of each batch (default: 25)
 * @returns {Array} Results from all operations
 */
export const batchProcessBacteria = (operations, bacteriaDatabase, batchSize = 25) => {
    const bacteria = Object.entries(bacteriaDatabase);
    const results = [];
    
    for (let i = 0; i < bacteria.length; i += batchSize) {
        const batch = bacteria.slice(i, i + batchSize);
        const batchResults = operations.map(operation => 
            batch.map(([key, bacterium]) => operation(key, bacterium))
        );
        results.push(...batchResults);
    }
    
    return results.flat();
};

/**
 * Fast search using indexed fields for better performance
 * @param {Array} searchableList - Pre-processed searchable list
 * @param {string} searchTerm - Search term
 * @param {Object} filters - Optional filters (gramStain, clsiCategory)
 * @returns {Array} Filtered results
 */
export const fastSearch = (searchableList, searchTerm, filters = {}) => {
    const term = searchTerm.toLowerCase();
    
    return searchableList.filter(bacterium => {
        // Apply filters first (most selective)
        if (filters.gramStain && bacterium._indexed.gramStain !== filters.gramStain.toLowerCase()) {
            return false;
        }
        
        if (filters.clsiCategory && bacterium._indexed.clsiCategory !== filters.clsiCategory.toLowerCase()) {
            return false;
        }
        
        // Then apply text search
        if (!term) return true;
        
        // Fast indexed field search first
        if (bacterium._indexed.name.includes(term) || 
            bacterium._indexed.genus.includes(term)) {
            return true;
        }
        
        // Fallback to full search terms if needed
        return bacterium.searchTerms.some(searchTerm => searchTerm.includes(term));
    });
};

/**
 * Get database performance metrics
 * @param {Object} bacteriaDatabase - The bacterial database
 * @returns {Object} Performance metrics
 */
export const getDatabaseMetrics = (bacteriaDatabase) => {
    const start = performance.now();
    const searchList = getSearchableList(bacteriaDatabase);
    const searchListTime = performance.now() - start;
    
    return {
        totalOrganisms: Object.keys(bacteriaDatabase).length,
        searchListGenerationTime: searchListTime,
        cacheStatus: searchListCache ? 'cached' : 'generated',
        avgTermsPerOrganism: searchList.reduce((sum, b) => sum + b.searchTerms.length, 0) / searchList.length,
        performanceReady: Object.keys(bacteriaDatabase).length <= 200 // Threshold for good performance
    };
};