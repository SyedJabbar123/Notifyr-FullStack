import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";

import AuthProvider from "./src/context/Auth/AuthProvider";
import ItemProvider from "./src/context/Item/ItemProvider";
import AlertProvider from "./src/context/Alert/AlertProvider";
import RootNavigator from "./src/navigation/RootNavigator";
import { navigationRef, navigate } from "./src/navigation/navigationRef";
import {
  registerBackgroundHandler,
  listenForNotificationTaps,
  checkInitialNotification,
} from "./src/services/pushService";
import { Linking } from 'react-native';
import { alert } from './src/utils/alert';

// Registering the background handler needs to happen once, outside any
// component, as early as possible — this is the pattern Firebase expects.
registerBackgroundHandler();

const handleNotificationTap = (remoteMessage) => {
  // Matches the data payload shape sent by the backend:
  // { data: { item_id, message_id } }
  //
  // "Messages" lives two levels deep: AppNavigator's "Dashboard" screen
  // renders TabNavigator, which has the "Messages" tab. Nested navigation
  // needs the { screen: ... } syntax, not a flat navigate("Messages").
  navigate("Dashboard", { screen: "Messages" });
};

const App = () => {

// Add to App.js — needs: import { Linking } from 'react-native';
// and: import { alert } from './src/utils/alert';

useEffect(() => {
  const handleDeepLink = (url) => {
    if (url && url.includes('reset-success')) {
      alert('Password Updated', 'Please log in with your new password.');
    }
  };

  // App was already running/backgrounded when the link was tapped
  const subscription = Linking.addEventListener('url', ({ url }) => handleDeepLink(url));

  // App was fully closed and opened directly via the link
  Linking.getInitialURL().then((url) => {
    if (url) handleDeepLink(url);
  });

  return () => subscription.remove();
}, []);

  useEffect(() => {
    // App opened by tapping a notification while backgrounded
    const unsubscribe = listenForNotificationTaps(handleNotificationTap);

    // App was fully killed and opened by tapping a notification —
    // checked once on startup
    checkInitialNotification(handleNotificationTap);

    return unsubscribe;
  }, []);

  return (
    <AlertProvider>
      <AuthProvider>
        <ItemProvider>
          <NavigationContainer ref={navigationRef}>
            <RootNavigator />
          </NavigationContainer>
        </ItemProvider>
      </AuthProvider>
    </AlertProvider>
  );
};

export default App;