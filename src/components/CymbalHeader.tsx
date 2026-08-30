import React from "react";
import { UtensilsCrossed, HeartPulse, BookOpen, Terminal, Sparkles, ShieldCheck } from "lucide-react";

interface CymbalHeaderProps {
  activeTab: "app" | "guide" | "curl";
  setActiveTab: (tab: "app" | "guide" | "curl") => void;
}

export const CymbalHeader: React.FC<CymbalHeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="border-b border-emerald-900/10 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-3">
          
          {/* Logo and Brand Identity */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 font-serif">
                  Cymbal Health
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  AI Chef POC
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  GSP517 Lab
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                East Central Minnesota Health Network &bull; Gemini-Powered Personalized Nutrition
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
            <button
              id="tab-btn-chef-app"
              onClick={() => setActiveTab("app")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                activeTab === "app"
                  ? "bg-white text-emerald-800 shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <UtensilsCrossed className="w-4 h-4 text-emerald-600" />
              <span>Live AI Chef</span>
            </button>

            <button
              id="tab-btn-curl-tester"
              onClick={() => setActiveTab("curl")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                activeTab === "curl"
                  ? "bg-white text-emerald-800 shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Terminal className="w-4 h-4 text-teal-600" />
              <span>Task 1 cURL Tester</span>
            </button>

            <button
              id="tab-btn-lab-guide"
              onClick={() => setActiveTab("guide")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                activeTab === "guide"
                  ? "bg-white text-emerald-800 shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>GSP517 Lab Solution Guide</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
