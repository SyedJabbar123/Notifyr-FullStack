import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import CustomInput from '../../components/CustomInput';
import ScreenHeader from '../../components/ScreenHeader';
import { useAuth } from '../../hooks/useAuth';
import * as authService from '../../services/authService';
import { alert } from '../../utils/alert';
import { colors, spacing, shadows } from '../../theme/theme';

const ResetPasswordScreen = ({ navigation }) => {
  const { token } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Validation Error', 'Please fill in all password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Validation Error', 'Your new passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      alert('Validation Error', 'New password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.changePassword(currentPassword, newPassword, token);

      alert('Success', 'Your password has been updated.', [
        { text: 'Done', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      alert('Update Failed', err.message || 'Could not update your password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardAvoid} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.contentWrapper}>
          <ScreenHeader title="Reset Password" onBackPress={() => navigation.goBack()} />

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.subtitle}>
              Enter your current password, then choose a new one.
            </Text>

            <CustomInput
              label="Current Password"
              placeholder="Enter current password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              icon="lock-closed-outline"
              isPassword={true}
            />

            <CustomInput
              label="New Password"
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={setNewPassword}
              icon="key-outline"
              isPassword={true}
            />

            <CustomInput
              label="Confirm New Password"
              placeholder="Type new password again"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              icon="checkmark-outline"
              isPassword={true}
            />

            <Text style={styles.ruleText}>• Must be at least 8 characters</Text>

            <TouchableOpacity
              style={[styles.primaryButton, isLoading && { opacity: 0.7 }]}
              onPress={handleUpdatePassword}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text style={styles.buttonText}>Update Password</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  keyboardAvoid: { flex: 1 },
  contentWrapper: { flex: 1, paddingHorizontal: spacing.xl, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 50 },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    fontWeight: '500',
  },
  ruleText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: spacing.xl,
    marginLeft: 5,
  },
  primaryButton: {
    backgroundColor: colors.brandNavy,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.floatingCard,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResetPasswordScreen;