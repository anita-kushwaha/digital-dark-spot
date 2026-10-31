import React, { useState } from 'react';
import { Calendar, ExternalLink, Trash2, Edit3, ChevronDown, ChevronUp, UserCheck, AlertCircle } from 'lucide-react';

export function SourceCard({ source, index, onEdit, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const wordCount = source.content ? source.content.trim().split(/\s+/).length : 0;
  const isUserSource = Boolean(source.isUserSource);

  // Clean, muted tier badges
  const getTierBadge = (tier) => {
    if (!tier) return "bg-slate-800 text-slate-300 border-slate-700";
    const lower = tier.toLowerCase();
    if (lower.includes("audit") || lower.includes("peer-reviewed") || lower.includes("official")) {
      return "bg-emerald-950/40 text-emerald-300 border-emerald-800/50";
    }
    if (lower.includes("commercial") || lower.includes("self-reported")) {
      return "bg-amber-950/40 text-amber-300 border-amber-800/50";
    }
    return "bg-slate-800 text-slate-300 border-slate-700";
  };

  return (
    <div className={`glass-card p-5 h-full flex flex-col justify-between transition-colors ${
      isUserSource ? 'border-sky-500/30 bg-slate-900/90' : 'border-slate-800/90 bg-slate-900/60'
    }`}>
      <div>
        
        {/* Top Metadata Strip */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="flex items-center justify-center w-5 h-5 rounded bg-slate-800 text-slate-300 font-mono text-xs font-semibold">
              #{index + 1}
            </span>

            {/* Source Origin Badge */}
            {isUserSource ? (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-sky-950/70 text-sky-300 border border-sky-600/40 flex items-center gap-1">
                <UserCheck className="w-3 h-3" />
                User Document
              </span>
            ) : (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-950/50 text-amber-300 border border-amber-700/40">
                Sample Source
              </span>
            )}

            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getTierBadge(source.reliabilityTier)}`}>
              {source.reliabilityTier || "Unrated"}
            </span>
          </div>

          {/* Edit / Delete Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(source)}
              className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800 transition-colors"
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

        {/* Author & Date Metadata */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mb-3">
          {source.publishedDate ? (
            <span className="flex items-center gap-1 font-mono text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {source.publishedDate}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-400/80 font-mono text-[11px]">
              <AlertCircle className="w-3.5 h-3.5" />
              Undated
            </span>
          )}

          {source.author ? (
            <span className="truncate max-w-[220px]">
              by <span className="text-slate-300 font-medium">{source.author}</span>
            </span>
          ) : (
            <span className="text-slate-500 italic">Author uncredited</span>
          )}

          {source.publisher && source.publisher !== source.author && (
            <span className="text-slate-500 truncate max-w-[160px]">
              ({source.publisher})
            </span>
          )}
        </div>

        {/* Readable Preview with Clear Expand/Collapse */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 text-xs text-slate-300 leading-relaxed mb-3">
          <p className={isExpanded ? "" : "line-clamp-2"}>
            {source.content || <em className="text-slate-500">No text provided.</em>}
          </p>
          {source.content && source.content.length > 140 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              {isExpanded ? (
                <>Show less <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>Read full excerpt ({wordCount} words) <ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          )}
        </div>

      </div>

      {/* Footer Controls */}
      <div className="pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <span className="font-mono">{wordCount} words</span>
        {source.url ? (
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-indigo-400 hover:underline hover:text-indigo-300 font-medium"
            title={source.url}
          >
            <ExternalLink className="w-3 h-3" />
            Verified Link
          </a>
        ) : (
          <span className="text-slate-500 italic">Offline document</span>
        )}
      </div>

    </div>
  );
}
