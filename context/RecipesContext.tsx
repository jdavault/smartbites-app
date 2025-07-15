import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Recipe, RecipeInput } from '@/types/recipes';
import { Allergen } from '@/types/allergen'; // ✅ must match the source used in the calling file
import {
  createRecipe,
  getGlobalRecipes,
  getRecipes as getRecipesByUser,
  toggleFavorite as updateFavorite,
  addRecipeToUser as addRecipeToUserService,
} from '@/services/recipe';
import { getUserAllergens, updateUserAllergens } from '@/services/userService';

type RecipesContextType = {
  recipes: Recipe[];
  favorites: Recipe[];
  featuredRecipes: Recipe[];
  filteredRecipes: Recipe[];
  isLoading: boolean;
  selectedAllergens: Allergen[];
  addRecipe: (recipe: RecipeInput) => Promise<Recipe>;
  getRecipes: (userId: string) => Promise<Recipe[]>;
  addRecipeToUser: (
    userId: string,
    recipeId: string,
    actions?: string[]
  ) => Promise<void>;
  updateRecipe: (id: string, recipeData: Partial<Recipe>) => Promise<Recipe>;
  deleteRecipe: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  applySelectedAllergens: (allergens: Allergen[]) => void;
  searchRecipes: (query: string) => Recipe[];
  removeFeaturedRecipe: (recipeId: string) => Promise<void>;
};

// Create context
const RecipesContext = createContext<RecipesContextType | undefined>(undefined);

// Provider component
export const RecipesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [selectedAllergens, setSelectedAllergens] = useState<Allergen[]>([]);
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecipeData = async () => {
      if (!user?.$id) return;

      setIsLoading(true);
      try {
        // Fetch global recipes and apply allergens (used for featured recipes)
        const allRecipes = await getGlobalRecipes(user.$id);
        console.log('Fetched global recipes count:', allRecipes.length);
        const allergenSafeRecipes = applyActiveAllergens(allRecipes);
        setFeaturedRecipes(pickFeaturedRecipes(allergenSafeRecipes));

        // Fetch user-specific recipes (user's own recipes)
        const userRecipes = await getRecipesByUser(user.$id);
        console.log('Fetched user recipes count:', userRecipes.length);
        setRecipes(userRecipes);
        setFilteredRecipes(applyActiveAllergens(userRecipes));

        const userAllergens = await getUserAllergens(user?.$id);
        setSelectedAllergens(userAllergens);
      } catch (err) {
        console.error('Failed to fetch recipes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipeData();
  }, [user?.$id]);

  // Add recipe to user
  const addRecipeToUser = async (
    userId: string,
    recipeId: string,
    actions: string[] = []
  ) => {
    try {
      console.log('DEBUG - RecipeContext:Adding recipe to user:', {
        userId,
        recipeId,
        actions,
      });
      await addRecipeToUserService(userId, recipeId, actions);
    } catch (error: any) {
      console.error('Error adding recipe to user:', error);
      throw new Error(error?.message ?? 'Failed to add recipe to user');
    }
  };

  // Add new recipe
  const addRecipe = async (
    recipeData: RecipeInput //Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!user?.$id) throw new Error('User must be logged in to add recipes');

    const newRecipe = await createRecipe(user.$id, recipeData);
    const updatedRecipes = [...recipes, newRecipe];
    setRecipes(updatedRecipes);
    setFilteredRecipes(applyActiveAllergens(updatedRecipes));
    return newRecipe;
  };

  const removeFeaturedRecipe = async (recipeId: string) => {
    setFeaturedRecipes((prev) =>
      prev.filter((recipe) => recipe.$id !== recipeId)
    );
  };

  // Update recipe
  const updateRecipe = async (id: string, recipeData: Partial<Recipe>) => {
    const recipeIndex = recipes.findIndex((r) => r.$id === id);
    if (recipeIndex === -1) throw new Error('Recipe not found');

    const updatedRecipe = {
      ...recipes[recipeIndex],
      ...recipeData,
      updatedAt: new Date().toISOString(),
    };

    const updatedRecipes = [...recipes];
    updatedRecipes[recipeIndex] = updatedRecipe;

    setRecipes(updatedRecipes);
    setFilteredRecipes(applyActiveAllergens(updatedRecipes));
    return updatedRecipe;
  };

  // Delete recipe
  const deleteRecipe = async (id: string) => {
    const updatedRecipes = recipes.filter((recipe) => recipe.$id !== id);
    setRecipes(updatedRecipes);
    setFilteredRecipes(applyActiveAllergens(updatedRecipes));
  };

  // Toggle favorite
  const toggleFavorite = async (id: string) => {
    const recipe = recipes.find((r) => r.$id === id);
    if (recipe) {
      await updateRecipe(id, { isFavorite: !recipe.isFavorite });

      if (user?.$id) {
        await updateFavorite(recipe.$id, user.$id);
      }
    }
  };

  // ⬇️ Context-level getRecipes that updates state
  const getRecipes = async (userId: string) => {
    if (!userId) return [];

    setIsLoading(true);
    try {
      const userRecipes = await getRecipesByUser(userId); // use your service
      console.log('Context: Fetched user recipes:', userRecipes.length);

      setRecipes(userRecipes);
      setFilteredRecipes(applyActiveAllergens(userRecipes));

      return userRecipes;
    } catch (err) {
      console.error('Failed to get recipes:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const pickFeaturedRecipes = (filtered: Recipe[], count: number = 5) => {
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  // Apply filters to recipes
  const applyActiveAllergens = (recipesToFilter: Recipe[]) => {
    if (selectedAllergens.length === 0) return recipesToFilter;

    return recipesToFilter.filter((recipe) => {
      return selectedAllergens.every(
        (filter) => !(recipe.allergens ?? []).some((a) => a.$id === filter.$id)
      );
    });
  };

  // Apply filters
  const applySelectedAllergens = async (allergens: Allergen[]) => {
    setSelectedAllergens(allergens);
    setFilteredRecipes(applyActiveAllergens(recipes));

    if (user?.$id) {
      try {
        await updateUserAllergens(user.$id, allergens);
      } catch (err) {
        console.error('Failed to persist user allergens:', err);
      }
    }
  };

  // Search recipes
  const searchRecipes = (query: string) => {
    if (!query.trim()) return filteredRecipes;

    const lowerCaseQuery = query.toLowerCase();
    return filteredRecipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(lowerCaseQuery) ||
        recipe.headNote.toLowerCase().includes(lowerCaseQuery) ||
        recipe.tags.some((tag) => tag.toLowerCase().includes(lowerCaseQuery))
    );
  };

  const contextValue = React.useMemo(() => {
    const favorites = recipes.filter((recipe) => recipe.isFavorite);

    return {
      recipes,
      favorites,
      featuredRecipes,
      filteredRecipes,
      isLoading,
      selectedAllergens,
      addRecipe,
      addRecipeToUser,
      updateRecipe,
      deleteRecipe,
      toggleFavorite,
      applySelectedAllergens,
      searchRecipes,
      getRecipes,
      removeFeaturedRecipe,
    };
  }, [recipes, filteredRecipes, isLoading, selectedAllergens]);

  return (
    <RecipesContext.Provider value={contextValue}>
      {children}
    </RecipesContext.Provider>
  );
};

// Custom hook for using the recipes context
export const useRecipes = () => {
  const context = useContext(RecipesContext);
  if (context === undefined) {
    throw new Error('useRecipes must be used within a RecipesProvider');
  }
  return context;
};
