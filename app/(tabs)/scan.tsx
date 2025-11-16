import {
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import React, { useRef, useState, useEffect } from "react";
import { Pressable, StyleSheet, Text, View, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductoInfoModal from '../../componentes/ProductoInfoModal';
import { API_ENDPOINTS } from '../../config/api';

interface Product {
  id: number;
  name: string;
  price: number;
  barcode: string;
}

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [hasEnvironment, setHasEnvironment] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const raw = await AsyncStorage.getItem('usuario');
      if (raw) {
        const usuario = JSON.parse(raw);
        const userIsClient = usuario.role === 1;
        setIsClient(userIsClient);

        if (userIsClient) {
          // Verificar si el cliente está unido a un entorno
          const token = await AsyncStorage.getItem('token');
          const res = await fetch(API_ENDPOINTS.ENVIRONMENTS_JOINED, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setHasEnvironment(!!data.environment);
          }
        }
      }
    } catch (e) {
      console.error('Error checking user status', e);
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeScanned = async (data: string) => {
    if (!isScanning) return;

    setIsScanning(false);

    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.PRODUCTS_SCAN(data), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const product = await res.json();
        setScannedProduct(product);
        setModalVisible(true);
      } else {
        const error = await res.json();
        Alert.alert('Producto no encontrado', error.message || 'No se encontró este producto en tu entorno');
        // Esperar un poco antes de permitir escanear de nuevo
        setTimeout(() => setIsScanning(true), 2000);
      }
    } catch (e) {
      console.error('Error scanning product', e);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
      setTimeout(() => setIsScanning(true), 2000);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setScannedProduct(null);
    // Permitir escanear de nuevo después de cerrar el modal
    setTimeout(() => setIsScanning(true), 500);
  };

  const handleRegisterPurchase = async () => {
    if (!scannedProduct) return;

    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.REGISTERS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: scannedProduct.id }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('¡Éxito!', 'Compra registrada exitosamente');
        handleCloseModal();
      } else {
        Alert.alert('Error', data.message || 'No se pudo registrar la compra');
      }
    } catch (e) {
      console.error('Error registering purchase', e);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    }
  };

  if (!permission) {
    return null;
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2196f3" />
      </View>
    );
  }

  if (!isClient || !hasEnvironment) {
    return (
      <View style={styles.container}>
        <Text style={styles.warningText}>
          {!isClient 
            ? 'Esta función solo está disponible para clientes' 
            : 'Debes unirte a un entorno para escanear productos'}
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return ( 
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          Necesitamos tu permiso para usar la camara
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.permissionButton,
            { opacity: pressed ? 0.7 : 1 }
          ]}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Conceder permiso</Text>
        </Pressable>
      </View>
    );
  }

  const renderCamera = () => {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          ref={ref}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', 'code93', 'codabar', 'itf14'],
          }}
          onBarcodeScanned={({ data }) => {
            if (isClient && hasEnvironment && data) {
              handleBarcodeScanned(data);
            }
          }}
        />
        <View style={styles.overlay}>
          <Text style={styles.instructionText}>Apunta la cámara al código de barras del producto</Text>
          <Text style={styles.subtitleText}>Mantén el código dentro del marco y bien iluminado</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderCamera()}
      <ProductoInfoModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onRegisterPurchase={handleRegisterPurchase}
        product={scannedProduct}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  warningText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  cameraContainer: StyleSheet.absoluteFillObject,
  camera: StyleSheet.absoluteFillObject,
  overlay: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  instructionText: {
    fontSize: 18,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 12,
    borderRadius: 8,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitleText: {
    fontSize: 14,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 8,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: "#2196f3",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  permissionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
