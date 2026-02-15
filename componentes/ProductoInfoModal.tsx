import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import {
    BorderRadius,
    Colors,
    Shadows,
    Spacing,
    Typography,
} from "../constants/theme";

interface Product {
  id: number;
  name: string;
  price: number;
  barcode: string;
  environmentId?: number;
  environment?: {
    id: number;
    name: string;
  };
  environmentName?: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onRegisterPurchase: () => void;
  product: Product | null;
}

export default function ProductoInfoModal({
  visible,
  onClose,
  onRegisterPurchase,
  product,
}: Props) {
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

            <View style={styles.infoRow}>
              <Text style={styles.label}>Entorno:</Text>
              <View style={styles.environmentBadge}>
                <Text style={styles.environmentText}>
                  {product.environment?.name ||
                    product.environmentName ||
                    "Desconocido"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.registerButton}
              onPress={onRegisterPurchase}
            >
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
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    ...Shadows.lg,
  },
  title: {
    ...Typography.h3,
    marginBottom: Spacing.xl,
    textAlign: "center",
    color: Colors.textPrimary,
  },
  infoContainer: {
    marginBottom: Spacing.xl,
  },
  infoRow: {
    marginBottom: Spacing.md,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  label: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 4,
    fontWeight: "500",
  },
  value: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  priceValue: {
    ...Typography.h2,
    color: Colors.primary,
    fontWeight: "700",
  },
  buttonContainer: {
    gap: 12,
  },
  registerButton: {
    backgroundColor: Colors.success,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    ...Shadows.md,
  },
  registerButtonText: {
    ...Typography.h4,
    color: Colors.white,
    fontWeight: "700",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: Colors.surfaceLight,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  cancelButtonText: {
    ...Typography.h4,
    color: Colors.textSecondary,
    fontWeight: "700",
  },
  environmentBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  environmentText: {
    ...Typography.bodyBold,
    color: Colors.white,
    fontSize: 14,
  },
});
