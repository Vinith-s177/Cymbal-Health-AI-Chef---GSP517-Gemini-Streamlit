import React, { useState } from "react";
import { GSP517_LAB_DATA } from "../data/labGuideData";
import {
  BookOpen,
  CheckCircle2,
  Copy,
  ChevronRight,
  Sparkles,
  Terminal,
  FileCode,
  ShieldAlert,
  Award,
  ExternalLink
} from "lucide-react";

export const LabGuideView: React.FC = () => {
  const [activeTaskId, setActiveTaskId] = useState<number>(1);
  const [completedTasks, setCompletedTasks] = useState<{ [id: number]: boolean }>({ 1: false, 2: false, 3: false, 4: false, 5: false });
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const activeTask = GSP517_LAB_DATA.find((t) => t.id === activeTaskId) || GSP517_LAB_DATA[0];

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleTaskCompletion = (id: number) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPct = Math.round((completedCount / GSP517_LAB_DATA.length) * 100);

  return (
    <div className="space-y-6">
      {/* Banner / Score Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-600 text-white shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 font-serif">
                  GSP517: Challenge Lab Solution Manual &amp; Code Reference
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                  100% Score Guide
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                Develop Gen AI Apps with Gemini and Streamlit &bull; Cymbal Health AI Chef POC
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-4 min-w-[240px]">
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Lab Progress</span>
                <span className="text-indigo-600">{progressPct}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                ></div>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-slate-800 bg-white px-2 py-1 rounded border border-slate-200">
              {completedCount} / 5 Done
            </span>
          </div>
        </div>
      </div>

      {/* Main Task Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar: Task List */}
        <div className="lg:col-span-4 space-y-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 px-3 py-2 block">
              Challenge Tasks:
            </span>
            <div className="space-y-1.5">
              {GSP517_LAB_DATA.map((task) => {
                const isSelected = activeTaskId === task.id;
                const isDone = completedTasks[task.id];
                return (
                  <div
                    key={task.id}
                    id={`task-nav-item-${task.id}`}
                    onClick={() => setActiveTaskId(task.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-all flex items-start justify-between gap-3 border ${
                      isSelected
                        ? "bg-indigo-50/80 border-indigo-300 text-indigo-950 font-semibold shadow-2xs"
                        : "bg-white border-transparent hover:bg-slate-50 text-slate-700 font-medium"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTaskCompletion(task.id);
                        }}
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-colors ${
                          isDone
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "border-slate-300 bg-white hover:border-slate-400"
                        }`}
                        title="Mark task as complete"
                      >
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                      <div className="text-xs leading-snug">
                        <span className="block font-bold">Task {task.id}</span>
                        <span className="text-slate-500 font-normal line-clamp-1">{task.shortDesc}</span>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? "text-indigo-600 translate-x-0.5" : "text-slate-400"}`} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Troubleshooting Tip Box */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-amber-950">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              GSP517 Critical Exam Tip:
            </div>
            <p className="leading-relaxed">
              When testing cell 5 in Task 1, if you see a <strong>404 error</strong>, return to cell 3 and set the location variable to your assigned region (e.g. <code>us-central1</code>) instead of <code>global</code>.
            </p>
          </div>
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Task Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 font-mono">
                  Objective {activeTask.id} of 5
                </span>
                <h3 className="text-2xl font-bold text-slate-900 font-serif mt-0.5">
                  {activeTask.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => toggleTaskCompletion(activeTask.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  completedTasks[activeTask.id]
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{completedTasks[activeTask.id] ? "Task Completed" : "Mark as Completed"}</span>
              </button>
            </div>

            {/* Step-by-step Instructions */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Action Steps:
              </h4>
              <ul className="space-y-2.5">
                {activeTask.instructions.map((step, sIdx) => (
                  <li key={sIdx} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {sIdx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Code Snippets for this Task */}
            <div className="space-y-5 pt-2">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-indigo-600" />
                Code Files &amp; Commands to Copy:
              </h4>

              {activeTask.codeSnippets.map((snippet, snipIdx) => {
                const copyId = `task-${activeTask.id}-snip-${snipIdx}`;
                const isCopied = copiedIndex === copyId;
                return (
                  <div key={snipIdx} className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-sm">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
                      <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                        <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="font-semibold text-white">{snippet.filename || "Shell Script"}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopy(snippet.code, copyId)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                        title="Copy code snippet"
                      >
                        {isCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? "Copied to Clipboard!" : "Copy"}</span>
                      </button>
                    </div>

                    <div className="p-2 px-4 bg-slate-900/60 border-b border-slate-800/80 text-xs text-slate-400">
                      {snippet.description}
                    </div>

                    <pre className="p-4 text-xs font-mono text-indigo-200/90 overflow-x-auto leading-relaxed whitespace-pre-wrap max-h-96">
                      {snippet.code}
                    </pre>
                  </div>
                );
              })}
            </div>

            {/* Verification Tip */}
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">Verification Check:</span>
                <p>{activeTask.verificationTip}</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
