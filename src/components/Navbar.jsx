import React from 'react';
import { ShieldAlert, Compass, Settings, FileDown, Sparkles, Database } from 'lucide-react';

export function Navbar({ onSelectSample, onOpenSettings, onOpenExport, isAiActive, sampleScenarios, currentScenarioId }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Concept */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-400 shadow-lg shadow-indigo-500/10">
            <Compass className="w-5 h-5 animate-pulse text-indigo-400" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">Digital Dark Spot</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-mono font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-800">
                v1.0 Hackathon
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              AI-Assisted Information Gap & Contradiction Detection Platform
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Sample Dataset Loader Dropdown */}
          <div className="relative flex items-center">
            <select
              value={currentScenarioId || ""}
              onChange={(e) => {
                if (e.target.value) onSelectSample(e.target.value);
              }}
              className="text-xs bg-amber-950/40 border border-amber-700/60 text-amber-300 font-medium rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer appearance-none"
              title="Select a pre-loaded sample dataset"
            >
              <option value="" disabled>Load Sample Dataset...</option>
              {sampleScenarios.map((sc) => (
                <option key={sc.id} value={sc.id} className="bg-slate-900 text-slate-200">
                  [SAMPLE] {sc.title.substring(0, 36)}...
                </option>
              ))}
            </select>
            <Database className="w-3.5 h-3.5 text-amber-400 absolute right-2.5 pointer-events-none" />
          </div>

          {/* AI Status Badge */}
          <button
            onClick={onOpenSettings}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
              isAiActive 
                ? 'bg-purple-950/50 border-purple-500/50 text-purple-300 hover:bg-purple-900/50' 
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
            title="Configure optional Gemini API Key"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAiActive ? 'text-purple-400 animate-spin' : 'text-slate-400'}`} />
            <span className="hidden md:inline">{isAiActive ? 'Gemini 1.5 Active' : 'Offline Engine'}</span>
            <Settings className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {/* Export Briefing Report */}
          <button
            onClick={onOpenExport}
            className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
            title="Export investigative dossier to Markdown or JSON"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-300" />
            <span className="hidden sm:inline">Export Report</span>
          </button>

        </div>
      </div>
    </header>
  );
}
