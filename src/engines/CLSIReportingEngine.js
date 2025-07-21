// src/engines/CLSIReportingEngine.js
// --- CLSI M100-Ed34 Tier-Based Reporting Engine ---
// Implements intelligent antibiogram reporting with CLSI guidelines

import { 
  getCLSIDatabase, 
  getCLSIBreakpoints, 
  getTierAntibiotics,
  getReportingPriorityAntibiotics,
  findOrganismCategory,
  validateBreakpoint,
  CLSIReportingEngine as BaseCLSIEngine
} from '../data/generatedCLSIIndex.js';

export class CLSIReportingEngine extends BaseCLSIEngine {
  constructor() {
    super();
    this.database = getCLSIDatabase();
  }

  // Enhanced report generation with stewardship guidance
  generateAntibiogramReport(organismName, micResults = {}, clinicalContext = {}) {
    const baseReport = this.generateReport(organismName, micResults);
    
    if (baseReport.error) {
      return baseReport;
    }

    // Enhance with clinical decision support
    const enhancedReport = {
      ...baseReport,
      stewardshipGuidance: this.generateStewardshipGuidance(baseReport, clinicalContext),
      tierRecommendations: this.generateTierRecommendations(baseReport),
      resistanceAlerts: this.generateResistanceAlerts(baseReport),
      reportingStrategy: this.generateReportingStrategy(baseReport, clinicalContext)
    };

    return enhancedReport;
  }

  // Generate stewardship-based guidance
  generateStewardshipGuidance(report, clinicalContext) {
    const guidance = {
      primaryRecommendations: [],
      alternativeOptions: [],
      avoidanceWarnings: [],
      escalationTriggers: []
    };

    const { infection_site, severity, patient_factors } = clinicalContext;

    // Analyze Tier 1 results for primary recommendations
    report.tier1_results.forEach(result => {
      if (result.interpretation === 'S') {
        let priority = 'standard';
        
        // Prioritize narrow spectrum agents
        if (this.isNarrowSpectrum(result.antibiotic)) {
          priority = 'preferred';
        }
        
        // Site-specific considerations
        if (infection_site && this.isOptimalForSite(result.antibiotic, infection_site)) {
          priority = 'preferred';
        }

        guidance.primaryRecommendations.push({
          antibiotic: result.antibiotic,
          rationale: this.generateRationale(result, clinicalContext),
          priority,
          stewardshipScore: this.calculateStewardshipScore(result.antibiotic, clinicalContext)
        });
      }
    });

    // Check for resistance patterns requiring escalation
    const carbapenemResistant = report.tier1_results.some(r => 
      ['meropenem', 'imipenem', 'ertapenem'].includes(r.antibiotic) && r.interpretation === 'R'
    );

    if (carbapenemResistant) {
      guidance.escalationTriggers.push({
        trigger: 'carbapenem_resistance',
        action: 'Notify ID specialist and infection control immediately',
        urgency: 'critical'
      });
    }

    // ESBL detection based on pattern
    const esblPattern = this.detectESBLPattern(report);
    if (esblPattern.likely) {
      guidance.escalationTriggers.push({
        trigger: 'probable_esbl',
        action: 'Consider carbapenem therapy, avoid cephalosporins',
        urgency: 'high'
      });
    }

    return guidance;
  }

  // Generate tier-based recommendations
  generateTierRecommendations(report) {
    const recommendations = {
      reportTier1: true,
      reportTier2: false,
      reportTier3: false,
      suppressRedundant: true,
      cascadingLogic: []
    };

    const tier1Susceptible = report.tier1_results.filter(r => r.interpretation === 'S').length;
    const tier1Total = report.tier1_results.length;

    // If few Tier 1 options, include Tier 2
    if (tier1Susceptible <= 2 && tier1Total > 0) {
      recommendations.reportTier2 = true;
      recommendations.cascadingLogic.push('Limited Tier 1 options - including Tier 2 agents');
    }

    // If multidrug resistant, include Tier 3
    const resistanceRatio = (tier1Total - tier1Susceptible) / tier1Total;
    if (resistanceRatio > 0.7) {
      recommendations.reportTier3 = true;
      recommendations.cascadingLogic.push('High resistance detected - including specialized agents');
    }

    return recommendations;
  }

  // Detect resistance patterns
  generateResistanceAlerts(report) {
    const alerts = [];

    // ESBL detection
    const esblPattern = this.detectESBLPattern(report);
    if (esblPattern.likely) {
      alerts.push({
        type: 'esbl_suspected',
        severity: 'high',
        message: 'ESBL production suspected based on resistance pattern',
        recommendations: ['Consider confirmatory testing', 'Avoid cephalosporins', 'Carbapenem preferred']
      });
    }

    // AmpC detection
    const ampCPattern = this.detectAmpCPattern(report);
    if (ampCPattern.likely) {
      alerts.push({
        type: 'ampc_suspected',
        severity: 'medium',
        message: 'AmpC β-lactamase production suspected',
        recommendations: ['Cefepime or carbapenem preferred', 'Avoid cefotaxime/ceftriaxone']
      });
    }

    // Carbapenemase detection
    const carbapenemasePattern = this.detectCarbapenemasePattern(report);
    if (carbapenemasePattern.likely) {
      alerts.push({
        type: 'carbapenemase_suspected',
        severity: 'critical',
        message: 'Carbapenemase production suspected - contact ID/IC immediately',
        recommendations: ['Polymyxin or tigecycline consideration', 'Combination therapy', 'Contact isolation']
      });
    }

    return alerts;
  }

  // Generate reporting strategy
  generateReportingStrategy(report, clinicalContext) {
    const strategy = {
      primaryReport: [],
      secondaryReport: [],
      suppressedAgents: [],
      comments: []
    };

    // Sort tier 1 results by stewardship score
    const tier1Sorted = report.tier1_results
      .filter(r => r.interpretation === 'S')
      .sort((a, b) => this.calculateStewardshipScore(b.antibiotic, clinicalContext) - 
                     this.calculateStewardshipScore(a.antibiotic, clinicalContext));

    // Primary report - top narrow spectrum agents
    strategy.primaryReport = tier1Sorted.slice(0, 4).map(r => ({
      antibiotic: r.antibiotic,
      interpretation: r.interpretation,
      tier: r.tier,
      rationale: 'Tier 1 - First line therapy'
    }));

    // Include condition-specific agents
    report.tier1_results.forEach(result => {
      if (result.condition && this.matchesCondition(result.condition, clinicalContext)) {
        if (!strategy.primaryReport.some(r => r.antibiotic === result.antibiotic)) {
          strategy.secondaryReport.push({
            antibiotic: result.antibiotic,
            interpretation: result.interpretation,
            condition: result.condition,
            rationale: `Conditional reporting: ${result.condition}`
          });
        }
      }
    });

    return strategy;
  }

  // Helper methods for pattern detection
  detectESBLPattern(report) {
    const cephalosporinResults = report.tier1_results.filter(r => 
      ['ceftriaxone', 'cefotaxime', 'ceftazidime'].includes(r.antibiotic)
    );

    const resistant = cephalosporinResults.filter(r => r.interpretation === 'R').length;
    const total = cephalosporinResults.length;

    return {
      likely: resistant >= 2 && total >= 2,
      confidence: total > 0 ? resistant / total : 0,
      evidence: cephalosporinResults
    };
  }

  detectAmpCPattern(report) {
    const ampCIndicators = report.tier1_results.filter(r => 
      ['cefotaxime', 'ceftriaxone', 'ampicillin-sulbactam'].includes(r.antibiotic) && 
      r.interpretation === 'R'
    );

    const cefepimeSusceptible = report.tier1_results.some(r => 
      r.antibiotic === 'cefepime' && r.interpretation === 'S'
    );

    return {
      likely: ampCIndicators.length >= 2 && cefepimeSusceptible,
      confidence: ampCIndicators.length >= 2 ? 0.8 : 0.4,
      evidence: ampCIndicators
    };
  }

  detectCarbapenemasePattern(report) {
    const carbapenemResults = report.tier1_results.filter(r => 
      ['meropenem', 'imipenem', 'ertapenem'].includes(r.antibiotic)
    );

    const resistant = carbapenemResults.filter(r => r.interpretation === 'R').length;

    return {
      likely: resistant >= 1,
      confidence: resistant >= 2 ? 1.0 : 0.7,
      evidence: carbapenemResults
    };
  }

  // Stewardship scoring
  calculateStewardshipScore(antibiotic, clinicalContext) {
    let score = 50; // Base score

    // Narrow spectrum bonus
    if (this.isNarrowSpectrum(antibiotic)) score += 20;

    // Oral option bonus (if appropriate)
    if (this.hasOralOption(antibiotic) && !clinicalContext.severe_infection) score += 10;

    // Site-specific optimization
    if (clinicalContext.infection_site && this.isOptimalForSite(antibiotic, clinicalContext.infection_site)) {
      score += 15;
    }

    // Resistance risk penalty
    if (this.isHighResistanceRisk(antibiotic)) score -= 15;

    // Critical agent penalty (save for MDR)
    if (this.isCriticalAgent(antibiotic)) score -= 25;

    return Math.max(0, Math.min(100, score));
  }

  // Helper classification methods
  isNarrowSpectrum(antibiotic) {
    const narrowSpectrum = [
      'ampicillin', 'cefazolin', 'clindamycin', 'erythromycin', 
      'trimethoprim-sulfamethoxazole', 'nitrofurantoin'
    ];
    return narrowSpectrum.includes(antibiotic);
  }

  isCriticalAgent(antibiotic) {
    const critical = ['meropenem', 'imipenem', 'colistin', 'tigecycline', 'linezolid'];
    return critical.includes(antibiotic);
  }

  isHighResistanceRisk(antibiotic) {
    const highRisk = ['ciprofloxacin', 'levofloxacin', 'ceftazidime'];
    return highRisk.includes(antibiotic);
  }

  hasOralOption(antibiotic) {
    const oralOptions = ['trimethoprim-sulfamethoxazole', 'ciprofloxacin', 'amoxicillin-clavulanate'];
    return oralOptions.includes(antibiotic);
  }

  isOptimalForSite(antibiotic, site) {
    const siteOptimization = {
      'urinary_tract': ['nitrofurantoin', 'trimethoprim-sulfamethoxazole', 'ciprofloxacin'],
      'respiratory': ['amoxicillin-clavulanate', 'ceftriaxone', 'levofloxacin'],
      'skin_soft_tissue': ['clindamycin', 'cephalexin', 'trimethoprim-sulfamethoxazole'],
      'intraabdominal': ['piperacillin-tazobactam', 'meropenem', 'metronidazole'],
      'bloodstream': ['ceftriaxone', 'meropenem', 'vancomycin']
    };

    return siteOptimization[site]?.includes(antibiotic) || false;
  }

  matchesCondition(condition, clinicalContext) {
    if (condition.includes('UTI') && clinicalContext.infection_site === 'urinary_tract') {
      return true;
    }
    if (condition.includes('uncomplicated') && !clinicalContext.severe_infection) {
      return true;
    }
    return false;
  }

  generateRationale(result, clinicalContext) {
    const reasons = [];
    
    if (result.tier === 'Tier 1') {
      reasons.push('First-line agent');
    }
    
    if (this.isNarrowSpectrum(result.antibiotic)) {
      reasons.push('narrow spectrum preferred');
    }
    
    if (clinicalContext.infection_site && this.isOptimalForSite(result.antibiotic, clinicalContext.infection_site)) {
      reasons.push('optimal site penetration');
    }
    
    return reasons.join(', ');
  }
}

// Export singleton instance
export const clsiReporting = new CLSIReportingEngine();

// Export helper functions
export {
  getCLSIDatabase,
  getCLSIBreakpoints,
  getTierAntibiotics,
  getReportingPriorityAntibiotics,
  findOrganismCategory,
  validateBreakpoint
};

console.log('🧬 CLSI Reporting Engine initialized');
console.log('   📊 Tier-based antibiogram reporting enabled');
console.log('   🎯 Stewardship-guided recommendations active');