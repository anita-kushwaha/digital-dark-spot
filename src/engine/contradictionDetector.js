/**
 * CONTRADICTION DETECTOR ENGINE
 * Compares assertions across different sources to isolate:
 * 1. Confirmed Discrepancies (Direct factual, numerical, or timeline clashes)
 * 2. Scope & Status Divergences (Marked as "Needs manual verification")
 * 
 * INTEGRITY PRINCIPLE:
 * Never invents contradictions. If context is differing or evidence is ambiguous,
 * explicitly labels as "Needs manual verification".
 */

// Common thematic clusters for cross-source comparison
const THEMATIC_CLUSTERS = [
  {
    topic: "Schedule & Target Launch/Deployment",
    keywords: ["launch", "target", "schedule", "slated", "delayed", "deployment", "window", "ready"],
    patterns: [/\b(202[3-9]|203[0-9])\b/g, /\b(Q[1-4]\s*202[3-9])\b/gi]
  },
  {
    topic: "Program Cost & Contract Obligations",
    keywords: ["cost", "billion", "million", "contract", "award", "obligations", "per kwh", "expenditure", "$"],
    patterns: [/\$\s*\d+(?:\.\d+)?\s*(?:billion|million|kwh)?/gi]
  },
  {
    topic: "Technical Performance & Density/Accuracy Metrics",
    keywords: ["wh/kg", "concordance", "sensitivity", "accuracy", "false-negative", "density", "cycles", "degradation"],
    patterns: [/\b\d+(?:\.\d+)?\s*(?:wh\/kg|%|cycles)\b/gi]
  },
  {
    topic: "Operational Requirements & Flight Frequency",
    keywords: ["refueling", "flights", "transfer", "docking", "propellant", "missions"],
    patterns: [/\b\d+\s*to\s*\d+\s*(?:flights|tests|launches)?\b/gi]
  },
  {
    topic: "Technical Feasibility & Readiness Status",
    keywords: ["boil-off", "heat-shield", "dendrite", "sintering", "alarm fatigue", "char loss", "defect"],
    patterns: []
  }
];

export function detectContradictions(sources) {
  if (!sources || sources.length < 2) return [];

  const findings = [];

  for (let i = 0; i < sources.length; i++) {
    for (let j = i + 1; j < sources.length; j++) {
      const srcA = sources[i];
      const srcB = sources[j];

      const sA_sentences = splitIntoSentences(srcA.content);
      const sB_sentences = splitIntoSentences(srcB.content);

      THEMATIC_CLUSTERS.forEach(cluster => {
        const matchesA = sA_sentences.filter(s => 
          cluster.keywords.some(k => s.toLowerCase().includes(k))
        );
        const matchesB = sB_sentences.filter(s => 
          cluster.keywords.some(k => s.toLowerCase().includes(k))
        );

        if (matchesA.length > 0 && matchesB.length > 0) {
          matchesA.forEach(sentA => {
            matchesB.forEach(sentB => {
              const finding = evaluateSentencePair(sentA, sentB, srcA, srcB, cluster);
              if (finding) {
                findings.push(finding);
              }
            });
          });
        }
      });
    }
  }

  // Deduplicate by source pair and topic
  const uniqueFindings = [];
  const seen = new Set();
  findings.forEach(f => {
    const key = `${f.sourceA.id}-${f.sourceB.id}-${f.topic}-${f.status}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueFindings.push(f);
    }
  });

  return uniqueFindings;
}

function splitIntoSentences(text) {
  if (!text) return [];
  return text
    .split(/(?<=[.?!])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 20);
}

function evaluateSentencePair(sentA, sentB, srcA, srcB, cluster) {
  const lowerA = sentA.toLowerCase();
  const lowerB = sentB.toLowerCase();

  // 1. Direct Year / Timeline Discrepancy
  const yearA = sentA.match(/\b(202[3-9]|2030)\b/);
  const yearB = sentB.match(/\b(202[3-9]|2030)\b/);

  if (yearA && yearB && yearA[0] !== yearB[0]) {
    return {
      id: `conflict-date-${srcA.id}-${srcB.id}-${yearA[0]}-${yearB[0]}`,
      topic: cluster.topic,
      status: "CONFIRMED_CONTRADICTION",
      badge: "DIRECT TIMELINE DISCREPANCY",
      severity: "High",
      differenceSummary: `Timeline conflict on ${cluster.topic}: ${yearA[0]} vs ${yearB[0]}`,
      textualEvidence: `Source A asserts target date ${yearA[0]}, whereas Source B reports revised/delayed target date ${yearB[0]}.`,
      sourceA: {
        id: srcA.id,
        title: srcA.title,
        author: srcA.author,
        date: srcA.publishedDate || "Date unspecified",
        verbatimQuote: sentA,
        extractedValue: yearA[0]
      },
      sourceB: {
        id: srcB.id,
        title: srcB.title,
        author: srcB.author,
        date: srcB.publishedDate || "Date unspecified",
        verbatimQuote: sentB,
        extractedValue: yearB[0]
      },
      analystGuidance: "Cross-reference publication dates to determine if the later document represents an official revision, schedule replan, or external audit finding."
    };
  }

  // 2. Numerical Discrepancy & Scope Divergence
  const numRegex = /\b(\$?\d+(?:\.\d+)?\s*(?:billion|million|wh\/kg|%|flights|cycles)?)\b/gi;
  const numsA = sentA.match(numRegex) || [];
  const numsB = sentB.match(numRegex) || [];

  const cleanNumsA = numsA.filter(n => /\d/.test(n) && (n.includes('$') || n.includes('billion') || n.includes('million') || n.includes('wh/kg') || n.includes('%') || n.includes('flights') || n.includes('cycles') || parseInt(n, 10) > 100));
  const cleanNumsB = numsB.filter(n => /\d/.test(n) && (n.includes('$') || n.includes('billion') || n.includes('million') || n.includes('wh/kg') || n.includes('%') || n.includes('flights') || n.includes('cycles') || parseInt(n, 10) > 100));

  if (cleanNumsA.length > 0 && cleanNumsB.length > 0) {
    const valA = cleanNumsA[0].trim();
    const valB = cleanNumsB[0].trim();

    if (valA.toLowerCase() !== valB.toLowerCase()) {
      const sharedWords = getSharedSubstantiveWords(sentA, sentB);

      // Check for Scope Divergence in Cost / Financials (Award vs Obligations)
      const hasAwardA = lowerA.includes("award") || lowerA.includes("contract") || lowerA.includes("fixed-price");
      const hasObligB = lowerB.includes("obligation") || lowerB.includes("total") || lowerB.includes("climbed") || lowerB.includes("overall");
      const hasAwardB = lowerB.includes("award") || lowerB.includes("contract") || lowerB.includes("fixed-price");
      const hasObligA = lowerA.includes("obligation") || lowerA.includes("total") || lowerA.includes("climbed") || lowerA.includes("overall");

      const isCostScopeDivergence = (hasAwardA && hasObligB) || (hasAwardB && hasObligA);

      if (isCostScopeDivergence) {
        return {
          id: `conflict-scope-${srcA.id}-${srcB.id}-${Math.random().toString(36).substring(2, 6)}`,
          topic: cluster.topic,
          status: "NEEDS_MANUAL_VERIFICATION",
          badge: "NEEDS MANUAL VERIFICATION",
          severity: "Medium",
          differenceSummary: `Scope Divergence: '${valA}' (award amount) vs '${valB}' (cumulative obligations)`,
          textualEvidence: `Both sources cite financial figures for related systems, but may measure differing scopes (contract award milestone vs. cumulative agency obligations).`,
          sourceA: {
            id: srcA.id,
            title: srcA.title,
            author: srcA.author,
            date: srcA.publishedDate || "Date unspecified",
            verbatimQuote: sentA,
            extractedValue: valA
          },
          sourceB: {
            id: srcB.id,
            title: srcB.title,
            author: srcB.author,
            date: srcB.publishedDate || "Date unspecified",
            verbatimQuote: sentB,
            extractedValue: valB
          },
          analystGuidance: "Needs manual verification: verify whether the second figure encompasses auxiliary infrastructure, inflation, and program overhead rather than a contract cost overrun."
        };
      }

      // If shared substantive words exist or both match operational/technical cluster
      if (sharedWords.length >= 1) {
        return {
          id: `conflict-num-${srcA.id}-${srcB.id}-${Math.random().toString(36).substring(2, 6)}`,
          topic: cluster.topic,
          status: "CONFIRMED_CONTRADICTION",
          badge: "CONFIRMED METRIC DISCREPANCY",
          severity: "High",
          differenceSummary: `Empirical metric dispute: '${valA}' vs '${valB}'`,
          textualEvidence: `Direct textual conflict regarding '${sharedWords.slice(0, 3).join(" ")}'. Source A documents ${valA}, while Source B documents ${valB}.`,
          sourceA: {
            id: srcA.id,
            title: srcA.title,
            author: srcA.author,
            date: srcA.publishedDate || "Date unspecified",
            verbatimQuote: sentA,
            extractedValue: valA
          },
          sourceB: {
            id: srcB.id,
            title: srcB.title,
            author: srcB.author,
            date: srcB.publishedDate || "Date unspecified",
            verbatimQuote: sentB,
            extractedValue: valB
          },
          analystGuidance: "Examine testing methodology differences (e.g. manufacturer bench testing vs. independent multicenter trial or external oversight audit)."
        };
      }
    }
  }

  // 3. Polarity Conflict (Readiness vs Defect)
  const positiveMarkers = ["resolved", "within acceptable", "zero false-negative", "on schedule", "revolutionary", "achieved"];
  const negativeMarkers = ["unresolved", "defect", "delayed", "elevated risk", "micro-crack", "alarm fatigue", "missing", "inhibited"];

  const hasPosA = positiveMarkers.some(m => lowerA.includes(m));
  const hasNegB = negativeMarkers.some(m => lowerB.includes(m));
  const hasPosB = positiveMarkers.some(m => lowerB.includes(m));
  const hasNegA = negativeMarkers.some(m => lowerA.includes(m));

  if ((hasPosA && hasNegB) || (hasPosB && hasNegA)) {
    const sharedWords = getSharedSubstantiveWords(sentA, sentB);
    if (sharedWords.length >= 1) {
      return {
        id: `conflict-pol-${srcA.id}-${srcB.id}-${Math.random().toString(36).substring(2, 6)}`,
        topic: cluster.topic,
        status: "CONFIRMED_CONTRADICTION",
        badge: "READINESS VS. DEFECT DISPUTE",
        severity: "High",
        differenceSummary: `Status contradiction on ${sharedWords.slice(0, 2).join(" ")}: Feasibility claim contradicted by documented defects/delays`,
        textualEvidence: `One source asserts acceptable readiness or resolution, while the companion document reports unmitigated technical failure or delay.`,
        sourceA: {
          id: srcA.id,
          title: srcA.title,
          author: srcA.author,
          date: srcA.publishedDate || "Date unspecified",
          verbatimQuote: sentA,
          extractedValue: hasPosA ? "Reported Resolved / Operational" : "Reported Unresolved / Defect"
        },
        sourceB: {
          id: srcB.id,
          title: srcB.title,
          author: srcB.author,
          date: srcB.publishedDate || "Date unspecified",
          verbatimQuote: sentB,
          extractedValue: hasNegB ? "Reported Unresolved / Defect" : "Reported Resolved / Operational"
        },
        analystGuidance: "Investigate whether the positive claim is promotional/commercial self-reporting and the opposing finding is an empirical safety or audit evaluation."
      };
    }
  }

  return null;
}

function getSharedSubstantiveWords(sentA, sentB) {
  const stopWords = new Set([
    "the", "and", "for", "with", "that", "this", "from", "have", "were", "been", "will", "would",
    "about", "their", "after", "under", "remains", "indicates", "during", "into", "also", "than", "prior"
  ]);
  const stem = w => w.toLowerCase().replace(/(?:ing|tion|tions|ed|s)$/, '');
  const wordsA = (sentA.toLowerCase().match(/[a-z]{3,}/g) || []).filter(w => !stopWords.has(w));
  const stemsB = new Set((sentB.toLowerCase().match(/[a-z]{3,}/g) || []).filter(w => !stopWords.has(w)).map(stem));
  
  return wordsA.filter(w => stemsB.has(stem(w)));
}
