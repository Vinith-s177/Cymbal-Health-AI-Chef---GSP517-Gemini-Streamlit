import React, { useState, useEffect } from "react";
import { RecipeItem } from "../types";
import {
  Clock,
  Flame,
  Wine,
  ShieldCheck,
  HeartPulse,
  ChefHat,
  CheckCircle2,
  Copy,
  Printer,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Timer,
  Info,
  Utensils,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface RecipeDisplayProps {
  recipes: RecipeItem[];
  rawPromptUsed?: string;
}

export const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipes, rawPromptUsed }) => {
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState<number>(0);
  const [checkedSteps, setCheckedSteps] = useState<{ [recipeIdx: number]: { [stepIdx: number]: boolean } }>({});
  const [copiedState, setCopiedState] = useState(false);
  const [showRawPrompt, setShowRawPrompt] = useState(false);

  // Cooking Timer state
  const [timerSeconds, setTimerSeconds] = useState(600); // 10 min default
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerInitial, setTimerInitial] = useState(600);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerRunning) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  if (!recipes || recipes.length === 0) return null;

  const currentRecipe = recipes[selectedRecipeIndex] || recipes[0];

  const handleStepToggle = (recipeIdx: number, stepIdx: number) => {
    setCheckedSteps((prev) => ({
      ...prev,
      [recipeIdx]: {
        ...prev[recipeIdx],
        [stepIdx]: !prev[recipeIdx]?.[stepIdx]
      }
    }));
  };

  const copyRecipeMarkdown = () => {
    const md = `# ${currentRecipe.title}
*Cymbal Health AI Chef Recommendation*

**Time to Prepare:** ${currentRecipe.prepTime} | **Cook Time:** ${currentRecipe.cookTime} | **Total Time:** ${currentRecipe.totalTime}
**Calories:** ${currentRecipe.calories} kcal | **Servings:** ${currentRecipe.servings}

## Ingredients:
${currentRecipe.fullIngredients.map((ing) => `- ${ing.amount} ${ing.name} ${ing.isPantryItem ? "(From your kitchen)" : ""}`).join("\n")}

## Preparation Instructions:
${currentRecipe.preparationInstructions.map((step, idx) => `${idx + 1}. ${step}`).join("\n")}

## Wine Pairing:
- **Recommendation:** ${currentRecipe.winePairing.recommendation}
- **Tasting Notes:** ${currentRecipe.winePairing.tastingNotes}
${currentRecipe.winePairing.nonAlcoholicAlternative ? `- **Zero-Proof Alternative:** ${currentRecipe.winePairing.nonAlcoholicAlternative}` : ""}

## Nutritional Facts (Per Serving):
- **Calories:** ${currentRecipe.nutritionalFacts.calories} kcal
- **Protein:** ${currentRecipe.nutritionalFacts.proteinGrams}g
- **Carbohydrates:** ${currentRecipe.nutritionalFacts.carbsGrams}g
- **Fat:** ${currentRecipe.nutritionalFacts.fatGrams}g
- **Sodium:** ${currentRecipe.nutritionalFacts.sodiumMg}mg
- **Key Health Benefits:** ${currentRecipe.nutritionalFacts.healthBenefits.join(", ")}

**Allergen Safeguard:** ${currentRecipe.allergenSafetyVerification}
**Cymbal Health Wellness Insight:** ${currentRecipe.cymbalWellnessTip}
`;

    navigator.clipboard.writeText(md);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const setTimerPreset = (mins: number) => {
    setTimerRunning(false);
    setTimerSeconds(mins * 60);
    setTimerInitial(mins * 60);
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* Recipe Selector Tabs (if multiple recommendations generated) */}
      {recipes.length > 1 && (
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200">
          {recipes.map((r, idx) => (
            <button
              key={idx}
              id={`recipe-tab-${idx}`}
              onClick={() => setSelectedRecipeIndex(idx)}
              className={`flex-1 min-w-[200px] flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                selectedRecipeIndex === idx
                  ? "bg-white text-emerald-950 shadow-sm border border-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <div className="flex items-center gap-2 text-left truncate">
                <ChefHat className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">{r.title}</span>
              </div>
              <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 ml-2 shrink-0">
                {r.calories} cal
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Main Recipe Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden">
        {/* Card Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  Cymbal Health Recommendation #{selectedRecipeIndex + 1}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Allergen Safe: Verified
                </span>
              </div>

              {/* Recipe Title at beginning of response */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif tracking-tight text-white">
                {currentRecipe.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {currentRecipe.description}
              </p>
            </div>

            {/* Actions: Copy & Print */}
            <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
              <button
                type="button"
                onClick={copyRecipeMarkdown}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors"
                title="Copy formatted markdown to clipboard"
              >
                {copiedState ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedState ? "Copied!" : "Copy Recipe"}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors"
                title="Print recipe card"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
            </div>

          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <span className="text-[11px] text-slate-400 uppercase font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Prep Time
              </span>
              <p className="text-base font-bold text-white mt-0.5">{currentRecipe.prepTime}</p>
            </div>

            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <span className="text-[11px] text-slate-400 uppercase font-medium flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Cook Time
              </span>
              <p className="text-base font-bold text-white mt-0.5">{currentRecipe.cookTime}</p>
            </div>

            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <span className="text-[11px] text-slate-400 uppercase font-medium flex items-center gap-1">
                <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                Calories
              </span>
              <p className="text-base font-bold text-white mt-0.5">{currentRecipe.calories} kcal</p>
            </div>

            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <span className="text-[11px] text-slate-400 uppercase font-medium flex items-center gap-1">
                <Utensils className="w-3.5 h-3.5 text-teal-400" />
                Servings / Yield
              </span>
              <p className="text-base font-bold text-white mt-0.5">{currentRecipe.servings} Servings</p>
            </div>
          </div>

        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Section: Ingredients & Kitchen Match */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Ingredients Column */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-serif">
                  <Utensils className="w-4 h-4 text-emerald-600" />
                  Ingredients
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {currentRecipe.fullIngredients.length} Items
                </span>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100/80">
                <span className="text-xs font-semibold text-emerald-900 block mb-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  Your Kitchen Ingredients Used:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentRecipe.pantryIngredientsUsed.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white text-emerald-800 border border-emerald-200 shadow-2xs"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <ul className="space-y-2 divide-y divide-slate-100">
                {currentRecipe.fullIngredients.map((ing, idx) => (
                  <li key={idx} className="pt-2 first:pt-0 flex items-start justify-between text-sm">
                    <span className="text-slate-800 font-medium">{ing.name}</span>
                    <span className="text-slate-500 font-mono text-xs bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                      {ing.amount}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Allergen Safe Notice */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900 block mb-0.5">Allergen Safety Guarantee:</span>
                  <p>{currentRecipe.allergenSafetyVerification}</p>
                </div>
              </div>
            </div>

            {/* Preparation Steps & Cooking Timer Column */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-2 gap-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-serif">
                  <ChefHat className="w-4 h-4 text-emerald-600" />
                  Preparation Instructions (Step-by-Step)
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  Check steps off as you cook
                </span>
              </div>

              {/* Step Checklist */}
              <div className="space-y-3">
                {currentRecipe.preparationInstructions.map((step, idx) => {
                  const isChecked = checkedSteps[selectedRecipeIndex]?.[idx] || false;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleStepToggle(selectedRecipeIndex, idx)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isChecked
                          ? "bg-slate-50 border-slate-200 opacity-60 line-through text-slate-500"
                          : "bg-white border-slate-200/90 hover:border-emerald-300 hover:shadow-xs text-slate-800"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-colors ${
                          isChecked
                            ? "bg-emerald-600 text-white"
                            : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <p className="text-sm sm:text-base leading-relaxed flex-1">
                        {step}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Interactive Kitchen Cooking Timer */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-700 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Timer className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
                      Interactive Cooking Timer
                    </span>
                    <div className="text-2xl font-mono font-bold text-emerald-400">
                      {formatTimer(timerSeconds)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTimerRunning(!timerRunning)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      timerRunning
                        ? "bg-amber-500 hover:bg-amber-600 text-slate-950"
                        : "bg-emerald-500 hover:bg-emerald-600 text-slate-950"
                    }`}
                  >
                    {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{timerRunning ? "Pause" : "Start Timer"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTimerPreset(5)}
                    className="px-2.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200"
                  >
                    5m
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimerPreset(10)}
                    className="px-2.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200"
                  >
                    10m
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimerPreset(15)}
                    className="px-2.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200"
                  >
                    15m
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTimerRunning(false);
                      setTimerSeconds(timerInitial);
                    }}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Section: Sommelier Wine Pairing & Nutrition Facts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-200">
            
            {/* Wine Pairing Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50/70 via-white to-purple-50/30 border border-purple-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-purple-600 text-white shadow-2xs">
                    <Wine className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-purple-950 font-serif">
                    Sommelier Wine Pairing
                  </h4>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                  {currentRecipe.winePairing.recommendation}
                </span>
              </div>

              <div className="space-y-2 text-sm text-purple-900/90 leading-relaxed">
                <p>
                  <strong className="font-semibold text-purple-950">Pairing Notes: </strong>
                  {currentRecipe.winePairing.tastingNotes}
                </p>
                {currentRecipe.winePairing.servingTemperature && (
                  <p className="text-xs text-purple-700">
                    <strong>Serving Temperature:</strong> {currentRecipe.winePairing.servingTemperature}
                  </p>
                )}
                {currentRecipe.winePairing.nonAlcoholicAlternative && (
                  <div className="mt-3 p-3 rounded-xl bg-white/80 border border-purple-200/70 text-xs text-purple-900">
                    <strong className="font-semibold text-purple-950 block mb-0.5">Non-Alcoholic Wellness Alternative:</strong>
                    {currentRecipe.winePairing.nonAlcoholicAlternative}
                  </div>
                )}
              </div>
            </div>

            {/* Nutrition Facts & Cymbal Health Wellness Breakdown */}
            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-2xs">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 font-serif">
                    Nutrition Facts &amp; Health Insights
                  </h4>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  {currentRecipe.nutritionalFacts.calories} kcal / serving
                </span>
              </div>

              {/* Macros Breakdown */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Protein</span>
                  <span className="text-sm font-extrabold text-emerald-700 font-mono">
                    {currentRecipe.nutritionalFacts.proteinGrams}g
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Carbs</span>
                  <span className="text-sm font-extrabold text-blue-700 font-mono">
                    {currentRecipe.nutritionalFacts.carbsGrams}g
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Healthy Fat</span>
                  <span className="text-sm font-extrabold text-amber-700 font-mono">
                    {currentRecipe.nutritionalFacts.fatGrams}g
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Sodium</span>
                  <span className="text-sm font-extrabold text-rose-700 font-mono">
                    {currentRecipe.nutritionalFacts.sodiumMg}mg
                  </span>
                </div>
              </div>

              {/* Health Benefits Tags */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-700 block">Wellness Highlights:</span>
                <div className="flex flex-wrap gap-1.5">
                  {currentRecipe.nutritionalFacts.healthBenefits.map((b, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-white text-slate-700 border border-slate-200"
                    >
                      &bull; {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cymbal Health Care Tip */}
              <div className="p-3 rounded-xl bg-emerald-50 text-xs text-emerald-900 border border-emerald-200/80 flex items-start gap-2">
                <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Cymbal Health Wellness Tip:</strong> {currentRecipe.cymbalWellnessTip}
                </p>
              </div>
            </div>

          </div>

          {/* Raw Prompt Inspector Toggle */}
          {rawPromptUsed && (
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowRawPrompt(!showRawPrompt)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                {showRawPrompt ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                <span>{showRawPrompt ? "Hide Raw Gemini Prompt" : "Inspect Raw Gemini Prompt Used"}</span>
              </button>

              {showRawPrompt && (
                <div className="mt-3 p-4 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed border border-slate-800">
                  {rawPromptUsed}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
