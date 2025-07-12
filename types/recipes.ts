import { ReactNode } from 'react';
import { AppContextType } from './application';
import { Allergen } from './allergen';

export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export type RecipeInput = {
  isFavorite?: boolean;
  imageUrl?: string; // URL of the recipe image
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  allergens: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: Difficulty;
  tags: string[];
  searchQuery?: string;
  searchKey?: string;
};

export interface Recipe extends GeneratedRecipe {
  $id: string;
  isFavorite?: boolean;
  imageUrl?: string; // URL of the recipe image
}

export interface GeneratedRecipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  //allergens?: Allergen[];
  allergens?: string[]; // Array of allergen names
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: Difficulty;
  tags: string[];
  searchQuery?: string;
  searchKey?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RecipeContextType
  extends Pick<
    AppContextType,
    | 'recipes'
    | 'createRecipe'
    | 'getRecipes'
    | 'deleteRecipe'
    | 'searchHistory'
    | 'addToSearchHistory'
    | 'isLoading'
    | 'setIsLoading'
    | 'setCurrentRecipe'
    | 'currentRecipe'
    | 'error'
  > {
  searchRecipes: (query: string, allergens: string[]) => Promise<void>;
  clearCurrentRecipe: () => void;
}

export interface RecipesProviderProps {
  readonly children: ReactNode;
}

export interface Document {
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $permissions: string[];
  $createdAt: string;
  $updatedAt: string;
}
export interface UserRecipeDocument {
  $id: string;
  userId: string;
  recipeId: string;
  actions?: string[];
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
}

export interface UserAllergenDocument extends Document {
  userId: string;
  allergenId: string;
}
export interface AllergenDocument extends Document {
  name: string;
  description: string;
}
export interface RecipeDocument extends Document {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty: string;
  tags: string[];
  searchQuery: string;
  searchKey: string;
  allergens: string[];
  imageFileId?: string;
  imageUrl?: string; // URL of the recipe image
}

export interface ResolvedRecipeDocument
  extends Omit<RecipeDocument, 'allergens'> {
  allergens: AllergenDocument[];
  imageUrl: string;
  isFavorite: boolean;
}

export interface UploadedFileDocument {
  bucketId: string;
  name: string;
  signature: string;
  mimeType: string;
  sizeOriginal: number;
  chunksTotal: number;
  chunksUploaded: number;
  $id: string;
  $permissions: string[];
  $createdAt: string;
  $updatedAt: string;
}
