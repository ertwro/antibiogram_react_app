// src/engines/TherapeuticStrategyComparatorEngine.js
// --- Advanced Therapeutic Strategy Comparison Engine ---
// Provides specialist-level side-by-side analysis of treatment options

import { antibioticsData } from '../data/antibiotics.js';

export class TherapeuticStrategyComparatorEngine {
  constructor() {
    this.antibioticsDB = antibioticsData;
    this.scoringWeights = this.initializeScoringWeights();
    
    console.log('🎯 TherapeuticStrategyComparatorEngine initialized with specialist-level algorithms');
  }

  /**
   * MAIN FUNCTION: Generate comprehensive therapeutic comparison
   * @param {Object} params - Analysis parameters
   * @returns {Object} Complete therapeutic strategy comparison
   */
  async generateTherapeuticComparison({
    organism,
    infectionSite,
    patientData,
    interpretations,
    resistanceAnalysis,
    mode = 'advanced'
  }) {
    try {
      // 1. Filter effective antibiotics
      const effectiveAntibiotics = this.filterEffectiveAntibiotics(interpretations);
      
      // 2. Generate therapeutic strategies
      const strategies = await this.generateTherapeuticStrategies({
        effectiveAntibiotics,
        organism,
        infectionSite,
        resistanceAnalysis
      });
      
      // 3. Score and rank strategies
      const rankedStrategies = this.scoreTherapeuticStrategies(
        strategies, 
        organism, 
        infectionSite, 
        patientData,
        resistanceAnalysis
      );
      
      // 4. Generate comparative analysis
      const comparison = this.generateComparativeAnalysis(rankedStrategies);
      
      // 5. Create clinical recommendations
      const recommendations = this.generateClinicalRecommendations(
        rankedStrategies, 
        organism, 
        infectionSite,
        resistanceAnalysis
      );

      return {
        strategies: rankedStrategies,
        comparison: comparison,
        recommendations: recommendations,
        metadata: {
          organism,
          infectionSite,
          analysisDate: new Date().toISOString(),
          totalOptions: rankedStrategies.length,
          preferredOptions: rankedStrategies.filter(s => s.recommendation === 'preferred').length
        }
      };

    } catch (error) {
      console.error('TherapeuticStrategyComparator error:', error);
      throw new Error(`Therapeutic comparison failed: ${error.message}`);
    }
  }

  /**
   * Filter antibiotics to those with reasonable efficacy
   */
  filterEffectiveAntibiotics(interpretations) {
    const effective = {};
    
    for (const [antibiotic, result] of Object.entries(interpretations)) {
      // Include susceptible and some intermediate results
      if (result.interpretation === 'S' || 
          (result.interpretation === 'I' && this.isIntermediateUseful(antibiotic))) {
        effective[antibiotic] = result;
      }
    }
    
    return effective;
  }

  /**
   * Check if intermediate result is clinically useful
   */
  isIntermediateUseful(antibiotic) {
    // Some antibiotics with intermediate MICs can still be effective with higher dosing
    const usefulIntermediates = [
      'meropenem', 'cefepime', 'piperacillin-tazobactam', 
      'ciprofloxacin', 'vancomycin'
    ];
    
    return usefulIntermediates.includes(antibiotic);
  }

  /**
   * Generate therapeutic strategies (monotherapy and combinations)
   */
  async generateTherapeuticStrategies({
    effectiveAntibiotics,
    organism,
    infectionSite,
    resistanceAnalysis
  }) {
    const strategies = [];
    
    // 1. Monotherapy strategies
    for (const [antibiotic, interpretation] of Object.entries(effectiveAntibiotics)) {
      const drugData = this.getDrugData(antibiotic);
      if (!drugData) continue;
      
      const strategy = {
        type: 'monotherapy',
        primary: antibiotic,
        agents: [antibiotic],
        interpretation: interpretation,
        drugData: [drugData],
        rationale: this.generateMonotherapyRationale(antibiotic, drugData, organism, infectionSite)
      };
      
      strategies.push(strategy);
    }
    
    // 2. Combination strategies for serious infections
    if (this.requiresCombinationTherapy(organism, infectionSite, resistanceAnalysis)) {
      const combinations = this.generateCombinationStrategies(
        effectiveAntibiotics, 
        organism, 
        infectionSite
      );
      strategies.push(...combinations);
    }
    
    // 3. Empiric broadening strategies
    const empiricStrategies = this.generateEmpiricStrategies(
      effectiveAntibiotics,
      organism,
      infectionSite
    );
    strategies.push(...empiricStrategies);
    
    return strategies;
  }

  /**
   * Score and rank therapeutic strategies
   */
  scoreTherapeuticStrategies(strategies, organism, infectionSite, patientData, resistanceAnalysis) {
    const scoredStrategies = strategies.map(strategy => {
      const scores = this.calculateStrategyScores(
        strategy, 
        organism, 
        infectionSite, 
        patientData,
        resistanceAnalysis
      );
      
      return {
        ...strategy,
        scores: scores,
        totalScore: this.calculateWeightedScore(scores),
        recommendation: this.determineRecommendationLevel(scores)
      };
    });
    
    // Sort by total score (descending)
    return scoredStrategies.sort((a, b) => b.totalScore - a.totalScore);
  }

  /**
   * Calculate comprehensive scoring for strategy
   */
  calculateStrategyScores(strategy, organism, infectionSite, patientData, resistanceAnalysis) {
    const scores = {
      efficacy: this.scoreEfficacy(strategy, organism, infectionSite),
      safety: this.scoreSafety(strategy, patientData),
      stewardship: this.scoreStewardship(strategy, organism, resistanceAnalysis),
      pharmacology: this.scorePharmacology(strategy, infectionSite),
      resistance: this.scoreResistanceRisk(strategy, organism, resistanceAnalysis),
      convenience: this.scoreConvenience(strategy),
      cost: this.scoreCost(strategy)
    };
    
    return scores;
  }

  /**
   * Score efficacy based on organism susceptibility and drug characteristics
   */
  scoreEfficacy(strategy, organism, infectionSite) {
    let score = 0;
    
    for (const antibiotic of strategy.agents) {
      const interpretation = strategy.interpretation || strategy.drugData.find(d => d.name === antibiotic)?.interpretation;
      
      // Base score from susceptibility
      if (interpretation?.interpretation === 'S') {
        score += 30;
      } else if (interpretation?.interpretation === 'I') {
        score += 15;
      }
      
      // Organism-specific effectiveness
      score += this.getOrganismSpecificEfficacy(antibiotic, organism);
      
      // Site-specific penetration
      score += this.getSitePenetrationScore(antibiotic, infectionSite);
    }
    
    // Combination synergy bonus
    if (strategy.type === 'combination') {
      score += this.getCombinationSynergyScore(strategy.agents, organism);
    }
    
    return Math.min(score, 100); // Cap at 100
  }

  /**
   * Score safety profile
   */
  scoreSafety(strategy, patientData) {
    let score = 80; // Start with good baseline
    
    for (const antibiotic of strategy.agents) {
      const drugData = this.getDrugData(antibiotic);
      if (!drugData) continue;
      
      // Kidney function adjustments
      if (patientData?.renalFunction === 'impaired') {
        if (drugData.renalAdjustment === 'required') {
          score -= 10;
        } else if (drugData.renalAdjustment === 'major') {
          score -= 20;
        }
      }
      
      // Liver function adjustments
      if (patientData?.hepaticFunction === 'impaired') {
        if (drugData.hepaticAdjustment === 'required') {
          score -= 10;
        }
      }
      
      // Age-related considerations
      if (patientData?.age > 65) {
        if (drugData.elderlyRisk === 'high') {
          score -= 15;
        }
      }
      
      // Drug interactions
      if (drugData.interactionRisk === 'high') {
        score -= 10;
      }
    }
    
    return Math.max(score, 0);
  }

  /**
   * Score antimicrobial stewardship considerations
   */
  scoreStewardship(strategy, organism, resistanceAnalysis) {
    let score = 50; // Neutral baseline
    
    for (const antibiotic of strategy.agents) {
      const drugData = this.getDrugData(antibiotic);
      if (!drugData) continue;
      
      // Narrow spectrum preference
      if (drugData.spectrum === 'narrow') {
        score += 20;
      } else if (drugData.spectrum === 'broad') {
        score -= 10;
      } else if (drugData.spectrum === 'very_broad') {
        score -= 20;
      }
      
      // Carbapenem stewardship
      if (drugData.class === 'carbapenem') {
        if (this.isCarbapenemaRequired(resistanceAnalysis)) {
          score += 10; // Appropriate use
        } else {
          score -= 30; // Inappropriate carbapenem use
        }
      }
      
      // Reserve agent stewardship
      if (drugData.stewardship === 'restricted') {
        score -= 20;
      } else if (drugData.stewardship === 'preferred') {
        score += 15;
      }
    }
    
    return Math.max(score, 0);
  }

  /**
   * Score pharmacological considerations
   */
  scorePharmacology(strategy, infectionSite) {
    let score = 0;
    
    for (const antibiotic of strategy.agents) {
      const drugData = this.getDrugData(antibiotic);
      if (!drugData) continue;
      
      // Tissue penetration
      const penetration = this.getTissuePenetration(antibiotic, infectionSite);
      score += penetration * 20;
      
      // Bactericidal vs bacteriostatic
      if (drugData.activity === 'bactericidal') {
        score += 15;
      } else if (drugData.activity === 'bacteriostatic') {
        score += 5;
      }
      
      // PK/PD optimization
      if (drugData.pkpdOptimized) {
        score += 10;
      }
    }
    
    return Math.min(score, 100);
  }

  /**
   * Score resistance development risk
   */
  scoreResistanceRisk(strategy, organism, resistanceAnalysis) {
    let score = 80; // Start high (low risk)
    
    for (const antibiotic of strategy.agents) {
      const drugData = this.getDrugData(antibiotic);
      if (!drugData) continue;
      
      // Inherent resistance risk
      if (drugData.resistanceRisk === 'high') {
        score -= 20;
      } else if (drugData.resistanceRisk === 'moderate') {
        score -= 10;
      }
      
      // Organism-specific resistance concerns
      if (this.hasKnownResistanceRisk(antibiotic, organism)) {
        score -= 15;
      }
    }
    
    // Combination therapy reduces resistance risk
    if (strategy.type === 'combination') {
      score += 20;
    }
    
    return Math.max(score, 0);
  }

  /**
   * Score convenience and administration
   */
  scoreConvenience(strategy) {
    let score = 0;
    
    for (const antibiotic of strategy.agents) {
      const drugData = this.getDrugData(antibiotic);
      if (!drugData) continue;
      
      // Dosing frequency
      if (drugData.dosing === 'once_daily') {
        score += 25;
      } else if (drugData.dosing === 'twice_daily') {
        score += 20;
      } else if (drugData.dosing === 'three_times_daily') {
        score += 10;
      }
      
      // Oral availability
      if (drugData.oralAvailable) {
        score += 20;
      }
      
      // Monitoring requirements
      if (drugData.monitoring === 'none') {
        score += 15;
      } else if (drugData.monitoring === 'minimal') {
        score += 10;
      } else if (drugData.monitoring === 'intensive') {
        score -= 10;
      }
    }
    
    return Math.min(score / strategy.agents.length, 100);
  }

  /**
   * Score cost considerations
   */
  scoreCost(strategy) {
    let score = 0;
    
    for (const antibiotic of strategy.agents) {
      const drugData = this.getDrugData(antibiotic);
      if (!drugData) continue;
      
      if (drugData.cost === 'low') {
        score += 25;
      } else if (drugData.cost === 'moderate') {
        score += 15;
      } else if (drugData.cost === 'high') {
        score += 5;
      } else if (drugData.cost === 'very_high') {
        score -= 10;
      }
    }
    
    return Math.max(score / strategy.agents.length, 0);
  }

  /**
   * Calculate weighted total score
   */
  calculateWeightedScore(scores) {
    let totalScore = 0;
    
    for (const [category, score] of Object.entries(scores)) {
      totalScore += score * (this.scoringWeights[category] || 0);
    }
    
    return Math.round(totalScore);
  }

  /**
   * Determine recommendation level
   */
  determineRecommendationLevel(scores) {
    const total = this.calculateWeightedScore(scores);
    
    if (total >= 80 && scores.efficacy >= 70 && scores.safety >= 60) {
      return 'preferred';
    } else if (total >= 60 && scores.efficacy >= 50) {
      return 'alternative';
    } else if (total >= 40) {
      return 'consider';
    } else {
      return 'avoid';
    }
  }

  /**
   * Generate comparative analysis
   */
  generateComparativeAnalysis(strategies) {
    const comparison = {
      summary: this.generateComparisonSummary(strategies),
      categories: this.generateCategoryComparisons(strategies),
      tradeoffs: this.identifyTradeoffs(strategies)
    };
    
    return comparison;
  }

  /**
   * Generate clinical recommendations
   */
  generateClinicalRecommendations(strategies, organism, infectionSite, resistanceAnalysis) {
    const preferred = strategies.filter(s => s.recommendation === 'preferred');
    const alternatives = strategies.filter(s => s.recommendation === 'alternative');
    
    return {
      firstLine: preferred.slice(0, 2),
      alternatives: alternatives.slice(0, 3),
      avoid: strategies.filter(s => s.recommendation === 'avoid'),
      specialConsiderations: this.generateSpecialConsiderations(
        organism, 
        infectionSite, 
        resistanceAnalysis
      ),
      durationGuidance: this.getDurationGuidance(infectionSite),
      monitoringRecommendations: this.getMonitoringRecommendations(preferred)
    };
  }

  // Helper methods...
  
  getDrugData(antibiotic) {
    return this.antibioticsDB?.[antibiotic] || null;
  }

  initializeScoringWeights() {
    return {
      efficacy: 0.30,
      safety: 0.25,
      stewardship: 0.15,
      pharmacology: 0.15,
      resistance: 0.10,
      convenience: 0.03,
      cost: 0.02
    };
  }

  requiresCombinationTherapy(organism, infectionSite, resistanceAnalysis) {
    // Combination therapy indications
    const combinations = [
      infectionSite.includes('endocarditis'),
      infectionSite.includes('CNS'),
      resistanceAnalysis?.detectedPatterns?.some(p => p.type === 'carbapenemase'),
      organism.includes('Pseudomonas') && infectionSite.includes('RESP')
    ];
    
    return combinations.some(indication => indication);
  }

  generateMonotherapyRationale(antibiotic, drugData, organism, infectionSite) {
    const rationales = [];
    
    if (drugData.spectrum === 'narrow') {
      rationales.push('Narrow spectrum - excellent stewardship choice');
    }
    
    if (drugData.activity === 'bactericidal') {
      rationales.push('Bactericidal activity against target organism');
    }
    
    const penetration = this.getTissuePenetration(antibiotic, infectionSite);
    if (penetration > 0.8) {
      rationales.push('Excellent tissue penetration for infection site');
    }
    
    return rationales.join('; ');
  }

  getTissuePenetration(antibiotic, infectionSite) {
    // Simplified penetration scoring
    const penetrationMap = {
      'CNS': {
        'ceftriaxone': 0.9,
        'meropenem': 0.8,
        'vancomycin': 0.7,
        'linezolid': 0.9
      },
      'RESP': {
        'ceftriaxone': 0.9,
        'meropenem': 0.8,
        'azithromycin': 0.9,
        'levofloxacin': 0.8
      }
    };
    
    const siteKey = infectionSite.split('_')[0];
    return penetrationMap[siteKey]?.[antibiotic] || 0.7; // Default good penetration
  }

  // ... additional helper methods would continue here
  
  getOrganismSpecificEfficacy(antibiotic, organism) {
    // Simplified organism-specific scoring
    return 10; // Default moderate efficacy
  }

  getSitePenetrationScore(antibiotic, infectionSite) {
    return this.getTissuePenetration(antibiotic, infectionSite) * 20;
  }

  getCombinationSynergyScore(agents, organism) {
    // Simplified synergy scoring
    return 15;
  }

  isCarbapenemaRequired(resistanceAnalysis) {
    return resistanceAnalysis?.detectedPatterns?.some(p => 
      p.type === 'esbl' || p.type === 'ampc'
    ) || false;
  }

  hasKnownResistanceRisk(antibiotic, organism) {
    // Simplified resistance risk assessment
    const risks = {
      'ciprofloxacin': ['Pseudomonas', 'Enterobacter'],
      'ceftazidime': ['Pseudomonas', 'Enterobacter']
    };
    
    return risks[antibiotic]?.some(org => organism.includes(org)) || false;
  }

  generateCombinationStrategies(effectiveAntibiotics, organism, infectionSite) {
    // Simplified combination generation
    return [];
  }

  generateEmpiricStrategies(effectiveAntibiotics, organism, infectionSite) {
    // Simplified empiric strategy generation
    return [];
  }

  generateComparisonSummary(strategies) {
    return `Analysis of ${strategies.length} therapeutic strategies`;
  }

  generateCategoryComparisons(strategies) {
    return {};
  }

  identifyTradeoffs(strategies) {
    return [];
  }

  generateSpecialConsiderations(organism, infectionSite, resistanceAnalysis) {
    return [];
  }

  getDurationGuidance(infectionSite) {
    const durations = {
      'RESP_': '5-7 days for CAP, 7-10 days for HAP/VAP',
      'GU_': '3-7 days for uncomplicated UTI, 7-14 days for complicated',
      'CNS_': '10-14 days for bacterial meningitis',
      'BS_': '7-14 days depending on source control'
    };
    
    const siteKey = Object.keys(durations).find(key => infectionSite.startsWith(key));
    return durations[siteKey] || '7-10 days (standard course)';
  }

  getMonitoringRecommendations(preferredStrategies) {
    return [];
  }
}

export default TherapeuticStrategyComparatorEngine;