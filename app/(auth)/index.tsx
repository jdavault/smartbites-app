import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
  Platform,
  Text,
  Linking,
} from 'react-native';
import { Link } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import ThemedLogo from '@/components/ThemedLogo';
import ThemedText from '@/components/ThemedText';
import Spacer from '@/components/Spacer';
import { Spacing } from '@/constants/Spacing';
import { Fonts, FontSizes } from '@/constants/Typography';
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

      {Platform.OS === 'web' && (
        <Animated.View style={[styles.appStoreContainer, { opacity: buttonsAnim }]}>
          <Text style={[styles.appStoreTitle, { color: theme.textPrimary }]}>
            Get the SmartBites™ Mobile App
          </Text>
          <Text style={[styles.appStoreSubtitle, { color: theme.textSecondary }]}>
            Download for the best experience on your phone
          </Text>
          
          <View style={styles.storeButtonsContainer}>
            <TouchableOpacity
              style={[styles.storeButton, { backgroundColor: theme.card }]}
              onPress={() => Linking.openURL('https://apps.apple.com/app/smartbites/id6745743999')}
            >
              <Text style={[styles.storeButtonText, { color: theme.textPrimary }]}>
                📱 Download for iPhone
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.storeButton, { backgroundColor: theme.card }]}
              onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=cooking.safeplate.allergyawarerecipefinder')}
            >
              <Text style={[styles.storeButtonText, { color: theme.textPrimary }]}>
                🤖 Download for Android
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.webContinueContainer}>
            <Text style={[styles.webContinueText, { color: theme.textSecondary }]}>
              Or continue using the web version below
            </Text>
          </View>
        </Animated.View>
      )}
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
    appStoreContainer: {
      width: '100%',
      paddingHorizontal: Spacing.lg,
      alignItems: 'center',
      marginTop: Spacing.sm,
      marginBottom: Spacing.md,
    },
    appStoreTitle: {
      fontFamily: Fonts.heading,
      fontSize: FontSizes.lg,
      textAlign: 'center',
      marginBottom: Spacing.xs,
    },
    appStoreSubtitle: {
      fontFamily: Fonts.body,
      fontSize: FontSizes.sm,
      textAlign: 'center',
      marginBottom: Spacing.lg,
    },
    storeButtonsContainer: {
      flexDirection: 'row',
      gap: Spacing.md,
      marginBottom: Spacing.lg,
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    storeButton: {
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
      minWidth: 160,
      alignItems: 'center',
    },
    storeButtonText: {
      fontFamily: Fonts.body,
      fontSize: FontSizes.sm,
      textAlign: 'center',
    },
    webContinueContainer: {
      alignItems: 'center',
    },
    webContinueText: {
      fontFamily: Fonts.body,
      fontSize: FontSizes.sm,
      fontStyle: 'italic',
      textAlign: 'center',
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
