import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Allergen } from '@/types/allergen';
import { Spacing } from '@/constants/Spacing';
import { Fonts, FontSizes } from '@/constants/Typography';
import { Colors, ColorScheme } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';

interface Props {
  allergens: Allergen[];
  selected: Allergen[];
  onToggle: (a: Allergen) => void;
  themeColor: typeof ColorScheme.light;
}

const AllergenSelector: React.FC<Props> = ({
  allergens,
  selected,
  onToggle,
  themeColor,
}) => {
  const { colors: theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Select Allergens to Avoid</Text>
      <Text style={styles.sectionDescription}>
        These allergens will be used to filter out unsafe recipes.
      </Text>

      {allergens.map((allergen) => (
        <View key={allergen.$id} style={styles.allergenItem}>
          <View style={styles.allergenTextBlock}>
            <Text style={styles.allergenName}>{allergen.name}</Text>
            <Text style={styles.allergenDescription}>
              {allergen.description}
            </Text>
          </View>
          <Switch
            value={selected.some((a) => a.$id === allergen.$id)}
            onValueChange={() => onToggle(allergen)}
            trackColor={{
              false: theme.backgroundLight,
              true: theme.primary,
            }}
          />
        </View>
      ))}
    </View>
  );
};

const getStyles = (theme: typeof ColorScheme.light) =>
  StyleSheet.create({
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
  });

export default AllergenSelector;
