import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useRecipes } from '@/context/RecipesContext';
import { Colors, ColorScheme } from '@/constants/Colors';
import { FontSizes, Fonts } from '@/constants/Typography';
import Spacer from '@/components/Spacer';
import { useTheme } from '@/context/ThemeContext';

const DEFAULT_IMAGE_URL =
  'https://nyc.cloud.appwrite.io/v1/storage/buckets/68368e5d00312b9245cb/files/68400e780026b56c099a/view?project=68351744000a63ee4a53&mode=admin';

const RecipeDetail = () => {
  const { id, from } = useLocalSearchParams();
  const router = useRouter();
  const { recipes } = useRecipes();
  const { colors: theme } = useTheme();
  const styles = getStyles(theme);

  const recipe = recipes.find((r) => r.$id === id);

  const handleBack = () => {
    if (from === 'saved') {
      router.replace('/saved');
    } else {
      router.replace('/');
    }
  };

  if (!recipe) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyStateCreative}>
          <Text style={[styles.emptyEmoji, { color: theme.primary }]}>🍳</Text>
          <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
            No Recipes Found
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
            You're just a few ingredients away from something amazing.
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
            Explore new ideas or create your own recipe!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.stickyHeader}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Image
          source={{
            uri: recipe.imageUrl || DEFAULT_IMAGE_URL,
          }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.content}>
          <Text style={styles.title}>{recipe.title}</Text>
          <Text style={styles.subtitle}>{recipe.headNote}</Text>

          <Spacer height={10} />
          <View style={styles.meta}>
            <Text style={styles.metaText}>Prep: {recipe.prepTime} min</Text>
            <Text style={styles.metaText}>Cook: {recipe.cookTime} min</Text>
            <Text style={styles.metaText}>Serves: {recipe.servings}</Text>
          </View>

          <Spacer height={12} />
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {recipe.ingredients.map((item, idx) => (
            <Text key={idx} style={styles.listItem}>
              • {item}
            </Text>
          ))}

          <Spacer height={12} />
          <Text style={styles.sectionTitle}>Instructions</Text>
          {recipe.instructions.map((step, idx) => (
            <Text key={idx} style={styles.listItem}>
              {idx + 1}. {step}
            </Text>
          ))}

          {recipe.tags.length > 0 && (
            <>
              <Spacer height={12} />
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagsContainer}>
                {recipe.tags.map((tag, idx) => (
                  <Text key={idx} style={styles.tag}>
                    #{tag}
                  </Text>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RecipeDetail;

const getStyles = (theme: typeof ColorScheme.light) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.backgroundLight,
    },
    container: {
      flex: 1,
    },
    backButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    backButtonText: {
      fontSize: 16,
      color: theme.primary,
    },
    image: {
      width: '100%',
      height: 220,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
    },
    content: {
      padding: 16,
    },
    title: {
      fontFamily: Fonts.heading,
      fontSize: FontSizes.xxl,
      color: Colors.dark[900],
      marginBottom: 4,
    },
    subtitle: {
      fontFamily: Fonts.body,
      fontSize: FontSizes.md,
      color: Colors.dark[600],
    },
    meta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    metaText: {
      fontFamily: Fonts.body,
      fontSize: FontSizes.sm,
      color: Colors.dark[500],
    },
    sectionTitle: {
      fontFamily: Fonts.heading,
      fontSize: FontSizes.lg,
      marginTop: 8,
      marginBottom: 4,
      color: theme.primary,
    },
    listItem: {
      fontFamily: Fonts.body,
      fontSize: FontSizes.md,
      color: Colors.dark[800],
      marginBottom: 4,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 4,
    },
    tag: {
      backgroundColor: theme.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      fontSize: FontSizes.sm,
      color: theme.primary,
      marginRight: 6,
      marginBottom: 6,
    },
    stickyHeader: {
      backgroundColor: theme.backgroundLight,
      zIndex: 10,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    emptyStateCreative: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    emptyEmoji: {
      fontSize: 52,
      marginBottom: 12,
    },
    emptyTitle: {
      fontFamily: Fonts.heading,
      fontSize: FontSizes.xl,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptySubtitle: {
      fontFamily: Fonts.body,
      fontSize: FontSizes.md,
      textAlign: 'center',
      marginBottom: 4,
    },
  });
