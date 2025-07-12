import React from 'react';
import {
  ActivityIndicator,
  ActivityIndicatorProps,
  useColorScheme,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import ThemedView from './ThemedView';

type ThemedLoaderProps = {
  size?: ActivityIndicatorProps['size'];
};

const ThemedLoader: React.FC<ThemedLoaderProps> = ({ size = 'large' }) => {
  const { colors: theme } = useTheme();

  return (
    <ThemedView
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <ActivityIndicator size={size} color={theme.primary} />
    </ThemedView>
  );
};

export default ThemedLoader;
