import React from 'react';
import { EyeOff, AlertCircle, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';

export function GapAnalysisTab({ gaps, topic, sourcesCount }) {
  if (!gaps || gaps.length === 0) {
    return (
      <div className="glass-panel p-8 sm:p-12 text-center">
        <CheckCircle2 className="w-9 h-9 text-emerald-500 mx-auto mb-2.5" />
        <h3 className="text-sm font-semibold text-slate-200">No Critical Gaps Detected</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          {sourcesCount < 2 
            ? "At least 2 sources are needed to detect multi-source coverage gaps and blind spots." 
            : "The ingested sources provide adequate coverage across key operational dimensions."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* Calm Briefing Note */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 flex items-start gap-3">
        <EyeOff className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="font-semibold text-white">Digital Dark Spots: </span>
          <span>
            These represent operational dimensions, boundary conditions, or failure modes insufficiently addressed across the supplied documents.
          </span>
        </div>
      </div>

      {/* Spacious 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {gaps.map((gap, idx) => (
          <div
            key={gap.id || idx}
            className="glass-card p-4 sm:p-5 flex flex-col justify-between border-slate-800 hover:border-slate-700"
          >
            <div>
              {/* Category & Urgency */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  {gap.category}
                </span>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    gap.urgency === "High"
                      ? "bg-rose-950/60 text-rose-300 border-rose-800/60"
                      : "bg-amber-950/60 text-amber-300 border-amber-800/60"
                  }`}
                >
                  {gap.urgency} Priority Gap
                </span>
              </div>

              {/* The Unanswered Question */}
              <h4 className="text-sm font-semibold text-white mb-2 leading-snug">
                "{gap.unansweredQuestion}"
              </h4>

              {/* Why It Matters */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 text-xs text-slate-300 mb-3 space-y-2">
                <div>
                  <span className="text-purple-300 font-medium">Why this is an information gap: </span>
                  <span className="text-slate-300">{gap.whyItMatters}</span>
                </div>

                {/* Evidence Status Callout */}
                <div className="pt-2 border-t border-slate-800/60">
                  {gap.evidenceStatus === "missing" ? (
                    <div className="flex items-start gap-1.5 text-rose-300/90 text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-rose-200">Evidence Status: </strong>
                        {gap.evidenceSummary || "No supporting evidence found in any supplied source."}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1 text-[11px]">
                      <div className="flex items-start gap-1.5 text-amber-300/90">
                        <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-amber-200">Partial Mention: </strong>
                          {gap.evidenceSummary}
                        </span>
                      </div>
                      {gap.supportingEvidenceSnippet && (
                        <blockquote className="text-slate-400 italic pl-2.5 border-l-2 border-amber-500/40 py-0.5 mt-1 text-[11px]">
                          {gap.supportingEvidenceSnippet}
                        </blockquote>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recommended Next Step */}
            <div className="pt-2.5 border-t border-slate-800/80 flex items-start gap-1.5 text-xs text-sky-300">
              <ArrowRight className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-sky-200">Recommended Action: </span>
                <span className="text-slate-300">{gap.suggestedInvestigation}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
