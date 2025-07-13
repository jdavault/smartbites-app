import React from 'react';
import {
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import ThemedView from '@/components/ThemedView';
import { Colors, ColorScheme } from '@/constants/Colors';

const About: React.FC = () => {
  const { colors: theme } = useTheme();
  const styles = getStyles(theme);
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>About Us</Text>

        <Text style={styles.paragraph}>
          Welcome to <Text style={{ fontWeight: 'bold' }}>SmartBites</Text>
          <Text>™</Text> — a mobile app built for people and families...
        </Text>
        <Text style={styles.paragraph}>
          Our app lets users search for and customize recipes that avoid common
          allergens like wheat (gluten), milk, eggs, and more. You can refine,
          edit, and save your favorite recipes to your personal list for easy
          access at home.
        </Text>

        <Text style={styles.paragraph}>
          While we currently focus on helping you cook safely at home, future
          versions of SmartBites will go further — helping you find
          allergy-friendly restaurants and safe menu items while dining out.
        </Text>

        <Text style={styles.paragraph}>
          Whether you’re newly diagnosed or have been navigating allergies for
          years, SmartBites is here to simplify your food choices and bring
          confidence back to your kitchen.
        </Text>

        <TouchableOpacity onPress={() => router.replace('/')}>
          <Text style={styles.link}>Back Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
};

export default About;

const getStyles = (theme: typeof ColorScheme.light) =>
  StyleSheet.create<{
    container: ViewStyle;
    scroll: ViewStyle;
    title: TextStyle;
    paragraph: TextStyle;
    link: TextStyle;
  }>({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
    },
    scroll: {
      paddingHorizontal: 24,
      paddingTop: 120, // 🧼 top spacing
      paddingBottom: 24,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: Colors.dark[700],
      marginBottom: 16,
      textAlign: 'center',
    },
    paragraph: {
      fontSize: 16,
      color: theme.textPrimary,
      marginBottom: 18,
      lineHeight: 24,
    },
    link: {
      fontSize: 16,
      color: theme.primary,
      textDecorationLine: 'underline',
      textAlign: 'center',
      marginTop: 20,
    },
  });
