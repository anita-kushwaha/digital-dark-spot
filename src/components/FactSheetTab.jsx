import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, ExternalLink, Calendar, User, BookOpen } from 'lucide-react';

export function FactSheetTab({ facts }) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (fact) => {
    const citation = `"${fact.statement}" — Source: ${fact.sourceCitation.title} (${fact.sourceCitation.author || fact.sourceCitation.publisher}, ${fact.sourceCitation.publishedDate || "n.d."})`;
    navigator.clipboard.writeText(citation);
    setCopiedId(fact.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!facts || facts.length === 0) {
    return (
      <div className="glass-panel p-10 text-center">
        <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-200">No Grounded Facts Extracted</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          Add sources containing factual assertions, numerical measurements, or official milestones to build the evidence sheet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* Evidence Integrity Banner */}
      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-200 leading-relaxed">
          <strong className="font-semibold text-white">GROUNDED SOURCE EVIDENCE:</strong>
          <p className="text-emerald-300 mt-0.5">
            Every entry below is extracted directly from the provided source text and attributed to its primary document.
            These statements reflect what the sources state; contrast them with the <strong className="text-white">Contradictions</strong> and <strong className="text-white">Dark Spots</strong> tabs.
          </p>
        </div>
      </div>

      {/* Facts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {facts.map((fact, idx) => (
          <div
            key={fact.id || idx}
            className="glass-card p-5 border-emerald-900/30 bg-slate-900/70 hover:border-emerald-600/40 flex flex-col justify-between"
          >
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {fact.badge || "SOURCE EVIDENCE"}
                </span>
                <span className="text-[10px] text-emerald-400/80 font-mono">
                  {fact.verificationStatus}
                </span>
              </div>

              {/* Verbatim Fact Statement */}
              <p className="text-sm font-medium text-slate-100 mb-3 leading-relaxed">
                "{fact.statement}"
              </p>
            </div>

            {/* Citation Box */}
            <div className="pt-3 border-t border-slate-800/80 mt-2 bg-slate-950/60 -mx-5 -mb-5 p-4 rounded-b-lg">
              <div className="text-xs text-slate-300 font-semibold mb-1 line-clamp-1" title={fact.sourceCitation.title}>
                {fact.sourceCitation.title}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-3">
                  {fact.sourceCitation.author && (
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-500" />
                      {fact.sourceCitation.author}
                    </span>
                  )}
                  {fact.sourceCitation.publishedDate && (
                    <span className="flex items-center gap-1 font-mono text-slate-400">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {fact.sourceCitation.publishedDate}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {fact.sourceCitation.url && (
                    <a
                      href={fact.sourceCitation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Link
                    </a>
                  )}
                  
                  <button
                    onClick={() => handleCopy(fact)}
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors flex items-center gap-1 text-[10px]"
                    title="Copy formal citation to clipboard"
                  >
                    {copiedId === fact.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Cite</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
