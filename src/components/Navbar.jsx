import React from 'react';
import { Compass, Settings, FileDown, Sparkles, Database, ChevronDown } from 'lucide-react';

export function Navbar({ onSelectSample, onOpenSettings, onOpenExport, isAiActive, sampleScenarios, currentScenarioId }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between gap-4">
        
        {/* Brand & Compact Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-500/30 text-indigo-400 shrink-0">
            <Compass className="w-4 h-4 text-indigo-400" />
          </div>

          <div className="flex items-baseline gap-2.5">
            <span className="font-bold text-base tracking-tight text-white">Digital Dark Spot</span>
            <span className="text-xs text-slate-400 hidden md:inline font-normal">
              AI-Assisted Information Gap Detection
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          
          {/* Preset Scenario Selector */}
          <div className="relative flex items-center">
            <select
              value={currentScenarioId || ""}
              onChange={(e) => {
                if (e.target.value) onSelectSample(e.target.value);
              }}
              className="text-xs bg-slate-900 border border-slate-700/80 text-slate-200 font-medium rounded-lg pl-2.5 pr-7 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none max-w-[170px] sm:max-w-[220px] truncate"
              title="Load a demonstration dataset"
            >
              <option value="" disabled>Load Demo Scenario...</option>
              {sampleScenarios.map((sc) => (
                <option key={sc.id} value={sc.id} className="bg-slate-900 text-slate-200">
                  {sc.title.split(":")[0]}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
          </div>

          {/* Engine Mode Pill */}
          <button
            onClick={onOpenSettings}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isAiActive 
                ? 'bg-purple-950/60 border-purple-500/40 text-purple-300 hover:bg-purple-900/40' 
                : 'bg-slate-900 border-slate-700/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Configure optional Gemini API Key"
          >
            {isAiActive ? (
              <Sparkles className="w-3 h-3 text-purple-400" />
            ) : (
              <Settings className="w-3 h-3 text-slate-400" />
            )}
            <span className="hidden sm:inline">{isAiActive ? 'Gemini 1.5' : 'Offline'}</span>
          </button>

          {/* Prominent Export Report Button */}
          <button
            onClick={onOpenExport}
            className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 shadow-sm"
            title="Export investigative dossier"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>

        </div>
      </div>
    </header>
  );
}
