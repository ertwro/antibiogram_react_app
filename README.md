# Guía Interactiva de Resistencia Antimicrobiana - Colombia (Alpha)

> **Versión Alpha** - Sistema en desarrollo activo para apoyo clínico y vigilancia epidemiológica

## 🏥 Descripción del Proyecto

Sistema integrado de apoyo a la toma de decisiones clínicas para el manejo de infecciones bacterianas en Colombia, basado en datos de vigilancia nacional y triangulación de fuentes múltiples (GREBO, INS/SIVIGILA, PAHO/ReLAVRA+).

## 🎯 Características Principales

### 🧬 Antibiograma Inteligente (Disponible)
- **Interpretación CLSI automatizada** con breakpoints específicos por organismo
- **Detección de patrones de resistencia**: ESBL, AmpC, Carbapenemasas, MRSA, VRE
- **Motor de recomendaciones inteligentes** con stewardship integrado
- **Cálculos PK/PD** para optimización de dosis
- **Ajustes automáticos** por función renal y hepática
- **Panel escalonado CLSI** M100 con unlocking basado en resistencia

### 🦠 Guía de Síndromes (En Construcción)
- Atlas epidemiológico de resistencia antimicrobiana
- Perfiles dinámicos de patógenos con carga epidemiológica
- Triangulación de datos de vigilancia
- Resistencia cruzada y fenotipos complejos

## 📊 Estado Actual - Versión Alpha

### ✅ Implementado
- **Base de datos**: 12 organismos Enterobacterales completamente integrados
- **Motor clínico**: Análisis de severidad, detección de resistencia, recomendaciones terapéuticas
- **Interfaz**: Panel de susceptibilidad con clinical significance y MIC inteligente
- **Datos**: Integración automática desde fuentes JSON con build-time loading

### 🔄 En Desarrollo
- Expansión a familias bacterianas adicionales (Staphylococcus, Streptococcus, Pseudomonas, etc.)
- Módulo PK/PD completo
- Guía de síndromes con visualizaciones interactivas

## 🚀 Acceso Online

**Demo en vivo**: [https://[tu-usuario].github.io/antibiogram_react_app/](https://[tu-usuario].github.io/antibiogram_react_app/)

## 💡 Justificación Técnica

### El Problema
- **18,200 muertes** anuales en Colombia asociadas a resistencia antimicrobiana (IHME 2019)
- **4,700 muertes** directamente causadas por infecciones resistentes
- La RAM supera la mortalidad combinada de varias enfermedades crónicas

### La Solución
- **Triangulación de datos**: Local (GREBO) + Nacional (INS) + Regional (PAHO)
- **Interpretación inteligente**: Algoritmos CLSI + detección automática de resistencia
- **Apoyo clínico**: Recomendaciones basadas en evidencia local colombiana

## 🛠️ Arquitectura Técnica

### Frontend
- **React 19** con hooks avanzados
- **Tailwind CSS** para diseño responsive
- **Vite** como build tool con optimizaciones

### Backend de Datos
- **JSON estructurado** con validación automática
- **Build-time imports** para eliminación de cache issues
- **Generación automática** de índices de importación

### Algoritmos Clínicos
- **Motor de detección de resistencia** con patrones ESBL/AmpC/Carbapenemase
- **Sistema de scoring de severidad** con criterios objetivos
- **Recomendaciones contextuales** basadas en síndrome e epidemiología local

## 📈 Datos de Cobertura Actual

### Enterobacterales (12 organismos)
- E. coli, Klebsiella sp., Enterobacter cloacae complex
- Citrobacter freundii/koseri, Serratia marcescens
- Morganella morganii, Proteus sp., Providencia sp.

### Resistencia Intrínseca
- **7 de 12 organismos** con datos de resistencia intrínseca (58.3% cobertura)
- Perfiles ricos en resistencia (Serratia: 7 resistencias, Morganella: 6)
- Resistencias grupales (Klebsiella SHV-1) y mecanismo-específicas (AmpC)

## 🔬 Validación Clínica

### Fuentes de Datos Integradas
- **GREBO** (Red de hospitales Bogotá): Datos UCI alta granularidad
- **INS/SIVIGILA**: Sistema nacional obligatorio
- **PAHO/ReLAVRA+**: Benchmarking regional (20 países)

### Hallazgos Críticos Implementados
- **P. aeruginosa**: Tendencia alarmante en resistencia a pip/tazo y carbapenems
- **S. pneumoniae**: Datos que impulsaron cambio PCV10 → PCV13
- **Triangulación obligatoria**: Un antibiograma local preciso requiere múltiples fuentes

## 🚧 Roadmap de Desarrollo

### Fase 1: Expansión Patógenos (Q1-Q2 2025)
- Staphylococcus aureus (MRSA/MSSA)
- Streptococcus pneumoniae
- Enterococcus faecalis/faecium (VRE)
- Pseudomonas aeruginosa

### Fase 2: Módulos Avanzados (Q2-Q3 2025)
- PK/PD completo con target attainment
- TDM integration (vancomicina, aminoglucósidos)
- Syndrome-specific protocols

### Fase 3: Guía de Síndromes (Q3-Q4 2025)
- Dashboard epidemiológico interactivo
- Visualizaciones Chart.js con datos colombianos
- Atlas de resistencia cruzada

## 🔧 Desarrollo Local

```bash
# Clonar repositorio
git clone https://github.com/[tu-usuario]/antibiogram_react_app.git
cd antibiogram_react_app

# Instalar dependencias
npm install

# Generar índices de datos
npm run generate-imports

# Desarrollo local
npm run dev

# Build para producción
npm run build

# Deploy a GitHub Pages
npm run deploy
```

## 📞 Contacto y Contribución

Este proyecto está en desarrollo activo. Para reportar problemas, sugerir mejoras o contribuir:

- **Issues**: [GitHub Issues](https://github.com/[tu-usuario]/antibiogram_react_app/issues)
- **Datos clínicos**: Basados en literatura científica y vigilancia oficial colombiana
- **Validación**: Revisión por especialistas en infectología

---

**⚕️ Disclaimer**: Esta herramienta es de apoyo educativo y clínico. Las decisiones terapéuticas finales siempre deben ser tomadas por profesionales médicos calificados considerando el contexto clínico completo del paciente.
