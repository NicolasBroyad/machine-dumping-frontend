import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import ProductoInfoModal from "../../componentes/ProductoInfoModal";
import { API_ENDPOINTS } from "../../config/api";
import {
    BorderRadius,
    Colors,
    Shadows,
    Spacing,
    Typography,
} from "../../constants/theme";

interface Product {
  id: number;
  name: string;
  price: number;
  barcode: string;
  environmentId: number;
  environment?: {
    id: number;
    name: string;
  };
  environmentName?: string;
}

interface MultipleProductsResponse {
  multiple: true;
  products: Product[];
}

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [multipleProducts, setMultipleProducts] = useState<Product[]>([]);
  const [selectEnvModalVisible, setSelectEnvModalVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [hasEnvironment, setHasEnvironment] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar estado inicial
  useEffect(() => {
    checkUserStatus();
  }, []);

  // Refrescar cuando la pantalla vuelve a estar en foco
  useFocusEffect(
    useCallback(() => {
      checkUserStatus();
    }, []),
  );

  const checkUserStatus = async () => {
    try {
      const raw = await AsyncStorage.getItem("usuario");
      if (raw) {
        const usuario = JSON.parse(raw);
        const userIsClient = usuario.role === 1;
        setIsClient(userIsClient);

        if (userIsClient) {
          // Verificar si el cliente está unido a algún entorno
          const token = await AsyncStorage.getItem("token");
          const res = await fetch(API_ENDPOINTS.ENVIRONMENTS_JOINED, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            // Ahora verificamos el array de environments
            setHasEnvironment(
              data.environments && data.environments.length > 0,
            );
          }
        }
      }
    } catch (e) {
      console.error("Error checking user status", e);
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeScanned = async (data: string) => {
    if (!isScanning) return;

    setIsScanning(false);

    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(API_ENDPOINTS.PRODUCTS_SCAN(data), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();

        // Verificar si hay múltiples productos (mismo barcode en diferentes entornos)
        if (data.multiple && data.products) {
          setMultipleProducts(data.products);
          setSelectEnvModalVisible(true);
        } else {
          // Producto único
          setScannedProduct(data);
          setModalVisible(true);
        }
      } else {
        const error = await res.json();
        Alert.alert(
          "Producto no encontrado",
          error.message || "No se encontró este producto en tu entorno",
        );
        // Esperar un poco antes de permitir escanear de nuevo
        setTimeout(() => setIsScanning(true), 2000);
      }
    } catch (e) {
      console.error("Error scanning product", e);
      Alert.alert("Error", "No se pudo conectar con el servidor");
      setTimeout(() => setIsScanning(true), 2000);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setScannedProduct(null);
    // Permitir escanear de nuevo después de cerrar el modal
    setTimeout(() => setIsScanning(true), 500);
  };

  const handleSelectEnvironment = (product: Product) => {
    setSelectEnvModalVisible(false);
    setMultipleProducts([]);
    setScannedProduct(product);
    setModalVisible(true);
  };

  const handleCloseSelectEnvModal = () => {
    setSelectEnvModalVisible(false);
    setMultipleProducts([]);
    setTimeout(() => setIsScanning(true), 500);
  };

  const handleRegisterPurchase = async () => {
    if (!scannedProduct) return;

    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(API_ENDPOINTS.REGISTERS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: scannedProduct.id,
          environmentId: scannedProduct.environmentId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("¡Éxito!", "Compra registrada exitosamente");
        handleCloseModal();
      } else {
        Alert.alert("Error", data.message || "No se pudo registrar la compra");
      }
    } catch (e) {
      console.error("Error registering purchase", e);
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  };

  if (!permission) {
    return null;
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isClient || !hasEnvironment) {
    return (
      <View style={styles.container}>
        <Text style={styles.warningText}>
          {!isClient
            ? "Esta función solo está disponible para clientes"
            : "Debes unirte a un entorno para escanear productos"}
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          Necesitamos tu permiso para usar la cámara
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.permissionButton,
            pressed && styles.buttonPressed,
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
            barcodeTypes: [
              "ean13",
              "ean8",
              "upc_a",
              "upc_e",
              "code128",
              "code39",
              "code93",
              "codabar",
              "itf14",
            ],
          }}
          onBarcodeScanned={({ data }) => {
            if (isClient && hasEnvironment && data) {
              handleBarcodeScanned(data);
            }
          }}
        />
        <View style={styles.overlay}>
          <Text style={styles.instructionText}>
            Apunta la cámara al código de barras del producto
          </Text>
          <Text style={styles.subtitleText}>
            Mantén el código dentro del marco y bien iluminado
          </Text>
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

      {/* Modal de selección de entorno cuando el producto existe en múltiples entornos */}
      <Modal visible={selectEnvModalVisible} transparent animationType="fade">
        <View style={styles.selectEnvOverlay}>
          <View style={styles.selectEnvModal}>
            <Text style={styles.selectEnvTitle}>
              Producto en Múltiples Entornos
            </Text>
            <Text style={styles.selectEnvSubtitle}>
              Este producto existe en varios de tus entornos. Selecciona en cuál
              deseas registrar la compra:
            </Text>
            <ScrollView style={styles.envList}>
              {multipleProducts.map((product) => (
                <Pressable
                  key={product.id}
                  style={({ pressed }) => [
                    styles.envOption,
                    pressed && styles.envOptionPressed,
                  ]}
                  onPress={() => handleSelectEnvironment(product)}
                >
                  <Text style={styles.envOptionName}>
                    {product.environment?.name || product.environmentName}
                  </Text>
                  <Text style={styles.envOptionPrice}>
                    ${product.price.toFixed(2)}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable
              style={styles.selectEnvCancelBtn}
              onPress={handleCloseSelectEnvModal}
            >
              <Text style={styles.selectEnvCancelText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  warningText: {
    ...Typography.h4,
    color: Colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: Spacing.xxl,
  },
  permissionText: {
    ...Typography.body,
    color: Colors.textPrimary,
    textAlign: "center",
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  cameraContainer: StyleSheet.absoluteFillObject,
  camera: StyleSheet.absoluteFillObject,
  overlay: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
  instructionText: {
    ...Typography.bodyBold,
    color: Colors.white,
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitleText: {
    ...Typography.caption,
    color: Colors.white,
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  permissionButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.lg,
    ...Shadows.md,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  permissionButtonText: {
    ...Typography.bodyBold,
    color: Colors.white,
  },
  // Estilos para el modal de selección de entorno
  selectEnvOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  selectEnvModal: {
    width: "85%",
    maxHeight: "70%",
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    ...Shadows.lg,
  },
  selectEnvTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  selectEnvSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  envList: {
    maxHeight: 250,
  },
  envOption: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  envOptionPressed: {
    backgroundColor: Colors.primary,
  },
  envOptionName: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  envOptionPrice: {
    ...Typography.bodyBold,
    color: Colors.primary,
  },
  selectEnvCancelBtn: {
    marginTop: Spacing.lg,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: Colors.surfaceLight,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  selectEnvCancelText: {
    ...Typography.bodyBold,
    color: Colors.textSecondary,
  },
});
