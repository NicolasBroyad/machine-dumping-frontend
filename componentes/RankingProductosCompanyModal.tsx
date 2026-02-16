import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { API_ENDPOINTS } from "../config/api";
import {
    BorderRadius,
    Colors,
    Shadows,
    Spacing,
    Typography,
} from "../constants/theme";

interface ProductoRanking {
  productId: number;
  name: string;
  count: number;
  totalRecaudado: number;
  precioUnitario: number;
  posicion: number;
}

interface RankingProductosData {
  environmentId: number;
  environmentName: string;
  totalProductosVendidos: number;
  totalVentas: number;
  totalRecaudado: number;
  productos: ProductoRanking[];
}

interface RankingProductosCompanyModalProps {
  visible: boolean;
  onClose: () => void;
  environmentId: number | null;
}

export default function RankingProductosCompanyModal({
  visible,
  onClose,
  environmentId,
}: RankingProductosCompanyModalProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RankingProductosData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchRankingProductos = useCallback(async () => {
    if (!environmentId) return;

    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(
        API_ENDPOINTS.STATISTICS_COMPANY_RANKING_PRODUCTOS(environmentId),
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.ok) {
        const responseData = await res.json();
        setData(responseData);
      } else {
        setError("No se pudo cargar el ranking de productos");
      }
    } catch (e) {
      console.error("Error fetching ranking productos:", e);
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }, [environmentId]);

  useEffect(() => {
    if (visible && environmentId) {
      fetchRankingProductos();
    }
  }, [visible, environmentId, fetchRankingProductos]);

  const getRankColor = (pos: number): string => {
    if (pos === 1) return Colors.warning;
    if (pos === 2) return "#C0C0C0";
    if (pos === 3) return "#CD7F32";
    return Colors.textSecondary;
  };

  const getRankEmoji = (pos: number): string => {
    if (pos === 1) return "🥇";
    if (pos === 2) return "🥈";
    if (pos === 3) return "🥉";
    return "";
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Ranking de Productos</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>

          {data && (
            <View style={styles.summaryContainer}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {data.totalProductosVendidos}
                </Text>
                <Text style={styles.summaryLabel}>Productos</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{data.totalVentas}</Text>
                <Text style={styles.summaryLabel}>Ventas</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: Colors.success }]}>
                  ${data.totalRecaudado.toFixed(2)}
                </Text>
                <Text style={styles.summaryLabel}>Recaudado</Text>
              </View>
            </View>
          )}

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.warning} />
              <Text style={styles.loadingText}>Cargando ranking...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable
                style={styles.retryButton}
                onPress={fetchRankingProductos}
              >
                <Text style={styles.retryButtonText}>Reintentar</Text>
              </Pressable>
            </View>
          ) : data && data.productos.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Aún no hay ventas en este entorno
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.productList}>
              {data?.productos.map((item) => (
                <View
                  key={item.productId}
                  style={[
                    styles.productRow,
                    item.posicion <= 3 && styles.topRow,
                  ]}
                >
                  <View style={styles.productHeader}>
                    <View style={styles.positionBadge}>
                      <Text
                        style={[
                          styles.positionText,
                          { color: getRankColor(item.posicion) },
                        ]}
                      >
                        {getRankEmoji(item.posicion)} #{item.posicion}
                      </Text>
                    </View>
                    <Text style={styles.productName} numberOfLines={1}>
                      {item.name}
                    </Text>
                  </View>

                  <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{item.count}</Text>
                      <Text style={styles.statLabel}>
                        {item.count === 1 ? "venta" : "ventas"}
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>
                        ${item.precioUnitario.toFixed(2)}
                      </Text>
                      <Text style={styles.statLabel}>c/u</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text
                        style={[styles.statValue, { color: Colors.success }]}
                      >
                        ${item.totalRecaudado.toFixed(2)}
                      </Text>
                      <Text style={styles.statLabel}>recaudado</Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}

          <Pressable style={styles.footerButton} onPress={onClose}>
            <Text style={styles.footerButtonText}>Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxHeight: "85%",
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    ...Shadows.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
    backgroundColor: Colors.warning,
  },
  title: {
    ...Typography.h3,
    color: Colors.white,
    fontWeight: "700",
  },
  closeButton: {
    padding: Spacing.xs,
  },
  closeButtonText: {
    ...Typography.h4,
    color: Colors.white,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: Spacing.md,
    backgroundColor: Colors.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceLight,
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryValue: {
    ...Typography.h3,
    color: Colors.textPrimary,
    fontWeight: "700",
  },
  summaryLabel: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  loadingContainer: {
    padding: Spacing.xl,
    alignItems: "center",
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  errorContainer: {
    padding: Spacing.xl,
    alignItems: "center",
  },
  errorText: {
    ...Typography.body,
    color: Colors.error,
    marginBottom: Spacing.md,
  },
  retryButton: {
    backgroundColor: Colors.warning,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  retryButtonText: {
    ...Typography.bodyBold,
    color: Colors.white,
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  productList: {
    maxHeight: 400,
  },
  productRow: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceLight,
    backgroundColor: Colors.backgroundCard,
  },
  topRow: {
    backgroundColor: Colors.surface,
  },
  productHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  positionBadge: {
    marginRight: Spacing.sm,
  },
  positionText: {
    ...Typography.bodyBold,
    fontWeight: "700",
  },
  productName: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    flex: 1,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  statLabel: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
  footerButton: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceLight,
    alignItems: "center",
  },
  footerButtonText: {
    ...Typography.bodyBold,
    color: Colors.warning,
  },
});
