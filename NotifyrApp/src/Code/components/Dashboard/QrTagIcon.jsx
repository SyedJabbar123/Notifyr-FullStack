// src/components/QrTagIcon.jsx
import React from 'react';
import { View, StyleSheet } from 'react-native';

const LINKED_COLOR = '#1E9E5A';
const UNLINKED_COLOR = '#B0BAC9';

/**
 * A small stylized QR-finder-pattern icon (not a real scannable code —
 * just a visual cue). Outline is gray when unlinked, green when linked.
 */
const QrTagIcon = ({ linked, size = 20 }) => {
  const color = linked ? LINKED_COLOR : UNLINKED_COLOR;
  const cornerSize = Math.round(size * 0.26);

  return (
    <View
      style={[
        styles.box,
        { width: size, height: size, borderColor: color, padding: size * 0.1 },
      ]}
    >
      <View style={styles.topRow}>
        <View style={[styles.corner, { width: cornerSize, height: cornerSize, backgroundColor: color }]} />
        <View style={[styles.corner, { width: cornerSize, height: cornerSize, backgroundColor: color }]} />
      </View>
      <View style={styles.spacer} />
      <View style={[styles.corner, { width: cornerSize, height: cornerSize, backgroundColor: color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    borderWidth: 1.5,
    borderRadius: 4,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  corner: {
    borderRadius: 1,
  },
  spacer: {
    flex: 1,
  },
});

export default QrTagIcon;