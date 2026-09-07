import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const Logo = ({ width = 120, height = 120, style }) => {
  return (
    <View style={[styles.logoContainer, style]}>
      <Image 
        source={require('../assets/logo.png')} 
        style={[styles.logoImage, { width, height }]} 
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    // No background color, keeping it transparent as requested
  },
});

export default Logo;