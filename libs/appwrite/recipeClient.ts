import { databases, storage } from './config';
import { ID, Query, Permission, Role } from 'react-native-appwrite';
import {
  RecipeInput,
  RecipeDocument,
  UserRecipeDocument,
  UploadedFileDocument,
  AllergenDocument,
  ResolvedRecipeDocument,
} from '@/types/recipes';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Allergen } from '@/types/allergen';

const DATABASE_ID = process.env.EXPO_PUBLIC_SMART_BITES_DATABASE_ID!;
const USER_RECIPES_COLLECTION_ID =
  process.env.EXPO_PUBLIC_USER_RECIPES_COLLECTION_ID!;
const RECIPES_COLLECTION_ID = process.env.EXPO_PUBLIC_RECIPES_COLLECTION_ID!;

const USER_ALLERGENS_COLLECTION_ID =
  process.env.EXPO_PUBLIC_USER_ALLERGENS_COLLECTION_ID!;
const USER_SEARCH_HISTORY_COLLECTION_ID =
  process.env.EXPO_PUBLIC_USER_SEARCH_HISTORY_COLLECTION_ID!;
const ALLERGENS_COLLECTION_ID =
  process.env.EXPO_PUBLIC_ALLERGENS_COLLECTION_ID!;
const SMART_BITES_BUCKET_ID = process.env.EXPO_PUBLIC_SMART_BITES_BUCKET_ID!;

export const RecipeClient = {
  getRecipesByUser: async (userId: string) => {
    const userRecipeLinks = await databases.listDocuments<UserRecipeDocument>(
      DATABASE_ID,
      USER_RECIPES_COLLECTION_ID,
      [Query.equal('userId', userId)]
    );

    const recipes = await Promise.all(
      userRecipeLinks.documents.map(async (link) => {
        try {
          const recipeDoc = await databases.getDocument<RecipeDocument>(
            DATABASE_ID,
            RECIPES_COLLECTION_ID,
            link.recipeId
          );

          const allergenDocs = await Promise.all(
            (recipeDoc.allergens ?? []).map(async (allergenId: string) => {
              try {
                return await databases.getDocument(
                  DATABASE_ID,
                  ALLERGENS_COLLECTION_ID,
                  allergenId
                );
              } catch (err) {
                console.warn(`⚠️ Skipping missing allergenId: ${allergenId}`);
                return null;
              }
            })
          );

          const validAllergens = allergenDocs.filter(
            (a): a is AllergenDocument => !!a
          );

          // Resolve image URL
          let imageUrl = '';
          if (recipeDoc.imageFileId) {
            try {
              const preview = storage.getFilePreview(
                SMART_BITES_BUCKET_ID,
                recipeDoc.imageFileId
              );
              imageUrl = typeof preview === 'string' ? preview : preview.href;
            } catch (err) {
              console.warn(
                'Failed to fetch image preview for',
                recipeDoc.imageFileId
              );
            }
          }

          const testIsFavorite =
            link.actions?.includes('favorite') ?? undefined;

          // console.log(
          //   `RecipeClient: getRecipesByUser - testIsFavorite: ${testIsFavorite},  link.recipeId: ${link.recipeId}, link.actions: ${link.actions}`
          // );
          return {
            ...recipeDoc,
            allergens: validAllergens,
            imageUrl,
            isFavorite: link.actions?.includes('favorite') ?? undefined,
          };
        } catch (err) {
          console.warn(`⚠️ Skipping invalid recipe link: ${link.recipeId}`);
          return null;
        }
      })
    );

    return {
      documents: recipes.filter((r): r is ResolvedRecipeDocument => !!r),
    };
  },

  getGlobalRecipes: async (userId: string) => {
    // 1️⃣ Get recipe IDs the user already has
    const userRecipeLinks = await databases.listDocuments<UserRecipeDocument>(
      DATABASE_ID,
      USER_RECIPES_COLLECTION_ID,
      [Query.equal('userId', userId)]
    );

    const userRecipeIds = userRecipeLinks.documents.map(
      (link) => link.recipeId
    );

    // 2️⃣ Get ALL recipes (could add other filters too)
    const response = await databases.listDocuments(
      DATABASE_ID,
      RECIPES_COLLECTION_ID,
      [Query.limit(300)]
    );

    // 3️⃣ Filter out recipes the user already has
    const filteredRecipes = response.documents.filter((doc) => {
      return !userRecipeIds.includes(doc.$id);
    });

    // 4️⃣ Map + resolve allergens + images (same as your logic)
    const recipes = await Promise.all(
      filteredRecipes.map(async (doc) => {
        const allergenDocs = await Promise.all(
          ((doc.allergens ?? []) as string[]).map(
            async (allergenId: string) => {
              try {
                const result = await databases.getDocument(
                  DATABASE_ID,
                  ALLERGENS_COLLECTION_ID,
                  allergenId
                );
                return result;
              } catch (err) {
                console.warn(
                  `⚠️ Skipping missing allergenId: ${allergenId}`,
                  err
                );
                return null;
              }
            }
          )
        );

        const validAllergens = allergenDocs.filter((a): a is any => !!a);

        let imageUrl = '';
        if (doc.imageFileId) {
          try {
            const preview = storage.getFilePreview(
              SMART_BITES_BUCKET_ID,
              doc.imageFileId
            );
            imageUrl = typeof preview === 'string' ? preview : preview.href;
          } catch (err) {
            console.warn('Failed to fetch image preview for', doc.imageFileId);
          }
        }

        return {
          ...doc,
          allergens: validAllergens,
          imageUrl,
        };
      })
    );

    return { documents: recipes };
  },

  toggleFavorite: async (recipeId: string, userId: string) => {
    // Find the link doc for this user + recipe
    const linkDocs = await databases.listDocuments<UserRecipeDocument>(
      DATABASE_ID,
      USER_RECIPES_COLLECTION_ID,
      [Query.equal('userId', userId), Query.equal('recipeId', recipeId)]
    );

    if (linkDocs.total === 0) {
      console.warn('No user_recipe link found for this recipe and user.');
      return;
    }

    const link = linkDocs.documents[0];
    const actions = link.actions ?? [];

    let updatedActions: string[];
    if (actions.includes('favorite')) {
      // Remove favorite
      updatedActions = actions.filter((action) => action !== 'favorite');
    } else {
      // Add favorite
      updatedActions = [...actions, 'favorite'];
    }

    // Update the doc
    await databases.updateDocument(
      DATABASE_ID,
      USER_RECIPES_COLLECTION_ID,
      link.$id,
      { actions: updatedActions }
    );

    console.log(
      `User_recipes_collection_id: ${USER_RECIPES_COLLECTION_ID}, link.id: ${link.$id} Favorite toggled: ${updatedActions}`
    );
  },

  getRecipesByIds: async (recipeIds: string[]) => {
    const recipes = await databases.listDocuments<RecipeDocument>(
      DATABASE_ID,
      RECIPES_COLLECTION_ID,
      [Query.equal('$id', recipeIds)]
    );
    return recipes;
  },
  getRecipeByKey: async (recipeSearchKey: string) => {
    const existingRecipes = await databases.listDocuments<RecipeDocument>(
      DATABASE_ID,
      RECIPES_COLLECTION_ID,
      [Query.equal('searchKey', recipeSearchKey)]
    );
    return existingRecipes ? existingRecipes.documents[0] : null;
  },

  createRecipe: async (
    userId: string,
    data: RecipeInput
  ): Promise<ResolvedRecipeDocument> => {
    const recipeId = ID.unique();

    // 🔁 Step 1: Convert allergen names to IDs
    const nameQueries = data.allergens.map((name) =>
      Query.equal('name', name.trim())
    );

    let allergenResponse;

    if (nameQueries.length >= 2) {
      allergenResponse = await databases.listDocuments<AllergenDocument>(
        DATABASE_ID,
        ALLERGENS_COLLECTION_ID,
        [Query.or(nameQueries)]
      );
    } else if (nameQueries.length === 1) {
      allergenResponse = await databases.listDocuments<AllergenDocument>(
        DATABASE_ID,
        ALLERGENS_COLLECTION_ID,
        [nameQueries[0]]
      );
    } else {
      allergenResponse = { documents: [] };
    }

    const allergenIds = allergenResponse.documents.map((doc) => doc.$id);

    // Step 2: Create recipe document with allergen IDs
    const newRecipe = (await databases.createDocument(
      DATABASE_ID,
      RECIPES_COLLECTION_ID,
      recipeId,
      {
        ...data,
        allergens: allergenIds,
      },
      [
        Permission.read(Role.any()),
        Permission.write(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    )) as RecipeDocument;

    // Step 3: Create user-recipe link
    await databases.createDocument(
      DATABASE_ID,
      USER_RECIPES_COLLECTION_ID,
      ID.unique(),
      {
        userId,
        recipeId: newRecipe.$id,
      },
      [
        Permission.read(Role.any()),
        Permission.write(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    );

    // Step 4: Fetch full allergen docs
    const allergenDocs = await Promise.all(
      allergenIds.map(async (allergenId) => {
        try {
          return await databases.getDocument<AllergenDocument>(
            DATABASE_ID,
            ALLERGENS_COLLECTION_ID,
            allergenId
          );
        } catch (err) {
          console.warn(`⚠️ Skipping missing allergenId: ${allergenId}`);
          return null;
        }
      })
    );

    const validAllergens = allergenDocs.filter(
      (a): a is AllergenDocument => !!a
    );

    return {
      ...newRecipe,
      allergens: validAllergens,
      imageUrl: '',
      isFavorite: false,
    };
  },

  addRecipeToUser: async (
    userId: string,
    recipeId: string,
    actions: string[] = []
  ): Promise<void> => {
    // 🗒️ Check if the link already exists (optional safety)
    const existingLinks = await databases.listDocuments(
      DATABASE_ID,
      USER_RECIPES_COLLECTION_ID,
      [Query.equal('userId', userId), Query.equal('recipeId', recipeId)]
    );

    if (existingLinks.total > 0) {
      console.log(
        `🔗  DEBUG - recipeClient: User already has a link for recipe ${recipeId}`
      );
      return;
    }

    // ✅ Create the relationship
    await databases.createDocument(
      DATABASE_ID,
      USER_RECIPES_COLLECTION_ID,
      ID.unique(),
      {
        userId,
        recipeId,
        actions, // optional: initialize with ['favorite'] or ['save']
      },
      [
        Permission.read(Role.any()),
        Permission.write(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    );

    console.log(
      `✅ DEBUG - recipeClient: Added recipe ${recipeId} to user ${userId}`
    );
  },

  uploadImageToAppwriteStorage: async (
    input: Blob | string,
    fileName: string,
    userId: string
  ): Promise<UploadedFileDocument> => {
    const fileId = ID.unique();
    const bucketId = process.env.EXPO_PUBLIC_SMART_BITES_BUCKET_ID!;
    if (Platform.OS === 'web') {
      const blob = input as Blob;
      const uploadedFile = await storage.createFile(
        bucketId,
        fileId,
        blob as any,
        [Permission.read(Role.any()), Permission.write(Role.user(userId))]
      );
      return uploadedFile;
    } else {
      const uri = input as string;

      let fileStat: any;
      let normalizedUri = `file://${uri}`; // ✅ Correct double slash
      if (uri.startsWith('/data/')) {
        const normalizedUri = `file://${uri}`; // ✅ Correct double slash
        fileStat = await FileSystem.getInfoAsync(normalizedUri);
      } else {
        fileStat = await FileSystem.getInfoAsync(uri, { size: true });
      }
      const uploadedFile = await storage.createFile(
        bucketId,
        fileId,
        {
          uri: normalizedUri,
          name: fileName,
          type: 'image/png', // or detect from uri if you prefer
          size: fileStat.size ?? 0,
        },
        [Permission.read(Role.any()), Permission.write(Role.user(userId))]
      );

      return uploadedFile;
    }
  },

  updateRecipe: async (
    recipeId: string,
    fieldName: string,
    fieldValue: string
  ) => {
    await databases.updateDocument(
      process.env.EXPO_PUBLIC_SMART_BITES_DATABASE_ID!,
      process.env.EXPO_PUBLIC_RECIPES_COLLECTION_ID!,
      recipeId,
      { [fieldName]: fieldValue }
    );
  },

  getGlobalAllergen: async (): Promise<Allergen[]> => {
    try {
      const allergenDocs = await databases.listDocuments(
        DATABASE_ID,
        ALLERGENS_COLLECTION_ID
      );
      return allergenDocs.documents.map((doc) => ({
        $id: doc.$id,
        name: doc.name,
        description: doc.headNote,
      }));
    } catch (error) {
      console.error('Failed to fetch allergens:', error);
      return [];
    }
  },

  getImageUrl: async (
    imageFileId: string | undefined
  ): Promise<string | undefined> => {
    if (!imageFileId) return undefined;
    try {
      const preview = storage.getFilePreview(
        process.env.EXPO_PUBLIC_SMART_BITES_BUCKET_ID!,
        imageFileId
      );
      return typeof preview === 'string' ? preview : preview.href;
    } catch (err) {
      console.warn(`Failed to get image URL for fileId: ${imageFileId}`, err);
      return undefined;
    }
  },
};
