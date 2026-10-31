/**
 * TEMPORAL ANALYZER ENGINE
 * Analyzes publication timestamps and forward-looking claims across sources
 * to identify potentially outdated, expired, or superseded statements.
 * 
 * IMPORTANT: Helps researchers spot when older promotional statements
 * continue to circulate despite newer empirical evidence disproving them.
 */

export function analyzeTemporalDrift(sources) {
  if (!sources || sources.length === 0) return [];

  const results = [];
  
  // Sort sources chronologically
  const sortedSources = [...sources].sort((a, b) => {
    return new Date(a.publishedDate || "2000-01-01") - new Date(b.publishedDate || "2000-01-01");
  });

  const newestSource = sortedSources[sortedSources.length - 1];
  const newestDate = new Date(newestSource.publishedDate || Date.now());

  sortedSources.forEach(src => {
    if (!src.publishedDate) {
      results.push({
        id: `temp-undated-${src.id}`,
        sourceId: src.id,
        sourceTitle: src.title,
        stalenessLevel: "Medium",
        badge: "UNDATED SOURCE WARNING",
        ageMonths: "Unknown",
        publishedDate: "No Date Provided",
        obsolescenceRisk: "High",
        issueSummary: "Source lacks publication timestamp.",
        detail: "Without a verifiable publication date, claims cannot be anchored in time and may refer to obsolete states.",
        supersededBy: null,
        quote: src.content.substring(0, 140) + "..."
      });
      return;
    }

    const srcDate = new Date(src.publishedDate);
    const diffTime = Math.abs(newestDate - srcDate);
    const diffMonths = Math.round(diffTime / (1000 * 60 * 60 * 24 * 30.4375));

    // If source is over 12 months older than the most recent source
    if (diffMonths >= 12 && src.id !== newestSource.id) {
      // Look for forward-looking projections that have now passed
      const pastProjections = findPastProjections(src.content, srcDate);

      results.push({
        id: `temp-${src.id}`,
        sourceId: src.id,
        sourceTitle: src.title,
        author: src.author,
        publishedDate: src.publishedDate,
        ageMonths: `${diffMonths} months older than newest source`,
        stalenessLevel: diffMonths >= 24 ? "High" : "Medium",
        badge: diffMonths >= 24 ? "CRITICAL TEMPORAL LAG" : "AGING SOURCE",
        issueSummary: `Published ${diffMonths} months before latest findings (${newestSource.publishedDate}).`,
        supersededBy: {
          id: newestSource.id,
          title: newestSource.title,
          publishedDate: newestSource.publishedDate
        },
        detail: pastProjections.length > 0 
          ? `Contains forward-looking projections that expired or were reassessed: "${pastProjections[0]}"`
          : `Information may not reflect recent engineering changes, audits, or regulatory decisions reported in newer literature.`,
        quote: pastProjections[0] || src.content.substring(0, 160) + "..."
      });
    }
  });

  return results;
}

function findPastProjections(text, pubDate) {
  const matches = [];
  // Look for "targets [year]", "slated for [year/Q]", "anticipated by [year]"
  const projectionRegex = /(?:targets|slated for|scheduled for|anticipated by|in)\s+(?:early|late|mid|Q[1-4]\s+)?(202[2-5])/gi;
  let match;
  while ((match = projectionRegex.exec(text)) !== null) {
    // Find enclosing sentence
    const start = Math.max(0, text.lastIndexOf('.', match.index) + 1);
    const end = text.indexOf('.', match.index);
    const sentence = text.substring(start, end !== -1 ? end + 1 : undefined).trim();
    if (sentence) {
      matches.push(sentence);
    }
  }
  return matches;
}
