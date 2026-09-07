import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { useBarcodeScannerOutput } from 'react-native-vision-camera-barcode-scanner';
import { useAuth } from '../../hooks/useAuth';
import { useItems } from '../../hooks/useItems';
import { alert } from '../../utils/alert';
import { colors, typography, spacing, hexToRgba } from '../../theme/theme';

import * as itemService from '../../services/itemService';

const FRAME_SIZE = 250;
const CORNER_LEN = 28;
const CORNER_THICK = 4;

const QRScannerScreen = ({ route, navigation }) => {
  const { itemId, nickname } = route.params;
  const { token } = useAuth();
  const { updateItem: updateSharedItem } = useItems();

  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const [scanned, setScanned] = useState(false);
  const [isBinding, setIsBinding] = useState(false);

  // Measured from the real rendered container instead of a load-time
  // Dimensions.get() snapshot, which can be stale/wrong on some Android
  // devices (edge-to-edge, gesture nav) and was leaving an unmasked strip
  // to the right of the frame.
  const [layout, setLayout] = useState(null);

  const scanLineY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  useEffect(() => {
    if (scanned) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineY, {
          toValue: FRAME_SIZE - 4,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineY, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [scanned, scanLineY]);

  const bindQRCode = async (qrId) => {
    setIsBinding(true);
    try {
      const data = await itemService.bindQr(itemId, qrId, token);

      updateSharedItem({ id: itemId, qr_id: qrId, status: 'active' });

      alert(
        'QR Tag Linked!',
        `Successfully linked ${nickname} to your Notifyr tag.`,
        [{ text: 'Finish', onPress: () => navigation.navigate('Dashboard') }]
      );
    } catch (error) {
      console.error('Binding failed:', error);
      alert('Binding Failed', error.message || 'Could not link QR tag.');
      setScanned(false);
    } finally {
      setIsBinding(false);
    }
  };

  const barcodeOutput = useBarcodeScannerOutput({
    barcodeFormats: ['qr-code'],
    onBarcodeScanned: async (barcodes) => {
      if (scanned || isBinding) return;

      if (barcodes.length > 0) {
        setScanned(true);
        let qrValue = barcodes[0].displayValue;

        if (qrValue.includes('QR_')) {
          const match = qrValue.match(/(QR_[a-zA-Z0-9]+)/);
          if (match) {
            qrValue = match[1];
          }
        }

        qrValue = qrValue.trim();

        await bindQRCode(qrValue);
      }
    },
    onError: (error) => {
      console.error('Barcode Scanner Error:', error);
    },
  });

  if (device == null || !hasPermission) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.brandNavy} />
        <Text style={styles.message}>Initializing Camera...</Text>
      </View>
    );
  }

  const frameLeft = layout ? (layout.width - FRAME_SIZE) / 2 : null;
  const frameTop = layout ? layout.height * 0.32 : null;

  return (
    <View
      style={styles.container}
      onLayout={(e) => setLayout(e.nativeEvent.layout)}
    >
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={!scanned}
        outputs={[barcodeOutput]}
      />

      {layout && (
        <>
          <View style={[styles.mask, { top: 0, height: frameTop }]} />
          <View style={[styles.mask, { top: frameTop + FRAME_SIZE, bottom: 0 }]} />
          <View
            style={[
              styles.mask,
              { top: frameTop, height: FRAME_SIZE, left: 0, width: frameLeft },
            ]}
          />
          <View
            style={[
              styles.mask,
              // Anchored with left+right instead of a computed width, so it
              // can't drift from where the frame actually sits.
              { top: frameTop, height: FRAME_SIZE, left: frameLeft + FRAME_SIZE, right: 0 },
            ]}
          />

          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.title}>Scan Notifyr Tag</Text>
            <Text style={styles.subtitle}>Linking to {nickname}</Text>
          </View>

          <View style={[styles.frame, { top: frameTop, left: frameLeft }]}>
            <View style={styles.frameBorder} />
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />

            {!scanned && (
              <Animated.View
                style={[
                  styles.scanLine,
                  { transform: [{ translateY: scanLineY }] },
                ]}
              />
            )}
          </View>

          <Text style={[styles.instruction, { top: frameTop + FRAME_SIZE + spacing.xl }]}>
            {scanned ? 'Tag detected' : 'Align the QR code within the frame'}
          </Text>
        </>
      )}

      {isBinding && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.brandGold} />
          <Text style={styles.loadingText}>Securing your tag...</Text>
        </View>
      )}

      {scanned && !isBinding && (
        <TouchableOpacity style={styles.rescanButton} onPress={() => setScanned(false)}>
          <Text style={styles.buttonText}>Scan Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    padding: spacing.lg,
  },
  message: { textAlign: 'center', marginTop: spacing.lg, fontSize: 16, color: colors.textPrimary },

  mask: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: hexToRgba(colors.brandNavy, 0.88),
  },

  header: {
    position: 'absolute',
    top: 56,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 10,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    fontSize: 28,
    letterSpacing: -0.5,
    color: '#fff',
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },

  frame: {
    position: 'absolute',
    width: FRAME_SIZE,
    height: FRAME_SIZE,
  },
  frameBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    borderRadius: 16,
  },
  corner: {
    position: 'absolute',
    width: CORNER_LEN,
    height: CORNER_LEN,
    borderColor: colors.brandGold,
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: CORNER_THICK, borderLeftWidth: CORNER_THICK, borderTopLeftRadius: 12 },
  cornerTR: { top: 0, right: 0, borderTopWidth: CORNER_THICK, borderRightWidth: CORNER_THICK, borderTopRightRadius: 12 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: CORNER_THICK, borderLeftWidth: CORNER_THICK, borderBottomLeftRadius: 12 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: CORNER_THICK, borderRightWidth: CORNER_THICK, borderBottomRightRadius: 12 },

  scanLine: {
    width: '100%',
    height: 2,
    backgroundColor: colors.brandGold,
    shadowColor: colors.brandGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },

  instruction: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  rescanButton: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    backgroundColor: colors.brandGold,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 16,
    elevation: 5,
  },
  buttonText: { color: colors.brandNavy, fontWeight: 'bold', fontSize: 15 },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: hexToRgba(colors.brandNavy, 0.85),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  loadingText: { color: '#fff', marginTop: spacing.sm, fontSize: 16, fontWeight: 'bold' },
});

export default QRScannerScreen;