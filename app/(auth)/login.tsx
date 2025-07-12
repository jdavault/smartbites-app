import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  View,
  Platform,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Spacing } from '@/constants/Spacing';
import { Fonts, FontSizes } from '@/constants/Typography';
import { useTheme } from '@/context/ThemeContext';
import { Colors, ColorScheme } from '@/constants/Colors';
import ThemedText from '@/components/ThemedText';
import { Eye, EyeOff } from 'lucide-react-native';

export type ModalInfo = {
  visible: boolean;
  title: string;
  subtitle?: string;
  emoji?: string;
};

export const MAX_INPUT_WIDTH = 360; // adjust to your preferred max

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [modalInfo, setModalInfo] = useState<ModalInfo>({
    visible: false,
    title: '',
  });

  const { login } = useAuth();
  const router = useRouter();
  const { redirect } = useLocalSearchParams();
  const { colors: theme } = useTheme();
  const styles = getStyles(ColorScheme.light);

  const handleSubmit = async () => {
    console.log('Preview origin:', window.location.origin);
    setSubmitting(true);
    if (!email || !password) {
      setModalInfo({
        visible: true,
        title: 'Missing Fields',
        subtitle: 'Please fill in all fields before continuing.',
        emoji: '📝',
      });
      setSubmitting(false);
      return;
    }

    try {
      setError(null);
      await login(email, password);
      const safeRedirect = getSafeRedirect(
        typeof redirect === 'string' && redirect.trim() !== ''
          ? redirect
          : '/explore'
      );
      router.replace(safeRedirect as any);
    } catch (error: any) {
      const message =
        error?.message?.replace(/^AppwriteException:\s*/, '') ?? 'Login failed';
      setModalInfo({
        visible: true,
        title: 'Login Failed',
        subtitle: message,
        emoji: '🚫',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getForm = () => {
    return (
      <View
        style={{
          width: '100%',
          maxWidth: MAX_INPUT_WIDTH,
          alignSelf: 'center',
        }}
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>
            SmartBites
            <Text style={styles.tm}>™</Text>
          </Text>
          <View
            style={{
              width: '100%',
              maxWidth: MAX_INPUT_WIDTH,
              alignItems: 'center',
              alignSelf: 'center',
            }}
          >
            <Text style={styles.tagline}>Allergy-friendly recipes</Text>
            <Text style={styles.tagline}>for everyone</Text>
          </View>
        </View>
        <View style={styles.formContainer}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#6A7679"
              placeholder="Enter your email"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                autoCapitalize="none"
                style={styles.passwordInput}
                value={password}
                secureTextEntry={!showPassword}
                onChangeText={setPassword}
                placeholder="Enter a password"
                placeholderTextColor="#6A7679"
                returnKeyType="done"
                blurOnSubmit={true}
                onSubmitEditing={handleSubmit}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color={theme.accentDark} />
                ) : (
                  <Eye size={20} color={theme.accentDark} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color={theme.textWhite} />
            ) : (
              <Text style={styles.buttonText}>Log In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.oauthButton}
            onPress={() =>
              setModalInfo({
                visible: true,
                title: 'Google Login Not Available',
                subtitle: "We're working on it — coming soon!",
                emoji: '😔',
              })
            }
          >
            <Text style={styles.oauthButtonText}>Continue with Google</Text>
          </TouchableOpacity>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/register" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    );
  };

  console.log('Preview origin:', window.location.origin);
  return (
    <View style={styles.container}>
      {modalInfo.visible && (
        <Modal
          transparent
          animationType="fade"
          visible={modalInfo.visible}
          onRequestClose={() => setModalInfo({ ...modalInfo, visible: false })}
        >
          <TouchableWithoutFeedback
            onPress={() => setModalInfo({ ...modalInfo, visible: false })}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                {modalInfo.emoji && (
                  <Text style={styles.emoji}>{modalInfo.emoji}</Text>
                )}
                <Text style={styles.modalTitle}>{modalInfo.title}</Text>
                {modalInfo.subtitle && (
                  <Text style={styles.modalSubtitle}>{modalInfo.subtitle}</Text>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}

      {Platform.OS === 'web' ? (
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={[styles.scrollContent, { flex: 1 }]}
            keyboardShouldPersistTaps="handled"
          >
            {getForm()}
          </ScrollView>
        </View>
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <ScrollView
              contentContainerStyle={[styles.scrollContent, { flex: 1 }]}
              keyboardShouldPersistTaps="handled"
            >
              {getForm()}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      )}

      <ThemedText style={{ fontSize: 14, textAlign: 'center', margin: 24 }}>
        <Text style={{ fontWeight: 'bold' }}>SmartBites</Text>
        <Text>™ © 2025</Text>
      </ThemedText>
    </View>
  );
}

const getStyles = (theme: typeof ColorScheme.light) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      flexGrow: 1,
      alignItems: 'center', // center the child form
      paddingVertical: Spacing.xxl,
      paddingHorizontal: Spacing.md,
    },
    logoContainer: {
      alignItems: 'center',
      marginTop: Spacing.xxl,
      marginBottom: Spacing.xl,
    },
    logoText: {
      fontFamily: Fonts.headingBold,
      fontSize: FontSizes.display,
      color: theme.primary,
      marginBottom: Spacing.xs,
    },
    tm: {
      fontSize: FontSizes.display, // or FontSizes.caption if defined
      lineHeight: FontSizes.xxxl,
      marginLeft: 2,
    },
    tagline: {
      fontFamily: Fonts.body,
      fontSize: FontSizes.md,
      color: theme.accentDark,
      textAlign: 'center',
      flexWrap: 'wrap', // <- not strictly necessary, but safe
    },
    formContainer: {
      marginTop: Spacing.lg,
      paddingHorizontal: Spacing.lg,
      width: '100%', // ✅ full width of parent
      alignSelf: 'stretch',
    },
    errorContainer: {
      backgroundColor: Colors.error + '20', // 20% opacity
      padding: Spacing.md,
      borderRadius: 8,
      marginBottom: Spacing.md,
    },
    errorText: {
      color: Colors.warning[500],
      fontFamily: Fonts.body,
      fontSize: FontSizes.sm,
    },
    inputContainer: {
      marginBottom: Spacing.lg,
    },
    label: {
      fontFamily: Fonts.body,
      fontSize: FontSizes.sm,
      color: theme.accentDark,
      marginBottom: Spacing.xs,
    },
    inputPlaceholderText: {
      color: theme.accentLight,
    },
    input: {
      height: 56,
      borderWidth: 1,
      borderColor: theme.accent,
      borderRadius: 8,
      paddingHorizontal: Spacing.md,
      fontFamily: Fonts.body,
      fontSize: FontSizes.md,
      backgroundColor: theme.backgroundLight,
      width: '100%',
      //maxWidth: MAX_INPUT_WIDTH, // ✅ constrain for larger screens
    },
    passwordContainer: {
      position: 'relative',
      width: '100%',
    },
    passwordInput: {
      height: 56,
      borderWidth: 1,
      borderColor: theme.accent,
      borderRadius: 8,
      paddingHorizontal: Spacing.md,
      paddingRight: 50, // Make room for the eye icon
      fontFamily: Fonts.body,
      fontSize: FontSizes.md,
      backgroundColor: theme.backgroundLight,
      width: '100%',
    },
    eyeButton: {
      position: 'absolute',
      right: 15,
      top: 16,
      padding: 5,
    },
    button: {
      backgroundColor: theme.primary,
      height: 54,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: Spacing.md,
      width: Platform.OS === 'web' ? '100%' : 'auto', // ✅ full width only on web
      maxWidth: Platform.OS === 'web' ? MAX_INPUT_WIDTH : undefined, // optional: limit max
    },
    buttonText: {
      color: theme.textWhite,
      fontFamily: Fonts.bodyBold,
      fontSize: FontSizes.md,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: Spacing.xl,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.accent,
    },
    dividerText: {
      fontFamily: Fonts.body,
      fontSize: FontSizes.sm,
      color: theme.accentLight,
      marginHorizontal: Spacing.md,
    },
    oauthButton: {
      height: 54,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.accent,
      marginBottom: Spacing.lg,
      width: Platform.OS === 'web' ? '100%' : 'auto', // ✅ full width only on web
      maxWidth: Platform.OS === 'web' ? MAX_INPUT_WIDTH : undefined,
    },
    oauthButtonText: {
      color: theme.accentDark,
      fontFamily: Fonts.body,
      fontSize: FontSizes.md,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: Spacing.lg,
    },
    footerText: {
      fontFamily: Fonts.body,
      fontSize: FontSizes.md,
      color: theme.accentDark,
    },
    footerLink: {
      fontFamily: Fonts.bodyBold,
      fontSize: FontSizes.md,
      color: theme.primary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 24,
      borderRadius: 12,
      width: '80%',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 5,
    },
    modalTitle: {
      fontFamily: Fonts.headingBold,
      fontSize: FontSizes.lg,
      color: '#222',
      marginBottom: 8,
    },
    modalSubtitle: {
      fontFamily: Fonts.body,
      fontSize: FontSizes.md,
      color: '#555',
      textAlign: 'center',
    },
    emoji: {
      fontSize: 40,
      marginBottom: 12,
    },
  });
};

export function getSafeRedirect(redirectParam: string | undefined): string {
  // Must start with a single slash (internal path)
  const isSafe =
    typeof redirectParam === 'string' &&
    redirectParam.startsWith('/') &&
    !redirectParam.startsWith('//');

  return isSafe ? redirectParam : '/recipes'; // Default fallback
}