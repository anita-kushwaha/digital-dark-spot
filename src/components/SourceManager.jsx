import React, { useState } from 'react';
import { Plus, Database, FileText, X, Check, AlertTriangle } from 'lucide-react';
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
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [title, setTitle] = useState("");
  const [publisher, setPublisher] = useState("");
  const [author, setAuthor] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [url, setUrl] = useState("");
  const [reliabilityTier, setReliabilityTier] = useState(RELIABILITY_TIERS[0]);
  const [content, setContent] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const resetForm = () => {
    setTitle("");
    setPublisher("");
    setAuthor("");
    setPublishedDate("");
    setUrl("");
    setReliabilityTier(RELIABILITY_TIERS[0]);
    setContent("");
    setErrorMsg("");
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (src) => {
    setEditingId(src.id);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg("Please provide a title for the source document.");
      return;
    }
    if (!content.trim()) {
      setErrorMsg("Please paste or write the source text/excerpt to analyze.");
      return;
    }

    const payload = {
      id: editingId || `src-user-${Date.now()}`,
      title: title.trim(),
      publisher: publisher.trim() || author.trim() || "Independent Source",
      author: author.trim() || publisher.trim() || "Staff / Author Uncredited",
      publishedDate: publishedDate || "",
      url: url.trim() || "",
      reliabilityTier,
      content: content.trim()
    };

    if (editingId) {
      onUpdateSource(payload);
    } else {
      onAddSource(payload);
    }

    resetForm();
  };

  return (
    <section className="glass-panel p-5 sm:p-6 mb-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Source Management & Ingestion
            </h2>
            <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {sources.length} {sources.length === 1 ? 'Source' : 'Sources'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Provide 2 or more diverse documents (press releases, audit reports, research papers) to cross-reference claims.
          </p>
        </div>

        {!isFormOpen && (
          <button
            onClick={handleOpenAdd}
            className="btn-primary text-xs py-2 px-3 sm:px-4 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Source</span>
          </button>
        )}
      </div>

      {/* Add / Edit Form Modal / Accordion */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-indigo-500/40 rounded-xl p-5 mb-6 shadow-xl shadow-indigo-950/20">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {editingId ? "Edit Source Document" : "Ingest New Source Document"}
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
            <div className="mb-4 bg-rose-950/60 border border-rose-600/50 rounded-lg p-2.5 text-xs text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Document Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. GAO-24-106256 Artemis Cost Assessment"
                className="input-base w-full text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Author / Lead Investigator
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Dr. Jane Smith, Senior Auditor"
                className="input-base w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Publication Date (Critical for Outdated Detection)
              </label>
              <input
                type="date"
                value={publishedDate}
                onChange={(e) => setPublishedDate(e.target.value)}
                className="input-base w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Source URL / Document Citation (Optional)
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="input-base w-full text-xs font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                No invented URLs will ever be generated. Provide a verified link or leave blank.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Reliability & Source Tier
              </label>
              <select
                value={reliabilityTier}
                onChange={(e) => setReliabilityTier(e.target.value)}
                className="input-base w-full text-xs bg-slate-900"
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
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
              <span>Source Text / Excerpt *</span>
              <span className="text-[11px] font-mono text-slate-500">
                {content.length} characters | {content ? content.trim().split(/\s+/).length : 0} words
              </span>
            </label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste the relevant paragraphs, interview quotes, or technical statements here..."
              className="input-base w-full text-xs font-sans leading-relaxed resize-y"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={resetForm}
              className="btn-secondary text-xs py-2 px-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary text-xs py-2 px-4"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{editingId ? "Update Source" : "Save Source"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Grid of Sources */}
      {sources.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
          <Database className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-300">No Sources Ingested Yet</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Add at least two sources or select a pre-loaded sample dataset above to trigger the gap detection engine.
          </p>
          <button
            onClick={handleOpenAdd}
            className="btn-primary text-xs py-1.5 px-3 mx-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Source</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sources.map((src, index) => (
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
