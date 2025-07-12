import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  TouchableOpacity,
  Linking,
  TextInput,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { CircleAlert as AlertCircle, ExternalLink } from 'lucide-react-native';
import { Spacing } from '@/constants/Spacing';
import { Fonts, FontSizes } from '@/constants/Typography';
import { Colors, ColorScheme } from '@/constants/Colors';
import { Allergen } from '@/types/allergen';
import { getGlobalAllergen } from '@/services/recipe';
import AllergenSelector from '@/components/recipes/AllergenSelector';
import { useRecipes } from '@/context/RecipesContext';
import Spacer from '@/components/Spacer';

export default function SettingsScreen() {
  const { colors: theme } = useTheme();
  const router = useRouter();
  const styles = getStyles(theme);
  const { user, logout } = useAuth();
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [showAllergens, setShowAllergens] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const { selectedAllergens, applySelectedAllergens } = useRecipes();

  // Function to toggle a filter
  const handleToggleFilter = (allergen: Allergen) => {
    const isAlreadySelected = selectedAllergens.some(
      (a: Allergen) => a.$id === allergen.$id
    );

    const updatedFilters = isAlreadySelected
      ? selectedAllergens.filter((a: Allergen) => a.$id !== allergen.$id)
      : [...selectedAllergens, allergen];

    applySelectedAllergens(updatedFilters);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  useEffect(() => {
    // Load allergens for dropdown
    const loadAllergens = async () => {
      try {
        const result = await getGlobalAllergen();
        setAllergens(result);
      } catch (err) {
        console.error('Failed to fetch allergens:', err);
      }
    };

    loadAllergens();
  }, []);

  const isReady = user && Array.isArray(allergens) && allergens.length > 0;

  if (!isReady) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading your preferences...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Manage your dietary preferences</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholderTextColor={theme.textSecondary}
          />
          <Spacer height={15} />
          <Text style={styles.sectionTitle}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            onPress={() => setShowAllergens(!showAllergens)}
            style={{
              alignItems: 'center',
              paddingVertical: 6,
              marginBottom: 4,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: 'bold', color: theme.primary }}
            >
              {showAllergens ? 'Hide Allergens ▲' : 'Show Allergens ▼'}
            </Text>
          </TouchableOpacity>

          {showAllergens && (
            <AllergenSelector
              allergens={allergens}
              selected={selectedAllergens}
              onToggle={handleToggleFilter}
              themeColor={theme}
            />
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <View style={styles.disclaimerBox}>
            <AlertCircle
              size={20}
              color={Colors.warning[700]}
              style={styles.disclaimerIcon}
            />
            <Text style={styles.disclaimerText}>
              This app helps avoid allergens in recipes but is not a substitute
              for professional advice. Always verify ingredients if you have
              severe allergies.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.link}
            onPress={() =>
              Linking.openURL(
                'https://www.privacypolicies.com/live/53f5c56f-677a-469f-aad9-1253eb6b75e4'
              )
            }
          >
            <Text style={styles.linkText}>Terms of Service</Text>
            <ExternalLink size={16} color={theme.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.link}
            onPress={() =>
              Linking.openURL(
                'https://www.privacypolicies.com/live/1a6f589d-84cc-4f85-82b9-802b08c501b2'
              )
            }
          >
            <Text style={styles.linkText}>Privacy Policy</Text>
            <ExternalLink size={16} color={theme.primary} />
          </TouchableOpacity>

          <Text style={styles.versionText}>Version 1.0.3</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (theme: typeof ColorScheme.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      paddingTop: Spacing.md,
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.xxxl,
    },
    loadingText: {
      padding: Spacing.lg,
      fontSize: FontSizes.md,
      fontFamily: Fonts.body,
      color: theme.textPrimary,
    },
    header: {
      marginBottom: Spacing.lg,
    },
    title: {
      fontFamily: Fonts.heading,
      fontSize: FontSizes.xxl,
      color: theme.textPrimary,
    },
    subtitle: {
      fontFamily: Fonts.body,
      fontSize: FontSizes.md,
      color: theme.textSecondary,
      marginTop: Spacing.xs,
    },
    section: {
      backgroundColor: theme.card,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.lg,
      marginBottom: Spacing.md,
      borderRadius: 12,
    },
    sectionTitle: {
      fontFamily: Fonts.heading,
      fontSize: FontSizes.lg,
      color: theme.textPrimary,
      marginBottom: Spacing.xs,
    },
    sectionDescription: {
      fontFamily: Fonts.body,
      fontSize: FontSizes.sm,
      color: theme.textSecondary,
      marginBottom: Spacing.md,
    },
    allergenItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    allergenTextBlock: {
      flex: 1,
      paddingRight: Spacing.md,
    },
    allergenName: {
      fontFamily: Fonts.bodyBold,
      fontSize: FontSizes.md,
      color: theme.textPrimary,
    },
    allergenDescription: {
      fontFamily: Fonts.body,
      fontSize: FontSizes.sm,
      color: theme.textSecondary,
      marginTop: 2,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      padding: Spacing.sm,
      fontSize: FontSizes.md,
      fontFamily: Fonts.body,
      color: theme.textPrimary,
      backgroundColor: theme.backgroundLight,
    },
    disclaimerBox: {
      backgroundColor: Colors.warning[50],
      borderRadius: 8,
      padding: Spacing.md,
      flexDirection: 'row',
      marginBottom: Spacing.md,
    },
    disclaimerIcon: {
      marginRight: Spacing.sm,
      marginTop: 2,
    },
    disclaimerText: {
      fontFamily: Fonts.body,
      fontSize: FontSizes.sm,
      color: Colors.warning[700],
      flex: 1,
    },
    link: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    linkText: {
      fontFamily: Fonts.body,
      fontSize: FontSizes.md,
      color: theme.primary,
      flex: 1,
    },
    versionText: {
      fontFamily: Fonts.body,
      fontSize: FontSizes.sm,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: Spacing.xl,
    },
    logoutButton: {
      backgroundColor: theme.primary,
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.xl,
      borderRadius: 8,
      alignSelf: 'center',
    },
    logoutText: {
      fontFamily: Fonts.heading,
      fontSize: FontSizes.md,
      color: theme.textWhite,
    },
  });
