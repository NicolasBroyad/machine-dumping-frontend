import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { API_ENDPOINTS } from '../config/api';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../constants/theme';

interface Product {
  id: number;
  name: string;
  price: number;
  barcode: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  environmentId: number;
  environmentName: string;
}

export default function EditarProductosModal({ visible, onClose, environmentId, environmentName }: Props) {
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');

  useEffect(() => {
    if (visible && environmentId > 0) {
      fetchProductos();
    }
  }, [visible, environmentId]);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.PRODUCTS_BY_ENVIRONMENT(environmentId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProductos(data || []);
      } else {
        Alert.alert('Error', 'No se pudieron cargar los productos');
      }
    } catch (e) {
      console.error('Error fetching productos', e);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (product: Product) => {
    setEditingId(product.id);
    setEditName(product.name);
    setEditPrice(product.price.toString());
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditPrice('');
  };

  const handleSaveEdit = async (productId: number) => {
    if (!editName.trim() || !editPrice.trim()) {
      Alert.alert('Error', 'El nombre y precio son requeridos');
      return;
    }

    const priceNum = parseFloat(editPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Error', 'El precio debe ser un número mayor a 0');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.PRODUCT_BY_ID(productId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editName, price: editPrice }),
      });

      if (res.ok) {
        Alert.alert('Éxito', 'Producto actualizado');
        handleCancelEdit();
        fetchProductos();
      } else {
        const error = await res.json();
        Alert.alert('Error', error.message || 'No se pudo actualizar el producto');
      }
    } catch (e) {
      console.error('Error updating product', e);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    }
  };



  const renderItem = ({ item }: { item: Product }) => {
    const isEditing = editingId === item.id;

    if (isEditing) {
      return (
        <View style={styles.editingItem}>
          <View style={styles.editForm}>
            <Text style={styles.editLabel}>Nombre:</Text>
            <TextInput
              style={styles.editInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Nombre del producto"
            />
            <Text style={styles.editLabel}>Precio:</Text>
            <TextInput
              style={styles.editInput}
              value={editPrice}
              onChangeText={setEditPrice}
              placeholder="Precio"
              keyboardType="numeric"
            />
            <View style={styles.editButtons}>
              <Pressable style={styles.saveButton} onPress={() => handleSaveEdit(item.id)}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </Pressable>
              <Pressable style={styles.cancelEditButton} onPress={handleCancelEdit}>
                <Text style={styles.cancelEditButtonText}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.productItem}>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productBarcode}>Código: {item.barcode}</Text>
          <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        </View>
        <Pressable style={styles.editButton} onPress={() => handleStartEdit(item)}>
          <Image source={require('../assets/images/editar-texto.png')} style={styles.editIcon} />
        </Pressable>
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Editar Productos</Text>
          <Text style={styles.subtitle}>{environmentName}</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#2e6ef7" style={styles.loader} />
          ) : productos.length === 0 ? (
            <Text style={styles.emptyText}>No hay productos en este entorno</Text>
          ) : (
            <FlatList
              data={productos}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.list}
            />
          )}

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    ...Shadows.lg,
  },
  title: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  loader: {
    marginVertical: Spacing.xxl,
  },
  emptyText: {
    ...Typography.body,
    textAlign: 'center',
    color: Colors.textTertiary,
    marginVertical: Spacing.xxl,
  },
  list: {
    maxHeight: 400,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  productBarcode: {
    ...Typography.small,
    color: Colors.textTertiary,
    marginBottom: 4,
  },
  productPrice: {
    ...Typography.bodyBold,
    color: Colors.success,
  },
  editButton: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    width: 20,
    height: 20,
    tintColor: Colors.white,
  },
  editingItem: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  editForm: {
    gap: 10,
  },
  editLabel: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  editInput: {
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  editButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.success,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  saveButtonText: {
    ...Typography.bodyBold,
    color: Colors.white,
  },
  cancelEditButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.surfaceLight,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  cancelEditButtonText: {
    ...Typography.bodyBold,
    color: Colors.textSecondary,
  },
  closeButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.surfaceLight,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  closeButtonText: {
    ...Typography.bodyBold,
    color: Colors.textSecondary,
  },
});
