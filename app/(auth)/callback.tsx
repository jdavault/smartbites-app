import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function AuthCallback() {
  const router = useRouter();
  const { colors: theme } = useTheme();

  useEffect(() => {
    // For now, just redirect back to login
    // This will be used for OAuth callbacks in the future
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
    }}>
      <ActivityIndicator size="large" color={theme.primary} />
      <Text style={{
        marginTop: 16,
        fontSize: 16,
        color: theme.textPrimary,
        textAlign: 'center',
      }}>
        Processing authentication...
      </Text>
    </View>
  );
}