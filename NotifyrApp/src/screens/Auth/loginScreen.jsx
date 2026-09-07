import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomInput from '../../components/CustomInput';
import Logo from '../../components/Logo';
import { useAuth } from '../../hooks/useAuth';
import { colors, spacing, shadows } from '../../theme/theme';

const REMEMBERED_EMAIL_KEY = '@notifyr_remembered_email';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const { login, error, loading } = useAuth();

  const isFormValid = email.trim().length > 0 && password.length > 0;

  useEffect(() => {
    const loadRememberedEmail = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem(REMEMBERED_EMAIL_KEY);
        if (savedEmail) {
          setEmail(savedEmail);
          setRememberMe(true);
        }
      } catch (err) {
        console.error('Failed to load remembered email', err);
      }
    };
    loadRememberedEmail();
  }, []);

  const handleLogin = async () => {
    if (!isFormValid || loading) return;

    setFieldErrors({});

    try {
      await login({
        email: email.trim(),
        password: password,
      });

      if (rememberMe) {
        await AsyncStorage.setItem(REMEMBERED_EMAIL_KEY, email.trim());
      } else {
        await AsyncStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }

      navigation.navigate('Dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollGrow} bounces={false} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <View style={styles.topRow}>
            <View style={styles.textGroup}>
              <Text style={styles.welcomeTitle}>Good to see{'\n'}you again.</Text>
              <Text style={styles.welcomeSubtitle}>Sign in to your account to continue</Text>
            </View>
            <View style={styles.logoWrapper}>
              <Logo width={72} height={72} />
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          {error && (
            <View style={styles.generalErrorBox}>
              <Text style={styles.generalErrorText}>{error}</Text>
            </View>
          )}

          <CustomInput 
            label="Email Address" 
            placeholder="you@example.com" 
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => { setEmail(text); setFieldErrors({...fieldErrors, email: null}); }}
          />
          {fieldErrors.email && <Text style={styles.inlineError}>{fieldErrors.email}</Text>}
          
          <CustomInput 
            label="Password" 
            placeholder="••••••••••••" 
            icon="lock-closed-outline"
            isPassword={true}
            value={password}
            onChangeText={(text) => { setPassword(text); setFieldErrors({...fieldErrors, password: null}); }}
          />
          {fieldErrors.password && <Text style={styles.inlineError}>{fieldErrors.password}</Text>}

          <View style={styles.optionsRow}>
            <TouchableOpacity 
              style={styles.checkboxRow} 
              onPress={() => setRememberMe(!rememberMe)}
              disabled={loading}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                {rememberMe && <Ionicons name="checkmark" size={12} color={colors.background} />}
              </View>
              <Text style={styles.rememberText}>Remember Me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')}>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              (!isFormValid || loading) && styles.disabledButton
            ]}
            onPress={handleLogin}
            disabled={!isFormValid || loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>No account yet? </Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('SignupScreen')}
              disabled={loading}
            >
              <Text style={styles.footerLink}>Create one</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background, 
  },
  scrollGrow: { 
    flexGrow: 1, 
  },
  headerContainer: {
    backgroundColor: colors.brandNavy,
    paddingHorizontal: spacing.xl,
    paddingTop: Platform.OS === 'android' ? 44 : 54,
    paddingBottom: 28,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: colors.brandNavy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textGroup: {
    flex: 1,
    paddingRight: 12,
  },
  logoWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 18,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.background,
    marginBottom: 8,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: '#9AA5B5',
    fontWeight: '500',
    lineHeight: 18,
  },

  contentContainer: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: 34,
    paddingBottom: 40,
    backgroundColor: colors.background,
  },
  
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

  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 30,
  },
  checkboxRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: colors.brandNavy,
    borderRadius: 5,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
  },
  checkboxActive: { 
    backgroundColor: colors.brandNavy, 
  },
  rememberText: { 
    fontSize: 13, 
    color: colors.textSecondary, 
    fontWeight: '500', 
  },
  forgotPasswordText: { 
    fontSize: 13, 
    color: colors.brandGold, 
    fontWeight: '700', 
  },
  primaryButton: {
    backgroundColor: colors.brandNavy,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.floatingCard,
  },
  disabledButton: {
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
    marginTop: 30,
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

export default LoginScreen;