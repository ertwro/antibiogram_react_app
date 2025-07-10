# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an enhanced Antibiogram Clinical Decision Support Tool built with React + Vite. Originally a basic multi-step form application, it has been significantly upgraded to provide sophisticated antibiogram interpretation that mimics infectious disease specialist reasoning. The tool helps healthcare professionals make evidence-based antibiotic treatment decisions through comprehensive bacterial identification, resistance pattern recognition, and intelligent clinical decision support.

## Common Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally

## Architecture

### Enhanced Application Structure

The app is built as a single-page application with an intelligent multi-step wizard interface:

1. **Patient Data Step** - Comprehensive demographics, renal/hepatic function with automated TFG, BMI, and Child-Pugh scoring
2. **Infection Location Step** - Site-specific infection classification with clinical context
3. **Enhanced Bacterial Identification Step** - Advanced bacterial identification system with:
   - Laboratory identification characteristics (Gram stain, morphology, biochemical tests)
   - Taxonomic classification and clinical significance scoring
   - Advanced search with filtering by Gram stain and pathogenicity
   - Comprehensive bacterial profiles with resistance mechanisms and epidemiology
4. **Intelligent Antibiogram Interpretation Step** - Sophisticated susceptibility testing with:
   - CLSI-compliant breakpoint interpretation
   - Resistance pattern recognition and cross-resistance prediction
   - Clinical interpretation rules and stewardship guidance
5. **Hypersensitivity Assessment** - Advanced allergy cross-reactivity analysis
6. **Clinical Decision Support** - Expert-level treatment recommendations with stewardship principles

### Key Data Models

**Patient Data (`formData` state)**:
- Demographics: age, gender, weight, height
- Renal function: creatinine, optional cystatin C, renal replacement therapy
- Hepatic function: Child-Pugh scoring components (bilirubin, albumin, INR, ascites, encephalopathy)
- Pregnancy/fertility status for women of childbearing age

**Enhanced Microbiology Database** (`src/data/microbiologyData.js`):
- **Comprehensive Taxonomic Classification**: Full phylogenetic hierarchy (domain → species)
- **Laboratory Identification Characteristics**:
  - Gram stain results and morphology
  - Biochemical test profiles (catalase, oxidase, indole, etc.)
  - Growth characteristics (atmosphere, temperature, special media)
  - Molecular markers and identification genes
- **Clinical Significance Scoring**: Primary pathogen vs. opportunistic vs. colonizer classification
- **Pathogenicity Profiles**: Virulence factors, common infections, and pathotypes
- **Resistance Mechanisms**: Detailed enzymatic, target modification, and efflux mechanisms
- **Enhanced Treatment Guidelines**: Site-specific recommendations with stewardship considerations
- **Advanced CLSI Panels**: Breakpoints with interpretation rules and cross-resistance patterns
- **Epidemiological Data**: Prevalence, reservoirs, transmission, and risk factors

**Enhanced Antibiotics Database** (`src/data/antibiotics.js`):
- **Comprehensive Drug Classification**: Family, subclass, generation with standardized categories
- **Mechanism of Action**: Target proteins, bactericidal/static activity, PK/PD optimization parameters
- **Spectrum of Activity**: Detailed gram-positive, gram-negative, anaerobic, and atypical coverage
- **Advanced Dosing Information**: 
  - Adult/pediatric standard and severe infection dosing
  - Extended infusion protocols for time-dependent antibiotics
  - Comprehensive renal adjustment algorithms by CrCl ranges
  - Hepatic dosing modifications
- **Therapeutic Drug Monitoring**: 
  - Level monitoring requirements (AUC, trough, peak targets)
  - PK/PD target achievement parameters
  - Monitoring frequency and safety parameters
- **Resistance Intelligence**: 
  - Mechanism-specific resistance patterns
  - Cross-resistance predictions
  - Surveillance recommendations for emerging resistance
- **Safety Profiles**: 
  - Pregnancy categories and lactation safety
  - Black box warnings and major adverse effects
  - Contraindications and monitoring requirements
- **Drug Interactions**: Comprehensive drug-drug and food-drug interactions
- **Stewardship Integration**: 
  - Preferred indications and avoidance recommendations
  - De-escalation guidance and resistance risk assessment
  - Appropriateness scoring for clinical scenarios

### Enhanced Clinical Decision Engine

The intelligent recommendation system now incorporates infectious disease specialist-level reasoning:

1. **Advanced Resistance Pattern Recognition**:
   - Automatic detection of ESBL, AmpC, and carbapenemase phenotypes
   - Cross-resistance prediction based on resistance mechanisms
   - Intrinsic resistance patterns by bacterial species
   - Inducible resistance identification (MLSᵦ, AmpC)

2. **Intelligent Antibiogram Interpretation**:
   - MIC-based breakpoint analysis with clinical context
   - Resistance mechanism correlation with phenotypic results
   - Quality control flagging for unusual resistance patterns
   - Site-specific breakpoint considerations

3. **Comprehensive Allergy Assessment**:
   - Advanced cross-reactivity analysis between drug families
   - Beta-lactam allergy classification and cross-reactivity patterns
   - Alternative antibiotic selection for allergic patients

4. **Stewardship-Guided Recommendations**:
   - Narrow-spectrum preference when appropriate
   - Carbapenem stewardship and de-escalation guidance
   - Combination therapy recommendations for serious infections
   - Local epidemiology and resistance pattern considerations

### Calculations Module

Real-time clinical calculations (`calculations` useMemo in App.jsx:87-101):
- **TFG Calculation**: Age-appropriate formulas (Schwartz for pediatric, CKD-EPI for adults)
- **BMI Classification**: Standard WHO categories
- **Child-Pugh Scoring**: Automated hepatic function assessment

### Enhanced UI Components

Sophisticated component structure with clinical workflow optimization:
- **Enhanced Bacterial Selection Interface**:
  - Multi-dimensional search (name, characteristics, taxonomy)
  - Advanced filtering by Gram stain and clinical significance
  - Interactive bacterial profiles with laboratory identification
  - Visual resistance mechanism display and epidemiological data
- **Intelligent Antibiogram Display**:
  - Interactive breakpoint visualization with clinical interpretation
  - Resistance pattern highlighting with mechanism explanations
  - Cross-resistance indicators and stewardship recommendations
- **Clinical Significance Badges**: Visual pathogenicity classification
- **Responsive Design**: Optimized for both desktop and mobile workflows

## Development Notes

- Uses ES6 modules with `.js` extensions (not `.jsx` despite JSX content)
- Tailwind CSS for styling with extensive custom classes
- Single-file component architecture (all components in App.jsx)
- Extensive use of React hooks: `useState`, `useMemo`, `useEffect` patterns
- No external state management - relies on local component state
- Copy-to-clipboard functionality for clinical summaries
- Responsive design with mobile-first approach

## Clinical Domain Context

This is a sophisticated medical application that mimics infectious disease specialist decision-making. Critical areas requiring accuracy:

### Core Clinical Features
- **Advanced Bacterial Identification**: Laboratory-grade identification with biochemical tests and growth characteristics
- **Intelligent Resistance Pattern Recognition**: ESBL, AmpC, carbapenemase detection with phenotypic correlation
- **Evidence-Based Treatment Selection**: Site-specific guidelines with stewardship integration
- **Comprehensive Allergy Management**: Cross-reactivity patterns and alternative selection
- **PK/PD Optimization**: Renal/hepatic adjustments with dosing optimization
- **Pregnancy Safety**: Risk stratification and drug selection in pregnancy

### Database Enhancement Status
- ✅ **Enhanced Bacterial Database**: Complete taxonomic, laboratory identification, and resistance mechanism data
- ✅ **Advanced Search System**: Multi-dimensional filtering and clinical significance scoring
- ✅ **Enhanced UI**: Interactive bacterial profiles with comprehensive clinical information
- ✅ **Comprehensive Antibiotics Database**: Complete PK/PD, dosing, safety, and stewardship data with helper functions
- ✅ **Resistance Pattern Engine**: Advanced algorithms for ESBL, AmpC, carbapenemase, MRSA, VRE, MLSb detection
- ✅ **CLSI Breakpoint Interpreter**: MIC-based analysis with organism-specific breakpoints and clinical context
- ✅ **Intelligent Antibiogram Engine**: Comprehensive treatment scoring with clinical context integration
- ✅ **Clinical Decision Support System**: Multi-factorial analysis with infectious disease specialist-level reasoning
- ⏳ **PK/PD Module**: Dosing optimization and target attainment calculations (pending)

### Reference Materials
- **SAGA Files**: Antibiotic spectrum reference data (references/SAGA*.pdf)
  - The SAGA file will be filled by the user
- **Pathogen-Specific Data**: Detailed bacterial profiles (references/bacteria/*.pdf)
- **Comprehensive Antibacterial Drug Database**: Extensive drug information organized by class (references/antibacterial_drugs/)
  - Individual drug monographs with PK/PD, dosing, and safety data
  - Drug class overviews (penicillins, cephalosporins, carbapenems, etc.)
  - Specialized therapy guides (syndrome-specific, topical, urinary tract)
  - Resistance genotype and phenotype correlations
- **Clinical Guidelines**: Treatment recommendations and stewardship principles

### Development Principles
When making changes, prioritize:
1. **Clinical Accuracy**: All medical logic must be evidence-based
2. **Safety**: Conservative recommendations for patient safety
3. **Stewardship**: Promote appropriate antibiotic use
4. **Usability**: Intuitive workflow for healthcare professionals
5. **Comprehensive Coverage**: Support for complex clinical scenarios