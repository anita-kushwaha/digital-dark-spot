/**
 * PRIORITIZED VERIFICATION CHECKLIST GENERATOR
 * Synthesizes gaps, contradictions, and outdated findings into a prioritized
 * action plan for human verification.
 * 
 * PRIORITY MATRIX:
 * - Priority 1 (High): Contradiction resolution (Directly disputing claims).
 * - Priority 2 (Medium): Critical Dark Spot investigation (Crucial unaddressed dimensions).
 * - Priority 3 (Low): Stale source updates & primary citation audits.
 */

export function generateVerificationChecklist(gaps, contradictions, temporalDrifts, sources) {
  const checklist = [];

  // 1. High Priority: Direct Contradictions
  contradictions.forEach(c => {
    checklist.push({
      id: `check-${c.id}`,
      priority: "High",
      priorityBadge: "PRIORITY 1 - HIGH",
      category: "Contradiction Resolution",
      task: `Reconcile discrepancy: "${c.differenceSummary}"`,
      targetEntities: `${c.sourceA.title} vs. ${c.sourceB.title}`,
      actionStep: `Inspect primary raw measurement logs or independent peer reviews to establish which claim (${c.sourceA.extractedValue} vs ${c.sourceB.extractedValue}) has empirical backing.`,
      completed: false,
      userNote: "",
      sourceReference: `Contradiction #${c.id.substring(0, 8)}`
    });
  });

  // 2. Medium Priority: Digital Dark Spots (Missing Critical Dimensions)
  gaps.forEach(g => {
    checklist.push({
      id: `check-${g.id}`,
      priority: g.urgency === "High" ? "High" : "Medium",
      priorityBadge: g.urgency === "High" ? "PRIORITY 1 - HIGH" : "PRIORITY 2 - MEDIUM",
      category: "Dark Spot Investigation",
      task: `Investigate missing dimension: ${g.category}`,
      targetEntities: `All ${sources.length} sources analyzed`,
      actionStep: `${g.unansweredQuestion} Suggested action: ${g.suggestedInvestigation}`,
      completed: false,
      userNote: "",
      sourceReference: `AI Hypothesized Gap: ${g.category}`
    });
  });

  // 3. Low / Medium Priority: Temporal Obsolescence
  temporalDrifts.forEach(t => {
    if (t.supersededBy) {
      checklist.push({
        id: `check-${t.id}`,
        priority: t.stalenessLevel === "High" ? "Medium" : "Low",
        priorityBadge: t.stalenessLevel === "High" ? "PRIORITY 2 - MEDIUM" : "PRIORITY 3 - LOW",
        category: "Temporal Staleness Check",
        task: `Verify if older claims from "${t.sourceTitle}" are superseded.`,
        targetEntities: `${t.sourceTitle} (${t.publishedDate})`,
        actionStep: `Check current 2026 regulatory or corporate filings to confirm whether early projections (${t.detail}) remain valid or have been formally revised.`,
        completed: false,
        userNote: "",
        sourceReference: `Temporal Lag (${t.ageMonths})`
      });
    }
  });

  // Sort: High first, then Medium, then Low
  const priorityOrder = { High: 0, Medium: 1, Low: 2 };
  checklist.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return checklist;
}
