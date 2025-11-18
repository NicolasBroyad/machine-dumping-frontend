import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../config/api';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../constants/theme';

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
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalContent: {
    width: '90%',
    maxWidth: 450,
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
  message: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  listContainer: {
    width: '100%',
    minHeight: 150,
    maxHeight: 300,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.surfaceLight,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.caption,
    color: Colors.textTertiary,
    fontStyle: 'italic',
  },
  scrollView: {
    width: '100%',
  },
  productItem: {
    padding: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceLight,
  },
  productName: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  productPrice: {
    ...Typography.caption,
    color: Colors.accent,
    fontWeight: '500',
  },
  scanButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    width: '100%',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    ...Shadows.md,
  },
  scanButtonText: {
    ...Typography.bodyBold,
    color: Colors.white,
  },
  closeButton: {
    paddingVertical: Spacing.sm,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
  },
  closeButtonText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
