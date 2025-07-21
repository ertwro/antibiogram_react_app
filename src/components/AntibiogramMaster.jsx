// src/components/AntibiogramMaster.jsx
// --- Master Antibiogram Component ---
// Orchestrates the complete 4-phase specialist workflow

import React, { useState, useEffect } from 'react';
import { MasterAntibiogramEngine } from '../engines/MasterAntibiogramEngine.js';
import Phase1_SettingTheStage from './Phase1_SettingTheStage.jsx';
import Phase2_InitialInterpretation from './Phase2_InitialInterpretation.jsx';
import Phase3_ResistanceMechanisms from './Phase3_ResistanceMechanisms.jsx';
import Phase4_TherapeuticComparison from './Phase4_TherapeuticComparison.jsx';
import Phase4_SimpleRecommendations from './Phase4_SimpleRecommendations.jsx';

const PHASES = {
  1: 'Setting the Stage',
  2: 'Initial Interpretation', 
  3: 'Resistance Mechanisms',
  4: 'Final Recommendations'
};

export const AntibiogramMaster = ({ onBackToLanding }) => {
  const [mode, setMode] = useState('simple'); // 'simple' | 'advanced'
  const [currentPhase, setCurrentPhase] = useState(1);
  const [antibiogramData, setAntibiogramData] = useState({});
  const [results, setResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [engine] = useState(() => new MasterAntibiogramEngine());

  const advancePhase = (nextPhase, phaseData) => {
    setAntibiogramData(prev => ({ ...prev, ...phaseData }));
    setCurrentPhase(nextPhase);
  };

  const handlePhase1Complete = (data) => {
    advancePhase(2, {
      organism: data.organism,
      infectionSite: data.infectionSite,
      intrinsicResistance: data.intrinsicResistance
    });
  };

  const handlePhase2Complete = async (data) => {
    advancePhase(3, {
      micData: data.micData,
      interpretations: data.interpretations,
      warnings: data.warnings,
      interpretationSummary: data.interpretationSummary
    });
  };

  const handlePhase3Complete = async (data) => {
    setIsProcessing(true);
    
    try {
      // Run complete antibiogram interpretation
      const allData = { ...antibiogramData, ...data };
      
      console.log('🔄 Phase 3 complete, running final interpretation with data:', {
        organism: allData.organism?.id,
        infectionSite: allData.infectionSite,
        micDataKeys: Object.keys(allData.micData || {}),
        resistanceAnalysis: allData.resistanceAnalysis ? 'Present' : 'Missing',
        detectedMechanisms: allData.detectedMechanisms?.length || 0
      });

      const interpretation = await engine.interpretAntibiogram({
        organism: allData.organism.id,
        infectionSite: allData.infectionSite,
        micData: allData.micData,
        interpretations: allData.updatedInterpretations || allData.interpretations,
        resistanceAnalysis: allData.resistanceAnalysis,
        detectedMechanisms: allData.detectedMechanisms,
        patientData: {}, // Could be expanded with patient demographics
        localEpidemiology: {}, // Could be expanded with local resistance data
        mode: mode
      });

      console.log('✅ Antibiogram interpretation complete:', {
        success: interpretation.success,
        hasPhase4: !!interpretation.phases?.phase4,
        recommendations: interpretation.phases?.phase4?.mode || 'Unknown'
      });

      setResults(interpretation);
      advancePhase(4, data);
      
    } catch (error) {
      console.error('❌ Antibiogram interpretation failed:', error);
      
      // Create fallback results for development/debugging
      const fallbackResults = {
        success: false,
        error: error.message,
        phases: {
          phase4: {
            mode: mode,
            primaryRecommendation: {
              agents: ['Unable to generate recommendations'],
              rationale: `Error: ${error.message}`,
              totalScore: 0
            },
            alternatives: [],
            clinicalAlerts: ['System error - please review manually'],
            strategies: []
          }
        }
      };
      
      setResults(fallbackResults);
      advancePhase(4, data);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestart = () => {
    setCurrentPhase(1);
    setAntibiogramData({});
    setResults(null);
    setIsProcessing(false);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    // If we're already at phase 4, re-run interpretation with new mode
    if (currentPhase === 4 && results) {
      handlePhase3Complete(antibiogramData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBackToLanding}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">
                🧠 World-Class Antibiogram Interpretation
              </h1>
            </div>
            
            {/* Mode Selector */}
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => handleModeChange('simple')}
                  className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                    mode === 'simple'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Simple Mode
                </button>
                <button
                  onClick={() => handleModeChange('advanced')}
                  className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                    mode === 'advanced'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Advanced Mode
                </button>
              </div>
              
              {currentPhase > 1 && (
                <button
                  onClick={handleRestart}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Start Over
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mode Description */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className={`p-4 rounded-lg border ${
          mode === 'simple' 
            ? 'bg-blue-50 border-blue-200' 
            : 'bg-purple-50 border-purple-200'
        }`}>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              mode === 'simple' ? 'bg-blue-600' : 'bg-purple-600'
            }`}></div>
            <span className={`font-medium ${
              mode === 'simple' ? 'text-blue-800' : 'text-purple-800'
            }`}>
              {mode === 'simple' ? 'Simple Mode' : 'Advanced Mode'}
            </span>
          </div>
          <p className={`text-sm mt-1 ${
            mode === 'simple' ? 'text-blue-700' : 'text-purple-700'
          }`}>
            {mode === 'simple' 
              ? 'CLSI-compliant interpretation with clear, ranked recommendations based on resistance patterns.'
              : 'Specialist-level comparative analysis with side-by-side evaluation of therapeutic strategies.'
            }
          </p>
        </div>
      </div>

      {/* Phase Progress Indicator */}
      <div className="max-w-7xl mx-auto px-6 pb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            {Object.entries(PHASES).map(([phaseNum, phaseName]) => {
              const num = parseInt(phaseNum);
              const isActive = currentPhase === num;
              const isCompleted = currentPhase > num;
              const isUpcoming = currentPhase < num;
              
              return (
                <div key={phaseNum} className="flex items-center">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                      isCompleted 
                        ? 'bg-green-600 text-white' 
                        : isActive 
                        ? (mode === 'simple' ? 'bg-blue-600' : 'bg-purple-600') + ' text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {isCompleted ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        phaseNum
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className={`text-sm font-medium ${
                        isActive ? 'text-gray-900' : isCompleted ? 'text-green-700' : 'text-gray-500'
                      }`}>
                        Phase {phaseNum}
                      </h3>
                      <p className={`text-xs ${
                        isActive ? 'text-gray-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {phaseName}
                      </p>
                    </div>
                  </div>
                  
                  {num < 4 && (
                    <div className={`w-16 h-1 mx-4 rounded ${
                      currentPhase > num ? 'bg-green-300' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Phase Content */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        {isProcessing && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="inline-flex items-center space-x-3">
              <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg font-medium text-gray-900">
                Processing antibiogram with specialist-level intelligence...
              </span>
            </div>
            <p className="text-gray-600 mt-2">
              Analyzing resistance patterns and generating {mode} mode recommendations
            </p>
          </div>
        )}

        {!isProcessing && (
          <>
            {currentPhase === 1 && (
              <Phase1_SettingTheStage 
                onComplete={handlePhase1Complete}
                initialData={antibiogramData}
              />
            )}
            
            {currentPhase === 2 && (
              <Phase2_InitialInterpretation 
                organismData={antibiogramData.organism}
                infectionSite={antibiogramData.infectionSite}
                onComplete={handlePhase2Complete}
                initialData={antibiogramData}
              />
            )}
            
            {currentPhase === 3 && (
              <Phase3_ResistanceMechanisms 
                organismData={antibiogramData.organism}
                micData={antibiogramData.micData}
                interpretations={antibiogramData.interpretations}
                onComplete={handlePhase3Complete}
                initialData={antibiogramData}
              />
            )}
            
            {currentPhase === 4 && results && (
              <>
                {mode === 'simple' ? (
                  <Phase4_SimpleRecommendations 
                    results={results}
                    antibiogramData={antibiogramData}
                  />
                ) : (
                  <Phase4_TherapeuticComparison 
                    results={results}
                    antibiogramData={antibiogramData}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AntibiogramMaster;