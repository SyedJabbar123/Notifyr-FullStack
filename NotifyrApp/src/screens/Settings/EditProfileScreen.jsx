import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import CustomInput from '../../components/CustomInput';
import ScreenHeader from '../../components/ScreenHeader';
import { useAuth } from '../../hooks/useAuth';
import * as authService from '../../services/authService';
import { alert } from '../../utils/alert';
import { colors, spacing, shadows } from '../../theme/theme';

const EditProfileScreen = ({ navigation }) => {
  const { user, token, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async () => {
    if (!name.trim() || !email.trim()) {
      alert('Validation Error', 'Name and Email cannot be empty.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.updateProfile({ name: name.trim(), phone: phone.trim() }, token);
      await updateUser({ name: name.trim(), phone: phone.trim() });

      alert('Success', 'Your profile has been updated!', [
        { text: 'Awesome', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Update Failed', error.message || 'Could not update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardAvoid} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.contentWrapper}>
          <ScreenHeader 
            title="Edit Profile"
            onBackPress={() => navigation.goBack()}
          />

          <Text style={styles.subtitle}>Update your personal information</Text>

          <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
            <CustomInput
              label="Full Name"
              placeholder="e.g., Syed Abdul Jabbar"
              value={name}
              onChangeText={setName}
              icon="person-outline"
            />

            <CustomInput
              label="Email Address"
              placeholder="email@example.com"
              value={email}
              onChangeText={setEmail}
              icon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={false}
              style={{ backgroundColor: '#F0F4F8', color: '#A0B3D6' }}
            />

            <CustomInput
              label="Phone Number (Optional)"
              placeholder="+92 300 0000000"
              value={phone}
              onChangeText={setPhone}
              icon="call-outline"
              keyboardType="phone-pad"
            />

            <View style={styles.buttonWrapper}>
              <TouchableOpacity
                style={[styles.primaryButton, isLoading && { opacity: 0.7 }]}
                onPress={handleUpdateProfile}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Save Changes</Text>
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
  buttonText: { 
    color: colors.background, 
    fontSize: 16, 
    fontWeight: 'bold', 
  },
});

export default EditProfileScreen;