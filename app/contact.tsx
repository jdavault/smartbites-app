import {
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import ThemedView from '@/components/ThemedView';
import { Colors, ColorScheme } from '@/constants/Colors';

const contact: React.FC = () => {
  const router = useRouter();
  const { colors: theme } = useTheme();
  const styles = getStyles(theme);
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Contact Us</Text>

        <Text style={styles.paragraph}>
          We'd love to hear from you. Whether you have questions about billing,
          employment, partnerships, or general inquiries — reach out!
        </Text>

        <Text style={styles.label}>General Email:</Text>
        <Text style={styles.value}>joe@davault.dev</Text>

        <Text style={styles.label}>Mailing Address:</Text>
        <Text style={styles.value}>
          SmartBites, Inc.{'\n'}
          2101 E Donald Dr.{'\n'}
          Phoenix, AZ 85024
        </Text>

        <TouchableOpacity onPress={() => router.replace('/')}>
          <Text style={styles.link}>Back Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
};

export default contact;

const getStyles = (theme: typeof ColorScheme.light) =>
  StyleSheet.create<{
    container: ViewStyle;
    scroll: ViewStyle;
    title: TextStyle;
    paragraph: TextStyle;
    label: TextStyle;
    value: TextStyle;
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
      color: theme.textPrimary,
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

    label: {
      fontSize: 14,
      fontWeight: 'bold',
      marginTop: 10,
      color: theme.accentDark,
    },
    value: {
      fontSize: 16,
      color: theme.accent,
      marginBottom: 12,
    },
  });
