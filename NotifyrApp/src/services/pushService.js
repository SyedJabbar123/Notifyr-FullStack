// src/services/pushService.js
import { PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging'; 
import notifee, { AndroidImportance } from '@notifee/react-native';
import * as authService from './authService';

const CHANNEL_ID = 'notifyr-messages';

async function ensureNotificationChannel() {
  if (Platform.OS !== 'android') return;

  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Item Messages',
    importance: AndroidImportance.HIGH,
    sound: 'default',
  });
}

async function displayLocalNotification(remoteMessage) {
  await ensureNotificationChannel();

  await notifee.displayNotification({
    title: remoteMessage.notification?.title || 'New message',
    body: remoteMessage.notification?.body || '',
    data: remoteMessage.data,
    android: {
      channelId: CHANNEL_ID,
      importance: AndroidImportance.HIGH,
      sound: 'default',
      pressAction: {
        id: 'default',
      },
    },
  });
}

export async function requestNotificationPermission() {
  if (Platform.OS !== 'android') return true;

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

export async function registerForPushNotifications(authToken) {
  try {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      console.log('Notification permission denied by user.');
      return;
    }

    await ensureNotificationChannel();

    // CORRECT USAGE: messaging().getToken()
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      await authService.updateFcmToken(fcmToken, authToken);
    }

    // CORRECT USAGE: messaging().onTokenRefresh
    messaging().onTokenRefresh(async (newToken) => {
      try {
        await authService.updateFcmToken(newToken, authToken);
      } catch (err) {
        console.error('Failed to update refreshed FCM token:', err);
      }
    });
  } catch (err) {
    console.error('Push notification registration failed:', err);
  }
}

export function listenForForegroundMessages(onForegroundMessage) {
  return messaging().onMessage(async (remoteMessage) => {
    await displayLocalNotification(remoteMessage);
    onForegroundMessage(remoteMessage);
  });
}

export function registerBackgroundHandler() {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    // Background logic handled natively
  });
}

export function listenForNotificationTaps(onTap) {
  return messaging().onNotificationOpenedApp((remoteMessage) => {
    if (remoteMessage) onTap(remoteMessage);
  });
}

export async function checkInitialNotification(onTap) {
  const remoteMessage = await messaging().getInitialNotification();
  if (remoteMessage) onTap(remoteMessage);
}

export async function unregisterPushNotifications() {
  try {
    // CORRECT USAGE: messaging().deleteToken()
    await messaging().deleteToken();
    console.log('Successfully deleted FCM token on logout.');
  } catch (err) {
    console.error('Failed to unregister push notifications:', err);
  }
}