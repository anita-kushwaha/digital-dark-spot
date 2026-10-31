import React, { useState } from 'react';
import { X, Sparkles, Key, Check, AlertCircle, ShieldCheck } from 'lucide-react';

export function ApiSettingsModal({ isOpen, onClose, apiKey, onSaveKey }) {
  const [keyInput, setKeyInput] = useState(apiKey || "");
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveKey(keyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    setKeyInput("");
    onSaveKey("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel bg-slate-900 border border-slate-700 w-full max-w-lg p-6 rounded-2xl shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-950/80 border border-purple-500/40 text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">AI Engine Configuration</h3>
              <p className="text-xs text-slate-400">Optional Gemini API Integration</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational callout */}
        <div className="mb-4 bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-300 space-y-2">
          <div className="flex items-start gap-2 text-indigo-300">
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>
              <strong>Zero-Setup Guarantee:</strong> Digital Dark Spot includes a complete built-in heuristic analysis engine that works 100% offline without any API key or subscription.
            </span>
          </div>
          <div className="flex items-start gap-2 text-purple-300 pt-2 border-t border-slate-800/80">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <span>
              Adding a Gemini API key is completely optional and enables deep semantic reasoning to find subtle narrative discrepancies.
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                Gemini API Key (Optional)
              </span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-indigo-400 hover:underline"
              >
                Get a free key from Google AI Studio ↗
              </a>
            </label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="input-base w-full text-xs font-mono"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Stored securely in your local browser storage. Never transmitted to third-party tracking servers.
            </span>
          </div>

          {savedSuccess && (
            <div className="bg-emerald-950/60 border border-emerald-600/50 rounded-lg p-2.5 text-xs text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>Settings updated successfully!</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            {apiKey ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-rose-400 hover:underline"
              >
                Disconnect API Key
              </button>
            ) : <span />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary text-xs py-2 px-3"
              >
                Close
              </button>
              <button
                type="submit"
                className="btn-primary text-xs py-2 px-4"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
