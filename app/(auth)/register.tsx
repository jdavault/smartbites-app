import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Modal,
  Keyboard,
  SafeAreaView,
  Platform,
  Linking,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Spacing } from '@/constants/Spacing';
import { Fonts, FontSizes } from '@/constants/Typography';
import AllergenSelector from '@/components/recipes/AllergenSelector';
import { Colors, ColorScheme } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Allergen } from '@/types/allergen';
import { getGlobalAllergen } from '@/services/recipe';
import Spacer from '@/components/Spacer';
import ThemedText from '@/components/ThemedText';
import { Eye, EyeOff } from 'lucide-react-native';

export interface ModalInfo {
  visible: boolean;
  title: string;
  subtitle?: string;
  emoji?: string;
}

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [selectedAllergens, setSelectedAllergens] = useState<Allergen[]>([]);
  const [showAllergens, setShowAllergens] = useState(false);
  const { register, isLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [modalInfo, setModalInfo] = useState<ModalInfo>({
    visible: false,
    title: '',
  });

  const router = useRouter();
  const { colors: theme } = useTheme();
  const styles = getStyles(theme);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!email || !password || !confirmPassword || !name) {
      setModalInfo({
        visible: true,
        title: 'Missing Fields',
        subtitle: 'Please fill in all fields before continuing.',
        emoji: '📝',
      });
      return;
    }

    if (!validateEmail(email)) {
      setModalInfo({
        visible: true,
        title: 'Invalid Email',
        subtitle: 'Please enter a valid email address.',
        emoji: '📧',
      });
      return;
    }

    if (password !== confirmPassword) {
      setModalInfo({
        visible: true,
        title: 'Password Mismatch',
        subtitle: 'Passwords do not match.',
        emoji: '🔒',
      });
      return;
    }

    if (selectedAllergens.length === 0) {
      setModalInfo({
        visible: true,
        title: 'No Allergens Selected',
        subtitle:
          'Please select at least one allergen to personalize your recipes.',
        emoji: '🥦',
      });
      return;
    }

    try {
      setSubmitting(true);
      await register(email, password, name, selectedAllergens);
      requestAnimationFrame(() => {
        router.replace('/(tabs)');
      });
    } catch (err: any) {
      setModalInfo({
        visible: true,
        title: 'Registration Error',
        subtitle:
          err.message.replace(/^AppwriteException:\s*/, '') ??
          'Something went wrong.',
        emoji: '🚫',
      });
    } finally {
      console.debug('DEBUG: register.tsx', {
        email,
        allergens,
        isLoading,
      });
      setSubmitting(false);
    }
  };

  const toggleAllergen = (allergen: Allergen) => {
    const exists = selectedAllergens.find((a) => a.$id === allergen.$id);
    if (exists) {
      setSelectedAllergens((prev) =>
        prev.filter((a) => a.$id !== allergen.$id)
      );
    } else {
      setSelectedAllergens((prev) => [...prev, allergen]);
    }
  };

  useEffect(() => {
    const loadAllergens = async () => {
      try {
        const result = await getGlobalAllergen();
        setAllergens(result);
      } catch (err) {
        console.error('Failed to fetch allergens:', err);
      }
    };
    loadAllergens();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
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

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              router.canGoBack?.() ? router.back() : router.replace('/')
            }
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Create Account</Text>
            <Text style={styles.subheaderText}>
              Join <Text style={{ fontWeight: 'bold' }}>SmartBites</Text>
              <Text>™</Text> for allergy-friendly recipes
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                autoCapitalize="none"
                placeholder="Enter your email"
                style={styles.input}
                keyboardType="email-address"
                placeholderTextColor="#6A7679"
                value={email}
                onChangeText={setEmail}
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                placeholder="Enter your first and last name"
                placeholderTextColor="#6A7679"
                style={styles.input}
                value={name}
                onChangeText={setName}
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  autoCapitalize="none"
                  placeholder="Create a password"
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#6A7679"
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  autoCorrect={false}
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

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  autoCapitalize="none"
                  placeholder="Confirm your Password"
                  secureTextEntry={!showConfirmPassword}
                  placeholderTextColor="#6A7679"
                  style={styles.passwordInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color={theme.accentDark} />
                  ) : (
                    <Eye size={20} color={theme.accentDark} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ marginTop: 8 }}>
              <TouchableOpacity
                onPress={() => setShowAllergens(!showAllergens)}
                style={{ alignItems: 'center', paddingVertical: 6 }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: theme.primary,
                  }}
                >
                  {showAllergens ? 'Hide Allergens ▲' : 'Select Allergens ▼'}
                </Text>
              </TouchableOpacity>

              {showAllergens && (
                <AllergenSelector
                  allergens={allergens}
                  selected={selectedAllergens}
                  onToggle={toggleAllergen}
                  themeColor={theme}
                />
              )}
            </View>

            <Text
              style={{
                fontSize: 13,
                textAlign: 'center',
                color: theme.textSecondary,
                marginTop: 16,
              }}
            >
              By tapping “Create Account”, I acknowledge that I have read and
              agree to the
              <Text style={{ fontWeight: 'bold' }}>SmartBites</Text>
              <Text>™ </Text>
              <Text
                style={{ textDecorationLine: 'underline' }}
                onPress={() =>
                  Linking.openURL(
                    'https://www.privacypolicies.com/live/1a6f589d-84cc-4f85-82b9-802b08c501b2'
                  )
                }
              >
                Privacy Policy
              </Text>
              and
              <Text
                style={{ textDecorationLine: 'underline' }}
                onPress={() =>
                  Linking.openURL(
                    'https://www.privacypolicies.com/live/53f5c56f-677a-469f-aad9-1253eb6b75e4'
                  )
                }
              >
                Terms of Service
              </Text>
              . I also consent to being contacted by SmartBites™ for
              account-related communications using the information I provide.
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Link href="/" asChild>
                <TouchableOpacity>
                  <Text style={styles.footerLink}>Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
      <ThemedText style={{ fontSize: 14, textAlign: 'center', margin: 24 }}>
        <Text style={{ fontWeight: 'bold' }}>SmartBites</Text>
        <Text>™ © 2025</Text>
      </ThemedText>
    </SafeAreaView>
  );
}

const getStyles = (theme: typeof ColorScheme.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: Platform.OS === 'android' ? 30 : 0,
    },
    scrollContent: {
      flexGrow: 1,
      padding: Spacing.lg,
    },
    backButton: {
      alignSelf: 'flex-start',
      marginBottom: Spacing.sm,
    },
    backButtonText: {
      fontFamily: Fonts.body,
      fontSize: FontSizes.md,
      color: theme.primary,
    },
    headerContainer: {
      marginBottom: Spacing.sm,
    },
    headerText: {
      fontFamily: Fonts.heading,
      fontSize: FontSizes.xxxl,
      color: theme.primary,
      marginBottom: Spacing.sm,
    },
    subheaderText: {
      fontFamily: Fonts.body,
      fontSize: FontSizes.md,
      color: Colors.dark[500],
    },
    formContainer: {
      marginTop: Spacing.md,
    },
    inputContainer: {
      marginBottom: Spacing.md,
    },
    label: {
      fontFamily: Fonts.body,
      fontSize: FontSizes.sm,
      color: Colors.dark[700],
      marginBottom: Spacing.xs,
    },
    input: {
      minHeight: 48, // increased from 40
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      paddingHorizontal: 14, // slightly more breathing room
      paddingVertical: Platform.OS === 'android' ? 10 : 8, // gives Android space for descenders
      fontFamily: Fonts.body,
      fontSize: FontSizes.md,
      backgroundColor: theme.backgroundLight,
      width: '100%', // ensure full width to prevent squeezing
    },
    passwordContainer: {
      position: 'relative',
      width: '100%',
    },
    passwordInput: {
      minHeight: 48,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      paddingHorizontal: 14,
      paddingRight: 50, // Make room for the eye icon
      paddingVertical: Platform.OS === 'android' ? 10 : 8,
      fontFamily: Fonts.body,
      fontSize: FontSizes.md,
      backgroundColor: theme.backgroundLight,
      width: '100%',
    },
    eyeButton: {
      position: 'absolute',
      right: 15,
      top: 10,
      padding: 5,
    },

    button: {
      backgroundColor: theme.primary,
      height: 54,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: Spacing.sm,
    },
    buttonText: {
      color: Colors.white,
      fontFamily: Fonts.bodyBold,
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
      color: Colors.dark[700],
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
    emoji: {
      fontSize: 40,
      marginBottom: 12,
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
  });
