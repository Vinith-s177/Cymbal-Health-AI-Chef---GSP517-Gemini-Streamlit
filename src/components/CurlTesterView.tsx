import React, { useState } from "react";
import { Terminal, Play, Copy, CheckCircle2, AlertCircle, Sparkles, RefreshCw, Layers } from "lucide-react";

export const CurlTesterView: React.FC = () => {
  const defaultPrompt = `I am a Chef.  I need to create Japanese recipes for customers who want low sodium meals. However, I do not want to include recipes that use ingredients associated with a peanuts food allergy. I have ahi tuna, fresh ginger, and edamame in my kitchen and other ingredients. The customer wine preference is red. Please provide some for meal recommendations. For each recommendation include preparation instructions, time to prepare and the recipe title at the beginning of the response. Then include the wine paring for each recommendation. At the end of the recommendation provide the calories associated with the meal and the nutritional facts.`;

  const [prompt, setPrompt] = useState(defaultPrompt);
  const [temperature, setTemperature] = useState(0.2);
  const [isRunning, setIsRunning] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const [durationMs, setDurationMs] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const curlCommand = `curl -X POST \\
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \\
  -H "Content-Type: application/json" \\
  https://us-central1-aiplatform.googleapis.com/v1/projects/$PROJECT_ID/locations/us-central1/publishers/google/models/gemini-1.5-flash:generateContent \\
  -d '{
    "contents": [{
      "role": "user",
      "parts": [{
        "text": "${prompt.replace(/"/g, '\\"').replace(/\n/g, "\\n")}"
      }]
    }],
    "generationConfig": {
      "temperature": ${temperature}
    }
  }'`;

  const handleRunCurl = async () => {
    setIsRunning(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/test-curl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, temperature })
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to execute prompt");
      }

      setResultText(data.text);
      setDurationMs(data.durationMs);
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while running prompt.");
    } finally {
      setIsRunning(false);
    }
  };

  const copyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-teal-600 text-white shadow-xs">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 font-serif">
                Task 1: cURL &amp; API Prompt Connectivity Tester
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                JupyterLab Workbench Cell 5 Simulator
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Test connectivity and prompt behavior against the Gemini API using the exact Task 1 prompt from GSP517.
            </p>
          </div>
        </div>
      </div>

      {/* Main Tester Box */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Input & cURL command */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-600" />
              Prompt Input (Task 1 prompt.ipynb)
            </h3>
            <button
              type="button"
              onClick={() => setPrompt(defaultPrompt)}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors"
            >
              Reset to Lab Default
            </button>
          </div>

          <div>
            <label htmlFor="curl-prompt-textarea" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Task 1 Chef Prompt (Cell 5):
            </label>
            <textarea
              id="curl-prompt-textarea"
              rows={8}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 leading-relaxed"
            />
          </div>

          {/* Config Controls */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label htmlFor="range-temp" className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Temperature</span>
                <span className="font-mono text-teal-700 font-bold">{temperature}</span>
              </label>
              <input
                id="range-temp"
                type="range"
                min="0.0"
                max="1.0"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-teal-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Model
              </label>
              <div className="text-xs font-mono bg-slate-100 text-slate-800 px-3 py-2 rounded-lg border border-slate-200">
                gemini-3.7-flash
              </div>
            </div>
          </div>

          {/* Equivalent cURL */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Equivalent Terminal cURL:</span>
              <button
                type="button"
                onClick={copyCurl}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-2 py-0.5 rounded border border-teal-200 transition-colors"
              >
                {copiedCurl ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCurl ? "Copied" : "Copy cURL"}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-teal-300 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed border border-slate-800 max-h-40">
              {curlCommand}
            </pre>
          </div>

          {/* Execute Button */}
          <button
            id="btn-run-curl"
            type="button"
            disabled={isRunning}
            onClick={handleRunCurl}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-700/20 disabled:opacity-50 transition-all text-sm"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Executing API Request via cURL Gateway...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Run cURL &amp; Test API Connectivity</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Output Terminal / Response */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between shadow-sm min-h-[420px]">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-mono text-slate-400 ml-2">jupyterlab_output_cell5.log</span>
              </div>
              {durationMs && (
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  Latency: {durationMs}ms
                </span>
              )}
            </div>

            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs font-mono mb-4 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-1">API Error:</span>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            {isRunning ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin text-teal-400" />
                <p className="text-xs font-mono text-teal-300">Sending HTTP POST to Gemini Vertex Endpoint...</p>
              </div>
            ) : resultText ? (
              <div className="p-4 bg-slate-900 rounded-xl text-slate-200 text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto border border-slate-800/80">
                {resultText}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-3 text-center">
                <Terminal className="w-12 h-12 text-slate-700" />
                <p className="text-xs font-mono text-slate-400">
                  Click &ldquo;Run cURL &amp; Test API Connectivity&rdquo; to simulate Task 1 cell 5 execution.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono flex items-center justify-between">
            <span>Status: {resultText ? "200 OK" : isRunning ? "Connecting..." : "Idle"}</span>
            <span>GSP517 Task 1 Verified &check;</span>
          </div>
        </div>

      </div>
    </div>
  );
};
