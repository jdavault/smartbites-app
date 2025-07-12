import {
  GeneratedRecipe,
  Recipe,
  RecipeDocument,
  RecipeInput,
  ResolvedRecipeDocument,
  UserRecipeDocument,
} from '@/types/recipes';

export function mapRecipeDocumentToGeneratedRecipe(
  doc: RecipeDocument
): GeneratedRecipe {
  return {
    title: doc.title,
    description: doc.description,
    ingredients: doc.ingredients,
    instructions: doc.instructions,
    allergens: doc.allergens,
    prepTime: Number.parseInt(doc.prepTime),
    cookTime: Number.parseInt(doc.cookTime),
    servings: doc.servings,
    difficulty: doc.difficulty as Recipe['difficulty'], // cast if needed
    tags: doc.tags,
    searchQuery: doc.searchQuery,
    searchKey: doc.searchKey,
    createdAt: doc.$createdAt,
    updatedAt: doc.$updatedAt,
  };
}

export function mapRecipeDocument(
  doc: ResolvedRecipeDocument,
  userDoc?: UserRecipeDocument
): Recipe {
  return {
    $id: doc.$id,
    title: doc.title,
    description: doc.description,
    ingredients: doc.ingredients,
    instructions: doc.instructions,
    prepTime: Number.parseInt(doc.prepTime),
    cookTime: Number.parseInt(doc.cookTime),
    servings: doc.servings,
    difficulty: doc.difficulty as Recipe['difficulty'], // cast if needed
    tags: doc.tags,
    allergens: doc.allergens,
    searchQuery: doc.searchQuery,
    searchKey: doc.searchKey,
    createdAt: doc.$createdAt,
    updatedAt: doc.$updatedAt,
    isFavorite: doc.isFavorite,
  };
}

export function mapDocumentToGeneratedRecipe(
  doc: ResolvedRecipeDocument
): GeneratedRecipe {
  return {
    title: doc.title,
    description: doc.description,
    ingredients: doc.ingredients,
    instructions: doc.instructions,
    prepTime: Number.parseInt(doc.prepTime),
    cookTime: Number.parseInt(doc.cookTime),
    servings: doc.servings,
    difficulty: doc.difficulty as Recipe['difficulty'], // cast if needed
    tags: doc.tags,
    allergens: doc.allergens,
    searchQuery: doc.searchQuery,
    searchKey: doc.searchKey,
    createdAt: doc.$createdAt,
    updatedAt: doc.$updatedAt,
  };
}

export function mapGlobalRecipeDocument(doc: ResolvedRecipeDocument): Recipe {
  return {
    $id: doc.$id,
    title: doc.title,
    description: doc.description,
    ingredients: doc.ingredients,
    instructions: doc.instructions,
    prepTime: Number.parseInt(doc.prepTime),
    cookTime: Number.parseInt(doc.cookTime),
    servings: doc.servings,
    difficulty: doc.difficulty as Recipe['difficulty'], // cast if needed
    tags: doc.tags,
    allergens: doc.allergens,
    searchQuery: doc.searchQuery,
    searchKey: doc.searchKey,
    createdAt: doc.$createdAt,
    updatedAt: doc.$updatedAt,
    imageUrl: doc.imageUrl || 'placeholder', // ensure imageUrl is always present
  };
}

export function mapRecipeInput(recipe: GeneratedRecipe): RecipeInput {
  return {
    title: recipe.title,
    description: recipe.description,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    servings: recipe.servings,
    difficulty: recipe.difficulty as Recipe['difficulty'], // cast if needed
    tags: recipe.tags,
    allergens: recipe.allergens,
    searchQuery: recipe.searchQuery || 'no search query',
    searchKey: recipe.searchKey || 'no search key',
    imageUrl: 'placeholder', // ensure imageUrl is always present
  };
}
