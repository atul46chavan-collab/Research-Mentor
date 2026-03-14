export interface Paper {
  id: string;
  title: string;
  authors: string;
  year: number;
  journal: string;
  keyFindings: string;
  limitations: string;
  abstract: string;
}

export const mockPapers: Paper[] = [
  {
    id: "1",
    title: "Prevalence of Iron Deficiency Anemia Among Tribal Children in Central India",
    authors: "Sharma R, Patel K, Mehra S",
    year: 2023,
    journal: "Indian Journal of Pediatrics",
    keyFindings: "67% prevalence of IDA among tribal children aged 5-12, with significant association to dietary iron intake and socioeconomic status.",
    limitations: "Small sample size (n=200), single district study, cross-sectional design limiting causal inference.",
    abstract: "This cross-sectional study investigated the prevalence and determinants of iron deficiency anemia among tribal children in Madhya Pradesh. A total of 200 children aged 5-12 years were examined. Results showed 67% prevalence of IDA with dietary deficiency as the primary contributor."
  },
  {
    id: "2",
    title: "Nutritional Status and Anemia in Indigenous Pediatric Populations: A Systematic Review",
    authors: "Kumar A, Singh D",
    year: 2022,
    journal: "BMC Public Health",
    keyFindings: "Pooled prevalence of anemia in indigenous children was 58.3%. Nutritional deficiency and parasitic infections were the top two causes.",
    limitations: "Heterogeneity across studies, limited data from African and South American indigenous populations.",
    abstract: "A systematic review of 34 studies examining nutritional status and anemia prevalence in indigenous child populations globally. Meta-analysis revealed high heterogeneity but consistently elevated prevalence rates."
  },
  {
    id: "3",
    title: "Impact of Mid-Day Meal Scheme on Hemoglobin Levels in Rural School Children",
    authors: "Gupta M, Reddy T, Joshi P",
    year: 2023,
    journal: "Journal of Community Medicine",
    keyFindings: "Children receiving fortified mid-day meals showed 12% improvement in hemoglobin levels over 6 months compared to control group.",
    limitations: "Short follow-up period (6 months), non-randomized design, limited to one state.",
    abstract: "A quasi-experimental study evaluating the impact of iron-fortified mid-day meals on hemoglobin levels among 450 rural school children in Rajasthan over a 6-month period."
  },
  {
    id: "4",
    title: "Socioeconomic Determinants of Childhood Anemia in Developing Countries",
    authors: "WHO Collaborative Group",
    year: 2021,
    journal: "The Lancet Global Health",
    keyFindings: "Maternal education, household income, and access to clean water were the strongest predictors of childhood anemia across 42 countries.",
    limitations: "Relied on secondary data from DHS surveys, potential recall bias in dietary assessments.",
    abstract: "A multi-country analysis using Demographic and Health Survey data from 42 low- and middle-income countries examining socioeconomic determinants of anemia in children under 5."
  },
  {
    id: "5",
    title: "Genetic Factors Contributing to Anemia Susceptibility in Tribal Populations of India",
    authors: "Banerjee S, Chakraborty R",
    year: 2022,
    journal: "American Journal of Hematology",
    keyFindings: "Higher prevalence of thalassemia trait and G6PD deficiency in tribal populations contributing to anemia burden beyond nutritional factors.",
    limitations: "Small genetic cohort (n=150), single tribal group studied, limited environmental factor analysis.",
    abstract: "This study examined genetic predisposition to anemia in Baiga tribal population of central India, screening for hemoglobinopathies and enzyme deficiencies."
  },
];

export const mockLiteratureReview = `Several studies have investigated anemia prevalence among children in developing regions. Sharma et al. (2023) reported a 67% prevalence of iron deficiency anemia among tribal children in Central India, identifying dietary iron intake and socioeconomic status as significant determinants. Similarly, Kumar and Singh (2022) conducted a systematic review revealing a pooled prevalence of 58.3% across indigenous pediatric populations globally, with nutritional deficiency and parasitic infections as primary causes.

Intervention studies have shown promise — Gupta et al. (2023) demonstrated that iron-fortified mid-day meals improved hemoglobin levels by 12% over six months. The WHO Collaborative Group (2021) identified maternal education and household income as the strongest predictors across 42 countries. Notably, Banerjee and Chakraborty (2022) highlighted that genetic factors, including thalassemia trait and G6PD deficiency, contribute significantly to anemia in tribal populations beyond nutritional causes.

However, several critical gaps remain. Most studies are cross-sectional, limiting causal inference. Long-term cohort studies in tribal populations are notably absent, and there is limited research on the interplay between genetic and environmental factors in these communities.`;

export const mockGaps = [
  {
    gap: "Long-term cohort studies on anemia in tribal child populations",
    reason: "Most existing studies use cross-sectional designs, which cannot establish causality or track progression over time. A longitudinal approach would reveal how anemia develops and persists in these communities.",
    severity: "high" as const,
  },
  {
    gap: "Gene-environment interaction studies in tribal anemia",
    reason: "While genetic predisposition (thalassemia, G6PD) and environmental factors (nutrition, sanitation) have been studied separately, their combined effect remains unexplored.",
    severity: "high" as const,
  },
  {
    gap: "Effectiveness of community-based interventions in tribal settings",
    reason: "Most intervention studies are conducted in urban or semi-urban settings. The unique challenges of tribal healthcare delivery remain understudied.",
    severity: "medium" as const,
  },
  {
    gap: "Impact of traditional dietary practices on iron bioavailability",
    reason: "Tribal communities often have unique food preparation methods that may affect iron absorption, but this has not been systematically studied.",
    severity: "medium" as const,
  },
  {
    gap: "Large-scale multi-state prevalence studies in Indian tribal populations",
    reason: "Existing studies are limited to single districts or states. A comprehensive multi-region study would provide more generalizable prevalence estimates.",
    severity: "low" as const,
  },
];

export const mockTrendSummary = `**Research Trend Summary: Anemia in Tribal Children**

The research landscape on anemia in tribal children has evolved significantly over the past decade. Key trends include:

1. **Prevalence Studies Dominate**: Most research focuses on establishing prevalence rates through cross-sectional surveys. Studies consistently report high prevalence (55-70%) across various tribal populations.

2. **Shift Toward Multi-factorial Analysis**: Recent studies increasingly examine the interplay of nutritional, genetic, and socioeconomic factors rather than single-cause approaches.

3. **Intervention Research Growing**: There is a growing body of evidence on school-based and community-based interventions, particularly iron supplementation and food fortification programs.

4. **Geographic Concentration**: The majority of research originates from India, followed by Southeast Asia and Latin America. African indigenous populations remain understudied.

5. **Common Methodologies**: Cross-sectional surveys with convenience sampling remain the most common design. Hemoglobin estimation via cyanmethemoglobin method is the standard diagnostic approach.`;
