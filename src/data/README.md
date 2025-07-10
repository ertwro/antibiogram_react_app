# Database Restructuring Plan

## Current Problem
- microbiologyData.js is 1204 lines with only 20 organisms
- Adding 150+ organisms would create an unmaintainable 6000+ line file
- PDF parsing scripts are buggy and don't give good output

## Proposed Structure

### 1. Atomized File Organization
```
src/data/
├── organisms/
│   ├── gram-positive/
│   │   ├── staphylococcus/
│   │   │   ├── s-aureus.js
│   │   │   ├── s-epidermidis.js
│   │   │   └── index.js
│   │   ├── streptococcus/
│   │   │   ├── s-pneumoniae.js
│   │   │   ├── s-pyogenes.js
│   │   │   └── index.js
│   │   └── index.js
│   ├── gram-negative/
│   │   ├── enterobacterales/
│   │   │   ├── e-coli.js
│   │   │   ├── klebsiella-pneumoniae.js
│   │   │   └── index.js
│   │   ├── non-fermenters/
│   │   │   ├── pseudomonas-aeruginosa.js
│   │   │   ├── acinetobacter-baumannii.js
│   │   │   └── index.js
│   │   └── index.js
│   └── index.js (main aggregator)
├── antibiotics/
│   ├── beta-lactams/
│   │   ├── penicillins/
│   │   ├── cephalosporins/
│   │   └── carbapenems/
│   └── index.js
└── microbiologyData.js (imports everything)
```

### 2. Individual Organism Template
Each organism file should follow this structure:
```javascript
// src/data/organisms/gram-positive/staphylococcus/s-aureus.js
export const sAureus = {
  id: 'saureus',
  name: 'Staphylococcus aureus',
  taxonomy: { /* ... */ },
  labIdentification: { /* ... */ },
  pathogenicity: { /* ... */ },
  resistanceMechanisms: { /* ... */ },
  clsi_panel: [ /* ... */ ],
  treatmentGuidelines: { /* ... */ },
  epidemiology: { /* ... */ }
};
```

## PDF Parsing Strategy

### Option 1: Manual Key Data Extraction
- Focus on extracting only essential clinical data
- Create standardized templates for each organism type
- Skip complex parsing, do targeted data extraction

### Option 2: Hybrid Approach
- Use PDF text extraction for basic info (names, classifications)
- Manually curate complex clinical data (resistance patterns, guidelines)
- Validate against reference materials

### Option 3: Structured Data Entry
- Create data entry templates based on PDF structure
- Use consistent format across all organisms
- Quality control through peer review

## Implementation Steps

1. **Phase 1**: Restructure existing 20 organisms into atomized files
2. **Phase 2**: Create templates and import system
3. **Phase 3**: Add high-priority organisms (ESKAPE pathogens)
4. **Phase 4**: Systematic addition of remaining organisms
5. **Phase 5**: Validation and testing

## Benefits
- Maintainable individual files
- Easy to add new organisms
- Reduced risk of breaking existing data
- Easier collaboration and review
- Better version control