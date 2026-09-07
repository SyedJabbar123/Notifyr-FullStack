import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CATEGORIES, getCategoryIcon } from '../../constants/categories';
import { colors, spacing, shadows } from '../../theme/theme';
import ScreenHeader from '../../components/ScreenHeader';

const CategorySelectionScreen = ({ route, navigation }) => {
  const { activeItems } = route?.params || { activeItems: [] };
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };

  const handleContinue = () => {
    if (!selectedCategory) return;
    const existingItem = activeItems.find(item => item.category === selectedCategory.id);
    navigation.navigate('AddItemForm', {
      categoryId: selectedCategory.id,
      categoryName: selectedCategory.name,
      existingItem: existingItem || null
    });
  };

  const renderCategory = ({ item }) => {
    const isSelected = selectedCategory?.id === item.id;
    const iconName = getCategoryIcon(item.id);

    return (
      <TouchableOpacity
        style={[styles.gridItem, isSelected && styles.gridItemActive]}
        onPress={() => handleCategoryPress(item)}
        activeOpacity={0.8}
      >
        <View style={[styles.iconWrapper, isSelected && styles.iconWrapperActive]}>
          <Ionicons 
            name={iconName} 
            size={26} 
            color={isSelected ? colors.brandGold : colors.brandNavy} 
          />
        </View>
        <Text style={[styles.label, isSelected && styles.labelActive]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <ScreenHeader
          title="Select Category"
          onBackPress={() => navigation.goBack()}
        />

        <Text style={styles.subtitle}>What type of item are you registering?</Text>

        <FlatList
          data={CATEGORIES}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
          renderItem={renderCategory}
        />

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              !selectedCategory && styles.primaryButtonDisabled
            ]}
            onPress={handleContinue}
            disabled={!selectedCategory}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: spacing.xl,
    fontWeight: '500',
  },
  gridContainer: {
    paddingBottom: spacing.md,
  },
  gridItem: {
    flex: 1,
    backgroundColor: colors.background,
    margin: spacing.sm,
    borderRadius: 20,
    aspectRatio: 0.85,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.floatingCard,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  gridItemActive: {
    backgroundColor: colors.brandNavy,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  iconWrapperActive: {
    backgroundColor: colors.brandNavy,
    borderWidth: 1.5,
    borderColor: colors.brandGold,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.brandNavy,
    textAlign: 'center',
  },
  labelActive: {
    color: colors.background,
  },
  footer: {
    paddingBottom: Platform.OS === 'ios' ? spacing.xxl : spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
  },
  primaryButton: {
    height: 56,
    backgroundColor: colors.brandNavy,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.floatingCard,
  },
  primaryButtonDisabled: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CategorySelectionScreen;