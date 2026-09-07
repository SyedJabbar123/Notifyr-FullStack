import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors, spacing } from '../theme/theme';

const TabScreenHeader = ({ eyebrow, title, subtitle }) => {
  return (
    <View style={styles.tabHeader}>
      {eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
      
      <View style={styles.titleRow}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      
      {subtitle && (
        <Text style={styles.headerSubtitle}>{subtitle}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabHeader: {
    paddingHorizontal: spacing.xl,
    paddingTop: Platform.OS === 'android' ? spacing.xxl : spacing.xl,
    paddingBottom: spacing.lg,
    backgroundColor: colors.brandNavy,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.brandGold,
    letterSpacing: 1.5,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.background,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#9AA5B5',
    marginTop: 4,
    fontWeight: '500',
  },
});

export default TabScreenHeader;