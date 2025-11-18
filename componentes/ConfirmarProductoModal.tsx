import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../constants/theme';

interface ConfirmarProductoModalProps {
  visible: boolean;
  onClose: () => void;
  barcode: string;
  onConfirm: (name: string, price: string) => void;
}

export default function ConfirmarProductoModal({ visible, onClose, barcode, onConfirm }: ConfirmarProductoModalProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleConfirm = () => {
    if (!name.trim() || !price.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Error', 'Ingresa un precio válido');
      return;
    }

    onConfirm(name.trim(), price.trim());
    setName('');
    setPrice('');
  };

  const handleCancel = () => {
    setName('');
    setPrice('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Producto detectado</Text>
          <Text style={styles.barcodeText}>Código de barras: {barcode}</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre del producto"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Precio del producto"
            placeholderTextColor="#999"
            keyboardType="decimal-pad"
            value={price}
            onChangeText={setPrice}
          />

          <Pressable style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>Cargar producto</Text>
          </Pressable>

          <Pressable style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalContent: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.lg,
  },
  title: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  barcodeText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  input: {
    width: '100%',
    borderWidth: 2,
    borderColor: Colors.surfaceLight,
    backgroundColor: Colors.surface,
    color: Colors.textPrimary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    width: '100%',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    ...Shadows.md,
  },
  confirmButtonText: {
    ...Typography.bodyBold,
    color: Colors.white,
  },
  cancelButton: {
    paddingVertical: Spacing.sm,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
  },
  cancelButtonText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
