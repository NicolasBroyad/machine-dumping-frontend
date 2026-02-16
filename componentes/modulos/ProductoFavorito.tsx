import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
    BorderRadius,
    Colors,
    Shadows,
    Spacing,
    Typography,
} from "../../constants/theme";

interface ProductoFavoritoData {
  name: string;
  count: number;
  price: number;
}

interface ProductoFavoritoProps {
  productoFavorito: ProductoFavoritoData | null;
  onPress?: () => void;
}

export default function ProductoFavorito({
  productoFavorito,
  onPress,
}: ProductoFavoritoProps) {
  if (!productoFavorito) {
    return null;
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.label}>TU PRODUCTO FAVORITO</Text>
      <Text style={styles.productName}>{productoFavorito.name}</Text>
      <View style={styles.detailRow}>
        <Text style={styles.detailText}>
          {productoFavorito.count}{" "}
          {productoFavorito.count === 1 ? "compra" : "compras"}
        </Text>
        <Text style={styles.detailPrice}>
          ${productoFavorito.price.toFixed(2)} c/u
        </Text>
      </View>
      <Text style={styles.tapHint}>Toca para ver más →</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    ...Shadows.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
  },
  label: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    fontWeight: "600",
    letterSpacing: 1,
  },
  productName: {
    ...Typography.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    fontWeight: "700",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  detailPrice: {
    ...Typography.bodyBold,
    color: Colors.accent,
  },
  tapHint: {
    ...Typography.small,
    color: Colors.textSecondary,
    textAlign: "right",
    marginTop: Spacing.sm,
    fontStyle: "italic",
  },
});
