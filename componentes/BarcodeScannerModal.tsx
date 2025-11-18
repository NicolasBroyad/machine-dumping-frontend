import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../constants/theme';

interface BarcodeScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onBarcodeScanned: (barcode: string) => void;
}

export default function BarcodeScannerModal({ visible, onClose, onBarcodeScanned }: BarcodeScannerModalProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (visible && !permission?.granted) {
      requestPermission();
    }
  }, [visible]);

  const handleBarCodeScanned = ({ data }: { type: string; data: string }) => {
    if (!scanned) {
      setScanned(true);
      onBarcodeScanned(data);
      setTimeout(() => setScanned(false), 2000); // Reset después de 2 segundos
    }
  };

  if (!visible) {
    return null;
  }

  if (!permission) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.container}>
          <Text style={styles.loadingText}>Solicitando permiso de cámara...</Text>
        </View>
      </Modal>
    );
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.container}>
          <Text style={styles.errorText}>📸 Se necesita permiso para usar la cámara</Text>
          <Pressable style={styles.primaryButton} onPress={requestPermission}>
            <Text style={styles.primaryButtonText}>Conceder permiso</Text>
          </Pressable>
          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </Pressable>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: [
              'ean13',      // EAN-13 (más común en productos)
              'ean8',       // EAN-8
              'upc_a',      // UPC-A (común en USA)
              'upc_e',      // UPC-E
              'code128',    // Code 128
              'code39',     // Code 39
              'code93',     // Code 93
              'codabar',    // Codabar
              'itf14',      // ITF-14
            ],
          }}
        />
        <View style={styles.overlay}>
          <Text style={styles.instructionText}>Apunta la cámara al código de barras del producto</Text>
          <Text style={styles.subtitleText}>Mantén el código dentro del marco y bien iluminado</Text>
          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  overlay: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    padding: Spacing.lg,
  },
  instructionText: {
    ...Typography.bodyBold,
    color: Colors.white,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitleText: {
    ...Typography.caption,
    color: Colors.white,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  errorText: {
    ...Typography.h4,
    color: Colors.error,
    marginBottom: Spacing.lg,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    ...Shadows.md,
  },
  primaryButtonText: {
    ...Typography.bodyBold,
    color: Colors.white,
  },
  cancelButton: {
    backgroundColor: Colors.error,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  cancelButtonText: {
    ...Typography.bodyBold,
    color: Colors.white,
  },
});
