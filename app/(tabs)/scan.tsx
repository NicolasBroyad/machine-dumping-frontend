import {
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { Image } from "expo-image";
import React, { useRef, useState, useEffect } from "react";
import { Pressable, StyleSheet, Text, View, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductoInfoModal from '../../componentes/ProductoInfoModal';

// @ts-ignore - vector-icons type issue
import { FontAwesome6 } from '@expo/vector-icons';

interface Product {
  id: number;
  name: string;
  price: number;
  barcode: string;
}

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [facing, setFacing] = useState<CameraType>("back");
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
          const res = await fetch('http://192.168.0.208:3000/api/environments/joined', {
            headers: { Authorization: token ? `Bearer ${token}` : '' },
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
      const res = await fetch(`http://192.168.0.208:3000/api/products/scan/${data}`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
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
      const res = await fetch('http://192.168.0.208:3000/api/registers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
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

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    if (photo?.uri) setUri(photo.uri);
  };


  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const renderPicture = (uri: string) => {
    return (
      <View>
        <Image
          source={{ uri }}
          contentFit="contain"
          style={{ width: 300, aspectRatio: 1 }}
        />
        <Pressable
          style={({ pressed }) => [
            styles.retakeButton,
            { opacity: pressed ? 0.7 : 1 }
          ]}
          onPress={() => setUri(null)}
        >
          <Text style={styles.retakeButtonText}>Tomar otra foto</Text>
        </Pressable>
      </View>
    );
  };

  const renderCamera = () => {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          ref={ref}
          facing={facing}
          mute={false}
          responsiveOrientationWhenOrientationLocked
          barcodeScannerSettings={{
            barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', 'code93', 'codabar', 'itf14'],
          }}
          onBarcodeScanned={({ data }) => {
            if (isClient && hasEnvironment && data) {
              handleBarcodeScanned(data);
            }
          }}
        />
        <View style={styles.shutterContainer}>
          
            
          <Pressable onPress={takePicture}>
            {({ pressed }) => (
              <View
                style={[
                  styles.shutterBtn,
                  {
                    opacity: pressed ? 0.5 : 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.shutterBtnInner,
                    {
                      backgroundColor: "white",
                    },
                  ]}
                />
              </View>
            )}
          </Pressable>
          <Pressable 
            onPress={toggleFacing}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
          >
            <FontAwesome6 name="rotate-left" size={32} color="white" />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {uri ? renderPicture(uri) : renderCamera()}
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
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
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
  retakeButton: {
    backgroundColor: "#2196f3",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: "center",
  },
  retakeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
