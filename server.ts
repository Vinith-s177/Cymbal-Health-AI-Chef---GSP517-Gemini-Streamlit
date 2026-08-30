import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-safe Gemini AI instance helper
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  return new GoogleGenAI({
    apiKey: apiKey || "dummy-key",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    service: "Cymbal Health AI Chef - GSP517",
  });
});

// API endpoint: Generate Recipe recommendations based on GSP517 prompt structure
app.post("/api/generate-recipe", async (req, res) => {
  try {
    const {
      cuisine = "Japanese",
      dietary_preference = "low sodium",
      allergy = "peanuts",
      ingredient_1 = "ahi tuna",
      ingredient_2 = "fresh ginger",
      ingredient_3 = "edamame",
      wine = "Red",
    } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        error: "GEMINI_API_KEY is not configured in the environment.",
      });
    }

    const ai = getGeminiClient();

    // Exact prompt template from GSP517 Lab Task 2:
    const labPrompt = `I am a Chef. I need to create ${cuisine} 
recipes for customers who want ${dietary_preference} meals. 
However, don't include recipes that use ingredients with the customer's ${allergy} allergy. 
I have ${ingredient_1}, 
${ingredient_2}, 
and ${ingredient_3} 
in my kitchen and other ingredients. 
The customer's wine preference is ${wine} 
Please provide some for meal recommendations.
For each recommendation include preparation instructions,
time to prepare
and the recipe title at the beginning of the response.
Then include the wine paring for each recommendation.
At the end of the recommendation provide the calories associated with the meal
and the nutritional facts.`;

    const systemInstruction = `You are an expert Executive Chef and Registered Dietitian for Cymbal Health, an East Central Minnesota health network focused on healthy living, wellness, and preventive care.
Your goal is to provide high-quality culinary recommendations strictly following the customer's cuisine (${cuisine}), dietary preference (${dietary_preference}), strict avoidance of allergens (${allergy}), incorporating their available kitchen ingredients (${ingredient_1}, ${ingredient_2}, ${ingredient_3}), and providing appropriate wine pairings (${wine}) along with calories and detailed nutrition facts.
Always ensure the recipe is delicious, safe, practical, and provides clear culinary preparation steps with precise timing.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: labPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recipes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Recipe title" },
                  description: { type: Type.STRING, description: "Brief mouthwatering description of the meal" },
                  prepTime: { type: Type.STRING, description: "Time to prepare, e.g. '15 minutes'" },
                  cookTime: { type: Type.STRING, description: "Time to cook, e.g. '10 minutes'" },
                  totalTime: { type: Type.STRING, description: "Total time, e.g. '25 minutes'" },
                  servings: { type: Type.INTEGER, description: "Number of servings" },
                  difficulty: { type: Type.STRING, description: "Easy, Medium, or Advanced" },
                  calories: { type: Type.INTEGER, description: "Total calories per serving" },
                  pantryIngredientsUsed: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Ingredients provided by user that were used"
                  },
                  fullIngredients: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        amount: { type: Type.STRING },
                        isPantryItem: { type: Type.BOOLEAN }
                      },
                      required: ["name", "amount", "isPantryItem"]
                    },
                    description: "Complete list of ingredients with quantities"
                  },
                  preparationInstructions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Step-by-step cooking instructions"
                  },
                  winePairing: {
                    type: Type.OBJECT,
                    properties: {
                      recommendation: { type: Type.STRING, description: "Specific wine varietal or non-alcoholic pairing" },
                      tastingNotes: { type: Type.STRING, description: "Why this wine pairs well with the flavors" },
                      servingTemperature: { type: Type.STRING, description: "Recommended serving temp" },
                      nonAlcoholicAlternative: { type: Type.STRING, description: "Healthy non-alcoholic pairing option" }
                    },
                    required: ["recommendation", "tastingNotes"]
                  },
                  nutritionalFacts: {
                    type: Type.OBJECT,
                    properties: {
                      calories: { type: Type.INTEGER },
                      proteinGrams: { type: Type.NUMBER },
                      carbsGrams: { type: Type.NUMBER },
                      fatGrams: { type: Type.NUMBER },
                      sodiumMg: { type: Type.NUMBER },
                      fiberGrams: { type: Type.NUMBER },
                      healthBenefits: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      }
                    },
                    required: ["calories", "proteinGrams", "carbsGrams", "fatGrams", "sodiumMg", "healthBenefits"]
                  },
                  allergenSafetyVerification: {
                    type: Type.STRING,
                    description: "Confirmation statement that allergen was excluded"
                  },
                  cymbalWellnessTip: {
                    type: Type.STRING,
                    description: "Cymbal Health wellness insight"
                  }
                },
                required: [
                  "title",
                  "description",
                  "prepTime",
                  "cookTime",
                  "totalTime",
                  "servings",
                  "calories",
                  "pantryIngredientsUsed",
                  "fullIngredients",
                  "preparationInstructions",
                  "winePairing",
                  "nutritionalFacts",
                  "allergenSafetyVerification",
                  "cymbalWellnessTip"
                ]
              }
            },
            rawPromptUsed: { type: Type.STRING, description: "The prompt formatted for Gemini" }
          },
          required: ["recipes"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    parsed.rawPromptUsed = labPrompt;

    res.json({
      success: true,
      data: parsed,
      modelUsed: "gemini-3.7-flash"
    });
  } catch (error: any) {
    console.error("Recipe generation error:", error);
    res.status(500).json({
      error: error.message || "Failed to generate recipe recommendations.",
    });
  }
});

// API endpoint: Test cURL / Raw Prompt execution (Task 1 simulator)
app.post("/api/test-curl", async (req, res) => {
  try {
    const {
      prompt = `I am a Chef.  I need to create Japanese recipes for customers who want low sodium meals. However, I do not want to include recipes that use ingredients associated with a peanuts food allergy. I have ahi tuna, fresh ginger, and edamame in my kitchen and other ingredients. The customer wine preference is red. Please provide some for meal recommendations. For each recommendation include preparation instructions, time to prepare and the recipe title at the beginning of the response. Then include the wine paring for each recommendation. At the end of the recommendation provide the calories associated with the meal and the nutritional facts.`,
      temperature = 0.2,
      maxOutputTokens = 1024,
    } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        error: "GEMINI_API_KEY is not configured in the environment.",
      });
    }

    const ai = getGeminiClient();
    const startTime = Date.now();

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        temperature: Number(temperature) || 0.2,
      },
    });

    const durationMs = Date.now() - startTime;

    res.json({
      success: true,
      text: response.text,
      durationMs,
      prompt,
      model: "gemini-3.7-flash",
    });
  } catch (error: any) {
    console.error("cURL test error:", error);
    res.status(500).json({
      error: error.message || "Failed to run cURL test prompt.",
    });
  }
});

// Start server with Vite middleware or static dist
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Cymbal Health AI Chef Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
