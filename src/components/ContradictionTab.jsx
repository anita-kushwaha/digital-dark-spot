import React from 'react';
import { AlertTriangle, GitCompare, Calendar, ArrowRightLeft, ShieldAlert } from 'lucide-react';

export function ContradictionTab({ contradictions }) {
  if (!contradictions || contradictions.length === 0) {
    return (
      <div className="glass-panel p-10 text-center">
        <GitCompare className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-200">No Direct Contradictions Identified</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          The ingested sources either agree on core metrics or discuss non-overlapping dimensions. Ingesting opposing perspectives or audit reviews will surface conflicting assertions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* Overview Notice */}
      <div className="bg-rose-950/40 border border-rose-500/30 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div className="text-xs text-rose-200 leading-relaxed">
          <strong className="font-semibold text-white">CROSS-SOURCE CLAIM DISCREPANCIES DETECTED:</strong>
          <p className="text-rose-300 mt-0.5">
            The engine detected {contradictions.length} direct conflict{contradictions.length > 1 ? 's' : ''} in numbers, timelines, or feasibility status between sources.
            Below are the verbatim citations extracted directly from each document.
          </p>
        </div>
      </div>

      {/* Contradiction Cards */}
      <div className="space-y-4">
        {contradictions.map((conflict, idx) => (
          <div
            key={conflict.id || idx}
            className="glass-card p-5 border-rose-900/40 bg-slate-900/80"
          >
            {/* Header / Conflict Tag */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
                  {conflict.category || "Cross-Source Dispute"}
                </span>
                <span className="text-xs font-semibold text-slate-300">
                  {conflict.topicTag}
                </span>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-700/60">
                {conflict.severity || "High"} Severity Conflict
              </span>
            </div>

            {/* Summary of Dispute */}
            <h4 className="text-sm font-bold text-white mb-4">
              Discrepancy: <span className="text-rose-300">{conflict.differenceSummary}</span>
            </h4>

            {/* Side-by-Side Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
              
              {/* Source A Column */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span className="font-semibold text-indigo-300">Source A</span>
                    <span className="font-mono text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {conflict.sourceA.date || "Date unspecified"}
                    </span>
                  </div>

                  <h5 className="font-bold text-slate-200 text-xs mb-2 line-clamp-1" title={conflict.sourceA.title}>
                    {conflict.sourceA.title}
                  </h5>

                  <blockquote className="text-xs text-slate-300 italic border-l-2 border-indigo-500 pl-3 py-1 my-2 bg-indigo-950/20 rounded-r">
                    "{conflict.sourceA.verbatimQuote}"
                  </blockquote>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] flex items-center justify-between text-slate-400">
                  <span>Extracted Claim:</span>
                  <span className="font-mono font-bold text-indigo-300 px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-800/50">
                    {conflict.sourceA.extractedValue}
                  </span>
                </div>
              </div>

              {/* Source B Column */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span className="font-semibold text-rose-300">Source B</span>
                    <span className="font-mono text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {conflict.sourceB.date || "Date unspecified"}
                    </span>
                  </div>

                  <h5 className="font-bold text-slate-200 text-xs mb-2 line-clamp-1" title={conflict.sourceB.title}>
                    {conflict.sourceB.title}
                  </h5>

                  <blockquote className="text-xs text-slate-300 italic border-l-2 border-rose-500 pl-3 py-1 my-2 bg-rose-950/20 rounded-r">
                    "{conflict.sourceB.verbatimQuote}"
                  </blockquote>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] flex items-center justify-between text-slate-400">
                  <span>Extracted Claim:</span>
                  <span className="font-mono font-bold text-rose-300 px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800/50">
                    {conflict.sourceB.extractedValue}
                  </span>
                </div>
              </div>

            </div>

            {/* Analyst Guidance Note */}
            {conflict.analystGuidance && (
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-300 flex items-start gap-2 bg-slate-950/40 p-3 rounded-lg">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-200">Investigative Guidance: </strong>
                  <span>{conflict.analystGuidance}</span>
                </div>
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  );
}
