import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useRecipes } from '@/context/RecipesContext';
import RecipeCard from '@/components/RecipeCard';
import { Spacing } from '@/constants/Spacing';
import { Fonts, FontSizes } from '@/constants/Typography';

export default function SavedRecipesScreen() {
  const { colors } = useTheme();
  const { recipes, toggleFavorite } = useRecipes();

  const sortedRecipes = [...recipes].sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) {
      return b.isFavorite ? 1 : -1; // Favorites first
    }
    return (
      new Date(b.createdAt ?? '').getTime() -
      new Date(a.createdAt ?? '').getTime()
    ); // Newest first
  });

  const hasAnyRecipes = sortedRecipes.length > 0;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Saved Recipes
        </Text>

        {hasAnyRecipes ? (
          sortedRecipes.map((recipe) => (
            <View key={recipe.$id} style={styles.cardWrapper}>
              <RecipeCard
                from="saved"
                recipe={recipe}
                onToggleFavorite={toggleFavorite}
              />
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
              You don’t have any recipes yet 🫣
            </Text>
            <Text
              style={[styles.emptySubtitle, { color: colors.textSecondary }]}
            >
              Let’s get started by exploring or creating something delicious!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  title: {
    fontFamily: Fonts.heading,
    fontSize: FontSizes.lg,
    marginBottom: Spacing.lg,
  },
  cardWrapper: {
    marginBottom: Spacing.lg,
  },
  emptyState: {
    marginTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  emptyTitle: {
    fontFamily: Fonts.heading,
    fontSize: FontSizes.lg,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.md,
    textAlign: 'center',
  },
});
