import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor:
            theme === 'light' ? Colors.dark[100] : Colors.dark[700],
        },
      ]}
      onPress={toggleTheme}
    >
      {theme === 'light' ? (
        <Sun size={20} color={Colors.dark[500]} />
      ) : (
        <Moon size={20} color={Colors.white} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
