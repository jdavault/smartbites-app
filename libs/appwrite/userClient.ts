import { databases } from './config';
import { ID, Query, Permission, Role } from 'react-native-appwrite';
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

export const UserClient = {
  getUserAllergens: async (userId: string) => {
    try {
      const userAllergenLinks = await databases.listDocuments(
        DATABASE_ID,
        USER_ALLERGENS_COLLECTION_ID,
        [Query.equal('userId', userId)]
      );

      const allergenIds = userAllergenLinks.documents.map(
        (link) => link.allergenId
      );

      if (allergenIds.length === 0) {
        return [];
      }

      const allergenDocs = await databases.listDocuments(
        DATABASE_ID,
        ALLERGENS_COLLECTION_ID,
        [Query.equal('$id', allergenIds)]
      );

      const allergens = allergenDocs.documents.map((doc) => ({
        $id: doc.$id,
        name: doc.name,
        description: doc.description,
      }));
      return allergens;
    } catch (error) {
      console.error('Failed to fetch user allergens:', error);
      return [];
    }
  },

  updateUserAllergens: async (userId: string, allergens: Allergen[]) => {
    try {
      // First, delete any existing user_allergen documents
      const existing = await databases.listDocuments(
        DATABASE_ID,
        USER_ALLERGENS_COLLECTION_ID,
        [Query.equal('userId', userId)]
      );

      const deletePromises = existing.documents.map((doc) =>
        databases.deleteDocument(
          DATABASE_ID,
          USER_ALLERGENS_COLLECTION_ID,
          doc.$id
        )
      );

      await Promise.all(deletePromises);

      // Then, create new links for the selected allergens
      const createPromises = allergens.map((allergen) =>
        databases.createDocument(
          DATABASE_ID,
          USER_ALLERGENS_COLLECTION_ID,
          ID.unique(),
          {
            userId,
            allergenId: allergen.$id,
          },
          [
            Permission.read(Role.user(userId)),
            Permission.write(Role.user(userId)),
          ]
        )
      );

      await Promise.all(createPromises);
    } catch (error) {
      console.error('Failed to update user allergens:', error);
      throw error;
    }
  },
};
