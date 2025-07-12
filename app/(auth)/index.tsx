import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
  Platform,
} from 'react-native';
import { Link } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import ThemedLogo from '@/components/ThemedLogo';
import ThemedText from '@/components/ThemedText';
import Spacer from '@/components/Spacer';
import { Spacing } from '@/constants/Spacing';
import {
  EdgeInsets,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

const Home: React.FC = () => {
  const { colors: theme } = useTheme();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const styles = getStyles(theme, height, insets);

  const logoAnim = useRef(new Animated.Value(0)).current;
  const buttonsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(buttonsAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.logoContainer, { opacity: logoAnim }]}>
        <ThemedLogo />
      </Animated.View>

      <Animated.View style={[styles.buttonGroup, { opacity: buttonsAnim }]}>
        <Link href="/login" asChild>
          <TouchableOpacity style={styles.primaryButton}>
            <ThemedText style={styles.primaryButtonText}>Sign In</ThemedText>
          </TouchableOpacity>
        </Link>

        <Spacer height={12} />

        <Link href="/register" asChild>
          <TouchableOpacity style={styles.lightButton}>
            <ThemedText style={styles.lightButtonText}>
              Create Account
            </ThemedText>
          </TouchableOpacity>
        </Link>
      </Animated.View>

      <View style={styles.bottomLinks}>
        <Link href="/about" asChild>
          <ThemedText style={styles.linkText}>About Us</ThemedText>
        </Link>
        <Link href="/contact" asChild>
          <ThemedText style={styles.linkText}>Contact</ThemedText>
        </Link>
        <Link href="/support" asChild>
          <ThemedText style={styles.linkText}>Support</ThemedText>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const getStyles = (theme: any, height: number, insets: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    },
    logoContainer: {
      marginTop: height * 0.08,
      alignItems: 'center',
    },
    buttonGroup: {
      width: '100%',
      paddingHorizontal: Spacing.lg,
      alignItems: 'center',
      marginBottom: 16,
    },
    primaryButton: {
      width: '90%',
      paddingVertical: 18,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.primary,
    },
    lightButton: {
      width: '90%',
      paddingVertical: 18,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.primaryLight,
    },
    primaryButtonText: {
      fontSize: 17,
      fontFamily: 'Inter-Bold',
      color: theme.textWhite,
    },
    lightButtonText: {
      fontSize: 15,
      fontFamily: 'Inter-Medium',
      color: theme.primaryDark,
    },
    bottomLinks: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      paddingHorizontal: Spacing.xl,
      paddingBottom: insets.bottom + 8,
    },
    linkText: {
      fontSize: 14,
      fontFamily: 'Lato-Regular',
      color: theme.textSecondary,
      textDecorationLine: 'underline',
    },
  });
