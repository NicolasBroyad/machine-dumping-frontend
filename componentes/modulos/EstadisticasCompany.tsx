import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
    BorderRadius,
    Colors,
    Shadows,
    Spacing,
    Typography,
} from "../../constants/theme";

interface CompanyStatistics {
  totalRecaudado: number;
  cantidadVendidos: number;
  productoMasComprado: {
    name: string;
    count: number;
    price: number;
  } | null;
  mayorComprador: {
    username: string;
    total: number;
    compras: number;
  } | null;
}

interface EstadisticasCompanyProps {
  statistics: CompanyStatistics | null;
  onTotalRecaudadoPress?: () => void;
  onProductoMasCompradoPress?: () => void;
  onMayorCompradorPress?: () => void;
}

export default function EstadisticasCompany({
  statistics,
  onTotalRecaudadoPress,
  onProductoMasCompradoPress,
  onMayorCompradorPress,
}: EstadisticasCompanyProps) {
  if (!statistics) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Estadísticas del Entorno</Text>

      {/* Fila 1: Total Recaudado y Cantidad Vendidos */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.statCard, styles.cardGreen]}
          onPress={onTotalRecaudadoPress}
          activeOpacity={0.7}
        >
          <Text style={styles.statLabel}>Total Recaudado</Text>
          <Text style={styles.statValueGreen}>
            ${statistics.totalRecaudado.toFixed(2)}
          </Text>
          <Text style={styles.tapHint}>Ver más →</Text>
        </TouchableOpacity>
        <View style={[styles.statCard, styles.cardBlue]}>
          <Text style={styles.statLabel}>Productos Vendidos</Text>
          <Text style={styles.statValueBlue}>
            {statistics.cantidadVendidos}
          </Text>
        </View>
      </View>

      {/* Fila 2: Producto más comprado */}
      {statistics.productoMasComprado && (
        <TouchableOpacity
          style={[styles.fullCard, styles.cardOrange]}
          onPress={onProductoMasCompradoPress}
          activeOpacity={0.7}
        >
          <Text style={styles.fullCardLabel}>PRODUCTO MÁS COMPRADO</Text>
          <Text style={styles.fullCardTitle}>
            {statistics.productoMasComprado.name}
          </Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailText}>
              {statistics.productoMasComprado.count} ventas
            </Text>
            <Text style={styles.detailPrice}>
              ${statistics.productoMasComprado.price.toFixed(2)} c/u
            </Text>
          </View>
          <Text style={styles.tapHint}>Toca para ver ranking →</Text>
        </TouchableOpacity>
      )}

      {/* Fila 3: Mayor comprador */}
      {statistics.mayorComprador && (
        <TouchableOpacity
          style={[styles.fullCard, styles.cardPurple]}
          onPress={onMayorCompradorPress}
          activeOpacity={0.7}
        >
          <Text style={styles.fullCardLabel}>MAYOR COMPRADOR</Text>
          <Text style={styles.fullCardTitle}>
            {statistics.mayorComprador.username}
          </Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailText}>
              {statistics.mayorComprador.compras} compras
            </Text>
            <Text style={styles.detailPrice}>
              Total: ${statistics.mayorComprador.total.toFixed(2)}
            </Text>
          </View>
          <Text style={styles.tapHint}>Toca para ver ranking →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: "center",
    ...Shadows.md,
    borderLeftWidth: 4,
  },
  cardGreen: {
    borderLeftColor: Colors.success,
  },
  cardBlue: {
    borderLeftColor: Colors.primary,
  },
  cardOrange: {
    borderLeftColor: Colors.warning,
  },
  cardPurple: {
    borderLeftColor: Colors.secondary,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    textAlign: "center",
    fontWeight: "500",
  },
  statValueGreen: {
    ...Typography.h2,
    color: Colors.success,
    fontWeight: "700",
  },
  statValueBlue: {
    ...Typography.h2,
    color: Colors.primary,
    fontWeight: "700",
  },
  fullCard: {
    width: "100%",
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    ...Shadows.md,
    borderLeftWidth: 4,
  },
  fullCardLabel: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    fontWeight: "600",
    letterSpacing: 1,
  },
  fullCardTitle: {
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
    color: Colors.success,
  },
  tapHint: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    fontStyle: "italic",
    textAlign: "right",
  },
});
