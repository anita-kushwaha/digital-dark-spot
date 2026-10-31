import React, { useState } from 'react';
import { Plus, Database, FileText, X, Check, AlertTriangle, Filter, UserCheck, BookOpen } from 'lucide-react';
import { SourceCard } from './SourceCard';

const RELIABILITY_TIERS = [
  "Official Agency (Primary Source)",
  "Peer-Reviewed Academic Journal",
  "Independent Audit (Oversight Body)",
  "Investigative Journalism / Major Press",
  "Commercial Vendor (Self-Reported)",
  "Industry Analysis / Market Report",
  "Unverified Public Forum / Social"
];

export function SourceManager({ sources, onAddSource, onUpdateSource, onDeleteSource }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSource, setEditingSource] = useState(null);
  const [filterType, setFilterType] = useState("ALL"); // ALL, USER, SAMPLE

  // Form State
  const [title, setTitle] = useState("");
  const [publisher, setPublisher] = useState("");
  const [author, setAuthor] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [url, setUrl] = useState("");
  const [reliabilityTier, setReliabilityTier] = useState(RELIABILITY_TIERS[0]);
  const [content, setContent] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const userSourcesCount = sources.filter(s => s.isUserSource).length;
  const sampleSourcesCount = sources.filter(s => s.isSample).length;

  const resetForm = () => {
    setTitle("");
    setPublisher("");
    setAuthor("");
    setPublishedDate("");
    setUrl("");
    setReliabilityTier(RELIABILITY_TIERS[0]);
    setContent("");
    setErrorMsg("");
    setEditingSource(null);
    setIsFormOpen(false);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (src) => {
    setEditingSource(src);
    setTitle(src.title || "");
    setPublisher(src.publisher || "");
    setAuthor(src.author || "");
    setPublishedDate(src.publishedDate || "");
    setUrl(src.url || "");
    setReliabilityTier(src.reliabilityTier || RELIABILITY_TIERS[0]);
    setContent(src.content || "");
    setErrorMsg("");
    setIsFormOpen(true);
  };

  const validateUrl = (testUrl) => {
    if (!testUrl || testUrl.trim() === "") return true;
    const trimmed = testUrl.trim();
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      return false;
    }
    try {
      new URL(trimmed);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!title.trim() || title.trim().length < 3) {
      setErrorMsg("Please enter a descriptive document title (at least 3 characters).");
      return;
    }

    if (!content.trim() || content.trim().length < 20) {
      setErrorMsg("Please provide substantive source text to analyze (at least 20 characters).");
      return;
    }

    if (url.trim() && !validateUrl(url)) {
      setErrorMsg("Invalid URL format. Please enter a valid URL starting with http:// or https:// (or leave blank if offline).");
      return;
    }

    const payload = {
      id: editingSource ? editingSource.id : `src-user-${Date.now()}`,
      title: title.trim(),
      publisher: publisher.trim() || author.trim() || "Independent Source",
      author: author.trim() || publisher.trim() || "Staff / Author Uncredited",
      publishedDate: publishedDate || "",
      url: url.trim() || "",
      reliabilityTier,
      content: content.trim(),
      isUserSource: editingSource ? editingSource.isUserSource : true,
      isSample: editingSource ? editingSource.isSample : false
    };

    if (editingSource) {
      onUpdateSource(payload);
    } else {
      onAddSource(payload);
    }

    resetForm();
  };

  const filteredSources = sources.filter(s => {
    if (filterType === "USER") return s.isUserSource;
    if (filterType === "SAMPLE") return s.isSample;
    return true;
  });

  return (
    <section className="glass-panel p-4 sm:p-5 mb-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Source Ingestion & Management
            </h2>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {sources.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Ingest articles, reports, or transcripts to cross-examine claims and surface dark spots.
          </p>
        </div>

        {!isFormOpen && (
          <button
            onClick={handleOpenAdd}
            className="btn-primary text-xs py-1.5 px-3 self-start sm:self-auto shrink-0 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Source</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      {sources.length > 0 && (
        <div className="flex items-center gap-1.5 mb-4 text-xs border-b border-slate-800 pb-2.5 overflow-x-auto">
          <span className="text-slate-400 font-medium mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" />
            Filter:
          </span>
          <button
            onClick={() => setFilterType("ALL")}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
              filterType === "ALL" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            All Sources ({sources.length})
          </button>
          <button
            onClick={() => setFilterType("USER")}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0 flex items-center gap-1 ${
              filterType === "USER" ? "bg-sky-900/80 text-sky-200" : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <UserCheck className="w-3 h-3" />
            User-Provided ({userSourcesCount})
          </button>
          <button
            onClick={() => setFilterType("SAMPLE")}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0 flex items-center gap-1 ${
              filterType === "SAMPLE" ? "bg-amber-900/80 text-amber-200" : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <BookOpen className="w-3 h-3" />
            Demo Data ({sampleSourcesCount})
          </button>
        </div>
      )}

      {/* Add / Edit Form Accordion */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-700/80 rounded-xl p-4 sm:p-5 mb-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              {editingSource ? "Edit Source Document" : "Ingest New Document"}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 bg-rose-950/50 border border-rose-600/40 rounded-lg p-2.5 text-xs text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Document Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. GAO-24-106256 Schedule Assessment"
                className="input-base w-full text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Publisher / Organization
              </label>
              <input
                type="text"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                placeholder="e.g. U.S. Government Accountability Office"
                className="input-base w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Author / Lead Analyst
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Dr. Jane Smith"
                className="input-base w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Publication Date
              </label>
              <input
                type="date"
                value={publishedDate}
                onChange={(e) => setPublishedDate(e.target.value)}
                className="input-base w-full text-xs text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Citation Link / URL (Optional)
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/report"
                className="input-base w-full text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Source Credibility Tier
              </label>
              <select
                value={reliabilityTier}
                onChange={(e) => setReliabilityTier(e.target.value)}
                className="input-base w-full text-xs bg-slate-900 text-slate-200"
              >
                {RELIABILITY_TIERS.map((tier) => (
                  <option key={tier} value={tier}>
                    {tier}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
              <span>Source Text / Excerpt *</span>
              <span className="text-[11px] font-mono text-slate-400">
                {content.length} chars
              </span>
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste the source text, interview quotes, or technical statements..."
              className="input-base w-full text-xs font-sans leading-relaxed resize-y"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={resetForm}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary text-xs py-1.5 px-3.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{editingSource ? "Update Source" : "Save Document"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Responsive Grid: 2 Columns on Desktop */}
      {filteredSources.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
          <Database className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-300">
            {filterType === "ALL" ? "No Sources Ingested" : `No ${filterType === "USER" ? "User-Provided" : "Sample"} Sources`}
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-0.5 mb-3">
            Add at least two sources or select a pre-loaded sample dataset above.
          </p>
          {filterType === "ALL" && (
            <button
              onClick={handleOpenAdd}
              className="btn-primary text-xs py-1.5 px-3 mx-auto flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add First Source</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredSources.map((src, index) => (
            <SourceCard
              key={src.id}
              source={src}
              index={index}
              onEdit={handleOpenEdit}
              onDelete={onDeleteSource}
            />
          ))}
        </div>
      )}

    </section>
  );
}
