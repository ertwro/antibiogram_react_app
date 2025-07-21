// src/components/Phase3_ResistanceMechanisms.jsx
// --- Phase 3: Resistance Mechanisms - The Detective Work ---
// Advanced pattern recognition with educational insights and override confirmations

import React, { useState, useEffect, useMemo } from 'react';
import { SequentialResistanceEngine, CONFIDENCE_LEVELS } from '../engines/SequentialResistanceEngine.js';

const MECHANISM_ICONS = {
  esbl: '🧬',
  ampc: '⚡',
  carbapenemase: '💀',
  mrsa: '🛡️',
  vre: '⚠️',
  mlsb: '🔄',
  fluoroquinolone: '🎯',
  aminoglycoside: '🔬'
};

const CONFIDENCE_COLORS = {
  high: 'bg-red-100 text-red-800 border-red-200',
  moderate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-blue-100 text-blue-800 border-blue-200',
  uncertain: 'bg-gray-100 text-gray-800 border-gray-200'
};

export const Phase3_ResistanceMechanisms = ({ 
  organismData, 
  micData, 
  interpretations,
  onComplete, 
  initialData = {} 
}) => {
  // Debug props on component mount
  console.log('🔄 Phase3_ResistanceMechanisms mounted with props:', {
    organismData,
    micData,
    interpretations,
    initialData
  });
  const [resistanceAnalysis, setResistanceAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedMechanism, setSelectedMechanism] = useState(null);
  const [acceptedOverrides, setAcceptedOverrides] = useState({});
  const [showEducational, setShowEducational] = useState({});

  // Initialize sequential resistance engine
  const resistanceEngine = useMemo(() => {
    const engine = new SequentialResistanceEngine();
    // Initialize the engine asynchronously
    engine.initialize().catch(error => {
      console.error('Failed to initialize sequential resistance engine:', error);
    });
    return engine;
  }, []);

  // Run resistance pattern analysis
  useEffect(() => {
    if (organismData && interpretations && Object.keys(interpretations).length > 0) {
      analyzeResistancePatterns();
    }
  }, [organismData, interpretations]);

  // Test function to verify resistance detection works
  const testResistanceDetection = async () => {
    console.log('🧪 Testing resistance detection with mock ESBL pattern');
    
    const testPattern = {
      'ceftriaxone': { interpretation: 'R', micValue: '32' },
      'ceftazidime': { interpretation: 'R', micValue: '16' },
      'cefepime': { interpretation: 'S', micValue: '2' },
      'meropenem': { interpretation: 'S', micValue: '0.5' },
      'piperacillin-tazobactam': { interpretation: 'S', micValue: '8' },
      'ciprofloxacin': { interpretation: 'S', micValue: '0.5' }
    };
    
    const testResult = await resistanceEngine.analyzePattern('ecolienteroaggregative', testPattern);
    console.log('🧪 Test result:', testResult);
    
    // Set the test result to display
    setResistanceAnalysis(testResult);
  };

  // Function to simulate resistance patterns for any organism
  const simulateResistancePattern = async () => {
    console.log('🧪 Simulating resistance pattern for current organism');
    
    // Create a pattern that should trigger ESBL detection
    const simulatedPattern = {
      'ampicillin': { interpretation: 'R', micValue: '≥32' },
      'cefazolin': { interpretation: 'R', micValue: '≥64' },        // 1st gen - triggers step 2
      'ceftriaxone': { interpretation: 'R', micValue: '16' },       // 3rd gen - triggers step 3  
      'ceftazidime': { interpretation: 'R', micValue: '8' },        // 3rd gen - triggers step 3
      'cefepime': { interpretation: 'S', micValue: '2' },           // 4th gen spared
      'ertapenem': { interpretation: 'S', micValue: '≤0.5' },       // Carbapenems spared
      'meropenem': { interpretation: 'S', micValue: '≤0.25' },      // Carbapenems spared
      'piperacillin-tazobactam': { interpretation: 'S', micValue: '8' },  // Inhibitor works = ESBL
      'amoxicillin-clavulanate': { interpretation: 'S', micValue: '4' },  // Inhibitor works = ESBL
      'gentamicin': { interpretation: 'S', micValue: '≤1' },
      'ciprofloxacin': { interpretation: 'S', micValue: '≤0.25' },
      'trimethoprim-sulfamethoxazole': { interpretation: 'S', micValue: '≤20' }
    };
    
    const result = await resistanceEngine.analyzePattern(organismData?.id || 'escherichia_coli', simulatedPattern);
    console.log('🧪 Simulated resistance analysis:', result);
    
    setResistanceAnalysis(result);
  };

  const analyzeResistancePatterns = async () => {
    setIsAnalyzing(true);
    
    try {
      console.log('🔍 Phase 3: Starting resistance pattern analysis');
      console.log('🦠 Organism data:', organismData);
      console.log('🧪 Interpretations received:', interpretations);
      console.log('🧪 MIC data received:', micData);
      
      // Convert interpretations to simple S/I/R format for engine
      const susceptibilityPattern = {};
      for (const [antibiotic, result] of Object.entries(interpretations)) {
        susceptibilityPattern[antibiotic] = {
          interpretation: result.interpretation,
          micValue: micData[antibiotic]
        };
      }
      
      console.log('🔬 Susceptibility pattern for analysis:', susceptibilityPattern);

      const analysis = await resistanceEngine.analyzePattern(
        organismData.id, 
        susceptibilityPattern
      );

      console.log('📊 Resistance analysis result:', analysis);
      console.log('🔍 Detected patterns:', analysis.detectedPatterns);
      console.log('⚠️ Warnings:', analysis.warnings);
      
      setResistanceAnalysis(analysis);

      // Auto-accept high confidence overrides
      const autoAccepted = {};
      for (const [antibiotic, override] of Object.entries(analysis.mechanismOverrides || {})) {
        if (override.confidence === CONFIDENCE_LEVELS.HIGH) {
          autoAccepted[antibiotic] = true;
        }
      }
      setAcceptedOverrides(autoAccepted);

    } catch (error) {
      console.error('Resistance pattern analysis failed:', error);
      setResistanceAnalysis({
        organism: organismData.id,
        detectedPatterns: [],
        warnings: [{
          level: 'error',
          message: `Analysis failed: ${error.message}`
        }],
        overallConfidence: CONFIDENCE_LEVELS.UNCERTAIN
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOverrideToggle = (antibiotic, accepted) => {
    setAcceptedOverrides(prev => ({
      ...prev,
      [antibiotic]: accepted
    }));
  };

  const handleNext = () => {
    // Apply accepted overrides to interpretations
    const updatedInterpretations = { ...interpretations };
    
    for (const [antibiotic, override] of Object.entries(resistanceAnalysis?.mechanismOverrides || {})) {
      if (acceptedOverrides[antibiotic]) {
        updatedInterpretations[antibiotic] = {
          ...updatedInterpretations[antibiotic],
          interpretation: override.newInterpretation,
          originalInterpretation: override.oldInterpretation,
          overrideReason: override.reason,
          overrideMechanism: override.mechanism
        };
      }
    }

    onComplete({
      resistanceAnalysis,
      acceptedOverrides,
      updatedInterpretations,
      detectedMechanisms: resistanceAnalysis?.detectedPatterns || []
    });
  };

  const getConfidenceIcon = (confidence) => {
    switch (confidence) {
      case CONFIDENCE_LEVELS.HIGH: return '🔴';
      case CONFIDENCE_LEVELS.MODERATE: return '🟡';
      case CONFIDENCE_LEVELS.LOW: return '🔵';
      default: return '⚪';
    }
  };

  const formatEvidence = (evidence) => {
    return evidence.map((item, index) => (
      <li key={index} className="text-sm text-gray-700 mb-1">
        • {item}
      </li>
    ));
  };

  if (isAnalyzing) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center space-x-3 mb-4">
            <svg className="animate-spin h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-xl font-semibold text-gray-900">Analyzing Resistance Patterns...</span>
          </div>
          <p className="text-gray-600">
            Running specialist-level algorithms to detect ESBL, AmpC, MRSA, VRE, and other resistance mechanisms
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Phase Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4">
            3
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Resistance Mechanisms - The Detective Work</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto">
          Now we play detective! Using the patterns from Phase 2, we'll identify hidden resistance mechanisms 
          that could cause treatment failures even when antibiotics appear "susceptible."
        </p>
        
        {/* Debug Test Buttons */}
        <div className="mt-4 space-x-2">
          <button
            onClick={testResistanceDetection}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            🧪 Test ESBL Detection
          </button>
          <button
            onClick={simulateResistancePattern}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
          >
            🧪 Simulate ESBL Pattern
          </button>
        </div>
      </div>

      {/* Sequential Steps Display */}
      {resistanceAnalysis?.sequentialSteps && resistanceAnalysis.sequentialSteps.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">
            🔬 Sequential Analysis Steps (Clinical Methodology)
          </h2>
          <div className="space-y-3">
            {resistanceAnalysis.sequentialSteps.map((step, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-white rounded border">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {step.step}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 capitalize">{step.antibiotic}</div>
                  <div className="text-sm text-gray-600">{step.conclusion}</div>
                </div>
                <div className={`px-3 py-1 rounded text-sm font-medium ${
                  step.interpretation === 'R' ? 'bg-red-100 text-red-700' :
                  step.interpretation === 'S' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {step.interpretation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-purple-800">
            🔍 Pattern Analysis Results
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-purple-600">Overall Confidence:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
              CONFIDENCE_COLORS[resistanceAnalysis?.overallConfidence || 'uncertain']
            }`}>
              {getConfidenceIcon(resistanceAnalysis?.overallConfidence)} 
              {resistanceAnalysis?.overallConfidence?.toUpperCase() || 'UNCERTAIN'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-700">
              {resistanceAnalysis?.detectedPatterns?.length || 0}
            </div>
            <div className="text-sm text-purple-600">Mechanisms Detected</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-700">
              {Object.keys(resistanceAnalysis?.mechanismOverrides || {}).length}
            </div>
            <div className="text-sm text-orange-600">Overrides Recommended</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-700">
              {resistanceAnalysis?.warnings?.length || 0}
            </div>
            <div className="text-sm text-red-600">Clinical Alerts</div>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {resistanceAnalysis?.warnings && resistanceAnalysis.warnings.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-800 mb-3">⚠️ Clinical Warnings</h3>
          <div className="space-y-2">
            {resistanceAnalysis.warnings.map((warning, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  warning.level === 'high' ? 'bg-red-100 text-red-700' :
                  warning.level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {warning.level?.toUpperCase()}
                </span>
                <p className="text-sm text-red-700">{warning.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detected Mechanisms */}
      {resistanceAnalysis?.detectedPatterns && resistanceAnalysis.detectedPatterns.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              🧬 Detected Resistance Mechanisms
            </h3>
            <p className="text-sm text-gray-600">
              Click on mechanisms to learn more about their clinical implications
            </p>
          </div>

          <div className="p-6 space-y-4">
            {resistanceAnalysis.detectedPatterns.map((pattern, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setSelectedMechanism(selectedMechanism === index ? null : index)}
                  className="w-full p-4 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{MECHANISM_ICONS[pattern.type] || '🔬'}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900 capitalize">
                          {pattern.type.replace('_', ' ')} Production
                        </h4>
                        <p className="text-sm text-gray-600">
                          {pattern.evidence.length} evidence point{pattern.evidence.length !== 1 ? 's' : ''} detected
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                        CONFIDENCE_COLORS[pattern.confidence]
                      }`}>
                        {getConfidenceIcon(pattern.confidence)} {pattern.confidence.toUpperCase()}
                      </span>
                      <svg 
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          selectedMechanism === index ? 'rotate-180' : ''
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>

                {selectedMechanism === index && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Evidence */}
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">🔍 Evidence Found:</h5>
                        <ul className="space-y-1">
                          {formatEvidence(pattern.evidence)}
                        </ul>
                      </div>

                      {/* Clinical Implications */}
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">⚕️ Clinical Implications:</h5>
                        <ul className="space-y-1">
                          {pattern.clinicalImplications.map((implication, idx) => (
                            <li key={idx} className="text-sm text-gray-700">
                              • {implication}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Educational Notes */}
                    {pattern.educationalNotes && pattern.educationalNotes.length > 0 && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                        <button
                          onClick={() => setShowEducational(prev => ({
                            ...prev,
                            [index]: !prev[index]
                          }))}
                          className="flex items-center text-blue-800 font-medium text-sm"
                        >
                          💡 Educational Notes
                          <svg 
                            className={`w-4 h-4 ml-1 transition-transform ${
                              showEducational[index] ? 'rotate-180' : ''
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {showEducational[index] && (
                          <div className="mt-2 space-y-1">
                            {pattern.educationalNotes.map((note, idx) => (
                              <p key={idx} className="text-xs text-blue-700">
                                • {note}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mechanism-Based Overrides */}
      {resistanceAnalysis?.mechanismOverrides && Object.keys(resistanceAnalysis.mechanismOverrides).length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-orange-50 px-6 py-3 border-b border-orange-200">
            <h3 className="text-lg font-semibold text-orange-800">
              ⚡ Mechanism-Based Interpretation Overrides
            </h3>
            <p className="text-sm text-orange-700">
              These are the "aha moments" - when resistance mechanisms override lab susceptibility results
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Antibiotic</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lab Result</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Override To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Accept</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.entries(resistanceAnalysis.mechanismOverrides).map(([antibiotic, override]) => (
                  <tr key={antibiotic} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 capitalize">
                      {antibiotic.replace(/-/g, '-')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        override.oldInterpretation === 'S' ? 'bg-green-100 text-green-700' :
                        override.oldInterpretation === 'I' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {override.oldInterpretation}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        override.newInterpretation === 'S' ? 'bg-green-100 text-green-700' :
                        override.newInterpretation === 'I' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {override.newInterpretation}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                      {override.reason}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={acceptedOverrides[antibiotic] || false}
                            onChange={(e) => handleOverrideToggle(antibiotic, e.target.checked)}
                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">Accept</span>
                        </label>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${
                          CONFIDENCE_COLORS[override.confidence]
                        }`}>
                          {override.confidence}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Mechanisms Detected */}
      {resistanceAnalysis && (!resistanceAnalysis.detectedPatterns || resistanceAnalysis.detectedPatterns.length === 0) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">🔍</div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">No Resistance Mechanisms Detected</h3>
            <p className="text-blue-700 mb-4">
              The current susceptibility pattern appears consistent with wild-type organisms without major resistance mechanisms.
            </p>
          </div>
          
          {/* Detailed Analysis Info */}
          <div className="bg-white rounded border p-4 text-left">
            <h4 className="font-medium text-blue-800 mb-2">Analysis Details:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Analyzed {resistanceAnalysis.totalAntibiotics} antibiotics</li>
              <li>• Scanned for: ESBL, AmpC, MRSA, VRE, MLSᵦ, Carbapenemase patterns</li>
              <li>• Overall confidence: {resistanceAnalysis.overallConfidence}</li>
              {resistanceAnalysis.warnings && resistanceAnalysis.warnings.length > 0 && (
                <li>• {resistanceAnalysis.warnings.length} warning(s) generated</li>
              )}
            </ul>
            
            {/* Show what the algorithm was looking for */}
            <div className="mt-3 p-2 bg-blue-25 rounded text-xs">
              <strong>For ESBL detection, algorithm looks for:</strong>
              <ul className="ml-4 mt-1">
                <li>• Resistance to 3rd gen cephalosporins (ceftriaxone, ceftazidime, cefotaxime)</li>
                <li>• Sensitivity to carbapenems</li>
                <li>• Enhancement by beta-lactamase inhibitors</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          {resistanceAnalysis ? (
            <span className="text-green-600 font-medium">
              ✅ Resistance analysis complete - ready for treatment recommendations
            </span>
          ) : (
            <span>Analyzing resistance patterns...</span>
          )}
        </div>
        
        <button
          onClick={handleNext}
          disabled={!resistanceAnalysis}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            resistanceAnalysis
              ? 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-2 focus:ring-purple-500'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Generate Treatment Recommendations →
        </button>
      </div>
    </div>
  );
};

export default Phase3_ResistanceMechanisms;