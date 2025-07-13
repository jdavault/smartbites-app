import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

import { Allergen, AllergenName } from '@/types/allergen';
import { Colors, ColorScheme } from '@/constants/Colors';
import { Spacing, BorderRadius } from '@/constants/Spacing';
import { Fonts, FontSizes, LineHeights } from '@/constants/Typography';
import { Clock, Users, Heart, Bookmark } from 'lucide-react-native';
import { Recipe } from '@/types/recipes';
import { useTheme } from '@/context/ThemeContext';

const DEFAULT_IMAGE_URL =
  'https://nyc.cloud.appwrite.io/v1/storage/buckets/68368e5d00312b9245cb/files/68400e780026b56c099a/view?project=68351744000a63ee4a53&mode=admin';

type RecipeCardProps = {
  readonly recipe: Recipe;
  readonly onToggleFavorite?: (id: string) => void;
  readonly from?: 'home' | 'saved';
  readonly onSave?: (recipe: Recipe) => void;
  readonly isFeatured?: boolean;
};

export default function RecipeCard(props: RecipeCardProps) {
  const {
    recipe,
    onToggleFavorite,
    from = 'home',
    onSave,
    isFeatured = false,
  } = props;
  const { colors: theme } = useTheme();
  const styles = getStyles(theme);
  const router = useRouter();

  console.log('RecipeCard Props3:', { isFeatured, from });

  const allergenLabels: Record<AllergenName, string> = {
    Eggs: 'Egg-Free',
    Fish: 'Fish-Free',
    Milk: 'Milk-Free',
    Peanuts: 'Peanut-Free',
    Sesame: 'Sesame-Free',
    Shellfish: 'Shellfish-Free',
    Soybeans: 'Soybean-Free',
    'Tree Nuts': 'Tree Nut-Free',
    'Wheat (Gluten)': 'Gluten-Free',
  };
  // Get list of allergens this recipe is free from
  const allergenFreeLabels = Object.entries(allergenLabels)
    .filter(([allergenKey]) =>
      (recipe.allergens ?? []).every((a) => a !== allergenKey)
    )
    .map(([_, label]) => label);

  const goToRecipeDetail = () => {
    router.push({ pathname: '/recipe/[id]', params: { id: recipe.$id, from } });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        if (isFeatured) {
          Alert.alert(
            'Save to View',
            'Please save this recipe to your recipes to view the full details.'
          );
        } else {
          goToRecipeDetail();
        }
      }}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: recipe.imageUrl?.trim() || DEFAULT_IMAGE_URL }}
          style={styles.image}
          resizeMode="cover"
        />
        {!recipe.imageUrl && (
          <View style={styles.imageOverlay}>
            <Text style={styles.processingText}>
              🍳 We're still cooking your image... try again soon!
            </Text>
          </View>
        )}
      </View>

      {!isFeatured ? (
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => onToggleFavorite?.(recipe.$id)}
        >
          <Heart
            color={recipe.isFavorite ? Colors.error : Colors.rice[700]}
            fill={recipe.isFavorite ? Colors.error : 'none'}
            size={22}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => onSave?.(recipe)}
        >
          <Bookmark color={Colors.rice[700]} fill="none" size={22} />
        </TouchableOpacity>
      )}

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {recipe.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {recipe.description}
        </Text>

        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Clock size={16} color={Colors.dark[500]} />
            <Text style={styles.metaText}>
              {recipe.prepTime + recipe.cookTime} min
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Users size={16} color={Colors.dark[500]} />
            <Text style={styles.metaText}>
              {recipe.servings} {recipe.servings === 1 ? 'serving' : 'servings'}
            </Text>
          </View>
        </View>

        <View style={styles.allergenContainer}>
          {allergenFreeLabels.slice(0, 3).map((label, index) => (
            <View
              key={index}
              style={[
                styles.allergenBadge,
                index % 3 === 0
                  ? { backgroundColor: theme.primary[100] }
                  : index % 3 === 1
                  ? { backgroundColor: theme.secondary[100] }
                  : { backgroundColor: theme.accent[100] },
              ]}
            >
              <Text
                style={[
                  styles.allergenText,
                  index % 3 === 0
                    ? { color: theme.primary[700] }
                    : index % 3 === 1
                    ? { color: theme.secondary[700] }
                    : { color: theme.accent[700] },
                ]}
              >
                {label}
              </Text>
            </View>
          ))}

          {allergenFreeLabels.length > 3 && (
            <View style={styles.allergenBadge}>
              <Text style={styles.allergenText}>
                +{allergenFreeLabels.length - 3}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const getStyles = (theme: typeof ColorScheme.light) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.card,
      borderRadius: BorderRadius.lg,
      overflow: 'hidden',
      shadowColor: theme.accentDark,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      marginBottom: Spacing.lg,
      width: '100%',
    },
    favoriteButton: {
      position: 'absolute',
      top: Spacing.md,
      right: Spacing.md,
      backgroundColor: theme.background + '90',
      borderRadius: BorderRadius.full,
      padding: Spacing.xs,
      zIndex: 1,
    },
    content: {
      padding: Spacing.md,
    },
    title: {
      fontFamily: Fonts.heading,
      fontSize: FontSizes.xl,
      color: theme.accentDark,
      marginBottom: Spacing.xs,
      lineHeight: FontSizes.xl * LineHeights.tight,
    },
    description: {
      fontFamily: Fonts.body,
      fontSize: FontSizes.sm,
      color: theme.accentDark,
      marginBottom: Spacing.md,
      lineHeight: FontSizes.sm * LineHeights.normal,
    },
    metaContainer: {
      flexDirection: 'row',
      marginBottom: Spacing.md,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: Spacing.lg,
    },
    metaText: {
      fontFamily: Fonts.body,
      fontSize: FontSizes.xs,
      color: theme.accentDark,
      marginLeft: Spacing.xs,
    },
    allergenContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    allergenBadge: {
      backgroundColor: theme.accentLight,
      borderRadius: BorderRadius.full,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 4,
      marginRight: Spacing.xs,
      marginBottom: Spacing.xs,
    },
    allergenText: {
      fontFamily: Fonts.body,
      fontSize: FontSizes.xs,
      color: theme.textSecondary,
    },
    imageContainer: {
      position: 'relative',
      width: '100%',
      height: 220,
    },
    image: {
      width: '100%',
      height: 180,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
    },
    imageOverlay: {
      position: 'absolute',
      bottom: 10,
      left: 10,
      right: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      padding: 8,
      borderRadius: 8,
    },
    processingText: {
      color: 'white',
      fontSize: 14,
      textAlign: 'center',
      fontStyle: 'italic',
    },
  });
