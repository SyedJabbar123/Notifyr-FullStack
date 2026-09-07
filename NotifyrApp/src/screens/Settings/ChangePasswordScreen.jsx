import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import CustomInput from '../../components/CustomInput';
import ScreenHeader from '../../components/ScreenHeader';
import * as authService from '../../services/authService';
import { alert } from '../../utils/alert';
import { colors, spacing, shadows } from '../../theme/theme';

const ChangePasswordScreen = ({ route, navigation }) => {
  const { resetToken } = route.params || {};

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = newPassword.trim().length > 0 && confirmPassword.trim().length > 0;

  const handleResetPassword = async () => {
    if (!isFormValid || isLoading) return;

    if (newPassword !== confirmPassword) {
      alert('Validation Error', 'Your passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      alert('Validation Error', 'New password must be at least 6 characters long.');
      return;
    }

    if (!resetToken) {
      alert('Error', 'Missing reset token. Please request a new password reset link.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword(resetToken, newPassword);

      alert('Success', 'Your password has been successfully updated!', [
        { text: 'Login Now', onPress: () => navigation.navigate('LoginScreen') },
      ]);
    } catch (error) {
      alert('Reset Failed', error.message || 'Could not reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardAvoid} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.contentWrapper}>
          <ScreenHeader 
            title="Reset Password"
            onBackPress={() => navigation.goBack()}
          />

          <Text style={styles.subtitle}>Enter your new password below</Text>

          <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
            <CustomInput
              label="New Password"
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={setNewPassword}
              isPassword={true}
            />

            <CustomInput
              label="Confirm New Password"
              placeholder="Type new password again"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              isPassword={true}
            />

            <View style={styles.passwordRules}>
              <Text style={styles.ruleText}>• Must be at least 6 characters</Text>
            </View>

            <View style={styles.buttonWrapper}>
              <TouchableOpacity
                style={[
                  styles.primaryButton, 
                  (!isFormValid || isLoading) && styles.primaryButtonDisabled
                ]}
                onPress={handleResetPassword}
                disabled={!isFormValid || isLoading}
                activeOpacity={0.85}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Reset Password</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
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
  },
  formContainer: { 
    paddingBottom: 50, 
  },
  passwordRules: { 
    marginTop: spacing.xs, 
    paddingHorizontal: 5, 
  },
  ruleText: { 
    fontSize: 13, 
    color: colors.textSecondary, 
    marginBottom: 4, 
  },
  buttonWrapper: { 
    marginTop: spacing.xl, 
  },
  primaryButton: {
    backgroundColor: colors.brandNavy,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
});

export default ChangePasswordScreen;