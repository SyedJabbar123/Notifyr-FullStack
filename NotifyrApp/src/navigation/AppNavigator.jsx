// src/navigation/AppNavigator.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import CategorySelectionScreen from '../screens/AddItem/CategorySelectionScreen';
import AddItemFormScreen from '../screens/AddItem/AddItemFormScreen';
import QRScannerScreen from '../screens/QRScanner/QRScannerScreen';
import ItemDetailScreen from '../screens/Dashboard/ItemDetailScreen';
import EditPorfileScreen from '../screens/Settings/EditProfileScreen';
import HelpFaqScreen from '../screens/Support/HelpFaqScreen';
import ContactUsScreen from '../screens/Support/ContactUsScreen';
// import ChangePasswordScreen from '../screens/Settings/ChangePasswordScreen';
import ResetPasswordScreen from '../screens/Settings/ResetPasswordScreen';
import LoginScreen from '../screens/Auth/loginScreen';
import BlockedDevicesScreen from '../screens/Settings/BlockedDevicesScreen';
  

const Stack = createNativeStackNavigator();

// This is the "logged in" navigator — shown when isAuthenticated is true in App.js.
// Dashboard/Settings live inside TabNavigator; these are the stack screens
// reachable from within the authenticated app (not part of the tab bar itself).
const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={TabNavigator} />
      <Stack.Screen name="ItemDetail" component={ItemDetailScreen}/>
      <Stack.Screen name="CategorySelection" component={CategorySelectionScreen} />
      <Stack.Screen name="AddItemForm" component={AddItemFormScreen} />
      <Stack.Screen name="QRScannerScreen" component={QRScannerScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditPorfileScreen} />
      <Stack.Screen name="HelpFaqScreen" component={HelpFaqScreen} />
      <Stack.Screen name="ContactUsScreen" component={ContactUsScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      {/* <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} /> */}
      <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
      <Stack.Screen name="BlockedDevicesScreen" component={BlockedDevicesScreen} />
      
    </Stack.Navigator>
  );
};

export default AppNavigator;