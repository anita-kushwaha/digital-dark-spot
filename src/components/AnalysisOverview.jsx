import React from 'react';
import { EyeOff, AlertTriangle, Clock, ShieldCheck, CheckSquare, RefreshCw, Cpu, Sparkles } from 'lucide-react';

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
  isAnalyzing,
  isAiActive,
  sourcesCount
}) {
  const totalSignals = gapsCount + contradictionsCount + outdatedCount + factsCount;
  const coverageScore = totalSignals > 0 ? Math.round((factsCount / totalSignals) * 100) : 0;
  const darkSpotRiskScore = 100 - coverageScore;

  const tabs = [
    {
      id: "gaps",
      label: "Digital Dark Spots",
      shortLabel: "Dark Spots",
      count: gapsCount,
      icon: EyeOff
    },
    {
      id: "contradictions",
      label: "Contradiction Matrix",
      shortLabel: "Contradictions",
      count: contradictionsCount,
      icon: AlertTriangle
    },
    {
      id: "temporal",
      label: "Temporal Drift",
      shortLabel: "Temporal Drift",
      count: outdatedCount,
      icon: Clock
    },
    {
      id: "facts",
      label: "Source Evidence",
      shortLabel: "Evidence Sheet",
      count: factsCount,
      icon: ShieldCheck
    },
    {
      id: "checklist",
      label: "Verification Checklist",
      shortLabel: "Checklist",
      count: `${checklistCompleted}/${checklistTotal}`,
      icon: CheckSquare
    }
  ];

  return (
    <div className="mb-8 space-y-3.5">
      
      {/* Insufficient Dataset Guidance (<2 sources) */}
      {sourcesCount < 2 && (
        <div className="bg-amber-950/30 border border-amber-600/30 rounded-xl p-3.5 text-xs text-amber-200 flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Comparative Analysis Note:</strong> Ingest at least <strong>two sources</strong> to cross-examine claims and track temporal changes across documents.
          </span>
        </div>
      )}

      {/* Clear, High-Contrast Tab Bar */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs transition-all shrink-0 border ${
                isActive
                  ? 'bg-indigo-600 border-indigo-500 text-white font-semibold shadow-sm'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 font-medium'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="whitespace-nowrap">{tab.label}</span>
              <span className={`font-mono text-[11px] px-2 py-0.5 rounded-full ${
                isActive 
                  ? 'bg-white/20 text-white font-bold' 
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Understated Status & Re-Run Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-2.5 bg-slate-900/50 border border-slate-800/80 rounded-xl text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-purple-300 font-medium">
            <EyeOff className="w-3.5 h-3.5 text-purple-400" />
            <span>Dark Spot Vulnerability:</span>
            <span className="font-mono font-bold text-white">{darkSpotRiskScore}%</span>
          </div>

          <span className="text-slate-600 hidden md:inline">•</span>

          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            {isAiActive ? (
              <>
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span className="text-purple-300 font-medium">Gemini 1.5 Active</span>
              </>
            ) : (
              <>
                <Cpu className="w-3 h-3 text-indigo-400" />
                <span>Deterministic Offline Engine</span>
              </>
            )}
          </div>
        </div>

        <button
          onClick={onRunAnalysis}
          disabled={isAnalyzing}
          className="btn-secondary text-xs h-8 px-3.5 self-end sm:self-auto shrink-0 flex items-center gap-1.5"
          title="Re-run analytical detection on current sources"
        >
          <RefreshCw className={`w-3 h-3 ${isAnalyzing ? 'animate-spin text-indigo-400' : ''}`} />
          <span>{isAnalyzing ? "Processing..." : "Re-Run Analysis"}</span>
        </button>
      </div>

    </div>
  );
}
