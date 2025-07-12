import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Allergen } from '@/types/allergen';
import { Colors, ColorScheme } from '@/constants/Colors';
import { Spacing, BorderRadius } from '@/constants/Spacing';
import { Fonts, FontSizes } from '@/constants/Typography';

// Import Lucide icons
import { X, Filter } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { getGlobalAllergen } from '@/services/recipe';

type AllergenFilterProps = {
  selectedAllergens: Allergen[];
  onToggleFilter: (allergen: Allergen) => void;
  onClearFilters: () => void;
};

export default function AllergenFilter({
  selectedAllergens,
  onToggleFilter,
  onClearFilters,
}: Readonly<AllergenFilterProps>) {
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  useEffect(() => {
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
  const { colors: theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Filter size={18} color={theme.primary} />
          <Text style={styles.title}>Filter Out Allergens</Text>
        </View>

        {selectedAllergens.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={onClearFilters}>
            <Text style={styles.clearButtonText}>Clear all</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        {allergens.map((allergen) => {
          const isActive = selectedAllergens.some(
            (a) => a.$id === allergen.$id
          );
          //.some((a) => a.$id === allergen.$id)
          return (
            <TouchableOpacity
              key={allergen.name}
              style={[styles.filterItem, isActive && styles.activeFilterItem]}
              onPress={() => onToggleFilter(allergen)}
            >
              <Text
                style={[styles.filterText, isActive && styles.activeFilterText]}
              >
                {allergen.name}
              </Text>

              {isActive && (
                <X size={12} color={Colors.white} style={styles.removeIcon} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {selectedAllergens.length > 0 && (
        <View style={styles.activeFiltersContainer}>
          <Text style={styles.activeFiltersText}>
            Showing recipes without:{' '}
            <Text style={styles.activeFiltersHighlight}>
              {selectedAllergens
                .map((filter) => {
                  const allergen = allergens.find((a) => a.$id === filter.$id);
                  return allergen ? allergen.name : '';
                })
                .join(', ')}
            </Text>
          </Text>
        </View>
      )}
    </View>
  );
}

const getStyles = (theme: typeof ColorScheme.light) =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors.white,
      paddingTop: Spacing.md,
      marginBottom: Spacing.md,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: Spacing.lg,
      marginBottom: Spacing.sm,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      fontFamily: Fonts.heading,
      fontSize: FontSizes.md,
      color: theme.primary,
      marginLeft: Spacing.xs,
    },
    clearButton: {
      paddingVertical: Spacing.xs,
    },
    clearButtonText: {
      fontFamily: Fonts.body,
      fontSize: FontSizes.sm,
      color: theme.primary,
    },
    filters: {
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.md,
    },
    filterItem: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: BorderRadius.full,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      marginRight: Spacing.sm,
      backgroundColor: Colors.white,
    },
    activeFilterItem: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    filterText: {
      fontFamily: Fonts.body,
      fontSize: FontSizes.sm,
      color: Colors.dark[700],
    },
    activeFilterText: {
      color: Colors.white,
    },
    removeIcon: {
      marginLeft: Spacing.xs,
    },
    activeFiltersContainer: {
      backgroundColor: theme.background,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
      marginBottom: Spacing.sm,
    },
    activeFiltersText: {
      fontFamily: Fonts.body,
      fontSize: FontSizes.sm,
      color: Colors.dark[700],
    },
    activeFiltersHighlight: {
      fontFamily: Fonts.bodyBold,
      color: theme.primaryDark,
    },
  });
