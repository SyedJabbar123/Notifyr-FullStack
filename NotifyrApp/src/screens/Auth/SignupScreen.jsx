import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import CustomInput from '../../components/CustomInput';
import ScreenHeader from '../../components/ScreenHeader';
import { useAuth } from '../../hooks/useAuth';
import { colors, spacing, shadows } from '../../theme/theme';

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [fieldErrors, setFieldErrors] = useState({});
  const { signup, loading, error } = useAuth();

  const isFormValid = 
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    phone.trim().length === 10 &&
    password.length > 0 &&
    confirmPassword.length > 0;

  const handleSignup = async () => {
    if (!isFormValid || loading) return;

    const errors = {};
    if (!name.trim()) {
      errors.name = 'Name is required';
    }
    if (!email.trim()) {
      errors.email = 'Email is required';
    }
    const phoneNumber = phone.trim();
    if (!phoneNumber) {
      errors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(phone)) {
      errors.phone = 'Enter a valid phone number';
    }
    if (!password) {
      errors.password = 'Password is required';
    }
    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm Password is required';
    }
    if (
      password &&
      confirmPassword &&
      password !== confirmPassword
    ) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    try {
      await signup({
        name: name.trim(),
        email: email.trim(),
        phone: `+92${phoneNumber}`,
        password,
      });
      
      navigation.navigate('LoginScreen');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.contentWrapper}>
        <ScreenHeader 
          title="Create Account"
          onBackPress={() => navigation.goBack()}
        />

        <Text style={styles.subtitle}>Join thousands protecting their belongings</Text>

        <ScrollView contentContainerStyle={styles.scrollGrow} showsVerticalScrollIndicator={false} bounces={false}>
          {/* General Error (if the backend sends an error that doesn't fit a specific field) */}
          {error && (
            <View style={styles.generalErrorBox}>
              <Text style={styles.generalErrorText}>{error}</Text>
            </View>
          )}

          <CustomInput 
            label="Full Name" 
            placeholder="Marcus Webb" 
            icon="person-outline"
            value={name}
            onChangeText={(text) => { setName(text); setFieldErrors({...fieldErrors, name: null}); }}
          />
          {fieldErrors.name && <Text style={styles.inlineError}>{fieldErrors.name}</Text>}

          <CustomInput 
            label="University Email" 
            placeholder="you@example.com" 
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => { setEmail(text); setFieldErrors({...fieldErrors, email: null}); }}
          />
          {fieldErrors.email && <Text style={styles.inlineError}>{fieldErrors.email}</Text>}

          <CustomInput
            label="Phone Number"
            placeholder="3001234567"
            icon="call-outline"
            prefix="+92"
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={(text) => {
              const digits = text.replace(/\D/g, '');
              setPhone(digits);
              setFieldErrors({
                ...fieldErrors,
                phone: null,
              });
            }}
          />      
          {fieldErrors.phone && <Text style={styles.inlineError}>{fieldErrors.phone}</Text>}

          <CustomInput 
            label="Password" 
            placeholder="Create a password" 
            icon="lock-closed-outline"
            isPassword={true}
            value={password}
            onChangeText={(text) => { setPassword(text); setFieldErrors({...fieldErrors, password: null}); }}
          />
          {fieldErrors.password && <Text style={styles.inlineError}>{fieldErrors.password}</Text>}

          <CustomInput
            label="Confirm Password"
            placeholder="Confirm your password"
            icon="lock-closed-outline"
            isPassword={true}
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setFieldErrors({
                ...fieldErrors,
                confirmPassword: null,
              });
            }}
          />
          {fieldErrors.confirmPassword && (
            <Text style={styles.inlineError}>
              {fieldErrors.confirmPassword}
            </Text>
          )}
{/* 
          <Text style={styles.termsText}>
            By continuing you agree to our <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>.
          </Text> */}
          <View style={styles.legalContainer}>
  <Text style={styles.legalText}>By creating an account, you agree to our </Text>
  
  <TouchableOpacity onPress={() => navigation.navigate('TermsOfServiceScreen')}>
    <Text style={styles.linkText}>Terms of Service</Text>
  </TouchableOpacity>
  
  <Text style={styles.legalText}> and </Text>
  
  <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicyScreen')}>
    <Text style={styles.linkText}>Privacy Policy</Text>
  </TouchableOpacity>
</View>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              (!isFormValid || loading) && styles.disabledButton
            ]}
            onPress={handleSignup}
            disabled={!isFormValid || loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={styles.buttonText}>
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
              <Text style={styles.footerLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background, 
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
  scrollGrow: { 
    flexGrow: 1, 
    paddingBottom: 40,
  },
  
  /* --- Validation Error Styles --- */
  inlineError: {
    color: '#D32F2F',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 10,
    marginLeft: 5,
    fontWeight: '500',
  },
  generalErrorBox: {
    backgroundColor: '#FDECEA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#D32F2F',
  },
  generalErrorText: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: '600',
  },

  termsText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 18,
  },
  termsLink: {
    color: colors.brandNavy,
    fontWeight: 'bold',
  },

  /* --- Button & Footer Styles --- */
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
  disabledButton: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0,
    elevation: 0,
  },
  legalContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center', 
    marginTop: 16,
    paddingHorizontal: 20
  },
  legalText: { 
    color: '#64748B', 
    fontSize: 12 
  },
  linkText: { 
    color: '#0A1931', 
    fontSize: 12, 
    fontWeight: 'bold', 
    textDecorationLine: 'underline' 
  }
});

export default SignupScreen;