import React from 'react';
import { Image, ImageSourcePropType, StyleSheet } from 'react-native';
import LightLogo from '@/assets/images/smart-bites-logo.png';
import DarkLogo from '@/assets/images/smart-bites-logo.png';
import { useTheme } from '@/context/ThemeContext';
import { ColorScheme } from '@/constants/Colors';

const ThemedLogo: React.FC = () => {
  const { colors: theme, theme: themeColor } = useTheme();
  const styles = getStyles(theme);

  const logo: ImageSourcePropType =
    themeColor === 'dark' ? DarkLogo : LightLogo;

  return <Image source={logo} style={styles.logoImage} />;
};

export default ThemedLogo;

const getStyles = (theme: typeof ColorScheme.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.secondary,
    },
    logoImage: {
      width: 300,
      height: 300,
      marginVertical: 20,
    },
  });
