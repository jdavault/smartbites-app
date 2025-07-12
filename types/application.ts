import { Allergen } from './allergen';
import {
  GeneratedRecipe,
  Recipe,
  RecipeDocument,
  RecipeInput,
} from './recipes';

export interface AppContextType {
  appInitialized: boolean;
  selectedAllergens: Allergen[];
  toggleAllergen: (allergen: Allergen) => void;
  allergensList: Allergen[];
  recipes: Recipe[];
  getRecipes: () => Promise<void>;
  getUserAllergens: () => Promise<void>;
  getRecipeById: (recipeId: string) => Promise<RecipeDocument>;
  createRecipe: (userId: string, recipeData: RecipeInput) => Promise<void>;
  deleteRecipe: (userId: string, recipeId: string) => Promise<void>;
  searchHistory: GeneratedRecipe[];
  addToSearchHistory: (recipe: GeneratedRecipe) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  currentRecipe: GeneratedRecipe | null;
  setCurrentRecipe: (recipe: GeneratedRecipe | null) => void;
}
