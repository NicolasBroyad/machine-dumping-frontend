import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';

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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  barcodeText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: '#2e6ef7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
});
