// src/components/Phase2_InitialInterpretation.jsx
// --- Phase 2: Initial Interpretation & Red Flags ---
// Real-time MIC interpretation with CLSI compliance and clinical warnings

import React, { useState, useEffect, useMemo } from 'react';
import { CLSIBreakpointEngine } from '../engines/CLSIBreakpointEngine.js';

const STANDARD_ANTIBIOTIC_PANELS = {
  'enterobacterales': [
    'ampicillin', 'amoxicillin-clavulanate', 'piperacillin-tazobactam',
    'cefazolin', 'ceftriaxone', 'ceftazidime', 'cefepime',
    'ertapenem', 'meropenem', 'aztreonam',
    'ciprofloxacin', 'levofloxacin', 'gentamicin', 'amikacin',
    'trimethoprim-sulfamethoxazole', 'nitrofurantoin'
  ],
  'staphylococcus': [
    'penicillin', 'oxacillin', 'cefazolin', 'clindamycin',
    'erythromycin', 'vancomycin', 'linezolid', 'daptomycin',
    'ciprofloxacin', 'levofloxacin', 'gentamicin',
    'trimethoprim-sulfamethoxazole', 'tetracycline', 'rifampin'
  ],
  'enterococcus': [
    'ampicillin', 'vancomycin', 'linezolid', 'daptomycin',
    'ciprofloxacin', 'levofloxacin', 'tetracycline',
    'nitrofurantoin', 'chloramphenicol'
  ],
  'pseudomonas': [
    'piperacillin', 'piperacillin-tazobactam', 'ceftazidime', 'cefepime',
    'aztreonam', 'imipenem', 'meropenem', 'doripenem',
    'ciprofloxacin', 'levofloxacin', 'gentamicin', 'tobramycin', 'amikacin',
    'colistin'
  ]
};

const MIC_SUGGESTIONS = [
  '≤0.25', '0.5', '1', '2', '4', '8', '16', '32', '64', '≥128',
  '≤0.5', '≤1', '≤2', '≤4', '≤8', '≤16', '≤32', '≤64',
  '≥0.5', '≥1', '≥2', '≥4', '≥8', '≥16', '≥32', '≥64'
];

export const Phase2_InitialInterpretation = ({ 
  organismData, 
  infectionSite, 
  onComplete, 
  initialData = {} 
}) => {
  const [micData, setMicData] = useState(initialData.micData || {});
  const [interpretations, setInterpretations] = useState({});
  const [warnings, setWarnings] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBreakpoints, setShowBreakpoints] = useState({});

  // Initialize CLSI engine
  const clsiEngine = useMemo(() => new CLSIBreakpointEngine(), []);

  // Get appropriate antibiotic panel
  const antibioticPanel = useMemo(() => {
    const clsiCategory = clsiEngine.mapOrganismToCLSICategory(organismData.id);
    const panel = STANDARD_ANTIBIOTIC_PANELS[clsiCategory] || STANDARD_ANTIBIOTIC_PANELS['enterobacterales'];
    
    // Filter out intrinsically resistant antibiotics
    return panel.filter(antibiotic => 
      !organismData.intrinsicResistance?.includes(antibiotic)
    );
  }, [organismData, clsiEngine]);

  // Real-time interpretation as MICs are entered
  const handleMICChange = async (antibiotic, micValue) => {
    if (!micValue.trim()) {
      // Remove antibiotic if MIC is cleared
      const newMicData = { ...micData };
      delete newMicData[antibiotic];
      setMicData(newMicData);
      
      const newInterpretations = { ...interpretations };
      delete newInterpretations[antibiotic];
      setInterpretations(newInterpretations);
      return;
    }

    setIsProcessing(true);
    
    try {
      // Update MIC data
      const newMicData = { ...micData, [antibiotic]: micValue };
      setMicData(newMicData);
      
      // Get CLSI interpretation
      const interpretation = await clsiEngine.interpretMIC(
        organismData.id, 
        antibiotic, 
        micValue, 
        infectionSite
      );
      
      // Update interpretations
      const newInterpretations = { 
        ...interpretations, 
        [antibiotic]: interpretation 
      };
      setInterpretations(newInterpretations);
      
      // Check for warnings
      const warning = checkForWarnings(organismData, antibiotic, interpretation, infectionSite);
      if (warning) {
        setWarnings(prev => {
          // Remove existing warning for this antibiotic
          const filtered = prev.filter(w => w.antibiotic !== antibiotic);
          return [...filtered, { ...warning, antibiotic }];
        });
      } else {
        // Remove warning if no longer applicable
        setWarnings(prev => prev.filter(w => w.antibiotic !== antibiotic));
      }

    } catch (error) {
      console.error('MIC interpretation error:', error);
      setWarnings(prev => [...prev, {
        antibiotic,
        level: 'error',
        message: `Error interpreting ${antibiotic}: ${error.message}`
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle S/I/R button clicks with breakpoint values
  const handleSIRClick = async (antibiotic, interpretation) => {
    try {
      // Get breakpoints for this antibiotic
      const breakpoints = await clsiEngine.getBreakpoints(organismData.id, antibiotic, infectionSite);
      
      let micValue;
      if (interpretation === 'S' && breakpoints?.mic_breakpoints?.S) {
        // Use susceptible breakpoint value
        micValue = breakpoints.mic_breakpoints.S.replace('≤', '');
      } else if (interpretation === 'I' && breakpoints?.mic_breakpoints?.I) {
        // Use intermediate breakpoint value
        micValue = breakpoints.mic_breakpoints.I;
      } else if (interpretation === 'R' && breakpoints?.mic_breakpoints?.R) {
        // Use resistant breakpoint value
        micValue = breakpoints.mic_breakpoints.R.replace('≥', '');
      } else {
        // Fallback to just the interpretation
        micValue = interpretation;
      }
      
      // Update MIC data with breakpoint value
      const newMicData = { ...micData, [antibiotic]: micValue };
      setMicData(newMicData);
      
      // Create interpretation object
      const interpretationObj = {
        interpretation,
        confidence: 'manual',
        micValue,
        breakpoints,
        note: `Manual ${interpretation} selection with breakpoint value`
      };
      
      const newInterpretations = { 
        ...interpretations, 
        [antibiotic]: interpretationObj 
      };
      setInterpretations(newInterpretations);
      
    } catch (error) {
      console.error('SIR button error:', error);
      // Fallback to simple interpretation
      const newMicData = { ...micData, [antibiotic]: interpretation };
      setMicData(newMicData);
      
      const newInterpretations = { 
        ...interpretations, 
        [antibiotic]: { interpretation, confidence: 'manual', micValue: interpretation } 
      };
      setInterpretations(newInterpretations);
    }
  };


  // Check for clinical warnings and paradoxical results
  const checkForWarnings = (organism, antibiotic, interpretation, site) => {
    const warnings = [];

    // Clinical override warnings (site-specific ineffectiveness)
    const clinicalOverrides = {
      'daptomycin': {
        'RESP_pneumonia': 'Clinically ineffective due to pulmonary surfactant inactivation',
        'RESP_VAP': 'Clinically ineffective due to pulmonary surfactant inactivation'
      },
      'piperacillin-tazobactam': {
        'BS_bacteremia': 'Risk of treatment failure in E. coli bacteremia despite susceptibility'
      },
      'nitrofurantoin': {
        'GU_pyelonephritis': 'Poor tissue penetration - not recommended for pyelonephritis'
      }
    };

    if (clinicalOverrides[antibiotic] && clinicalOverrides[antibiotic][site] && 
        interpretation.interpretation === 'S') {
      warnings.push({
        level: 'high',
        type: 'clinical_override',
        message: `${antibiotic}: ${clinicalOverrides[antibiotic][site]}`,
        recommendation: 'Consider alternative agent despite susceptible result'
      });
    }

    // Paradoxical result warnings
    if (interpretation.interpretation === 'S' && antibiotic === 'ceftriaxone' && 
        interpretations['cefazolin'] && interpretations['cefazolin'].interpretation === 'R') {
      warnings.push({
        level: 'medium',
        type: 'paradoxical',
        message: `Unusual pattern: Cefazolin resistant but Ceftriaxone susceptible`,
        recommendation: 'Consider repeat testing or ESBL detection'
      });
    }

    return warnings.length > 0 ? warnings[0] : null;
  };

  // Calculate interpretation summary
  const interpretationSummary = useMemo(() => {
    const total = Object.keys(interpretations).length;
    const susceptible = Object.values(interpretations).filter(i => i.interpretation === 'S').length;
    const intermediate = Object.values(interpretations).filter(i => i.interpretation === 'I').length;
    const resistant = Object.values(interpretations).filter(i => i.interpretation === 'R').length;
    
    return { total, susceptible, intermediate, resistant };
  }, [interpretations]);

  const handleNext = () => {
    // Auto-assume untested antibiotics are sensitive to save time
    const finalMicData = { ...micData };
    const finalInterpretations = { ...interpretations };
    
    for (const antibiotic of antibioticPanel) {
      if (!finalInterpretations[antibiotic]) {
        // Assume sensitive for untested antibiotics
        finalMicData[antibiotic] = 'S';
        finalInterpretations[antibiotic] = {
          interpretation: 'S',
          confidence: 'assumed',
          micValue: 'S',
          note: 'Assumed sensitive (not tested)'
        };
      }
    }
    
    onComplete({
      micData: finalMicData,
      interpretations: finalInterpretations,
      warnings,
      interpretationSummary
    });
  };

  const clearAllValues = () => {
    setMicData({});
    setInterpretations({});
    setWarnings([]);
  };

  const getInterpretationColor = (interpretation) => {
    switch (interpretation) {
      case 'S': return 'text-green-700 bg-green-100';
      case 'I': return 'text-yellow-700 bg-yellow-100';
      case 'R': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const formatMICDisplay = (micValue) => {
    return micValue.replace(/<=|>=/g, (match) => 
      match === '<=' ? '≤' : '≥'
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Phase Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-orange-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4">
            2
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Initial Interpretation & Red Flags</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto">
          Enter MIC values and watch the real-time CLSI interpretation. We'll flag any paradoxical results 
          that suggest lab errors or hidden resistance mechanisms.
        </p>
      </div>

      {/* Organism and Site Context */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-blue-800">{organismData.name}</h3>
            <p className="text-sm text-blue-600">
              {organismData.gramStain} • {infectionSite} • CLSI Category: {clsiEngine.mapOrganismToCLSICategory(organismData.id)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-600">
              {interpretationSummary.total} antibiotics tested
            </p>
            <div className="flex space-x-2 text-xs">
              <span className="text-green-600">S: {interpretationSummary.susceptible}</span>
              <span className="text-yellow-600">I: {interpretationSummary.intermediate}</span>
              <span className="text-red-600">R: {interpretationSummary.resistant}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Warnings Panel */}
      {warnings.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-red-800 mb-3">🚨 Clinical Alerts</h3>
          <div className="space-y-2">
            {warnings.map((warning, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  warning.level === 'high' ? 'bg-red-100 text-red-700' :
                  warning.level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {warning.level?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-red-700 font-medium">{warning.message}</p>
                  {warning.recommendation && (
                    <p className="text-xs text-red-600 mt-1">💡 {warning.recommendation}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* MIC Input Grid */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Antibiotic Susceptibility Testing Panel
              </h3>
              <p className="text-sm text-gray-600">
                Enter MIC values (μg/mL) for PK/PD calculations, or click S/I/R buttons for quick entry with breakpoint values.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Antibiotic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MIC (μg/mL)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interpretation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Breakpoints
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {antibioticPanel.map((antibiotic) => {
                const interpretation = interpretations[antibiotic];
                const micValue = micData[antibiotic] || '';
                
                return (
                  <tr key={antibiotic} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 capitalize">
                        {antibiotic.replace(/-/g, '-')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-1">
                        <input
                          type="text"
                          value={micValue}
                          onChange={(e) => handleMICChange(antibiotic, e.target.value)}
                          placeholder="MIC or S/I/R"
                          list={`mic-suggestions-${antibiotic}`}
                          className={`w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            interpretation?.confidence === 'manual' ? 'text-gray-500 bg-gray-50' : ''
                          }`}
                          title={interpretation?.confidence === 'manual' ? 'Breakpoint value from S/I/R selection. Edit for precise PK/PD calculations.' : 'Enter MIC value or use S/I/R buttons'}
                        />
                        <div className="flex">
                          <button onClick={() => handleSIRClick(antibiotic, 'S')} className="px-1 py-1 text-xs bg-green-100 text-green-700 rounded-l border border-green-300 hover:bg-green-200" title="Click to set as Sensitive with breakpoint value">S</button>
                          <button onClick={() => handleSIRClick(antibiotic, 'I')} className="px-1 py-1 text-xs bg-yellow-100 text-yellow-700 border-t border-b border-yellow-300 hover:bg-yellow-200" title="Click to set as Intermediate with breakpoint value">I</button>
                          <button onClick={() => handleSIRClick(antibiotic, 'R')} className="px-1 py-1 text-xs bg-red-100 text-red-700 rounded-r border border-red-300 hover:bg-red-200" title="Click to set as Resistant with breakpoint value">R</button>
                        </div>
                      </div>
                      <datalist id={`mic-suggestions-${antibiotic}`}>
                        {MIC_SUGGESTIONS.map((suggestion, index) => (
                          <option key={index} value={suggestion} />
                        ))}
                      </datalist>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {interpretation ? (
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-sm font-medium ${getInterpretationColor(interpretation.interpretation)}`}>
                            {interpretation.interpretation}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({interpretation.confidence})
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {interpretation?.breakpoints ? (
                        <button
                          onClick={() => setShowBreakpoints(prev => ({
                            ...prev,
                            [antibiotic]: !prev[antibiotic]
                          }))}
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          {showBreakpoints[antibiotic] ? 'Hide' : 'Show'} breakpoints
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">Not available</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {interpretation?.note && (
                        <div className="text-xs text-gray-600 max-w-xs">
                          {interpretation.note}
                        </div>
                      )}
                      {interpretation?.siteModified && (
                        <div className="text-xs text-blue-600 mt-1">
                          ⚡ Site-specific breakpoints applied
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Breakpoint Details */}
      {Object.entries(showBreakpoints).map(([antibiotic, show]) => {
        if (!show || !interpretations[antibiotic]?.breakpoints) return null;
        
        const breakpoints = interpretations[antibiotic].breakpoints;
        return (
          <div key={antibiotic} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">
              {antibiotic} - CLSI Breakpoints
            </h4>
            {breakpoints.mic_breakpoints && (
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-green-700">Susceptible (S):</span>
                  <span className="ml-2">{formatMICDisplay(breakpoints.mic_breakpoints.S)}</span>
                </div>
                {breakpoints.mic_breakpoints.I && (
                  <div>
                    <span className="font-medium text-yellow-700">Intermediate (I):</span>
                    <span className="ml-2">{formatMICDisplay(breakpoints.mic_breakpoints.I)}</span>
                  </div>
                )}
                <div>
                  <span className="font-medium text-red-700">Resistant (R):</span>
                  <span className="ml-2">{formatMICDisplay(breakpoints.mic_breakpoints.R)}</span>
                </div>
              </div>
            )}
            {breakpoints.special_considerations && (
              <div className="mt-2 text-xs text-blue-700">
                <strong>Special Considerations:</strong> {breakpoints.special_considerations}
              </div>
            )}
          </div>
        );
      })}

      {/* Interpretation Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Interpretation Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{interpretationSummary.total}</div>
            <div className="text-sm text-gray-600">Total Tested</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{interpretationSummary.susceptible}</div>
            <div className="text-sm text-gray-600">Susceptible</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{interpretationSummary.intermediate}</div>
            <div className="text-sm text-gray-600">Intermediate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{interpretationSummary.resistant}</div>
            <div className="text-sm text-gray-600">Resistant</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          {interpretationSummary.total >= 5 ? (
            <span className="text-green-600 font-medium">
              ✅ Ready to analyze resistance patterns
            </span>
          ) : (
            <span>Enter at least 5 MIC values to proceed with pattern analysis</span>
          )}
        </div>
        
        <button
          onClick={handleNext}
          disabled={interpretationSummary.total < 5 || isProcessing}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            interpretationSummary.total >= 5 && !isProcessing
              ? 'bg-orange-600 text-white hover:bg-orange-700 focus:ring-2 focus:ring-orange-500'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isProcessing ? 'Processing...' : 'Analyze Resistance Patterns →'}
        </button>
      </div>
    </div>
  );
};

export default Phase2_InitialInterpretation;