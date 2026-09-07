import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, typography, spacing } from '../theme/theme';

const ScreenHeader = ({ title, onBackPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={onBackPress} 
        style={styles.backButton} 
        activeOpacity={0.7} 
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
      </TouchableOpacity>

      {title && <Text style={styles.title}>{title}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    fontSize: 28,
    letterSpacing: -0.5,
  },
});

export default ScreenHeader;