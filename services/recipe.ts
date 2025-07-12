import { databases } from '@/libs/appwrite/config';
import {
  GeneratedRecipe,
  Recipe,
  RecipeInput,
  ResolvedRecipeDocument,
} from '@/types/recipes';
import { Query } from 'react-native-appwrite';
import {
  mapDocumentToGeneratedRecipe,
  mapGlobalRecipeDocument,
} from './mappers';
import { RecipeClient } from '@/libs/appwrite/recipeClient';
import { mapRecipeDocument } from '@/services/mappers';
import { generateRecipeImage } from './recipeAi';
import { fetchImageBlob } from '@/libs/axios/apiClient';
import { formatImageName } from '@/utils/filenames';
import { Allergen } from '@/types/allergen';

export async function getRecipeUsingKey(recipeSearchKey: string) {
  const recipe = await RecipeClient.getRecipeByKey(recipeSearchKey);
  return recipe;
}
export async function getGlobalRecipes(userId: string): Promise<Recipe[]> {
  const response = await RecipeClient.getGlobalRecipes(userId);
  const mappedRecipes: Recipe[] = response.documents.map((doc: any) =>
    mapGlobalRecipeDocument(doc)
  );
  return mappedRecipes;
}

export async function toggleFavorite(
  recipeId: string,
  userId: string
): Promise<void> {
  try {
    await RecipeClient.toggleFavorite(recipeId, userId);
  } catch (error: any) {
    console.error('Error updating favorites:', error);
    throw new Error(error?.message ?? 'Failed to fetch recipes');
  }
}
export async function getRecipes(userId: string): Promise<Recipe[] | []> {
  try {
    const response = await RecipeClient.getRecipesByUser(userId);

    const mappedRecipes: Recipe[] = await Promise.all(
      response.documents
        .filter((doc) => doc !== null)
        .map(async (doc) => {
          const imageUrl = await RecipeClient.getImageUrl(doc.imageFileId);
          return {
            ...mapRecipeDocument(doc),
            imageUrl,
          };
        })
    );

    // const mappedFavorites = mappedRecipes
    //   .filter((recipe) => recipe?.isFavorite)
    //   .map((recipe) => ({
    //     title: recipe.title,
    //     isFavorite: recipe.isFavorite,
    //   }));

    // console.log('⭐️ Favorite Recipes:', mappedFavorites);
    return mappedRecipes;
  } catch (error: any) {
    console.error('Error fetching recipes:', error);
    throw new Error(error?.message ?? 'Failed to fetch recipes');
  }
}

export async function addRecipeToUser(
  userId: string,
  recipeId: string,
  actions: string[] = []
): Promise<void> {
  try {
    await RecipeClient.addRecipeToUser(userId, recipeId, actions);
  } catch (error: any) {
    console.error('Error adding recipe to user:', error);
    throw new Error(error?.message ?? 'Failed to add recipe to user');
  }
}

export async function createRecipe(
  userId: string,
  data: RecipeInput
): Promise<Recipe> {
  try {
    console.log('-------------------- recipe.ts: allergens', data.allergens);

    const newRecipeDoc = await RecipeClient.createRecipe(userId, data);
    console.log('Recipe created');

    if (!newRecipeDoc?.$id) {
      throw new Error('Failed to create recipe');
    }

    const tempAIGeneratedImageUrl = await persistRecipeImage({
      recipeTitle: data.title,
      searchQuery: data.searchQuery ?? data.title,
      recipeId: newRecipeDoc.$id,
      allergenNames: data.allergens,
      userId,
    });

    console.log('✅ Recipe and image relationship created');
    const newRecipe = mapRecipeDocument(newRecipeDoc as ResolvedRecipeDocument);
    newRecipe.imageUrl = tempAIGeneratedImageUrl; // Use the temporary image URL
    return newRecipe;
  } catch (error: any) {
    if (error instanceof Error) {
      console.warn('⚠️ Image upload failed:', error.message);
    } else {
      console.warn('⚠️ Image upload failed:', error);
    }
    throw new Error(error?.message ?? 'Error creating recipe');
  }
}

export async function fetchUsingKey(
  recipeKey: string
): Promise<GeneratedRecipe | null> {
  try {
    const result = await databases.listDocuments(
      process.env.EXPO_PUBLIC_SMART_BITES_DATABASE_ID!,
      process.env.EXPO_PUBLIC_RECIPES_COLLECTION_ID!,
      [Query.equal('recipeKey', recipeKey), Query.limit(1)]
    );

    if (!result) return null;

    const recipe = mapDocumentToGeneratedRecipe(
      result.documents[0] as ResolvedRecipeDocument
    );

    return recipe;
  } catch (error) {
    console.error('Error fetching recipe by key:', error);
    return null;
  }
}

export async function getGlobalAllergen(): Promise<Allergen[]> {
  try {
    const allergens = await RecipeClient.getGlobalAllergen();
    return allergens;
  } catch (error) {
    console.error('Failed to fetch allergens:', error);
    return [];
  }
}

async function persistRecipeImage({
  recipeTitle,
  searchQuery,
  allergenNames,
  recipeId,
  userId,
}: {
  recipeTitle: string;
  searchQuery: string;
  recipeId: string;
  allergenNames: string[];
  userId: string;
}): Promise<string> {
  const preSignedImageUrl = await generateRecipeImage(recipeTitle);
  // console.log(
  //   `Generated pre-signed image URL: ${preSignedImageUrl} for recipeId: ${recipeId}`
  // );
  const blob = await fetchImageBlob(preSignedImageUrl);
  if (!blob) {
    // console.log(`Returning BLOB - type: ${typeof blob}`);
    // console.log(`Returning BLOB - blob: ${JSON.stringify(blob)}`);
  }

  // console.log(`No blob found searchQuery: ${searchQuery}`);
  const fileName = formatImageName(searchQuery, allergenNames, 'png');

  // console.log(`No blob found ---- fileName: ${fileName}`);
  // console.log(`No blob found ---- fileName: ${JSON.stringify(blob)}`);
  const uploadedFile = await RecipeClient.uploadImageToAppwriteStorage(
    blob,
    fileName,
    userId
  );
  console.log(`UPLOAD file (so close): ${JSON.stringify(uploadedFile)}`);

  await RecipeClient.updateRecipe(recipeId, 'imageFileId', uploadedFile.$id);
  //it takes appwrite a while to set the image, so we return and temporarily use the OpenAI pre-signed URL
  return preSignedImageUrl;
}
