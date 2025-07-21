// src/components/Phase4_SimpleRecommendations.jsx
// --- Phase 4: Simple Mode Recommendations ---
// Clear, concise treatment recommendations for clinical practice

import React, { useState, useMemo } from 'react';

const SEVERITY_COLORS = {
  high: 'bg-red-100 text-red-800 border-red-300',
  moderate: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  low: 'bg-green-100 text-green-800 border-green-300'
};

export const Phase4_SimpleRecommendations = ({ results, antibiogramData }) => {
  const [showDetails, setShowDetails] = useState({});

  // Extract key recommendations from results
  const recommendations = useMemo(() => {
    if (!results || !results.strategies) return { firstLine: [], alternatives: [], avoid: [] };

    const strategies = results.strategies;
    
    return {
      firstLine: strategies.filter(s => s.recommendation === 'preferred').slice(0, 3),
      alternatives: strategies.filter(s => s.recommendation === 'alternative').slice(0, 3),
      avoid: strategies.filter(s => s.recommendation === 'avoid'),
      durationGuidance: results.recommendations?.durationGuidance || 'Standard course duration based on infection type'
    };
  }, [results]);

  // Determine infection severity based on site and mechanisms
  const infectionSeverity = useMemo(() => {
    const site = antibiogramData.infectionSite || '';
    const mechanisms = antibiogramData.detectedMechanisms || [];
    
    if (site.includes('CNS') || site.includes('endocarditis') || 
        mechanisms.some(m => m.type === 'carbapenemase')) {
      return 'high';
    } else if (site.includes('bacteremia') || site.includes('VAP') ||
               mechanisms.some(m => ['esbl', 'mrsa', 'vre'].includes(m.type))) {
      return 'moderate';
    }
    return 'low';
  }, [antibiogramData]);

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return '🔴';
      case 'moderate': return '🟡';
      default: return '🟢';
    }
  };

  const getSeverityLabel = (severity) => {
    switch (severity) {
      case 'high': return 'High Severity';
      case 'moderate': return 'Moderate Severity';
      default: return 'Standard Severity';
    }
  };

  const formatAgentName = (agent) => {
    return agent.replace(/-/g, '/').split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const toggleDetails = (section) => {
    setShowDetails(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const copyRecommendations = () => {
    const text = `ANTIBIOGRAM RECOMMENDATIONS

Patient: ${antibiogramData.organism?.name || 'Unknown'}
Infection Site: ${antibiogramData.infectionSite || 'Unknown'}
Severity: ${getSeverityLabel(infectionSeverity)}
Analysis Date: ${new Date().toLocaleDateString()}

FIRST-LINE TREATMENTS:
${recommendations.firstLine.map((rec, index) => 
  `${index + 1}. ${formatAgentName(rec.primary)} ${rec.type === 'combination' ? `+ ${rec.agents.slice(1).map(formatAgentName).join(' + ')}` : ''}`
).join('\n')}

ALTERNATIVE OPTIONS:
${recommendations.alternatives.map((rec, index) => 
  `${index + 1}. ${formatAgentName(rec.primary)} ${rec.type === 'combination' ? `+ ${rec.agents.slice(1).map(formatAgentName).join(' + ')}` : ''}`
).join('\n')}

${antibiogramData.detectedMechanisms?.length > 0 ? 
  `RESISTANCE MECHANISMS DETECTED:\n${antibiogramData.detectedMechanisms.map(m => `• ${m.type.toUpperCase()}`).join('\n')}\n` : 
  ''
}DURATION: ${recommendations.durationGuidance}

⚠️ Always consider local guidelines, patient allergies, and clinical context.`;

    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4">
            4
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Treatment Recommendations</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Clear, evidence-based recommendations for your antibiogram results. 
          These are ranked by effectiveness and stewardship principles.
        </p>
      </div>

      {/* Patient Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">🦠 Organism</h3>
            <p className="text-gray-700">{antibiogramData.organism?.name || 'Unknown'}</p>
            <p className="text-sm text-gray-500">{antibiogramData.organism?.gramStain}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">🎯 Infection Site</h3>
            <p className="text-gray-700">{antibiogramData.infectionSite || 'Unknown'}</p>
            <div className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium border ${SEVERITY_COLORS[infectionSeverity]}`}>
              {getSeverityIcon(infectionSeverity)} {getSeverityLabel(infectionSeverity)}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">🛡️ Resistance Status</h3>
            {antibiogramData.detectedMechanisms?.length > 0 ? (
              <div className="space-y-1">
                {antibiogramData.detectedMechanisms.slice(0, 2).map((mechanism, index) => (
                  <div key={index} className="text-sm">
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                      {mechanism.type.toUpperCase()}
                    </span>
                  </div>
                ))}
                {antibiogramData.detectedMechanisms.length > 2 && (
                  <p className="text-xs text-gray-500">
                    +{antibiogramData.detectedMechanisms.length - 2} more
                  </p>
                )}
              </div>
            ) : (
              <p className="text-green-700 text-sm">No major resistance mechanisms detected</p>
            )}
          </div>
        </div>
      </div>

      {/* First-Line Recommendations */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg overflow-hidden">
        <div className="bg-green-100 px-6 py-3 border-b border-green-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-green-800">
              🥇 First-Line Treatments
            </h2>
            <span className="text-sm text-green-600">
              {recommendations.firstLine.length} option{recommendations.firstLine.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          {recommendations.firstLine.length > 0 ? (
            <div className="space-y-4">
              {recommendations.firstLine.map((treatment, index) => (
                <div key={index} className="bg-white border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {formatAgentName(treatment.primary)}
                          {treatment.type === 'combination' && treatment.agents.length > 1 && (
                            <span className="text-gray-600"> + {treatment.agents.slice(1).map(formatAgentName).join(' + ')}</span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-600 capitalize">
                          {treatment.type.replace('_', ' ')} therapy
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-semibold">Score: {treatment.totalScore}/100</div>
                      <div className="text-xs text-gray-500">Preferred option</div>
                    </div>
                  </div>
                  
                  {treatment.rationale && (
                    <div className="bg-green-50 p-3 rounded border border-green-200 mt-3">
                      <p className="text-sm text-green-800">
                        <strong>Why this works:</strong> {treatment.rationale}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No First-Line Options Available</h3>
              <p className="text-gray-600">
                This organism shows extensive resistance. Consider infectious disease consultation.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Alternative Options */}
      {recommendations.alternatives.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-blue-50 px-6 py-3 border-b border-blue-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-blue-800">
              🥈 Alternative Options
            </h2>
            <button
              onClick={() => toggleDetails('alternatives')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              {showDetails.alternatives ? 'Hide Details' : 'Show Details'}
            </button>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.alternatives.map((treatment, index) => (
                <div key={index} className="border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {formatAgentName(treatment.primary)}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 capitalize">
                      {treatment.type.replace('_', ' ')}
                    </span>
                    <span className="text-sm font-medium text-blue-700">
                      {treatment.totalScore}/100
                    </span>
                  </div>
                  
                  {showDetails.alternatives && treatment.rationale && (
                    <div className="mt-2 text-xs text-gray-600">
                      {treatment.rationale}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Avoid Section */}
      {recommendations.avoid.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-red-800">❌ Antibiotics to Avoid</h3>
            <button
              onClick={() => toggleDetails('avoid')}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              {showDetails.avoid ? 'Hide' : 'Show'} ({recommendations.avoid.length})
            </button>
          </div>
          
          {showDetails.avoid && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {recommendations.avoid.map((treatment, index) => (
                <div key={index} className="text-sm text-red-700 bg-red-100 px-2 py-1 rounded">
                  {formatAgentName(treatment.primary)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Clinical Guidance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Duration */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">⏱️ Duration Guidance</h3>
          <p className="text-blue-700 text-sm">{recommendations.durationGuidance}</p>
        </div>

        {/* Monitoring */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-purple-800 mb-2">🔍 Monitoring</h3>
          <ul className="text-purple-700 text-sm space-y-1">
            <li>• Monitor clinical response within 48-72 hours</li>
            <li>• Check for adverse effects</li>
            <li>• Consider de-escalation when possible</li>
            {infectionSeverity === 'high' && (
              <li>• Consider infectious disease consultation</li>
            )}
          </ul>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h3 className="font-semibold text-amber-800 mb-2">⚠️ Important Clinical Notes</h3>
        <ul className="text-amber-700 text-sm space-y-1">
          <li>• Always consider patient allergies and drug interactions</li>
          <li>• Adjust dosing for renal/hepatic function as needed</li>
          <li>• Follow local antibiogram and guidelines</li>
          <li>• Consider source control for optimal outcomes</li>
          {antibiogramData.detectedMechanisms?.length > 0 && (
            <li>• Resistance mechanisms detected - follow recommendations carefully</li>
          )}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center space-x-4 pt-6 border-t border-gray-200">
        <button
          onClick={copyRecommendations}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          📋 Copy Recommendations
        </button>
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          🖨️ Print Results
        </button>
      </div>
    </div>
  );
};

export default Phase4_SimpleRecommendations;