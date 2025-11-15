import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';

interface Product {
  id: number;
  name: string;
  price: number;
  barcode: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onRegisterPurchase: () => void;
  product: Product | null;
}

export default function ProductoInfoModal({ visible, onClose, onRegisterPurchase, product }: Props) {
  if (!product) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Producto Escaneado</Text>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Código de Barras:</Text>
              <Text style={styles.value}>{product.barcode}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Nombre:</Text>
              <Text style={styles.value}>{product.name}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Precio:</Text>
              <Text style={styles.priceValue}>${product.price.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Pressable style={styles.registerButton} onPress={onRegisterPurchase}>
              <Text style={styles.registerButtonText}>Registrar compra</Text>
            </Pressable>
            
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  infoContainer: {
    marginBottom: 24,
  },
  infoRow: {
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  value: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 24,
    color: '#2e6ef7',
    fontWeight: '700',
  },
  buttonContainer: {
    gap: 12,
  },
  registerButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '700',
    fontSize: 18,
  },
});
