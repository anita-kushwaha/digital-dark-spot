import React from 'react';
import { Search, AlertCircle, Sparkles, RefreshCw, Layers } from 'lucide-react';

const DOMAIN_OPTIONS = [
  "Aerospace & Defense",
  "Healthcare & Clinical AI",
  "Clean Energy & DeepTech",
  "Geopolitics & Defense",
  "Corporate & Financial Oversight",
  "General Investigative Analysis"
];

export function TopicHeader({
  topic,
  onTopicChange,
  domain,
  onDomainChange,
  isSample,
  sampleBadgeText,
  onReset,
  sampleScenarios,
  onSelectSample
}) {
  return (
    <div className="glass-panel p-5 sm:p-6 mb-6">
      
      {/* Sample Data Alert Banner */}
      {isSample && (
        <div className="mb-4 flex items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2.5 text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong className="font-semibold text-amber-200">SAMPLE DATASET LOADED:</strong> This dossier uses pre-constructed demonstration sources. Real-world investigations allow you to paste any custom documents below.
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-900/60 text-amber-200 border border-amber-600/40">
            {sampleBadgeText || "SAMPLE DATA"}
          </span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Topic Input Field */}
        <div className="flex-1">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-indigo-400" />
            Investigative Topic / Target Subject
          </label>
          <div className="relative">
            <input
              type="text"
              value={topic}
              onChange={(e) => onTopicChange(e.target.value)}
              placeholder="e.g. Artemis III Lunar Landing Schedule & SpaceX HLS Budget..."
              className="input-base w-full text-base sm:text-lg font-medium pr-10 bg-slate-900/90 text-white placeholder-slate-500 border-slate-700/80 focus:border-indigo-500"
            />
            {topic && (
              <button
                onClick={() => onTopicChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs px-1.5 py-0.5 rounded"
                title="Clear topic"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Domain Selector & Actions */}
        <div className="flex flex-wrap sm:flex-nowrap items-end gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Domain Focus
            </label>
            <select
              value={domain}
              onChange={(e) => onDomainChange(e.target.value)}
              className="input-base text-xs py-2 px-3 bg-slate-900 text-slate-200 border-slate-700 cursor-pointer min-w-[200px]"
            >
              {DOMAIN_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onReset}
            className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 h-[38px] text-slate-400 hover:text-rose-300"
            title="Clear all sources and start a blank investigation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

      </div>

      {/* Preset Quick-Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Try Demonstration Scenarios:
        </span>
        {sampleScenarios.map((sc) => (
          <button
            key={sc.id}
            onClick={() => onSelectSample(sc.id)}
            className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800/70 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 transition-all"
          >
            {sc.title.split(":")[0]}
          </button>
        ))}
      </div>

    </div>
  );
}
