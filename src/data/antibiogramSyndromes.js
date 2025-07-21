// src/data/antibiogramSyndromes.js
// --- Pharmacologically Relevant Syndromes for Antibiogram Interpretation ---
// Curated subset focusing on syndromes where site affects antibiotic choice significantly

import { 
  getSyndromesDatabase, 
  getSyndromesByCategory 
} from './generatedSyndromesIndex.js';

/**
 * Pharmacologically Relevant Syndrome Categories
 * These are syndromes where the infection site significantly impacts:
 * - Drug penetration requirements
 * - Bactericidal vs bacteriostatic needs  
 * - Dosing considerations
 * - Route of administration
 * - Treatment duration
 */

export const ANTIBIOGRAM_SYNDROME_CATEGORIES = {
  'CNS': {
    label: 'Sistema Nervioso Central',
    color: 'bg-red-50 border-red-200',
    penetrationRequirement: 'CNS_critical',
    bactericidalRequired: true,
    dosing: 'high_dose',
    icon: '🧠',
    clinicalNote: 'Penetración BHE crítica, terapia bactericida requerida',
    options: [
      {
        syndromeId: 'CNS_meningitis_empiric_therapy_meningitis_age_1_mo_to_50_years',
        value: 'CNS_meningitis_bacterial',
        label: 'Meningitis bacteriana (1 mes - 50 años)',
        severity: 3,
        stewardshipNotes: 'Inicio empírico inmediato, ajustar según cultivos'
      },
      {
        syndromeId: 'CNS_meningitis_empiric_therapy_meningitis_age_50_years', 
        value: 'CNS_meningitis_elderly',
        label: 'Meningitis bacteriana (> 50 años)',
        severity: 3,
        stewardshipNotes: 'Cobertura adicional para Listeria monocytogenes'
      },
      {
        syndromeId: 'CNS_brain_abscess_brain_abscess_bacterial',
        value: 'CNS_brain_abscess',
        label: 'Absceso cerebral',
        severity: 3,
        stewardshipNotes: 'Terapia prolongada, considerar anaérobios'
      }
    ]
  },
  
  'Cardiovascular': {
    label: 'Cardiovascular',
    color: 'bg-purple-50 border-purple-200', 
    penetrationRequirement: 'moderate',
    bactericidalRequired: true,
    dosing: 'high_dose',
    icon: '💓',
    clinicalNote: 'Terapia bactericida esencial, concentraciones altas',
    options: [
      {
        syndromeId: 'cardiovascular_endocarditis_endocarditis_native_valve_empiric_therapy',
        value: 'CV_endocarditis_native',
        label: 'Endocarditis válvula nativa',
        severity: 3,
        stewardshipNotes: 'Hemocultivos seriados antes de iniciar ATB'
      },
      {
        syndromeId: 'cardiovascular_endocarditis_endocarditis_prosthetic_valve_empiric_therapy',
        value: 'CV_endocarditis_prosthetic', 
        label: 'Endocarditis válvula protésica',
        severity: 3,
        stewardshipNotes: 'Cobertura estafilococo resistente, consulta cardiocirugía'
      },
      {
        syndromeId: 'infectious_syndromes_septic_shock_sepsis_adult',
        value: 'BS_bacteremia',
        label: 'Bacteriemia/Sepsis',
        severity: 2,
        stewardshipNotes: 'Terapia empírica inmediata, descalamiento según cultivos'
      }
    ]
  },

  'Respiratory': {
    label: 'Respiratorio',
    color: 'bg-blue-50 border-blue-200',
    penetrationRequirement: 'good',
    bactericidalRequired: false,
    dosing: 'standard',
    icon: '🫁',
    clinicalNote: 'Buena penetración pulmonar, bacteriostáticos efectivos',
    options: [
      {
        syndromeId: 'lower_respiratory_pneumonia_empiric_community_acquired_pneumonia_community_acquired_adult_in_patient',
        value: 'RESP_CAP_hospitalized',
        label: 'Neumonía adquirida en comunidad (hospitalizada)',
        severity: 2,
        stewardshipNotes: 'Evaluar factores de riesgo para patógenos resistentes'
      },
      {
        syndromeId: 'lower_respiratory_pneumonia_empiric_community_acquired_pneumonia_community_acquired_adult_out_patien',
        value: 'RESP_CAP_outpatient',
        label: 'Neumonía adquirida en comunidad (ambulatoria)',
        severity: 1,
        stewardshipNotes: 'Preferir vía oral cuando sea posible'
      },
      {
        syndromeId: 'lower_respiratory_pneumonia_empiric_pneumonia_healthcare_associated',
        value: 'RESP_HAP',
        label: 'Neumonía asociada a cuidados de salud',
        severity: 2,
        stewardshipNotes: 'Cobertura empírica para patógenos MDR'
      }
    ]
  },

  'GU': {
    label: 'Genitourinario',
    color: 'bg-green-50 border-green-200',
    penetrationRequirement: 'urinary_specific',
    bactericidalRequired: false,
    dosing: 'standard', 
    icon: '🩺',
    clinicalNote: 'Concentración urinaria más importante que sérica',
    options: [
      {
        syndromeId: 'genitourinary_cystitis_uti_acute_uncomplicated_adult_female',
        value: 'GU_UTI_uncomplicated',
        label: 'ITU no complicada (mujer)',
        severity: 1,
        stewardshipNotes: 'Curso corto, evitar fluoroquinolonas si es posible'
      },
      {
        syndromeId: 'genitourinary_cystitis_uti_complicated_or_catheter_related', 
        value: 'GU_UTI_complicated',
        label: 'ITU complicada/asociada a catéter',
        severity: 2,
        stewardshipNotes: 'Cultivo obligatorio, considerar patógenos resistentes'
      },
      {
        syndromeId: 'genitourinary_pyelonephritis_pyelonephritis_acute',
        value: 'GU_pyelonephritis',
        label: 'Pielonefritis aguda',
        severity: 2,
        stewardshipNotes: 'Penetración sistémica requerida, evitar nitrofurantoína'
      }
    ]
  },

  'Skin_Soft_Tissue': {
    label: 'Piel y Tejidos Blandos',
    color: 'bg-yellow-50 border-yellow-200',
    penetrationRequirement: 'good',
    bactericidalRequired: false,
    dosing: 'standard',
    icon: '🩹',
    clinicalNote: 'Buena penetración en tejidos blandos',
    options: [
      {
        syndromeId: 'skin_and_soft_tissues_Celulitis_cellulitis_erysipelas_extremities',
        value: 'SST_cellulitis_simple',
        label: 'Celulitis no complicada',
        severity: 1,
        stewardshipNotes: 'Cobertura estreptocócica, vía oral cuando es posible'
      },
      {
        syndromeId: 'skin_and_soft_tissues_abscess_skin_abscess_boils_furuncles',
        value: 'SST_abscess',
        label: 'Absceso de piel/tejidos blandos',
        severity: 2,
        stewardshipNotes: 'Drenaje + antibióticos, cobertura SARM si factores de riesgo'
      },
      {
        syndromeId: 'skin_and_soft_tissues_Necrotizing_fascitis_necrotizing_fasciitis_streptococcal_1',
        value: 'SST_necrotizing_fasciitis',
        label: 'Fascitis necrotizante',
        severity: 3,
        stewardshipNotes: 'Emergencia quirúrgica + antibióticos IV de amplio espectro'
      }
    ]
  },

  'Intra_Abdominal': {
    label: 'Intraabdominal',
    color: 'bg-indigo-50 border-indigo-200',
    penetrationRequirement: 'good',
    bactericidalRequired: false,
    dosing: 'standard',
    icon: '🫃',
    clinicalNote: 'Cobertura anaérobica frecuentemente requerida',
    options: [
      {
        syndromeId: 'intra-abdominal_peritonitis_peritonitis_rupture_perforation_abscess',
        value: 'IA_peritonitis_secondary',
        label: 'Peritonitis secundaria',
        severity: 2,
        stewardshipNotes: 'Cobertura aeróbica + anaeróbica, control de fuente'
      },
      {
        syndromeId: 'intra-abdominal_gallbladder_biliary_tract_cholangitis_1',
        value: 'IA_cholangitis',
        label: 'Colangitis',
        severity: 2,
        stewardshipNotes: 'Drenaje biliar + antibióticos sistémicos'
      },
      {
        syndromeId: 'intra-abdominal_peritonitis_appendicitis',
        value: 'IA_appendicitis',
        label: 'Apendicitis complicada',
        severity: 2,
        stewardshipNotes: 'Cobertura polimicrobiana, duración según evolución'
      }
    ]
  }
};

/**
 * Get pharmacologically relevant syndromes for antibiogram
 * Returns simplified categories optimized for antibiotic selection
 */
export function getAntibiogramSyndromes() {
  return ANTIBIOGRAM_SYNDROME_CATEGORIES;
}

/**
 * Get syndrome details by ID for enhanced recommendations
 * @param {string} syndromeValue - The syndrome value (e.g., 'CNS_meningitis_bacterial')
 * @returns {Object|null} Full syndrome data from database
 */
export function getSyndromeDetails(syndromeValue) {
  const syndromesDB = getSyndromesDatabase();
  
  // Find syndrome in our curated list
  for (const category of Object.values(ANTIBIOGRAM_SYNDROME_CATEGORIES)) {
    const option = category.options.find(opt => opt.value === syndromeValue);
    if (option && option.syndromeId) {
      return syndromesDB[option.syndromeId] || null;
    }
  }
  
  return null;
}

/**
 * Get site-specific antibiotic considerations
 * @param {string} syndromeValue - The syndrome value
 * @returns {Object} Site-specific considerations for antibiotic selection
 */
export function getSiteSpecificConsiderations(syndromeValue) {
  // Find the category and option
  for (const [categoryKey, category] of Object.entries(ANTIBIOGRAM_SYNDROME_CATEGORIES)) {
    const option = category.options.find(opt => opt.value === syndromeValue);
    if (option) {
      return {
        category: categoryKey,
        penetrationRequirement: category.penetrationRequirement,
        bactericidalRequired: category.bactericidalRequired,
        dosing: category.dosing,
        severity: option.severity,
        stewardshipNotes: option.stewardshipNotes,
        clinicalNote: category.clinicalNote
      };
    }
  }
  
  // Default considerations
  return {
    category: 'General',
    penetrationRequirement: 'moderate',
    bactericidalRequired: false,
    dosing: 'standard',
    severity: 2,
    stewardshipNotes: 'Utilizar principios estándar de stewardship',
    clinicalNote: 'Consideraciones generales de penetración y eficacia'
  };
}

/**
 * Get enhanced treatment recommendations based on syndrome
 * @param {string} syndromeValue - The syndrome value
 * @param {Object} resistanceData - Detected resistance patterns
 * @returns {Object} Enhanced recommendations
 */
export function getEnhancedTreatmentRecommendations(syndromeValue, resistanceData = {}) {
  const considerations = getSiteSpecificConsiderations(syndromeValue);
  const syndromeDetails = getSyndromeDetails(syndromeValue);
  
  const recommendations = {
    siteSpecific: considerations,
    dosing: getDosingSuggestions(considerations),
    duration: getTreatmentDuration(syndromeValue),
    monitoring: getMonitoringRequirements(considerations),
    stewardship: getSttewardshipGuidance(syndromeValue, resistanceData)
  };
  
  // Add specific regimens from syndrome database if available
  if (syndromeDetails?.data?.content) {
    const regimens = extractRegimensFromContent(syndromeDetails.data.content);
    if (regimens.length > 0) {
      recommendations.evidenceBasedRegimens = regimens;
    }
  }
  
  return recommendations;
}

// Helper functions
function getDosingSuggestions(considerations) {
  const suggestions = {
    standard: 'Dosificación estándar según función renal/hepática',
    high_dose: 'Considerar dosis altas para penetración óptima',
    extended_infusion: 'Considerar infusión extendida para antibióticos tiempo-dependientes'
  };
  
  return suggestions[considerations.dosing] || suggestions.standard;
}

function getTreatmentDuration(syndromeValue) {
  const durations = {
    'GU_UTI_uncomplicated': '3-5 días',
    'GU_UTI_complicated': '7-14 días',
    'GU_pyelonephritis': '10-14 días',
    'RESP_CAP_outpatient': '5-7 días',
    'RESP_CAP_hospitalized': '7-10 días',
    'RESP_HAP': '7-14 días',
    'SST_cellulitis_simple': '5-10 días',
    'SST_abscess': '7-10 días',
    'SST_necrotizing_fasciitis': '10-21 días',
    'CNS_meningitis_bacterial': '10-21 días',
    'CNS_brain_abscess': '4-8 semanas',
    'CV_endocarditis_native': '4-6 semanas',
    'CV_endocarditis_prosthetic': '6-8 semanas',
    'BS_bacteremia': '7-14 días',
    'IA_peritonitis_secondary': '7-14 días',
    'IA_cholangitis': '7-14 días'
  };
  
  return durations[syndromeValue] || '7-14 días (ajustar según evolución)';
}

function getMonitoringRequirements(considerations) {
  const requirements = ['Respuesta clínica', 'Función renal'];
  
  if (considerations.severity >= 3) {
    requirements.push('Biomarcadores inflamatorios', 'Cultivos de control');
  }
  
  if (considerations.bactericidalRequired) {
    requirements.push('Niveles séricos para aminoglucósidos/vancomicina');
  }
  
  return requirements;
}

function getSttewardshipGuidance(syndromeValue, resistanceData) {
  const guidance = {
    general: 'Descalamiento según cultivos y sensibilidades',
    duration: 'Duración mínima efectiva',
    route: 'Cambio a vía oral cuando sea clínicamente apropiado'
  };
  
  // Add specific guidance based on resistance patterns
  if (resistanceData.detectedPatterns?.length > 0) {
    guidance.resistance = 'Ajustar según patrones de resistencia detectados';
  }
  
  return guidance;
}

function extractRegimensFromContent(content) {
  const regimens = [];
  
  content.forEach(item => {
    if (item.type === 'regimen' || item.type === 'drugRegimen') {
      if (item.regimenData?.components) {
        regimens.push({
          type: item.regimenData.strengthOfRecommendation || 'Alternative',
          drugs: item.regimenData.components.map(comp => ({
            name: comp.drug,
            dose: comp.dose,
            route: comp.route,
            frequency: comp.frequency,
            duration: comp.duration
          })),
          notes: item.regimenData.notes,
          condition: item.regimenData.condition
        });
      }
    }
  });
  
  return regimens;
}

export default {
  getAntibiogramSyndromes,
  getSyndromeDetails,
  getSiteSpecificConsiderations,
  getEnhancedTreatmentRecommendations
};