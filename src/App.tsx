/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { CymbalHeader } from "./components/CymbalHeader";
import { ChefForm } from "./components/ChefForm";
import { RecipeDisplay } from "./components/RecipeDisplay";
import { CurlTesterView } from "./components/CurlTesterView";
import { LabGuideView } from "./components/LabGuideView";
import { ChefFormData, RecipeItem } from "./types";
import { AlertCircle, Sparkles, ChefHat, HeartPulse, RefreshCw } from "lucide-react";

// Default Initial Recipe Recommendation Matching GSP517 Task 1 & 2 Lab Scenario
const INITIAL_LAB_RECIPES: RecipeItem[] = [
  {
    title: "Seared Ginger Ahi Tuna with Low-Sodium Citrus Ponzu & Steamed Edamame",
    description: "A heart-healthy, low-sodium Japanese culinary creation featuring premium ahi tuna crusted with cracked black pepper and fresh ginger, paired with tender steamed edamame and a potassium-rich daikon radish salad.",
    prepTime: "15 minutes",
    cookTime: "6 minutes",
    totalTime: "21 minutes",
    servings: 2,
    difficulty: "Easy",
    calories: 380,
    pantryIngredientsUsed: ["ahi tuna", "fresh ginger", "edamame"],
    fullIngredients: [
      { name: "Sashimi-grade Ahi Tuna Steaks (6 oz each)", amount: "2 fillets", isPantryItem: true },
      { name: "Fresh Ginger (grated & matchstick cut)", amount: "2 tbsp", isPantryItem: true },
      { name: "Edamame in pods (fresh or frozen)", amount: "1.5 cups", isPantryItem: true },
      { name: "Low-Sodium Coconut Aminos (Soy/Peanut-safe alternative)", amount: "3 tbsp", isPantryItem: false },
      { name: "Fresh Yuzu or Meyer Lemon Juice", amount: "1.5 tbsp", isPantryItem: false },
      { name: "Toasted White Sesame Seeds (Peanut-free facility certified)", amount: "1 tsp", isPantryItem: false },
      { name: "Cold-Pressed Sesame Oil", amount: "1 tsp", isPantryItem: false },
      { name: "Green Scallions (thinly sliced)", amount: "2 stalks", isPantryItem: false },
      { name: "Shredded Daikon Radish", amount: "1/2 cup", isPantryItem: false }
    ],
    preparationInstructions: [
      "Pat the ahi tuna steaks thoroughly dry with paper towels. Lightly rub both sides with freshly grated ginger and a touch of cracked black pepper (strictly omitting salt to ensure low sodium).",
      "Steam the edamame pods in a covered basket over boiling water for 4 to 5 minutes until vibrant green and tender. Drain and toss with sliced scallions.",
      "In a small ceramic bowl, whisk together the low-sodium coconut aminos, fresh yuzu/lemon juice, and half of the matchstick ginger to create the light citrus ponzu.",
      "Heat a heavy-bottomed cast iron skillet or non-stick pan over medium-high heat with 1 tsp of sesame oil until shimmering.",
      "Sear the ahi tuna for precisely 60 to 90 seconds per side, allowing an appetizing golden crust to form while keeping the interior center rare to medium-rare.",
      "Transfer the tuna to a cutting board and let rest for 2 minutes. Slice against the grain into 1/4-inch medallions.",
      "Arrange the sliced tuna over the shredded daikon radish, drizzle with citrus ponzu sauce, and serve alongside warm steamed edamame and a chilled glass of light Pinot Noir."
    ],
    winePairing: {
      recommendation: "Light-Bodied Red: Oregon Pinot Noir (Willamette Valley) or Beaujolais-Villages",
      tastingNotes: "The delicate red berry acidity, subtle earthiness, and low tannin structure of a chilled Pinot Noir harmonizes seamlessly with the umami of seared ahi tuna and the zesty warmth of fresh ginger without overpowering the delicate low-sodium profile.",
      servingTemperature: "Slightly chilled at 55°F - 58°F (13°C - 14°C)",
      nonAlcoholicAlternative: "Hibiscus-Pomegranate Infusion with muddled ginger and sparkling mineral water"
    },
    nutritionalFacts: {
      calories: 380,
      proteinGrams: 46,
      carbsGrams: 14,
      fatGrams: 9,
      sodiumMg: 190,
      fiberGrams: 6,
      healthBenefits: [
        "Rich in Omega-3 DHA & EPA for cardiovascular health",
        "High lean protein (46g) supporting muscle retention and metabolic stability",
        "Ultra-low sodium (190mg) meeting Cymbal Health hypertension management guidelines",
        "Plant isoflavones and antioxidant gingerol providing natural anti-inflammatory benefits"
      ]
    },
    allergenSafetyVerification: "100% Peanut-Free & Peanut-Oil Free: Verified compliant with strict peanut allergy safety protocols.",
    cymbalWellnessTip: "Using potassium-rich aromatics like fresh ginger, scallions, and citrus zest provides bold flavor punch without requiring added sodium, actively protecting arterial flexibility."
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"app" | "guide" | "curl">("app");
  
  const [formData, setFormData] = useState<ChefFormData>({
    cuisine: "Japanese",
    dietary_preference: "low sodium",
    allergy: "peanuts",
    ingredient_1: "ahi tuna",
    ingredient_2: "fresh ginger",
    ingredient_3: "edamame",
    wine: "Red",
  });

  const [recipes, setRecipes] = useState<RecipeItem[]>(INITIAL_LAB_RECIPES);
  const [rawPromptUsed, setRawPromptUsed] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerateRecipes = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error || "Failed to generate recipes");
      }

      if (result.data?.recipes && result.data.recipes.length > 0) {
        setRecipes(result.data.recipes);
        setRawPromptUsed(result.data.rawPromptUsed || "");
        
        // Trigger celebratory confetti
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.65 },
          colors: ["#059669", "#0d9488", "#7c3aed", "#f59e0b"]
        });
      } else {
        throw new Error("No recipes returned from AI Chef");
      }
    } catch (err: any) {
      console.error("Generation failed:", err);
      setErrorMessage(err.message || "Failed to connect to the Gemini API service.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Header */}
      <CymbalHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* Error Alert if any */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block mb-0.5">Recipe Generation Notice:</span>
              <p>{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab 1: Live AI Chef POC */}
        {activeTab === "app" && (
          <div className="space-y-8">
            {/* Form Section */}
            <ChefForm
              formData={formData}
              setFormData={setFormData}
              onGenerate={handleGenerateRecipes}
              isLoading={isLoading}
            />

            {/* Recipe Output Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-lg font-bold text-slate-900 font-serif">
                    Recommended Culinary Creations
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  Tailored to Cymbal Health Wellness Standards
                </span>
              </div>

              <RecipeDisplay recipes={recipes} rawPromptUsed={rawPromptUsed} />
            </div>
          </div>
        )}

        {/* Tab 2: Task 1 cURL Tester */}
        {activeTab === "curl" && <CurlTesterView />}

        {/* Tab 3: Lab Solution Guide */}
        {activeTab === "guide" && <LabGuideView />}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
            <span>Cymbal Health &bull; East Central Minnesota Health Network POC</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600 font-medium">
            <span>GSP517 Gemini &amp; Streamlit Lab</span>
            <span>&bull;</span>
            <span>Cloud Run Service: chef-streamlit-app</span>
            <span>&bull;</span>
            <span>Port 8080</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
