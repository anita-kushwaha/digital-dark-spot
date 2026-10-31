/**
 * OPTIONAL GEMINI AI INTEGRATION SERVICE
 * Allows users to optionally provide their own Gemini API key in the UI
 * to run deep semantic gap detection and contradiction analysis.
 * 
 * NOTE: The platform is fully functional offline via the local heuristic engine.
 * The Gemini service acts as an optional enhancement tier.
 */

export async function analyzeWithGemini(topic, sources, apiKey) {
  if (!apiKey || apiKey.trim() === "") {
    throw new Error("No Gemini API key provided. Using built-in local analytical engine instead.");
  }

  const prompt = `You are the core analysis engine for "Digital Dark Spot", an information gap detection platform.
Analyze the following multi-source dossier regarding the topic: "${topic}".

STRICT INVESTIGATIVE RULES:
1. Identify MISSING INFORMATION and UNANSWERED QUESTIONS (the "Digital Dark Spots"). What critical questions does none of the sources answer?
2. Identify CONTRADICTIONS between sources. Where do two sources directly dispute each other (numbers, timelines, feasibility, costs)? Quote exact verbatim sentences from both.
3. Identify OUTDATED INFORMATION. Where has an older source been superseded or made obsolete by a newer source?
4. Clearly distinguish source-supported statements from your own AI-generated gap hypotheses. Do not invent facts or URLs.

Sources provided:
${sources.map((s, idx) => `[Source ${idx + 1}] Title: ${s.title}
Author/Publisher: ${s.author || s.publisher}
Date: ${s.publishedDate || "Unknown"}
URL: ${s.url || "None provided"}
Content:
${s.content}
`).join("\n---\n")}

Respond ONLY with valid JSON in this exact structure:
{
  "darkSpotGaps": [
    {
      "category": "string",
      "urgency": "High" | "Medium",
      "unansweredQuestion": "string",
      "whyItMatters": "string",
      "suggestedInvestigation": "string"
    }
  ],
  "contradictions": [
    {
      "topicTag": "string",
      "differenceSummary": "string",
      "severity": "High" | "Medium",
      "sourceAQuote": "string",
      "sourceATitle": "string",
      "sourceBQuote": "string",
      "sourceBTitle": "string",
      "analystGuidance": "string"
    }
  ],
  "outdatedAlerts": [
    {
      "sourceTitle": "string",
      "staleStatement": "string",
      "reason": "string",
      "newerEvidence": "string"
    }
  ],
  "verificationChecklist": [
    {
      "priority": "High" | "Medium" | "Low",
      "category": "string",
      "task": "string",
      "actionStep": "string"
    }
  ]
}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `API error: HTTP ${response.status}`);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) throw new Error("Empty response received from Gemini API.");

    return JSON.parse(candidateText);
  } catch (err) {
    console.error("Gemini analysis error:", err);
    throw err;
  }
}
