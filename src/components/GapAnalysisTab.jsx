import React from 'react';
import { EyeOff, AlertCircle, HelpCircle, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

export function GapAnalysisTab({ gaps, topic }) {
  if (!gaps || gaps.length === 0) {
    return (
      <div className="glass-panel p-10 text-center">
        <EyeOff className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-200">No Information Gaps Detected</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          The ingested sources appear to cover major core dimensions. Ingest more documents or add specific queries to find subtle blind spots.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* Integrity Disclaimer Banner */}
      <div className="bg-purple-950/40 border border-purple-500/30 rounded-xl p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div className="text-xs text-purple-200 leading-relaxed">
          <strong className="font-semibold text-white">WHAT IS A DIGITAL DARK SPOT?</strong>
          <p className="text-purple-300 mt-0.5">
            A "Digital Dark Spot" represents critical information, edge cases, or failure modes that are completely missing across all ingested sources.
            Items below are <span className="underline font-semibold text-white">AI-hypothesized investigative questions</span> designed to direct human inquiry, not verified facts.
          </p>
        </div>
      </div>

      {/* Grid of Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gaps.map((gap, idx) => (
          <div
            key={gap.id || idx}
            className="glass-card p-5 border-purple-900/40 bg-slate-900/80 hover:border-purple-500/50 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Top Tag & Urgency */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                  {gap.badge || "AI HYPOTHESIZED GAP"}
                </span>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    gap.urgency === "High"
                      ? "bg-rose-950/80 text-rose-300 border border-rose-700/60"
                      : "bg-amber-950/80 text-amber-300 border border-amber-700/60"
                  }`}
                >
                  {gap.urgency} Priority Blind Spot
                </span>
              </div>

              {/* Category */}
              <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                {gap.category}
              </div>

              {/* The Unanswered Question */}
              <h4 className="text-sm sm:text-base font-bold text-white mb-2 leading-snug">
                "{gap.unansweredQuestion}"
              </h4>

              {/* Why It Matters */}
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3 text-xs text-slate-300 mb-3 space-y-1.5">
                <div>
                  <strong className="text-purple-300 font-semibold">Why this is a blind spot: </strong>
                  <span>{gap.whyItMatters}</span>
                </div>
                {gap.aiRationale && (
                  <div className="text-slate-400 text-[11px] pt-1.5 border-t border-slate-800/60">
                    <strong className="text-slate-300">Evidence Audit: </strong>
                    <span>{gap.aiRationale}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Suggested Action */}
            <div className="pt-3 border-t border-slate-800/80">
              <div className="flex items-start gap-2 text-xs text-sky-300">
                <ArrowRight className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-sky-200">Recommended Investigation: </strong>
                  <span>{gap.suggestedInvestigation}</span>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
