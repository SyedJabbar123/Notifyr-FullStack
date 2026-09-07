// src/components/BottomSheetMenu.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

/**
 * Reusable bottom-sheet action menu.
 *
 * Usage:
 * <BottomSheetMenu
 *   visible={!!activeItem}
 *   onClose={() => setActiveItem(null)}
 *   options={[
 *     { label: 'Block Sender', icon: <Ionicons name="ban-outline" size={18} color="#D32F2F" />, destructive: true, onPress: handleBlock },
 *   ]}
 * />
 */
const BottomSheetMenu = ({ visible, onClose, options = [], cancelLabel = 'Cancel' }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <View style={styles.sheet}>
          {options.map((option, index) => (
            <React.Fragment key={option.label}>
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  onClose();
                  option.onPress?.();
                }}
                activeOpacity={0.7}
              >
                <View style={styles.optionContent}>
                  {option.icon && <View style={styles.iconContainer}>{option.icon}</View>}
                  <Text style={[styles.optionText, option.destructive && styles.optionTextDestructive]}>
                    {option.label}
                  </Text>
                </View>
              </TouchableOpacity>
              {index < options.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}

          <View style={styles.divider} />

          <TouchableOpacity style={styles.option} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.cancelText}>{cancelLabel}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 25, 49, 0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: 28,
    paddingHorizontal: 20,
  },
  option: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0A1931',
  },
  optionTextDestructive: {
    color: '#D32F2F',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8A94A6',
  },
});

export default BottomSheetMenu;