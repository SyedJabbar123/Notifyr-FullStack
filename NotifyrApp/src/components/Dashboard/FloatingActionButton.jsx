import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const FloatingActionButton = ({ onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={onPress}
        activeOpacity={0.85}
      >
        <Text style={styles.icon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 999, 
  },
  button: {
    width: 64,
    height: 64,
    backgroundColor: '#FFB800', // Signature Yellow
    borderRadius: 20, // Rounded square instead of a perfect circle
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  icon: {
    fontSize: 32,
    color: '#0A1526', // Dark navy cross for high contrast
    fontWeight: '400',
    marginTop: -2, 
  },
});

export default FloatingActionButton;