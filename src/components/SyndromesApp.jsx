// src/components/SyndromesApp.jsx
// --- Professional Medical Syndromes Interface ---
// Advanced clinical decision support with copy functionality

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  getSyndromesDatabase, 
  getSyndromeCategories, 
  getSyndromesByCategory, 
  searchSyndromes, 
  getCategoryDisplayName 
} from '../data/generatedSyndromesIndex.js';

const SyndromesApp = ({ onBackToLanding }) => {
  const [currentView, setCurrentView] = useState('browse'); // browse or syndrome
  const [selectedSyndrome, setSelectedSyndrome] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allSyndromes, setAllSyndromes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedSection, setCopiedSection] = useState(null);
  const [copyTimeout, setCopyTimeout] = useState(null);
  
  // Browse mode state
  const [folderStructure, setFolderStructure] = useState({});
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [currentPath, setCurrentPath] = useState([]);

  // Build folder structure from file paths
  const buildFolderStructure = (syndromes) => {
    const structure = {};
    
    syndromes.forEach(syndrome => {
      if (!syndrome.filePath) return;
      
      // Extract path parts from filePath: ./syndromes_json/category/subcategory/file.json
      const pathParts = syndrome.filePath
        .replace('./syndromes_json/', '')
        .split('/')
        .filter(part => part && !part.endsWith('.json'));
      
      let current = structure;
      pathParts.forEach((part, index) => {
        if (!current[part]) {
          current[part] = {
            folders: {},
            files: [],
            path: pathParts.slice(0, index + 1),
            displayName: getCategoryDisplayName(part)
          };
        }
        if (index === pathParts.length - 1) {
          // This is the final folder containing the file
          current[part].files.push(syndrome);
        }
        current = current[part].folders;
      });
      
      // If no subfolders, add to root category
      if (pathParts.length === 1) {
        const category = pathParts[0];
        if (!structure[category]) {
          structure[category] = {
            folders: {},
            files: [],
            path: [category],
            displayName: getCategoryDisplayName(category)
          };
        }
        structure[category].files.push(syndrome);
      }
    });
    
    return structure;
  };

  // Load all syndromes for search and browse
  useEffect(() => {
    async function loadAllSyndromes() {
      try {
        const db = await getSyndromesDatabase();
        const all = Object.values(db).filter(syndrome => syndrome.title);
        setAllSyndromes(all);
        // Don't show any results by default - only when searching
        
        // Build folder structure for browse mode
        const structure = buildFolderStructure(all);
        setFolderStructure(structure);
        
        // Start with all folders collapsed for cleaner view
        setExpandedFolders(new Set());
      } catch (error) {
        console.error('Failed to load syndromes:', error);
      } finally {
        setLoading(false);
      }
    }
    loadAllSyndromes();
  }, []);

  // Fast local search
  const performSearch = useCallback((term) => {
    if (term.trim().length === 0) {
      setSearchResults([]); // Clear results when no search term
      return;
    }

    const searchTerm = term.toLowerCase();
    const filtered = allSyndromes.filter(syndrome => {
      const title = syndrome.title?.toLowerCase() || '';
      const category = getCategoryDisplayName(syndrome.category).toLowerCase();
      return title.includes(searchTerm) || category.includes(searchTerm);
    }).slice(0, 15); // Limit to 15 results
    
    setSearchResults(filtered);
  }, [allSyndromes]);

  // Instant search
  useEffect(() => {
    performSearch(searchTerm);
  }, [searchTerm, performSearch]);

  const handleSyndromeSelect = (syndrome) => {
    setSelectedSyndrome(syndrome);
    setCurrentView('syndrome');
  };

  // Folder navigation functions
  const toggleFolder = (folderKey) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderKey)) {
      newExpanded.delete(folderKey);
    } else {
      newExpanded.add(folderKey);
    }
    setExpandedFolders(newExpanded);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  // Copy functionality
  const copyToClipboard = async (text, sectionId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(sectionId);
      
      // Clear any existing timeout
      if (copyTimeout) {
        clearTimeout(copyTimeout);
      }
      
      // Set new timeout to clear the copied state
      const timeout = setTimeout(() => {
        setCopiedSection(null);
      }, 2000);
      setCopyTimeout(timeout);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Format content for copying
  const formatContentForCopy = (section) => {
    switch (section.type) {
      case 'header':
        return `${section.text}\n${'='.repeat(section.text.length)}\n`;
      case 'list':
        return section.items.map(item => `• ${item}`).join('\n') + '\n';
      case 'paragraph':
        return `${section.text}\n`;
      case 'regimen':
        let regimenText = 'Treatment Regimen:\n';
        if (section.regimenData?.strengthOfRecommendation) {
          regimenText += `Recommendation: ${section.regimenData.strengthOfRecommendation}\n`;
        }
        if (section.regimenData?.appliesTo?.description) {
          regimenText += `Applies to: ${section.regimenData.appliesTo.description}\n`;
        }
        if (section.regimenData?.condition) {
          regimenText += `Condition: ${section.regimenData.condition}\n`;
        }
        section.regimenData?.components?.forEach((component, index) => {
          if (component.connector && index > 0) {
            regimenText += `${component.connector.toUpperCase()} `;
          }
          regimenText += `${component.drug}`;
          if (component.dose) regimenText += ` ${component.dose}`;
          if (component.route) regimenText += ` ${component.route}`;
          if (component.frequency) regimenText += ` ${component.frequency}`;
          regimenText += '\n';
        });
        if (section.regimenData?.durationDetail?.fixedDuration) {
          regimenText += `Duration: ${section.regimenData.durationDetail.fixedDuration}\n`;
        }
        if (section.regimenData?.notes) {
          regimenText += `Notes: ${section.regimenData.notes}\n`;
        }
        return regimenText;
      case 'drugRegimen':
        let drugText = 'Drug Regimen:\n';
        if (section.regimenData?.strengthOfRecommendation) {
          drugText += `Recommendation: ${section.regimenData.strengthOfRecommendation}\n`;
        }
        if (section.regimenData?.appliesTo?.description) {
          drugText += `Applies to: ${section.regimenData.appliesTo.description}\n`;
        }
        if (section.regimenData?.condition) {
          drugText += `Condition: ${section.regimenData.condition}\n`;
        }
        section.regimenData?.components?.forEach((component, index) => {
          if (component.connector && index > 0) {
            drugText += `${component.connector.toUpperCase()} `;
          }
          drugText += `${component.drug}`;
          if (component.dose) drugText += ` ${component.dose}`;
          if (component.route) drugText += ` ${component.route}`;
          if (component.frequency) drugText += ` ${component.frequency}`;
          drugText += '\n';
        });
        if (section.regimenData?.durationDetail?.fixedDuration) {
          drugText += `Duration: ${section.regimenData.durationDetail.fixedDuration}\n`;
        }
        if (section.regimenData?.notes) {
          drugText += `Notes: ${section.regimenData.notes}\n`;
        }
        return drugText;
      case 'table':
        let tableText = '';
        if (section.headers) {
          tableText += section.headers.join(' | ') + '\n';
          tableText += section.headers.map(() => '---').join(' | ') + '\n';
        }
        section.rows?.forEach(row => {
          tableText += row.join(' | ') + '\n';
        });
        return tableText;
      case 'keyValuePairs':
        let kvText = 'Clinical Information:\n';
        section.pairs?.forEach(pair => {
          kvText += `${pair.key}: ${pair.value}\n\n`;
        });
        return kvText;
      case 'nestedContent':
        let nestedText = `${section.title || 'Detailed Information'}:\n`;
        if (section.content) {
          section.content.forEach(item => {
            nestedText += formatContentForCopy(item) + '\n';
          });
        }
        return nestedText;
      case 'differentialDiagnosis':
        let diffText = 'Differential Diagnosis:\n';
        section.differentialData?.conditions?.forEach(condition => {
          diffText += `• ${condition.conditionName}`;
          if (condition.differentiatingFeatures) {
            diffText += `: ${condition.differentiatingFeatures}`;
          }
          diffText += '\n';
        });
        return diffText;
      case 'partnerManagement':
        let partnerText = 'Partner Management:\n';
        if (section.partnerManagementData?.lookBackPeriod) {
          partnerText += `Look-back Period: ${section.partnerManagementData.lookBackPeriod}\n`;
        }
        if (section.partnerManagementData?.action) {
          partnerText += `Action: ${section.partnerManagementData.action}\n`;
        }
        return partnerText;
      case 'publicHealthStrategy':
        let pubHealthText = `Public Health Strategy: ${section.publicHealthData?.name || ''}\n`;
        section.publicHealthData?.components?.forEach(component => {
          pubHealthText += `${component.componentName}: ${component.description}\n`;
        });
        return pubHealthText;
      case 'procedure':
        let procText = `${section.procedureData?.name || 'Medical Procedure'}:\n`;
        if (section.procedureData?.indication) {
          procText += `Indication: ${section.procedureData.indication}\n`;
        }
        if (section.procedureData?.timing) {
          procText += `Timing: ${section.procedureData.timing}\n`;
        }
        if (section.procedureData?.notes) {
          procText += `Notes: ${section.procedureData.notes}\n`;
        }
        return procText;
      case 'image':
        let imageText = 'Clinical Image:\n';
        if (section.imageData?.caption) {
          imageText += `Caption: ${section.imageData.caption}\n`;
        }
        if (section.imageData?.src) {
          imageText += `Source: ${section.imageData.src}\n`;
        }
        return imageText;
      case 'crossReference':
        return `${section.referenceData?.text || 'See also'}: ${section.referenceData?.targetIdentifier}\n`;
      case 'diagnosticTest':
        let diagText = `Diagnostic Test: ${section.diagnosticTestData?.name || ''}\n`;
        if (section.diagnosticTestData?.analyte) {
          diagText += `Analyte: ${section.diagnosticTestData.analyte}\n`;
        }
        if (section.diagnosticTestData?.sampleType) {
          diagText += `Sample Type: ${section.diagnosticTestData.sampleType}\n`;
        }
        if (section.diagnosticTestData?.interpretation) {
          diagText += `Interpretation: ${section.diagnosticTestData.interpretation}\n`;
        }
        if (section.diagnosticTestData?.notes) {
          diagText += `Notes: ${section.diagnosticTestData.notes}\n`;
        }
        return diagText;
      default:
        return JSON.stringify(section, null, 2);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (copyTimeout) {
        clearTimeout(copyTimeout);
      }
    };
  }, [copyTimeout]);

  // Render compact folder tree
  const renderFolderTree = (folders, level = 0) => {
    return Object.entries(folders).map(([key, folder]) => {
      const fullPath = folder.path.join('/');
      const isExpanded = expandedFolders.has(fullPath);
      const hasSubfolders = Object.keys(folder.folders).length > 0;
      const fileCount = folder.files.length;
      const totalCount = fileCount + Object.values(folder.folders).reduce((sum, subfolder) => 
        sum + subfolder.files.length + Object.values(subfolder.folders).reduce((subSum, subSubfolder) => 
          subSum + subSubfolder.files.length, 0), 0);

      return (
        <div key={fullPath}>
          {/* Folder Header - Ultra Compact */}
          <div
            className={`flex items-center py-0.5 px-1 hover:bg-gray-100 cursor-pointer text-xs ${
              level > 0 ? `ml-${level * 3}` : ''
            }`}
            onClick={() => toggleFolder(fullPath)}
          >
            {/* Expand/Collapse Icon - Minimal */}
            <div className="w-3 h-3 flex items-center justify-center mr-1 flex-shrink-0">
              {hasSubfolders ? (
                <svg
                  className={`w-2 h-2 text-gray-500 transition-transform ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              ) : (
                <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
              )}
            </div>

            {/* Folder Icon - Minimal */}
            <svg className="w-3 h-3 text-blue-600 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
            </svg>

            {/* Folder Name - Compact */}
            <span className="text-gray-700 truncate flex-1 text-xs font-medium">
              {folder.displayName}
            </span>
            
            {/* Count Badge - Super Compact */}
            <span className="text-gray-400 text-xs ml-1 bg-gray-100 px-1 rounded-sm font-mono">
              {totalCount}
            </span>
          </div>

          {/* Files in this folder - Ultra Compact */}
          {isExpanded && fileCount > 0 && (
            <div className={`${level > 0 ? `ml-${level * 3 + 3}` : 'ml-3'}`}>
              {folder.files.map((syndrome) => (
                <button
                  key={syndrome.id}
                  onClick={() => handleSyndromeSelect(syndrome)}
                  className="flex items-center w-full py-0.5 px-1 hover:bg-blue-50 text-left text-xs group rounded-sm"
                >
                  <div className="w-1 h-1 bg-green-500 rounded-full mr-2 flex-shrink-0"></div>
                  <span className="text-gray-600 group-hover:text-blue-700 truncate text-xs">
                    {syndrome.title}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Subfolders */}
          {isExpanded && hasSubfolders && (
            <div>
              {renderFolderTree(folder.folders, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const renderSyndromeContent = (content) => {
    if (!content || !Array.isArray(content)) return null;

    return content.map((section, index) => {
      const sectionId = `section-${index}`;
      const isCopied = copiedSection === sectionId;
      const copyText = formatContentForCopy(section);

      const CopyButton = () => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            copyToClipboard(copyText, sectionId);
          }}
          className={`opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-md text-xs font-medium ${
            isCopied 
              ? 'bg-green-100 text-green-700 border border-green-300' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 border border-gray-300'
          }`}
          title={isCopied ? 'Copied!' : 'Copy to clipboard'}
        >
          {isCopied ? (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      );

      try {
        switch (section.type) {
        case 'header':
          const HeaderTag = `h${Math.min(section.level + 1, 6)}`;
          const headerClass = section.level === 1 
            ? "text-2xl font-bold text-slate-900 border-b-2 border-blue-500 pb-2"
            : section.level === 2
            ? "text-xl font-semibold text-slate-800 border-b border-gray-300 pb-1"
            : "text-lg font-medium text-slate-700";
          
          return (
            <div key={index} className="group relative mb-6 mt-8 first:mt-0">
              <div className="flex items-center justify-between">
                <HeaderTag className={headerClass}>
                  {section.text}
                </HeaderTag>
                <CopyButton />
              </div>
            </div>
          );

        case 'list':
          return (
            <div key={index} className="group relative mb-6 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute top-3 right-3">
                <CopyButton />
              </div>
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );

        case 'paragraph':
          return (
            <div key={index} className="group relative mb-6 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute top-3 right-3">
                <CopyButton />
              </div>
              <p className="text-gray-700 leading-relaxed">{section.text}</p>
            </div>
          );

        case 'regimen':
          return (
            <div key={index} className="group relative mb-6 p-5 bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute top-4 right-4">
                <CopyButton />
              </div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.415-3.414l5-5A2 2 0 009 8.172V5L8 4z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-blue-900">Treatment Regimen</h4>
                  {section.regimenData?.strengthOfRecommendation && (
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      section.regimenData.strengthOfRecommendation === 'Recommended' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {section.regimenData.strengthOfRecommendation}
                    </span>
                  )}
                </div>
              </div>

              {/* Patient Population */}
              {section.regimenData?.appliesTo && (
                <div className="mb-3 p-3 bg-blue-100 rounded-lg">
                  <span className="font-medium text-blue-900">Applies to: </span>
                  <span className="text-blue-800">{section.regimenData.appliesTo.description}</span>
                </div>
              )}

              {/* Condition */}
              {section.regimenData?.condition && (
                <div className="mb-3 p-3 bg-blue-100 rounded-lg">
                  <span className="font-medium text-blue-900">Condition: </span>
                  <span className="text-blue-800">{section.regimenData.condition}</span>
                </div>
              )}

              {/* Drug Components */}
              {section.regimenData?.components && section.regimenData.components.length > 0 ? (
                <div className="space-y-3">
                  {section.regimenData.components.map((component, compIndex) => (
                    <div key={compIndex} className="bg-white/70 rounded-lg p-3 border border-blue-200">
                      <div className="flex flex-wrap items-center gap-2">
                        {component.connector && compIndex > 0 && (
                          <span className="px-2 py-1 text-xs font-bold text-blue-700 bg-blue-200 rounded-full">
                            {component.connector.toUpperCase()}
                          </span>
                        )}
                        <span className="font-semibold text-blue-900 text-base">{component.drug}</span>
                        {component.dose && <span className="px-2 py-1 text-sm bg-gray-100 rounded-md text-gray-700">{component.dose}</span>}
                        {component.route && <span className="px-2 py-1 text-sm bg-gray-100 rounded-md text-gray-600">{component.route}</span>}
                        {component.frequency && <span className="px-2 py-1 text-sm bg-gray-100 rounded-md text-gray-600">{component.frequency}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/70 rounded-lg p-3 border border-blue-200">
                  <span className="text-blue-800 italic">Regimen details as referenced above</span>
                </div>
              )}

              {/* Duration Detail */}
              {section.regimenData?.durationDetail && (
                <div className="mt-4 p-3 bg-white/70 rounded-lg border border-blue-200">
                  <span className="font-medium text-blue-900">Duration: </span>
                  {section.regimenData.durationDetail.fixedDuration && (
                    <span className="text-blue-800">{section.regimenData.durationDetail.fixedDuration}</span>
                  )}
                  {section.regimenData.durationDetail.criteriaBasedDuration && (
                    <span className="text-blue-800">{section.regimenData.durationDetail.criteriaBasedDuration.description}</span>
                  )}
                  {section.regimenData.durationDetail.comparativeDurations && (
                    <div className="space-y-1 mt-2">
                      {section.regimenData.durationDetail.comparativeDurations.map((dur, durIndex) => (
                        <div key={durIndex} className="text-blue-800">
                          {dur.duration} {dur.comparator && `(${dur.comparator})`}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Evidence */}
              {section.regimenData?.evidence && (
                <div className="mt-4 p-3 bg-white/70 rounded-lg border border-blue-200">
                  <span className="font-medium text-blue-900">Evidence: </span>
                  <span className="text-blue-800">
                    {section.regimenData.evidence.studyCount && `${section.regimenData.evidence.studyCount} `}
                    {section.regimenData.evidence.studyType}
                    {section.regimenData.evidence.outcomeSummary && ` - ${section.regimenData.evidence.outcomeSummary}`}
                  </span>
                </div>
              )}

              {/* Efficacy */}
              {section.regimenData?.efficacy && (
                <div className="mt-4 p-3 bg-white/70 rounded-lg border border-blue-200">
                  <span className="font-medium text-blue-900">Efficacy: </span>
                  <span className="text-blue-800">{section.regimenData.efficacy}</span>
                </div>
              )}

              {/* Notes */}
              {section.regimenData?.notes && (
                <div className="mt-4 p-3 bg-white/70 rounded-lg border border-blue-200">
                  <span className="font-medium text-blue-900">Notes: </span>
                  <span className="text-blue-800">{section.regimenData.notes}</span>
                </div>
              )}
            </div>
          );

        case 'drugRegimen':
          return (
            <div key={index} className="group relative mb-6 p-5 bg-gradient-to-br from-emerald-50 to-emerald-100 border-l-4 border-emerald-500 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute top-4 right-4">
                <CopyButton />
              </div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.415-3.414l5-5A2 2 0 009 8.172V5L8 4z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-emerald-900">Drug Regimen</h4>
                  {section.regimenData?.strengthOfRecommendation && (
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      section.regimenData.strengthOfRecommendation === 'Recommended' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {section.regimenData.strengthOfRecommendation}
                    </span>
                  )}
                </div>
              </div>

              {/* Patient Population */}
              {section.regimenData?.appliesTo && (
                <div className="mb-3 p-3 bg-emerald-100 rounded-lg">
                  <span className="font-medium text-emerald-900">Applies to: </span>
                  <span className="text-emerald-800">{section.regimenData.appliesTo.description}</span>
                </div>
              )}

              {/* Condition */}
              {section.regimenData?.condition && (
                <div className="mb-3 p-3 bg-emerald-100 rounded-lg">
                  <span className="font-medium text-emerald-900">Condition: </span>
                  <span className="text-emerald-800">{section.regimenData.condition}</span>
                </div>
              )}

              {/* Drug Components */}
              {section.regimenData?.components && section.regimenData.components.length > 0 ? (
                <div className="space-y-3">
                  {section.regimenData.components.map((component, compIndex) => (
                    <div key={compIndex} className="bg-white/70 rounded-lg p-3 border border-emerald-200">
                      <div className="flex flex-wrap items-center gap-2">
                        {component.connector && compIndex > 0 && (
                          <span className="px-2 py-1 text-xs font-bold text-emerald-700 bg-emerald-200 rounded-full">
                            {component.connector.toUpperCase()}
                          </span>
                        )}
                        <span className="font-semibold text-emerald-900 text-base">{component.drug}</span>
                        {component.dose && <span className="px-2 py-1 text-sm bg-gray-100 rounded-md text-gray-700">{component.dose}</span>}
                        {component.route && <span className="px-2 py-1 text-sm bg-gray-100 rounded-md text-gray-600">{component.route}</span>}
                        {component.frequency && <span className="px-2 py-1 text-sm bg-gray-100 rounded-md text-gray-600">{component.frequency}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/70 rounded-lg p-3 border border-emerald-200">
                  <span className="text-emerald-800 italic">Regimen details as referenced above</span>
                </div>
              )}

              {/* Duration Detail */}
              {section.regimenData?.durationDetail && (
                <div className="mt-4 p-3 bg-white/70 rounded-lg border border-emerald-200">
                  <span className="font-medium text-emerald-900">Duration: </span>
                  {section.regimenData.durationDetail.fixedDuration && (
                    <span className="text-emerald-800">{section.regimenData.durationDetail.fixedDuration}</span>
                  )}
                  {section.regimenData.durationDetail.criteriaBasedDuration && (
                    <span className="text-emerald-800">{section.regimenData.durationDetail.criteriaBasedDuration.description}</span>
                  )}
                  {section.regimenData.durationDetail.comparativeDurations && (
                    <div className="space-y-1 mt-2">
                      {section.regimenData.durationDetail.comparativeDurations.map((dur, durIndex) => (
                        <div key={durIndex} className="text-emerald-800">
                          {dur.duration} {dur.comparator && `(${dur.comparator})`}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Evidence */}
              {section.regimenData?.evidence && (
                <div className="mt-4 p-3 bg-white/70 rounded-lg border border-emerald-200">
                  <span className="font-medium text-emerald-900">Evidence: </span>
                  <span className="text-emerald-800">
                    {section.regimenData.evidence.studyCount && `${section.regimenData.evidence.studyCount} `}
                    {section.regimenData.evidence.studyType}
                    {section.regimenData.evidence.outcomeSummary && ` - ${section.regimenData.evidence.outcomeSummary}`}
                  </span>
                </div>
              )}

              {/* Efficacy */}
              {section.regimenData?.efficacy && (
                <div className="mt-4 p-3 bg-white/70 rounded-lg border border-emerald-200">
                  <span className="font-medium text-emerald-900">Efficacy: </span>
                  <span className="text-emerald-800">{section.regimenData.efficacy}</span>
                </div>
              )}

              {/* Notes */}
              {section.regimenData?.notes && (
                <div className="mt-4 p-3 bg-white/70 rounded-lg border border-emerald-200">
                  <span className="font-medium text-emerald-900">Notes: </span>
                  <span className="text-emerald-800">{section.regimenData.notes}</span>
                </div>
              )}
            </div>
          );

        case 'table':
          return (
            <div key={index} className="group relative mb-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="absolute top-4 right-4 z-10">
                <CopyButton />
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  {section.headers && (
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        {section.headers.map((header, headerIndex) => (
                          <th key={headerIndex} className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-200 last:border-r-0">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody>
                    {section.rows?.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-gray-100 hover:bg-gray-50">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-3 text-sm text-gray-700 border-r border-gray-100 last:border-r-0">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );

        case 'diagnosticTest':
          const testData = section.diagnosticTestData || {};
          return (
            <div key={index} className="group relative mb-6 p-5 bg-gradient-to-br from-indigo-50 to-indigo-100 border-l-4 border-indigo-500 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute top-3 right-3">
                <CopyButton />
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-indigo-800 mb-2">{testData.name || 'Diagnostic Test'}</h4>
                  {testData.description && (
                    <p className="text-gray-700 leading-relaxed mb-2">{testData.description}</p>
                  )}
                  {testData.notes && (
                    <div className="mt-3 p-3 bg-indigo-100 rounded-lg border border-indigo-200">
                      <p className="text-sm text-indigo-700 font-medium">Notes:</p>
                      <p className="text-sm text-indigo-600 mt-1">{testData.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );

        case 'crossReference':
          return (
            <div key={index} className="group relative mb-6 p-4 bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-400 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute top-3 right-3">
                <CopyButton />
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="text-sm text-amber-900">
                    <strong>{section.referenceData?.text || 'See also:'}</strong>
                  </span>
                  {section.referenceData?.targetType === 'externalURL' ? (
                    <a 
                      href={section.referenceData.targetIdentifier} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-amber-700 hover:text-amber-900 underline ml-2"
                    >
                      {section.referenceData.targetIdentifier}
                    </a>
                  ) : (
                    <span className="text-amber-800 ml-2">{section.referenceData?.targetIdentifier}</span>
                  )}
                </div>
              </div>
            </div>
          );

        case 'diagnosticTest':
          return (
            <div key={index} className="group relative mb-6 p-5 bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-500 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute top-4 right-4">
                <CopyButton />
              </div>
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h5 className="text-lg font-semibold text-purple-900">{section.diagnosticTestData?.name || 'Diagnostic Test'}</h5>
                  {section.diagnosticTestData?.strengthOfRecommendation && (
                    <span className="text-sm px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                      {section.diagnosticTestData.strengthOfRecommendation}
                    </span>
                  )}
                </div>
              </div>

              {/* Patient Population */}
              {section.diagnosticTestData?.appliesTo && (
                <div className="mb-3 p-3 bg-purple-100 rounded-lg">
                  <span className="font-medium text-purple-900">Applies to: </span>
                  <span className="text-purple-800">{section.diagnosticTestData.appliesTo.description}</span>
                </div>
              )}

              {/* Test Details */}
              <div className="space-y-3">
                {section.diagnosticTestData?.analyte && (
                  <div className="bg-white/70 rounded-lg p-3 border border-purple-200">
                    <span className="font-medium text-purple-900">Analyte: </span>
                    <span className="text-gray-700">{section.diagnosticTestData.analyte}</span>
                  </div>
                )}
                
                {section.diagnosticTestData?.sampleType && (
                  <div className="bg-white/70 rounded-lg p-3 border border-purple-200">
                    <span className="font-medium text-purple-900">Sample Type: </span>
                    <span className="text-gray-700">{section.diagnosticTestData.sampleType}</span>
                  </div>
                )}

                {section.diagnosticTestData?.interpretation && (
                  <div className="bg-white/70 rounded-lg p-3 border border-purple-200">
                    <span className="font-medium text-purple-900">Interpretation: </span>
                    <span className="text-gray-700">{section.diagnosticTestData.interpretation}</span>
                  </div>
                )}

                {(section.diagnosticTestData?.sensitivity || section.diagnosticTestData?.specificity) && (
                  <div className="bg-white/70 rounded-lg p-3 border border-purple-200">
                    {section.diagnosticTestData.sensitivity && (
                      <div>
                        <span className="font-medium text-purple-900">Sensitivity: </span>
                        <span className="text-gray-700">{(section.diagnosticTestData.sensitivity * 100).toFixed(1)}%</span>
                      </div>
                    )}
                    {section.diagnosticTestData.specificity && (
                      <div>
                        <span className="font-medium text-purple-900">Specificity: </span>
                        <span className="text-gray-700">{(section.diagnosticTestData.specificity * 100).toFixed(1)}%</span>
                      </div>
                    )}
                  </div>
                )}

                {section.diagnosticTestData?.notes && (
                  <div className="bg-white/70 rounded-lg p-3 border border-purple-200">
                    <span className="font-medium text-purple-900">Notes: </span>
                    <span className="text-gray-700">{section.diagnosticTestData.notes}</span>
                  </div>
                )}
              </div>
            </div>
          );

        case 'keyValuePairs':
          return (
            <div key={index} className="group relative mb-6 p-5 bg-gradient-to-br from-indigo-50 to-indigo-100 border-l-4 border-indigo-500 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute top-4 right-4">
                <CopyButton />
              </div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 10v-6a3 3 0 116 0v6m-9 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-indigo-900">Clinical Information</h4>
              </div>
              <div className="space-y-3">
                {section.pairs?.map((pair, pairIndex) => (
                  <div key={pairIndex} className="bg-white/70 rounded-lg p-4 border border-indigo-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <h6 className="font-semibold text-indigo-900 mb-2">{pair.key}</h6>
                        <p className="text-gray-700 leading-relaxed">{pair.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );

        case 'nestedContent':
          return (
            <div key={index} className="group relative mb-6 p-5 bg-gradient-to-br from-teal-50 to-teal-100 border-l-4 border-teal-500 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute top-4 right-4">
                <CopyButton />
              </div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-4H5m14 8H5m14 4H5" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-teal-900">{section.title || 'Detailed Information'}</h4>
              </div>
              <div className="pl-4 border-l-2 border-teal-300">
                {section.content && renderSyndromeContent(section.content)}
              </div>
            </div>
          );

        case 'differentialDiagnosis':
          return (
            <div key={index} className="group relative mb-6 p-5 bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-orange-500 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute top-4 right-4">
                <CopyButton />
              </div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-orange-900">Differential Diagnosis</h4>
              </div>
              {section.differentialData?.conditions?.map((condition, condIndex) => (
                <div key={condIndex} className="bg-white/70 rounded-lg p-3 border border-orange-200 mb-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <h6 className="font-medium text-orange-900 mb-1">{condition.conditionName}</h6>
                      {condition.differentiatingFeatures && (
                        <p className="text-gray-700 text-sm">{condition.differentiatingFeatures}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );

        case 'partnerManagement':
          return (
            <div key={index} className="group relative mb-6 p-5 bg-gradient-to-br from-pink-50 to-pink-100 border-l-4 border-pink-500 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute top-4 right-4">
                <CopyButton />
              </div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-pink-900">Partner Management</h4>
              </div>
              <div className="space-y-3">
                {section.partnerManagementData?.lookBackPeriod && (
                  <div className="bg-white/70 rounded-lg p-3 border border-pink-200">
                    <span className="font-medium text-pink-900">Look-back Period: </span>
                    <span className="text-gray-700">{section.partnerManagementData.lookBackPeriod}</span>
                  </div>
                )}
                
                {section.partnerManagementData?.action && (
                  <div className="bg-white/70 rounded-lg p-3 border border-pink-200">
                    <span className="font-medium text-pink-900">Action: </span>
                    <span className="text-gray-700">{section.partnerManagementData.action}</span>
                  </div>
                )}

                {section.partnerManagementData?.partnerRegimen && (
                  <div className="bg-white/70 rounded-lg p-3 border border-pink-200">
                    <span className="font-medium text-pink-900 block mb-2">Partner Regimen:</span>
                    <div className="space-y-2">
                      {section.partnerManagementData.partnerRegimen.components?.map((component, compIndex) => (
                        <div key={compIndex} className="text-gray-700">
                          <span className="font-medium">{component.drug}</span>
                          {component.dose && ` ${component.dose}`}
                          {component.route && ` ${component.route}`}
                          {component.frequency && ` ${component.frequency}`}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );

        case 'publicHealthStrategy':
          return (
            <div key={index} className="group relative mb-6 p-5 bg-gradient-to-br from-cyan-50 to-cyan-100 border-l-4 border-cyan-500 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute top-4 right-4">
                <CopyButton />
              </div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-cyan-900">{section.publicHealthData?.name || 'Public Health Strategy'}</h4>
              </div>
              <div className="space-y-3">
                {section.publicHealthData?.components?.map((component, compIndex) => (
                  <div key={compIndex} className="bg-white/70 rounded-lg p-3 border border-cyan-200">
                    <h6 className="font-medium text-cyan-900 mb-2">{component.componentName}</h6>
                    <p className="text-gray-700 text-sm">{component.description}</p>
                  </div>
                ))}
              </div>
            </div>
          );

        case 'procedure':
          return (
            <div key={index} className="group relative mb-6 p-5 bg-gradient-to-br from-violet-50 to-violet-100 border-l-4 border-violet-500 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute top-4 right-4">
                <CopyButton />
              </div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-violet-900">{section.procedureData?.name || 'Medical Procedure'}</h4>
                  {section.procedureData?.strengthOfRecommendation && (
                    <span className="text-sm px-2 py-1 bg-violet-100 text-violet-800 rounded-full">
                      {section.procedureData.strengthOfRecommendation}
                    </span>
                  )}
                </div>
              </div>

              {/* Patient Population */}
              {section.procedureData?.appliesTo && (
                <div className="mb-3 p-3 bg-violet-100 rounded-lg">
                  <span className="font-medium text-violet-900">Applies to: </span>
                  <span className="text-violet-800">{section.procedureData.appliesTo.description}</span>
                </div>
              )}

              <div className="space-y-3">
                {section.procedureData?.indication && (
                  <div className="bg-white/70 rounded-lg p-3 border border-violet-200">
                    <span className="font-medium text-violet-900">Indication: </span>
                    <span className="text-gray-700">{section.procedureData.indication}</span>
                  </div>
                )}

                {section.procedureData?.timing && (
                  <div className="bg-white/70 rounded-lg p-3 border border-violet-200">
                    <span className="font-medium text-violet-900">Timing: </span>
                    <span className="text-gray-700">{section.procedureData.timing}</span>
                  </div>
                )}

                {section.procedureData?.notes && (
                  <div className="bg-white/70 rounded-lg p-3 border border-violet-200">
                    <span className="font-medium text-violet-900">Notes: </span>
                    <span className="text-gray-700">{section.procedureData.notes}</span>
                  </div>
                )}
              </div>
            </div>
          );

        case 'image':
          return (
            <div key={index} className="group relative mb-6 p-5 bg-gradient-to-br from-slate-50 to-slate-100 border-l-4 border-slate-500 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute top-4 right-4">
                <CopyButton />
              </div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-slate-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-slate-900">Clinical Image</h4>
              </div>
              <div className="bg-white/70 rounded-lg p-4 border border-slate-200">
                {section.imageData?.caption && (
                  <p className="text-gray-700 mb-3">{section.imageData.caption}</p>
                )}
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  {section.imageData?.src ? (
                    <img 
                      src={section.imageData.src} 
                      alt={section.imageData.caption || 'Clinical image'} 
                      className="max-w-full h-auto rounded-lg mx-auto"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <div className="text-center" style={{display: section.imageData?.src ? 'none' : 'block'}}>
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 text-sm">Clinical image reference</p>
                  </div>
                </div>
              </div>
            </div>
          );

        default:
          // Fallback for unknown content types
          return (
            <div key={index} className="group relative mb-6 p-4 bg-gray-50 border border-gray-300 rounded-xl shadow-sm">
              <div className="absolute top-3 right-3">
                <CopyButton />
              </div>
              <div className="flex items-center mb-3">
                <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-600">Content type: {section.type}</span>
              </div>
              <pre className="text-sm text-gray-700 overflow-x-auto bg-white rounded-lg p-3 border">
                {JSON.stringify(section, null, 2)}
              </pre>
            </div>
          );
        }
      } catch (error) {
        console.error('Error rendering section:', error, section);
        return (
          <div key={index} className="group relative mb-6 p-4 bg-red-50 border border-red-300 rounded-xl shadow-sm">
            <div className="text-red-700">
              <strong>Error rendering section:</strong> {error.message}
              <br />
              <strong>Section type:</strong> {section.type}
            </div>
          </div>
        );
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-blue-100">
          <div className="relative">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.415-3.414l5-5A2 2 0 009 8.172V5L8 4z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Clinical Database</h3>
          <p className="text-gray-600">Preparing 453 syndrome protocols...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Professional Medical Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-6 py-4">
            <button 
              onClick={onBackToLanding}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <span className="font-medium">Dashboard</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.415-3.414l5-5A2 2 0 009 8.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Clinical Syndromes</h1>
                <p className="text-xs text-gray-500">Evidence-Based Treatment Protocols</p>
              </div>
            </div>
            
            {selectedSyndrome && (
              <button 
                onClick={() => {
                  setSelectedSyndrome(null);
                  setCurrentView('browse');
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors duration-200 border border-blue-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Back to Browse</span>
              </button>
            )}
            {!selectedSyndrome && <div className="w-32"></div>}
          </div>
        </div>
      </div>

      {/* Unified Browse & Search Interface */}
      {currentView !== 'syndrome' && (
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Clinical Protocols Database</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse by category or search across 453 evidence-based treatment protocols
            </p>
          </div>

          {/* Compact Search Bar */}
          <div className="max-w-lg mx-auto mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Quick search protocols..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Folder Browser with Integrated Search */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <span>Browse by Clinical Category</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    {searchTerm && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {searchResults.length} found for "{searchTerm}"
                      </span>
                    )}
                    <span>{allSyndromes.length} total protocols</span>
                  </div>
                </div>
              </div>
              <div className="p-2 max-h-96 overflow-y-auto">
                {/* Search Results - Compact List Format */}
                {searchTerm && searchResults.length > 0 && (
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <div className="space-y-1">
                      {searchResults.map((syndrome) => (
                        <button
                          key={syndrome.id}
                          onClick={() => handleSyndromeSelect(syndrome)}
                          className="w-full flex items-center py-2 px-3 hover:bg-blue-50 text-left text-sm group rounded-md transition-colors"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 group-hover:text-blue-700 truncate">
                              {syndrome.title}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {getCategoryDisplayName(syndrome.category)}
                            </div>
                          </div>
                          <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Search Results Message */}
                {searchTerm && searchResults.length === 0 && (
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <div className="text-center py-4 text-gray-500">
                      <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                      </svg>
                      <p className="text-sm">No protocols found for "{searchTerm}"</p>
                    </div>
                  </div>
                )}

                {/* Folder Tree */}
                {Object.keys(folderStructure).length > 0 ? (
                  renderFolderTree(folderStructure)
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    </div>
                    <p className="text-sm">Building folder structure...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Syndrome Detail View */}
      {currentView === 'syndrome' && selectedSyndrome && (
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Protocol Header */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.415-3.414l5-5A2 2 0 009 8.172V5L8 4z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedSyndrome.title || 'Untitled Protocol'}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span>{getCategoryDisplayName(selectedSyndrome.category)}</span>
                    </span>
                    {selectedSyndrome.data?.documentMetadata?.lastUpdated && (
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Updated {selectedSyndrome.data.documentMetadata.lastUpdated}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    const fullText = selectedSyndrome.data?.content?.map(section => formatContentForCopy(section)).join('\n\n') || '';
                    copyToClipboard(`${selectedSyndrome.title}\n${'='.repeat(selectedSyndrome.title.length)}\n\n${fullText}`, 'full-protocol');
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copy Full Protocol</span>
                </button>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-blue-800 text-sm leading-relaxed">
                <strong>Clinical Decision Support:</strong> This evidence-based protocol provides standardized treatment guidelines. 
                Always consider patient-specific factors, local resistance patterns, and institutional guidelines when making treatment decisions.
              </p>
            </div>
          </div>
            
          {/* Protocol Content */}
          <div className="space-y-6">
            {renderSyndromeContent(selectedSyndrome.data?.content)}
          </div>
        </div>
      )}
    </div>
  );
};

export default SyndromesApp;