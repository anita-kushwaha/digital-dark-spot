/**
 * PRIORITIZED VERIFICATION CHECKLIST GENERATOR
 * Translates analytical findings (contradictions, gaps, temporal shifts)
 * into an actionable investigative task roadmap.
 * 
 * PRIORITY MATRIX:
 * - Priority 1 (High): Confirmed Contradictions & Items Needing Manual Verification
 * - Priority 2 (Medium): Critical Information Gaps & Unanswered Questions
 * - Priority 3 (Low): Temporal Staleness & Missing Metadata Audits
 */

export function generateVerificationChecklist(gaps, contradictions, temporalDrifts, sources) {
  const checklist = [];

  // 1. Contradictions & Manual Verification Items (High Priority)
  contradictions.forEach(c => {
    const isNeedsManual = c.status === "NEEDS_MANUAL_VERIFICATION";
    checklist.push({
      id: `check-${c.id}`,
      priority: isNeedsManual ? "High" : "High",
      priorityBadge: isNeedsManual ? "PRIORITY 1 - VERIFY SCOPE" : "PRIORITY 1 - RESOLVE DISPUTE",
      category: isNeedsManual ? "Manual Scope Verification" : "Contradiction Resolution",
      task: isNeedsManual 
        ? `Reconcile potential scope difference: "${c.differenceSummary}"`
        : `Investigate factual conflict: "${c.differenceSummary}"`,
      targetEntities: `${c.sourceA.title} vs. ${c.sourceB.title}`,
      actionStep: c.analystGuidance || `Cross-examine primary laboratory records or financial disclosures to determine which claim (${c.sourceA.extractedValue} vs ${c.sourceB.extractedValue}) has empirical support.`,
      completed: false,
      userNote: "",
      sourceReference: `Cross-Source ${c.topic}`
    });
  });

  // 2. Information Gaps (Medium/High Priority)
  gaps.forEach(g => {
    checklist.push({
      id: `check-${g.id}`,
      priority: g.urgency === "High" ? "High" : "Medium",
      priorityBadge: g.urgency === "High" ? "PRIORITY 1 - CRITICAL GAP" : "PRIORITY 2 - INVESTIGATE GAP",
      category: "Dark Spot Investigation",
      task: `Bridge information gap: ${g.category}`,
      targetEntities: `All ${sources.length} provided sources`,
      actionStep: `${g.unansweredQuestion} Next step: ${g.suggestedInvestigation}`,
      completed: false,
      userNote: "",
      sourceReference: `Gap: ${g.category}`
    });
  });

  // 3. Temporal Shifts (Medium/Low Priority)
  temporalDrifts.forEach(t => {
    if (t.type === "TEMPORAL_DRIFT") {
      checklist.push({
        id: `check-${t.id}`,
        priority: t.severity === "High" ? "Medium" : "Low",
        priorityBadge: t.severity === "High" ? "PRIORITY 2 - STALE DATA" : "PRIORITY 3 - TIMELINE CHECK",
        category: "Temporal Staleness Check",
        task: `Verify if older claims from "${t.earlierSource?.title}" are superseded.`,
        targetEntities: `${t.earlierSource?.title} (${t.earlierSource?.date})`,
        actionStep: `Check current 2026 filings or updates to verify whether early statements have been formally replaced. ${t.guidance || ''}`,
        completed: false,
        userNote: "",
        sourceReference: `Temporal Shift (${t.timeElapsed})`
      });
    } else if (t.type === "UNDATED_SOURCE_ALERT") {
      checklist.push({
        id: `check-${t.id}`,
        priority: "Low",
        priorityBadge: "PRIORITY 3 - METADATA AUDIT",
        category: "Source Metadata Audit",
        task: `Locate official publication date for "${t.sourceTitle}".`,
        targetEntities: t.sourceTitle,
        actionStep: "Inspect document header, DOI record, or publication press page to anchor this document chronologically.",
        completed: false,
        userNote: "",
        sourceReference: "Undated Document"
      });
    }
  });

  // Sort: High first, then Medium, then Low
  const priorityOrder = { High: 0, Medium: 1, Low: 2 };
  checklist.sort((a, b) => (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2));

  return checklist;
}
