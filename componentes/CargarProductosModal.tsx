import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../config/api';

interface CargarProductosModalProps {
  visible: boolean;
  onClose: () => void;
  environmentName: string;
  environmentId: number;
  onOpenScanner: () => void;
  refreshTrigger?: number; // Prop para forzar refresh desde afuera
}

type Product = {
  id: number;
  name: string;
  price: number;
  barcode: string;
};

export default function CargarProductosModal({ visible, onClose, environmentName, environmentId, onOpenScanner, refreshTrigger }: CargarProductosModalProps) {
  const [productos, setProductos] = useState<Product[]>([]);

  // Fetch productos cuando el modal se abre o refreshTrigger cambia
  useEffect(() => {
    if (visible && environmentId) {
      fetchProductos();
    }
  }, [visible, environmentId, refreshTrigger]);

  const fetchProductos = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.PRODUCTS_BY_ENVIRONMENT(environmentId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProductos(data || []);
      }
    } catch (e) {
      console.error('Error fetching productos', e);
    }
  };

  const handleEscanear = () => {
    onOpenScanner();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Cargar productos</Text>
          <Text style={styles.message}>
            Escanea el código de barra del producto que deseas cargar al entorno
          </Text>

          {/* Área rectangular para lista de productos */}
          <View style={styles.listContainer}>
            {productos.length === 0 ? (
              <Text style={styles.emptyText}>Aún no hay productos cargados</Text>
            ) : (
              <ScrollView style={styles.scrollView}>
                {productos.map((prod) => (
                  <View key={prod.id} style={styles.productItem}>
                    <Text style={styles.productName}>{prod.name}</Text>
                    <Text style={styles.productPrice}>${prod.price.toFixed(2)}</Text>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Botón Escanear */}
          <Pressable style={styles.scanButton} onPress={handleEscanear}>
            <Text style={styles.scanButtonText}>Escanear</Text>
          </Pressable>

          {/* Botón Cerrar */}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
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
    width: '90%',
    maxWidth: 450,
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
  message: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
  },
  listContainer: {
    width: '100%',
    minHeight: 150,
    maxHeight: 300,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  scrollView: {
    width: '100%',
  },
  productItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#2e6ef7',
    fontWeight: '500',
  },
  scanButton: {
    backgroundColor: '#2e6ef7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  scanButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  closeButton: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#666',
    fontWeight: '600',
  },
});
