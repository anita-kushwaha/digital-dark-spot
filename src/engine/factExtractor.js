/**
 * GROUNDED FACT & SOURCE EVIDENCE EXTRACTOR
 * Extracts verifiable factual claims directly from the supplied text.
 * 
 * INTEGRITY PRINCIPLE:
 * Pairs each fact with the specific finding supported by that text,
 * and transparently flags missing or unverifiable metadata (missing URL, missing date).
 */

export function extractGroundedFacts(sources) {
  if (!sources || sources.length === 0) return [];

  const facts = [];

  sources.forEach(src => {
    const sentences = (src.content || "")
      .split(/(?<=[.?!])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 25);

    // Analyze source metadata completeness
    const isUrlProvided = Boolean(src.url && src.url.trim().length > 5);
    const isDateProvided = Boolean(src.publishedDate && src.publishedDate.trim().length >= 4);
    const isAuthorProvided = Boolean((src.author && src.author.trim().length > 2) || (src.publisher && src.publisher.trim().length > 2));

    sentences.forEach((sentence, idx) => {
      // Check if sentence contains verifiable factual signals (numbers, dates, currency, milestones, test results)
      const hasMetric = /\d/.test(sentence);
      const hasKeyword = /contract|budget|award|report|testing|protocol|measured|slated|targets|demonstrated|achieves|delayed|obligations|sensitivity|concordance/i.test(sentence);

      if (hasMetric || hasKeyword) {
        // Derive the specific finding supported by this text
        let supportedFinding = "Direct factual assertion grounded in primary document.";

        if (/\$\s*\d+/.test(sentence)) {
          supportedFinding = "Financial expenditure, contract award, or program obligation figure.";
        } else if (/\b(202[3-9]|2030)\b/.test(sentence)) {
          supportedFinding = "Official target year, mission milestone, or schedule projection.";
        } else if (/wh\/kg|%|cycles|concordance|sensitivity|false-negative/i.test(sentence)) {
          supportedFinding = "Empirical technical performance, test accuracy, or battery degradation metric.";
        } else if (/gao|panel|audit|oversight|fda|study/i.test(sentence)) {
          supportedFinding = "Oversight audit finding or formal regulatory review observation.";
        }

        facts.push({
          id: `fact-${src.id}-${idx}`,
          type: "DIRECT_SOURCE_EVIDENCE",
          badge: "SOURCE EVIDENCE",
          statement: sentence,
          supportedFinding,
          sourceCitation: {
            sourceId: src.id,
            title: src.title || "Untitled Document",
            publisher: src.publisher || "Uncredited Publisher",
            author: src.author || "Uncredited Author",
            publishedDate: src.publishedDate || null,
            url: src.url || null,
            reliabilityTier: src.reliabilityTier || "Unrated Source",
            isSample: Boolean(src.isSample),
            isUserSource: Boolean(src.isUserSource)
          },
          metadataIntegrity: {
            isUrlProvided,
            isDateProvided,
            isAuthorProvided,
            missingNotices: [
              !isUrlProvided ? "Citation link / URL missing" : null,
              !isDateProvided ? "Publication date missing" : null,
              !isAuthorProvided ? "Author attribution missing" : null
            ].filter(Boolean)
          },
          verificationStatus: "Attributed to Source Document",
          isAiHypothesis: false
        });
      }
    });
  });

  return facts;
}
