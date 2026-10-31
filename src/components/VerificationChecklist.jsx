import React, { useState } from 'react';
import { CheckSquare, Square, Plus, Filter, AlertCircle, ArrowUpRight, CheckCircle2, Trash2 } from 'lucide-react';

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
        return "bg-rose-950/80 text-rose-300 border-rose-700/60";
      case "Medium":
        return "bg-amber-950/80 text-amber-300 border-amber-700/60";
      case "Low":
        return "bg-sky-950/80 text-sky-300 border-sky-700/60";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Action Header & Progress Bar */}
      <div className="glass-panel p-5 bg-slate-900/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-sky-400" />
              Prioritized Investigative Action Plan
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Do not take AI or promotional claims at face value. Complete this prioritized verification roadmap.
            </p>
          </div>

          <button
            onClick={() => setIsAddingTask(true)}
            className="btn-primary text-xs py-2 px-3 self-start sm:self-auto shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Verification Step</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
            <span>Verification Progress</span>
            <span className="font-bold">{completedCount} of {totalCount} Completed ({percentComplete}%)</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
            {["ALL", "High", "Medium", "Low", "INCOMPLETE"].map((p) => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  filterPriority === p
                    ? "bg-slate-700 text-white font-bold"
                    : "bg-slate-800/60 text-slate-400 hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add Custom Task Inline Modal */}
      {isAddingTask && (
        <form onSubmit={handleCreateTask} className="glass-panel p-4 bg-slate-900 border-sky-500/50 shadow-xl">
          <h4 className="text-xs font-bold text-sky-300 mb-3 uppercase tracking-wider">
            Create Custom Verification Item
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-300 mb-1">Task Description *</label>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="e.g. Call university lab to verify test cell serial numbers..."
                className="input-base w-full text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Priority Urgency</label>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
                className="input-base w-full text-xs bg-slate-900"
              >
                <option value="High">High (Resolve dispute)</option>
                <option value="Medium">Medium (Investigate gap)</option>
                <option value="Low">Low (Routine audit)</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-xs text-slate-300 mb-1">Detailed Action Step</label>
            <input
              type="text"
              value={newTaskAction}
              onChange={(e) => setNewTaskAction(e.target.value)}
              placeholder="e.g. Inspect public SEC 10-K filing from Q2 2026..."
              className="input-base w-full text-xs"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary text-xs py-1.5 px-3"
            >
              Add Task
            </button>
          </div>
        </form>
      )}

      {/* List of Checklist Tasks */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="glass-panel p-8 text-center text-xs text-slate-400">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <p className="font-semibold text-slate-200">No items match the selected filter</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`glass-card p-4 transition-all ${
                item.completed
                  ? "bg-slate-950/40 border-slate-800 opacity-60"
                  : "bg-slate-900/80 border-slate-700/80"
              }`}
            >
              <div className="flex items-start gap-3">
                
                {/* Interactive Checkbox */}
                <button
                  onClick={() => onToggleComplete(item.id)}
                  className="mt-0.5 text-slate-400 hover:text-sky-400 transition-colors shrink-0"
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
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getPriorityBadgeStyle(item.priority)}`}>
                        {item.priorityBadge || item.priority}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
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

                  <h4 className={`text-sm font-bold text-white mb-1.5 ${item.completed ? 'line-through text-slate-400' : ''}`}>
                    {item.task}
                  </h4>

                  {/* Target entities / source context */}
                  <div className="text-xs text-slate-400 mb-2">
                    <strong className="text-slate-300">Target Context: </strong>
                    <span>{item.targetEntities}</span>
                  </div>

                  {/* Detailed Action Step */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded p-2.5 text-xs text-slate-300 mb-2 leading-relaxed">
                    <strong className="text-sky-300">Action Step: </strong>
                    <span>{item.actionStep}</span>
                  </div>

                  {/* Analyst Notes Input */}
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      value={item.userNote || ""}
                      onChange={(e) => onUpdateNote(item.id, e.target.value)}
                      placeholder="Add personal verification notes, interview log, or document ref..."
                      className="input-base text-xs py-1 px-2.5 w-full bg-slate-950/80 border-slate-800 text-slate-300"
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
