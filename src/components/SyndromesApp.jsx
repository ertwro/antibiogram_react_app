import React, { useState, useEffect } from 'react';

const SyndromesApp = ({ onBackToLanding }) => {
    const [currentView, setCurrentView] = useState('resumen');
    const [selectedPathogen, setSelectedPathogen] = useState('p_aeruginosa');
    const [resistanceChart, setResistanceChart] = useState(null);
    const [topPathogensChart, setTopPathogensChart] = useState(null);

    // Complete data from antibiogram.html
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
                    labels: ["Pip/Tazo", "Ceftazidima", "Cefepime", "Imipenem", "Meropenem", "Ciprofloxacina", "Amikacina"],
                    datasets: [{
                        label: "% Resistencia",
                        data: [35, 30, 30, 28, 28, 30, 30],
                        backgroundColor: "rgba(13, 148, 136, 0.6)",
                        borderColor: "rgba(13, 148, 136, 1)",
                        borderWidth: 1,
                        sources: ["GREBO 2018-21 (aumento sig.)", "GREBO 2001-03 (>30%)", "GREBO 2001-03 (>30%)", "INS 2022 (23.9-27.9%)", "INS 2022 (23.9-27.9%)", "GREBO 2001-03 (>30%)", "GREBO 2001-03 (>30%)"],
                    }],
                },
                intrinsic: ["Ampicilina", "Amoxi/Clav", "Cefalosp. 1ra/2da gen", "Tetraciclinas", "TMP/SMX", "Cloranfenicol"],
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
                        sources: ["INS 2022 (28.6%)", "GREBO 2001-03 (>20%)"],
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
                        sources: ["Expertos 2022 (31%) / GREBO 2001-03 (>30%)", "INS/GREBO (variable, creciente)"],
                    }],
                },
                intrinsic: ["Ampicilina"],
                considerations: "La resistencia a carbapenems es una amenaza crítica y creciente a nivel nacional, a menudo mediada por carbapenemasas como KPC, cuya diseminación en Bogotá fue documentada desde 2008.",
            },
            e_cloacae: {
                name: "Enterobacter cloacae complex",
                burden: "Causa frecuente de infecciones nosocomiales, especialmente en inmunocomprometidos. No está en el top 5 de mortalidad, pero es un patógeno de alta preocupación por su resistencia.",
                resistance: {
                    labels: ["Ceftriaxona", "Cefepime", "Pip/Tazo", "Meropenem", "Ciprofloxacina"],
                    datasets: [{
                        label: "% Resistencia (GREBO 2023)",
                        data: [38, 28.6, 35.7, 11.9, 30.8],
                        backgroundColor: "rgba(13, 148, 136, 0.6)",
                        borderColor: "rgba(13, 148, 136, 1)",
                        borderWidth: 1,
                        sources: ["GREBO 2023", "GREBO 2023", "GREBO 2023", "GREBO 2023", "GREBO 2023"],
                    }],
                },
                intrinsic: ["Ampicilina", "Amoxi/Clav", "Cefalosp. 1ra Gen", "Cefoxitina"],
                considerations: "La principal característica es la presencia de una β-lactamasa AmpC cromosómica inducible. La exposición a cefalosporinas de 1ra/2da/3ra gen puede seleccionar mutantes hiperproductoras, causando fracaso terapéutico. Cefepime es el agente de elección si es susceptible.",
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
                        sources: ["INS 2022 (UCI Adultos)"],
                    }],
                },
                intrinsic: ["Ampicilina", "Cefalosp. 1ra/2da gen", "Ertapenem"],
                considerations: "Patógeno nosocomial con tasas de resistencia a carbapenémicos extremadamente altas (>45%), lo que limita severamente las opciones terapéuticas y lo convierte en una amenaza crítica.",
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
                        sources: ["Infección Clínica (Expertos 2022)", "UCI Bogotá (GREBO 2001-03)", "Portadores Sanos (Expertos 2022)"],
                    }],
                },
                intrinsic: ["Aztreonam", "Polimixinas"],
                considerations: "La prevalencia de SARM es alta y depende del contexto: 43% en infecciones clínicas, pero puede superar el 60% en UCI. Esto requiere el uso empírico de terapias alternativas como vancomicina en pacientes críticos.",
            },
            e_faecium: {
                name: "Enterococcus faecium",
                burden: "Patógeno de alta preocupación en UCI, especialmente por VRE.",
                resistance: {
                    labels: ["Vancomicina (ERV)", "Vancomicina (ERV)"],
                    datasets: [{
                        label: "% Resistencia",
                        data: [40.1, 54.5],
                        backgroundColor: "rgba(13, 148, 136, 0.6)",
                        borderColor: "rgba(13, 148, 136, 1)",
                        borderWidth: 1,
                        sources: ["UCI Adultos (INS 2022)", "UCI Neonatal (INS 2022)"],
                    }],
                },
                intrinsic: ["Cefalosporinas", "Clindamicina", "TMP/SMX"],
                considerations: "La resistencia a vancomicina (ERV) es muy preocupante, especialmente en E. faecium, superando el 40% en UCI de adultos y un alarmante 54% en UCI neonatales.",
            },
            s_pneumoniae: {
                name: "Streptococcus pneumoniae",
                burden: "Principal causa de Neumonía Adquirida en la Comunidad, meningitis y bacteriemia. La resistencia complica el tratamiento de la enfermedad invasiva.",
                resistance: {
                    labels: ["Penicilina (Meningeo)", "Ceftriaxona (Meningeo)", "Penicilina (No Meningeo)", "Ceftriaxona (No Meningeo)"],
                    datasets: [{
                        label: "% Resistencia o Susc. Disminuida",
                        data: [41.3, 21.7, 28.2, 24.2],
                        backgroundColor: "rgba(13, 148, 136, 0.6)",
                        borderColor: "rgba(13, 148, 136, 1)",
                        borderWidth: 1,
                        sources: ["IPD Pediátrica 2017-22", "IPD Pediátrica 2017-22", "IPD Pediátrica 2017-22", "IPD Pediátrica 2017-22"],
                    }],
                },
                intrinsic: ["Aminoglucósidos (bajo nivel)"],
                considerations: "La resistencia está fuertemente ligada al serotipo 19A, no cubierto por la vacuna PCV10. Estos datos de vigilancia impulsaron el cambio de política nacional a la vacuna PCV13 para mejorar la cobertura.",
            },
        },
        crossResistanceData: [
            {
                title: "Producción de BLEE (ESBL)",
                content: "<strong>En:</strong> E. coli, K. pneumoniae, P. mirabilis.<br><strong>Implica Resistencia a:</strong> Todas las penicilinas, todas las cefalosporinas (1ra-4ta gen), y aztreonam, sin importar el resultado in vitro.<br><strong>Nota Clínica:</strong> Reportar estos agentes como resistentes. Los carbapenems permanecen activos. La susceptibilidad a combinaciones con inhibidores (ej. Pip/Tazo) es variable.",
            },
            {
                title: "Producción de Carbapenemasa (ej. KPC)",
                content: "<strong>En:</strong> Enterobacterales, P. aeruginosa, A. baumannii.<br><strong>Implica Resistencia a:</strong> Todos los beta-lactámicos (penicilinas, cefalosporinas, carbapenems).<br><strong>Nota Clínica:</strong> Hallazgo de salud pública crítico. El tratamiento requiere agentes noveles (ej. ceftazidima-avibactam) o terapia combinada.",
            },
            {
                title: "S. aureus Meticilino-Resistente (SARM)",
                content: "<strong>En:</strong> S. aureus.<br><strong>Implica Resistencia a:</strong> Todos los beta-lactámicos (excepto ceftarolina).<br><strong>Nota Clínica:</strong> Usar Cefoxitin como marcador. Reportar como resistente a todos los beta-lactámicos. Opciones terapéuticas incluyen vancomicina, daptomicina, linezolid.",
            },
            {
                title: "Resistencia a Fluoroquinolonas de Alto Nivel",
                content: "<strong>En:</strong> Enterobacterales, P. aeruginosa.<br><strong>Implica Resistencia a:</strong> Alta probabilidad de resistencia a todas las fluoroquinolonas (ciprofloxacina, levofloxacina, etc.).<br><strong>Nota Clínica:</strong> No se recomienda probar una segunda fluoroquinolona; la resistencia a una predice la resistencia de clase.",
            },
            {
                title: "Resistencia Inducible a Clindamicina (Test D+)",
                content: "<strong>En:</strong> Estafilococos, S. pyogenes.<br><strong>Implica Resistencia a:</strong> Falla terapéutica con clindamicina in vivo a pesar de parecer susceptible in vitro.<br><strong>Nota Clínica:</strong> Si el test de aproximación de discos (D-test) es positivo, reportar clindamicina como resistente.",
            },
        ],
    };

    // Chart initialization
    useEffect(() => {
        if (typeof window !== 'undefined' && window.Chart) {
            initializeCharts();
        }
        
        // Handle URL hash navigation
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            if (['resumen', 'patogenos', 'principios'].includes(hash)) {
                setCurrentView(hash);
            }
        };
        
        window.addEventListener('hashchange', handleHashChange);
        
        // Handle initial load
        handleHashChange();
        
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, [currentView]);

    const initializeCharts = () => {
        // Top Pathogens Chart
        if (currentView === 'resumen') {
            const topCtx = document.getElementById('topPathogensChart');
            if (topCtx && !topPathogensChart) {
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
            if (resistanceChart) {
                resistanceChart.destroy();
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
        
        // Cleanup charts on unmount
        return () => {
            if (resistanceChart) {
                resistanceChart.destroy();
            }
            if (topPathogensChart) {
                topPathogensChart.destroy();
            }
        };
    }, [selectedPathogen]);

    const renderResumenView = () => (
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
                    Colombia utiliza un enfoque de "Una Salud" y triangulación de datos, integrando información de múltiples niveles. Para un antibiograma local, es crucial priorizar datos locales (propios o de redes como GREBO), contextualizarlos con datos nacionales (INS/SIVIGILA) y compararlos con benchmarks regionales (PAHO/ReLAVRA+).
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
                            Sistema de reporte obligatorio nacional. Provee la data oficial del país.
                            <strong className="text-blue-900"> Nota:</strong> Sufrió una brecha de reportes en 2020 durante la pandemia.
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
    );

    const renderPatogenosView = () => (
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
                    <option value="e_cloacae">Enterobacter cloacae complex</option>
                    <option value="a_baumannii">Acinetobacter baumannii</option>
                    <option value="s_aureus">Staphylococcus aureus</option>
                    <option value="e_faecium">Enterococcus faecium</option>
                    <option value="s_pneumoniae">Streptococcus pneumoniae</option>
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
    );

    const renderPrincipiosView = () => (
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
                                El hallazgo más consistente y estadísticamente significativo del período 2018-2021 fue el aumento de la resistencia de P. aeruginosa a <strong>Piperacilina-Tazobactam y Carbapenems</strong>. La eficacia de estas terapias de primera línea está disminuyendo activamente a nivel nacional.
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
                                La vigilancia demostró que la alta resistencia a penicilina y ceftriaxona en niños estaba ligada al serotipo 19A, no cubierto por la vacuna PCV10. Este dato fue fundamental para impulsar el cambio de la política nacional de vacunación a la PCV13, que sí cubre este serotipo.
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
                                Un antibiograma local preciso no puede basarse en una sola fuente. Es esencial triangular la información: priorizar los <strong>datos locales</strong> (del propio hospital o de redes como GREBO), contextualizarlos con los <strong>datos nacionales</strong> (INS), y compararlos con los <strong>benchmarks regionales</strong> (PAHO/ReLAVRA+).
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
    );

    return (
        <div className="min-h-full bg-slate-50 text-slate-800">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button 
                            onClick={onBackToLanding}
                            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <span className="mr-2">←</span>
                            <span className="text-sm">Volver al Inicio</span>
                        </button>
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-teal-700">Guía RAM - Colombia</h1>
                            <p className="text-sm text-slate-600">Atlas Epidemiológico Nacional</p>
                        </div>
                        <div className="w-24"></div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row">
                {/* Sidebar Navigation */}
                <aside className="w-full md:w-64 bg-white md:border-r border-slate-200 p-4">
                    <nav className="flex flex-row md:flex-col gap-2">
                        <button
                            onClick={() => {
                                setCurrentView('resumen');
                                window.history.pushState(null, '', '#resumen');
                            }}
                            className={`nav-link flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all ${
                                currentView === 'resumen' 
                                    ? 'bg-teal-600 text-white' 
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            <span className="text-xl">🏠</span>
                            <span>Resumen Nacional</span>
                        </button>
                        <button
                            onClick={() => {
                                setCurrentView('patogenos');
                                window.history.pushState(null, '', '#patogenos');
                            }}
                            className={`nav-link flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all ${
                                currentView === 'patogenos' 
                                    ? 'bg-teal-600 text-white' 
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            <span className="text-xl">🦠</span>
                            <span>Perfiles de Patógenos</span>
                        </button>
                        <button
                            onClick={() => {
                                setCurrentView('principios');
                                window.history.pushState(null, '', '#principios');
                            }}
                            className={`nav-link flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all ${
                                currentView === 'principios' 
                                    ? 'bg-teal-600 text-white' 
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            <span className="text-xl">🔬</span>
                            <span>Principios Clave</span>
                        </button>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className={`view ${currentView === 'resumen' ? 'active' : ''}`} style={{
                        display: currentView === 'resumen' ? 'block' : 'none',
                        animation: currentView === 'resumen' ? 'fadeIn 0.5s' : 'none'
                    }}>
                        {currentView === 'resumen' && renderResumenView()}
                    </div>
                    <div className={`view ${currentView === 'patogenos' ? 'active' : ''}`} style={{
                        display: currentView === 'patogenos' ? 'block' : 'none',
                        animation: currentView === 'patogenos' ? 'fadeIn 0.5s' : 'none'
                    }}>
                        {currentView === 'patogenos' && renderPatogenosView()}
                    </div>
                    <div className={`view ${currentView === 'principios' ? 'active' : ''}`} style={{
                        display: currentView === 'principios' ? 'block' : 'none',
                        animation: currentView === 'principios' ? 'fadeIn 0.5s' : 'none'
                    }}>
                        {currentView === 'principios' && renderPrincipiosView()}
                    </div>
                </main>
            </div>
        </div>
    );
};

// Accordion component for cross-resistance
const AccordionItem = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [maxHeight, setMaxHeight] = useState('0');

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setMaxHeight('200px'); // Adjust based on content
        } else {
            setMaxHeight('0');
        }
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
            <div 
                className="accordion-content bg-white border-t border-slate-200 rounded-b-lg overflow-hidden"
                style={{ maxHeight: maxHeight }}
            >
                <div className="p-4">
                    <div className="text-sm text-slate-700" dangerouslySetInnerHTML={{ __html: content }} />
                </div>
            </div>
        </div>
    );
};

export default SyndromesApp;