import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, LayoutAnimation, Platform, UIManager } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenHeader from '../../components/ScreenHeader';
import { colors, spacing, shadows } from '../../theme/theme';

// Enable LayoutAnimation for Android to make the accordion expand smoothly
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HelpFaqScreen = ({ navigation }) => {
  const [expandedId, setExpandedId] = useState(null);

  // Ready-to-use FAQ data tailored for the Notifyr workflow
  const faqData = [
    {
      id: 1,
      question: "How do I link a new QR tag to my item?",
      answer: "Go to your Dashboard, tap the + button, and fill out your item details (like your HP ZBook G5 Studio workstation, backpack, or keys). Once saved, the app will automatically prompt you to scan a physical Notifyr tag to bind it to that profile."
    },
    {
      id: 2,
      question: "What does 'Global Do Not Disturb' do?",
      answer: "When activated from your Dashboard or Settings, DND temporarily pauses all incoming notifications from finders. This is perfect for when you are in a lecture, an exam, or a meeting and cannot be interrupted."
    },
    {
      id: 3,
      question: "Is my personal information secure?",
      answer: "Yes. When someone scans your tag, they are taken to a secure, anonymous web portal where they can message you without seeing your phone number or email. You control what private details are shared."
    },
    {
      id: 4,
      question: "I lost my item on campus, what happens now?",
      answer: "If you leave something behind around the campus and someone scans the attached tag, you will instantly receive a push notification and a message in your Notifyr inbox letting you coordinate a safe return."
    },
    {
      id: 5,
      question: "Can I update an item's details after creating it?",
      answer: "Absolutely. Tap on any item card on your Dashboard, and hit 'Edit Item' to update its nickname, color, photo, or status (Active vs. Lost)."
    }
  ];

  const toggleExpand = (id) => {
    // Smoothly animate the opening/closing of the answer
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <ScreenHeader 
          title="Help & FAQ"
          onBackPress={() => navigation.goBack()}
        />

        <Text style={styles.subtitle}>How can we help you today?</Text>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.contactCard}>
            <Text style={styles.contactTitle}>Still need help?</Text>
            <Text style={styles.contactSubtitle}>If you are facing a critical issue, reach out directly to the support team.</Text>
            <TouchableOpacity 
              style={styles.contactButton} 
              onPress={() => navigation.navigate('ContactUsScreen')}
              activeOpacity={0.85}
            >
              <Text style={styles.contactButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>FREQUENTLY ASKED QUESTIONS</Text>

          {faqData.map((item) => {
            const isExpanded = expandedId === item.id;

            return (
              <View key={item.id} style={styles.faqCard}>
                <TouchableOpacity 
                  style={styles.questionRow} 
                  onPress={() => toggleExpand(item.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.questionText, isExpanded && styles.questionTextActive]}>
                    {item.question}
                  </Text>
                  <Ionicons 
                    name={isExpanded ? 'remove' : 'add'} 
                    size={20} 
                    color={isExpanded ? colors.brandGold : '#A0B3D6'} 
                  />
                </TouchableOpacity>
                
                {isExpanded && (
                  <View style={styles.answerRow}>
                    <Text style={styles.answerText}>{item.answer}</Text>
                  </View>
                )}
              </View>
            );
          })}
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
    backgroundColor: colors.brandNavy,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'flex-start',
    ...shadows.floatingCard,
  },
  contactTitle: { 
    color: colors.background, 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 6, 
  },
  contactSubtitle: { 
    color: '#A0B3D6', 
    fontSize: 14, 
    lineHeight: 20, 
    marginBottom: 16, 
  },
  contactButton: { 
    backgroundColor: colors.brandGold, 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 8,
  },
  contactButtonText: { 
    color: colors.brandNavy, 
    fontWeight: 'bold', 
    fontSize: 14, 
  },

  sectionTitle: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: '#A0B3D6', 
    marginBottom: 15, 
    letterSpacing: 1, 
    marginLeft: 5, 
  },
  
  faqCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    ...shadows.floatingCard,
    borderWidth: 1.5,
    borderColor: '#F0F4F8',
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.surfaceLight,
  },
  questionText: { 
    flex: 1, 
    fontSize: 15, 
    fontWeight: '600', 
    color: '#333', 
    paddingRight: 10, 
  },
  questionTextActive: { 
    color: colors.brandNavy, 
  },
  
  answerRow: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: colors.surfaceLight,
  },
  answerText: { 
    fontSize: 14, 
    color: '#666', 
    lineHeight: 22, 
  },
});

export default HelpFaqScreen;