export interface ChefFormData {
  cuisine: string;
  dietary_preference: string;
  allergy: string;
  ingredient_1: string;
  ingredient_2: string;
  ingredient_3: string;
  wine: "Red" | "White" | "None";
}

export interface IngredientItem {
  name: string;
  amount: string;
  isPantryItem: boolean;
}

export interface WinePairingInfo {
  recommendation: string;
  tastingNotes: string;
  servingTemperature?: string;
  nonAlcoholicAlternative?: string;
}

export interface NutritionalFactsInfo {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  sodiumMg: number;
  fiberGrams?: number;
  healthBenefits: string[];
}

export interface RecipeItem {
  title: string;
  description: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: number;
  difficulty?: string;
  calories: number;
  pantryIngredientsUsed: string[];
  fullIngredients: IngredientItem[];
  preparationInstructions: string[];
  winePairing: WinePairingInfo;
  nutritionalFacts: NutritionalFactsInfo;
  allergenSafetyVerification: string;
  cymbalWellnessTip: string;
}

export interface GenerateRecipeResponse {
  recipes: RecipeItem[];
  rawPromptUsed: string;
}

export interface LabTaskGuide {
  id: number;
  title: string;
  shortDesc: string;
  instructions: string[];
  codeSnippets: {
    filename?: string;
    language: string;
    code: string;
    description: string;
  }[];
  verificationTip: string;
}
