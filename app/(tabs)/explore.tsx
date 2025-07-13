import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Platform,
  Image,
  RefreshControl,
} from 'react-native';

import IconLogo from '@/assets/images/smart-bites-logo.png';
import { useRecipes } from '@/context/RecipesContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import RecipeCard from '@/components/RecipeCard';
import AllergenFilter from '@/components/AllergenFilter';
import RecipeSearchBar from '@/components/RecipeSearchBar';
import { Spacing } from '@/constants/Spacing';
import { Fonts, FontSizes } from '@/constants/Typography';
import { Allergen } from '@/types/allergen';
import { Recipe } from '@/types/recipes';
import { useCallback, useState } from 'react';

export default function HomeScreen() {
  const { user } = useAuth();
  const { colors: theme } = useTheme();
  const {
    recipes,
    favorites,
    addRecipeToUser,
    featuredRecipes,
    toggleFavorite,
    selectedAllergens,
    applySelectedAllergens,
    getRecipes,
    removeFeaturedRecipe,
  } = useRecipes();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (user?.$id) {
        await Promise.all([getRecipes(user?.$id)]);
      }
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  }, [user]);
  const handleSaveRecipe = async (recipe: Recipe) => {
    if (!recipe) return;

    try {
      if (user?.$id) {
        await addRecipeToUser(user?.$id, recipe.$id);
        await getRecipes(user?.$id);
        await removeFeaturedRecipe(recipe.$id);
      }
    } catch (err) {
      console.error('Error saving recipe:', err);
      alert('Failed to save recipe. Please try again later.');
    }
  };

  // Get recently added recipes
  const recentRecipes = [...recipes]
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 5);

  // Function to clear all filters
  const clearFilters = () => {
    applySelectedAllergens([]);
  };

  // Function to toggle a filter
  const handleToggleFilter = (allergen: Allergen) => {
    const isAlreadySelected = selectedAllergens.some(
      (a) => a.$id === allergen.$id
    );

    const updatedFilters = isAlreadySelected
      ? selectedAllergens.filter((a) => a.$id !== allergen.$id)
      : [...selectedAllergens, allergen];

    applySelectedAllergens(updatedFilters);
  };

  const hasFeatured = featuredRecipes.length > 0;
  const hasFavorites = favorites.length > 0;
  const hasRecent = recentRecipes.length > 0;
  const hasAnyRecipes = hasFeatured || hasFavorites || hasRecent;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={[styles.header, { backgroundColor: theme.card }]}>
          <View>
            <Text style={[styles.greeting, { color: theme.textPrimary }]}>
              Hi, {user?.firstName || 'There'}!
            </Text>
            <Text style={[styles.subtitle, { color: theme.textPrimary }]}>
              What would you like to cook today?
            </Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.logoContainer}>
              <Image
                source={IconLogo}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        <RecipeSearchBar />
        <AllergenFilter
          selectedAllergens={selectedAllergens}
          onToggleFilter={handleToggleFilter}
          onClearFilters={clearFilters}
        />

        {!hasAnyRecipes && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              You don’t have any recipes yet 🫣
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 16 }}>
              Let’s get started by exploring or creating something delicious!
            </Text>
          </View>
        )}

        {hasFeatured && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              🌟 Featured Recipes
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              {featuredRecipes.slice(0, 5).map((recipe, index) => (
                <View key={recipe.$id + index} style={styles.cardWrapper}>
                  <RecipeCard
                    from="explore"
                    recipe={recipe}
                    isFeatured={true}
                    onSave={handleSaveRecipe}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {hasFavorites && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              ❤️ Your Favorites
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              {favorites.map((recipe, index) => (
                <View key={recipe.$id + index} style={styles.cardWrapper}>
                  <RecipeCard
                    from="explore"
                    recipe={recipe}
                    onToggleFavorite={toggleFavorite}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {hasRecent && (
          <View style={[styles.section, styles.lastSection]}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              🕑 Recently Added
            </Text>
            <View style={styles.verticalList}>
              {recentRecipes.map((recipe, index) => (
                <RecipeCard
                  from="explore"
                  key={recipe.$id + index}
                  recipe={recipe}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: Spacing.md,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  greeting: {
    fontFamily: Fonts.heading,
    fontSize: FontSizes.xxl,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.md,
  },
  logoContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  lastSection: {
    paddingBottom: Spacing.xxxl,
  },
  sectionTitle: {
    fontFamily: Fonts.heading,
    fontSize: FontSizes.lg,
    marginBottom: Spacing.md,
  },
  horizontalList: {
    paddingRight: Spacing.md,
  },
  cardWrapper: {
    width: 280,
    marginRight: Spacing.md,
  },
  verticalList: {
    width: '100%',
  },
  logo: {
    width: 60,
    height: 60,
  },
});
