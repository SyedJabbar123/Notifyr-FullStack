import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, spacing, shadows } from '../theme/theme';

const CustomInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  isPassword,
  keyboardType,
  autoCapitalize = 'none',
  icon,
  prefix,
  maxLength,
  ...props
}) => {
  const [isSecure, setIsSecure] = useState(true);

  const showToggle = isPassword;
  const actualSecureTextEntry = showToggle ? isSecure : secureTextEntry;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.inputRow}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={18} 
            color={colors.brandNavy} 
            style={styles.iconStyle} 
          />
        )}

        {prefix && (
          <Text style={styles.prefix}>{prefix}</Text>
        )}

        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={actualSecureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          {...props} 
          style={[styles.input, props.style]}
        />

        {showToggle && (
          <TouchableOpacity
            onPress={() => setIsSecure((prev) => !prev)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isSecure ? 'eye-off-outline' : 'eye-outline'} 
              size={20} 
              color="#94A3B8" 
              style={styles.eyeIconStyle}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    width: '100%',
  },
  label: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 6,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  iconStyle: {
    marginRight: 10,
  },
  prefix: {
    fontSize: 15,
    color: colors.brandNavy,
    fontWeight: '600',
    marginRight: 8,
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.brandNavy,
    fontWeight: '500',
    paddingVertical: 0,
  },
  eyeIconStyle: {
    marginLeft: 8,
  },
});

export default CustomInput;