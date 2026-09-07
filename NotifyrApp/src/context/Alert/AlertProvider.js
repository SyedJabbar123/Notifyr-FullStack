import React, { useState, useCallback, useEffect } from 'react';
import { AlertContext } from './AlertContext';
import AppAlert from '../../components/AppAlert';
import { registerAlertHandler } from  '../../utils/alert';

const AlertProvider = ({ children }) => {
  const [alertState, setAlertState] = useState(null);

  const showAlert = useCallback((title, message, buttons) => {
    setAlertState({
      title,
      message,
      buttons: buttons && buttons.length ? buttons : [{ text: 'OK' }],
    });
  }, []);

  const dismiss = useCallback(() => {
    setAlertState(null);
  }, []);

  // Lets the standalone `alert()` function (usable from anywhere, even
  // outside React components — same idea as navigationRef) reach this
  // provider without needing useContext.
  useEffect(() => {
    registerAlertHandler(showAlert);
  }, [showAlert]);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <AppAlert
        visible={!!alertState}
        title={alertState?.title}
        message={alertState?.message}
        buttons={alertState?.buttons}
        onDismiss={dismiss}
      />
    </AlertContext.Provider>
  );
};

export default AlertProvider;