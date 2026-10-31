import React from 'react';
import { Clock, Calendar, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

export function TemporalTab({ temporalDrifts, sources }) {
  if (!sources || sources.length === 0) {
    return (
      <div className="glass-panel p-10 text-center">
        <Clock className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-200">No Sources to Analyze</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          Add dated sources to analyze chronological drift and detect superseded statements.
        </p>
      </div>
    );
  }

  // Chronological timeline of sources
  const sortedSources = [...sources].sort((a, b) => {
    return new Date(a.publishedDate || "2000-01-01") - new Date(b.publishedDate || "2000-01-01");
  });

  return (
    <div className="space-y-5">
      
      {/* Notice Banner */}
      <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
        <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200 leading-relaxed">
          <strong className="font-semibold text-white">TEMPORAL DRIFT & OBSOLESCENCE RADAR:</strong>
          <p className="text-amber-300 mt-0.5">
            Information decays rapidly. When citing older press releases or preliminary specs, claims are frequently superseded by newer audits or delays.
            Below is the chronological publication timeline and specific obsolescence alerts.
          </p>
        </div>
      </div>

      {/* Publication Chronology Bar */}
      <div className="glass-panel p-5 bg-slate-900/60">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-indigo-400" />
          Publication Timeline Sequence
        </h4>

        <div className="relative border-l-2 border-slate-700 ml-3 sm:ml-4 pl-4 sm:pl-6 space-y-4">
          {sortedSources.map((src, idx) => {
            const isLatest = idx === sortedSources.length - 1;
            return (
              <div key={src.id} className="relative group">
                {/* Node circle */}
                <div
                  className={`absolute -left-[23px] sm:-left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 ${
                    isLatest
                      ? "bg-emerald-500 border-emerald-300 ring-4 ring-emerald-500/20"
                      : "bg-slate-800 border-slate-500"
                  }`}
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-200">
                      {src.publishedDate || "Undated"}
                    </span>
                    <span className="text-slate-400 font-semibold">•</span>
                    <span className="text-slate-300 font-medium line-clamp-1">{src.title}</span>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      isLatest
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-700"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {isLatest ? "Most Recent Evidence" : "Prior Baseline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Staleness Alerts */}
      <div className="space-y-4">
        {temporalDrifts.length === 0 ? (
          <div className="glass-card p-6 text-center text-xs text-slate-400">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <p className="font-semibold text-slate-200">No Significant Temporal Gaps Found</p>
            <p className="mt-1">All ingested sources were published in close proximity or lack conflicting dates.</p>
          </div>
        ) : (
          temporalDrifts.map((alert, idx) => (
            <div
              key={alert.id || idx}
              className="glass-card p-5 border-amber-900/40 bg-slate-900/80"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                    {alert.badge || "TEMPORAL OBSOLESCENCE ALERT"}
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    {alert.ageMonths}
                  </span>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-700/60">
                  {alert.stalenessLevel} Staleness Risk
                </span>
              </div>

              <h4 className="text-sm font-bold text-white mb-2">
                Aging Source: <span className="text-amber-200">"{alert.sourceTitle}"</span> ({alert.publishedDate})
              </h4>

              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 mb-3 space-y-2">
                <p>
                  <strong className="text-amber-300">Obsolescence Detail: </strong>
                  {alert.detail}
                </p>

                {alert.quote && (
                  <blockquote className="text-xs text-slate-400 italic border-l-2 border-amber-500/60 pl-3 py-1 bg-amber-950/10">
                    "{alert.quote}"
                  </blockquote>
                )}
              </div>

              {alert.supersededBy && (
                <div className="flex items-start gap-2 text-xs text-emerald-300 bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-800/40">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold text-emerald-200">Superseded By Newer Source: </strong>
                    <span>"{alert.supersededBy.title}" published on {alert.supersededBy.publishedDate}. Always prioritize this newer evidence.</span>
                  </div>
                </div>
              )}

            </div>
          ))
        )}
      </div>

    </div>
  );
}
