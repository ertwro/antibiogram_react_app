import React, { useState, useEffect } from 'react';

// Simplified Accordion component for cross-resistance
const AccordionItem = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="border border-slate-200 rounded-lg">
            <button
                onClick={toggleAccordion}
                className="w-full text-left p-4 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold flex justify-between items-center"
            >
                <span>{title}</span>
                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </button>
            {isOpen && (
                <div className="bg-white border-t border-slate-200 rounded-b-lg p-4">
                    <div className="text-sm text-slate-700">
                        {content}
                    </div>
                </div>
            )}
        </div>
    );
};

const LandingPage = ({ onSelectSection }) => {
    const [currentView, setCurrentView] = useState('resumen');
    const [selectedPathogen, setSelectedPathogen] = useState('p_aeruginosa');
    const [resistanceChart, setResistanceChart] = useState(null);
    const [topPathogensChart, setTopPathogensChart] = useState(null);

    // Simplified data structure
    const appData = {
        topPathogens: {
            labels: ["E. coli", "S. aureus", "K. pneumoniae", "P. aeruginosa", "A. baumannii"],
            data: [4000, 3100, 2600, 2000, 1500],
        },
        pathogens: {
            p_aeruginosa: {
                name: "Pseudomonas aeruginosa",
                burden: "4ta causa de muerte por RAM en Colombia (2,000 muertes en 2019). Prevalencia en UCI aumentó de 8% a 11% (2018-2021). 2do agente en Neumonía Asociada a Ventilador (20.7%) y Bacteriemia (10.5%) en UCI de adultos (2023).",
                resistance: {
                    labels: ["Pip-Tazo", "Ceftazidima", "Cefepime", "Imipenem", "Meropenem", "Ciprofloxacina", "Amikacina"],
                    datasets: [{
                        label: "% Resistencia",
                        data: [35, 30, 30, 28, 28, 30, 30],
                        backgroundColor: "rgba(13, 148, 136, 0.6)",
                        borderColor: "rgba(13, 148, 136, 1)",
                        borderWidth: 1,
                        sources: ["GREBO 2018-21", "GREBO 2001-03", "GREBO 2001-03", "INS 2022", "INS 2022", "GREBO 2001-03", "GREBO 2001-03"],
                    }],
                },
                intrinsic: ["Ampicilina", "Amoxi-Clav", "Cefalosp. 1ra-2da gen", "Tetraciclinas", "TMP-SMX", "Cloranfenicol"],
                considerations: "TENDENCIA CRÍTICA: Se ha demostrado un aumento estadísticamente significativo en la resistencia a Piperacilina-Tazobactam y Carbapenems a nivel nacional (2018-2021). La eficacia de estas terapias clave está disminuyendo activamente.",
            },
            e_coli: {
                name: "Escherichia coli",
                burden: "1ra causa de muerte por RAM en Colombia (4,000 muertes en 2019). Constituye 26-28% de todos los aislados bacterianos. Principal agente en ITU asociada a catéter en UCI (25.6% en 2023).",
                resistance: {
                    labels: ["Cefalosp. 3ra Gen", "Ciprofloxacina"],
                    datasets: [{
                        label: "% Resistencia",
                        data: [28.6, 25],
                        backgroundColor: "rgba(13, 148, 136, 0.6)",
                        borderColor: "rgba(13, 148, 136, 1)",
                        borderWidth: 1,
                        sources: ["INS 2022", "GREBO 2001-03"],
                    }],
                },
                intrinsic: [],
                considerations: "La resistencia a Cefalosporinas de 3ra Gen es un marcador de producción de BLEE. Datos de diferentes fuentes muestran tasas entre 20-28.6%, indicando una alta prevalencia de BLEE.",
            },
            k_pneumoniae: {
                name: "Klebsiella pneumoniae",
                burden: "3ra causa de muerte por RAM en Colombia (2,600 muertes en 2019). Prevalencia en UCI aumentó de 15% a 18% (2018-2021). Agente predominante en Bacteriemia (19.9%) y NAV (29.8%) en UCI de adultos (2023).",
                resistance: {
                    labels: ["Ceftriaxona", "Carbapenems"],
                    datasets: [{
                        label: "% Resistencia",
                        data: [31, 15],
                        backgroundColor: "rgba(13, 148, 136, 0.6)",
                        borderColor: "rgba(13, 148, 136, 1)",
                        borderWidth: 1,
                        sources: ["Expertos 2022", "INS-GREBO"],
                    }],
                },
                intrinsic: ["Ampicilina"],
                considerations: "La resistencia a carbapenems es una amenaza crítica y creciente a nivel nacional, a menudo mediada por carbapenemasas como KPC, cuya diseminación en Bogotá fue documentada desde 2008.",
            },
            s_aureus: {
                name: "Staphylococcus aureus",
                burden: "2da causa de muerte por RAM en Colombia (3,100 muertes en 2019). Constituye 10-11% de todos los aislados bacterianos.",
                resistance: {
                    labels: ["Infección Clínica", "UCI Bogotá", "Portadores Sanos"],
                    datasets: [{
                        label: "% Resistencia SARM",
                        data: [43, 62, 20],
                        backgroundColor: "rgba(13, 148, 136, 0.6)",
                        borderColor: "rgba(13, 148, 136, 1)",
                        borderWidth: 1,
                        sources: ["Expertos 2022", "GREBO 2001-03", "Expertos 2022"],
                    }],
                },
                intrinsic: ["Aztreonam", "Polimixinas"],
                considerations: "La prevalencia de SARM es alta y depende del contexto: 43% en infecciones clínicas, pero puede superar el 60% en UCI. Esto requiere el uso empírico de terapias alternativas como vancomicina en pacientes críticos.",
            },
            a_baumannii: {
                name: "Acinetobacter baumannii",
                burden: "5ta causa de muerte por RAM en Colombia (1,500 muertes en 2019). Patógeno formidable casi exclusivo de entornos de UCI.",
                resistance: {
                    labels: ["Carbapenems"],
                    datasets: [{
                        label: "% Resistencia",
                        data: [45],
                        backgroundColor: "rgba(13, 148, 136, 0.6)",
                        borderColor: "rgba(13, 148, 136, 1)",
                        borderWidth: 1,
                        sources: ["INS 2022"],
                    }],
                },
                intrinsic: ["Ampicilina", "Cefalosp. 1ra-2da gen", "Ertapenem"],
                considerations: "Patógeno nosocomial con tasas de resistencia a carbapenémicos extremadamente altas (>45%), lo que limita severamente las opciones terapéuticas y lo convierte en una amenaza crítica.",
            },
        },
        crossResistanceData: [
            {
                title: "Producción de BLEE (ESBL)",
                content: "En E. coli, K. pneumoniae, P. mirabilis. Implica resistencia a todas las penicilinas, todas las cefalosporinas (1ra-4ta gen), y aztreonam, sin importar el resultado in vitro. Los carbapenems permanecen activos.",
            },
            {
                title: "Producción de Carbapenemasa (ej. KPC)",
                content: "En Enterobacterales, P. aeruginosa, A. baumannii. Implica resistencia a todos los beta-lactámicos (penicilinas, cefalosporinas, carbapenems). El tratamiento requiere agentes noveles o terapia combinada.",
            },
            {
                title: "S. aureus Meticilino-Resistente (SARM)",
                content: "En S. aureus. Implica resistencia a todos los beta-lactámicos (excepto ceftarolina). Usar Cefoxitin como marcador. Opciones terapéuticas incluyen vancomicina, daptomicina, linezolid.",
            },
            {
                title: "Resistencia a Fluoroquinolonas de Alto Nivel",
                content: "En Enterobacterales, P. aeruginosa. Implica alta probabilidad de resistencia a todas las fluoroquinolonas (ciprofloxacina, levofloxacina, etc.). No se recomienda probar una segunda fluoroquinolona.",
            },
        ],
    };

    // Chart initialization
    useEffect(() => {
        if (typeof window !== 'undefined' && window.Chart) {
            // Add a small delay to ensure DOM is ready
            setTimeout(() => {
                initializeCharts();
            }, 100);
        }
        
        // Cleanup function to destroy charts on unmount
        return () => {
            if (topPathogensChart) {
                topPathogensChart.destroy();
                setTopPathogensChart(null);
            }
            if (resistanceChart) {
                resistanceChart.destroy();
                setResistanceChart(null);
            }
        };
    }, [currentView]);

    const initializeCharts = () => {
        // Destroy existing charts before creating new ones
        if (topPathogensChart) {
            topPathogensChart.destroy();
            setTopPathogensChart(null);
        }
        if (resistanceChart) {
            resistanceChart.destroy();
            setResistanceChart(null);
        }

        // Top Pathogens Chart
        if (currentView === 'resumen') {
            const topCtx = document.getElementById('topPathogensChart');
            if (topCtx) {
                // Check if chart already exists on this canvas
                const existingChart = window.Chart.getChart(topCtx);
                if (existingChart) {
                    existingChart.destroy();
                }
                
                const chart = new window.Chart(topCtx, {
                    type: 'bar',
                    data: {
                        labels: appData.topPathogens.labels,
                        datasets: [{
                            label: 'Muertes Asociadas',
                            data: appData.topPathogens.data,
                            backgroundColor: 'rgba(13, 148, 136, 0.6)',
                            borderColor: 'rgba(13, 148, 136, 1)',
                            borderWidth: 1,
                        }],
                    },
                    options: {
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                callbacks: {
                                    label: (c) => ` ${c.raw.toLocaleString()} muertes`,
                                },
                            },
                        },
                        scales: {
                            x: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Número de Muertes (Estimado 2019)',
                                },
                            },
                        },
                    },
                });
                setTopPathogensChart(chart);
            }
        }

        // Resistance Chart
        if (currentView === 'patogenos') {
            updateResistanceChart();
        }
    };

    const updateResistanceChart = () => {
        const pathogenData = appData.pathogens[selectedPathogen];
        if (!pathogenData) return;

        const ctx = document.getElementById('resistanceChart');
        if (ctx) {
            // Check if chart already exists on this canvas
            const existingChart = window.Chart.getChart(ctx);
            if (existingChart) {
                existingChart.destroy();
            }
            
            const chart = new window.Chart(ctx, {
                type: 'bar',
                data: pathogenData.resistance,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            title: { display: true, text: '% Resistencia' },
                        },
                    },
                    plugins: {
                        legend: { display: pathogenData.resistance.datasets.length > 1 },
                        tooltip: {
                            callbacks: {
                                label: (c) => ` ${c.dataset.label || ""}: ${c.raw}%`,
                                afterLabel: (c) => `Fuente: ${c.dataset.sources ? c.dataset.sources[c.dataIndex] : ''}`,
                            },
                        },
                    },
                },
            });
            setResistanceChart(chart);
        }
    };

    useEffect(() => {
        if (currentView === 'patogenos' && selectedPathogen) {
            updateResistanceChart();
        }
    }, [selectedPathogen, currentView]);

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

                {/* Epidemiological Content Tabs */}
                <div className="mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                        Atlas Epidemiológico Nacional
                    </h3>
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        <button
                            onClick={() => setCurrentView('resumen')}
                            className={`px-6 py-3 rounded-lg font-medium transition-all ${
                                currentView === 'resumen' 
                                    ? 'bg-teal-600 text-white' 
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            🏠 Resumen Nacional
                        </button>
                        <button
                            onClick={() => setCurrentView('patogenos')}
                            className={`px-6 py-3 rounded-lg font-medium transition-all ${
                                currentView === 'patogenos' 
                                    ? 'bg-teal-600 text-white' 
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            🦠 Perfiles de Patógenos
                        </button>
                        <button
                            onClick={() => setCurrentView('principios')}
                            className={`px-6 py-3 rounded-lg font-medium transition-all ${
                                currentView === 'principios' 
                                    ? 'bg-teal-600 text-white' 
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            🔬 Principios Clave
                        </button>
                    </div>
                </div>

                {/* Content Sections */}
                {currentView === 'resumen' && (
                    <div className="space-y-8">
                        <header className="mb-8">
                            <h2 className="text-3xl font-bold text-slate-900">
                                Panorama de la Resistencia Antimicrobiana en Colombia
                            </h2>
                            <p className="mt-2 text-slate-600">
                                Un resumen del impacto, los patógenos clave y los sistemas de vigilancia que definen el desafío de la RAM en el país.
                            </p>
                        </header>

                        {/* Mortality Statistics */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                            <h3 className="text-xl font-semibold text-slate-900 mb-4">
                                Carga de Mortalidad por RAM en Colombia (Datos 2019)
                            </h3>
                            <p className="text-slate-600 mb-6">
                                La resistencia antimicrobiana es una de las principales causas de muerte en Colombia, superando la mortalidad combinada de varias enfermedades crónicas. Los datos del IHME de 2019 revelan la escala del problema.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                                    <h4 className="font-semibold text-red-800 mb-2">Mortalidad Asociada a la RAM</h4>
                                    <p className="text-4xl font-bold text-red-600">18,200</p>
                                    <p className="text-red-700">muertes en las que una infección resistente fue un factor contribuyente.</p>
                                </div>
                                <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                                    <h4 className="font-semibold text-red-800 mb-2">Mortalidad Atribuible a la RAM</h4>
                                    <p className="text-4xl font-bold text-red-700">4,700</p>
                                    <p className="text-red-700">muertes directamente causadas por la infección resistente.</p>
                                </div>
                            </div>
                        </div>

                        {/* Top Pathogens Chart */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                            <h3 className="text-xl font-semibold text-slate-900 mb-4">
                                Patógenos con Mayor Mortalidad Asociada en Colombia (2019)
                            </h3>
                            <div className="chart-container" style={{ position: 'relative', height: '350px', maxHeight: '40vh' }}>
                                <canvas id="topPathogensChart"></canvas>
                            </div>
                            <p className="text-xs text-center text-slate-500 mt-2">
                                Fuente: IHME 2019. Pase el cursor sobre las barras para ver el número de muertes.
                            </p>
                        </div>

                        {/* Surveillance Architecture */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                            <h3 className="text-xl font-semibold text-slate-900 mb-4">
                                Arquitectura de la Vigilancia de la RAM en Colombia
                            </h3>
                            <p className="text-slate-600 mb-6">
                                Colombia utiliza un enfoque de "Una Salud" y triangulación de datos, integrando información de múltiples niveles. Para un antibiograma local, es crucial priorizar datos locales, contextualizarlos con datos nacionales y compararlos con benchmarks regionales.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
                                <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
                                    <h4 className="font-semibold text-teal-800">Local (GREBO)</h4>
                                    <p className="text-sm text-teal-700">
                                        Red de hospitales en Bogotá. Provee datos de alta granularidad, especialmente de UCI, que suelen mostrar tasas de resistencia más altas que el promedio nacional.
                                    </p>
                                </div>
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <h4 className="font-semibold text-blue-800">Nacional (INS/SIVIGILA)</h4>
                                    <p className="text-sm text-blue-700">
                                        Sistema de reporte obligatorio nacional. Provee la data oficial del país. Nota: Sufrió una brecha de reportes en 2020 durante la pandemia.
                                    </p>
                                </div>
                                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                                    <h4 className="font-semibold text-indigo-800">Regional (PAHO/ReLAVRA+)</h4>
                                    <p className="text-sm text-indigo-700">
                                        Red latinoamericana que agrega datos de 20 países. Permite la comparación y el benchmarking regional. Usa CLSI como estándar.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {currentView === 'patogenos' && (
                    <div className="space-y-6">
                        <header className="mb-8">
                            <h2 className="text-3xl font-bold text-slate-900">
                                Perfiles de Resistencia por Patógeno
                            </h2>
                            <p className="mt-2 text-slate-600">
                                Seleccione un patógeno para visualizar su perfil de resistencia, carga epidemiológica y consideraciones clave, basado en la triangulación de datos de vigilancia colombianos.
                            </p>
                        </header>

                        {/* Pathogen Selector */}
                        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                            <label htmlFor="pathogen-select" className="block text-sm font-medium text-slate-700 mb-2">
                                Seleccionar Patógeno:
                            </label>
                            <select
                                id="pathogen-select"
                                value={selectedPathogen}
                                onChange={(e) => setSelectedPathogen(e.target.value)}
                                className="w-full md:w-1/2 p-2 border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                            >
                                <option value="p_aeruginosa">Pseudomonas aeruginosa</option>
                                <option value="e_coli">Escherichia coli</option>
                                <option value="k_pneumoniae">Klebsiella pneumoniae</option>
                                <option value="s_aureus">Staphylococcus aureus</option>
                                <option value="a_baumannii">Acinetobacter baumannii</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Resistance Chart */}
                            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                                    Perfil de Resistencia para {appData.pathogens[selectedPathogen]?.name}
                                </h3>
                                <div className="chart-container" style={{ position: 'relative', height: '400px' }}>
                                    <canvas id="resistanceChart"></canvas>
                                </div>
                                <p className="text-xs text-center text-slate-500 mt-2">
                                    Pase el cursor sobre las barras para ver el porcentaje y la fuente del dato.
                                </p>
                            </div>

                            {/* Pathogen Info */}
                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                                    <h4 className="font-semibold text-slate-900 mb-2">Carga Epidemiológica</h4>
                                    <p className="text-sm text-slate-600">
                                        {appData.pathogens[selectedPathogen]?.burden}
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                                    <h4 className="font-semibold text-slate-900 mb-2">Consideraciones Clave y Tendencias</h4>
                                    <p className="text-sm text-slate-600">
                                        {appData.pathogens[selectedPathogen]?.considerations}
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                                    <h4 className="font-semibold text-slate-900 mb-2">Resistencia Intrínseca</h4>
                                    <p className="text-sm text-slate-600 mb-2">
                                        Este patógeno es naturalmente resistente a los siguientes agentes. No deben ser usados.
                                    </p>
                                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                                        {appData.pathogens[selectedPathogen]?.intrinsic?.length > 0 ? (
                                            appData.pathogens[selectedPathogen].intrinsic.map((drug, index) => (
                                                <li key={index}>{drug}</li>
                                            ))
                                        ) : (
                                            <li>Ninguna resistencia intrínseca común a destacar.</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {currentView === 'principios' && (
                    <div className="space-y-8">
                        <header className="mb-8">
                            <h2 className="text-3xl font-bold text-slate-900">
                                Principios Clave y Hallazgos del Informe
                            </h2>
                            <p className="mt-2 text-slate-600">
                                Conceptos y conclusiones fundamentales del análisis de la resistencia en Colombia para la interpretación y uso adecuado de los datos.
                            </p>
                        </header>

                        {/* Critical Findings */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                            <h3 className="text-xl font-semibold text-slate-900 mb-4">
                                Hallazgos y Tendencias Críticas del Informe
                            </h3>
                            <p className="text-slate-600 mb-6">
                                El análisis de los datos de vigilancia colombianos revela varias tendencias y conclusiones que son cruciales para la práctica clínica y la salud pública.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
                                    <span className="text-2xl mt-1">📈</span>
                                    <div>
                                        <h4 className="font-bold text-amber-800">
                                            Tendencia de Alarma: Resistencia Creciente en P. aeruginosa
                                        </h4>
                                        <p className="text-sm text-amber-700">
                                            El hallazgo más consistente y estadísticamente significativo del período 2018-2021 fue el aumento de la resistencia de P. aeruginosa a Piperacilina-Tazobactam y Carbapenems. La eficacia de estas terapias de primera línea está disminuyendo activamente a nivel nacional.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 bg-sky-50 border-l-4 border-sky-500 rounded-r-lg">
                                    <span className="text-2xl mt-1">💉</span>
                                    <div>
                                        <h4 className="font-bold text-sky-800">
                                            Impacto de la Vigilancia en Políticas Públicas: Caso S. pneumoniae
                                        </h4>
                                        <p className="text-sm text-sky-700">
                                            La vigilancia demostró que la alta resistencia a penicilina y ceftriaxona en niños estaba ligada al serotipo 19A, no cubierto por la vacuna PCV10. Este dato fue fundamental para impulsar el cambio de la política nacional de vacunación a la PCV13.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 bg-violet-50 border-l-4 border-violet-500 rounded-r-lg">
                                    <span className="text-2xl mt-1">🧩</span>
                                    <div>
                                        <h4 className="font-bold text-violet-800">
                                            El Imperativo de la Triangulación de Datos
                                        </h4>
                                        <p className="text-sm text-violet-700">
                                            Un antibiograma local preciso no puede basarse en una sola fuente. Es esencial triangular la información: priorizar los datos locales, contextualizarlos con los datos nacionales, y compararlos con los benchmarks regionales.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cross-Resistance */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                            <h3 className="text-xl font-semibold text-slate-900 mb-4">
                                Resistencia Cruzada: Interpretando Fenotipos Complejos
                            </h3>
                            <p className="text-slate-600 mb-4">
                                Un único mecanismo de resistencia puede conferir insensibilidad a múltiples fármacos. Reconocer estos fenotipos es clave para la interpretación. Haga clic en cada fenotipo para ver los detalles.
                            </p>
                            <div className="space-y-2">
                                {appData.crossResistanceData.map((item, index) => (
                                    <AccordionItem key={index} title={item.title} content={item.content} />
                                ))}
                            </div>
                        </div>

                        {/* Stewardship Strategies */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                            <h3 className="text-xl font-semibold text-slate-900 mb-4">
                                Estrategias de Reporte Avanzadas (Stewardship)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold text-slate-800">Reporte en Cascada</h4>
                                    <p className="text-slate-600 text-sm">
                                        Práctica de suprimir los resultados de antibióticos de amplio espectro cuando un aislado es susceptible a un agente de espectro más estrecho y terapéuticamente equivalente. Esto guía al clínico a usar el fármaco más dirigido, preservando los de amplio espectro.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800">Reporte Selectivo</h4>
                                    <p className="text-slate-600 text-sm">
                                        Consiste en suprimir el resultado de un antibiótico que es clínicamente ineficaz para un tipo de infección específico, sin importar el resultado in vitro. Ejemplo: suprimir el resultado de daptomicina para un S. aureus de origen respiratorio, ya que es inactivado por el surfactante pulmonar.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default LandingPage;