import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useRecipes } from '@/context/RecipesContext';
import { Search, X } from 'lucide-react-native';
import { Spacing } from '@/constants/Spacing';
import { Fonts, FontSizes } from '@/constants/Typography';
import { generateRecipe } from '@/services/recipeAi';
import { Colors, ColorScheme } from '@/constants/Colors';
import { generateRecipeKey } from '@/utils/filenames';
import { addRecipeToUser, getRecipeUsingKey } from '@/services/recipe';
import { mapRecipeDocumentToGeneratedRecipe } from '@/services/mappers';
import { useAuth } from '@/context/AuthContext';

// const defaultRecipe = {
//   title: 'Wheat (Gluten)-Free Milk-Free Banana Pancakes',
//   description: 'Fluffy pancakes made with almond flour and ripe bananas.',
//   ingredients: [
//     '1 cup almond flour',
//     '2 bananas',
//     '2 eggs',
//     '1 tsp baking powder',
//   ],
//   instructions: ['Mash bananas', 'Mix ingredients', 'Cook on skillet'],
//   prepTime: '10 minutes',
//   cookTime: '15 minutes',
//   servings: 4,
//   difficulty: 'easy',
//   tags: ['breakfast', 'gluten-free', 'milk-free'],
//   allergens: [
//     { id: 2, name: 'eggs' },
//     { id: 1, name: 'almonds' },
//   ],
// };

export default function RecipeSearchBar() {
  const { colors: theme } = useTheme();
  const { user } = useAuth();
  const { getRecipes } = useRecipes();

  const styles = getStyles(theme);

  const { addRecipe, selectedAllergens } = useRecipes();
  const [query, setQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExistingRecipe, setIsExistingRecipe] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setIsModalVisible(true);

    try {
      const allergens = selectedAllergens.map(
        (a) => a.name.charAt(0).toUpperCase() + a.name.slice(1).toLowerCase()
      );

      const searchKey = generateRecipeKey(query, allergens);
      const existingRecipe = await getRecipeUsingKey(searchKey);

      if (existingRecipe) {
        if (user?.$id) {
          await addRecipeToUser(user.$id, existingRecipe.$id);
        }
        const recipe = mapRecipeDocumentToGeneratedRecipe(existingRecipe);
        recipe.searchKey = searchKey;
        setIsExistingRecipe(true);
        setGeneratedRecipe(recipe);
      } else {
        const recipe = await generateRecipe(query, allergens);
        recipe.searchKey = searchKey;
        setIsExistingRecipe(false); // Mark it as new
        setGeneratedRecipe(recipe);
      }
    } catch (err: any) {
      const errorMessage =
        err.message === 'OpenAI API key is not configured'
          ? 'OpenAI API key is not configured. Please check your environment settings.'
          : 'We were unable to generate a recipe. Please try again later.';

      setError(errorMessage);
      console.error('Recipe generation error:', err);
    } finally {
      console.log('SetIsLoadingFalse');
      setIsLoading(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!generatedRecipe) return;

    if (isExistingRecipe) {
      // Already linked to user in handleSearch, nothing else to do
      setIsModalVisible(false);
      setQuery('');
      setGeneratedRecipe(null);
      if (user?.$id) {
        await getRecipes(user.$id);
      }
      return;
    }

    setIsSaving(true); // Start spinner
    try {
      await addRecipe({
        ...generatedRecipe,
        tags: [],
      });
      setIsModalVisible(false);
      setQuery('');
      setGeneratedRecipe(null);
    } catch (err) {
      console.error('Error saving recipe:', err);
    } finally {
      setIsSaving(false); // Stop spinner
    }
  };

  const renderModalContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text
            style={[
              styles.loadingText,
              { color: theme.textPrimary, marginTop: 12 },
            ]}
          >
            🍳 Cooking up something delicious just for you...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { fontSize: 18 }]}>
            😔 Oops! Something went wrong
          </Text>
          <Text style={[styles.errorText, { marginTop: 8 }]}>{error}</Text>
        </View>
      );
    }

    if (generatedRecipe) {
      return (
        <ScrollView contentContainerStyle={styles.recipeContainer}>
          <Text style={[styles.recipeTitle, { color: theme.textPrimary }]}>
            {generatedRecipe.title}
          </Text>
          <Text
            style={[styles.recipeDescription, { color: theme.textPrimary }]}
          >
            {generatedRecipe.description}
          </Text>

          <View style={styles.metaInfo}>
            <Text style={[styles.metaText, { color: theme.textPrimary }]}>
              Prep Time: {generatedRecipe.prepTime} mins
            </Text>
            <Text style={[styles.metaText, { color: theme.textPrimary }]}>
              Cook Time: {generatedRecipe.cookTime} mins
            </Text>
            <Text style={[styles.metaText, { color: theme.textPrimary }]}>
              Servings: {generatedRecipe.servings}
            </Text>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Ingredients
          </Text>
          {generatedRecipe.ingredients.map(
            (ingredient: string, index: number) => (
              <Text
                key={ingredient + index}
                style={[styles.listItem, { color: theme.textPrimary }]}
              >
                • {ingredient}
              </Text>
            )
          )}

          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Instructions
          </Text>
          {generatedRecipe.instructions.map(
            (instruction: string, index: number) => (
              <Text
                key={instruction + index}
                style={[styles.listItem, { color: theme.textPrimary }]}
              >
                {index + 1}. {instruction}
              </Text>
            )
          )}

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveRecipe}
            disabled={isSaving}
          >
            {isSaving ? (
              <View style={{ alignItems: 'center' }}>
                <ActivityIndicator color="white" />
                <Text
                  style={[styles.saveButtonText, { marginTop: 8 }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  🧠 Generating image...
                </Text>
              </View>
            ) : (
              <Text style={styles.saveButtonText}>Save Recipe</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.searchBar, { backgroundColor: theme.card }]}>
        <Search size={20} color={theme.textPrimary} style={styles.searchIcon} />
        <TextInput
          style={[styles.input, { color: theme.textPrimary }]}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          placeholder="Ask AI to create a recipe..."
          placeholderTextColor={Colors.dark[500]}
          onSubmitEditing={handleSearch}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <X size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View
          style={[styles.modalContainer, { backgroundColor: theme.background }]}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            {!isLoading && (
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                  Generated Recipe
                </Text>
                <TouchableOpacity
                  onPress={() => setIsModalVisible(false)}
                  style={styles.closeButton}
                >
                  <X size={24} color={theme.textPrimary} />
                </TouchableOpacity>
              </View>
            )}
            {renderModalContent()}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const getStyles = (theme: typeof ColorScheme.light) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.md,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    searchIcon: {
      marginRight: Spacing.sm,
    },
    input: {
      flex: 1,
      fontFamily: Fonts.body,
      fontSize: FontSizes.md,
      marginRight: Spacing.sm,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      padding: Spacing.md,
    },
    modalContent: {
      borderRadius: 16,
      padding: Spacing.lg,
      maxHeight: '90%',
      width: '100%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    modalTitle: {
      fontFamily: Fonts.heading,
      fontSize: FontSizes.xl,
    },
    closeButton: {
      padding: Spacing.xs,
    },
    loadingContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 300, // ensures there's room for both spinner and text
      padding: Spacing.lg,
    },
    loadingText: {
      fontSize: 16,
      fontFamily: 'Lato-Regular',
      textAlign: 'center',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    errorText: {
      fontFamily: 'Lato-Regular',
      color: Colors.warning ?? 'crimson',
      textAlign: 'center',
    },

    recipeContainer: {
      //flex: 1,
      paddingHorizontal: Spacing.sm,
      paddingBottom: 40,
    },
    recipeTitle: {
      fontFamily: Fonts.heading,
      fontSize: FontSizes.xxl,
      marginBottom: Spacing.sm,
    },
    recipeDescription: {
      fontFamily: Fonts.body,
      fontSize: FontSizes.md,
      marginBottom: Spacing.lg,
    },
    metaInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: Spacing.lg,
    },
    metaText: {
      fontFamily: Fonts.body,
      fontSize: FontSizes.sm,
    },
    sectionTitle: {
      fontFamily: Fonts.headingBold,
      fontSize: FontSizes.lg,
      marginTop: Spacing.lg,
      marginBottom: Spacing.md,
    },
    listItem: {
      fontFamily: Fonts.body,
      fontSize: FontSizes.md,
      marginBottom: Spacing.sm,
    },
    saveButton: {
      backgroundColor: theme.primary,
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.xxl,
      borderRadius: 6,
      alignItems: 'center',
      alignSelf: 'center', // 👈 Prevents full width
      marginTop: Spacing.xl,
      marginBottom: Spacing.xl,
      minWidth: 240,
    },
    saveButtonText: {
      color: Colors.white,
      fontFamily: Fonts.bodyBold,
      fontSize: FontSizes.md,
    },
  });
