/**
 * GAP DETECTOR ENGINE
 * Analyzes multiple sources to identify missing dimensions, silent omissions,
 * and unanswered critical questions.
 * 
 * IMPORTANT: All findings are distinctly labeled as [AI HYPOTHESIZED GAP]
 * so users can clearly differentiate inferred questions from source facts.
 */

// Core investigative dimensions every thorough topic should cover
const TOPIC_DIMENSIONS = [
  {
    category: "Cost, Budget & Liability",
    keywords: ["cost", "budget", "price", "billion", "million", "funding", "expense", "penalty", "liable", "financial"],
    gapQuestionTemplate: "What is the total committed budget, cost overrun risk, or financial liability if deadlines or milestones fail?",
    whyItMatters: "Without financial disclosure or penalty clarity, cost overruns and funding cancellations can remain concealed."
  },
  {
    category: "Operational Safety & Contingency Abort",
    keywords: ["abort", "emergency", "contingency", "evacuation", "hazard", "risk", "failure", "malfunction", "failsafe", "safety"],
    gapQuestionTemplate: "What contingency or emergency abort protocol exists if the primary system fails during critical execution?",
    whyItMatters: "Optimistic source reports frequently omit secondary failure scenarios and human/environmental safety reserves."
  },
  {
    category: "Environmental & Demographic Edge Cases",
    keywords: ["temperature", "extreme", "environment", "radiation", "demographic", "pediatric", "minority", "gender", "climate", "degradation"],
    gapQuestionTemplate: "How does the system perform under extreme boundary conditions, non-standard environments, or unrepresented demographics?",
    whyItMatters: "Systems often pass benign laboratory tests but fail catastrophically in harsh real-world edge cases."
  },
  {
    category: "Independent Verification & Methodology",
    keywords: ["independent", "blinded", "audit", "methodology", "peer-reviewed", "replication", "sample size", "protocol", "verification"],
    gapQuestionTemplate: "Has the methodology and dataset been independently replicated or audited by a neutral third party?",
    whyItMatters: "Single-vendor or self-reported milestones lack objective validation and are subject to bias."
  },
  {
    category: "Governance, Regulation & Legal Compliance",
    keywords: ["fda", "regulation", "compliance", "law", "statutory", "oversight", "license", "approval", "policy", "standards"],
    gapQuestionTemplate: "What formal regulatory approvals, compliance certifications, or legal frameworks are pending or unfulfilled?",
    whyItMatters: "Unresolved regulatory milestones can prevent deployment regardless of technical readiness."
  }
];

export function detectInformationGaps(sources, topicTitle = "") {
  if (!sources || sources.length === 0) return [];

  const combinedText = sources.map(s => s.content.toLowerCase()).join(" ");
  const gaps = [];

  // 1. Domain Heuristic Missing Dimension Analysis
  TOPIC_DIMENSIONS.forEach(dim => {
    const matchCount = dim.keywords.filter(kw => combinedText.includes(kw)).length;
    
    // If fewer than 2 keywords match, this dimension represents a digital dark spot
    if (matchCount < 2) {
      gaps.push({
        id: `gap-${dim.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        type: "AI_HYPOTHESIZED_GAP",
        badge: "AI HYPOTHESIZED GAP",
        category: dim.category,
        urgency: matchCount === 0 ? "High" : "Medium",
        unansweredQuestion: dim.gapQuestionTemplate,
        whyItMatters: dim.whyItMatters,
        affectedSources: sources.map(s => s.title),
        suggestedInvestigation: `Query official audit registries, primary regulatory filings, or independent technical safety boards regarding ${dim.category.toLowerCase()}.`,
        isGroundedInSource: false,
        aiRationale: `None of the ${sources.length} provided sources adequately address '${dim.category}'. Key operational indicators (${dim.keywords.slice(0, 4).join(', ')}) are absent from the provided text.`
      });
    }
  });

  // 2. Specific contextual gap heuristics
  // Check if dates exist in future with no milestone roadmap
  const hasFutureYear = /\b(202[6-9]|203[0-9])\b/.test(combinedText);
  const hasMilestoneStep = combinedText.includes("milestone") || combinedText.includes("roadmap") || combinedText.includes("quarter");
  if (hasFutureYear && !hasMilestoneStep) {
    gaps.push({
      id: "gap-future-roadmap",
      type: "AI_HYPOTHESIZED_GAP",
      badge: "AI HYPOTHESIZED GAP",
      category: "Milestone Roadmap & Intermediate Validation",
      urgency: "Medium",
      unansweredQuestion: "What measurable quarterly checkpoints exist between current status and projected target years?",
      whyItMatters: "Projections extending past 2026 without documented intermediate stages represent unverified speculative targets.",
      affectedSources: sources.map(s => s.title),
      suggestedInvestigation: "Review contractor milestone review deliverables and engineering critical design review (CDR) minutes.",
      isGroundedInSource: false,
      aiRationale: "Future delivery dates are cited, but granular intermediate milestones are omitted across all sources."
    });
  }

  // Check for vendor-only risk (if only self-reported sources exist)
  const nonVendorSources = sources.filter(s => 
    (s.reliabilityTier && !s.reliabilityTier.toLowerCase().includes("commercial")) &&
    (s.reliabilityTier && !s.reliabilityTier.toLowerCase().includes("self-reported"))
  );

  if (sources.length > 0 && nonVendorSources.length === 0) {
    gaps.push({
      id: "gap-neutral-validation",
      type: "AI_HYPOTHESIZED_GAP",
      badge: "CRITICAL PERSPECTIVE GAP",
      category: "Independent Validation Deficit",
      urgency: "High",
      unansweredQuestion: "Where is the peer-reviewed, independent validation or third-party audit for these claims?",
      whyItMatters: "All provided sources are vendor self-reports. There is a total blind spot regarding objective confirmation.",
      affectedSources: sources.map(s => s.title),
      suggestedInvestigation: "Consult academic journals, government inspection records, or consumer watchdog reviews.",
      isGroundedInSource: false,
      aiRationale: "Every source in the dataset is authored or published by the claiming entity itself."
    });
  }

  return gaps;
}
