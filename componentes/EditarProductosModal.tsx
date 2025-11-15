import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      const res = await fetch(`http://192.168.0.208:3000/api/products/${environmentId}`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
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
      const res = await fetch(`http://192.168.0.208:3000/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
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

  const handleDelete = async (productId: number, productName: string) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de eliminar "${productName}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              const res = await fetch(`http://192.168.0.208:3000/api/products/${productId}`, {
                method: 'DELETE',
                headers: { Authorization: token ? `Bearer ${token}` : '' },
              });

              if (res.ok) {
                Alert.alert('Éxito', 'Producto eliminado');
                fetchProductos();
              } else {
                const error = await res.json();
                Alert.alert('Error', error.message || 'No se pudo eliminar el producto');
              }
            } catch (e) {
              console.error('Error deleting product', e);
              Alert.alert('Error', 'No se pudo conectar con el servidor');
            }
          },
        },
      ]
    );
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
        <View style={styles.actionButtons}>
          <Pressable style={styles.editButton} onPress={() => handleStartEdit(item)}>
            <Text style={styles.editButtonText}>✏️</Text>
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={() => handleDelete(item.id, item.name)}>
            <Text style={styles.deleteButtonText}>−</Text>
          </Pressable>
        </View>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  loader: {
    marginVertical: 30,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 30,
  },
  list: {
    maxHeight: 400,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productBarcode: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4caf50',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#2e6ef7',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: 20,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 28,
  },
  editingItem: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#2e6ef7',
  },
  editForm: {
    gap: 10,
  },
  editLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  editInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
  },
  editButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  cancelEditButton: {
    flex: 1,
    backgroundColor: '#ccc',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelEditButtonText: {
    color: '#333',
    fontWeight: '700',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#ccc',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
});
