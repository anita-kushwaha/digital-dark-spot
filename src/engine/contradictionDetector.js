/**
 * CONTRADICTION DETECTOR ENGINE
 * Compares assertions across sources to isolate direct conflicts in:
 * - Numerical figures (metrics, costs, counts, percentages)
 * - Timelines (target years, launch dates, quarters)
 * - Feasibility & Polarity (claims of readiness vs. reports of severe delay/defect)
 * 
 * IMPORTANT: Displays exact verbatim quotes from both sources side-by-side
 * to preserve grounding integrity without hallucinated claims.
 */

export function detectContradictions(sources) {
  if (!sources || sources.length < 2) return [];

  const contradictions = [];

  // Pairwise cross-source comparison
  for (let i = 0; i < sources.length; i++) {
    for (let j = i + 1; j < sources.length; j++) {
      const srcA = sources[i];
      const srcB = sources[j];

      const sA_sentences = extractKeySentences(srcA.content);
      const sB_sentences = extractKeySentences(srcB.content);

      // 1. Numerical & Metric Conflicts
      const numConflicts = compareNumericalSentences(sA_sentences, sB_sentences, srcA, srcB);
      contradictions.push(...numConflicts);

      // 2. Timeline & Date Conflicts
      const dateConflicts = compareTimelineSentences(sA_sentences, sB_sentences, srcA, srcB);
      contradictions.push(...dateConflicts);

      // 3. Polarity / Status Conflicts (e.g., "resolved/on schedule" vs "unresolved/delayed/micro-crack")
      const polarityConflicts = comparePolaritySentences(sA_sentences, sB_sentences, srcA, srcB);
      contradictions.push(...polarityConflicts);
    }
  }

  // Deduplicate contradictions by summary key
  const uniqueContradictions = [];
  const seenKeys = new Set();
  for (const c of contradictions) {
    const key = `${c.sourceA.id}-${c.sourceB.id}-${c.topicTag}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      uniqueContradictions.push(c);
    }
  }

  return uniqueContradictions;
}

function extractKeySentences(text) {
  if (!text) return [];
  return text
    .split(/(?<=[.?!])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 20);
}

function compareNumericalSentences(sentencesA, sentencesB, srcA, srcB) {
  const results = [];
  const patterns = [
    { regex: /(\$\s*\d+(?:\.\d+)?\s*(?:billion|million|kwh))/i, name: "Cost / Financial Figure" },
    { regex: /(\d+(?:\.\d+)?\s*(?:wh\/kg|kwh|cycles|%|percent))/i, name: "Technical Metric" },
    { regex: /(\b\d+\s*to\s*\d+\s*(?:flights|tests|months|days|weeks|cycles))/i, name: "Operational Count / Range" }
  ];

  sentencesA.forEach(sA => {
    patterns.forEach(pat => {
      const matchA = sA.match(pat.regex);
      if (matchA) {
        // Look for matching metric in B with differing value
        sentencesB.forEach(sB => {
          const matchB = sB.match(pat.regex);
          if (matchB && matchA[0].toLowerCase() !== matchB[0].toLowerCase()) {
            results.push({
              id: `conflict-num-${Math.random().toString(36).substring(2, 8)}`,
              topicTag: pat.name,
              category: "Numerical & Metric Conflict",
              severity: "High",
              differenceSummary: `Discrepancy in ${pat.name}: '${matchA[0]}' vs '${matchB[0]}'`,
              sourceA: {
                id: srcA.id,
                title: srcA.title,
                author: srcA.author,
                date: srcA.publishedDate,
                verbatimQuote: sA,
                extractedValue: matchA[0]
              },
              sourceB: {
                id: srcB.id,
                title: srcB.title,
                author: srcB.author,
                date: srcB.publishedDate,
                verbatimQuote: sB,
                extractedValue: matchB[0]
              },
              analystGuidance: "Cross-examine empirical test logs or audited financial balance sheets to identify which figure reflects validated measurements."
            });
          }
        });
      }
    });
  });

  return results;
}

function compareTimelineSentences(sentencesA, sentencesB, srcA, srcB) {
  const results = [];
  const yearPattern = /\b(202[3-9]|2030)\b/g;

  sentencesA.forEach(sA => {
    const yearsA = sA.match(yearPattern);
    if (yearsA && (sA.toLowerCase().includes("target") || sA.toLowerCase().includes("slated") || sA.toLowerCase().includes("delayed") || sA.toLowerCase().includes("launch") || sA.toLowerCase().includes("production"))) {
      sentencesB.forEach(sB => {
        const yearsB = sB.match(yearPattern);
        if (yearsB && (sB.toLowerCase().includes("target") || sB.toLowerCase().includes("slated") || sB.toLowerCase().includes("delayed") || sB.toLowerCase().includes("launch") || sB.toLowerCase().includes("window"))) {
          if (yearsA[0] !== yearsB[0]) {
            results.push({
              id: `conflict-date-${Math.random().toString(36).substring(2, 8)}`,
              topicTag: "Schedule / Timeline",
              category: "Milestone & Timeline Divergence",
              severity: "High",
              differenceSummary: `Timeline conflict: ${yearsA[0]} vs ${yearsB[0]}`,
              sourceA: {
                id: srcA.id,
                title: srcA.title,
                author: srcA.author,
                date: srcA.publishedDate,
                verbatimQuote: sA,
                extractedValue: yearsA[0]
              },
              sourceB: {
                id: srcB.id,
                title: srcB.title,
                author: srcB.author,
                date: srcB.publishedDate,
                verbatimQuote: sB,
                extractedValue: yearsB[0]
              },
              analystGuidance: "Note publication timestamps: check if the later source represents an official schedule revision or an unannounced delay."
            });
          }
        }
      });
    }
  });

  return results;
}

function comparePolaritySentences(sentencesA, sentencesB, srcA, srcB) {
  const results = [];
  const positiveWords = ["resolved", "within acceptable", "zero false-negative", "achieved", "on schedule", "revolutionary"];
  const negativeWords = ["unresolved", "defect", "delayed", "missing", "alarm fatigue", "micro-crack", "inhibited", "excessive", "degradation"];

  sentencesA.forEach(sA => {
    const hasPos = positiveWords.some(w => sA.toLowerCase().includes(w));
    if (hasPos) {
      sentencesB.forEach(sB => {
        const hasNeg = negativeWords.some(w => sB.toLowerCase().includes(w));
        // Check if both discuss a common subject (e.g., boil-off, diagnostic, cell, schedule, safety)
        const commonKeywords = ["boil-off", "diagnostic", "cell", "schedule", "test", "rate", "suit", "trial", "clearance"];
        const sharesTopic = commonKeywords.some(k => sA.toLowerCase().includes(k) && sB.toLowerCase().includes(k));

        if (hasNeg && sharesTopic) {
          results.push({
            id: `conflict-pol-${Math.random().toString(36).substring(2, 8)}`,
            topicTag: "Status & Feasibility",
            category: "Polarity & Readiness Dispute",
            severity: "Medium",
            differenceSummary: "One source claims operational readiness while the other cites severe unresolved defects or delays.",
            sourceA: {
              id: srcA.id,
              title: srcA.title,
              author: srcA.author,
              date: srcA.publishedDate,
              verbatimQuote: sA,
              extractedValue: "Affirmative Readiness"
            },
            sourceB: {
              id: srcB.id,
              title: srcB.title,
              author: srcB.author,
              date: srcB.publishedDate,
              verbatimQuote: sB,
              extractedValue: "Documented Defect / Obstacle"
            },
            analystGuidance: "Investigate whether the positive claim is promotional / vendor-reported and the critical assessment is an empirical audit."
          });
        }
      });
    }
  });

  return results;
}
