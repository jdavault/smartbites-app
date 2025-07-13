import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  ActivityIndicator,
  Modal,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Spacing } from '@/constants/Spacing';
import { Fonts, FontSizes } from '@/constants/Typography';
import { useTheme } from '@/context/ThemeContext';
import { Colors, ColorScheme } from '@/constants/Colors';
import ThemedText from '@/components/ThemedText';
import { account } from '@/libs/appwrite/config';
import { Eye, EyeOff } from 'lucide-react-native';

export type ModalInfo = {
  visible: boolean;
  title: string;
  subtitle?: string;
  emoji?: string;
};

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalInfo, setModalInfo] = useState<ModalInfo>({
    visible: false,
    title: '',
  });

  const [statusTitle, setStatusTitle] = useState('');
  const [statusSubtitle, setStatusSubtitle] = useState('');
  const [statusEmoji, setStatusEmoji] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const { userId, secret } = useLocalSearchParams();
  const { colors: theme } = useTheme();
  const styles = getStyles(theme);

  useEffect(() => {
    if (!userId || !secret) {
      setModalInfo({
        visible: true,
        title: 'Invalid Reset Link',
        subtitle:
          'This password reset link is invalid or has expired. Please request a new one.',
        emoji: '❌',
      });
      setIsComplete(true);
    }
  }, [userId, secret]);

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      setModalInfo({
        visible: true,
        title: 'Missing Fields',
        subtitle: 'Please fill in both password fields.',
        emoji: '📝',
      });
      return;
    }

    if (password.length < 8) {
      setModalInfo({
        visible: true,
        title: 'Password Too Short',
        subtitle: 'Password must be at least 8 characters long.',
        emoji: '🔒',
      });
      return;
    }

    if (password !== confirmPassword) {
      setModalInfo({
        visible: true,
        title: 'Password Mismatch',
        subtitle: 'Passwords do not match. Please try again.',
        emoji: '🔒',
      });
      return;
    }

    if (!userId || !secret) {
      setModalInfo({
        visible: true,
        title: 'Invalid Reset Link',
        subtitle:
          'This password reset link is invalid. Please request a new one.',
        emoji: '❌',
      });
      setIsComplete(true);
      return;
    }

    setSubmitting(true);
    try {
      await account.updateRecovery(
        userId as string,
        secret as string,
        password
      );

      setStatusTitle('Password Reset Successful! 🎉');
      setStatusSubtitle(
        'Your password has been updated. You can now return to the SmartBites app and sign in with your new password.'
      );
      setStatusEmoji('✅');
      setIsComplete(true);
    } catch (error: any) {
      const message =
        error?.message?.replace(/^AppwriteException:\s*/, '') ??
        'Failed to reset password';
      setStatusTitle('Reset Failed');
      setStatusSubtitle(
        message.includes('expired')
          ? 'This reset link has expired. Please request a new password reset.'
          : message
      );
      setStatusEmoji('❌');
      setIsComplete(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setModalInfo({ ...modalInfo, visible: false });
  };

  return (
    <SafeAreaView style={styles.container}>
      {modalInfo.visible && (
        <Modal
          transparent
          animationType="fade"
          visible={modalInfo.visible}
          onRequestClose={handleModalClose}
        >
          <View style={styles.modalOverlay} onTouchEnd={handleModalClose}>
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
        </Modal>
      )}

      <View style={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Reset Password</Text>
          <Text style={styles.subheaderText}>
            {isComplete ? 'Status' : 'Enter your new password below.'}
          </Text>
        </View>

        {!isComplete && (
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>New Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  autoCapitalize="none"
                  placeholder="Enter new password"
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
                    <EyeOff size={24} color={theme.accentDark} />
                  ) : (
                    <Eye size={24} color={theme.accentDark} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm New Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  autoCapitalize="none"
                  placeholder="Confirm new password"
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
                    <EyeOff size={24} color={theme.accentDark} />
                  ) : (
                    <Eye size={24} color={theme.accentDark} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={submitting || !userId || !secret}
            >
              {submitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Update Password</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {isComplete && (
          <View
            style={{
              marginTop: 40,
              alignItems: 'center',
              paddingHorizontal: 20,
            }}
          >
            <Text style={styles.modalTitle}>{statusTitle}</Text>
            {statusSubtitle && (
              <Text style={styles.modalSubtitle}>{statusSubtitle}</Text>
            )}
            <Text style={{ marginTop: 20, textAlign: 'center' }}>
              You can now return to the SmartBites app and log in with your new
              password.
            </Text>
          </View>
        )}
      </View>

      {!isComplete && (
        <ThemedText style={{ fontSize: 14, textAlign: 'center', margin: 24 }}>
          <Text style={{ fontWeight: 'bold' }}>SmartBites</Text>
          <Text>™ © 2025</Text>
        </ThemedText>
      )}
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
    headerContainer: {
      marginBottom: Spacing.xl,
      alignItems: 'center',
    },
    headerText: {
      fontFamily: Fonts.heading,
      fontSize: FontSizes.xxxl,
      color: theme.primary,
      marginBottom: Spacing.sm,
      textAlign: 'center',
    },
    subheaderText: {
      fontFamily: Fonts.body,
      fontSize: FontSizes.md,
      color: Colors.dark[500],
      textAlign: 'center',
      paddingHorizontal: Spacing.md,
    },
    formContainer: {
      marginTop: Spacing.md,
    },
    inputContainer: {
      marginBottom: Spacing.lg,
    },
    label: {
      fontFamily: Fonts.body,
      fontSize: FontSizes.sm,
      color: Colors.dark[700],
      marginBottom: Spacing.xs,
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
      paddingRight: 50,
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
      textAlign: 'center',
    },
    modalSubtitle: {
      fontFamily: Fonts.body,
      fontSize: FontSizes.md,
      color: '#555',
      textAlign: 'center',
    },
  });
