import React from 'react';
import { Clock, Calendar, AlertTriangle, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export function TemporalTab({ temporalDrifts, sources }) {
  if (!sources || sources.length === 0) {
    return (
      <div className="glass-panel p-8 sm:p-12 text-center">
        <Clock className="w-9 h-9 text-slate-600 mx-auto mb-2.5" />
        <h3 className="text-sm font-semibold text-slate-200">No Sources Available</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          Add dated sources to analyze chronological drift and track how assertions change over time.
        </p>
      </div>
    );
  }

  const datedSources = sources.filter(s => s.publishedDate && s.publishedDate.trim().length >= 4);
  const undatedSources = sources.filter(s => !s.publishedDate || s.publishedDate.trim().length < 4);

  const sortedDatedSources = [...datedSources].sort((a, b) => {
    return new Date(a.publishedDate) - new Date(b.publishedDate);
  });

  const documentedDrifts = temporalDrifts.filter(t => t.type === "TEMPORAL_DRIFT");
  const undatedAlerts = temporalDrifts.filter(t => t.type === "UNDATED_SOURCE_ALERT");

  return (
    <div className="space-y-4">
      
      {/* Calm Overview Notice */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 flex items-start gap-3">
        <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="font-semibold text-white">Temporal Drift Analysis: </span>
          <span>
            Tracks how schedules, budget numbers, and readiness claims shift over time between older announcements and newer independent audits.
          </span>
        </div>
      </div>

      {/* Chronological Sequence Bar */}
      <div className="glass-panel p-4 sm:p-5 bg-slate-900/60">
        <div className="flex items-center justify-between mb-3.5">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            Publication Timeline Sequence
          </h4>
          <span className="text-xs text-slate-400 font-mono">
            {datedSources.length} Dated / {undatedSources.length} Undated
          </span>
        </div>

        {sortedDatedSources.length === 0 ? (
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-amber-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>None of the provided sources have publication dates. Edit your sources to enable timeline tracking.</span>
          </div>
        ) : (
          <div className="relative border-l-2 border-slate-700/80 ml-3 sm:ml-4 pl-4 sm:pl-5 space-y-3.5 py-1">
            {sortedDatedSources.map((src, idx) => {
              const isLatest = idx === sortedDatedSources.length - 1;
              return (
                <div key={src.id} className="relative">
                  <div
                    className={`absolute -left-[23px] sm:-left-[27px] top-1 w-3 h-3 rounded-full border-2 ${
                      isLatest
                        ? "bg-emerald-500 border-emerald-300"
                        : "bg-slate-800 border-slate-500"
                    }`}
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono font-medium text-slate-200">
                        {src.publishedDate}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-300 font-medium truncate">{src.title}</span>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded shrink-0 self-start sm:self-auto ${
                        isLatest
                          ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/60"
                          : "bg-slate-800/80 text-slate-400"
                      }`}
                    >
                      {isLatest ? "Latest Finding" : "Prior Baseline"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Undated Alerts */}
      {undatedAlerts.length > 0 && (
        <div className="p-3.5 bg-amber-950/30 border border-amber-600/30 rounded-xl space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Undated Sources Detected ({undatedAlerts.length})</span>
          </div>
          <p className="text-xs text-slate-300">
            The following documents lack publication dates and cannot be positioned chronologically:
          </p>
          <ul className="text-xs text-amber-300/90 list-disc list-inside space-y-0.5">
            {undatedAlerts.map(a => (
              <li key={a.id} className="truncate">
                <strong>{a.sourceTitle}</strong> — {a.guidance}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Documented Drift Cards */}
      <div className="space-y-4">
        {documentedDrifts.length === 0 ? (
          <div className="glass-card p-6 text-center text-xs text-slate-400">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <p className="font-semibold text-slate-200">No Significant Temporal Changes Identified</p>
            <p className="mt-1">
              {datedSources.length < 2 
                ? "At least 2 dated sources are required to compare claims across time." 
                : "The dated sources do not exhibit significant timeline slippage or superseded milestones on the same subjects."}
            </p>
          </div>
        ) : (
          documentedDrifts.map((alert) => (
            <div
              key={alert.id}
              className="glass-card p-4 sm:p-5 border-amber-900/40 bg-slate-900/70"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-700/50">
                    {alert.badge}
                  </span>
                  <span className="text-xs font-medium text-slate-300">
                    {alert.topic}
                  </span>
                </div>

                <span className="text-[10px] font-mono text-slate-400">
                  {alert.timeElapsed}
                </span>
              </div>

              {/* Summary */}
              <h4 className="text-sm font-semibold text-white mb-2">
                Timeline Shift: <span className="text-amber-200">{alert.issueSummary}</span>
              </h4>

              <p className="text-xs text-slate-300 mb-3 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed">
                <strong className="text-amber-300">What Changed: </strong>
                {alert.whatChanged}
              </p>

              {/* Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                {/* Earlier */}
                <div className="bg-slate-950/80 border border-slate-800/90 rounded-lg p-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-medium text-slate-300">Earlier Baseline</span>
                    <span className="font-mono text-slate-400">{alert.earlierSource?.date}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200 mb-1.5 line-clamp-1">
                    {alert.earlierSource?.title}
                  </div>
                  <blockquote className="text-xs text-slate-400 italic border-l-2 border-slate-600 pl-2 py-0.5">
                    "{alert.earlierSource?.claimQuote}"
                  </blockquote>
                </div>

                {/* Later */}
                <div className="bg-slate-950/80 border border-amber-600/30 rounded-lg p-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-medium text-amber-300">Updated Finding (Superseding)</span>
                    <span className="font-mono text-amber-300">{alert.laterSource?.date}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200 mb-1.5 line-clamp-1">
                    {alert.laterSource?.title}
                  </div>
                  <blockquote className="text-xs text-slate-300 italic border-l-2 border-amber-500 pl-2 py-0.5">
                    "{alert.laterSource?.claimQuote}"
                  </blockquote>
                </div>
              </div>

              {/* Recommendation */}
              <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400 flex items-start gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-300">Recommendation: </strong>
                  {alert.guidance}
                </span>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
