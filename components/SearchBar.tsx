import React from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { Spacing, BorderRadius } from '@/constants/Spacing';
import { Fonts, FontSizes } from '@/constants/Typography';

// Import Lucide icons
import { Search, X } from 'lucide-react-native';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChangeText,
  onClear,
  placeholder = 'Search recipes...',
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.searchIconContainer}>
        <Search size={20} color={Colors.dark[500]} />
      </View>

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.dark[500]}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {value.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={onClear}>
          <X size={18} color={Colors.dark[500]} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark[100],
    borderRadius: BorderRadius.full,
    paddingVertical: Platform.OS === 'ios' ? Spacing.sm : 0,
    marginVertical: Spacing.md,
    marginHorizontal: Spacing.lg,
  },
  searchIconContainer: {
    paddingHorizontal: Spacing.md,
  },
  input: {
    flex: 1,
    height: 40,
    fontFamily: Fonts.body,
    fontSize: FontSizes.md,
    color: Colors.dark[700],
    paddingRight: Spacing.md,
  },
  clearButton: {
    padding: Spacing.sm,
  },
});
