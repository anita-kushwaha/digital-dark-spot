import React, { useState } from 'react';
import { X, FileDown, Copy, Check, FileText, Code, Clock } from 'lucide-react';

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

  const exportTimestamp = new Date().toLocaleString(undefined, {
    dateStyle: "full",
    timeStyle: "long"
  });

  // Generate Comprehensive Markdown Dossier
  const generateMarkdown = () => {
    return `# DIGITAL DARK SPOT â€” INVESTIGATIVE BRIEFING DOSSIER
**Platform:** Truthora — AI-Assisted Information Gap Detection Platform  
**Investigation Topic:** ${topic || "General Investigative Analysis"}  
**Domain Focus:** ${domain || "General"}  
**Export Timestamp:** ${exportTimestamp}  

---

## 1. EXECUTIVE SUMMARY & COVERAGE METRICS
* **Total Sources Ingested:** ${sources.length} (${sources.filter(s => s.isUserSource).length} User-Provided, ${sources.filter(s => s.isSample).length} Sample Data)
* **Digital Dark Spots (Unanswered Questions):** ${gaps.length}
* **Cross-Source Contradictions & Scope Divergences:** ${contradictions.length}
* **Temporal Drift & Timeline Shifts:** ${temporalDrifts.filter(t => t.type === 'TEMPORAL_DRIFT').length}
* **Grounded Source Facts Extracted:** ${facts.length}
* **Actionable Verification Tasks:** ${checklist.filter(c => c.completed).length} of ${checklist.length} Completed (${checklist.length > 0 ? Math.round((checklist.filter(c => c.completed).length / checklist.length) * 100) : 0}%)

---

## 2. INGESTED SOURCE DOCUMENTS
${sources.length === 0 ? "_No source documents supplied._" : sources.map((s, idx) => `### Source #${idx + 1}: ${s.title}
* **Source Type:** ${s.isUserSource ? "[USER-PROVIDED DOCUMENT]" : "[SAMPLE DEMO SOURCE]"}
* **Publisher / Organization:** ${s.publisher || "Unspecified"}
* **Author / Attribution:** ${s.author || "Uncredited"}
* **Publication Date:** ${s.publishedDate || "Date unspecified (Undated source)"}
* **Reliability Tier:** ${s.reliabilityTier || "Unrated"}
* **Citation Link:** ${s.url ? s.url : "No URL provided (Offline text)"}
> ${s.content}
`).join("\n\n")}

---

## 3. DIGITAL DARK SPOTS (INFORMATION GAPS & UNANSWERED QUESTIONS)
*Notice: These items represent unaddressed dimensions, missing evidence, or unanswered operational questions across all supplied sources.*

${gaps.length === 0 ? "_No critical information gaps identified._" : gaps.map((g, idx) => `### Gap #${idx + 1}: "${g.unansweredQuestion}"
* **Dimension / Category:** ${g.category}
* **Urgency Priority:** ${g.urgency}
* **Why this is an Information Gap:** ${g.whyItMatters}
* **Evidence Status:** ${g.evidenceSummary}
${g.supportingEvidenceSnippet ? `* **Partial Evidence Mention:** ${g.supportingEvidenceSnippet}` : ""}
* **Recommended Next Step:** ${g.suggestedInvestigation}
`).join("\n\n")}

---

## 4. CONTRADICTION MATRIX & CROSS-SOURCE COMPARISONS
${contradictions.length === 0 ? "_No cross-source discrepancies identified._" : contradictions.map((c, idx) => `### Comparison #${idx + 1}: ${c.differenceSummary}
* **Topic Classification:** ${c.topic}
* **Finding Status:** ${c.status === 'CONFIRMED_CONTRADICTION' ? 'CONFIRMED CONTRADICTION' : 'NEEDS MANUAL VERIFICATION'} (${c.severity} Urgency)
* **Textual Evidence:** ${c.textualEvidence}
* **Source A ("${c.sourceA.title}" - ${c.sourceA.date}):**
  > "${c.sourceA.verbatimQuote}"
  *(Extracted Value: ${c.sourceA.extractedValue})*
* **Source B ("${c.sourceB.title}" - ${c.sourceB.date}):**
  > "${c.sourceB.verbatimQuote}"
  *(Extracted Value: ${c.sourceB.extractedValue})*
* **Analyst Verification Guidance:** ${c.analystGuidance}
`).join("\n\n")}

---

## 5. TEMPORAL DRIFT & TIMELINE PROGRESSION
${temporalDrifts.length === 0 ? "_No significant temporal drift detected._" : temporalDrifts.map((t, idx) => `### Temporal Item #${idx + 1}: ${t.issueSummary}
* **Category:** ${t.topic}
* **Status:** ${t.status}
${t.timeElapsed ? `* **Time Elapsed:** ${t.timeElapsed}` : ""}
* **What Changed:** ${t.whatChanged}
${t.earlierSource ? `* Earlier Baseline (${t.earlierSource.date} - "${t.earlierSource.title}"): "${t.earlierSource.claimQuote}"` : ""}
${t.laterSource ? `* Later Finding (${t.laterSource.date} - "${t.laterSource.title}"): "${t.laterSource.claimQuote}"` : ""}
* **Guidance:** ${t.guidance}
`).join("\n\n")}

---

## 6. GROUNDED SOURCE EVIDENCE & FINDINGS
${facts.length === 0 ? "_No grounded facts extracted._" : facts.map((f, idx) => `* **"${f.statement}"**
  * **Finding Supported:** ${f.supportedFinding}
  * **Citation:** ${f.sourceCitation.title} (${f.sourceCitation.author || f.sourceCitation.publisher}, ${f.sourceCitation.publishedDate || "Undated"})${f.sourceCitation.url ? ` <${f.sourceCitation.url}>` : ' [No URL]'}
`).join("\n")}

---

## 7. PRIORITIZED VERIFICATION CHECKLIST
${checklist.length === 0 ? "_No pending verification tasks._" : checklist.map((item, idx) => `* [${item.completed ? 'X' : ' '}] **[${item.priority.toUpperCase()}]** ${item.task}
  * **Target Context:** ${item.targetEntities}
  * **Action Step:** ${item.actionStep}
  ${item.userNote ? `* **Analyst Note:** ${item.userNote}` : ""}
`).join("\n\n")}

---

## 8. LIMITATIONS & INVESTIGATIVE CAVEATS
1. **Absence of Evidence vs. Evidence of Absence:** An identified "Digital Dark Spot" indicates that the supplied text did not provide sufficient answers. It does not prove that the underlying system or organization lacks this capability in unpublished records.
2. **Context & Scope Nuance:** Discrepancies flagged as "Needs Manual Verification" often involve differing accounting frameworks, measurement methodologies, or timeline definitions rather than deliberate deceit.
3. **Temporal Freshness:** Analysis is strictly bound to the publication timestamps provided in the source documents. If dates are omitted or inaccurate, chronological sequence cannot be guaranteed.
4. **Human Verification Requirement:** Truthora is designed to assist and direct investigative inquiry, not replace primary document auditing and subject matter expert review.
`;
  };

  // Generate Structured JSON Dossier
  const generateJSON = () => {
    return JSON.stringify({
      metadata: {
        platform: "Truthora",
        investigationTopic: topic,
        domain,
        exportTimestamp,
        engineMode: "Deterministic Heuristic Engine"
      },
      summary: {
        totalSources: sources.length,
        userSourcesCount: sources.filter(s => s.isUserSource).length,
        sampleSourcesCount: sources.filter(s => s.isSample).length,
        darkSpotGapsCount: gaps.length,
        contradictionsCount: contradictions.length,
        temporalDriftsCount: temporalDrifts.length,
        groundedFactsCount: facts.length,
        checklistCompleted: checklist.filter(c => c.completed).length,
        checklistTotal: checklist.length
      },
      sources,
      darkSpotGaps: gaps,
      contradictions,
      temporalDrifts,
      groundedFacts: facts,
      verificationChecklist: checklist,
      limitations: [
        "Identified gaps reflect omissions within the supplied documents only.",
        "Scope differences in financial or technical metrics require manual audit verification.",
        "Chronological tracking depends strictly on accurate source publication timestamps."
      ]
    }, null, 2);
  };

  const currentContent = exportFormat === "markdown" ? generateMarkdown() : generateJSON();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const safeTopic = (topic || "investigation").toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 32);
    const dateStamp = new Date().toISOString().split('T')[0];
    const filename = `digital-dark-spot-${safeTopic}-${dateStamp}.${exportFormat === 'markdown' ? 'md' : 'json'}`;
    
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
          <div>
            <div className="flex items-center gap-2">
              <FileDown className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-white text-base">Export Investigative Briefing</h3>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1 font-mono">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{exportTimestamp}</span>
            </div>
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
