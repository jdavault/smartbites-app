// services/allergenService.ts
import { databases } from '../libs/appwrite/config';
import { ID, Query } from 'react-native-appwrite';
import { Allergen } from '@/types/allergen';

export async function getGlobalAllergen(): Promise<Allergen[]> {
  const response = await databases.listDocuments(
    process.env.EXPO_PUBLIC_SMART_BITES_DATABASE_ID!,
    process.env.EXPO_PUBLIC_ALLERGENS_COLLECTION_ID!
  );

  return response.documents.map((doc) => ({
    $id: doc.$id,
    name: doc.name,
    description: doc.description,
  })) as Allergen[];
}

export async function saveUserAllergens(
  userId: string,
  selectedAllergens: Allergen[]
): Promise<void> {
  try {
    console.debug('--------- allergenServices:saveUserAllergens()', {
      userId,
      selectedAllergens,
    });
    for (const allergen of selectedAllergens) {
      await databases.createDocument(
        process.env.EXPO_PUBLIC_SMART_BITES_DATABASE_ID!,
        process.env.EXPO_PUBLIC_USER_ALLERGENS_COLLECTION_ID!,
        ID.unique(),
        {
          userId: userId,
          allergenId: allergen.$id,
        }
      );
    }
  } catch (error) {
    console.log('Error', error);
  }
}
