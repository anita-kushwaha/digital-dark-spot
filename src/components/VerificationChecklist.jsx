import React, { useState } from 'react';
import { CheckSquare, Square, Plus, Filter, CheckCircle2, Trash2, ListChecks } from 'lucide-react';

export function VerificationChecklist({
  checklist,
  onToggleComplete,
  onAddCustomTask,
  onDeleteTask,
  onUpdateNote
}) {
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskAction, setNewTaskAction] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("High");

  const completedCount = checklist.filter((item) => item.completed).length;
  const totalCount = checklist.length;
  const percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredItems = checklist.filter((item) => {
    if (filterPriority === "ALL") return true;
    if (filterPriority === "INCOMPLETE") return !item.completed;
    return item.priority === filterPriority;
  });

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    onAddCustomTask({
      id: `check-custom-${Date.now()}`,
      priority: newTaskPriority,
      priorityBadge: `PRIORITY - ${newTaskPriority.toUpperCase()}`,
      category: "User Custom Task",
      task: newTaskTitle.trim(),
      targetEntities: "Investigator Defined",
      actionStep: newTaskAction.trim() || "Perform primary document check or interview relevant domain expert.",
      completed: false,
      userNote: "",
      sourceReference: "User Created Action Item"
    });

    setNewTaskTitle("");
    setNewTaskAction("");
    setIsAddingTask(false);
  };

  const getPriorityBadgeStyle = (priority) => {
    switch (priority) {
      case "High":
        return "bg-rose-950/60 text-rose-300 border-rose-800/60";
      case "Medium":
        return "bg-amber-950/60 text-amber-300 border-amber-800/60";
      case "Low":
        return "bg-slate-800 text-slate-300 border-slate-700";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Progress & Actions Header */}
      <div className="glass-panel p-5 bg-slate-900/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-sky-400" />
              Prioritized Verification Roadmap
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Actionable tasks derived from cross-source discrepancies and missing information dark spots.
            </p>
          </div>

          <button
            onClick={() => setIsAddingTask(true)}
            className="btn-primary text-xs self-start sm:self-auto shrink-0 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Verification Step</span>
          </button>
        </div>

        {/* Clean Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Overall Progress</span>
            <span className="font-semibold text-slate-200">{completedCount} of {totalCount} Completed ({percentComplete}%)</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-sky-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" />
            Filter:
          </span>
          {["ALL", "High", "Medium", "Low", "INCOMPLETE"].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                filterPriority === p
                  ? "bg-slate-700 text-white font-semibold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              {p === "INCOMPLETE" ? "Pending" : p}
            </button>
          ))}
        </div>
      </div>

      {/* Add Custom Task Form */}
      {isAddingTask && (
        <form onSubmit={handleCreateTask} className="glass-panel p-5 bg-slate-900 border-slate-700 shadow-xl">
          <h4 className="text-xs font-semibold text-slate-200 mb-3 uppercase tracking-wider">
            Create Custom Verification Item
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-3.5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">Task Description *</label>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="e.g. Inspect public audit registry for contract penalty details..."
                className="input-base w-full text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
                className="input-base w-full text-xs bg-slate-900"
              >
                <option value="High">High (Dispute resolution)</option>
                <option value="Medium">Medium (Gap investigation)</option>
                <option value="Low">Low (Metadata check)</option>
              </select>
            </div>
          </div>

          <div className="mb-3.5">
            <label className="block text-xs font-medium text-slate-300 mb-1">Detailed Action Step</label>
            <input
              type="text"
              value={newTaskAction}
              onChange={(e) => setNewTaskAction(e.target.value)}
              placeholder="e.g. Review official oversight hearing minutes..."
              className="input-base w-full text-xs"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary text-xs"
            >
              Save Item
            </button>
          </div>
        </form>
      )}

      {/* Checklist Tasks List */}
      <div className="space-y-3.5">
        {filteredItems.length === 0 ? (
          <div className="glass-panel p-8 text-center text-xs text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold text-slate-200">No items match the selected filter</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`glass-card p-5 transition-all ${
                item.completed
                  ? "bg-slate-950/30 border-slate-800/80 opacity-60"
                  : "bg-slate-900/80 border-slate-700/80"
              }`}
            >
              <div className="flex items-start gap-3.5">
                
                {/* Interactive Checkbox */}
                <button
                  onClick={() => onToggleComplete(item.id)}
                  className="mt-1 text-slate-400 hover:text-sky-400 transition-colors shrink-0"
                  title={item.completed ? "Mark incomplete" : "Mark as verified"}
                >
                  {item.completed ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-500" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${getPriorityBadgeStyle(item.priority)}`}>
                        {item.priority} Priority
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {item.category}
                      </span>
                    </div>

                    <button
                      onClick={() => onDeleteTask(item.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                      title="Remove task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Prominent Task Title */}
                  <h4 className={`text-base font-semibold text-white mb-1.5 leading-snug ${item.completed ? 'line-through text-slate-400' : ''}`}>
                    {item.task}
                  </h4>

                  {/* Secondary Context */}
                  <div className="text-xs text-slate-400 mb-2.5">
                    <strong className="text-slate-300 font-medium">Context: </strong>
                    <span>{item.targetEntities}</span>
                  </div>

                  {/* Easily Scannable Action Step Box */}
                  <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 text-xs text-slate-300 mb-3 leading-relaxed">
                    <strong className="text-sky-300 font-medium block mb-0.5">Recommended Action Step:</strong>
                    <span>{item.actionStep}</span>
                  </div>

                  {/* Personal Analyst Note */}
                  <div>
                    <input
                      type="text"
                      value={item.userNote || ""}
                      onChange={(e) => onUpdateNote(item.id, e.target.value)}
                      placeholder="Add personal verification notes or document references..."
                      className="input-base text-xs w-full bg-slate-950/80 border-slate-800 text-slate-300"
                    />
                  </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
