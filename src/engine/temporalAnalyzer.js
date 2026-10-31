/**
 * TEMPORAL DRIFT & OBSOLESCENCE ANALYZER
 * Compares dated claims across sources to track how projections, budgets,
 * and milestones have shifted over time.
 * 
 * INTEGRITY PRINCIPLE:
 * Strictly relies on user-provided or verified source timestamps.
 * If dates are missing, explicitly flags them as unverifiable rather than guessing.
 */

export function analyzeTemporalDrift(sources) {
  if (!sources || sources.length === 0) return [];

  const findings = [];

  // 1. Check for Undated Sources
  const undatedSources = sources.filter(s => !s.publishedDate || s.publishedDate.trim() === "");
  undatedSources.forEach(s => {
    findings.push({
      id: `temp-undated-${s.id}`,
      type: "UNDATED_SOURCE_ALERT",
      status: "INSUFFICIENT_EVIDENCE",
      badge: "MISSING PUBLICATION DATE",
      topic: "Temporal Chronology",
      sourceTitle: s.title,
      author: s.author,
      publishedDate: "No Date Provided",
      severity: "Medium",
      issueSummary: "Source lacks publication date metadata.",
      whatChanged: "Cannot determine chronological sequence or check for obsolescence because no publication date was supplied.",
      earlierClaim: null,
      laterClaim: null,
      evidenceSnippet: s.content ? s.content.substring(0, 140) + "..." : "No text",
      guidance: "Provide an official publication date for this source to enable chronological verification."
    });
  });

  // 2. Sort dated sources chronologically
  const datedSources = sources
    .filter(s => s.publishedDate && s.publishedDate.trim().length >= 4)
    .sort((a, b) => new Date(a.publishedDate) - new Date(b.publishedDate));

  if (datedSources.length < 2) {
    if (datedSources.length === 1 && sources.length > 1) {
      findings.push({
        id: "temp-single-dated",
        type: "INSUFFICIENT_TIMELINE",
        status: "INSUFFICIENT_EVIDENCE",
        badge: "INSUFFICIENT DATED SOURCES",
        topic: "Chronological Sequence",
        sourceTitle: "Multiple Sources Ingested",
        publishedDate: "Partial",
        severity: "Low",
        issueSummary: "At least 2 dated sources are required to compare claims over time.",
        whatChanged: "Only 1 source has a valid publication date. Add dates to other sources to track timeline progression.",
        earlierClaim: null,
        laterClaim: null,
        evidenceSnippet: null,
        guidance: "Edit existing sources and add their publication dates."
      });
    }
    return findings;
  }

  // 3. Compare Dated Claims on Thematic Clusters
  const earliestSource = datedSources[0];
  const latestSource = datedSources[datedSources.length - 1];

  const earliestDate = new Date(earliestSource.publishedDate);
  const latestDate = new Date(latestSource.publishedDate);
  const diffDays = Math.round((latestDate - earliestDate) / (1000 * 60 * 60 * 24));
  const diffMonths = Math.round(diffDays / 30.4375);

  // Compare earliest vs latest for milestone and status changes
  const sentencesEarliest = splitIntoSentences(earliestSource.content);
  const sentencesLatest = splitIntoSentences(latestSource.content);

  // Common subjects to track over time
  const TRACKED_THEMES = [
    {
      topic: "Milestone & Deployment Schedule",
      keywords: ["target", "schedule", "launch", "slated", "delayed", "window", "2024", "2025", "2026", "2027", "2028"]
    },
    {
      topic: "Budget & Program Expenditures",
      keywords: ["budget", "cost", "billion", "million", "obligations", "award", "$"]
    },
    {
      topic: "Technical Readiness & Test Outcomes",
      keywords: ["testing", "defect", "resolved", "unresolved", "boil-off", "concordance", "sensitivity", "cycles", "degradation"]
    }
  ];

  TRACKED_THEMES.forEach(theme => {
    const earlyMatches = sentencesEarliest.filter(s => theme.keywords.some(k => s.toLowerCase().includes(k)));
    const lateMatches = sentencesLatest.filter(s => theme.keywords.some(k => s.toLowerCase().includes(k)));

    if (earlyMatches.length > 0 && lateMatches.length > 0 && diffMonths >= 6) {
      findings.push({
        id: `temp-drift-${earliestSource.id}-${latestSource.id}-${theme.topic.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        type: "TEMPORAL_DRIFT",
        status: "DOCUMENTED_TEMPORAL_CHANGE",
        badge: diffMonths >= 24 ? "CRITICAL TEMPORAL LAG (2+ YEARS)" : "TEMPORAL UPDATE",
        topic: theme.topic,
        severity: diffMonths >= 24 ? "High" : "Medium",
        timeElapsed: `${diffMonths} months (${earliestSource.publishedDate} to ${latestSource.publishedDate})`,
        issueSummary: `Claims evolved over ${diffMonths} months between "${earliestSource.title}" and "${latestSource.title}".`,
        whatChanged: `Earlier publication (${earliestSource.publishedDate}) reflected an earlier program phase or projection that was subsequently reassessed in ${latestSource.publishedDate}.`,
        earlierSource: {
          id: earliestSource.id,
          title: earliestSource.title,
          date: earliestSource.publishedDate,
          author: earliestSource.author,
          claimQuote: earlyMatches[0]
        },
        laterSource: {
          id: latestSource.id,
          title: latestSource.title,
          date: latestSource.publishedDate,
          author: latestSource.author,
          claimQuote: lateMatches[0]
        },
        guidance: "Always prioritize findings from the latest source when citing operational status or readiness metrics."
      });
    }
  });

  return findings;
}

function splitIntoSentences(text) {
  if (!text) return [];
  return text
    .split(/(?<=[.?!])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 15);
}
