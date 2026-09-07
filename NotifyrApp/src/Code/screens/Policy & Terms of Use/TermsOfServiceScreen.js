import React from 'react';
import { SafeAreaView, ScrollView, Text, StyleSheet, View } from 'react-native';
import ScreenHeader from '../../components/ScreenHeader';
import { colors, spacing } from '../../theme/theme';

const TermsOfServiceScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Ambient Background Orbs */}
      <View style={styles.orbYellow} />
      <View style={styles.orbNavy} />

      {/* Header outside the glass card */}
      <View style={styles.headerContainer}>
        <ScreenHeader 
          title="Terms of Service" 
          onBackPress={() => navigation.goBack()} 
        />
      </View>
      
      {/* Glassmorphism Card */}
      <View style={styles.glassCard}>
        <ScrollView contentContainerStyle={styles.scrollGrow} showsVerticalScrollIndicator={false}>
          <Text style={styles.subtitle}>Last Updated: August 2026</Text>

          <Text style={styles.heading}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By accessing or using the Notifyr application, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the app.
          </Text>

          <Text style={styles.heading}>2. Description of Service</Text>
          <Text style={styles.paragraph}>
            Notifyr provides a QR-code based asset tracking and anonymous communication platform. We provide the digital infrastructure to allow finders of lost items to contact the owners anonymously. We do not physically track items and are not responsible for the recovery of lost or stolen property.
          </Text>

          <Text style={styles.heading}>3. Acceptable Use</Text>
          <Text style={styles.paragraph}>You agree not to use the Service to:</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Send spam, abusive, harassing, or threatening messages.</Text>
            <Text style={styles.bulletItem}>• Impersonate any person or entity.</Text>
            <Text style={styles.bulletItem}>• Interfere with or disrupt the integrity of the Service.</Text>
          </View>

          <Text style={styles.heading}>4. Account Suspension</Text>
          <Text style={styles.paragraph}>
            We reserve the right to suspend or terminate accounts, or block specific devices, that repeatedly violate these Terms or engage in abusive behavior toward other users.
          </Text>

          <Text style={styles.heading}>5. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            In no event shall Notifyr be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of property, loss of profits, data, or other intangible losses, resulting from your use or inability to use the Service.
          </Text>

          <Text style={styles.heading}>6. Changes to Terms</Text>
          <Text style={styles.paragraph}>
            We reserve the right to modify or replace these Terms at any time. Your continued use of the app after any revisions become effective constitutes your acceptance of the new Terms.
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC', 
    position: 'relative'
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    zIndex: 10,
  },
  orbYellow: {
    position: 'absolute',
    top: -50,
    right: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
  },
  orbNavy: {
    position: 'absolute',
    bottom: -50,
    left: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(10, 25, 49, 0.08)',
  },
  glassCard: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.75)', // Slightly more opaque to hide background text overlap
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden',
    // Removed shadows and elevation to fix Android rendering bug
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: 'transparent', // Forces Android to stop rendering a white background
  },
  scrollGrow: { 
    flexGrow: 1, 
    padding: 24, // Hardcoded to 24 to guarantee text never hits the edge
    paddingBottom: 40,
  },
  subtitle: { 
    fontSize: 14, 
    color: colors.brandNavy, 
    marginBottom: 24, 
    fontWeight: '700', 
    opacity: 0.6,
  },
  heading: { 
    fontSize: 17, 
    fontWeight: '900', 
    color: colors.brandNavy, 
    marginTop: 16, 
    marginBottom: 8 
  },
  paragraph: { 
    fontSize: 14, 
    color: '#475569', 
    lineHeight: 24, 
    marginBottom: 24 
  },
  bulletList: { 
    marginBottom: 24, 
    paddingLeft: 8 
  },
  bulletItem: { 
    fontSize: 14, 
    color: '#475569', 
    lineHeight: 24, 
    marginBottom: 8 
  },
  boldText: { 
    fontWeight: '800', 
    color: colors.brandNavy 
  },
});

export default TermsOfServiceScreen;