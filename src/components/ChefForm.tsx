import React, { useState } from "react";
import { ChefFormData } from "../types";
import { Sparkles, Wine, AlertCircle, Apple, Code2, RefreshCw, ChefHat, CheckCircle2 } from "lucide-react";

interface ChefFormProps {
  formData: ChefFormData;
  setFormData: React.Dispatch<React.SetStateAction<ChefFormData>>;
  onGenerate: () => void;
  isLoading: boolean;
}

const CUISINES = [
  "Japanese",
  "Italian",
  "Mexican",
  "Mediterranean",
  "Indian",
  "Thai",
  "American",
  "French",
  "Greek",
  "Korean",
  "Spanish",
  "Middle Eastern"
];

const DIETARY_PREFERENCES = [
  "low sodium",
  "keto",
  "vegan",
  "vegetarian",
  "gluten-free",
  "diabetic-friendly",
  "heart-healthy",
  "paleo",
  "low carb",
  "anti-inflammatory"
];

const COMMON_ALLERGIES = [
  "peanuts",
  "tree nuts",
  "dairy",
  "shellfish",
  "soy",
  "gluten",
  "eggs",
  "sesame",
  "none"
];

const PRESETS: { label: string; tag: string; data: ChefFormData }[] = [
  {
    label: "GSP517 Lab Scenario (Task 1 & 2)",
    tag: "Official Lab Default",
    data: {
      cuisine: "Japanese",
      dietary_preference: "low sodium",
      allergy: "peanuts",
      ingredient_1: "ahi tuna",
      ingredient_2: "fresh ginger",
      ingredient_3: "edamame",
      wine: "Red"
    }
  },
  {
    label: "Heart-Healthy Mediterranean Catch",
    tag: "Cardiovascular Wellness",
    data: {
      cuisine: "Mediterranean",
      dietary_preference: "heart-healthy",
      allergy: "shellfish",
      ingredient_1: "wild salmon fillet",
      ingredient_2: "fresh rosemary & garlic",
      ingredient_3: "baby spinach & cherry tomatoes",
      wine: "White"
    }
  },
  {
    label: "Plant-Powered Golden Curry",
    tag: "High Fiber & Anti-Inflammatory",
    data: {
      cuisine: "Indian",
      dietary_preference: "vegan",
      allergy: "dairy",
      ingredient_1: "organic chickpeas",
      ingredient_2: "fresh turmeric root",
      ingredient_3: "roasted cauliflower florets",
      wine: "None"
    }
  }
];

export const ChefForm: React.FC<ChefFormProps> = ({
  formData,
  setFormData,
  onGenerate,
  isLoading
}) => {
  const [showPromptPreview, setShowPromptPreview] = useState(false);

  const formattedPromptString = `prompt = f"""I am a Chef.  I need to create ${formData.cuisine} \\n
recipes for customers who want ${formData.dietary_preference} meals. \\n
However, don't include recipes that use ingredients with the customer's ${formData.allergy} allergy. \\n
I have ${formData.ingredient_1 || "[Ingredient 1]"}, \\n
${formData.ingredient_2 || "[Ingredient 2]"}, \\n
and ${formData.ingredient_3 || "[Ingredient 3]"} \\n
in my kitchen and other ingredients. \\n
The customer's wine preference is ${formData.wine} \\n
Please provide some for meal recommendations.
For each recommendation include preparation instructions,
time to prepare
and the recipe title at the beginning of the response.
Then include the wine paring for each recommendation.
At the end of the recommendation provide the calories associated with the meal
and the nutritional facts.
"""`;

  const handlePresetSelect = (preset: ChefFormData) => {
    setFormData(preset);
  };

  const handleReset = () => {
    setFormData({
      cuisine: "Japanese",
      dietary_preference: "low sodium",
      allergy: "peanuts",
      ingredient_1: "ahi tuna",
      ingredient_2: "fresh ginger",
      ingredient_3: "edamame",
      wine: "Red"
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-emerald-50/50 via-teal-50/20 to-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-600 text-white shadow-xs">
                <ChefHat className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-serif">
                Chef Parameters &amp; Pantry Inventory
              </h2>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Configure cuisine tastes, dietary restrictions, pantry items, and wine pairings.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              title="Reset to default lab values"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Lab Defaults
            </button>
            <button
              type="button"
              onClick={() => setShowPromptPreview(!showPromptPreview)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                showPromptPreview
                  ? "bg-slate-800 text-white border-slate-800"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              {showPromptPreview ? "Hide Python Prompt" : "View Python Prompt"}
            </button>
          </div>
        </div>

        {/* Quick Lab Presets */}
        <div className="mt-4 pt-3 border-t border-slate-200/60">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
            Quick Scenario Presets:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetSelect(p.data)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-300 border border-slate-200 text-slate-700 transition-all text-left"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                <span className="font-semibold">{p.label}</span>
                <span className="text-[10px] text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  {p.tag}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Python Prompt Preview Collapsible */}
      {showPromptPreview && (
        <div className="p-4 bg-slate-900 text-slate-100 border-b border-slate-800 text-xs font-mono">
          <div className="flex items-center justify-between mb-2">
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <Code2 className="w-4 h-4" />
              GSP517 Task 2 Dynamic Python Prompt (chef.py):
            </span>
            <span className="text-slate-400">Streamlit &bull; vertexai.generative_models</span>
          </div>
          <pre className="p-3 bg-slate-950 rounded-lg overflow-x-auto text-emerald-300/90 whitespace-pre-wrap leading-relaxed border border-slate-800">
            {formattedPromptString}
          </pre>
        </div>
      )}

      {/* Form Grid */}
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Column 1: Cuisine, Dietary, Allergy */}
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
                <Apple className="w-4 h-4 text-emerald-600" />
                1. Dietary &amp; Culinary Profile
              </h3>
            </div>

            {/* Cuisine Preference */}
            <div>
              <label htmlFor="input-cuisine" className="block text-sm font-semibold text-slate-800 mb-1.5">
                Cuisine Preference <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="input-cuisine"
                  type="text"
                  value={formData.cuisine}
                  onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                  placeholder="e.g. Japanese, Italian, Mediterranean"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900 text-sm bg-white"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {CUISINES.slice(0, 6).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormData({ ...formData, cuisine: c })}
                    className={`text-[11px] px-2.5 py-1 rounded-md transition-colors ${
                      formData.cuisine.toLowerCase() === c.toLowerCase()
                        ? "bg-emerald-700 text-white font-semibold"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary Preference */}
            <div>
              <label htmlFor="input-dietary" className="block text-sm font-semibold text-slate-800 mb-1.5">
                Dietary Preference / Wellness Goal <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-dietary"
                type="text"
                value={formData.dietary_preference}
                onChange={(e) => setFormData({ ...formData, dietary_preference: e.target.value })}
                placeholder="e.g. low sodium, keto, diabetic-friendly"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900 text-sm bg-white"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {DIETARY_PREFERENCES.slice(0, 5).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setFormData({ ...formData, dietary_preference: d })}
                    className={`text-[11px] px-2.5 py-1 rounded-md capitalize transition-colors ${
                      formData.dietary_preference.toLowerCase() === d.toLowerCase()
                        ? "bg-teal-700 text-white font-semibold"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Food Allergy */}
            <div>
              <label htmlFor="input-allergy" className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center justify-between">
                <span>Food Allergy Exclusion <span className="text-rose-500">*</span></span>
                <span className="text-xs font-normal text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Strictly Excluded
                </span>
              </label>
              <input
                id="input-allergy"
                type="text"
                value={formData.allergy}
                onChange={(e) => setFormData({ ...formData, allergy: e.target.value })}
                placeholder="e.g. peanuts, shellfish, dairy"
                className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-900 text-sm bg-rose-50/20"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {COMMON_ALLERGIES.slice(0, 6).map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setFormData({ ...formData, allergy: a })}
                    className={`text-[11px] px-2.5 py-1 rounded-md capitalize transition-colors ${
                      formData.allergy.toLowerCase() === a.toLowerCase()
                        ? "bg-rose-600 text-white font-semibold"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Column 2: Kitchen Ingredients & Wine Radio */}
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-emerald-600" />
                2. On-Hand Kitchen Ingredients
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label htmlFor="input-ingredient-1" className="block text-xs font-semibold text-slate-700 mb-1">
                  Ingredient 1 (Primary Protein or Main)
                </label>
                <input
                  id="input-ingredient-1"
                  type="text"
                  value={formData.ingredient_1}
                  onChange={(e) => setFormData({ ...formData, ingredient_1: e.target.value })}
                  placeholder="e.g. ahi tuna"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900 text-sm bg-white"
                />
              </div>

              <div>
                <label htmlFor="input-ingredient-2" className="block text-xs font-semibold text-slate-700 mb-1">
                  Ingredient 2 (Aromatic, Spice or Produce)
                </label>
                <input
                  id="input-ingredient-2"
                  type="text"
                  value={formData.ingredient_2}
                  onChange={(e) => setFormData({ ...formData, ingredient_2: e.target.value })}
                  placeholder="e.g. fresh ginger"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900 text-sm bg-white"
                />
              </div>

              <div>
                <label htmlFor="input-ingredient-3" className="block text-xs font-semibold text-slate-700 mb-1">
                  Ingredient 3 (Vegetable, Grain or Legume)
                </label>
                <input
                  id="input-ingredient-3"
                  type="text"
                  value={formData.ingredient_3}
                  onChange={(e) => setFormData({ ...formData, ingredient_3: e.target.value })}
                  placeholder="e.g. edamame"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900 text-sm bg-white"
                />
              </div>
            </div>

            {/* Task 2 Streamlit Radio: Wine Preference */}
            <div className="pt-2">
              <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Wine className="w-4 h-4 text-purple-600" />
                  Wine Preference (Streamlit Radio Component) <span className="text-rose-500">*</span>
                </span>
                <span className="text-[11px] text-slate-500 font-mono bg-purple-50 text-purple-800 px-2 py-0.5 rounded border border-purple-200">
                  st.radio("Wine Preference", ["Red", "White", "None"])
                </span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["Red", "White", "None"] as const).map((option) => (
                  <label
                    key={option}
                    id={`radio-wine-${option.toLowerCase()}`}
                    className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      formData.wine === option
                        ? "bg-purple-50/70 border-purple-500 text-purple-950 font-bold shadow-xs ring-2 ring-purple-500/20"
                        : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="wine_preference"
                      value={option}
                      checked={formData.wine === option}
                      onChange={() => setFormData({ ...formData, wine: option })}
                      className="text-purple-600 focus:ring-purple-500 h-4 w-4"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Generate Action Button */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Cymbal Health Model: <strong>gemini-3.7-flash</strong> &bull; Complete with prep timing, step instructions, wine pairing &amp; nutrition facts.
            </span>
          </div>

          <button
            id="btn-generate-recipes"
            type="button"
            disabled={isLoading}
            onClick={onGenerate}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-700/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform active:scale-[0.99] text-base"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Executive Chef Gemini is Creating Recipes...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Generate Chef Recommendations</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
