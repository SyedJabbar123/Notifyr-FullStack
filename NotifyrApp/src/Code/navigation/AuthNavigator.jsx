// src/navigation/AuthNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Auth/loginScreen'; // Matches your lowercase 'l'
import SignupScreen from '../screens/Auth/SignupScreen';     // Matches your capital 'S'
import TabNavigator from './TabNavigator';
import CategorySelectionScreen from '../screens/AddItem/CategorySelectionScreen';
import AddItemFormScreen from '../screens/AddItem/AddItemFormScreen';
import QRScannerScreen from '../screens/QRScanner/QRScannerScreen';
import ItemDetailScreen from '../screens/Dashboard/ItemDetailScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import ChangePasswordScreen from '../screens/Settings/ChangePasswordScreen';
import PrivacyPolicyScreen from '../screens/Policy & Terms of Use/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/Policy & Terms of Use/TermsOfServiceScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
     <Stack.Screen name="Dashboard" component={TabNavigator} />
     <Stack.Screen name="ItemDetail"component={ItemDetailScreen} />
      <Stack.Screen name="CategorySelection" component={CategorySelectionScreen} />
      <Stack.Screen name="AddItemForm" component={AddItemFormScreen} />
      <Stack.Screen name="QRScannerScreen" component={QRScannerScreen} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
         <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
         <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
      <Stack.Screen name="TermsOfServiceScreen" component={TermsOfServiceScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;