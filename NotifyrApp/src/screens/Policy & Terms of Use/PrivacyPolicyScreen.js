import React from 'react';
import { SafeAreaView, ScrollView, Text, StyleSheet, View } from 'react-native';
import ScreenHeader from '../../components/ScreenHeader';
import { colors } from '../../theme/theme';

const PrivacyPolicyScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Ambient Background Orbs */}
      <View style={styles.orbYellow} />
      <View style={styles.orbNavy} />

      {/* Header */}
      <View style={styles.headerContainer}>
        <ScreenHeader 
          title="Privacy Policy" 
          onBackPress={() => navigation.goBack()} 
        />
      </View>
      
      {/* Glassmorphism Card */}
      <View style={styles.glassCard}>
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollGrow} 
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.subtitle}>Last Updated: August 2026</Text>

          <Text style={styles.heading}>1. Introduction</Text>
          <Text style={styles.paragraph}>
            Notifyr respects your privacy and is committed to protecting your personal data. 
            This policy explains how we collect, use, and safeguard your information within our mobile application.
          </Text>

          <Text style={styles.heading}>2. Information We Collect</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• <Text style={styles.boldText}>Account Data:</Text> We collect your email address and authentication details to secure your account.</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.boldText}>Push Tokens:</Text> We collect device tokens to route real-time alerts to your phone.</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.boldText}>Device Hashes:</Text> We temporarily hash device identifiers to facilitate sender-blocking without tracking personal identities.</Text>
          </View>

          <Text style={styles.heading}>3. Anonymity and Messaging</Text>
          <Text style={styles.paragraph}>
            Notifyr acts as a blind communication bridge. When a finder scans your QR tag, they do not see your email, phone number, or name. As the owner, you also do not see the finder's personal information.
          </Text>

          <Text style={styles.heading}>4. Device Permissions</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• <Text style={styles.boldText}>Camera:</Text> We require camera access strictly for scanning QR codes locally on your device. We do not record or transmit background video.</Text>
            <Text style={styles.bulletItem}>• <Text style={styles.boldText}>Location:</Text> If a finder explicitly opts to share their location, those coordinates are sent to the owner. Location tracking is never continuous.</Text>
          </View>

          <Text style={styles.heading}>5. Data Deletion</Text>
          <Text style={styles.paragraph}>
            You have the right to delete your account directly within this app at any time. Upon deletion, all registered items, active QR links, and message histories are permanently erased from our active servers.
          </Text>

          <Text style={styles.heading}>6. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about this policy, please contact us at support@notifyr.app.
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

export default PrivacyPolicyScreen;