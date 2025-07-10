// Clinical Decision Support Engine for Intelligent Treatment Recommendations
import {
    SEVERITY_LEVELS,
    RESISTANCE_RISK_FACTORS,
    EPIDEMIOLOGY_THRESHOLDS,
    DEFAULT_EPIDEMIOLOGY,
    CLINICAL_STATUS_LEVELS,
    INFECTION_SEVERITY_MAPPING,
    INSTITUTION_TYPES,
    PENETRATION_REQUIREMENTS,
    COVERAGE_REQUIREMENTS
} from '../data/constants.js';

export class ClinicalDecisionEngine {
    constructor(patientData, bacterium, localEpidemiology = DEFAULT_EPIDEMIOLOGY) {
        this.patient = patientData;
        this.bacterium = bacterium;
        this.epidemiology = localEpidemiology;
        this.susceptibilityResults = patientData.susceptibilityResults || {};
    }

    getOptimalRegimen() {
        try {
            const severity = this.assessPatientSeverity();
            const resistanceRisk = this.assessResistanceRisk();
            const mechanisms = this.detectResistanceMechanisms();
            const epidemiologyRisk = this.assessEpidemiologyRisk();

            const optimalRegimen = this.matchClinicalContext(
                severity, resistanceRisk, mechanisms, epidemiologyRisk
            );

            return {
                regimen: optimalRegimen,
                rationale: this.generateRationale(severity, resistanceRisk, mechanisms, epidemiologyRisk),
                severity, resistanceRisk, mechanisms, epidemiologyRisk
            };
        } catch (error) {
            console.error('Clinical Decision Engine error:', error);
            return this.getFallbackRecommendation();
        }
    }

    assessPatientSeverity() {
        let severityScore = 0;
        const factors = [];

        // Syndrome-specific baseline severity
        const syndromeMapping = {
            // CNS infections - highest severity
            'CNS_meningitis': 3, 'CNS_encephalitis': 3, 'CNS_brain_abscess': 3, 'CNS_subdural_empyema': 3,
            
            // Cardiovascular - high severity
            'CV_endocarditis_native': 3, 'CV_endocarditis_prosthetic': 3, 'CV_endocarditis_CIED': 3, 'CV_mycotic_aneurysm': 3,
            'CV_pericarditis': 2,
            
            // Respiratory - moderate to high
            'RESP_CAP': 2, 'RESP_HAP': 2, 'RESP_VAP': 3, 'RESP_empyema': 2, 'RESP_lung_abscess': 2, 'RESP_bronchitis_acute': 1,
            
            // Genitourinary - variable
            'GU_UTI_uncomplicated': 1, 'GU_UTI_complicated': 2, 'GU_UTI_catheter': 2, 'GU_pyelonephritis': 2,
            'GU_prostatitis_acute': 2, 'GU_prostatitis_chronic': 1,
            
            // Skin/Soft Tissue - variable
            'SST_cellulitis_simple': 1, 'SST_cellulitis_severe': 2, 'SST_necrotizing_fasciitis': 3, 'SST_abscess': 1,
            'SST_diabetic_foot': 2, 'SST_surgical_site': 2,
            
            // Bone/Joint - moderate
            'BJ_osteomyelitis_acute': 2, 'BJ_osteomyelitis_chronic': 2, 'BJ_prosthetic_joint': 2, 'BJ_septic_arthritis': 2,
            'BJ_vertebral_osteomyelitis': 2, 'BJ_diabetic_foot_osteo': 2,
            
            // Intra-abdominal - moderate
            'IA_peritonitis_secondary': 2, 'IA_peritonitis_primary': 2, 'IA_intra_abdominal': 2, 'IA_cholangitis': 2,
            'IA_liver_abscess': 2, 'IA_appendicitis': 2,
            
            // Bacteremia/Sepsis - high severity
            'BS_bacteremia_primary': 2, 'BS_CLABSI': 2, 'BS_sepsis': 3, 'BS_septic_shock': 3, 'BS_neutropenic_fever': 2
        };
        
        const syndromeScore = syndromeMapping[this.patient.location] || 
                             INFECTION_SEVERITY_MAPPING[this.patient.location] || 
                             SEVERITY_LEVELS.MILD;
        
        severityScore += syndromeScore;
        const syndromeLabel = this.patient.location?.includes('_') ? 
            'Syndrome-specific' : this.patient.location;
        factors.push(`${syndromeLabel}: (+${syndromeScore})`);

        // Age factor
        const age = parseFloat(this.patient.age);
        if (age > 65) {
            severityScore += 1;
            factors.push('Age >65 years (+1)');
        }

        // Objective severity criteria (if assessment is enabled)
        if (this.patient.showSeverityAssessment) {
            if (this.patient.isICU) {
                severityScore += 3;
                factors.push('ICU admission (+3)');
            }

            if (this.patient.isImmunocompromised) {
                severityScore += 2;
                factors.push('Immunocompromised (+2)');
            }

            if (this.patient.priorAntibiotics) {
                severityScore += 1;
                factors.push('Prior antibiotics (+1)');
            }

            if (this.patient.hasOrganDysfunction) {
                severityScore += 2;
                factors.push('Organ dysfunction (+2)');
            }

            if (this.patient.hasSepsis) {
                severityScore += 3;
                factors.push('Sepsis/septic shock (+3)');
            }

            // Hemodynamic status
            if (this.patient.hemodynamicStatus === 'shock') {
                severityScore += 3;
                factors.push('Hemodynamic shock (+3)');
            } else if (this.patient.hemodynamicStatus === 'hypotension') {
                severityScore += 2;
                factors.push('Hypotension (+2)');
            }

            // Respiratory status
            if (this.patient.respiratoryStatus === 'mechanical') {
                severityScore += 2;
                factors.push('Mechanical ventilation (+2)');
            } else if (this.patient.respiratoryStatus === 'oxygen') {
                severityScore += 1;
                factors.push('Oxygen supplementation (+1)');
            }
        }

        // Determine severity level based on objective scoring
        let level;
        if (severityScore <= 2) level = 'MILD';
        else if (severityScore <= 5) level = 'MODERATE';
        else if (severityScore <= 8) level = 'SEVERE';
        else level = 'CRITICAL';

        return {
            score: severityScore,
            level: SEVERITY_LEVELS[level],
            levelName: level,
            factors,
            description: this.getSeverityDescription(level),
            objective: this.patient.showSeverityAssessment
        };
    }

    assessResistanceRisk() {
        const riskFactors = [];
        let riskScore = 0;

        const bacteriumGenus = this.bacterium.taxonomy?.genus?.toLowerCase() || 'unknown';
        const localESBLRate = this.getLocalESBLRate(bacteriumGenus);
        
        if (localESBLRate > EPIDEMIOLOGY_THRESHOLDS.HIGH_ESBL_RATE) {
            riskFactors.push(RESISTANCE_RISK_FACTORS.HIGH_ESBL_RATE);
            riskScore += 3;
        }

        if (this.patient.isICU) {
            riskFactors.push(RESISTANCE_RISK_FACTORS.ICU_ADMISSION);
            riskScore += 2;
        }

        if (this.patient.isImmunocompromised) {
            riskFactors.push(RESISTANCE_RISK_FACTORS.IMMUNOCOMPROMISED);
            riskScore += 1;
        }

        // Syndrome-specific resistance risk assessment
        const syndromeRiskAdjustment = this.assessSyndromeSpecificResistanceRisk();
        riskScore += syndromeRiskAdjustment.score;
        riskFactors.push(...syndromeRiskAdjustment.factors);

        return {
            score: riskScore,
            level: this.categorizeRiskLevel(riskScore),
            factors: riskFactors,
            localESBLRate,
            syndromeSpecificRisks: syndromeRiskAdjustment.syndromeRisks,
            description: this.getRiskDescription(riskScore)
        };
    }

    assessSyndromeSpecificResistanceRisk() {
        const syndromeRisks = [];
        const factors = [];
        let score = 0;

        const syndrome = this.patient.location;

        // Healthcare-associated infections carry higher resistance risk
        const healthcareAssociatedSyndromes = [
            'RESP_HAP', 'RESP_VAP', 'BS_CLABSI', 'GU_UTI_catheter',
            'SST_surgical_site', 'CV_endocarditis_CIED', 'BJ_prosthetic_joint'
        ];

        if (healthcareAssociatedSyndromes.includes(syndrome)) {
            score += 2;
            factors.push('Healthcare-associated infection (+2)');
            syndromeRisks.push('Higher MDR pathogen risk');
        }

        // Device-associated infections
        const deviceAssociatedSyndromes = [
            'BS_CLABSI', 'GU_UTI_catheter', 'CV_endocarditis_CIED', 
            'BJ_prosthetic_joint', 'CV_endocarditis_prosthetic'
        ];

        if (deviceAssociatedSyndromes.includes(syndrome)) {
            score += 1;
            factors.push('Device-associated infection (+1)');
            syndromeRisks.push('Biofilm-forming pathogens likely');
        }

        // Syndrome-specific pathogen resistance patterns
        switch (syndrome) {
            case 'RESP_VAP':
                score += 2;
                factors.push('VAP: High Pseudomonas/Acinetobacter risk (+2)');
                syndromeRisks.push('Consider anti-Pseudomonas coverage');
                break;

            case 'BS_neutropenic_fever':
                score += 2;
                factors.push('Neutropenic fever: MDR gram-negative risk (+2)');
                syndromeRisks.push('Broad-spectrum empiric therapy essential');
                break;

            case 'BJ_osteomyelitis_chronic':
                score += 1;
                factors.push('Chronic osteomyelitis: Small colony variants (+1)');
                syndromeRisks.push('Consider biofilm-active agents');
                break;

            case 'SST_diabetic_foot':
                score += 1;
                factors.push('Diabetic foot: Polymicrobial + MRSA risk (+1)');
                syndromeRisks.push('Consider MRSA and anaerobic coverage');
                break;

            case 'IA_peritonitis_secondary':
                factors.push('Peritonitis: Polymicrobial infection expected');
                syndromeRisks.push('Anaerobic coverage essential');
                break;

            case 'GU_UTI_complicated':
            case 'GU_UTI_catheter':
                score += 1;
                factors.push('Complicated UTI: ESBL risk increased (+1)');
                syndromeRisks.push('Consider carbapenem if ESBL suspected');
                break;

            case 'CNS_meningitis':
                factors.push('Meningitis: Penetration more critical than resistance');
                syndromeRisks.push('Prioritize CNS penetration over spectrum');
                break;
        }

        // Institution type adjustment
        if (this.patient.institutionType === 'tertiary') {
            score += 1;
            factors.push('Tertiary care center (+1)');
            syndromeRisks.push('Higher baseline resistance rates');
        }

        return {
            score,
            factors,
            syndromeRisks
        };
    }

    assessCoverageRequirements() {
        const syndrome = this.patient.location;
        const requirements = [];
        const recommendations = [];

        // Anaerobic coverage requirements
        const anaerobicRequired = [
            'IA_peritonitis_secondary', 'IA_peritonitis_primary', 'IA_intra_abdominal',
            'IA_liver_abscess', 'IA_appendicitis', 'RESP_lung_abscess', 'SST_diabetic_foot'
        ];

        if (anaerobicRequired.includes(syndrome)) {
            requirements.push({
                type: 'ANAEROBIC_ESSENTIAL',
                description: 'Anaerobic coverage essential',
                agents: COVERAGE_REQUIREMENTS.ANAEROBIC_ESSENTIAL.required,
                priority: 'Essential'
            });
            recommendations.push('Consider metronidazole, clindamycin, or beta-lactam/beta-lactamase inhibitor');
        }

        // Atypical coverage for respiratory infections
        const atypicalRequired = ['RESP_CAP'];
        if (atypicalRequired.includes(syndrome)) {
            requirements.push({
                type: 'ATYPICAL_COVERAGE',
                description: 'Atypical pathogen coverage recommended',
                agents: COVERAGE_REQUIREMENTS.ATYPICAL_COVERAGE.required,
                priority: 'Recommended'
            });
            recommendations.push('Consider macrolide, fluoroquinolone, or tetracycline for atypical coverage');
        }

        // Anti-Pseudomonas coverage for high-risk syndromes
        const pseudomonasRisk = [
            'RESP_HAP', 'RESP_VAP', 'BS_neutropenic_fever', 'BJ_osteomyelitis_chronic'
        ];
        if (pseudomonasRisk.includes(syndrome)) {
            requirements.push({
                type: 'ANTI_PSEUDOMONAS',
                description: 'Anti-Pseudomonas coverage recommended',
                agents: COVERAGE_REQUIREMENTS.ANTI_PSEUDOMONAS.required,
                priority: 'Recommended'
            });
            recommendations.push('Consider anti-pseudomonal beta-lactam or fluoroquinolone');
        }

        // Biofilm activity for device-associated infections
        const biofilmRequired = [
            'BJ_prosthetic_joint', 'CV_endocarditis_CIED', 'CV_endocarditis_prosthetic',
            'BJ_osteomyelitis_chronic', 'BS_CLABSI'
        ];
        if (biofilmRequired.includes(syndrome)) {
            requirements.push({
                type: 'BIOFILM_ACTIVITY',
                description: 'Biofilm-active agents preferred',
                agents: COVERAGE_REQUIREMENTS.BIOFILM_ACTIVITY.required,
                priority: 'Preferred'
            });
            recommendations.push('Consider rifampin combinations, daptomycin, or linezolid');
        }

        // MRSA coverage considerations
        const mrsaRisk = [
            'SST_cellulitis_severe', 'SST_necrotizing_fasciitis', 'SST_diabetic_foot',
            'BJ_osteomyelitis_acute', 'BJ_prosthetic_joint', 'CV_endocarditis_native'
        ];
        if (mrsaRisk.includes(syndrome) && this.patient.isICU) {
            requirements.push({
                type: 'MRSA_COVERAGE',
                description: 'MRSA coverage consideration',
                agents: ['Vancomycin', 'Linezolid', 'Daptomycin', 'Ceftaroline'],
                priority: 'Consider'
            });
            recommendations.push('Consider MRSA coverage based on local epidemiology and risk factors');
        }

        // Syndrome-specific special considerations
        switch (syndrome) {
            case 'CNS_meningitis':
                requirements.push({
                    type: 'CNS_PENETRATION',
                    description: 'Blood-brain barrier penetration essential',
                    agents: ['Ceftriaxone', 'Vancomycin', 'Meropenem'],
                    priority: 'Essential'
                });
                recommendations.push('Bactericidal agents preferred; high-dose regimens required');
                break;

            case 'GU_UTI_uncomplicated':
                requirements.push({
                    type: 'UTI_SPECIFIC',
                    description: 'UTI-specific agents preferred',
                    agents: ['Nitrofurantoin', 'Fosfomycin', 'Trimethoprim-sulfamethoxazole'],
                    priority: 'Preferred'
                });
                recommendations.push('Short course therapy (3 days) appropriate');
                break;

            case 'GU_prostatitis_acute':
                requirements.push({
                    type: 'PROSTATE_PENETRATION',
                    description: 'Prostate penetration essential',
                    agents: ['Ciprofloxacin', 'Levofloxacin', 'Trimethoprim-sulfamethoxazole'],
                    priority: 'Essential'
                });
                recommendations.push('Extended duration therapy (2-4 weeks) required');
                break;
        }

        return {
            requirements,
            recommendations,
            summary: requirements.length > 0 ? 
                `${requirements.length} special coverage consideration${requirements.length > 1 ? 's' : ''}` :
                'Standard spectrum adequate'
        };
    }

    detectResistanceMechanisms() {
        const mechanisms = {
            esbl: this.detectESBL(),
            ampC: this.detectAmpC(),
            carbapenemase: this.detectCarbapenemase()
        };

        return {
            ...mechanisms,
            summary: this.summarizeMechanisms(mechanisms),
            coverageRequirements: this.assessCoverageRequirements()
        };
    }

    detectESBL() {
        const thirdGenResistant = ['Ceftriaxone', 'Ceftazidime', 'Cefotaxime'].filter(
            drug => this.susceptibilityResults[drug] === 'R'
        ).length >= 2;

        const carbapenemSusceptible = ['Meropenem', 'Ertapenem'].some(
            drug => this.susceptibilityResults[drug] === 'S'
        );

        const suspected = thirdGenResistant && carbapenemSusceptible;

        return {
            suspected,
            pattern: thirdGenResistant ? 'Classic ESBL pattern' : 'Atypical pattern',
            implications: suspected ? 'Avoid cephalosporins, consider carbapenems' : 'Standard therapy may be appropriate'
        };
    }

    detectAmpC() {
        const ampCProducers = ['enterobacter', 'citrobacter', 'serratia'];
        const genus = this.bacterium.taxonomy?.genus?.toLowerCase() || '';
        
        if (!ampCProducers.includes(genus)) {
            return { suspected: false, reason: 'Not an AmpC-producing genus' };
        }

        const cephResistant = ['Ceftriaxone', 'Ceftazidime'].some(
            drug => this.susceptibilityResults[drug] === 'R'
        );
        
        const carbapenemSusceptible = ['Meropenem', 'Ertapenem'].some(
            drug => this.susceptibilityResults[drug] === 'S'
        );

        const suspected = cephResistant && carbapenemSusceptible;

        return {
            suspected,
            pattern: suspected ? 'AmpC overproduction pattern' : 'No AmpC pattern',
            implications: suspected ? 'Avoid 3rd gen cephalosporins, use cefepime or carbapenems' : 'Standard therapy appropriate'
        };
    }

    detectCarbapenemase() {
        const carbapenems = ['Meropenem', 'Imipenem', 'Ertapenem'];
        const resistantCarbapenems = carbapenems.filter(
            drug => this.susceptibilityResults[drug] === 'R'
        );

        if (resistantCarbapenems.length === 0) {
            return { suspected: false, type: 'None detected' };
        }

        return {
            suspected: true,
            confidence: resistantCarbapenems.length / carbapenems.length,
            type: 'Carbapenemase suspected',
            implications: 'Extremely limited options'
        };
    }

    assessEpidemiologyRisk() {
        const bacteriumGenus = this.bacterium.taxonomy?.genus?.toLowerCase() || 'unknown';
        const localESBLRate = this.getLocalESBLRate(bacteriumGenus);

        let riskLevel = 'LOW';
        const factors = [];

        if (localESBLRate > EPIDEMIOLOGY_THRESHOLDS.HIGH_ESBL_RATE) {
            riskLevel = 'HIGH';
            factors.push(`High local ESBL rate: ${(localESBLRate * 100).toFixed(1)}%`);
        } else if (localESBLRate > EPIDEMIOLOGY_THRESHOLDS.LOW_ESBL_RATE) {
            riskLevel = 'MODERATE';
            factors.push(`Moderate local ESBL rate: ${(localESBLRate * 100).toFixed(1)}%`);
        }

        return {
            level: riskLevel,
            esblRate: localESBLRate,
            factors,
            recommendation: this.getEpidemiologyRecommendation(riskLevel)
        };
    }

    matchClinicalContext(severity, resistanceRisk, mechanisms, epidemiologyRisk) {
        const regimens = this.bacterium.treatment?.regimens || [];
        
        if (regimens.length === 0) {
            return this.getFallbackRecommendation();
        }

        const scoredRegimens = regimens.map(regimen => ({
            regimen,
            score: this.calculateRegimenScore(regimen, severity, resistanceRisk, mechanisms, epidemiologyRisk)
        }));

        const sortedRegimens = scoredRegimens.sort((a, b) => b.score - a.score);
        const optimalRegimen = sortedRegimens[0];

        const suitableOptions = this.findSuitableAntibiotics(optimalRegimen.regimen);
        
        if (suitableOptions.length === 0) {
            for (let i = 1; i < sortedRegimens.length; i++) {
                const altRegimen = sortedRegimens[i];
                const altOptions = this.findSuitableAntibiotics(altRegimen.regimen);
                if (altOptions.length > 0) {
                    return {
                        ...altRegimen,
                        suitableOptions: altOptions,
                        note: 'Alternative regimen selected due to resistance/allergies'
                    };
                }
            }
            
            return this.getFallbackRecommendation();
        }

        return {
            ...optimalRegimen,
            suitableOptions,
            allRegimens: sortedRegimens
        };
    }

    calculateRegimenScore(regimen, severity, resistanceRisk, mechanisms, epidemiologyRisk) {
        let score = 0;
        const context = regimen.context || {};

        if (regimen.recommendations?.[0]?.preference === 'Primary') {
            score += 10;
        }

        // This is the KEY FIX - proper severity matching
        if (severity.level >= SEVERITY_LEVELS.SEVERE) {
            if (context.condition?.includes('Severe') || 
                context.condition?.includes('High Local ESBL') ||
                context.condition?.includes('Carbapenem')) {
                score += 15;
            }
            // Heavily penalize low-intensity regimens for severe patients
            if (context.condition?.includes('Low Local ESBL')) {
                score -= 15;
            }
        } else {
            // For mild patients, prefer low-intensity regimens when appropriate
            if (context.condition?.includes('Low Local ESBL') && !mechanisms.esbl.suspected) {
                score += 10;
            }
        }

        // Match epidemiological risk
        if (epidemiologyRisk.level === 'HIGH') {
            if (context.condition?.includes('High Local ESBL')) {
                score += 12;
            }
            if (context.condition?.includes('Low Local ESBL')) {
                score -= 10;
            }
        }

        // Match detected resistance mechanisms
        if (mechanisms.esbl.suspected) {
            if (context.condition?.includes('ESBL') || context.condition?.includes('High Local ESBL')) {
                score += 20;
            }
            if (context.condition?.includes('Low Local ESBL')) {
                score -= 25; // Heavily penalize for ESBL
            }
        }

        if (mechanisms.carbapenemase.suspected) {
            if (context.condition?.includes('KPC') || context.condition?.includes('Carbapenem-Resistant')) {
                score += 25;
            } else {
                score -= 30; // Other regimens inappropriate
            }
        }

        return Math.max(0, score);
    }

    findSuitableAntibiotics(regimen) {
        const recommendations = regimen.recommendations || [];
        const suitableOptions = [];

        for (const recommendation of recommendations) {
            const steps = recommendation.steps || [];
            for (const step of steps) {
                const drugs = step.drugs || [];
                for (const drug of drugs) {
                    if (this.isAntibioticSuitable(drug.drugName)) {
                        const penetrationAssessment = this.assessPenetrationSuitability(drug.drugName);
                        suitableOptions.push({
                            ...drug,
                            preference: recommendation.preference,
                            strategy: recommendation.strategy,
                            penetrationScore: penetrationAssessment.score,
                            penetrationLevel: penetrationAssessment.level,
                            penetrationWarnings: penetrationAssessment.warnings
                        });
                    }
                }
            }
        }

        // Sort by penetration suitability and then by susceptibility
        return suitableOptions.sort((a, b) => {
            if (a.penetrationScore !== b.penetrationScore) {
                return b.penetrationScore - a.penetrationScore; // Higher penetration score first
            }
            // If same penetration score, prioritize by preference
            if (a.preference === 'Primary' && b.preference !== 'Primary') return -1;
            if (b.preference === 'Primary' && a.preference !== 'Primary') return 1;
            return 0;
        });
    }

    assessPenetrationSuitability(drugName) {
        const penetrationReq = this.getPenetrationRequirement();
        if (!penetrationReq) {
            return { score: 5, level: 'Standard', warnings: [] };
        }

        const warnings = [];
        let score = 0;
        let level = 'Poor';

        if (penetrationReq.excellent.includes(drugName)) {
            score = 10;
            level = 'Excellent';
        } else if (penetrationReq.good.includes(drugName)) {
            score = 8;
            level = 'Good';
        } else if (penetrationReq.moderate.includes(drugName)) {
            score = 5;
            level = 'Moderate';
            if (penetrationReq.type === 'CNS_critical') {
                warnings.push('Consider high-dose regimen for CNS penetration');
            }
        } else if (penetrationReq.poor.includes(drugName)) {
            score = 2;
            level = 'Poor';
            warnings.push(`Poor ${penetrationReq.description.toLowerCase()}`);
        } else if (penetrationReq.avoid.some(avoid => drugName.includes(avoid) || avoid.includes(drugName))) {
            score = 0;
            level = 'Avoid';
            warnings.push(`Avoid: ${penetrationReq.description}`);
        } else {
            // Drug not in any category, assume moderate
            score = 5;
            level = 'Unknown';
        }

        return { score, level, warnings };
    }

    getPenetrationRequirement() {
        const syndromeMap = {
            // CNS infections require critical penetration
            'CNS_meningitis': PENETRATION_REQUIREMENTS.CNS_CRITICAL,
            'CNS_encephalitis': PENETRATION_REQUIREMENTS.CNS_CRITICAL,
            'CNS_brain_abscess': PENETRATION_REQUIREMENTS.CNS_CRITICAL,
            'CNS_subdural_empyema': PENETRATION_REQUIREMENTS.CNS_CRITICAL,
            
            // Bone infections require bone-specific penetration
            'BJ_osteomyelitis_acute': PENETRATION_REQUIREMENTS.BONE_SPECIFIC,
            'BJ_osteomyelitis_chronic': PENETRATION_REQUIREMENTS.BONE_SPECIFIC,
            'BJ_prosthetic_joint': PENETRATION_REQUIREMENTS.BONE_SPECIFIC,
            'BJ_vertebral_osteomyelitis': PENETRATION_REQUIREMENTS.BONE_SPECIFIC,
            'BJ_diabetic_foot_osteo': PENETRATION_REQUIREMENTS.BONE_SPECIFIC,
            
            // UTI infections benefit from urinary concentration
            'GU_UTI_uncomplicated': PENETRATION_REQUIREMENTS.URINARY_SPECIFIC,
            
            // Prostatitis requires prostate penetration
            'GU_prostatitis_acute': PENETRATION_REQUIREMENTS.PROSTATE_SPECIFIC,
            'GU_prostatitis_chronic': PENETRATION_REQUIREMENTS.PROSTATE_SPECIFIC,
            
            // Systemic infections require good systemic distribution
            'GU_UTI_complicated': PENETRATION_REQUIREMENTS.SYSTEMIC,
            'GU_UTI_catheter': PENETRATION_REQUIREMENTS.SYSTEMIC,
            'GU_pyelonephritis': PENETRATION_REQUIREMENTS.SYSTEMIC,
            'BS_bacteremia_primary': PENETRATION_REQUIREMENTS.SYSTEMIC,
            'BS_CLABSI': PENETRATION_REQUIREMENTS.SYSTEMIC,
            'BS_sepsis': PENETRATION_REQUIREMENTS.SYSTEMIC,
            'BS_septic_shock': PENETRATION_REQUIREMENTS.SYSTEMIC
        };

        return syndromeMap[this.patient.location] || PENETRATION_REQUIREMENTS.GOOD;
    }

    isAntibioticSuitable(drugName) {
        return this.susceptibilityResults[drugName] === 'S';
    }

    getLocalESBLRate(genus) {
        return this.epidemiology.esblRate[genus] || 
               this.epidemiology.esblRate.enterobacterales || 
               DEFAULT_EPIDEMIOLOGY.esblRate.enterobacterales;
    }

    generateRationale(severity, resistanceRisk, mechanisms, epidemiologyRisk) {
        return {
            summary: `Recommendation based on ${severity.levelName.toLowerCase()} patient severity, ${resistanceRisk.level.toLowerCase()} resistance risk, and ${epidemiologyRisk.level.toLowerCase()} local epidemiology.`,
            factors: [
                `Severity: ${severity.levelName} (${severity.score})`,
                `Resistance risk: ${resistanceRisk.level}`,
                `ESBL rate: ${(resistanceRisk.localESBLRate * 100).toFixed(1)}%`,
                `Mechanisms: ${mechanisms.summary}`
            ],
            warnings: mechanisms.esbl.suspected ? ['ESBL detected - avoid cephalosporins'] : [],
            considerations: []
        };
    }

    getSeverityDescription(level) {
        const descriptions = {
            MILD: 'Paciente estable con infección no complicada (puntuación ≤2)',
            MODERATE: 'Paciente con enfermedad moderada que requiere vigilancia (puntuación 3-5)',
            SEVERE: 'Paciente gravemente enfermo que requiere terapia intensiva (puntuación 6-8)',
            CRITICAL: 'Paciente en estado crítico con riesgo vital inmediato (puntuación >8)'
        };
        return descriptions[level] || 'Severidad no determinada';
    }

    getRiskDescription(score) {
        if (score >= 4) return 'Riesgo alto de resistencia';
        if (score >= 2) return 'Riesgo moderado de resistencia';
        return 'Riesgo bajo de resistencia';
    }

    categorizeRiskLevel(score) {
        if (score >= 4) return 'HIGH';
        if (score >= 2) return 'MODERATE';
        return 'LOW';
    }

    getEpidemiologyRecommendation(level) {
        const recommendations = {
            LOW: 'Standard empiric therapy appropriate',
            MODERATE: 'Consider enhanced empiric coverage',
            HIGH: 'Broad-spectrum empiric therapy recommended'
        };
        return recommendations[level] || 'Assessment needed';
    }

    summarizeMechanisms(mechanisms) {
        const detected = [];
        if (mechanisms.esbl.suspected) detected.push('ESBL');
        if (mechanisms.ampC.suspected) detected.push('AmpC');
        if (mechanisms.carbapenemase.suspected) detected.push('Carbapenemase');
        
        return detected.length > 0 ? detected.join(', ') : 'None detected';
    }

    getFallbackRecommendation() {
        return {
            regimen: null,
            score: 0,
            suitableOptions: [],
            note: 'No suitable treatment regimen identified. Infectious diseases consultation recommended.',
            rationale: {
                summary: 'Complex resistance pattern prevents standard therapy',
                factors: ['Multiple resistance mechanisms or contraindications'],
                warnings: ['Requires expert consultation'],
                considerations: ['Consider combination therapy']
            }
        };
    }
}

export function getIntelligentTreatmentRecommendation(patientData, bacterium, localEpidemiology) {
    const engine = new ClinicalDecisionEngine(patientData, bacterium, localEpidemiology);
    return engine.getOptimalRegimen();
}