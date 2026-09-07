import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import CustomInput from '../../components/CustomInput';
import ScreenHeader from '../../components/ScreenHeader';
import * as authService from '../../services/authService';
import { alert } from '../../utils/alert';
import { colors, spacing, shadows } from '../../theme/theme';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = email.trim().length > 0;

  const handleForgotPassword = async () => {
    if (!isFormValid || isLoading) return;

    setIsLoading(true);

    try {
      await authService.forgotPassword(email.trim().toLowerCase());

      alert(
        'Check Your Email',
        "If an account exists for that email, we've sent a link to reset your password. Tap the link, set a new password, then come back and log in.",
        [
          {
            text: 'Back to Login',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      alert('Request Failed', error.message || 'Could not process request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardAvoid} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.contentWrapper}>
          <ScreenHeader 
            title="Forgot Password"
            onBackPress={() => navigation.goBack()}
          />

          <Text style={styles.subtitle}>
            Enter your account email and we'll send a secure link to reset your password.
          </Text>

          <View style={styles.form}>
            <CustomInput
              label="Email Address"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              icon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={[
                styles.primaryButton,
                (!isFormValid || isLoading) && styles.primaryButtonDisabled
              ]}
              onPress={handleForgotPassword}
              disabled={!isFormValid || isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text style={styles.buttonText}>Send Reset Link</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Remembered it? </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.footerLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background, 
  },
  keyboardAvoid: { 
    flex: 1, 
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.background,
  },
  subtitle: { 
    fontSize: 14, 
    color: colors.textSecondary, 
    marginTop: spacing.xs,
    marginBottom: spacing.lg, 
    fontWeight: '500', 
    lineHeight: 20,
  },
  form: { 
    width: '100%', 
  },
  primaryButton: {
    backgroundColor: colors.brandNavy,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    ...shadows.floatingCard,
  },
  primaryButtonDisabled: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: { 
    color: colors.background, 
    fontSize: 16, 
    fontWeight: 'bold', 
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  footerText: { 
    color: colors.textSecondary, 
    fontSize: 13, 
  },
  footerLink: { 
    color: colors.brandNavy, 
    fontSize: 13, 
    fontWeight: 'bold', 
  },
});

export default ForgotPasswordScreen;