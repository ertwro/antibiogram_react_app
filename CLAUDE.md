# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **world-class CLSI-based Antibiogram Clinical Decision Support System** built with React + Vite. The system implements a sophisticated 4-phase antibiogram interpretation workflow that mirrors infectious disease specialist reasoning, with two distinct operational modes:

- **Simple Mode**: CLSI-compliant antibiogram interpretation with straightforward recommendations
- **Advanced Mode**: Comprehensive clinical intelligence with comparative therapeutic strategy analysis

The application leverages months of meticulously crafted medical databases to provide pharmaceutical-grade antimicrobial susceptibility testing interpretation.

## Common Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally

## Current Implementation Status

### ✅ Completed Components

#### **Core Architecture**
- **AntibiogramMaster Component** (`src/components/AntibiogramMaster.jsx`): Orchestrates the complete 4-phase specialist workflow
- **MasterAntibiogramEngine** (`src/engines/MasterAntibiogramEngine.js`): Central orchestration engine coordinating all intelligence layers
- **Phase Components**: All 4 phases implemented as separate components
  - Phase1_SettingTheStage.jsx
  - Phase2_InitialInterpretation.jsx
  - Phase3_ResistanceMechanisms.jsx
  - Phase4_TherapeuticComparison.jsx / Phase4_SimpleRecommendations.jsx

#### **Intelligence Engines**
- **CLSIBreakpointEngine**: Handles CLSI-compliant breakpoint interpretation with tier system
- **ResistancePatternEngine**: Detects ESBL, AmpC, carbapenemases, MRSA, VRE, MLSb patterns
- **TherapeuticStrategyComparatorEngine**: Generates comparative analysis of treatment options
- **CLSIReportingEngine**: Implements CLSI tier-based cascade reporting
- **SequentialResistanceEngine**: Handles sequential resistance detection workflows

#### **Databases Integrated**
1. **CLSI Breakpoints** (`organisms_clsi/`): 13 JS modules with complete CLSI M100-Ed34 data
2. **Bacterial Profiles** (`bacteria_json/`): 91 bacterial organisms with clinical intelligence
3. **Antibiotics Database** (`antibacterial_drugs_json/`): 136+ antibiotics with PK/PD data
4. **Resistance Mechanisms** (`antimicrobial_resistance.json`): Comprehensive molecular compendium
5. **SAGA Spectrum Data** (`sagaSpectrumData.json`): Antibiotic activity matrix
6. **Clinical Syndromes** (`syndromes_json/`): 453 syndrome-specific protocols

### 🔄 Current Workflow Implementation

The application currently implements the complete 4-phase antibiogram interpretation workflow:

#### **Phase 1: Setting the Stage**
- Organism selection with CLSI categorization
- Infection site selection
- Intrinsic resistance filtering
- Initial antibiotic panel generation based on CLSI tiers

#### **Phase 2: Initial Interpretation**
- MIC/disk diffusion data entry
- CLSI breakpoint application with site-specific considerations
- Clinical override detection (e.g., daptomycin in pneumonia)
- Paradoxical result warnings

#### **Phase 3: Resistance Mechanism Detection**
- Pattern-based resistance mechanism inference
- Confirmatory test recommendations
- Mechanism-based interpretation updates
- Cross-resistance prediction

#### **Phase 4: Final Recommendations**
- **Simple Mode**: Ranked list of appropriate therapies
- **Advanced Mode**: Comparative analysis table with multi-axis evaluation
  - Efficacy scoring
  - Stewardship impact
  - Safety profiles
  - PK/PD optimization
  - Convenience factors

### 🚧 Implementation Gaps & Next Steps

Based on the blueprint analysis, the following areas need implementation or enhancement:

#### **Missing Core Features**
1. **Patient Data Integration**: The AntibiogramMaster workflow doesn't currently collect patient demographics, renal/hepatic function
2. **Site-Specific Breakpoint Selection**: While the engine supports it, the UI doesn't fully leverage site-specific breakpoints (e.g., meningitis vs non-meningeal)
3. **Local Epidemiology Integration**: Framework exists but no data input mechanism
4. **Export/Report Generation**: No clinical report generation for documentation

#### **Database Integration Gaps**
1. **Syndrome Database**: 453 syndrome files exist but aren't integrated into the workflow
2. **Resistance Genotype Database**: `antibacterial_drug_resistance_genotypes.json` not utilized
3. **CLSI Classification**: `clsi_classified_bacteria.json` not fully leveraged

#### **Advanced Mode Enhancements Needed**
1. **PK/PD Module**: Dosing optimization based on patient parameters
2. **Drug Interaction Checking**: Database exists but not implemented
3. **Therapeutic Drug Monitoring**: TDM recommendations not surfaced
4. **Combination Therapy Logic**: Limited implementation

### Key Data Architecture

#### **CLSI-Centric Database Hierarchy**
The application follows a **CLSI-centric database hierarchy** where the CLSI M100™ database serves as the **primary and most critical knowledge source**:

1. **PRIMARY: CLSI Breakpoints** - Core decision-making engine
2. **SECONDARY: Bacterial Profiles** - Clinical context and resistance patterns
3. **SECONDARY: Pharmaceutical Intelligence** - PK/PD and safety data
4. **SECONDARY: Syndrome Protocols** - Site-specific treatment guidelines

#### **4-Phase Specialist Workflow**
The system implements the complete infectious disease specialist reasoning process:

1. **Phase 1: Setting the Stage** - Organism identification and intrinsic resistance
2. **Phase 2: Initial Interpretation** - MIC/disk diffusion interpretation with clinical overrides
3. **Phase 3: Resistance Detection** - Pattern recognition and mechanism inference
4. **Phase 4: Final Plan** - Simple recommendations or comparative strategy analysis

### Technical Architecture

#### **Engine Architecture**
- **MasterAntibiogramEngine**: Orchestrates all phases and coordinates sub-engines
- **CLSIBreakpointEngine**: Handles organism-specific breakpoint lookups with inheritance
- **ResistancePatternEngine**: Detects complex resistance patterns from susceptibility data
- **TherapeuticStrategyComparatorEngine**: Generates multi-axis treatment comparisons
- **CLSIReportingEngine**: Implements cascade reporting and tier-based recommendations

#### **Component Structure**
- **AntibiogramMaster**: Main orchestrator component managing workflow state
- **Phase Components**: Modular components for each phase of interpretation
- **Legacy Components**: AntibiogramApp.jsx contains older multi-step form implementation

### Database Features

#### **CLSI Breakpoints** (organisms_clsi/)
- 89 organism-specific modules with inheritance patterns
- 4-tier antibiotic classification system
- Site-specific breakpoints (UTI, meningitis)
- Clinical warnings and stewardship notes
- Special testing requirements

#### **Bacterial Profiles** (bacteria_json/)
- 91 organisms across 7 taxonomic groups
- Resistance mechanisms with clinical implications
- Treatment algorithms by syndrome and severity
- Intrinsic resistance patterns
- High-risk population identification

#### **Pharmaceutical Intelligence** (antibacterial_drugs_json/)
- 136+ individual drug monographs
- Complete PK/PD parameters
- Renal/hepatic dosing algorithms
- Drug shortage tracking
- Black box warnings and safety profiles

#### **Resistance Mechanisms** (antimicrobial_resistance.json)
- Ambler classification system
- Detection methodologies
- Clinical case studies
- WHO priority pathogens
- Future therapeutic innovations

## Development Notes

- Uses ES6 modules with `.jsx` extensions for React components
- Tailwind CSS for styling with extensive custom classes
- Modular component architecture with phase-based organization
- Extensive use of React hooks: `useState`, `useMemo`, `useEffect` patterns
- No external state management - relies on local component state
- Engine-based architecture for clinical logic separation
- Responsive design with mobile-first approach

## Clinical Domain Context

This is a **pharmaceutical-grade medical application** that implements infectious disease specialist decision-making through a sophisticated 4-phase workflow. The system represents months of database development work designed to provide **CLSI-compliant antimicrobial susceptibility testing interpretation**.

### Core System Capabilities

#### **Simple System Mode**
- **CLSI-Compliant Interpretation**: Accurate S/I/R determinations following CLSI M100™ guidelines
- **Clear, Actionable Guidance**: Provides a single, ranked list of appropriate therapies for straightforward cases
- **Intrinsic Resistance Filtering**: Prevents selection of clinically ineffective antibiotics
- **Clinical Override Detection**: Identifies misleading susceptibility results

#### **Advanced System Mode**
- **Comparative Therapeutic Analysis**: Side-by-side comparison of viable treatment strategies
- **Deep Clinical Insight**: Leverages full database integration for nuanced recommendations
- **Stewardship Excellence**: Embeds antimicrobial stewardship principles directly into the framework
- **Multi-Axis Evaluation**: Efficacy, safety, stewardship impact, PK/PD optimization, convenience

### Clinical Impact Goals

1. **Democratize Specialist Expertise**: Make ID specialist reasoning accessible to all healthcare providers
2. **Elevate Clinical Reasoning**: Teach clinicians how to think like specialists through transparent decision-making
3. **Combat Antimicrobial Resistance**: Promote appropriate antibiotic use through clear stewardship guidance
4. **Enhance Patient Safety**: Integrate safety and tolerability as primary factors
5. **Provide Educational Excellence**: Transform each case into a learning opportunity

### Development Principles
When making changes, prioritize:
1. **CLSI Compliance**: All interpretations must follow CLSI M100™ standards
2. **Clinical Accuracy**: Evidence-based logic from peer-reviewed sources
3. **Patient Safety**: Conservative recommendations when uncertainty exists
4. **Antimicrobial Stewardship**: Narrow-spectrum preference when appropriate
5. **User Experience**: Intuitive workflow for busy healthcare professionals
6. **Educational Value**: Clear explanations of clinical reasoning

### Testing & Validation Requirements
- **Breakpoint Accuracy**: Verify against CLSI M100-Ed34 tables
- **Resistance Detection**: Test with known resistance patterns
- **Clinical Scenarios**: Validate with real-world antibiogram examples
- **Edge Cases**: Handle unusual organisms and resistance patterns
- **Performance**: Ensure rapid response for clinical use

## Important Implementation Notes

### Current Application Entry Points
1. **AntibiogramMaster** (`src/components/AntibiogramMaster.jsx`) - New 4-phase workflow implementation
2. **AntibiogramApp** (`src/components/AntibiogramApp.jsx`) - Legacy multi-step form (being phased out)
3. **LandingPage** (`src/components/LandingPage.jsx`) - Main entry point selecting between apps

### Key Implementation Decisions
- The 4-phase workflow is the primary implementation following the blueprint
- CLSI database is the PRIMARY source of truth for all decisions
- Simple mode should be default with option to enable advanced mode
- All clinical decisions must be traceable to CLSI standards or peer-reviewed sources

### Next Priority Tasks
1. **Patient Data Collection**: Add patient demographics to Phase 1
2. **Syndrome Integration**: Connect the 453 syndrome files to provide context
3. **Report Generation**: Create exportable clinical documentation
4. **Advanced Mode UI**: Implement comparative strategy table visualization
5. **PK/PD Calculator**: Add dosing optimization based on patient parameters

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.