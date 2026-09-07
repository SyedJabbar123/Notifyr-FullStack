import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Linking, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenHeader from '../../components/ScreenHeader';
import { alert } from '../../utils/alert';
import { colors, spacing, shadows } from '../../theme/theme';

const ContactUsScreen = ({ navigation }) => {
  const supportEmail = "support@notifyr.com";

  const handleEmailSupport = async () => {
    const subject = "Notifyr App Support Request";
    const body = "Hi Notifyr Team,\n\nI need some help with...\n\n";
    const mailtoUrl = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
      const canOpen = await Linking.canOpenURL(mailtoUrl);
      
      if (canOpen) {
        await Linking.openURL(mailtoUrl);
      } else {
        alert("Error", "No email app found. Please email us directly at " + supportEmail);
      }
    } catch (error) {
      console.error("Error opening email client:", error);
      alert("Error", "Could not open your email client.");
    }
  };

  const ContactCard = ({ icon, title, description, onPress, buttonText }) => (
    <View style={styles.contactCard}>
      <View style={styles.cardHeader}>
        <View style={styles.iconCircle}>
          <Ionicons name={icon} size={24} color={colors.brandNavy} />
        </View>
        <View style={styles.cardHeaderText}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.primaryButton} onPress={onPress} activeOpacity={0.85}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <ScreenHeader 
          title="Contact Us"
          onBackPress={() => navigation.goBack()}
        />

        <Text style={styles.subtitle}>We are here to help you</Text>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Main Email Support Card */}
          <ContactCard 
            icon="mail-outline"
            title="Email Support"
            description="Drop us an email. We aim to respond to all inquiries within 24 hours."
            buttonText="Send an Email"
            onPress={handleEmailSupport}
          />

          {/* Developer/Pilot Team Note */}
          <View style={styles.teamCard}>
            <Text style={styles.teamTitle}>Campus Pilot Support</Text>
            <Text style={styles.teamDescription}>
              For immediate, on-the-ground assistance during our pilot, you can reach out directly to the core Notifyr development team (Syed, Minahil, and Adeeba). 
            </Text>
            <Text style={styles.teamHighlight}>We value your early feedback!</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
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
  scrollContent: { 
    paddingBottom: 50, 
  },
  
  contactCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    ...shadows.floatingCard,
    borderWidth: 1.5,
    borderColor: '#F0F4F8',
  },
  cardHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20, 
  },
  iconCircle: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    backgroundColor: colors.background, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15, 
  },
  cardHeaderText: { 
    flex: 1, 
  },
  cardTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#1A1A1A', 
  },
  cardDescription: { 
    fontSize: 14, 
    color: '#666', 
    marginTop: 4, 
    lineHeight: 20, 
  },
  
  primaryButton: {
    backgroundColor: colors.brandNavy,
    paddingVertical: 16,
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

  teamCard: {
    backgroundColor: colors.brandNavy,
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
    ...shadows.floatingCard,
  },
  teamTitle: { 
    color: '#FFB800', 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 8, 
    letterSpacing: 0.5, 
  },
  teamDescription: { 
    color: '#A0B3D6', 
    fontSize: 14, 
    lineHeight: 22, 
    marginBottom: 12, 
  },
  teamHighlight: { 
    color: colors.background, 
    fontSize: 14, 
    fontWeight: 'bold', 
    fontStyle: 'italic', 
  },
});

export default ContactUsScreen;