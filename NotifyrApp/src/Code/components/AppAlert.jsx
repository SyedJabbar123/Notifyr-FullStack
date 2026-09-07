// src/components/AppAlert.jsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';

const AppAlert = ({
  visible,
  title,
  message,
  buttons = [{ text: 'OK' }],
  onDismiss,
}) => {
  const handlePress = (button) => {
    onDismiss?.();

    if (typeof button?.onPress === 'function') {
      button.onPress();
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {!!title && (
            <Text style={styles.title}>{title}</Text>
          )}

          {!!message && (
            <Text style={styles.message}>{message}</Text>
          )}

          <View
            style={[
              styles.buttonRow,
              buttons.length === 1 && styles.singleButton,
            ]}
          >
            {buttons.map((button, index) => {
              const destructive = button.style === 'destructive';
              const cancel = button.style === 'cancel';

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    cancel
                      ? styles.cancelButton
                      : destructive
                      ? styles.destructiveButton
                      : styles.primaryButton,
                  ]}
                  onPress={() => handlePress(button)}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      cancel && styles.cancelText,
                      destructive && styles.destructiveText,
                    ]}
                  >
                    {button.text || 'OK'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10,25,49,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },

  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 22,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0A1931',
    textAlign: 'center',
    marginBottom: 10,
  },

  message: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 22,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },

  singleButton: {
    justifyContent: 'center',
  },

  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },

  primaryButton: {
    backgroundColor: '#0A1931',
  },

  cancelButton: {
    backgroundColor: '#F0F4F8',
  },

  destructiveButton: {
    backgroundColor: '#FDECEA',
  },

  buttonText: {
    fontWeight: '700',
    fontSize: 15,
    color: '#fff',
  },

  cancelText: {
    color: '#555',
  },

  destructiveText: {
    color: '#D32F2F',
  },
});

export default AppAlert;