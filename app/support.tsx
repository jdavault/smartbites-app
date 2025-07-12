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
import ThemedView from '@/components/ThemedView';
import { useTheme } from '@/context/ThemeContext';
import { Colors, ColorScheme } from '@/constants/Colors';

const Support: React.FC = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>App Support</Text>

        <Text style={styles.paragraph}>
          Need help using the{' '}
          <Text style={{ fontWeight: 'bold' }}>SmartBites</Text>
          <Text>™</Text> app? Encountering a bug? We're here to assist.
        </Text>

        <Text style={styles.label}>Support Phone:</Text>
        <Text style={styles.value}>602-614-1243</Text>

        <Text style={styles.label}>Support Email:</Text>
        <Text style={styles.value}>joe@davault.dev</Text>

        <Text style={styles.paragraph}>
          Please include details like your device type, OS version, and any
          screenshots if available.
        </Text>

        <TouchableOpacity onPress={() => router.replace('/')}>
          <Text style={styles.link}>Back Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
};

export default Support;

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
