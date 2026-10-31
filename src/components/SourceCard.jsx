import React, { useState } from 'react';
import { FileText, Calendar, ExternalLink, Trash2, Edit3, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

export function SourceCard({ source, index, onEdit, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const wordCount = source.content ? source.content.trim().split(/\s+/).length : 0;
  const charCount = source.content ? source.content.length : 0;

  // Reliability colors
  const getTierColor = (tier) => {
    if (!tier) return "bg-slate-800 text-slate-300 border-slate-700";
    const lower = tier.toLowerCase();
    if (lower.includes("audit") || lower.includes("peer-reviewed") || lower.includes("official")) {
      return "bg-emerald-950/60 text-emerald-300 border-emerald-700/50";
    }
    if (lower.includes("commercial") || lower.includes("self-reported")) {
      return "bg-amber-950/60 text-amber-300 border-amber-700/50";
    }
    return "bg-indigo-950/60 text-indigo-300 border-indigo-700/50";
  };

  return (
    <div className="glass-card p-4 sm:p-5 flex flex-col justify-between border-slate-800 bg-slate-900/60">
      <div>
        
        {/* Header with Source # and Actions */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-950 text-indigo-400 font-mono text-xs font-bold border border-indigo-800/80">
              #{index + 1}
            </span>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${getTierColor(source.reliabilityTier)}`}>
              <ShieldCheck className="w-3 h-3 inline mr-1 -mt-0.5" />
              {source.reliabilityTier || "Unrated Source"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(source)}
              className="p-1 text-slate-400 hover:text-indigo-400 rounded hover:bg-slate-800 transition-colors"
              title="Edit source details"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(source.id)}
              className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
              title="Delete source"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-slate-100 text-sm sm:text-base leading-snug mb-2 line-clamp-2">
          {source.title || "Untitled Source Document"}
        </h3>

        {/* Metadata info */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mb-3">
          {source.publishedDate && (
            <span className="flex items-center gap-1 font-mono text-slate-300">
              <Calendar className="w-3 h-3 text-indigo-400" />
              {source.publishedDate}
            </span>
          )}
          {source.author && (
            <span className="text-slate-400">
              by <strong className="text-slate-300 font-normal">{source.author}</strong>
            </span>
          )}
          {source.publisher && source.publisher !== source.author && (
            <span className="text-slate-500">
              ({source.publisher})
            </span>
          )}
        </div>

        {/* Source Text Snippet */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-md p-3 text-xs text-slate-300 leading-relaxed font-sans mb-3">
          <p className={isExpanded ? "" : "line-clamp-3"}>
            {source.content || <em className="text-slate-500">No text provided.</em>}
          </p>
        </div>

      </div>

      {/* Footer controls: URL link + Word count + Expand toggle */}
      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="font-mono">{wordCount} words</span>
          {source.url ? (
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-indigo-400 hover:underline hover:text-indigo-300"
            >
              <ExternalLink className="w-3 h-3" />
              Citation
            </a>
          ) : (
            <span className="text-slate-600">No URL</span>
          )}
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
        >
          {isExpanded ? (
            <>
              Less <ChevronUp className="w-3 h-3" />
            </>
          ) : (
            <>
              Expand <ChevronDown className="w-3 h-3" />
            </>
          )}
        </button>
      </div>

    </div>
  );
}
