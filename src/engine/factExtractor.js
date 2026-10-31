/**
 * GROUNDED FACT EXTRACTOR ENGINE
 * Extracts key concrete factual claims and pairs them strictly with
 * their primary source citation, author, and publication timestamp.
 * 
 * IMPORTANT: Clearly tagged as [DIRECT SOURCE EVIDENCE] to distinguish
 * verifiable source statements from AI inferences and gap hypotheses.
 */

export function extractGroundedFacts(sources) {
  if (!sources || sources.length === 0) return [];

  const facts = [];

  sources.forEach(src => {
    const sentences = src.content
      .split(/(?<=[.?!])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 25);

    // Look for sentences that contain measurable, concrete, or specific claims
    sentences.forEach((sentence, idx) => {
      const containsMetric = /\d/.test(sentence) || 
                             /contract|budget|award|report|testing|protocol|measured|slated|targets/i.test(sentence);

      if (containsMetric) {
        facts.push({
          id: `fact-${src.id}-${idx}`,
          type: "DIRECT_SOURCE_EVIDENCE",
          badge: "SOURCE EVIDENCE",
          statement: sentence,
          sourceCitation: {
            sourceId: src.id,
            title: src.title,
            publisher: src.publisher,
            author: src.author,
            publishedDate: src.publishedDate || "Date unspecified",
            url: src.url || null,
            reliabilityTier: src.reliabilityTier || "Unrated Source"
          },
          verificationStatus: "Attributed to Source Document",
          isAiHypothesis: false
        });
      }
    });
  });

  return facts;
}
