// src/components/Phase4_TherapeuticComparison.jsx
// --- Phase 4: Advanced Therapeutic Strategy Comparison ---
// Specialist-level side-by-side analysis of treatment options

import React, { useState, useMemo } from 'react';

const SCORE_COLORS = {
  excellent: 'bg-green-100 text-green-800 border-green-200',
  good: 'bg-blue-100 text-blue-800 border-blue-200',
  fair: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  poor: 'bg-red-100 text-red-800 border-red-200'
};

const RECOMMENDATION_COLORS = {
  preferred: 'bg-green-50 border-green-300',
  alternative: 'bg-blue-50 border-blue-300',
  consider: 'bg-yellow-50 border-yellow-300',
  avoid: 'bg-red-50 border-red-300'
};

const RECOMMENDATION_ICONS = {
  preferred: '🟢',
  alternative: '🔵',
  consider: '🟡',
  avoid: '🔴'
};

export const Phase4_TherapeuticComparison = ({ results, antibiogramData }) => {
  console.log('🏥 Phase4_TherapeuticComparison received results:', results);
  console.log('🏥 Results.strategies:', results?.strategies);
  console.log('🏥 Results.strategies length:', results?.strategies?.length);
  
  const [selectedStrategies, setSelectedStrategies] = useState([]);
  const [viewMode, setViewMode] = useState('comparison'); // 'comparison' | 'details'
  const [sortBy, setSortBy] = useState('totalScore');
  const [filterBy, setFilterBy] = useState('all');

  // Filter and sort strategies
  const displayStrategies = useMemo(() => {
    let filtered = results.strategies || [];
    
    // Apply filters
    if (filterBy !== 'all') {
      filtered = filtered.filter(strategy => strategy.recommendation === filterBy);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'totalScore') {
        return b.totalScore - a.totalScore;
      } else if (sortBy === 'efficacy') {
        return b.scores.efficacy - a.scores.efficacy;
      } else if (sortBy === 'safety') {
        return b.scores.safety - a.scores.safety;
      } else if (sortBy === 'stewardship') {
        return b.scores.stewardship - a.scores.stewardship;
      }
      return 0;
    });
    
    return filtered;
  }, [results.strategies, filterBy, sortBy]);

  const handleStrategySelect = (strategy, selected) => {
    if (selected) {
      setSelectedStrategies(prev => [...prev, strategy]);
    } else {
      setSelectedStrategies(prev => prev.filter(s => s.primary !== strategy.primary));
    }
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'poor';
  };

  const getScoreColor = (score) => {
    return SCORE_COLORS[getScoreLabel(score)];
  };

  const formatAgentList = (agents) => {
    return agents.map(agent => agent.replace(/-/g, '-')).join(' + ');
  };

  const copyRecommendations = () => {
    const preferred = displayStrategies.filter(s => s.recommendation === 'preferred').slice(0, 3);
    const text = `Antibiogram Analysis - ${antibiogramData.organism?.name}

PREFERRED TREATMENTS:
${preferred.map((strategy, index) => 
  `${index + 1}. ${formatAgentList(strategy.agents)} (Score: ${strategy.totalScore}/100)
     Rationale: ${strategy.rationale}
     Key considerations: Efficacy ${strategy.scores.efficacy}/100, Safety ${strategy.scores.safety}/100`
).join('\n\n')}

Analysis Date: ${new Date().toLocaleDateString()}
Infection Site: ${antibiogramData.infectionSite}
${antibiogramData.detectedMechanisms?.length > 0 ? 
  `Resistance Mechanisms: ${antibiogramData.detectedMechanisms.map(m => m.type).join(', ')}` : 
  'No resistance mechanisms detected'
}`;

    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Phase Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4">
            4
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Therapeutic Strategy Comparison</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto">
          Specialist-level analysis comparing treatment options across multiple clinical dimensions. 
          Each strategy is scored on efficacy, safety, stewardship, and practical considerations.
        </p>
      </div>

      {/* Analysis Summary */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-green-800">
            📊 Therapeutic Analysis Summary
          </h2>
          <button
            onClick={copyRecommendations}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            📋 Copy Summary
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-700">
              {results.metadata?.totalOptions || 0}
            </div>
            <div className="text-sm text-green-600">Total Options</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-700">
              {results.metadata?.preferredOptions || 0}
            </div>
            <div className="text-sm text-blue-600">Preferred</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-700">
              {antibiogramData.detectedMechanisms?.length || 0}
            </div>
            <div className="text-sm text-purple-600">Resistance Mechanisms</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700">
              {results.recommendations?.firstLine?.length || 0}
            </div>
            <div className="text-sm text-gray-600">First-Line Options</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Options</option>
                <option value="preferred">Preferred Only</option>
                <option value="alternative">Alternatives</option>
                <option value="consider">Consider</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500"
              >
                <option value="totalScore">Total Score</option>
                <option value="efficacy">Efficacy</option>
                <option value="safety">Safety</option>
                <option value="stewardship">Stewardship</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">View:</span>
            <div className="bg-gray-100 p-1 rounded">
              <button
                onClick={() => setViewMode('comparison')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  viewMode === 'comparison'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Comparison
              </button>
              <button
                onClick={() => setViewMode('details')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  viewMode === 'details'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Strategy Comparison Table */}
      {viewMode === 'comparison' && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Select
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Strategy
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Recommendation
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Total Score
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Efficacy
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Safety
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Stewardship
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Pharmacology
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Key Benefits
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayStrategies.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-4 py-12 text-center">
                      <div className="text-gray-500">
                        <div className="text-4xl mb-3">📊</div>
                        <p className="text-lg font-medium text-gray-700 mb-2">No therapeutic strategies generated</p>
                        <p className="text-sm">The antibiogram analysis may need more data or the organism/resistance pattern may require manual review.</p>
                      </div>
                    </td>
                  </tr>
                )}
                {displayStrategies.map((strategy, index) => (
                  <tr 
                    key={`${strategy.primary}-${index}`}
                    className={`hover:bg-gray-50 ${RECOMMENDATION_COLORS[strategy.recommendation]}`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedStrategies.some(s => s.primary === strategy.primary)}
                        onChange={(e) => handleStrategySelect(strategy, e.target.checked)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-900">
                          {formatAgentList(strategy.agents)}
                        </div>
                        <div className="text-sm text-gray-500 capitalize">
                          {strategy.type.replace('_', ' ')}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                        RECOMMENDATION_COLORS[strategy.recommendation]
                      }`}>
                        {RECOMMENDATION_ICONS[strategy.recommendation]} {strategy.recommendation}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-sm font-medium border ${
                        getScoreColor(strategy.totalScore)
                      }`}>
                        {strategy.totalScore}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        getScoreColor(strategy.scores.efficacy)
                      }`}>
                        {Math.round(strategy.scores.efficacy)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        getScoreColor(strategy.scores.safety)
                      }`}>
                        {Math.round(strategy.scores.safety)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        getScoreColor(strategy.scores.stewardship)
                      }`}>
                        {Math.round(strategy.scores.stewardship)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        getScoreColor(strategy.scores.pharmacology)
                      }`}>
                        {Math.round(strategy.scores.pharmacology)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-600 max-w-xs">
                        {strategy.rationale || 'Standard therapy option'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detailed Strategy Cards */}
      {viewMode === 'details' && (
        <div className="space-y-6">
          {displayStrategies.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <div className="text-gray-500">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-lg font-medium text-gray-700 mb-2">No detailed strategies available</p>
                <p className="text-sm">Treatment recommendations could not be generated. Consider manual interpretation or additional susceptibility testing.</p>
              </div>
            </div>
          )}
          {displayStrategies.slice(0, 6).map((strategy, index) => (
            <div 
              key={`${strategy.primary}-${index}`}
              className={`border rounded-lg overflow-hidden ${RECOMMENDATION_COLORS[strategy.recommendation]}`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{RECOMMENDATION_ICONS[strategy.recommendation]}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {formatAgentList(strategy.agents)}
                      </h3>
                      <p className="text-sm text-gray-600 capitalize">
                        {strategy.type.replace('_', ' ')} • {strategy.recommendation} option
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      strategy.totalScore >= 80 ? 'text-green-600' :
                      strategy.totalScore >= 60 ? 'text-blue-600' :
                      strategy.totalScore >= 40 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {strategy.totalScore}
                    </div>
                    <div className="text-xs text-gray-500">Total Score</div>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {Object.entries(strategy.scores).map(([category, score]) => (
                    <div key={category} className="text-center">
                      <div className={`text-lg font-semibold ${
                        score >= 80 ? 'text-green-600' :
                        score >= 60 ? 'text-blue-600' :
                        score >= 40 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {Math.round(score)}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {category.replace('_', ' ')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Rationale */}
                {strategy.rationale && (
                  <div className="bg-white bg-opacity-60 p-3 rounded border">
                    <h4 className="font-medium text-gray-900 mb-1">Clinical Rationale:</h4>
                    <p className="text-sm text-gray-700">{strategy.rationale}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Strategy Comparison */}
      {selectedStrategies.length > 1 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🔀 Selected Strategy Comparison ({selectedStrategies.length})
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {selectedStrategies.map((strategy, index) => (
              <div key={`selected-${index}`} className="border border-gray-200 rounded p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  {formatAgentList(strategy.agents)}
                </h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Score:</span>
                    <span className="font-medium">{strategy.totalScore}/100</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Efficacy:</span>
                    <span>{Math.round(strategy.scores.efficacy)}/100</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Safety:</span>
                    <span>{Math.round(strategy.scores.safety)}/100</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Stewardship:</span>
                    <span>{Math.round(strategy.scores.stewardship)}/100</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clinical Recommendations */}
      {results.recommendations && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            💊 Clinical Recommendations
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* First-Line */}
            {results.recommendations.firstLine && results.recommendations.firstLine.length > 0 && (
              <div>
                <h4 className="font-medium text-green-800 mb-2">🥇 First-Line Options:</h4>
                <ul className="space-y-2">
                  {results.recommendations.firstLine.map((strategy, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      • {formatAgentList(strategy.agents)} (Score: {strategy.totalScore})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Alternatives */}
            {results.recommendations.alternatives && results.recommendations.alternatives.length > 0 && (
              <div>
                <h4 className="font-medium text-blue-800 mb-2">🥈 Alternative Options:</h4>
                <ul className="space-y-2">
                  {results.recommendations.alternatives.map((strategy, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      • {formatAgentList(strategy.agents)} (Score: {strategy.totalScore})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Duration and Monitoring */}
          {results.recommendations.durationGuidance && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <h4 className="font-medium text-blue-800 mb-1">⏱️ Duration Guidance:</h4>
              <p className="text-sm text-blue-700">{results.recommendations.durationGuidance}</p>
            </div>
          )}
        </div>
      )}

      {/* Export Options */}
      <div className="flex items-center justify-center pt-6 border-t border-gray-200">
        <div className="flex space-x-4">
          <button
            onClick={copyRecommendations}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            📋 Copy Clinical Summary
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🖨️ Print Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default Phase4_TherapeuticComparison;