/**
 * GAP DETECTOR ENGINE
 * Analyzes multi-source text content to identify critical missing information,
 * silent omissions, and unanswered investigative questions.
 * 
 * TRANSPARENCY PRINCIPLE:
 * Uses transparent, deterministic keyword & entity pattern matching.
 * Never claims an AI model is used unless the optional Gemini API is active.
 * Clearly separates partial source mentions from completely absent evidence.
 */

// Core investigative dimensions required for thorough analysis
const INVESTIGATIVE_DIMENSIONS = [
  {
    category: "Cost, Budget & Financial Liability",
    dimensionKey: "financial",
    keywords: ["cost", "budget", "price", "billion", "million", "funding", "expense", "penalty", "liable", "liability", "expenditure", "award", "contract"],
    gapQuestion: "What is the total committed budget, cost overrun risk, or financial liability if deadlines or milestones fail?",
    whyItMatters: "Without financial disclosure or penalty clarity, cost overruns and funding cancellations can remain concealed from public or stakeholder oversight.",
    suggestedInvestigation: "Review official government budget requests, SEC 10-K filings, contractor award ceilings, or public audit reports."
  },
  {
    category: "Operational Safety & Contingency Protocols",
    dimensionKey: "safety",
    keywords: ["abort", "emergency", "contingency", "evacuation", "hazard", "risk", "failure", "malfunction", "failsafe", "safety", "egress", "redundancy"],
    gapQuestion: "What contingency or emergency abort protocol exists if the primary system fails during critical execution?",
    whyItMatters: "Promotional or preliminary reports frequently focus on ideal operational scenarios, omitting secondary failure modes and emergency reserves.",
    suggestedInvestigation: "Consult independent safety advisory panel briefings, technical failure mode analyses (FMEA), or emergency operating procedures."
  },
  {
    category: "Environmental & Demographic Boundary Conditions",
    dimensionKey: "environment",
    keywords: ["temperature", "extreme", "environment", "radiation", "demographic", "pediatric", "minority", "gender", "climate", "degradation", "cold", "heat", "weather"],
    gapQuestion: "How does the system perform under extreme boundary conditions, non-standard environments, or unrepresented demographics?",
    whyItMatters: "Systems often demonstrate high performance in benign laboratory environments but encounter severe degradation or failure in harsh real-world conditions.",
    suggestedInvestigation: "Request empirical testing logs under non-ideal parameters (e.g. thermal extremes, diverse patient cohorts, or long-term operational wear)."
  },
  {
    category: "Independent Third-Party Verification & Methodology",
    dimensionKey: "verification",
    keywords: ["independent", "blinded", "audit", "methodology", "peer-reviewed", "replication", "sample size", "protocol", "verification", "external", "oversight"],
    gapQuestion: "Has the methodology and dataset been independently replicated or audited by a neutral third party?",
    whyItMatters: "Single-vendor or self-reported milestones lack neutral validation and have a high historical rate of selection bias.",
    suggestedInvestigation: "Search for peer-reviewed journal replications, government agency audits (e.g. GAO, FDA, DoE), or independent testing laboratory certifications."
  },
  {
    category: "Regulatory Approvals & Statutory Compliance",
    dimensionKey: "regulatory",
    keywords: ["fda", "regulation", "compliance", "law", "statutory", "oversight", "license", "approval", "policy", "standards", "certification", "cleared"],
    gapQuestion: "What formal statutory clearances, regulatory licenses, or legal compliance certifications remain pending or unfulfilled?",
    whyItMatters: "Unfulfilled regulatory milestones or safety certifications can halt operational deployment regardless of technical readiness.",
    suggestedInvestigation: "Inspect regulatory agency public dockets, certification registry databases, or legislative oversight hearing transcripts."
  }
];

export function detectInformationGaps(sources, topicTitle = "") {
  if (!sources || sources.length === 0) return [];

  const gaps = [];

  // Analyze each source individually and combined
  const sourceAnalyses = sources.map(s => {
    const textLower = (s.content || "").toLowerCase();
    const sentences = (s.content || "").split(/(?<=[.?!])\s+/).filter(st => st.trim().length > 10);
    return {
      sourceId: s.id,
      title: s.title,
      textLower,
      sentences
    };
  });

  const combinedText = sourceAnalyses.map(sa => sa.textLower).join(" ");

  // 1. Analyze Core Dimensions
  INVESTIGATIVE_DIMENSIONS.forEach(dim => {
    // Find matching sentences across all sources
    const matchingSentences = [];
    const matchingSources = [];

    sourceAnalyses.forEach(sa => {
      const hits = sa.sentences.filter(sentence => {
        const lower = sentence.toLowerCase();
        return dim.keywords.some(kw => lower.includes(kw));
      });

      if (hits.length > 0) {
        matchingSources.push(sa.title);
        hits.forEach(h => matchingSentences.push({ sourceTitle: sa.title, text: h.trim() }));
      }
    });

    const isFullyCovered = matchingSentences.length >= 3 && matchingSources.length >= 2;

    if (!isFullyCovered) {
      const isPartiallyMentioned = matchingSentences.length > 0;

      gaps.push({
        id: `gap-${dim.dimensionKey}`,
        type: "INFORMATION_GAP",
        badge: isPartiallyMentioned ? "PARTIALLY UNADDRESSED GAP" : "CRITICAL MISSING GAP",
        category: dim.category,
        urgency: isPartiallyMentioned ? "Medium" : "High",
        unansweredQuestion: dim.gapQuestion,
        whyItMatters: dim.whyItMatters,
        evidenceStatus: isPartiallyMentioned ? "partial" : "missing",
        evidenceSummary: isPartiallyMentioned
          ? `Mentioned briefly in ${matchingSources.length} source(s), but lacks comprehensive operational detail or contingency guarantees.`
          : `No supporting evidence found in any of the ${sources.length} supplied source(s).`,
        supportingEvidenceSnippet: isPartiallyMentioned && matchingSentences.length > 0
          ? `"${matchingSentences[0].text}" — (${matchingSentences[0].sourceTitle})`
          : null,
        affectedSources: sources.map(s => s.title),
        suggestedInvestigation: dim.suggestedInvestigation,
        isGroundedInSource: false,
        detectionMethod: "Deterministic Keyword & Coverage Analysis"
      });
    }
  });

  // 2. Analyze Timeline Gap: Does the topic involve future targets without roadmap stages?
  const futureYearMatches = combinedText.match(/\b(202[6-9]|203[0-9])\b/g);
  const milestoneMentions = combinedText.match(/\b(quarter|milestone|phase|review|cdr|pdr|q[1-4])\b/gi);

  if (futureYearMatches && (!milestoneMentions || milestoneMentions.length < 2)) {
    gaps.push({
      id: "gap-timeline-milestones",
      type: "INFORMATION_GAP",
      badge: "SCHEDULE ROADMAP GAP",
      category: "Milestone Transparency & Phasing",
      urgency: "Medium",
      unansweredQuestion: `Future target dates (${Array.from(new Set(futureYearMatches)).join(', ')}) are stated, but what intermediate validation checkpoints must be met first?`,
      whyItMatters: "Projections extending several years ahead without public intermediate stage criteria often obscure underlying schedule slippage.",
      evidenceStatus: "partial",
      evidenceSummary: "Target delivery years are asserted, but granular progress benchmarks or intermediate test criteria are omitted across all sources.",
      supportingEvidenceSnippet: null,
      affectedSources: sources.map(s => s.title),
      suggestedInvestigation: "Request official master milestone schedule documents or critical path schedule reviews (CPR).",
      isGroundedInSource: false,
      detectionMethod: "Temporal Projection Analysis"
    });
  }

  // 3. Single-Perspective / Vendor Bias Gap
  const isAllCommercial = sources.length > 1 && sources.every(s => 
    (s.reliabilityTier || "").toLowerCase().includes("commercial") ||
    (s.reliabilityTier || "").toLowerCase().includes("self-reported")
  );

  if (isAllCommercial) {
    gaps.push({
      id: "gap-neutral-perspective",
      type: "INFORMATION_GAP",
      badge: "SOURCE DIVERSITY DEFICIT",
      category: "Independent Verification Deficit",
      urgency: "High",
      unansweredQuestion: "Where is the objective third-party evaluation or adversarial testing confirming these manufacturer claims?",
      whyItMatters: "All provided sources originate from commercial self-reports. There is an absolute blind spot regarding neutral, unconflicted evaluation.",
      evidenceStatus: "missing",
      evidenceSummary: `All ${sources.length} sources belong to vendor or commercial self-reported tiers. Zero independent audit documents supplied.`,
      supportingEvidenceSnippet: null,
      affectedSources: sources.map(s => s.title),
      suggestedInvestigation: "Ingest academic peer-reviewed papers, regulatory testing records, or oversight audits to establish balance.",
      isGroundedInSource: false,
      detectionMethod: "Source Metadata & Tier Audit"
    });
  }

  return gaps;
}
