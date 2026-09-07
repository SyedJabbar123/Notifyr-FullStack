// src/utils/alert.js
//
// Drop-in replacement for React Native's Alert.alert — same call signature,
// but renders the app's own styled AppAlert instead of the native OS dialog.
//
// Usage (identical to Alert.alert):
//   import { alert } from '../../utils/alert';
//   alert('Title', 'Message', [
//     { text: 'Cancel', style: 'cancel' },
//     { text: 'Delete', style: 'destructive', onPress: handleDelete },
//   ]);

let handler = null;

export function registerAlertHandler(fn) {
  handler = fn;
}

export function alert(title, message, buttons) {
  if (!handler) {
    console.warn('alert() called before AlertProvider mounted.');
    return;
  }
  handler(title, message, buttons);
}