// src/components/DeleteAccountModal.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';

const CONFIRM_WORD = 'DELETE';

const DeleteAccountModal = ({ visible, onClose, onConfirm, isDeleting }) => {
  const [input, setInput] = useState('');
  const canConfirm = input.trim().toUpperCase() === CONFIRM_WORD;

  const handleClose = () => {
    setInput('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Delete Account</Text>
          <Text style={styles.message}>
            This permanently deletes your account, all registered items, messages, and QR tag
            links. This cannot be undone.
          </Text>

          <Text style={styles.instruction}>
            Type <Text style={styles.confirmWord}>DELETE</Text> to confirm
          </Text>

          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type DELETE"
            placeholderTextColor="#B0B0B0"
            autoCapitalize="characters"
            autoCorrect={false}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={handleClose} disabled={isDeleting}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.button}
              onPress={onConfirm}
              disabled={!canConfirm || isDeleting}
            >
              <Text style={[styles.deleteText, !canConfirm && styles.deleteTextDisabled]}>
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 25, 49, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    paddingTop: 24,
    paddingHorizontal: 22,
    overflow: 'hidden',
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 13.5,
    color: '#555',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
  },
  instruction: {
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  confirmWord: {
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20,
    color: '#1A1A1A',
  },
  buttonRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    marginHorizontal: -22,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: '#F0F0F0',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8A94A6',
  },
  deleteText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#D32F2F',
  },
  deleteTextDisabled: {
    color: '#E0A8A8',
  },
});

export default DeleteAccountModal;