import React, { useState } from 'react';
import { AlertTriangle, Calendar, ShieldAlert, CheckCircle2, Filter } from 'lucide-react';

export function ContradictionTab({ contradictions, sourcesCount }) {
  const [filter, setFilter] = useState("ALL");

  if (!contradictions || contradictions.length === 0) {
    return (
      <div className="glass-panel p-8 sm:p-12 text-center">
        <CheckCircle2 className="w-9 h-9 text-emerald-500 mx-auto mb-2.5" />
        <h3 className="text-sm font-semibold text-slate-200">No Direct Contradictions Identified</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          {sourcesCount < 2 
            ? "At least 2 sources are required to cross-examine claims and detect contradictions."
            : "The supplied sources do not directly conflict on numerical values, timelines, or feasibility status."}
        </p>
      </div>
    );
  }

  const confirmedCount = contradictions.filter(c => c.status === "CONFIRMED_CONTRADICTION").length;
  const manualCount = contradictions.filter(c => c.status === "NEEDS_MANUAL_VERIFICATION").length;

  const filteredItems = contradictions.filter(c => {
    if (filter === "CONFIRMED") return c.status === "CONFIRMED_CONTRADICTION";
    if (filter === "MANUAL") return c.status === "NEEDS_MANUAL_VERIFICATION";
    return true;
  });

  return (
    <div className="space-y-4">
      
      {/* Calm Overview Notice */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="font-semibold text-white">Cross-Source Claim Discrepancies: </span>
          <span>
            {contradictions.length} comparison finding{contradictions.length > 1 ? 's' : ''} detected. Confirmed contradictions represent direct empirical clashes; scope divergences are flagged for manual verification.
          </span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center gap-1.5 text-xs border-b border-slate-800 pb-2.5 overflow-x-auto">
        <span className="text-slate-400 font-medium mr-1 shrink-0 flex items-center gap-1">
          <Filter className="w-3 h-3 text-slate-400" />
          Filter:
        </span>
        <button
          onClick={() => setFilter("ALL")}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
            filter === "ALL" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          All Items ({contradictions.length})
        </button>
        <button
          onClick={() => setFilter("CONFIRMED")}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
            filter === "CONFIRMED" ? "bg-rose-950/80 text-rose-300 border border-rose-800/60" : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          Confirmed Discrepancies ({confirmedCount})
        </button>
        <button
          onClick={() => setFilter("MANUAL")}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
            filter === "MANUAL" ? "bg-amber-950/80 text-amber-300 border border-amber-800/60" : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          Needs Verification ({manualCount})
        </button>
      </div>

      {/* Contradiction Cards */}
      <div className="space-y-4">
        {filteredItems.map((conflict, idx) => {
          const isManual = conflict.status === "NEEDS_MANUAL_VERIFICATION";
          return (
            <div
              key={conflict.id || idx}
              className={`glass-card p-4 sm:p-5 border ${
                isManual ? 'border-amber-900/40 bg-slate-900/70' : 'border-rose-900/40 bg-slate-900/70'
              }`}
            >
              {/* Header Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 pb-2.5 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    isManual 
                      ? 'bg-amber-950/60 text-amber-300 border-amber-700/50' 
                      : 'bg-rose-950/60 text-rose-300 border-rose-700/50'
                  }`}>
                    {isManual ? "MANUAL SCOPE VERIFICATION" : "CONFIRMED DISCREPANCY"}
                  </span>
                  <span className="text-xs font-medium text-slate-300">
                    {conflict.topic}
                  </span>
                </div>

                <span className="text-[10px] font-mono text-slate-400">
                  {conflict.severity || "High"} Priority
                </span>
              </div>

              {/* Title Summary */}
              <h4 className="text-sm font-semibold text-white mb-2">
                Finding: <span className={isManual ? "text-amber-200" : "text-rose-200"}>{conflict.differenceSummary}</span>
              </h4>

              {/* Textual Evidence Explanation */}
              {conflict.textualEvidence && (
                <p className="text-xs text-slate-300 mb-3 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed">
                  <strong className="text-slate-200">Textual Evidence: </strong>
                  {conflict.textualEvidence}
                </p>
              )}

              {/* Side-by-Side Comparison Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-3">
                
                {/* Source A */}
                <div className="bg-slate-950/80 border border-slate-800/90 rounded-lg p-3.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                      <span className="font-medium text-indigo-300">Source A</span>
                      <span className="font-mono text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {conflict.sourceA.date || "Undated"}
                      </span>
                    </div>

                    <h5 className="font-semibold text-slate-200 text-xs mb-2 line-clamp-1" title={conflict.sourceA.title}>
                      {conflict.sourceA.title}
                    </h5>

                    <blockquote className="text-xs text-slate-300 italic border-l-2 border-indigo-500/70 pl-2.5 py-0.5 bg-indigo-950/10 rounded-r">
                      "{conflict.sourceA.verbatimQuote}"
                    </blockquote>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/70 text-[11px] flex items-center justify-between text-slate-400">
                    <span>Extracted:</span>
                    <span className="font-mono font-semibold text-indigo-300 px-1.5 py-0.5 rounded bg-indigo-950/60">
                      {conflict.sourceA.extractedValue}
                    </span>
                  </div>
                </div>

                {/* Source B */}
                <div className="bg-slate-950/80 border border-slate-800/90 rounded-lg p-3.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                      <span className={`font-medium ${isManual ? 'text-amber-300' : 'text-rose-300'}`}>Source B</span>
                      <span className="font-mono text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {conflict.sourceB.date || "Undated"}
                      </span>
                    </div>

                    <h5 className="font-semibold text-slate-200 text-xs mb-2 line-clamp-1" title={conflict.sourceB.title}>
                      {conflict.sourceB.title}
                    </h5>

                    <blockquote className={`text-xs text-slate-300 italic border-l-2 pl-2.5 py-0.5 rounded-r ${
                      isManual 
                        ? 'border-amber-500/70 bg-amber-950/10' 
                        : 'border-rose-500/70 bg-rose-950/10'
                    }`}>
                      "{conflict.sourceB.verbatimQuote}"
                    </blockquote>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/70 text-[11px] flex items-center justify-between text-slate-400">
                    <span>Extracted:</span>
                    <span className={`font-mono font-semibold px-1.5 py-0.5 rounded ${
                      isManual 
                        ? 'text-amber-300 bg-amber-950/60' 
                        : 'text-rose-300 bg-rose-950/60'
                    }`}>
                      {conflict.sourceB.extractedValue}
                    </span>
                  </div>
                </div>

              </div>

              {/* Analyst Guidance */}
              {conflict.analystGuidance && (
                <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-300 flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-lg">
                  <ShieldAlert className={`w-4 h-4 shrink-0 mt-0.5 ${isManual ? 'text-amber-400' : 'text-rose-400'}`} />
                  <div>
                    <strong className={isManual ? "text-amber-200" : "text-rose-200"}>
                      {isManual ? "Verification Guidance: " : "Analyst Guidance: "}
                    </strong>
                    <span className="text-slate-300">{conflict.analystGuidance}</span>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
