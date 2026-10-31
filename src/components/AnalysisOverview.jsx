import React from 'react';
import { EyeOff, AlertTriangle, Clock, ShieldCheck, CheckSquare, Sparkles, RefreshCw } from 'lucide-react';

export function AnalysisOverview({
  activeTab,
  onTabChange,
  gapsCount,
  contradictionsCount,
  outdatedCount,
  factsCount,
  checklistTotal,
  checklistCompleted,
  onRunAnalysis,
  isAnalyzing
}) {
  // Information Coverage Index calculation
  // Total dimensions covered vs dark spots
  const totalSignals = gapsCount + contradictionsCount + outdatedCount + factsCount;
  const coverageScore = totalSignals > 0 ? Math.round((factsCount / totalSignals) * 100) : 0;
  const darkSpotRiskScore = 100 - coverageScore;

  const tabs = [
    {
      id: "gaps",
      label: "Digital Dark Spots",
      count: gapsCount,
      icon: EyeOff,
      color: "text-purple-400",
      activeBg: "bg-purple-950/70 border-purple-500/60 text-purple-200",
      badge: "badge-gap",
      subtext: "Missing information & unanswered questions"
    },
    {
      id: "contradictions",
      label: "Contradiction Matrix",
      count: contradictionsCount,
      icon: AlertTriangle,
      color: "text-rose-400",
      activeBg: "bg-rose-950/70 border-rose-500/60 text-rose-200",
      badge: "badge-conflict",
      subtext: "Side-by-side claim discrepancies"
    },
    {
      id: "temporal",
      label: "Temporal Drift",
      count: outdatedCount,
      icon: Clock,
      color: "text-amber-400",
      activeBg: "bg-amber-950/70 border-amber-500/60 text-amber-200",
      badge: "badge-outdated",
      subtext: "Potentially outdated or superseded info"
    },
    {
      id: "facts",
      label: "Source Evidence",
      count: factsCount,
      icon: ShieldCheck,
      color: "text-emerald-400",
      activeBg: "bg-emerald-950/70 border-emerald-500/60 text-emerald-200",
      badge: "badge-fact",
      subtext: "Direct grounded facts with citations"
    },
    {
      id: "checklist",
      label: "Verification Checklist",
      count: `${checklistCompleted}/${checklistTotal}`,
      icon: CheckSquare,
      color: "text-sky-400",
      activeBg: "bg-sky-950/70 border-sky-500/60 text-sky-200",
      badge: "badge-sample",
      subtext: "Prioritized investigative next steps"
    }
  ];

  return (
    <div className="mb-6">
      
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                isActive
                  ? `${tab.activeBg} shadow-lg ring-1 ring-white/10`
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-4 h-4 ${tab.color}`} />
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-800">
                  {tab.count}
                </span>
              </div>
              <h3 className="text-xs font-bold tracking-tight text-white line-clamp-1">
                {tab.label}
              </h3>
              <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                {tab.subtext}
              </p>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-80" />
              )}
            </button>
          );
        })}
      </div>

      {/* Analytical Banner / Re-run Bar */}
      <div className="glass-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-slate-900/40">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-purple-300 bg-purple-950/60 px-2.5 py-1 rounded-md border border-purple-800/60">
            <EyeOff className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-semibold">Dark Spot Vulnerability:</span>
            <span className="font-mono font-bold text-white">{darkSpotRiskScore}%</span>
          </div>

          <span className="text-slate-500 hidden md:inline">|</span>

          <span className="text-slate-400 hidden md:inline">
            All AI-generated questions and gap hypotheses are distinctly flagged to prevent hallucination.
          </span>
        </div>

        <button
          onClick={onRunAnalysis}
          disabled={isAnalyzing}
          className="btn-primary text-xs py-1.5 px-3 shrink-0 flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? "Scanning Dossier..." : "Re-Run Analysis Engine"}</span>
        </button>
      </div>

    </div>
  );
}
