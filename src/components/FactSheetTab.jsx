import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, ExternalLink, Calendar, User, BookOpen, AlertCircle, Search, UserCheck } from 'lucide-react';

export function FactSheetTab({ facts, sourcesCount }) {
  const [copiedId, setCopiedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCopy = (fact) => {
    const citation = `"${fact.statement}" — Source: ${fact.sourceCitation.title} (${fact.sourceCitation.author || fact.sourceCitation.publisher}, ${fact.sourceCitation.publishedDate || "n.d."})${fact.sourceCitation.url ? ` <${fact.sourceCitation.url}>` : ''}`;
    navigator.clipboard.writeText(citation);
    setCopiedId(fact.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredFacts = (facts || []).filter(f => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return f.statement.toLowerCase().includes(q) ||
           f.supportedFinding.toLowerCase().includes(q) ||
           f.sourceCitation.title.toLowerCase().includes(q);
  });

  if (!facts || facts.length === 0) {
    return (
      <div className="glass-panel p-8 sm:p-12 text-center">
        <BookOpen className="w-9 h-9 text-slate-600 mx-auto mb-2.5" />
        <h3 className="text-sm font-semibold text-slate-200">No Grounded Facts Extracted</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          {sourcesCount === 0
            ? "Add sources containing factual assertions, numerical measurements, or official milestones to extract evidence."
            : "The provided source texts did not contain specific measurable claims or milestone metrics."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* Calm Overview Notice */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="font-semibold text-white">Grounded Source Evidence: </span>
          <span>
            Verbatim factual statements extracted directly from the supplied documents, paired with the specific finding supported by that text.
          </span>
        </div>
      </div>

      {/* Integrated Search Bar */}
      <div className="flex items-center justify-between gap-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search evidence or sources..."
            className="input-base w-full pl-8 py-1.5 text-xs bg-slate-950 border-slate-800 text-slate-200"
          />
        </div>
        <span className="font-mono text-slate-400 text-xs shrink-0">
          {filteredFacts.length} of {facts.length} Facts
        </span>
      </div>

      {/* Spacious 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {filteredFacts.map((fact, idx) => {
          const { isUrlProvided, isDateProvided, isAuthorProvided } = fact.metadataIntegrity || {};
          const isUser = fact.sourceCitation.isUserSource;

          return (
            <div
              key={fact.id || idx}
              className="glass-card p-4 sm:p-5 flex flex-col justify-between border-slate-800 hover:border-slate-700"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
                      SOURCE EVIDENCE
                    </span>
                    {isUser ? (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-sky-950/60 text-sky-300 border border-sky-800/60 flex items-center gap-1">
                        <UserCheck className="w-3 h-3" />
                        User Source
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400">
                        Demo Data
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono">
                    Grounded Citation
                  </span>
                </div>

                {/* Verbatim Fact Statement */}
                <blockquote className="text-sm font-medium text-slate-100 mb-3 leading-relaxed italic border-l-2 border-emerald-500/70 pl-3 py-0.5 bg-emerald-950/10 rounded-r">
                  "{fact.statement}"
                </blockquote>

                {/* Specific Finding Supported By This Text */}
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-2.5 text-xs text-slate-300 mb-3">
                  <span className="text-emerald-300 font-medium block mb-0.5">
                    💡 Supported Finding:
                  </span>
                  <span className="text-slate-200">{fact.supportedFinding}</span>
                </div>
              </div>

              {/* Citation Footer */}
              <div className="pt-2.5 border-t border-slate-800/80 mt-1">
                <div className="text-xs text-slate-200 font-semibold mb-1 line-clamp-1" title={fact.sourceCitation.title}>
                  {fact.sourceCitation.title}
                </div>

                {/* Missing Details Warning */}
                {(!isUrlProvided || !isDateProvided || !isAuthorProvided) && (
                  <div className="mb-2 flex flex-wrap items-center gap-1 text-[10px] text-amber-400">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>Missing: </span>
                    {!isUrlProvided && <span className="bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-800/40">No URL</span>}
                    {!isDateProvided && <span className="bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-800/40">No Date</span>}
                    {!isAuthorProvided && <span className="bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-800/40">No Author</span>}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                  <div className="flex items-center gap-3 truncate">
                    {fact.sourceCitation.author ? (
                      <span className="flex items-center gap-1 truncate max-w-[150px]">
                        <User className="w-3 h-3 text-slate-500" />
                        {fact.sourceCitation.author}
                      </span>
                    ) : (
                      <span className="text-slate-500 italic">Uncredited</span>
                    )}

                    {fact.sourceCitation.publishedDate ? (
                      <span className="flex items-center gap-1 font-mono text-slate-400">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {fact.sourceCitation.publishedDate}
                      </span>
                    ) : (
                      <span className="text-slate-500 italic">Undated</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {fact.sourceCitation.url ? (
                      <a
                        href={fact.sourceCitation.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1"
                        title={fact.sourceCitation.url}
                      >
                        <ExternalLink className="w-3 h-3" />
                        Link
                      </a>
                    ) : (
                      <span className="text-slate-500 italic">Offline</span>
                    )}
                    
                    <button
                      onClick={() => handleCopy(fact)}
                      className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors flex items-center gap-1 text-[10px]"
                      title="Copy citation"
                    >
                      {copiedId === fact.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Cite</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
