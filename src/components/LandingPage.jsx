import React from 'react';

const LandingPage = ({ onSelectSection }) => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-teal-700 mb-2">
                            Guía Interactiva de Resistencia Antimicrobiana
                        </h1>
                        <p className="text-xl text-slate-600 mb-1">Colombia - Versión Alpha</p>
                        <p className="text-sm text-slate-500">
                            Sistema integrado de apoyo clínico y vigilancia epidemiológica
                        </p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Section Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {/* Antibiogram App Section */}
                    <div 
                        onClick={() => onSelectSection('antibiogram')}
                        className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    >
                        <div className="text-center">
                            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-200 transition-colors">
                                <span className="text-4xl">🧬</span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                Antibiograma Inteligente
                            </h2>
                            <p className="text-slate-600 mb-6">
                                Sistema de apoyo para la toma de decisiones clínicas en el tratamiento de infecciones. 
                                Interpretación avanzada de antibiogramas con algoritmos de detección de resistencia.
                            </p>
                            <div className="space-y-2 text-sm text-slate-500 text-left">
                                <div className="flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                    <span>Interpretación CLSI automatizada</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                    <span>Detección de patrones de resistencia</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                    <span>Recomendaciones terapéuticas inteligentes</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                    <span>Ajustes por función renal/hepática</span>
                                </div>
                            </div>
                            <button className="mt-6 w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                                Acceder al Antibiograma
                            </button>
                        </div>
                    </div>

                    {/* Syndromes Section - Under Construction */}
                    <div className="bg-gray-100 rounded-2xl shadow-lg border border-gray-300 p-8 opacity-75 relative">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-4xl">🚧</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-600 mb-4">
                                Guía de Síndromes
                            </h2>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                                <p className="text-yellow-800 font-semibold text-sm mb-2">
                                    🔨 En Construcción
                                </p>
                                <p className="text-yellow-700 text-sm">
                                    Esta sección estará disponible próximamente con atlas epidemiológico completo.
                                </p>
                            </div>
                            <p className="text-gray-500 mb-6">
                                Atlas epidemiológico de resistencia antimicrobiana en Colombia. 
                                Datos actualizados de vigilancia nacional, perfiles de patógenos y tendencias críticas.
                            </p>
                            <div className="space-y-2 text-sm text-gray-400 text-left">
                                <div className="flex items-center">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                                    <span>Panorama nacional de RAM</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                                    <span>Perfiles de resistencia por patógeno</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                                    <span>Triangulación de datos de vigilancia</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                                    <span>Resistencia cruzada y fenotipos</span>
                                </div>
                            </div>
                            <button className="mt-6 w-full bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold cursor-not-allowed" disabled>
                                Próximamente Disponible
                            </button>
                        </div>
                    </div>
                </div>

                {/* Project Justification */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                        Justificación del Proyecto
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* Problem Statement */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-red-800 flex items-center">
                                <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
                                El Problema
                            </h4>
                            <div className="space-y-3 text-slate-600">
                                <p className="text-sm">
                                    <strong className="text-slate-800">18,200 muertes</strong> en Colombia asociadas a resistencia antimicrobiana (2019)
                                </p>
                                <p className="text-sm">
                                    <strong className="text-slate-800">4,700 muertes</strong> directamente causadas por infecciones resistentes
                                </p>
                                <p className="text-sm">
                                    La resistencia antimicrobiana supera la mortalidad combinada de varias enfermedades crónicas
                                </p>
                            </div>
                        </div>

                        {/* Solution */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-green-800 flex items-center">
                                <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                                La Solución
                            </h4>
                            <div className="space-y-3 text-slate-600">
                                <p className="text-sm">
                                    <strong className="text-slate-800">Triangulación de datos:</strong> Local (GREBO), Nacional (INS), Regional (PAHO)
                                </p>
                                <p className="text-sm">
                                    <strong className="text-slate-800">Interpretación inteligente:</strong> Algoritmos CLSI y detección automática de resistencia
                                </p>
                                <p className="text-sm">
                                    <strong className="text-slate-800">Apoyo clínico:</strong> Recomendaciones basadas en evidencia local
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Key Findings */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-amber-800 mb-4">Hallazgos Críticos de Vigilancia</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                                <h5 className="font-bold text-amber-800 text-sm">P. aeruginosa</h5>
                                <p className="text-xs text-amber-700 mt-1">
                                    Aumento significativo en resistencia a piperacilina-tazobactam y carbapenems (2018-2021)
                                </p>
                            </div>
                            <div className="bg-sky-50 p-4 rounded-lg border border-sky-200">
                                <h5 className="font-bold text-sky-800 text-sm">S. pneumoniae</h5>
                                <p className="text-xs text-sky-700 mt-1">
                                    Datos de vigilancia impulsaron cambio de PCV10 a PCV13 para cubrir serotipo 19A resistente
                                </p>
                            </div>
                            <div className="bg-violet-50 p-4 rounded-lg border border-violet-200">
                                <h5 className="font-bold text-violet-800 text-sm">Triangulación</h5>
                                <p className="text-xs text-violet-700 mt-1">
                                    Uso de múltiples fuentes de datos es esencial para antibiogramas locales precisos
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Technical Approach */}
                    <div className="mt-8 pt-8 border-t border-slate-200">
                        <h4 className="text-lg font-semibold text-indigo-800 mb-4">Enfoque Técnico</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <h5 className="font-medium text-slate-800">Antibiograma Inteligente</h5>
                                <ul className="text-sm text-slate-600 space-y-1">
                                    <li>• Algoritmos de detección ESBL, AmpC, Carbapenemasas</li>
                                    <li>• Interpretación CLSI automatizada con breakpoints específicos</li>
                                    <li>• Motor de recomendaciones con stewardship integrado</li>
                                    <li>• Cálculos PK/PD para optimización de dosis</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h5 className="font-medium text-slate-800">Guía de Síndromes</h5>
                                <ul className="text-sm text-slate-600 space-y-1">
                                    <li>• Visualización interactiva de datos de resistencia</li>
                                    <li>• Integración de fuentes nacionales e internacionales</li>
                                    <li>• Perfiles dinámicos de patógenos con carga epidemiológica</li>
                                    <li>• Principios de resistencia cruzada y stewardship</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Version Info */}
                    <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                        <p className="text-sm text-slate-500">
                            <strong>Versión Alpha</strong> - Sistema en desarrollo activo | 
                            Enterobacterales implementados (12 organismos) | 
                            Datos actualizados de vigilancia colombiana 2018-2023
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;