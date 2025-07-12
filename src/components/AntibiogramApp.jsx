import React, { useState, useMemo, useEffect } from 'react';
import { 
    getBacteriaDatabase, 
    getSearchableList
} from '../data/microbiologyData.js';
import { getIntelligentTreatmentRecommendation } from '../utils/clinicalDecisionSupport.js';

// Shared syndrome categories definition
const SYNDROME_CATEGORIES = {
    'CNS': {
        label: 'Sistema Nervioso Central',
        color: 'bg-red-50 border-red-200',
        options: [
            { value: 'CNS_meningitis', label: 'Meningitis bacteriana', penetration: 'CNS_critical', severity: 3 },
            { value: 'CNS_encephalitis', label: 'Encefalitis', penetration: 'CNS_critical', severity: 3 },
            { value: 'CNS_brain_abscess', label: 'Absceso cerebral', penetration: 'CNS_critical', severity: 3 },
            { value: 'CNS_subdural_empyema', label: 'Empiema subdural', penetration: 'CNS_critical', severity: 3 }
        ]
    },
    'Cardiovascular': {
        label: 'Cardiovascular',
        color: 'bg-purple-50 border-purple-200',
        options: [
            { value: 'CV_endocarditis_native', label: 'Endocarditis válvula nativa', penetration: 'moderate', severity: 3 },
            { value: 'CV_endocarditis_prosthetic', label: 'Endocarditis válvula protésica', penetration: 'moderate', severity: 3 },
            { value: 'CV_endocarditis_CIED', label: 'Infección dispositivo cardiaco (CIED)', penetration: 'moderate', severity: 3 },
            { value: 'CV_pericarditis', label: 'Pericarditis bacteriana', penetration: 'moderate', severity: 2 },
            { value: 'CV_mycotic_aneurysm', label: 'Aneurisma micótico', penetration: 'moderate', severity: 3 }
        ]
    },
    'Respiratory': {
        label: 'Respiratorio',
        color: 'bg-blue-50 border-blue-200',
        options: [
            { value: 'RESP_CAP', label: 'Neumonía adquirida en comunidad (NAC)', penetration: 'good', severity: 2 },
            { value: 'RESP_HAP', label: 'Neumonía nosocomial (NAH)', penetration: 'good', severity: 2 },
            { value: 'RESP_VAP', label: 'Neumonía asociada a ventilador (NAV)', penetration: 'good', severity: 3 },
            { value: 'RESP_empyema', label: 'Empiema pleural', penetration: 'good', severity: 2 },
            { value: 'RESP_lung_abscess', label: 'Absceso pulmonar', penetration: 'good', severity: 2 },
            { value: 'RESP_bronchitis_acute', label: 'Bronquitis aguda', penetration: 'good', severity: 1 }
        ]
    },
    'GU': {
        label: 'Genitourinario',
        color: 'bg-green-50 border-green-200',
        options: [
            { value: 'GU_UTI_uncomplicated', label: 'ITU no complicada (mujer)', penetration: 'urinary_specific', severity: 1 },
            { value: 'GU_UTI_complicated', label: 'ITU complicada', penetration: 'systemic', severity: 2 },
            { value: 'GU_UTI_catheter', label: 'ITU asociada a catéter', penetration: 'systemic', severity: 2 },
            { value: 'GU_pyelonephritis', label: 'Pielonefritis aguda', penetration: 'systemic', severity: 2 },
            { value: 'GU_prostatitis_acute', label: 'Prostatitis aguda', penetration: 'prostate_specific', severity: 2 },
            { value: 'GU_prostatitis_chronic', label: 'Prostatitis crónica', penetration: 'prostate_specific', severity: 1 }
        ]
    },
    'Skin_Soft_Tissue': {
        label: 'Piel y Tejidos Blandos',
        color: 'bg-yellow-50 border-yellow-200',
        options: [
            { value: 'SST_cellulitis_simple', label: 'Celulitis simple', penetration: 'good', severity: 1 },
            { value: 'SST_cellulitis_severe', label: 'Celulitis severa/eritema', penetration: 'good', severity: 2 },
            { value: 'SST_necrotizing_fasciitis', label: 'Fascitis necrotizante', penetration: 'good', severity: 3 },
            { value: 'SST_abscess', label: 'Absceso cutáneo', penetration: 'good', severity: 1 },
            { value: 'SST_diabetic_foot', label: 'Pie diabético infectado', penetration: 'moderate', severity: 2 },
            { value: 'SST_surgical_site', label: 'Infección sitio quirúrgico', penetration: 'good', severity: 2 }
        ]
    },
    'Bone_Joint': {
        label: 'Hueso y Articulaciones',
        color: 'bg-orange-50 border-orange-200',
        options: [
            { value: 'BJ_osteomyelitis_acute', label: 'Osteomielitis aguda', penetration: 'bone_specific', severity: 2 },
            { value: 'BJ_osteomyelitis_chronic', label: 'Osteomielitis crónica', penetration: 'bone_specific', severity: 2 },
            { value: 'BJ_prosthetic_joint', label: 'Infección prótesis articular', penetration: 'bone_specific', severity: 2 },
            { value: 'BJ_septic_arthritis', label: 'Artritis séptica', penetration: 'good', severity: 2 },
            { value: 'BJ_vertebral_osteomyelitis', label: 'Osteomielitis vertebral', penetration: 'bone_specific', severity: 2 },
            { value: 'BJ_diabetic_foot_osteo', label: 'Osteomielitis pie diabético', penetration: 'bone_specific', severity: 2 }
        ]
    },
    'Intra_Abdominal': {
        label: 'Intraabdominal',
        color: 'bg-indigo-50 border-indigo-200',
        options: [
            { value: 'IA_peritonitis_secondary', label: 'Peritonitis secundaria', penetration: 'good', severity: 2 },
            { value: 'IA_peritonitis_primary', label: 'Peritonitis primaria/espontánea', penetration: 'good', severity: 2 },
            { value: 'IA_intra_abdominal', label: 'Infección intraabdominal complicada', penetration: 'good', severity: 2 },
            { value: 'IA_cholangitis', label: 'Colangitis', penetration: 'good', severity: 2 },
            { value: 'IA_liver_abscess', label: 'Absceso hepático', penetration: 'good', severity: 2 },
            { value: 'IA_appendicitis', label: 'Apendicitis complicada', penetration: 'good', severity: 2 }
        ]
    },
    'Bacteremia_Sepsis': {
        label: 'Bacteriemia y Sepsis',
        color: 'bg-red-50 border-red-200',
        options: [
            { value: 'BS_bacteremia_primary', label: 'Bacteriemia primaria', penetration: 'systemic', severity: 2 },
            { value: 'BS_CLABSI', label: 'Bacteriemia asociada a catéter central', penetration: 'systemic', severity: 2 },
            { value: 'BS_sepsis', label: 'Sepsis', penetration: 'systemic', severity: 3 },
            { value: 'BS_septic_shock', label: 'Shock séptico', penetration: 'systemic', severity: 3 },
            { value: 'BS_neutropenic_fever', label: 'Fiebre neutropénica', penetration: 'systemic', severity: 2 }
        ]
    }
};
import { antibioticsData } from '../data/antibiotics.js';

// --- HELPER COMPONENTS ---
const Card = ({ children, title }) => ( 
    <div className="bg-white shadow-2xl rounded-2xl overflow-hidden w-full max-w-4xl mx-auto">
        <div className="bg-gray-800 text-white p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
        </div>
        <div className="p-4 sm:p-8 space-y-6">
            {children}
        </div>
    </div>
);
const FormInput = ({ label, name, value, onChange, type = "number", placeholder, unit }) => (<div><label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label><div className="flex items-center"><input type={type} name={name} id={name} value={value} onChange={onChange} placeholder={placeholder} className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" min="0" step={type === 'number' ? '0.01' : undefined}/>{unit && <span className="ml-3 text-gray-500">{unit}</span>}</div></div>);
const FormSelect = ({ label, name, value, onChange, options, placeholder, required }) => (<div><label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label><select name={name} id={name} value={value} onChange={onChange} required={required} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"><option value="">{placeholder}</option>{options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div>);
const ProgressBar = ({ current, total }) => (<div className="w-full bg-gray-200 rounded-full h-2.5 mb-8"><div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${(current / total) * 100}%`, transition: 'width 0.5s ease-in-out' }}></div></div>);

// --- STEP COMPONENTS ---
const PatientDataStep = ({ data, onChange, calculations }) => (
    <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Datos del Paciente</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><FormInput label="Edad" name="age" value={data.age} onChange={onChange} unit="años" placeholder="e.g., 55" /><FormSelect label="Sexo" name="gender" value={data.gender} onChange={onChange} options={[{value: 'Female', label: "Femenino"}, {value: 'Male', label: "Masculino"}]} /><FormInput label="Peso" name="weight" value={data.weight} onChange={onChange} unit="kg" placeholder="e.g., 70" /><FormInput label="Talla" name="height" value={data.height} onChange={onChange} unit="cm" placeholder="e.g., 175" /></div>
        {data.gender === 'Female' && data.age >= 15 && data.age <= 50 && (<div className="mt-6 border-t pt-6"><label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" name="isPregnantOrFertile" checked={data.isPregnantOrFertile} onChange={onChange} className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500" /><span className="text-gray-800 font-medium">¿Paciente embarazada, en lactancia o en edad fértil?</span></label></div>)}
        <div className="mt-6 border-t pt-6"><h4 className="font-semibold text-gray-800">Función Renal</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2"><FormInput label="Creatinina Sérica" name="creatinine" value={data.creatinine} onChange={onChange} unit="mg/dL" placeholder="e.g., 1.2" />{data.age >= 18 && (<div><label className="flex items-center space-x-3 cursor-pointer mt-2"><input type="checkbox" name="useCystatinC" checked={data.useCystatinC} onChange={onChange} className="h-5 w-5 text-indigo-600 rounded" /><span className="font-medium">Usar Cistatina C</span></label>{data.useCystatinC && <FormInput label="Cistatina C" name="cystatinC" value={data.cystatinC} onChange={onChange} unit="mg/L" />}</div>)}<FormSelect label="Terapia de Reemplazo Renal" name="rrt" value={data.rrt} onChange={onChange} options={[{value: 'None', label:'Ninguna'},{value:'HD',label:'Hemodiálisis (HD)'},{value:'CRRT',label:'CRRT'},{value:'SLED',label:'SLED'},{value:'CAPD',label:'DPAC'}]} placeholder="-- Seleccione --" /></div></div>
        <div className="mt-6 border-t pt-6"><label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" name="hasHepaticDisease" checked={data.hasHepaticDisease} onChange={onChange} className="h-5 w-5 text-indigo-600 rounded" /><span className="font-medium">¿Enfermedad Hepática?</span></label></div>
        {data.hasHepaticDisease && (<div className="mt-4 p-4 bg-indigo-50 rounded-lg space-y-4 animate-fade-in"><h4 className="font-semibold text-indigo-800">Cálculo de Child-Pugh</h4><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><FormInput label="Bilirrubina Total" name="bilirubin" value={data.bilirubin} onChange={onChange} unit="mg/dL" /><FormInput label="Albúmina Sérica" name="albumin" value={data.albumin} onChange={onChange} unit="g/dL" /><FormInput label="INR" name="inr" value={data.inr} onChange={onChange} /><FormSelect label="Ascitis" name="ascites" value={data.ascites} onChange={onChange} options={[{value: 1, label: "Ninguna"}, {value: 2, label: "Leve"}, {value: 3, label: "Moderada/Severa"}]} /><FormSelect label="Encefalopatía" name="encephalopathy" value={data.encephalopathy} onChange={onChange} options={[{value: 1, label: "Ninguna"}, {value: 2, label: "Grado 1-2"}, {value: 3, label: "Grado 3-4"}]} /></div></div>)}
        <div className="mt-6 border-t pt-6">
            <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-800">Evaluación de Severidad Clínica</h4>
                <button 
                    type="button"
                    onClick={() => onChange({target: {name: 'showSeverityAssessment', type: 'checkbox', checked: !data.showSeverityAssessment}})}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                    {data.showSeverityAssessment ? 'Ocultar' : 'Mostrar'} evaluación avanzada
                </button>
            </div>
            <div className="mt-3 text-xs text-gray-600">
                <p><strong>Nota:</strong> La evaluación de severidad mejora la precisión de las recomendaciones mediante criterios objetivos específicos.</p>
            </div>
            {data.showSeverityAssessment && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg space-y-4 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Criterios de Severidad Objetivos</label>
                            <div className="space-y-2">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="isICU" 
                                        checked={data.isICU || false}
                                        onChange={onChange}
                                        className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500" 
                                    />
                                    <span className="text-sm font-medium text-gray-700">UCI o cuidados intensivos</span>
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="isImmunocompromised" 
                                        checked={data.isImmunocompromised || false}
                                        onChange={onChange}
                                        className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500" 
                                    />
                                    <span className="text-sm font-medium text-gray-700">Inmunocomprometido</span>
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="priorAntibiotics" 
                                        checked={data.priorAntibiotics || false}
                                        onChange={onChange}
                                        className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500" 
                                    />
                                    <span className="text-sm font-medium text-gray-700">Antibióticos previos (últimos 90 días)</span>
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="hasOrganDysfunction" 
                                        checked={data.hasOrganDysfunction || false}
                                        onChange={onChange}
                                        className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500" 
                                    />
                                    <span className="text-sm font-medium text-gray-700">Disfunción orgánica</span>
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="hasSepsis" 
                                        checked={data.hasSepsis || false}
                                        onChange={onChange}
                                        className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500" 
                                    />
                                    <span className="text-sm font-medium text-gray-700">Sepsis o shock séptico</span>
                                </label>
                            </div>
                        </div>
                        <div>
                            <FormSelect 
                                label="Estado Hemodinámico" 
                                name="hemodynamicStatus"
                                value={data.hemodynamicStatus}
                                onChange={onChange}
                                options={[
                                    {value: 'stable', label: 'Estable'},
                                    {value: 'hypotension', label: 'Hipotensión'},
                                    {value: 'shock', label: 'Shock/vasopresores'}
                                ]}
                                placeholder="-- Seleccione --"
                            />
                            <div className="mt-3">
                                <FormSelect 
                                    label="Función Respiratoria" 
                                    name="respiratoryStatus"
                                    value={data.respiratoryStatus}
                                    onChange={onChange}
                                    options={[
                                        {value: 'normal', label: 'Normal'},
                                        {value: 'oxygen', label: 'Oxígeno suplementario'},
                                        {value: 'mechanical', label: 'Ventilación mecánica'}
                                    ]}
                                    placeholder="-- Seleccione --"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
        <div className="mt-6 border-t pt-6">
            <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-800">Epidemiología Local</h4>
                <button 
                    type="button"
                    onClick={() => onChange({target: {name: 'showEpidemiologyData', type: 'checkbox', checked: !data.showEpidemiologyData}})}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                    {data.showEpidemiologyData ? 'Ocultar' : 'Personalizar'} datos epidemiológicos
                </button>
            </div>
            <div className="mt-3 text-xs text-gray-600">
                <p><strong>Nota:</strong> Los datos epidemiológicos locales mejoran la precisión de las recomendaciones. Si no se especifican, se utilizarán valores por defecto basados en literatura.</p>
            </div>
            {data.showEpidemiologyData && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg space-y-4 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormInput 
                            label="Tasa ESBL Local (%)" 
                            name="localESBLRate" 
                            value={data.localESBLRate}
                            onChange={onChange}
                            type="number"
                            placeholder="ej. 15"
                            unit="%"
                        />
                        <FormInput 
                            label="Resistencia a Carbapenémicos (%)" 
                            name="localCarbapenemResistance" 
                            value={data.localCarbapenemResistance}
                            onChange={onChange}
                            type="number"
                            placeholder="ej. 3"
                            unit="%"
                        />
                        <FormSelect 
                            label="Tipo de Institución"
                            name="institutionType"
                            value={data.institutionType}
                            onChange={onChange}
                            options={[
                                {value: 'community', label: 'Hospital Comunitario'},
                                {value: 'academic', label: 'Centro Académico'},
                                {value: 'tertiary', label: 'Centro de Referencia'}
                            ]}
                            placeholder="-- Seleccione tipo --"
                        />
                    </div>
                </div>
            )}
        </div>
        <div className="mt-8 p-6 bg-gray-50 rounded-lg space-y-3">
            <h4 className="text-lg font-semibold text-gray-700">Valores Calculados:</h4>
            <p><strong>TFG:</strong> {calculations.tfg ? `${calculations.tfg.value} mL/min/1.73m²` : 'N/A'} <span className="text-sm text-gray-500">({calculations.tfg ? calculations.tfg.formula : 'N/A'})</span></p>
            <p>
                <strong>IMC:</strong> {calculations.bmi ? `${calculations.bmi} kg/m²` : 'N/A'} 
                {calculations.bmiZScore !== null && (
                    <span className="text-sm text-blue-600 ml-2">
                        (Z-score: {calculations.bmiZScore.toFixed(2)})
                    </span>
                )}
                <br />
                <span className="text-sm text-gray-600">{calculations.obesityClass || 'N/A'}</span>
                {calculations.bmiZScore !== null && (
                    <>
                        <br />
                        <span className="text-xs text-blue-500">
                            📊 Clasificación pediátrica basada en estándares WHO con z-score edad/sexo específico
                        </span>
                    </>
                )}
            </p>
            {/* Additional WHO Growth Indicators for Children Under 5 */}
            {parseFloat(data.age) < 5 && parseFloat(data.age) > 0 && (
                <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                    <h5 className="text-sm font-semibold text-blue-800 mb-2">
                        📈 Indicadores de Crecimiento WHO (menores de 5 años)
                    </h5>
                    {calculations.heightForAgeZScore !== null && (
                        <p className="text-sm text-blue-700">
                            <strong>Talla para la edad:</strong> Z-score {calculations.heightForAgeZScore.toFixed(2)} 
                            <span className="ml-2 text-xs font-medium">
                                ({calculations.heightForAgeClass})
                            </span>
                        </p>
                    )}
                    {calculations.weightForAgeZScore !== null && (
                        <p className="text-sm text-blue-700 mt-1">
                            <strong>Peso para la edad:</strong> Z-score {calculations.weightForAgeZScore.toFixed(2)} 
                            <span className="ml-2 text-xs font-medium">
                                ({calculations.weightForAgeClass})
                            </span>
                        </p>
                    )}
                    <p className="text-xs text-blue-600 mt-2">
                        <strong>Nota:</strong> Los indicadores de crecimiento ayudan a identificar desnutrición, 
                        retraso en el crecimiento, y otros factores que pueden afectar el dosaje de antibióticos.
                    </p>
                </div>
            )}
            {data.hasHepaticDisease && <p><strong>Child-Pugh Score:</strong> {calculations.childPugh ? `${calculations.childPugh.score} (Clase ${calculations.childPugh.class})` : 'Datos incompletos'}</p>}
            {calculations.severityAssessment && (
                <div className="p-3 bg-yellow-100 rounded-md">
                    <p><strong>Severidad Clínica:</strong> {calculations.severityAssessment.level} (Puntuación: {calculations.severityAssessment.score})</p>
                    <p className="text-sm text-gray-600 mt-1">
                        <strong>Factores:</strong> {calculations.severityAssessment.factors.join(', ')}
                    </p>
                </div>
            )}
            {calculations.epidemiologyRisk && (
                <div className="p-3 bg-blue-100 rounded-md">
                    <p><strong>Riesgo Epidemiológico:</strong> {calculations.epidemiologyRisk.level}</p>
                    <p className="text-sm text-gray-600 mt-1">
                        <strong>Factores:</strong> {calculations.epidemiologyRisk.factors.join(', ')}
                    </p>
                </div>
            )}
        </div>
    </div>
);
const InfectionLocationStep = ({ data, onChange }) => {
    const [expandedCategory, setExpandedCategory] = useState(null);

    // Auto-expand category if syndrome is already selected
    useEffect(() => {
        if (data.location && data.location.includes('_')) {
            const categoryKey = Object.keys(SYNDROME_CATEGORIES).find(cat => 
                SYNDROME_CATEGORIES[cat].options.some(opt => opt.value === data.location)
            );
            if (categoryKey) {
                setExpandedCategory(categoryKey);
            }
        }
    }, [data.location]);

    return (
        <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Síndrome Infeccioso</h3>
            <p className="text-sm text-gray-600 mb-4">
                Seleccione el síndrome clínico específico para optimizar la interpretación del antibiograma, 
                requerimientos de penetración y recomendaciones de tratamiento.
            </p>
            
            {!data.location && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                        💡 <strong>Consejo:</strong> Haga clic en cualquier categoría anatómica para ver los síndromes específicos disponibles.
                    </p>
                </div>
            )}
            
            <div className="space-y-3">
                {Object.entries(SYNDROME_CATEGORIES).map(([categoryKey, category]) => {
                    const isExpanded = expandedCategory === categoryKey;
                    const isSelected = category.options.some(opt => opt.value === data.location);
                    
                    return (
                        <div key={categoryKey} className={`rounded-lg border transition-all duration-200 ${
                            isSelected ? `${category.color} border-2` : 
                            isExpanded ? `${category.color}` : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}>
                            <button
                                type="button"
                                onClick={() => setExpandedCategory(isExpanded ? null : categoryKey)}
                                className="w-full p-4 text-left flex items-center justify-between focus:outline-none"
                            >
                                <div className="flex items-center space-x-3">
                                    <h4 className="font-semibold text-gray-800">{category.label}</h4>
                                    {isSelected && (
                                        <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                                            Seleccionado
                                        </span>
                                    )}
                                </div>
                                <svg 
                                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                                        isExpanded ? 'rotate-180' : ''
                                    }`} 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            
                            {isExpanded && (
                                <div className="px-4 pb-4 animate-fade-in">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {category.options.map((option) => (
                                            <label key={option.value} className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-white hover:bg-opacity-60">
                                                <input
                                                    type="radio"
                                                    name="location"
                                                    value={option.value}
                                                    checked={data.location === option.value}
                                                    onChange={(e) => {
                                                        onChange(e);
                                                        // Keep category expanded when option is selected
                                                        setExpandedCategory(categoryKey);
                                                    }}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <div>
                                                    <span className="text-sm font-medium text-gray-800">{option.label}</span>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <span className={`text-xs px-2 py-1 rounded ${
                                                            option.severity === 3 ? 'bg-red-100 text-red-700' :
                                                            option.severity === 2 ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-green-100 text-green-700'
                                                        }`}>
                                                            Severidad: {option.severity === 3 ? 'Alta' : option.severity === 2 ? 'Moderada' : 'Leve'}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            Penetración: {
                                                                option.penetration === 'CNS_critical' ? 'Barrera hematoencefálica crítica' :
                                                                option.penetration === 'bone_specific' ? 'Penetración ósea específica' :
                                                                option.penetration === 'urinary_specific' ? 'Concentración urinaria' :
                                                                option.penetration === 'prostate_specific' ? 'Penetración prostática' :
                                                                option.penetration === 'systemic' ? 'Sistémica' : 'Buena'
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {data.location && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Consideraciones Clínicas</h4>
                    <div className="text-sm text-blue-700">
                        {SYNDROME_CATEGORIES[Object.keys(SYNDROME_CATEGORIES).find(cat => 
                            SYNDROME_CATEGORIES[cat].options.some(opt => opt.value === data.location)
                        )]?.options.find(opt => opt.value === data.location) && (() => {
                            const selectedSyndrome = SYNDROME_CATEGORIES[Object.keys(SYNDROME_CATEGORIES).find(cat => 
                                SYNDROME_CATEGORIES[cat].options.some(opt => opt.value === data.location)
                            )].options.find(opt => opt.value === data.location);
                            
                            const clinicalConsiderations = {
                                'CNS_meningitis': '• Penetración de barrera hematoencefálica esencial • Altas dosis requeridas • Actividad bactericida preferida',
                                'CNS_brain_abscess': '• Penetración de barrera hematoencefálica esencial • Tratamiento prolongado • Considerar drenaje quirúrgico',
                                'GU_UTI_uncomplicated': '• Concentración urinaria más importante que sérica • Considerar fosfomicina, nitrofurantoína • Duración corta (3 días)',
                                'GU_UTI_complicated': '• Penetración sistémica requerida • Descartar complicaciones estructurales • Duración 7-14 días',
                                'GU_prostatitis_acute': '• Penetración prostática esencial • Fluoroquinolonas, TMP-SMX preferidos • Duración 2-4 semanas',
                                'BJ_osteomyelitis_chronic': '• Penetración ósea esencial • Tratamiento prolongado (6-12 semanas) • Considerar terapia oral secuencial',
                                'BJ_prosthetic_joint': '• Actividad anti-biofilm importante • Combinaciones sinérgicas • Evaluar retención vs remoción',
                                'RESP_VAP': '• Cobertura anti-Pseudomonas • Resistencia nosocomial alta • Considerar terapia combinada',
                                'IA_peritonitis_secondary': '• Cobertura anaeróbica esencial • Infección polimicrobiana • Control quirúrgico del foco',
                                'BS_septic_shock': '• Inicio precoz (<1 hora) • Cobertura empírica amplia • Desescalamiento basado en cultivos'
                            };
                            
                            return clinicalConsiderations[selectedSyndrome.value] || '• Consideraciones específicas del síndrome seleccionado aplicarán';
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
};
const BacteriaSelectionStep = ({ data, onChange }) => { 
    const [searchTerm, setSearchTerm] = useState(''); 
    const [gramFilter, setGramFilter] = useState('');
    const [significanceFilter, setSignificanceFilter] = useState('');
    const searchableList = getSearchableList(); 
    
    const filteredBacteria = useMemo(() => {
        let results = searchableList;
        
        // Text search
        if (searchTerm) {
            results = results.filter(b => 
                b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.searchTerms.includes(searchTerm.toLowerCase())
            );
        }
        
        // Gram stain filter
        if (gramFilter) {
            results = results.filter(b => 
                b.gramStain.toLowerCase().includes(gramFilter.toLowerCase())
            );
        }
        
        // Clinical significance filter
        if (significanceFilter) {
            results = results.filter(b => 
                b.clinicalSignificance >= parseInt(significanceFilter)
            );
        }
        
        return results;
    }, [searchTerm, gramFilter, significanceFilter, searchableList]); 
    
    const handleSelectBacteria = (bacteriaId) => { 
        onChange({ target: { name: 'bacteriumId', value: bacteriaId } }); 
        setSearchTerm(''); 
    }; 
    
    const selectedBacterium = data.bacteriumId ? getBacteriaDatabase()[data.bacteriumId] : null; 
    
    const SignificanceBadge = ({ level }) => {
        const colors = {
            3: 'bg-red-100 text-red-800 border-red-300',
            2: 'bg-orange-100 text-orange-800 border-orange-300',
            1: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            0: 'bg-gray-100 text-gray-800 border-gray-300'
        };
        const labels = {
            3: 'Patógeno Primario',
            2: 'Oportunista',
            1: 'Colonizador',
            0: 'Contaminante'
        };
        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${colors[level]}`}>
                {labels[level]}
            </span>
        );
    };
    
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Identificación del Microorganismo</h3>
                
                {/* Search and Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="relative">
                        <input 
                            type="text" 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            placeholder="Buscar por nombre, características..." 
                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <FormSelect 
                        label="" 
                        name="gramFilter" 
                        value={gramFilter} 
                        onChange={(e) => setGramFilter(e.target.value)} 
                        options={[
                            {value: '', label: 'Todas las bacterias'},
                            {value: 'Gram-positive', label: 'Gram positivas'},
                            {value: 'Gram-negative', label: 'Gram negativas'}
                        ]} 
                        placeholder="Filtrar por Gram"
                    />
                    <FormSelect 
                        label="" 
                        name="significanceFilter" 
                        value={significanceFilter} 
                        onChange={(e) => setSignificanceFilter(e.target.value)} 
                        options={[
                            {value: '', label: 'Cualquier significancia'},
                            {value: '3', label: 'Solo patógenos primarios'},
                            {value: '2', label: 'Patógenos y oportunistas'},
                            {value: '1', label: 'Incluir colonizadores'}
                        ]} 
                        placeholder="Filtrar por relevancia clínica"
                    />
                </div>
                
                {/* Search Results */}
                {searchTerm && (
                    <div className="bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-y-auto">
                        {filteredBacteria.length > 0 ? filteredBacteria.map(b => (
                            <div 
                                key={b.id} 
                                onClick={() => handleSelectBacteria(b.id)} 
                                className="px-4 py-3 cursor-pointer hover:bg-indigo-50 border-b border-gray-100 last:border-b-0"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{b.name}</h4>
                                        <p className="text-sm text-gray-600">{b.gramStain} • {b.clsiCategory}</p>
                                        <p className="text-xs text-gray-500 mt-1">{b.taxonomy?.genus} {b.taxonomy?.species}</p>
                                    </div>
                                    <SignificanceBadge level={b.clinicalSignificance} />
                                </div>
                            </div>
                        )) : (
                            <div className="px-4 py-2 text-gray-500">No se encontraron resultados</div>
                        )}
                    </div>
                )}
            </div>
            
            {/* Selected Bacterium Details */}
            {selectedBacterium && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="bg-indigo-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-lg font-bold text-gray-900">{selectedBacterium.identity?.bacteriumName || selectedBacterium.name}</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    <strong>Taxonomía:</strong> {selectedBacterium.taxonomy?.genus} {selectedBacterium.taxonomy?.species}
                                </p>
                            </div>
                            <SignificanceBadge level={selectedBacterium.clinicalSignificance || 2} />
                        </div>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        {/* Laboratory Identification */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Gram Stain & Morphology */}
                            <div className="space-y-3">
                                <h5 className="font-semibold text-gray-800 flex items-center">
                                    🔬 Características Microscópicas
                                </h5>
                                <div className="bg-gray-50 p-3 rounded-md space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Tinción de Gram:</span>
                                        <span className="text-sm">{selectedBacterium.identity?.classification?.gramStain || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Morfología:</span>
                                        <span className="text-sm">{selectedBacterium.identity?.classification?.morphology || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Respiración:</span>
                                        <span className="text-sm">{selectedBacterium.identity?.classification?.respiration || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Biochemical Tests */}
                            <div className="space-y-3">
                                <h5 className="font-semibold text-gray-800 flex items-center">
                                    🧪 Pruebas Bioquímicas
                                </h5>
                                <div className="bg-gray-50 p-3 rounded-md space-y-1">
                                    {selectedBacterium.identity?.biochemicalTests ? (
                                        <div className="text-sm text-gray-600">
                                            {selectedBacterium.identity.biochemicalTests}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-500">No disponible</div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Clinical Information */}
                        <div className="space-y-3">
                            <h5 className="font-semibold text-gray-800 flex items-center">
                                📋 Información Clínica
                            </h5>
                            <div className="bg-gray-50 p-3 rounded-md">
                                <div className="text-sm text-gray-600">
                                    <strong>Categoría CLSI:</strong> {selectedBacterium.identity?.clsiCategory || 'N/A'}
                                </div>
                                <div className="text-sm text-gray-600 mt-2">
                                    <strong>Resumen:</strong> {selectedBacterium.clinicalProfile?.summary || 'No disponible'}
                                </div>
                            </div>
                        </div>
                        
                        {/* Clinical Information */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Infections */}
                            {selectedBacterium.clinicalProfile?.clinicalSyndromes && (
                                <div className="space-y-3">
                                    <h5 className="font-semibold text-gray-800 flex items-center">
                                        🦠 Síndromes Clínicos
                                    </h5>
                                    <div className="bg-blue-50 p-3 rounded-md">
                                        <ul className="text-sm space-y-1">
                                            {selectedBacterium.clinicalProfile.clinicalSyndromes.slice(0, 5).map((syndrome, idx) => (
                                                <li key={idx} className="text-blue-800">
                                                    • <strong>{syndrome.syndromeName}:</strong> {syndrome.description}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                            
                            {/* Resistance Mechanisms */}
                            {selectedBacterium.resistanceProfile?.majorMechanisms && (
                                <div className="space-y-3">
                                    <h5 className="font-semibold text-gray-800 flex items-center">
                                        🛡️ Mecanismos de Resistencia
                                    </h5>
                                    <div className="bg-orange-50 p-3 rounded-md">
                                        <ul className="text-sm space-y-1">
                                            {selectedBacterium.resistanceProfile.majorMechanisms.slice(0, 3).map((mechanism, idx) => (
                                                <li key={idx} className="text-orange-800">
                                                    • <strong>{mechanism.mechanismName}:</strong> {mechanism.description}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Intrinsic Resistance */}
                        {(selectedBacterium.resistanceProfile?.intrinsicResistance?.length > 0 || 
                          selectedBacterium.resistanceProfile?.groupIntrinsicResistance?.length > 0) && (
                            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
                                <h5 className="font-semibold text-yellow-800 mb-2">⚠️ Resistencia Intrínseca</h5>
                                <div className="space-y-3">
                                    {/* Group Intrinsic Resistance */}
                                    {selectedBacterium.resistanceProfile?.groupIntrinsicResistance?.length > 0 && (
                                        <div>
                                            <div className="text-xs font-medium text-yellow-800 mb-1">Resistencia de Grupo:</div>
                                            {selectedBacterium.resistanceProfile.groupIntrinsicResistance.map((resistance, index) => (
                                                <div key={`group-${index}`} className="text-sm text-yellow-700 pl-2">
                                                    <span className="font-medium">{resistance.drugOrClass}</span>
                                                    {resistance.notes && (
                                                        <div className="text-yellow-600 text-xs mt-1 ml-2">
                                                            📝 {resistance.notes}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    
                                    {/* Individual Intrinsic Resistance */}
                                    {selectedBacterium.resistanceProfile?.intrinsicResistance?.length > 0 && (
                                        <div>
                                            {selectedBacterium.resistanceProfile?.groupIntrinsicResistance?.length > 0 && (
                                                <div className="text-xs font-medium text-yellow-800 mb-1">Resistencia Específica:</div>
                                            )}
                                            {selectedBacterium.resistanceProfile.intrinsicResistance.map((resistance, index) => (
                                                <div key={`individual-${index}`} className="text-sm text-yellow-700 pl-2">
                                                    <span className="font-medium">{resistance.drugOrClass}</span>
                                                    {resistance.notes && (
                                                        <div className="text-yellow-600 text-xs mt-1 ml-2">
                                                            📝 {resistance.notes}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        {/* High Risk Populations */}
                        {selectedBacterium.clinicalProfile?.highRiskPopulations?.length > 0 && (
                            <div className="bg-gray-50 p-3 rounded-md">
                                <h5 className="font-semibold text-gray-800 mb-2">👥 Poblaciones de Alto Riesgo</h5>
                                <div className="text-sm text-gray-600">
                                    {selectedBacterium.clinicalProfile.highRiskPopulations.join(', ')}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
const AntibioticSusceptibilityStep = ({ data, onChange }) => { 
    const selectedBacteriumData = data.bacteriumId ? getBacteriaDatabase()[data.bacteriumId] : null; 
    if (!selectedBacteriumData) { 
        return <div className="text-center text-gray-600 p-4 bg-gray-100 rounded-md">Por favor, seleccione un microorganismo en el paso anterior.</div>; 
    } 
    
    
    const handleMICChange = (antibioticName, micValue) => {
        // Store MIC value and auto-interpret if possible
        const newMicValues = { ...data.micValues, [antibioticName]: micValue };
        onChange({ target: { name: 'micValues', value: newMicValues } });
        
        // Auto-interpret based on breakpoints if numeric MIC provided
        if (micValue && !isNaN(parseFloat(micValue))) {
            const numericMIC = parseFloat(micValue);
            const agent = antibiogramTiers.flatMap(tier => tier.agents).find(a => a.agentName === antibioticName);
            const breakpoint = agent?.breakpointSets?.[0]?.mic;
            
            if (breakpoint) {
                // Parse breakpoints more carefully, handling combination drugs (e.g., "≤ 8/4")
                const parseBreakpoint = (bpString) => {
                    if (!bpString) return NaN;
                    // Extract the numeric part, handling combination drugs
                    const cleanString = bpString.replace('≤ ', '').replace('≥ ', '').replace('> ', '');
                    // For combination drugs like "8/4", take the first number
                    const firstNumber = cleanString.split('/')[0];
                    return parseFloat(firstNumber);
                };
                
                const sBreakpoint = parseBreakpoint(breakpoint.s_breakpoint);
                const iBreakpoint = parseBreakpoint(breakpoint.i_breakpoint);
                const rBreakpoint = parseBreakpoint(breakpoint.r_breakpoint);
                
                let interpretation = 'I'; // Default to intermediate
                
                // Determine interpretation based on MIC and breakpoints
                if (!isNaN(sBreakpoint)) {
                    if (breakpoint.s_breakpoint.includes('≤') && numericMIC <= sBreakpoint) {
                        interpretation = 'S';
                    } else if (breakpoint.s_breakpoint.includes('≥') && numericMIC >= sBreakpoint) {
                        interpretation = 'S';
                    }
                }
                
                if (!isNaN(rBreakpoint) && interpretation !== 'S') {
                    if (breakpoint.r_breakpoint.includes('≥') && numericMIC >= rBreakpoint) {
                        interpretation = 'R';
                    } else if (breakpoint.r_breakpoint.includes('≤') && numericMIC <= rBreakpoint) {
                        interpretation = 'R';
                    }
                }
                
                // Handle intermediate range if specified
                if (!isNaN(iBreakpoint) && interpretation === 'I') {
                    // Keep as intermediate if within specified range
                    if (breakpoint.i_breakpoint && typeof breakpoint.i_breakpoint === 'string') {
                        // Handle ranges like "14–16" or single values like "16"
                        if (breakpoint.i_breakpoint.includes('–')) {
                            const [minI, maxI] = breakpoint.i_breakpoint.split('–').map(s => parseFloat(s.trim()));
                            if (numericMIC >= minI && numericMIC <= maxI) {
                                interpretation = 'I';
                            }
                        } else if (numericMIC === iBreakpoint) {
                            interpretation = 'I';
                        }
                    }
                }
                
                onChange({ target: { name: 'susceptibilityResults', value: { ...data.susceptibilityResults, [antibioticName]: interpretation } } });
            }
        }
    };
    
    const handleQuickInterpretation = (antibioticName, interpretation) => {
        // Set interpretation and show typical MIC range as placeholder
        const newMicValues = { ...data.micValues };
        delete newMicValues[antibioticName]; // Clear actual MIC value
        onChange({ target: { name: 'micValues', value: newMicValues } });
        onChange({ target: { name: 'susceptibilityResults', value: { ...data.susceptibilityResults, [antibioticName]: interpretation } } });
    };

    // Helper function to get typical MIC range for an interpretation
    const getMICRangeForInterpretation = (agent, interpretation) => {
        const breakpoint = agent?.breakpointSets?.[0]?.mic;
        if (!breakpoint) return '';
        
        switch (interpretation) {
            case 'S':
                return breakpoint.s_breakpoint || '';
            case 'I':
                return breakpoint.i_breakpoint || '';
            case 'R':
                return breakpoint.r_breakpoint || '';
            default:
                return '';
        }
    };

    // Helper function to get clinical significance from breakpoint comments
    const getClinicalSignificance = (agent) => {
        const breakpointSet = agent?.breakpointSets?.[0];
        if (!breakpointSet) return null;
        
        const comments = breakpointSet.comments || [];
        const condition = breakpointSet.condition || '';
        
        if (comments.length === 0 && !condition) return null;
        
        return {
            condition: condition !== 'Standard' ? condition : '',
            comments: comments
        };
    }; 
    
    // Group antibiotics by tier
    const antibiogramTiers = selectedBacteriumData.laboratoryProfile?.antimicrobialBreakpoints || [];
    
    // CLSI M100 Tier Unlocking Logic
    const getTierUnlockStatus = (tierNumber) => {
        if (tierNumber === 1) return true; // Tier 1 always unlocked
        
        // Get previous tier antibiotics and check resistance patterns
        const previousTiers = antibiogramTiers.filter(tier => tier.tier < tierNumber);
        
        // Check if there's significant resistance in previous tiers to warrant next tier testing
        let resistanceCount = 0;
        let totalCount = 0;
        
        for (const tier of previousTiers) {
            for (const agent of tier.agents) {
                const result = data.susceptibilityResults[agent.agentName];
                if (result) {
                    totalCount++;
                    if (result === 'R' || result === 'I') {
                        resistanceCount++;
                    }
                }
            }
        }
        
        // Unlock next tier if ≥50% resistance in previous tiers or specific key resistance patterns
        if (totalCount > 0) {
            const resistanceRate = resistanceCount / totalCount;
            
            // Specific CLSI M100 unlock conditions for Enterobacterales
            if (tierNumber === 2) {
                // Tier 2 unlocked if resistance to cephalosporins or aminoglycosides in Tier 1
                const tier1Resistance = ['Ceftriaxone', 'Ceftazidime', 'Cefepime', 'Gentamicin'].some(drug => 
                    data.susceptibilityResults[drug] === 'R'
                );
                return tier1Resistance || resistanceRate >= 0.5;
            }
            
            if (tierNumber === 3) {
                // Tier 3 unlocked if resistance to carbapenems or specific patterns suggesting ESBL/AmpC
                const carbapenemResistance = ['Meropenem', 'Imipenem', 'Ertapenem'].some(drug => 
                    data.susceptibilityResults[drug] === 'R'
                );
                const esblPattern = data.susceptibilityResults['Ceftazidime'] === 'R' && 
                                  data.susceptibilityResults['Ceftriaxone'] === 'R';
                return carbapenemResistance || esblPattern || resistanceRate >= 0.6;
            }
            
            if (tierNumber === 4) {
                // Tier 4 unlocked for extreme resistance patterns or specific MDR patterns
                const mdrPattern = resistanceRate >= 0.7;
                const carbapenemResistance = ['Meropenem', 'Imipenem'].every(drug => 
                    data.susceptibilityResults[drug] === 'R'
                );
                return mdrPattern || carbapenemResistance;
            }
        }
        
        return false;
    };

    // Helper function to get resistance pattern information
    const getResistancePatternInfo = () => {
        const bacteriumName = selectedBacteriumData.identity?.bacteriumName || selectedBacteriumData.name;
        const taxonomy = selectedBacteriumData.taxonomy;
        
        // Get intrinsic resistance patterns
        const intrinsicResistance = selectedBacteriumData.resistanceProfile?.intrinsicResistance || [];
        
        // Get common resistance mechanisms
        const resistanceMechanisms = selectedBacteriumData.resistanceProfile?.resistanceMechanisms || [];
        
        // Get epidemiological data
        const epidemiology = selectedBacteriumData.clinicalSignificance?.epidemiology || {};
        
        return {
            bacteriumName,
            taxonomy,
            intrinsicResistance,
            resistanceMechanisms,
            epidemiology
        };
    };

    const resistanceInfo = getResistancePatternInfo();
    
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Interpretación del Antibiograma Escalonado - {selectedBacteriumData.identity?.bacteriumName || selectedBacteriumData.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    Ingrese valores MIC (se interpreta automáticamente) o seleccione S/I/R directamente. Los niveles superiores se desbloquean según CLSI M100.
                </p>
            </div>

            {/* Pathogen-Specific Resistance Profile */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                    <span className="text-xl mr-2">🧬</span>
                    Perfil de Resistencia Específico del Patógeno
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Intrinsic Resistance */}
                    <div className="bg-white p-4 rounded-lg border">
                        <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                            <span className="text-orange-500 mr-2">🔒</span>
                            Resistencia Intrínseca
                        </h5>
                        {resistanceInfo.intrinsicResistance.length > 0 ? (
                            <div className="space-y-2">
                                {resistanceInfo.intrinsicResistance.map((resistance, idx) => (
                                    <div key={idx} className="flex items-center">
                                        <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                                        <span className="text-sm text-gray-700">{resistance.drugOrClass || resistance}</span>
                                    </div>
                                ))}
                                <div className="mt-3 p-2 bg-orange-50 rounded text-xs text-orange-700">
                                    💡 Estos antibióticos no son efectivos independientemente del resultado del antibiograma
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">Sin resistencia intrínseca conocida</p>
                        )}
                    </div>

                    {/* Resistance Mechanisms */}
                    <div className="bg-white p-4 rounded-lg border">
                        <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                            <span className="text-red-500 mr-2">⚙️</span>
                            Mecanismos de Resistencia Comunes
                        </h5>
                        {resistanceInfo.resistanceMechanisms.length > 0 ? (
                            <div className="space-y-2">
                                {resistanceInfo.resistanceMechanisms.slice(0, 3).map((mechanism, idx) => (
                                    <div key={idx} className="flex items-start">
                                        <span className="w-2 h-2 bg-red-400 rounded-full mr-2 mt-1"></span>
                                        <div>
                                            <span className="text-sm font-medium text-gray-800">{mechanism.mechanism}</span>
                                            {mechanism.description && (
                                                <div className="text-xs text-gray-600 mt-1">{mechanism.description}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-3 p-2 bg-red-50 rounded text-xs text-red-700">
                                    🔍 Considere estas resistencias al interpretar patrones inusuales
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">Información de mecanismos no disponible</p>
                        )}
                    </div>
                </div>

                {/* Epidemiological Context */}
                {resistanceInfo.epidemiology && Object.keys(resistanceInfo.epidemiology).length > 0 && (
                    <div className="mt-4 bg-white p-4 rounded-lg border">
                        <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                            <span className="text-teal-500 mr-2">📊</span>
                            Contexto Epidemiológico
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {resistanceInfo.epidemiology.prevalence && (
                                <div className="text-sm">
                                    <span className="font-medium text-gray-700">Prevalencia:</span>
                                    <span className="ml-2 text-gray-600">{resistanceInfo.epidemiology.prevalence}</span>
                                </div>
                            )}
                            {resistanceInfo.epidemiology.riskFactors && (
                                <div className="text-sm">
                                    <span className="font-medium text-gray-700">Factores de Riesgo:</span>
                                    <span className="ml-2 text-gray-600">{resistanceInfo.epidemiology.riskFactors}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Cross-Resistance Pattern Detection and Education */}
            <div className="bg-purple-50 rounded-lg border border-purple-200 p-6">
                <h4 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                    <span className="text-xl mr-2">🔗</span>
                    Detección de Patrones de Resistencia Cruzada
                </h4>
                
                <div className="space-y-4">
                    {/* ESBL Pattern Detection */}
                    {(() => {
                        const esblPattern = (
                            data.susceptibilityResults['Ceftriaxone'] === 'R' || 
                            data.susceptibilityResults['Ceftazidime'] === 'R' || 
                            data.susceptibilityResults['Cefotaxime'] === 'R'
                        );
                        
                        if (esblPattern) {
                            return (
                                <div className="bg-red-100 p-4 rounded-lg border border-red-300">
                                    <h5 className="font-semibold text-red-800 mb-2 flex items-center">
                                        <span className="text-red-500 mr-2">🧬</span>
                                        Patrón ESBL (Beta-lactamasa de Espectro Extendido) Detectado
                                    </h5>
                                    <div className="text-sm text-red-700 space-y-2">
                                        <p><strong>Resistencia cruzada implícita:</strong> Todas las penicilinas, cefalosporinas (1ra-4ta gen), y aztreonam</p>
                                        <p><strong>Opciones terapéuticas:</strong> Carbapenémicos, cefepime (si susceptible), piperacilina-tazobactam (evaluar con precaución)</p>
                                        <p><strong>Recomendación:</strong> Reportar como resistente a todos los beta-lactámicos excepto carbapenémicos</p>
                                    </div>
                                </div>
                            );
                        }
                    })()}

                    {/* Carbapenemase Pattern Detection */}
                    {(() => {
                        const carbapenemasePattern = (
                            data.susceptibilityResults['Meropenem'] === 'R' || 
                            data.susceptibilityResults['Imipenem'] === 'R' ||
                            data.susceptibilityResults['Ertapenem'] === 'R'
                        );
                        
                        if (carbapenemasePattern) {
                            return (
                                <div className="bg-red-100 p-4 rounded-lg border border-red-300">
                                    <h5 className="font-semibold text-red-800 mb-2 flex items-center">
                                        <span className="text-red-500 mr-2">🚨</span>
                                        Patrón de Resistencia a Carbapenémicos Detectado
                                    </h5>
                                    <div className="text-sm text-red-700 space-y-2">
                                        <p><strong>Resistencia cruzada implícita:</strong> Todos los beta-lactámicos (penicilinas, cefalosporinas, carbapenémicos)</p>
                                        <p><strong>Opciones terapéuticas:</strong> Colistina, ceftazidima-avibactam, meropenem-vaborbactam, fosfomicina (según pruebas)</p>
                                        <p><strong>Alerta de salud pública:</strong> Reportar inmediatamente al laboratorio de referencia</p>
                                    </div>
                                </div>
                            );
                        }
                    })()}

                    {/* AmpC Pattern Detection */}
                    {(() => {
                        const ampCPattern = (
                            (data.susceptibilityResults['Ceftriaxone'] === 'R' || data.susceptibilityResults['Ceftazidime'] === 'R') &&
                            data.susceptibilityResults['Cefepime'] === 'S' &&
                            (resistanceInfo.taxonomy?.family === 'Enterobacteriaceae' || resistanceInfo.bacteriumName?.includes('Enterobacter'))
                        );
                        
                        if (ampCPattern) {
                            return (
                                <div className="bg-orange-100 p-4 rounded-lg border border-orange-300">
                                    <h5 className="font-semibold text-orange-800 mb-2 flex items-center">
                                        <span className="text-orange-500 mr-2">⚠️</span>
                                        Patrón AmpC Cromosómica Detectado
                                    </h5>
                                    <div className="text-sm text-orange-700 space-y-2">
                                        <p><strong>Resistencia cruzada implícita:</strong> Ampicilina, amoxicilina-clavulánico, cefalosporinas 1ra-3ra gen</p>
                                        <p><strong>Opciones terapéuticas:</strong> Cefepime, carbapenémicos, fluoroquinolonas (si susceptible)</p>
                                        <p><strong>Precaución:</strong> Puede desarrollar resistencia inducible durante el tratamiento</p>
                                    </div>
                                </div>
                            );
                        }
                    })()}

                    {/* Fluoroquinolone Cross-Resistance */}
                    {(() => {
                        const fluoroquinolonePattern = (
                            data.susceptibilityResults['Ciprofloxacin'] === 'R' || 
                            data.susceptibilityResults['Levofloxacin'] === 'R'
                        );
                        
                        if (fluoroquinolonePattern) {
                            return (
                                <div className="bg-yellow-100 p-4 rounded-lg border border-yellow-300">
                                    <h5 className="font-semibold text-yellow-800 mb-2 flex items-center">
                                        <span className="text-yellow-500 mr-2">🔄</span>
                                        Resistencia Cruzada a Fluoroquinolonas
                                    </h5>
                                    <div className="text-sm text-yellow-700 space-y-2">
                                        <p><strong>Resistencia cruzada implícita:</strong> Alta probabilidad para todas las fluoroquinolonas</p>
                                        <p><strong>Recomendación:</strong> No probar fluoroquinolonas adicionales</p>
                                        <p><strong>Opciones alternativas:</strong> Beta-lactámicos, aminoglucósidos, otros según patrón</p>
                                    </div>
                                </div>
                            );
                        }
                    })()}

                    {/* MRSA Pattern Detection */}
                    {(() => {
                        const mrsaPattern = (
                            data.susceptibilityResults['Cefoxitin'] === 'R' ||
                            data.susceptibilityResults['Oxacillin'] === 'R'
                        ) && resistanceInfo.bacteriumName?.includes('Staphylococcus aureus');
                        
                        if (mrsaPattern) {
                            return (
                                <div className="bg-red-100 p-4 rounded-lg border border-red-300">
                                    <h5 className="font-semibold text-red-800 mb-2 flex items-center">
                                        <span className="text-red-500 mr-2">🦠</span>
                                        S. aureus Resistente a Meticilina (MRSA) Detectado
                                    </h5>
                                    <div className="text-sm text-red-700 space-y-2">
                                        <p><strong>Resistencia cruzada implícita:</strong> Todos los beta-lactámicos (excepto ceftarolina)</p>
                                        <p><strong>Opciones terapéuticas:</strong> Vancomicina, daptomicina, linezolid, ceftarolina</p>
                                        <p><strong>Recomendación:</strong> Reportar como resistente a todos los beta-lactámicos</p>
                                    </div>
                                </div>
                            );
                        }
                    })()}

                    {/* Educational Message when no patterns detected */}
                    {(() => {
                        const hasAnyResults = Object.keys(data.susceptibilityResults || {}).length > 0;
                        const hasPatterns = (
                            data.susceptibilityResults['Ceftriaxone'] === 'R' || 
                            data.susceptibilityResults['Ceftazidime'] === 'R' ||
                            data.susceptibilityResults['Meropenem'] === 'R' ||
                            data.susceptibilityResults['Ciprofloxacin'] === 'R' ||
                            data.susceptibilityResults['Cefoxitin'] === 'R'
                        );
                        
                        if (hasAnyResults && !hasPatterns) {
                            return (
                                <div className="bg-green-100 p-4 rounded-lg border border-green-300">
                                    <h5 className="font-semibold text-green-800 mb-2 flex items-center">
                                        <span className="text-green-500 mr-2">✅</span>
                                        No se detectaron patrones de resistencia cruzada
                                    </h5>
                                    <p className="text-sm text-green-700">
                                        Continue ingresando resultados. Los patrones de resistencia cruzada se detectarán automáticamente.
                                    </p>
                                </div>
                            );
                        }
                        
                        if (!hasAnyResults) {
                            return (
                                <div className="bg-blue-100 p-4 rounded-lg border border-blue-300">
                                    <h5 className="font-semibold text-blue-800 mb-2 flex items-center">
                                        <span className="text-blue-500 mr-2">📚</span>
                                        Sistema de Detección de Resistencia Cruzada
                                    </h5>
                                    <p className="text-sm text-blue-700">
                                        Este sistema detecta automáticamente patrones de resistencia cruzada como ESBL, AmpC, carbapenemasas, y MRSA. 
                                        Comience ingresando los resultados del antibiograma para obtener interpretaciones inteligentes.
                                    </p>
                                </div>
                            );
                        }
                    })()}
                </div>
            </div>

            {antibiogramTiers.map((tier, tierIdx) => {
                const isUnlocked = getTierUnlockStatus(tier.tier);
                
                return (
                    <div key={tierIdx} className={`rounded-lg border ${
                        isUnlocked 
                            ? 'border-indigo-200 bg-white shadow-sm' 
                            : 'border-gray-300 bg-gray-50 opacity-60'
                    } overflow-hidden`}>
                        {/* Tier Header */}
                        <div className={`px-6 py-4 border-b ${
                            isUnlocked 
                                ? 'bg-indigo-50 border-indigo-200' 
                                : 'bg-gray-100 border-gray-300'
                        }`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800">
                                        Tier {tier.tier} - {tier.tierDescription || 'Pruebas Rutinarias'}
                                    </h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {tier.tier === 1 && "Pruebas de primera línea (siempre disponibles)"}
                                        {tier.tier === 2 && "Se desbloquea con resistencia a cefalosporinas o aminoglucósidos"}
                                        {tier.tier === 3 && "Se desbloquea con resistencia a carbapenémicos o patrón ESBL"}
                                        {tier.tier === 4 && "Se desbloquea con resistencia extrema (MDR)"}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {isUnlocked ? (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                            🔓 Desbloqueado
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                                            🔒 Bloqueado
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Tier Content */}
                        <div className="p-4 sm:p-6">
                            {isUnlocked ? (
                                <div className="space-y-4">
                                    {tier.agents.map((agent, agentIdx) => {
                                        const antibioticName = agent.agentName;
                                        const interpretation = data.susceptibilityResults?.[antibioticName];
                                        const micValue = data.micValues?.[antibioticName];
                                        
                                        return (
                                            <div key={agentIdx} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                                                {/* Antibiotic Header */}
                                                <div className="flex flex-col space-y-3">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h5 className="text-lg font-semibold text-gray-900 mb-1">
                                                                {antibioticName}
                                                            </h5>
                                                            
                                                            {/* CLSI condition */}
                                                            {agent.breakpointSets?.[0]?.condition && agent.breakpointSets[0].condition !== 'Standard' && (
                                                                <div className="text-sm text-orange-600 mb-1 flex items-center">
                                                                    <span className="mr-1">📋</span>
                                                                    {agent.breakpointSets[0].condition}
                                                                </div>
                                                            )}
                                                            
                                                            {/* Clinical Significance */}
                                                            {(() => {
                                                                const clinicalSig = getClinicalSignificance(agent);
                                                                return clinicalSig && (clinicalSig.comments.length > 0 || clinicalSig.condition) && (
                                                                    <div className="text-sm text-blue-700 space-y-1 mb-2">
                                                                        {clinicalSig.condition && (
                                                                            <div className="text-orange-600 flex items-center">
                                                                                <span className="mr-1">📋</span>
                                                                                {clinicalSig.condition}
                                                                            </div>
                                                                        )}
                                                                        {clinicalSig.comments.map((comment, idx) => (
                                                                            <div key={idx} className="text-blue-600 flex items-center">
                                                                                <span className="mr-1">💡</span>
                                                                                {comment}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                );
                                                            })()}
                                                            
                                                            {/* Intrinsic Resistance Indicator */}
                                                            {(() => {
                                                                const intrinsicResistance = resistanceInfo.intrinsicResistance || [];
                                                                const isIntrinsicallyResistant = intrinsicResistance.some(resistance => {
                                                                    const drugName = resistance.drugOrClass || resistance;
                                                                    if (typeof drugName !== 'string') return false;
                                                                    return drugName.toLowerCase().includes(antibioticName.toLowerCase()) ||
                                                                           antibioticName.toLowerCase().includes(drugName.toLowerCase().replace(/[^a-z]/g, ''));
                                                                });
                                                                
                                                                if (isIntrinsicallyResistant) {
                                                                    return (
                                                                        <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200 flex items-center">
                                                                            <span className="mr-2">🔒</span>
                                                                            <span className="font-medium">Resistencia intrínseca - No reportar</span>
                                                                        </div>
                                                                    );
                                                                }
                                                            })()}
                                                            
                                                            {/* PK/PD indicator */}
                                                            {interpretation === 'S' && micValue && (
                                                                <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded border border-blue-200 flex items-center">
                                                                    <span className="mr-2">🎯</span>
                                                                    <span className="font-medium">PK/PD optimizable</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        {/* Current Result Status Indicator */}
                                                        {interpretation && (
                                                            <div className={`px-3 py-2 rounded-full text-sm font-bold border-2 ${
                                                                interpretation === 'S' ? 'bg-green-100 text-green-800 border-green-300'
                                                                : interpretation === 'SDD' ? 'bg-blue-100 text-blue-800 border-blue-300'
                                                                : interpretation === 'I' ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                                                : 'bg-red-100 text-red-800 border-red-300'
                                                            }`}>
                                                                {interpretation}
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Input Section */}
                                                    <div className="bg-gray-50 p-4 rounded-lg">
                                                        <div className="flex flex-col space-y-3">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Valor MIC (μg/mL)
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    placeholder={
                                                                        micValue 
                                                                            ? "Ingrese valor MIC" 
                                                                            : interpretation 
                                                                                ? `Rango típico: ${getMICRangeForInterpretation(agent, interpretation) || "Ver CLSI"}`
                                                                                : "Ej: ≤0.25, 4, >16"
                                                                    }
                                                                    value={micValue || ''}
                                                                    onChange={(e) => handleMICChange(antibioticName, e.target.value)}
                                                                    className="w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                                />
                                                            </div>
                                                            
                                                            <div className="flex items-center justify-center">
                                                                <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
                                                                    o seleccione interpretación directa
                                                                </span>
                                                            </div>
                                                            
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Interpretación Rápida
                                                                </label>
                                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                                    {['S', 'SDD', 'I', 'R'].map((interp) => {
                                                                        const intrinsicResistance = resistanceInfo.intrinsicResistance || [];
                                                                        const isIntrinsicallyResistant = intrinsicResistance.some(resistance => {
                                                                            const drugName = resistance.drugOrClass || resistance;
                                                                            if (typeof drugName !== 'string') return false;
                                                                            return drugName.toLowerCase().includes(antibioticName.toLowerCase()) ||
                                                                                   antibioticName.toLowerCase().includes(drugName.toLowerCase().replace(/[^a-z]/g, ''));
                                                                        });
                                                                        
                                                                        const isDisabled = isIntrinsicallyResistant && (interp === 'S' || interp === 'SDD' || interp === 'I');
                                                                        
                                                                        return (
                                                                            <button
                                                                                key={interp}
                                                                                onClick={() => !isDisabled && handleQuickInterpretation(antibioticName, interp)}
                                                                                disabled={isDisabled}
                                                                                className={`px-4 py-3 text-base font-semibold rounded-md transition-all duration-200 ${
                                                                                    isDisabled 
                                                                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-2 border-gray-300'
                                                                                        : interpretation === interp
                                                                                            ? interp === 'S' ? 'bg-green-600 text-white border-2 border-green-600 shadow-lg'
                                                                                              : interp === 'SDD' ? 'bg-blue-600 text-white border-2 border-blue-600 shadow-lg'
                                                                                              : interp === 'I' ? 'bg-yellow-500 text-white border-2 border-yellow-500 shadow-lg'
                                                                                              : 'bg-red-600 text-white border-2 border-red-600 shadow-lg'
                                                                                            : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-300 hover:border-gray-400'
                                                                                }`}
                                                                                title={isDisabled ? 'Resistencia intrínseca - No seleccionar' : `Marcar como ${interp}`}
                                                                            >
                                                                                <div className="text-center">
                                                                                    <div className="font-bold">{interp}</div>
                                                                                    <div className="text-xs mt-1">
                                                                                        {interp === 'S' && 'Sensible'}
                                                                                        {interp === 'SDD' && 'Dosis Dependiente'}
                                                                                        {interp === 'I' && 'Intermedio'}
                                                                                        {interp === 'R' && 'Resistente'}
                                                                                    </div>
                                                                                </div>
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-gray-400 text-lg mb-2">🔒</div>
                                    <p className="text-gray-500 text-sm">
                                        Complete las pruebas de Tier {tier.tier - 1} para desbloquear este nivel
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
const HypersensitivityStep = ({ data, onChange }) => { const allergies = ["Penicilinas", "Cefalosporinas", "Carbapenémicos", "Quinolonas", "Sulfas", "Macrólidos", "Glicopéptidos", "Aminoglucósidos", "Lincosamidas"]; return (<div><h3 className="text-xl font-semibold text-gray-800 mb-4">Hipersensibilidad del Paciente</h3><fieldset className="space-y-2"><legend className="text-base font-medium text-gray-900">Marque las alergias conocidas:</legend>{allergies.map(allergy => (<div key={allergy} className="relative flex items-start"><div className="flex items-center h-5"><input id={allergy} name="hypersensitivities" type="checkbox" value={allergy} checked={data.hypersensitivities.includes(allergy)} onChange={onChange} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"/></div><div className="ml-3 text-sm"><label htmlFor={allergy} className="font-medium text-gray-700">{allergy}</label></div></div>))}</fieldset></div>);};
const RecommendationStep = ({ data, calculations, recommendation, alternatives, clinicalAnalysis }) => {
    const [copySuccess, setCopySuccess] = useState('');
    const [treatmentCopySuccess, setTreatmentCopySuccess] = useState('');
    // Helper function to get full infection name
    const getInfectionName = (locationValue) => {
        // Use the shared syndrome categories to avoid duplication
        for (const category of Object.values(SYNDROME_CATEGORIES)) {
            const option = category.options.find(opt => opt.value === locationValue);
            if (option) {
                return option.label;
            }
        }
        return locationValue || 'No especificada';
    };

    const handleCopy = () => {
        const bacterium = data.bacteriumId ? getBacteriaDatabase()[data.bacteriumId] : null;
        const bacteriumName = bacterium ? (bacterium.identity?.bacteriumName || bacterium.name) : 'No especificado';
        const infectionName = getInfectionName(data.location);
        
        // Build enhanced clinical summary
        let clinicalFactors = [];
        
        // Renal information
        if (data.rrt && data.rrt !== 'None') {
            clinicalFactors.push(`TRR: ${data.rrt}`);
        }
        
        // Hepatic disease
        if (data.hasHepaticDisease) {
            const childPughInfo = calculations.childPugh ? `Child-Pugh ${calculations.childPugh.score} (Clase ${calculations.childPugh.class})` : 'Datos incompletos';
            clinicalFactors.push(`Enf. Hepática: ${childPughInfo}`);
        }
        
        // Pregnancy status
        if (data.isPregnantOrFertile) {
            clinicalFactors.push('Embarazo/Fertilidad: Sí');
        }
        
        // Severity factors
        if (data.showSeverityAssessment) {
            let severityFactors = [];
            if (data.isICU) severityFactors.push('UCI');
            if (data.isImmunocompromised) severityFactors.push('Inmunocomprometido');
            if (data.priorAntibiotics) severityFactors.push('ATB previos');
            if (data.hasOrganDysfunction) severityFactors.push('Disfunción orgánica');
            if (data.hasSepsis) severityFactors.push('Sepsis');
            if (data.hemodynamicStatus) severityFactors.push(`Estado hemodinámico: ${data.hemodynamicStatus}`);
            if (data.respiratoryStatus) severityFactors.push(`Estado respiratorio: ${data.respiratoryStatus}`);
            
            if (severityFactors.length > 0) {
                clinicalFactors.push(`Severidad: ${severityFactors.join(', ')}`);
            }
        }
        
        // Epidemiological data
        if (data.showEpidemiologyData) {
            let epidemFactors = [];
            if (data.localESBLRate) epidemFactors.push(`ESBL local: ${data.localESBLRate}%`);
            if (data.localCarbapenemResistance) epidemFactors.push(`Carbapenem resist. local: ${data.localCarbapenemResistance}%`);
            if (data.institutionType) epidemFactors.push(`Institución: ${data.institutionType}`);
            
            if (epidemFactors.length > 0) {
                clinicalFactors.push(`Epidemiología: ${epidemFactors.join(', ')}`);
            }
        }
        
        const clinicalSection = clinicalFactors.length > 0 ? `\nFACTORES CLÍNICOS:\n  - ${clinicalFactors.join('\n  - ')}\n` : '\n';
        
        const textToCopy = `** RESUMEN DE CASO CLÍNICO **\n---------------------------------\nPACIENTE: ${data.age||'N/A'} años, Sexo: ${data.gender === 'Female' ? 'Femenino' : 'Masculino'}, ${data.weight||'N/A'} kg, ${data.height||'N/A'} cm.\nCÁLCULOS:\n  - TFG: ${calculations.tfg?`${calculations.tfg.value} mL/min/1.73m² (${calculations.tfg.formula})`:'N/A'}\n  - IMC: ${calculations.bmi||'N/A'} (${calculations.obesityClass||'N/A'})${clinicalSection}---------------------------------\nINFECCIÓN:\n  - Localización: ${infectionName}\n  - Microorganismo: ${bacteriumName}\n---------------------------------\nRESULTADOS:\n  - Alergias: ${data.hypersensitivities.length>0?data.hypersensitivities.join(', '):'Ninguna'}.\n  - TRATAMIENTO RECOMENDADO: ${recommendation.antibiotic||'Ninguno adecuado'} (${recommendation.tier||'N/A'})\n  - Alternativas viables: ${alternatives.length > 0 ? alternatives.join(', ') : 'Ninguna'}\n---------------------------------`;
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = 'fixed'; textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus(); textArea.select();
        try { document.execCommand('copy'); setCopySuccess('Copiado!'); setTimeout(() => setCopySuccess(''), 2000); } catch { setCopySuccess('Error'); }
        document.body.removeChild(textArea);
    };

    const recAbxData = recommendation.antibiotic ? antibioticsData[recommendation.antibiotic] : null;
    // Use dose from JSON structure if available, otherwise fall back to antibioticsData
    const recommendedDosage = recommendation.dose ? 
        `${recommendation.dose} ${recommendation.route || 'IV'} ${recommendation.frequency || ''}${recommendation.comments ? ` - ${recommendation.comments}` : ''}` :
        (recAbxData ? (data.age < 18 ? recAbxData.pediatricDosage : recAbxData.adultDosage) : "N/A");

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-gray-800">Resumen y Recomendación Automática</h3>
                <button 
                    onClick={handleCopy} 
                    className="flex items-center gap-2 bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-300"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {copySuccess || 'Copiar Resumen'}
                </button>
            </div>
             <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md space-y-3">
                <h4 className="font-bold text-blue-800">Resumen del Caso Completo</h4>
                <p><strong>Paciente:</strong> {data.age || 'N/A'} años, Sexo: {data.gender === 'Female' ? 'Femenino' : 'Masculino'}, {data.weight || 'N/A'} kg, {data.height || 'N/A'} cm.</p>
                <p><strong>Valores Calculados:</strong> TFG: {calculations.tfg ? `${calculations.tfg.value} mL/min/1.73m²` : 'N/A'} ({calculations.tfg ? calculations.tfg.formula : 'N/A'}), IMC: {calculations.bmi || 'N/A'} ({calculations.obesityClass || 'N/A'}).</p>
                
                {/* Renal Replacement Therapy */}
                {data.rrt && data.rrt !== 'None' && <p><strong>Terapia de Reemplazo Renal:</strong> {data.rrt}</p>}
                
                {/* Hepatic Disease */}
                {data.hasHepaticDisease && <p><strong>Enf. Hepática:</strong> Child-Pugh {calculations.childPugh ? `${calculations.childPugh.score} (Clase ${calculations.childPugh.class})` : 'Datos incompletos'}</p>}
                
                {/* Pregnancy/Fertility */}
                {data.isPregnantOrFertile && <p><strong>Embarazo/Fertilidad:</strong> Consideraciones especiales requeridas</p>}
                
                {/* Severity Assessment */}
                {data.showSeverityAssessment && (() => {
                    let severityFactors = [];
                    if (data.isICU) severityFactors.push('UCI');
                    if (data.isImmunocompromised) severityFactors.push('Inmunocomprometido');
                    if (data.priorAntibiotics) severityFactors.push('ATB previos');
                    if (data.hasOrganDysfunction) severityFactors.push('Disfunción orgánica');
                    if (data.hasSepsis) severityFactors.push('Sepsis');
                    if (data.hemodynamicStatus) severityFactors.push(`Est. hemodinámico: ${data.hemodynamicStatus}`);
                    if (data.respiratoryStatus) severityFactors.push(`Est. respiratorio: ${data.respiratoryStatus}`);
                    
                    return severityFactors.length > 0 ? <p><strong>Factores de Severidad:</strong> {severityFactors.join(', ')}</p> : null;
                })()}
                
                {/* Epidemiological Data */}
                {data.showEpidemiologyData && (() => {
                    let epidemFactors = [];
                    if (data.localESBLRate) epidemFactors.push(`ESBL local: ${data.localESBLRate}%`);
                    if (data.localCarbapenemResistance) epidemFactors.push(`Carbapenem resistencia local: ${data.localCarbapenemResistance}%`);
                    if (data.institutionType) epidemFactors.push(`Institución: ${data.institutionType}`);
                    
                    return epidemFactors.length > 0 ? <p><strong>Datos Epidemiológicos:</strong> {epidemFactors.join(', ')}</p> : null;
                })()}
                
                <p><strong>Infección:</strong> {getInfectionName(data.location)}.</p>
                <p><strong>Microorganismo:</strong> {data.bacteriumId ? (getBacteriaDatabase()[data.bacteriumId].identity?.bacteriumName || getBacteriaDatabase()[data.bacteriumId].name) : 'No especificado'}.</p>
                <p><strong>Alergias:</strong> {data.hypersensitivities.length > 0 ? data.hypersensitivities.join(', ') : 'Ninguna reportada'}.</p>
            </div>
            <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200">
                <div className="flex justify-between items-start">
                    <h4 className="text-lg font-semibold text-indigo-800">Tratamiento Sugerido por Guía</h4>
                    {recommendation.antibiotic && (
                        <button
                            onClick={() => {
                                const treatmentText = `${recommendation.antibiotic}\n${recommendation.tier}\n${recommendedDosage}`;
                                navigator.clipboard.writeText(treatmentText).then(() => {
                                    setTreatmentCopySuccess('¡Copiado!');
                                    setTimeout(() => setTreatmentCopySuccess(''), 2000);
                                }).catch(() => {
                                    setTreatmentCopySuccess('Error');
                                    setTimeout(() => setTreatmentCopySuccess(''), 2000);
                                });
                            }}
                            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                                treatmentCopySuccess 
                                    ? treatmentCopySuccess === 'Error' 
                                        ? 'bg-red-600 text-white' 
                                        : 'bg-green-600 text-white'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                            }`}
                            title="Copiar tratamiento"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            {treatmentCopySuccess || 'Copiar'}
                        </button>
                    )}
                </div>
                {recommendation.antibiotic ? (
                    <div>
                        <p className="text-2xl font-bold text-indigo-600 mt-2">{recommendation.antibiotic}</p>
                        <p className="text-sm font-medium text-indigo-700">{recommendation.tier}</p>
                        {recommendation.context?.condition && (
                            <p className="text-sm text-gray-700 mt-1">
                                <span className="font-semibold">Contexto Clínico:</span> {recommendation.context.condition}
                            </p>
                        )}
                        <p className="text-md text-gray-800 mt-2">
                            <span className='font-semibold'>Dosis Sugerida:</span> {recommendedDosage}
                        </p>
                        {recommendation.regimenNotes && recommendation.regimenNotes.length > 0 && (
                            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                                <p className="text-sm font-semibold text-yellow-800">Notas Importantes:</p>
                                {recommendation.regimenNotes.map((note, index) => (
                                    <p key={index} className="text-xs text-yellow-700 mt-1">• {note}</p>
                                ))}
                            </div>
                        )}
                        <p className="text-xs text-gray-600 mt-1">La duración del tratamiento es una decisión clínica.</p>
                    </div>
                ) : (
                    <p className="text-lg font-semibold text-red-600 mt-2">{recommendation.tier}</p>
                )}
            </div>
            {recAbxData && (
                 <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-3">
                    <h4 className="text-lg font-semibold text-gray-800">Detalles Adicionales del Fármaco Recomendado</h4>
                    <div><strong>Ajuste Renal:</strong> {recAbxData.renalAdjustment}</div>
                    <div><strong>Ajuste Hepático:</strong> {recAbxData.hepaticAdjustment}</div>
                    {data.isPregnantOrFertile && <div><strong>Riesgo en Embarazo:</strong><span className="font-bold ml-2">{recAbxData.pregnancyRisk}</span></div>}
                </div>
            )}
             <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800">Posibles Alternativas Terapéuticas</h4>
                {alternatives.length > 0 ? (<p className="text-gray-600 mt-2">Otras opciones sensibles y sin contraindicación por alergia incluyen: <span className="font-semibold">{alternatives.join(', ')}</span>.</p>) : (<p className="text-gray-500 mt-2">No se encontraron otras alternativas viables en el panel probado.</p>)}
            </div>
            {data.bacteriumId && getBacteriaDatabase()[data.bacteriumId]?.treatment?.generalNotes && (
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <h4 className="text-lg font-semibold text-blue-800">Notas Generales de Tratamiento</h4>
                    <div className="mt-2 space-y-2">
                        {getBacteriaDatabase()[data.bacteriumId].treatment.generalNotes.map((note, index) => (
                            <p key={index} className="text-sm text-blue-700">• {note}</p>
                        ))}
                    </div>
                </div>
            )}
            {clinicalAnalysis && (
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <h4 className="text-lg font-semibold text-green-800">Análisis Clínico Inteligente</h4>
                    <div className="mt-3 space-y-3">
                        {recommendation.clinicalRationale && (
                            <div>
                                <p className="text-sm font-semibold text-green-700">Justificación Clínica:</p>
                                <p className="text-sm text-green-600">{recommendation.clinicalRationale}</p>
                            </div>
                        )}
                        {recommendation.severityAssessment && (
                            <div>
                                <p className="text-sm font-semibold text-green-700">Evaluación de Severidad:</p>
                                <p className="text-sm text-green-600">
                                    {recommendation.severityAssessment.levelName} (Puntuación: {recommendation.severityAssessment.score})
                                </p>
                            </div>
                        )}
                        {recommendation.resistanceAssessment && (
                            <div>
                                <p className="text-sm font-semibold text-green-700">Mecanismos de Resistencia Detectados:</p>
                                <p className="text-sm text-green-600">{recommendation.resistanceAssessment.summary}</p>
                                {(recommendation.resistanceAssessment.esbl.suspected || 
                                  recommendation.resistanceAssessment.ampC.suspected || 
                                  recommendation.resistanceAssessment.carbapenemase.suspected) && (
                                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                                        <p className="text-xs font-semibold text-yellow-800">Alertas de Resistencia:</p>
                                        {recommendation.resistanceAssessment.esbl.suspected && (
                                            <p className="text-xs text-yellow-700">• ESBL detectado - {recommendation.resistanceAssessment.esbl.implications}</p>
                                        )}
                                        {recommendation.resistanceAssessment.ampC.suspected && (
                                            <p className="text-xs text-yellow-700">• AmpC detectado - {recommendation.resistanceAssessment.ampC.implications}</p>
                                        )}
                                        {recommendation.resistanceAssessment.carbapenemase.suspected && (
                                            <p className="text-xs text-yellow-700">• Carbapenemasa detectada - {recommendation.resistanceAssessment.carbapenemase.implications}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* Stewardship Guidelines */}
            <div className="p-4 rounded-lg bg-teal-50 border border-teal-200">
                <h4 className="text-lg font-semibold text-teal-800 mb-4 flex items-center">
                    <span className="text-xl mr-2">🛡️</span>
                    Principios de Stewardship Antimicrobiano
                </h4>
                
                <div className="space-y-4">
                    {/* De-escalation Recommendations */}
                    <div className="bg-white p-4 rounded-lg border">
                        <h5 className="font-semibold text-teal-700 mb-2 flex items-center">
                            <span className="text-teal-500 mr-2">🎯</span>
                            Recomendaciones de De-escalación
                        </h5>
                        <div className="text-sm text-teal-600 space-y-2">
                            {(() => {
                                const hasESBL = data.susceptibilityResults['Ceftriaxone'] === 'R' || data.susceptibilityResults['Ceftazidime'] === 'R';
                                const hasCarbapenemResistance = data.susceptibilityResults['Meropenem'] === 'R' || data.susceptibilityResults['Imipenem'] === 'R';
                                const hasNarrowSpectrumOptions = data.susceptibilityResults['Ampicillin'] === 'S' || data.susceptibilityResults['Penicillin'] === 'S';
                                
                                if (hasCarbapenemResistance) {
                                    return (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded">
                                            <p className="text-red-700 font-medium">⚠️ Resistencia a carbapenémicos detectada</p>
                                            <p className="text-red-600 text-xs mt-1">
                                                • Consultar con infectología para terapia combinada<br/>
                                                • Considerar colistina, ceftazidima-avibactam o fosfomicina<br/>
                                                • Evaluar necesidad de aislamiento de contacto
                                            </p>
                                        </div>
                                    );
                                } else if (hasESBL) {
                                    return (
                                        <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                                            <p className="text-orange-700 font-medium">🧬 Patrón ESBL detectado</p>
                                            <p className="text-orange-600 text-xs mt-1">
                                                • Evitar cefalosporinas y piperacilina-tazobactam<br/>
                                                • Priorizar carbapenémicos para infecciones graves<br/>
                                                • Considerar fosfomicina o nitrofurantoína para ITU
                                            </p>
                                        </div>
                                    );
                                } else if (hasNarrowSpectrumOptions) {
                                    return (
                                        <div className="p-3 bg-green-50 border border-green-200 rounded">
                                            <p className="text-green-700 font-medium">✅ Opciones de espectro estrecho disponibles</p>
                                            <p className="text-green-600 text-xs mt-1">
                                                • Priorizar agentes de espectro estrecho cuando sea posible<br/>
                                                • Evitar uso innecesario de carbapenémicos<br/>
                                                • Considerar cambio a vía oral cuando sea apropiado
                                            </p>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                                            <p className="text-blue-700 font-medium">📋 Evaluación de de-escalación</p>
                                            <p className="text-blue-600 text-xs mt-1">
                                                • Revisar resultados de susceptibilidad completamente<br/>
                                                • Evaluar evolución clínica a las 48-72 horas<br/>
                                                • Considerar cambio a agente más específico si es posible
                                            </p>
                                        </div>
                                    );
                                }
                            })()}
                        </div>
                    </div>

                    {/* Duration and Monitoring */}
                    <div className="bg-white p-4 rounded-lg border">
                        <h5 className="font-semibold text-teal-700 mb-2 flex items-center">
                            <span className="text-teal-500 mr-2">⏱️</span>
                            Duración y Monitoreo
                        </h5>
                        <div className="text-sm text-teal-600 space-y-2">
                            <p>• <strong>Duración:</strong> Usar la menor duración efectiva según guías clínicas</p>
                            <p>• <strong>Monitoreo:</strong> Evaluar respuesta clínica y microbiológica</p>
                            <p>• <strong>Revisión:</strong> Reevaluar necesidad de antibiótico cada 48-72 horas</p>
                            {recAbxData?.therapeuticDrugMonitoring && (
                                <p>• <strong>Niveles:</strong> {recAbxData.therapeuticDrugMonitoring.monitoring} (Objetivo: {recAbxData.therapeuticDrugMonitoring.target})</p>
                            )}
                        </div>
                    </div>

                    {/* Combination Therapy Considerations */}
                    {(() => {
                        const needsCombinationTherapy = (
                            data.susceptibilityResults['Meropenem'] === 'R' || 
                            data.susceptibilityResults['Imipenem'] === 'R' ||
                            data.location?.includes('Endocarditis') ||
                            data.location?.includes('Meningitis') ||
                            data.isICU
                        );
                        
                        if (needsCombinationTherapy) {
                            return (
                                <div className="bg-white p-4 rounded-lg border">
                                    <h5 className="font-semibold text-teal-700 mb-2 flex items-center">
                                        <span className="text-teal-500 mr-2">🔄</span>
                                        Consideraciones de Terapia Combinada
                                    </h5>
                                    <div className="text-sm text-teal-600 space-y-2">
                                        <p>• <strong>Indicaciones:</strong> Infección grave, resistencia extrema, o sinergia requerida</p>
                                        <p>• <strong>Evaluación:</strong> Evaluar beneficio vs. riesgo de toxicidad</p>
                                        <p>• <strong>Monitoreo:</strong> Seguimiento estrecho de efectos adversos</p>
                                        <p>• <strong>Duración:</strong> Limitar al período mínimo necesario</p>
                                    </div>
                                </div>
                            );
                        }
                    })()}

                    {/* Resistance Prevention */}
                    <div className="bg-white p-4 rounded-lg border">
                        <h5 className="font-semibold text-teal-700 mb-2 flex items-center">
                            <span className="text-teal-500 mr-2">🔒</span>
                            Prevención de Resistencia
                        </h5>
                        <div className="text-sm text-teal-600 space-y-2">
                            <p>• <strong>Dosis óptima:</strong> Usar dosis máximas recomendadas para infecciones graves</p>
                            <p>• <strong>Cumplimiento:</strong> Asegurar adherencia completa al tratamiento</p>
                            <p>• <strong>Combinaciones:</strong> Evitar monoterapia en infecciones por P. aeruginosa grave</p>
                            <p>• <strong>Rotación:</strong> Considerar políticas de rotación de antibióticos institucionales</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- MAIN APP ---
const AntibiogramApp = ({ onBackToLanding }) => {
    const [formData, setFormData] = useState({age: '', weight: '', height: '', creatinine: '', gender: 'Female', useCystatinC: false, cystatinC: '', isPregnantOrFertile: false, hasHepaticDisease: false, bilirubin: '', albumin: '', inr: '1', ascites: '1', encephalopathy: '1', location: '', rrt: 'None', bacteriumId: '', susceptibilityResults: {}, micValues: {}, hypersensitivities: [], showSeverityAssessment: false, isICU: false, isImmunocompromised: false, priorAntibiotics: false, hasOrganDysfunction: false, hasSepsis: false, hemodynamicStatus: '', respiratoryStatus: '', showEpidemiologyData: false, localESBLRate: '', localCarbapenemResistance: '', institutionType: ''});
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 6;
    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
    const resetForm = () => { setFormData({age: '', weight: '', height: '', creatinine: '', gender: 'Female', useCystatinC: false, cystatinC: '', isPregnantOrFertile: false, hasHepaticDisease: false, bilirubin: '', albumin: '', inr: '1', ascites: '1', encephalopathy: '1', location: '', rrt: 'None', bacteriumId: '', susceptibilityResults: {}, micValues: {}, hypersensitivities: [], showSeverityAssessment: false, isICU: false, isImmunocompromised: false, priorAntibiotics: false, hasOrganDysfunction: false, hasSepsis: false, hemodynamicStatus: '', respiratoryStatus: '', showEpidemiologyData: false, localESBLRate: '', localCarbapenemResistance: '', institutionType: ''}); setCurrentStep(1); };
    const handleInputChange = (e) => { 
        const { name, value, type, checked } = e.target; 
        if (name === 'susceptibilityResults' || name === 'micValues' || name === 'bacteriumId') {
            setFormData(prev => ({ ...prev, [name]: value }));
        } else if (name === 'hypersensitivities') {
            setFormData(prev => ({ ...prev, hypersensitivities: checked ? [...prev.hypersensitivities, value] : prev.hypersensitivities.filter(item => item !== value) }));
        } else {
            const newValue = type === 'checkbox' ? checked : value; 
            setFormData(prev => ({ ...prev, [name]: newValue }));
        }
    };

    // WHO BMI z-score calculation functions
    const calculateWHOBMIZScore = (bmi, ageMonths, gender) => {
        // Simplified WHO BMI-for-age z-score approximation
        // Note: This is a simplified implementation. For clinical use, full WHO tables should be used.
        
        if (ageMonths < 24 || ageMonths > 228) return null; // 2-19 years range
        
        // Approximate WHO reference data (simplified for key ages)
        // Real implementation would use full WHO LMS tables
        const whoReference = {
            'Male': {
                24: { L: 1, M: 16.0, S: 0.11 },    // 2 years
                60: { L: 1, M: 15.5, S: 0.13 },    // 5 years
                120: { L: 1, M: 16.8, S: 0.15 },   // 10 years
                180: { L: 1, M: 20.2, S: 0.14 },   // 15 years
                216: { L: 1, M: 21.9, S: 0.13 }    // 18 years
            },
            'Female': {
                24: { L: 1, M: 15.8, S: 0.11 },    // 2 years
                60: { L: 1, M: 15.2, S: 0.14 },    // 5 years
                120: { L: 1, M: 16.9, S: 0.16 },   // 10 years
                180: { L: 1, M: 20.7, S: 0.13 },   // 15 years
                216: { L: 1, M: 21.4, S: 0.12 }    // 18 years
            }
        };
        
        // Find closest age reference or interpolate
        const genderRef = whoReference[gender] || whoReference['Male'];
        const ages = Object.keys(genderRef).map(Number).sort((a, b) => a - b);
        
        let closestAge = ages.reduce((prev, curr) => 
            Math.abs(curr - ageMonths) < Math.abs(prev - ageMonths) ? curr : prev
        );
        
        const { L, M, S } = genderRef[closestAge];
        
        // Calculate z-score using WHO LMS method
        // Z = [(BMI/M)^L - 1] / (L * S)
        if (L !== 0) {
            return (Math.pow(bmi / M, L) - 1) / (L * S);
        } else {
            return Math.log(bmi / M) / S;
        }
    };

    const classifyPediatricBMI = (zScore) => {
        if (zScore < -3) return 'Desnutrición severa (z-score < -3)';
        if (zScore < -2) return 'Desnutrición moderada (z-score -3 a -2)';
        if (zScore < -1) return 'Bajo peso (z-score -2 a -1)';
        if (zScore <= 1) return 'Normal (z-score -1 a +1)';
        if (zScore <= 2) return 'Sobrepeso (z-score +1 a +2)';
        if (zScore <= 3) return 'Obesidad (z-score +2 a +3)';
        return 'Obesidad severa (z-score > +3)';
    };

    const calculateWHOHeightForAgeZScore = (heightCm, ageMonths, gender) => {
        // Simplified WHO Height-for-age reference data for children under 5
        if (ageMonths < 24 || ageMonths > 60) return null; // 2-5 years range
        
        const heightReference = {
            'Male': {
                24: { L: 1, M: 87.1, S: 0.04 },    // 2 years
                36: { L: 1, M: 96.1, S: 0.04 },    // 3 years  
                48: { L: 1, M: 103.3, S: 0.04 },   // 4 years
                60: { L: 1, M: 110.0, S: 0.04 }    // 5 years
            },
            'Female': {
                24: { L: 1, M: 86.4, S: 0.04 },    // 2 years
                36: { L: 1, M: 95.1, S: 0.04 },    // 3 years
                48: { L: 1, M: 102.7, S: 0.04 },   // 4 years
                60: { L: 1, M: 109.4, S: 0.04 }    // 5 years
            }
        };
        
        const genderRef = heightReference[gender] || heightReference['Male'];
        const ages = Object.keys(genderRef).map(Number).sort((a, b) => a - b);
        
        let closestAge = ages.reduce((prev, curr) => 
            Math.abs(curr - ageMonths) < Math.abs(prev - ageMonths) ? curr : prev
        );
        
        const { L, M, S } = genderRef[closestAge];
        
        if (L !== 0) {
            return (Math.pow(heightCm / M, L) - 1) / (L * S);
        } else {
            return Math.log(heightCm / M) / S;
        }
    };

    const calculateWHOWeightForAgeZScore = (weightKg, ageMonths, gender) => {
        // Simplified WHO Weight-for-age reference data for children under 5
        if (ageMonths < 24 || ageMonths > 60) return null; // 2-5 years range
        
        const weightReference = {
            'Male': {
                24: { L: 1, M: 12.2, S: 0.15 },    // 2 years
                36: { L: 1, M: 14.3, S: 0.15 },    // 3 years
                48: { L: 1, M: 16.3, S: 0.14 },    // 4 years
                60: { L: 1, M: 18.3, S: 0.14 }     // 5 years
            },
            'Female': {
                24: { L: 1, M: 11.5, S: 0.15 },    // 2 years
                36: { L: 1, M: 13.9, S: 0.15 },    // 3 years
                48: { L: 1, M: 15.7, S: 0.14 },    // 4 years
                60: { L: 1, M: 17.7, S: 0.14 }     // 5 years
            }
        };
        
        const genderRef = weightReference[gender] || weightReference['Male'];
        const ages = Object.keys(genderRef).map(Number).sort((a, b) => a - b);
        
        let closestAge = ages.reduce((prev, curr) => 
            Math.abs(curr - ageMonths) < Math.abs(prev - ageMonths) ? curr : prev
        );
        
        const { L, M, S } = genderRef[closestAge];
        
        if (L !== 0) {
            return (Math.pow(weightKg / M, L) - 1) / (L * S);
        } else {
            return Math.log(weightKg / M) / S;
        }
    };

    const classifyHeightForAge = (zScore) => {
        if (zScore < -3) return 'Talla baja severa (stunting severo)';
        if (zScore < -2) return 'Talla baja (stunting)';
        if (zScore <= 2) return 'Talla normal';
        return 'Talla alta';
    };

    const classifyWeightForAge = (zScore) => {
        if (zScore < -3) return 'Bajo peso severo';
        if (zScore < -2) return 'Bajo peso';
        if (zScore <= 2) return 'Peso normal';
        return 'Peso alto';
    };

    const calculations = useMemo(() => {
        const age = parseFloat(formData.age); const height = parseFloat(formData.height); const creatinine = parseFloat(formData.creatinine); const cystatinC = parseFloat(formData.cystatinC); const weight = parseFloat(formData.weight); let tfg = null;
        if (age > 0 && height > 0) {
            if (age < 18) {if(creatinine > 0) tfg = { value: ((0.413 * height) / creatinine).toFixed(2), formula: 'Schwartz (Bedside)' };}
            else {
                if (formData.useCystatinC && cystatinC > 0) {let ckd_cyst; const k = 0.8; const alpha = (cystatinC / k) < 1 ? -0.219 : -0.544; ckd_cyst = 135 * Math.pow(Math.min(cystatinC / k, 1), alpha) * Math.pow(Math.max(cystatinC / k, 1), -0.544) * Math.pow(0.9961, age); if (formData.gender === 'Female') ckd_cyst *= 0.963; tfg = { value: ckd_cyst.toFixed(2), formula: 'CKD-EPI (Cistatina C)' };}
                else if (creatinine > 0) {const k = formData.gender === 'Female' ? 0.7 : 0.9; const alpha = formData.gender === 'Female' ? -0.241 : -0.302; const sex_factor = formData.gender === 'Female' ? 1.012 : 1; const ckd_epi = (142 * Math.pow(Math.min(creatinine / k, 1), alpha) * Math.pow(Math.max(creatinine / k, 1), -1.200) * Math.pow(0.9938, age) * sex_factor); tfg = { value: ckd_epi.toFixed(2), formula: 'CKD-EPI (Creatinina)' };}
            }
        }
        let bmi = null; let obesityClass = ''; let bmiZScore = null;
        let heightForAgeZScore = null; let heightForAgeClass = '';
        let weightForAgeZScore = null; let weightForAgeClass = '';
        
        if (weight > 0 && height > 0) {
            bmi = (weight / ((height / 100) ** 2)).toFixed(2);
            
            if (age < 18) {
                // Pediatric BMI requires WHO z-score classification
                const ageInMonths = age * 12; // Convert years to months
                bmiZScore = calculateWHOBMIZScore(parseFloat(bmi), ageInMonths, formData.gender);
                if (bmiZScore !== null) {
                    obesityClass = classifyPediatricBMI(bmiZScore);
                } else {
                    obesityClass = 'Z-score no disponible (requiere datos WHO)';
                }

                // For children under 5, calculate additional WHO indicators
                if (age < 5) {
                    heightForAgeZScore = calculateWHOHeightForAgeZScore(height, ageInMonths, formData.gender);
                    if (heightForAgeZScore !== null) {
                        heightForAgeClass = classifyHeightForAge(heightForAgeZScore);
                    }

                    weightForAgeZScore = calculateWHOWeightForAgeZScore(weight, ageInMonths, formData.gender);
                    if (weightForAgeZScore !== null) {
                        weightForAgeClass = classifyWeightForAge(weightForAgeZScore);
                    }
                }
            } else {
                // Adult BMI classification
                if (bmi < 18.5) obesityClass = 'Bajo Peso'; 
                else if (bmi < 25) obesityClass = 'Normal'; 
                else if (bmi < 30) obesityClass = 'Sobrepeso'; 
                else if (bmi < 35) obesityClass = 'Obesidad Grado I'; 
                else if (bmi < 40) obesityClass = 'Obesidad Grado II'; 
                else obesityClass = 'Obesidad Grado III';
            }
        }
        let childPugh = null;
        if (formData.hasHepaticDisease) { const bili = parseFloat(formData.bilirubin); const alb = parseFloat(formData.albumin); const inr = parseFloat(formData.inr); if (bili > 0 && alb > 0 && inr > 0) { let score = 0; if (bili < 2) score += 1; else if (bili <= 3) score += 2; else score += 3; if (alb > 3.5) score += 1; else if (alb >= 2.8) score += 2; else score += 3; if (inr < 1.7) score += 1; else if (inr <= 2.3) score += 2; else score += 3; score += parseInt(formData.ascites); score += parseInt(formData.encephalopathy); let c_class = ''; if (score <= 6) c_class = 'A'; else if (score <= 9) c_class = 'B'; else c_class = 'C'; childPugh = { score, class: c_class }; }}
        
        // Severity Assessment Calculation
        let severityAssessment = null;
        if (formData.showSeverityAssessment) {
            let severityScore = 0;
            const factors = [];

            // Syndrome-specific baseline severity
            const syndromeMapping = {
                // CNS infections - highest severity
                'CNS_meningitis': 3, 'CNS_encephalitis': 3, 'CNS_brain_abscess': 3, 'CNS_subdural_empyema': 3,
                
                // Cardiovascular - high severity
                'CV_endocarditis_native': 3, 'CV_endocarditis_prosthetic': 3, 'CV_endocarditis_CIED': 3, 'CV_mycotic_aneurysm': 3,
                'CV_pericarditis': 2,
                
                // Respiratory - moderate to high
                'RESP_CAP': 2, 'RESP_HAP': 2, 'RESP_VAP': 3, 'RESP_empyema': 2, 'RESP_lung_abscess': 2, 'RESP_bronchitis_acute': 1,
                
                // Genitourinary - variable
                'GU_UTI_uncomplicated': 1, 'GU_UTI_complicated': 2, 'GU_UTI_catheter': 2, 'GU_pyelonephritis': 2,
                'GU_prostatitis_acute': 2, 'GU_prostatitis_chronic': 1,
                
                // Skin/Soft Tissue - variable
                'SST_cellulitis_simple': 1, 'SST_cellulitis_severe': 2, 'SST_necrotizing_fasciitis': 3, 'SST_abscess': 1,
                'SST_diabetic_foot': 2, 'SST_surgical_site': 2,
                
                // Bone/Joint - moderate
                'BJ_osteomyelitis_acute': 2, 'BJ_osteomyelitis_chronic': 2, 'BJ_prosthetic_joint': 2, 'BJ_septic_arthritis': 2,
                'BJ_vertebral_osteomyelitis': 2, 'BJ_diabetic_foot_osteo': 2,
                
                // Intra-abdominal - moderate
                'IA_peritonitis_secondary': 2, 'IA_peritonitis_primary': 2, 'IA_intra_abdominal': 2, 'IA_cholangitis': 2,
                'IA_liver_abscess': 2, 'IA_appendicitis': 2,
                
                // Bacteremia/Sepsis - high severity
                'BS_bacteremia_primary': 2, 'BS_CLABSI': 2, 'BS_sepsis': 3, 'BS_septic_shock': 3, 'BS_neutropenic_fever': 2,
                
                // Legacy mappings for backward compatibility
                'Skin and soft tissues': 1, 'Genitourinary': 1, 'Respiratory': 2, 'Gastrointestinal': 2,
                'Bone tissue': 2, 'Cardiovascular': 3, 'Central nervous system': 3, 'Bacteremia/Sepsis': 3
            };
            
            const syndromeScore = syndromeMapping[formData.location] || 0;
            if (syndromeScore > 0) {
                severityScore += syndromeScore;
                const syndromeLabel = formData.location.includes('_') ? 
                    'Síndrome específico' : formData.location;
                factors.push(`${syndromeLabel} (+${syndromeScore})`);
            }

            // Age factor
            const age = parseFloat(formData.age);
            if (age > 65) {
                severityScore += 1;
                factors.push('Edad >65 años (+1)');
            }

            // Objective criteria
            if (formData.isICU) {
                severityScore += 3;
                factors.push('UCI (+3)');
            }
            if (formData.isImmunocompromised) {
                severityScore += 2;
                factors.push('Inmunocomprometido (+2)');
            }
            if (formData.priorAntibiotics) {
                severityScore += 1;
                factors.push('Antibióticos previos (+1)');
            }
            if (formData.hasOrganDysfunction) {
                severityScore += 2;
                factors.push('Disfunción orgánica (+2)');
            }
            if (formData.hasSepsis) {
                severityScore += 3;
                factors.push('Sepsis/shock séptico (+3)');
            }

            // Hemodynamic status
            if (formData.hemodynamicStatus === 'shock') {
                severityScore += 3;
                factors.push('Shock hemodinámico (+3)');
            } else if (formData.hemodynamicStatus === 'hypotension') {
                severityScore += 2;
                factors.push('Hipotensión (+2)');
            }

            // Respiratory status
            if (formData.respiratoryStatus === 'mechanical') {
                severityScore += 2;
                factors.push('Ventilación mecánica (+2)');
            } else if (formData.respiratoryStatus === 'oxygen') {
                severityScore += 1;
                factors.push('Oxígeno suplementario (+1)');
            }

            // Determine severity level
            let severityLevel;
            if (severityScore <= 2) severityLevel = 'LEVE';
            else if (severityScore <= 5) severityLevel = 'MODERADO';
            else if (severityScore <= 8) severityLevel = 'GRAVE';
            else severityLevel = 'CRÍTICO';

            severityAssessment = {
                score: severityScore,
                level: severityLevel,
                factors: factors
            };
        }

        // Epidemiology Risk Assessment
        let epidemiologyRisk = null;
        if (formData.showEpidemiologyData) {
            const esblRate = parseFloat(formData.localESBLRate);
            const carbapenemRate = parseFloat(formData.localCarbapenemResistance);
            
            let riskLevel = 'BAJO';
            const riskFactors = [];

            if (esblRate > 30) {
                riskLevel = 'ALTO';
                riskFactors.push(`ESBL alta (${esblRate}%)`);
            } else if (esblRate > 15) {
                riskLevel = 'MODERADO';
                riskFactors.push(`ESBL moderada (${esblRate}%)`);
            } else if (esblRate > 0) {
                riskFactors.push(`ESBL baja (${esblRate}%)`);
            }

            if (carbapenemRate > 15) {
                riskLevel = 'ALTO';
                riskFactors.push(`Carbapenem alta (${carbapenemRate}%)`);
            } else if (carbapenemRate > 5) {
                if (riskLevel === 'BAJO') riskLevel = 'MODERADO';
                riskFactors.push(`Carbapenem moderada (${carbapenemRate}%)`);
            } else if (carbapenemRate > 0) {
                riskFactors.push(`Carbapenem baja (${carbapenemRate}%)`);
            }

            // Institution type factor
            if (formData.institutionType === 'tertiary') {
                if (riskLevel === 'BAJO') riskLevel = 'MODERADO';
                riskFactors.push('Centro de referencia');
            } else if (formData.institutionType === 'academic') {
                riskFactors.push('Centro académico');
            } else if (formData.institutionType === 'community') {
                riskFactors.push('Hospital comunitario');
            }

            epidemiologyRisk = {
                level: riskLevel,
                factors: riskFactors.length > 0 ? riskFactors : ['Datos por defecto']
            };
        }

        return { 
            tfg, bmi, obesityClass, bmiZScore, 
            heightForAgeZScore, heightForAgeClass, 
            weightForAgeZScore, weightForAgeClass,
            childPugh, severityAssessment, epidemiologyRisk 
        };
    }, [formData]);

    const { recommendation, alternatives, clinicalAnalysis } = useMemo(() => {
        const { bacteriumId, location } = formData;
        const bacterium = bacteriumId ? getBacteriaDatabase()[bacteriumId] : null;
        
        if (!bacterium || !location) {
            return { 
                recommendation: { antibiotic: null, tier: 'Información incompleta (bacteria o localización).' }, 
                alternatives: [],
                clinicalAnalysis: null
            };
        }

        try {
            // Create local epidemiology object from form data
            const localEpidemiology = {
                esblRate: {
                    enterobacterales: formData.localESBLRate ? parseFloat(formData.localESBLRate) / 100 : 0.12,
                    klebsiella: 0.18,
                    escherichia: 0.08,
                    enterobacter: 0.25
                },
                carbapenemResistance: {
                    enterobacterales: formData.localCarbapenemResistance ? parseFloat(formData.localCarbapenemResistance) / 100 : 0.03,
                    klebsiella: 0.05,
                    acinetobacter: 0.25,
                    pseudomonas: 0.15
                },
                mrsaRate: 0.35,
                vreRate: 0.15
            };

            // Get intelligent recommendation
            const intelligentResult = getIntelligentTreatmentRecommendation(formData, bacterium, localEpidemiology);
            
            // Extract the optimal regimen and format for UI
            const optimalRegimen = intelligentResult.regimen;
            
            if (!optimalRegimen.regimen || !optimalRegimen.suitableOptions || optimalRegimen.suitableOptions.length === 0) {
                return {
                    recommendation: { 
                        antibiotic: null, 
                        tier: optimalRegimen.note || 'No se encontró opción adecuada con los datos actuales.' 
                    },
                    alternatives: [],
                    clinicalAnalysis: intelligentResult
                };
            }

            // Get the best suitable option
            const bestOption = optimalRegimen.suitableOptions[0];
            const regimen = optimalRegimen.regimen;
            
            // Format recommendation
            const formattedRecommendation = {
                antibiotic: bestOption.drugName,
                tier: regimen.context?.condition || 'Recomendación inteligente',
                dose: bestOption.dose,
                route: bestOption.route,
                frequency: bestOption.frequency,
                comments: bestOption.comments,
                context: regimen.context,
                regimenNotes: regimen.recommendations?.[0]?.notes || [],
                clinicalRationale: intelligentResult.rationale.summary,
                severityAssessment: intelligentResult.severity,
                resistanceAssessment: intelligentResult.mechanisms
            };

            // Get alternatives
            const alternativeNames = optimalRegimen.suitableOptions.slice(1).map(opt => opt.drugName);
            
            return {
                recommendation: formattedRecommendation,
                alternatives: alternativeNames,
                clinicalAnalysis: intelligentResult
            };
            
        } catch (error) {
            console.error('Error in intelligent recommendation:', error);
            return { 
                recommendation: { 
                    antibiotic: null, 
                    tier: 'Error en el análisis clínico. Consulte con especialista en infectología.' 
                }, 
                alternatives: [],
                clinicalAnalysis: null
            };
        }
    }, [formData]);

    const stepTitles = [ "Datos del Paciente", "Localización de Infección", "Selección de Microorganismo", "Panel de Sensibilidad", "Hipersensibilidad", "Resumen y Recomendación" ];
    const renderStep = () => {
        switch (currentStep) {
            case 1: return <PatientDataStep data={formData} onChange={handleInputChange} calculations={calculations} />;
            case 2: return <InfectionLocationStep data={formData} onChange={handleInputChange} />;
            case 3: return <BacteriaSelectionStep data={formData} onChange={handleInputChange} />;
            case 4: return <AntibioticSusceptibilityStep data={formData} onChange={handleInputChange} />;
            case 5: return <HypersensitivityStep data={formData} onChange={handleInputChange} />;
            case 6: return <RecommendationStep data={formData} calculations={calculations} recommendation={recommendation} alternatives={alternatives} clinicalAnalysis={clinicalAnalysis} />;
            default: return <div>Paso desconocido</div>;
        }
    };
    return (
        <div className="bg-gray-100 font-sans" style={{ minHeight: '100vh', paddingBottom: '2rem' }}>
            {/* Header with back button */}
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
                    <button 
                        onClick={onBackToLanding}
                        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <span className="mr-2">←</span>
                        <span className="text-sm">Volver al Inicio</span>
                    </button>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-800">Antibiograma Inteligente</h1>
                        <p className="text-sm text-gray-600">Versión Alpha - Enterobacterales</p>
                    </div>
                    <div className="w-24"></div>
                </div>
            </div>
            
            {/* Main antibiogram content */}
            <div className="p-2 sm:p-4 lg:p-8 flex flex-col items-center" style={{ minHeight: 'calc(100vh - 100px)' }}>
                <div className="w-full max-w-4xl pb-8">
                    <ProgressBar current={currentStep} total={totalSteps} />
                    <Card title={stepTitles[currentStep-1]}>
                        <form onSubmit={(e) => e.preventDefault()}>
                            {renderStep()}
                        </form>
                        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
                            <button onClick={prevStep} disabled={currentStep === 1} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                Anterior
                            </button>
                            {currentStep === totalSteps ? (
                                <button onClick={resetForm} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
                                    Finalizar y Reiniciar
                                </button>
                            ) : (
                                <button onClick={nextStep} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
                                    Siguiente
                                </button>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default AntibiogramApp;

