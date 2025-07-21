// src/data/antibiotics.js
// --- Enhanced Antibiotic Pharmacology Database ---
// Now powered by comprehensive JSON database with 100+ drugs

// Import the generated comprehensive database
import { 
  antibioticsData as generatedAntibioticsData,
  DRUG_FAMILIES,
  PKPD_TARGETS,
  PREGNANCY_CATEGORIES,
  getAntibioticsDatabase,
  getDrugsByFamily,
  searchDrugs,
  getDrugByName,
  getDrugFamilies,
  getDatabaseStats
} from './generatedAntibioticsIndex.js';

// Re-export constants for backward compatibility
export { 
  DRUG_FAMILIES, 
  PKPD_TARGETS, 
  PREGNANCY_CATEGORIES 
};

// Main antibiotics database - now powered by comprehensive JSON data
export const antibioticsData = generatedAntibioticsData;

// Enhanced helper functions
export const getAntibioticsList = () => {
  return Object.keys(antibioticsData);
};

export const getAntibioticByName = (name) => {
  return getDrugByName(name);
};

export const getAntibioticsByFamily = (family) => {
  return getDrugsByFamily(family);
};

export const searchAntibiotics = (searchTerm) => {
  return searchDrugs(searchTerm);
};

// Get antibiotics suitable for specific organisms
export const getAntibioticsForOrganism = (organismName) => {
  return Object.values(antibioticsData).filter(antibiotic => {
    const preferred = antibiotic.spectrum?.preferred || [];
    const alternative = antibiotic.spectrum?.alternative || [];
    
    return preferred.some(org => org.toLowerCase().includes(organismName.toLowerCase())) ||
           alternative.some(org => org.toLowerCase().includes(organismName.toLowerCase()));
  });
};

// Get antibiotics by mechanism of action
export const getAntibioticsByMechanism = (mechanismTarget) => {
  return Object.values(antibioticsData).filter(antibiotic => 
    antibiotic.mechanism?.target?.toLowerCase().includes(mechanismTarget.toLowerCase())
  );
};

// Get antibiotics with specific PK/PD characteristics
export const getAntibioticsByPKPD = (pkpdType) => {
  return Object.values(antibioticsData).filter(antibiotic => 
    antibiotic.mechanism?.pkpdIndex === pkpdType
  );
};

// Get antibiotics safe in pregnancy
export const getPregnancySafeAntibiotics = () => {
  return Object.values(antibioticsData).filter(antibiotic => 
    antibiotic.safety?.pregnancyCategory?.includes('Category A') ||
    antibiotic.safety?.pregnancyCategory?.includes('Category B')
  );
};

// Get antibiotics with renal dosing adjustments
export const getAntibioticsWithRenalAdjustment = () => {
  return Object.values(antibioticsData).filter(antibiotic => 
    antibiotic.dosing?.adult?.renal?.moderate !== 'No adjustment' &&
    antibiotic.dosing?.adult?.renal?.moderate !== antibiotic.dosing?.adult?.renal?.normal
  );
};

// Get oral antibiotics
export const getOralAntibiotics = () => {
  return Object.values(antibioticsData).filter(antibiotic => {
    const preparations = antibiotic.pharmacology?.preparations || '';
    return preparations.toLowerCase().includes('po') || 
           preparations.toLowerCase().includes('oral') ||
           preparations.toLowerCase().includes('cap') ||
           preparations.toLowerCase().includes('tab');
  });
};

// Get IV antibiotics
export const getIVAntibiotics = () => {
  return Object.values(antibioticsData).filter(antibiotic => {
    const adultDose = antibiotic.dosing?.adult?.standard || '';
    return adultDose.toLowerCase().includes('iv') || 
           adultDose.toLowerCase().includes('intravenous');
  });
};

// Enhanced antibiotic information with stewardship guidance
export const getAntibioticInfo = (antibioticName) => {
  const antibiotic = getDrugByName(antibioticName);
  if (!antibiotic) return null;

  return {
    ...antibiotic,
    // Enhanced information
    stewardshipNotes: generateStewardshipNotes(antibiotic),
    clinicalAlerts: generateClinicalAlerts(antibiotic),
    dosingSummary: generateDosingSummary(antibiotic),
    monitoringPlan: generateMonitoringPlan(antibiotic)
  };
};

// Helper function to generate stewardship notes
function generateStewardshipNotes(antibiotic) {
  const notes = [];
  
  // Add family-specific stewardship guidance
  if (antibiotic.classification?.family === 'CARBAPENEM') {
    notes.push('🚨 Carbapenem stewardship: Reserve for MDR organisms or severe infections');
  }
  
  if (antibiotic.classification?.family === 'FLUOROQUINOLONE') {
    notes.push('⚠️ Fluoroquinolone stewardship: Monitor for C. diff and resistance development');
  }
  
  if (antibiotic.classification?.family === 'GLYCOPEPTIDE') {
    notes.push('📊 Monitor levels and renal function for glycopeptides');
  }
  
  // Add resistance risk warnings
  if (antibiotic.spectrum?.preferred?.length > 10) {
    notes.push('🔄 Broad spectrum: Consider de-escalation based on culture results');
  }
  
  return notes;
}

// Helper function to generate clinical alerts
function generateClinicalAlerts(antibiotic) {
  const alerts = [];
  
  // Pregnancy warnings
  if (antibiotic.safety?.pregnancyCategory?.includes('Category D') || 
      antibiotic.safety?.pregnancyCategory?.includes('Category X')) {
    alerts.push('🤰 Pregnancy warning: Use with caution or avoid in pregnancy');
  }
  
  // Black box warnings
  if (antibiotic.safety?.blackBoxWarning) {
    alerts.push('⚫ Black box warning: See prescribing information');
  }
  
  // Drug interactions
  if (antibiotic.interactions?.length > 3) {
    alerts.push('🔄 Multiple drug interactions: Review medication list');
  }
  
  return alerts;
}

// Helper function to generate dosing summary
function generateDosingSummary(antibiotic) {
  const adult = antibiotic.dosing?.adult;
  if (!adult) return 'See prescribing information';
  
  let summary = `Standard: ${adult.standard || 'Not specified'}`;
  
  if (adult.severe && adult.severe !== adult.standard) {
    summary += ` | Severe: ${adult.severe}`;
  }
  
  if (adult.renal?.moderate !== 'No adjustment') {
    summary += ` | Renal adjustment required`;
  }
  
  return summary;
}

// Helper function to generate monitoring plan
function generateMonitoringPlan(antibiotic) {
  const plan = ['Clinical response'];
  
  if (antibiotic.monitoring?.levels) {
    plan.push('Serum levels');
  }
  
  if (antibiotic.classification?.family === 'AMINOGLYCOSIDE') {
    plan.push('Renal function', 'Hearing assessment');
  }
  
  if (antibiotic.classification?.family === 'GLYCOPEPTIDE') {
    plan.push('Renal function', 'Trough levels');
  }
  
  if (antibiotic.safety?.majorAdverseEffects?.some(effect => 
      effect.toLowerCase().includes('hepat'))) {
    plan.push('Liver function');
  }
  
  return plan;
}

// Database statistics for monitoring
export const getDrugDatabaseStats = () => {
  return getDatabaseStats();
};

// Export the main helper functions for external use
export {
  getAntibioticsDatabase,
  getDrugsByFamily,
  searchDrugs,
  getDrugByName,
  getDrugFamilies
};

// Log database status
console.log('💊 Enhanced antibiotics database loaded');
console.log(`   📊 Total drugs: ${Object.keys(antibioticsData).length}`);
console.log('   🔄 Now powered by comprehensive JSON database');

// Default export for compatibility
export default {
  antibioticsData,
  getAntibioticsList,
  getAntibioticByName,
  getAntibioticsByFamily,
  searchAntibiotics,
  getAntibioticsForOrganism,
  getAntibioticsByMechanism,
  getAntibioticsByPKPD,
  getPregnancySafeAntibiotics,
  getAntibioticsWithRenalAdjustment,
  getOralAntibiotics,
  getIVAntibiotics,
  getAntibioticInfo,
  getDrugDatabaseStats,
  DRUG_FAMILIES,
  PKPD_TARGETS,
  PREGNANCY_CATEGORIES
};