import React from 'react';
import { Search, AlertCircle, Sparkles, RotateCcw } from 'lucide-react';

const DOMAIN_OPTIONS = [
  "Aerospace & Defense",
  "Healthcare & Clinical AI",
  "Clean Energy & DeepTech",
  "Corporate & Financial Oversight",
  "Public Policy & Regulations",
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
    <div className="glass-panel p-4 sm:p-5 mb-6">
      
      {/* Sample Data Alert - Understated & Clean */}
      {isSample && (
        <div className="mb-3.5 flex items-center justify-between bg-amber-950/30 border border-amber-600/30 rounded-lg px-3 py-1.5 text-xs text-amber-200">
          <div className="flex items-center gap-2 truncate">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">
              <strong className="font-semibold text-amber-100">Sample Dataset:</strong> Pre-loaded for demonstration. You can edit, add, or replace with custom sources below.
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-amber-900/40 text-amber-300 shrink-0 ml-2">
            {sampleBadgeText || "DEMO DATA"}
          </span>
        </div>
      )}

      {/* Unified Search & Domain Command Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        
        {/* Topic Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            placeholder="Enter research topic or subject to investigate..."
            className="input-base w-full pl-9 pr-8 h-10 text-sm bg-slate-900/90 text-slate-100 border-slate-700/80 focus:border-indigo-500"
          />
          {topic && (
            <button
              onClick={() => onTopicChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs p-1"
              title="Clear topic"
            >
              ✕
            </button>
          )}
        </div>

        {/* Domain Selector */}
        <div className="sm:w-56 shrink-0">
          <select
            value={domain}
            onChange={(e) => onDomainChange(e.target.value)}
            className="input-base w-full h-10 text-xs bg-slate-900 text-slate-200 border-slate-700/80 cursor-pointer"
            title="Investigation Domain"
          >
            {DOMAIN_OPTIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Compact Reset Button */}
        <button
          onClick={onReset}
          className="btn-secondary h-10 px-3 text-xs text-slate-400 hover:text-rose-300 shrink-0 flex items-center justify-center gap-1.5"
          title="Reset to a blank investigation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Reset</span>
        </button>

      </div>

      {/* Demonstration Scenarios Pills */}
      <div className="mt-3 pt-3 border-t border-slate-800/60 flex flex-wrap items-center gap-2">
        <span className="text-[11px] text-slate-400 font-medium mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          Try Scenarios:
        </span>
        {sampleScenarios.map((sc) => (
          <button
            key={sc.id}
            onClick={() => onSelectSample(sc.id)}
            className="text-[11px] px-2.5 py-1 rounded-md bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
          >
            {sc.title.split(":")[0]}
          </button>
        ))}
      </div>

    </div>
  );
}
