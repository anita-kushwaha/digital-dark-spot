import React, { useState } from 'react';
import { X, FileDown, Copy, Check, FileText, Code } from 'lucide-react';

export function ExportModal({
  isOpen,
  onClose,
  topic,
  domain,
  sources,
  gaps,
  contradictions,
  temporalDrifts,
  facts,
  checklist
}) {
  const [exportFormat, setExportFormat] = useState("markdown");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate Markdown Dossier
  const generateMarkdown = () => {
    return `# DIGITAL DARK SPOT — INVESTIGATIVE DOSSIER
**Topic:** ${topic || "Untitled Investigation"}
**Domain:** ${domain}
**Generated Date:** ${new Date().toISOString().split('T')[0]}
**Platform:** Digital Dark Spot (AI-Assisted Information Gap Detection)

---

## 1. EXECUTIVE SUMMARY & COVERAGE RADAR
- **Sources Ingested:** ${sources.length}
- **Digital Dark Spots (Unanswered Gaps):** ${gaps.length}
- **Cross-Source Contradictions:** ${contradictions.length}
- **Temporal Obsolescence Alerts:** ${temporalDrifts.length}
- **Direct Source Grounded Facts:** ${facts.length}
- **Actionable Verification Tasks:** ${checklist.length}

---

## 2. INGESTED SOURCE DOCUMENTS
${sources.map((s, idx) => `### Source #${idx + 1}: ${s.title}
- **Publisher / Author:** ${s.author || s.publisher || "Unspecified"}
- **Publication Date:** ${s.publishedDate || "Date unspecified"}
- **Reliability Tier:** ${s.reliabilityTier || "Unrated"}
- **Citation URL:** ${s.url || "None provided"}
> ${s.content}
`).join("\n\n")}

---

## 3. DIGITAL DARK SPOTS (INFORMATION GAPS & UNANSWERED QUESTIONS)
*Notice: These are AI-hypothesized investigative gaps and missing dimensions across all sources.*

${gaps.map((g, idx) => `### Gap #${idx + 1}: ${g.unansweredQuestion}
- **Dimension:** ${g.category}
- **Priority:** ${g.urgency}
- **Why It Matters:** ${g.whyItMatters}
- **Recommended Investigation:** ${g.suggestedInvestigation}
`).join("\n\n")}

---

## 4. CONTRADICTION MATRIX (CROSS-SOURCE DISPUTES)
${contradictions.map((c, idx) => `### Contradiction #${idx + 1}: ${c.differenceSummary}
- **Category:** ${c.category} (${c.topicTag})
- **Severity:** ${c.severity}
- **Source A ("${c.sourceA.title}" - ${c.sourceA.date}):**
  > "${c.sourceA.verbatimQuote}"
  *(Extracted: ${c.sourceA.extractedValue})*
- **Source B ("${c.sourceB.title}" - ${c.sourceB.date}):**
  > "${c.sourceB.verbatimQuote}"
  *(Extracted: ${c.sourceB.extractedValue})*
- **Analyst Guidance:** ${c.analystGuidance}
`).join("\n\n")}

---

## 5. TEMPORAL OBSOLESCENCE & AGING SOURCES
${temporalDrifts.map((t, idx) => `### Alert #${idx + 1}: ${t.sourceTitle} (${t.publishedDate})
- **Staleness Risk:** ${t.stalenessLevel} (${t.ageMonths})
- **Detail:** ${t.detail}
${t.supersededBy ? `- **Superseded By:** "${t.supersededBy.title}" (${t.supersededBy.publishedDate})` : ""}
`).join("\n\n")}

---

## 6. GROUND-TRUTH EVIDENCE SHEET
${facts.map((f, idx) => `* **"${f.statement}"**
  *Citation: ${f.sourceCitation.title} (${f.sourceCitation.author || f.sourceCitation.publisher}, ${f.sourceCitation.publishedDate})*
`).join("\n")}

---

## 7. PRIORITIZED VERIFICATION CHECKLIST
${checklist.map((item, idx) => `[${item.completed ? 'x' : ' '}] **[${item.priority.toUpperCase()}]** ${item.task}
  - Context: ${item.targetEntities}
  - Action: ${item.actionStep}
  ${item.userNote ? `- Notes: ${item.userNote}` : ""}
`).join("\n\n")}
`;
  };

  // Generate JSON Dossier
  const generateJSON = () => {
    return JSON.stringify({
      metadata: {
        platform: "Digital Dark Spot",
        investigationTopic: topic,
        domain,
        exportTimestamp: new Date().toISOString()
      },
      sources,
      darkSpotGaps: gaps,
      contradictions,
      temporalDrifts,
      groundedFacts: facts,
      verificationChecklist: checklist
    }, null, 2);
  };

  const currentContent = exportFormat === "markdown" ? generateMarkdown() : generateJSON();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `digital-dark-spot-${(topic || "investigation").toLowerCase().replace(/[^a-z0-9]/g, '-')}.${exportFormat === 'markdown' ? 'md' : 'json'}`;
    const blob = new Blob([currentContent], {
      type: exportFormat === 'markdown' ? 'text/markdown;charset=utf-8;' : 'application/json;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="glass-panel bg-slate-900 border border-slate-700 w-full max-w-3xl max-h-[85vh] flex flex-col p-6 rounded-2xl shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileDown className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base">Export Investigative Briefing</h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Format toggle */}
            <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setExportFormat("markdown")}
                className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                  exportFormat === "markdown" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Markdown
              </button>
              <button
                onClick={() => setExportFormat("json")}
                className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                  exportFormat === "json" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                JSON
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Preview */}
        <div className="flex-1 my-4 overflow-y-auto bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 leading-relaxed">
          <pre className="whitespace-pre-wrap">{currentContent}</pre>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <span className="text-xs text-slate-500 font-mono">
            {currentContent.length} bytes ready to export
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Content</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Download .{exportFormat === 'markdown' ? 'md' : 'json'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
