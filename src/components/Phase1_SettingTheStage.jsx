// src/components/Phase1_SettingTheStage.jsx
// --- Phase 1: Setting the Stage - Gathering the Clues ---
// Sophisticated organism/site selection with intrinsic resistance filtering

import React, { useState, useEffect, useMemo } from 'react';
import { getBacteriaDatabase, getSearchableList } from '../data/microbiologyData.js';
import { CLSIBreakpointEngine } from '../engines/CLSIBreakpointEngine.js';
import { getAntibiogramSyndromes } from '../data/antibiogramSyndromes.js';

// Load syndrome categories from comprehensive database
const SYNDROME_CATEGORIES = getAntibiogramSyndromes();

export const Phase1_SettingTheStage = ({ onComplete, initialData = {} }) => {
  const [selectedOrganism, setSelectedOrganism] = useState(initialData.organism || null);
  const [infectionSite, setInfectionSite] = useState(initialData.infectionSite || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [intrinsicResistance, setIntrinsicResistance] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize engines and databases
  const clsiEngine = useMemo(() => new CLSIBreakpointEngine(), []);
  const bacteriaDatabase = useMemo(() => getBacteriaDatabase(), []);
  const searchableList = useMemo(() => getSearchableList(bacteriaDatabase), [bacteriaDatabase]);

  // Filter bacteria based on search term
  const filteredBacteria = useMemo(() => {
    if (!searchTerm.trim()) return []; // Show nothing until user searches
    
    const term = searchTerm.toLowerCase();
    return searchableList.filter(bacteria => 
      (bacteria.name && bacteria.name.toLowerCase().includes(term)) ||
      (bacteria.genus && bacteria.genus.toLowerCase().includes(term)) ||
      (bacteria.gramStain && bacteria.gramStain.toLowerCase().includes(term)) ||
      (bacteria.aliases && Array.isArray(bacteria.aliases) && bacteria.aliases.some(alias => typeof alias === 'string' && alias.toLowerCase().includes(term))) ||
      (bacteria.searchTerms && bacteria.searchTerms.includes(term))
    ).slice(0, 10); // Limit to 10 results
  }, [searchableList, searchTerm]);

  // Load intrinsic resistance when organism selected
  useEffect(() => {
    if (selectedOrganism) {
      setIsLoading(true);
      try {
        const intrinsic = clsiEngine.getIntrinsicResistance(selectedOrganism.id);
        setIntrinsicResistance(intrinsic);
      } catch (error) {
        console.error('Error loading intrinsic resistance:', error);
        setIntrinsicResistance([]);
      } finally {
        setIsLoading(false);
      }
    }
  }, [selectedOrganism, clsiEngine]);

  const handleOrganismSelect = (bacteria) => {
    setSelectedOrganism(bacteria);
    setSearchTerm('');
  };

  const handleSiteSelect = (siteValue) => {
    setInfectionSite(siteValue);
  };

  const handleNext = () => {
    if (selectedOrganism && infectionSite) {
      onComplete({
        organism: selectedOrganism,
        infectionSite: infectionSite,
        intrinsicResistance: intrinsicResistance
      });
    }
  };

  const getSelectedSiteDetails = () => {
    if (!infectionSite) return null;
    
    for (const [categoryKey, category] of Object.entries(SYNDROME_CATEGORIES)) {
      const option = category.options.find(opt => opt.value === infectionSite);
      if (option) {
        return {
          ...option,
          category: category.label,
          categoryColor: category.color
        };
      }
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Phase Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4">
            1
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Setting the Stage</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Before looking at any antibiotics, we need to understand the context. 
          Like an infectious disease specialist, we start by identifying the organism and infection site.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-2 ${selectedOrganism ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className={`font-medium ${selectedOrganism ? 'text-green-700' : 'text-gray-500'}`}>
                Organism Selected
              </span>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-2 ${infectionSite ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className={`font-medium ${infectionSite ? 'text-green-700' : 'text-gray-500'}`}>
                Infection Site Selected
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Organism Selection */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            🦠 Step 1: Identify the Organism
          </h2>
          
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Type to search organisms (e.g. 'E. coli', 'Klebsiella', 'gram positive')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute right-3 top-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Selected Organism Display */}
          {selectedOrganism && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-green-800">{selectedOrganism.name || 'Unknown'}</h3>
                  <p className="text-sm text-green-600">
                    {selectedOrganism.gramStain || 'Unknown'} • {selectedOrganism.clsiCategory || 'Unknown'}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrganism(null)}
                  className="text-green-600 hover:text-green-800"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Bacteria List */}
          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            {!searchTerm.trim() && (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-3">🔬</div>
                <p className="text-lg font-medium text-gray-700 mb-2">Search for an organism</p>
                <p className="text-sm">Start typing to find bacteria, genus, or use terms like "gram positive", "enterobacterales"</p>
                <div className="mt-4 text-xs text-gray-400">
                  <p>Examples: "E. coli", "Staph", "gram negative", "Klebsiella"</p>
                </div>
              </div>
            )}
            {searchTerm.trim() && filteredBacteria.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-3">🚫</div>
                <p className="text-lg font-medium text-gray-700 mb-2">No organisms found</p>
                <p className="text-sm">Try different search terms or check spelling</p>
              </div>
            )}
            {filteredBacteria.map((bacteria) => (
              <button
                key={bacteria.id}
                onClick={() => handleOrganismSelect(bacteria)}
                className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:bg-blue-50 focus:outline-none"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{bacteria.name || 'Unknown'}</h4>
                    <p className="text-sm text-gray-500">
                      {bacteria.gramStain || 'Unknown'} • {bacteria.taxonomy?.genus || bacteria.genus || 'Unknown'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      (bacteria.gramStain || '').includes('positive') 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {bacteria.gramStain || 'Unknown'}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Infection Site Selection */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            🎯 Step 2: Select Infection Site
          </h2>

          {/* Selected Site Display */}
          {infectionSite && (
            <div className={`border rounded-lg p-4 mb-4 ${getSelectedSiteDetails()?.categoryColor || 'bg-gray-50'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{getSelectedSiteDetails()?.label}</h3>
                  <p className="text-sm text-gray-600">{getSelectedSiteDetails()?.category}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      getSelectedSiteDetails()?.severity === 3 ? 'bg-red-100 text-red-700' :
                      getSelectedSiteDetails()?.severity === 2 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      Severidad: {getSelectedSiteDetails()?.severity === 3 ? 'Alta' : 
                                 getSelectedSiteDetails()?.severity === 2 ? 'Moderada' : 'Leve'}
                    </span>
                  </div>
                  {getSelectedSiteDetails()?.stewardshipNotes && (
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                      <strong>Stewardship:</strong> {getSelectedSiteDetails()?.stewardshipNotes}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setInfectionSite(null)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Site Categories */}
          <div className="space-y-3">
            {Object.entries(SYNDROME_CATEGORIES).map(([categoryKey, category]) => {
              const isExpanded = expandedCategory === categoryKey;
              const isSelected = infectionSite && category.options.some(opt => opt.value === infectionSite);

              return (
                <div key={categoryKey} className={`border rounded-lg ${category.color}`}>
                  <button
                    onClick={() => setExpandedCategory(isExpanded ? null : categoryKey)}
                    className="w-full p-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{category.icon}</span>
                        <div>
                          <h4 className="font-semibold text-gray-800">{category.label}</h4>
                          <p className="text-xs text-gray-600 mt-1">{category.clinicalNote}</p>
                        </div>
                        {isSelected && (
                          <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full ml-2">
                            Seleccionado
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            {category.bactericidalRequired && (
                              <span className="bg-red-100 text-red-700 px-2 py-1 rounded">Bactericida</span>
                            )}
                            {category.dosing === 'high_dose' && (
                              <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">Dosis alta</span>
                            )}
                            {category.penetrationRequirement === 'CNS_critical' && (
                              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">BHE crítica</span>
                            )}
                          </div>
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
                      </div>
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div className="px-4 pb-4">
                      <div className="grid grid-cols-1 gap-2">
                        {category.options.map((option) => (
                          <label key={option.value} className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-white hover:bg-opacity-60">
                            <input
                              type="radio"
                              name="infectionSite"
                              value={option.value}
                              checked={infectionSite === option.value}
                              onChange={(e) => handleSiteSelect(e.target.value)}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                            />
                            <div className="flex-1">
                              <span className="text-sm font-medium text-gray-800">{option.label}</span>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`text-xs px-2 py-1 rounded ${
                                  option.severity === 3 ? 'bg-red-100 text-red-700' :
                                  option.severity === 2 ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  Severidad: {option.severity === 3 ? 'Alta' : option.severity === 2 ? 'Moderada' : 'Leve'}
                                </span>
                              </div>
                              {option.stewardshipNotes && (
                                <p className="text-xs text-blue-600 mt-1 italic">
                                  💡 {option.stewardshipNotes}
                                </p>
                              )}
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
        </div>
      </div>

      {/* Intrinsic Resistance Panel */}
      {selectedOrganism && intrinsicResistance.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-amber-800 mb-3">
            🛡️ Intrinsic Resistance Alert
          </h3>
          <p className="text-amber-700 mb-4">
            <strong>{selectedOrganism.name}</strong> is naturally resistant to these antibiotics. 
            They will be excluded from testing to prevent clinical errors.
          </p>
          <div className="flex flex-wrap gap-2">
            {intrinsicResistance.map((antibiotic, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium"
              >
                {antibiotic}
              </span>
            ))}
          </div>
          <div className="mt-3 p-3 bg-amber-100 rounded border-l-4 border-amber-400">
            <p className="text-xs text-amber-700">
              💡 <strong>Educational Note:</strong> Intrinsic resistance is nature's way of protecting bacteria. 
              These antibiotics simply cannot work against this organism due to its natural biology.
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          {selectedOrganism && infectionSite ? (
            <span className="text-green-600 font-medium">✅ Ready to proceed to MIC interpretation</span>
          ) : (
            <span>Please select both organism and infection site to continue</span>
          )}
        </div>
        
        <button
          onClick={handleNext}
          disabled={!selectedOrganism || !infectionSite || isLoading}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            selectedOrganism && infectionSite && !isLoading
              ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? 'Loading...' : 'Continue to MIC Input →'}
        </button>
      </div>
    </div>
  );
};

export default Phase1_SettingTheStage;