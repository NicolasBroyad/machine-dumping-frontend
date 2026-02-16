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

interface RecaudadoDia {
  fecha: string;
  total: number;
  ventas: number;
}

interface RecaudadoPorDiaData {
  environmentId: number;
  environmentName: string;
  periodo: string;
  totalRecaudado: number;
  totalVentas: number;
  promedioPorVenta: number;
  promedioPorDia: number;
  diasConVentas: number;
  diaMaxRecaudado: RecaudadoDia | null;
  recaudadoPorDia: RecaudadoDia[];
}

interface RecaudadoPorDiaModalProps {
  visible: boolean;
  onClose: () => void;
  environmentId: number | null;
}

export default function RecaudadoPorDiaModal({
  visible,
  onClose,
  environmentId,
}: RecaudadoPorDiaModalProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RecaudadoPorDiaData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchRecaudadoPorDia = useCallback(async () => {
    if (!environmentId) return;

    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(
        API_ENDPOINTS.STATISTICS_COMPANY_RECAUDADO_POR_DIA(environmentId),
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.ok) {
        const responseData = await res.json();
        setData(responseData);
      } else {
        setError("No se pudo cargar la recaudación");
      }
    } catch (e) {
      console.error("Error fetching recaudado por día:", e);
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }, [environmentId]);

  useEffect(() => {
    if (visible && environmentId) {
      fetchRecaudadoPorDia();
    }
  }, [visible, environmentId, fetchRecaudadoPorDia]);

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr + "T00:00:00");
    const day = date.getDate();
    const month = date.toLocaleDateString("es", { month: "short" });
    return `${day} ${month}`;
  };

  const getBarHeight = (value: number, maxValue: number): number => {
    if (maxValue === 0) return 0;
    const percentage = (value / maxValue) * 100;
    return Math.max(percentage, 5);
  };

  const maxRecaudado = data?.recaudadoPorDia.length
    ? Math.max(...data.recaudadoPorDia.map((d) => d.total))
    : 0;

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
            <Text style={styles.title}>Recaudación por Día</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>

          {data && (
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text
                    style={[styles.summaryValue, { color: Colors.success }]}
                  >
                    ${data.totalRecaudado.toFixed(2)}
                  </Text>
                  <Text style={styles.summaryLabel}>Total (30 días)</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{data.totalVentas}</Text>
                  <Text style={styles.summaryLabel}>Ventas</Text>
                </View>
              </View>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValueSmall}>
                    ${data.promedioPorVenta.toFixed(2)}
                  </Text>
                  <Text style={styles.summaryLabel}>Prom/Venta</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValueSmall}>
                    ${data.promedioPorDia.toFixed(2)}
                  </Text>
                  <Text style={styles.summaryLabel}>Prom/Día</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValueSmall}>
                    {data.diasConVentas}
                  </Text>
                  <Text style={styles.summaryLabel}>Días activos</Text>
                </View>
              </View>
            </View>
          )}

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.success} />
              <Text style={styles.loadingText}>Cargando recaudación...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable
                style={styles.retryButton}
                onPress={fetchRecaudadoPorDia}
              >
                <Text style={styles.retryButtonText}>Reintentar</Text>
              </Pressable>
            </View>
          ) : data && data.recaudadoPorDia.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No hay ventas en los últimos 30 días
              </Text>
            </View>
          ) : (
            <View style={styles.chartSection}>
              <Text style={styles.chartTitle}>📊 Últimos 30 días</Text>

              {/* Gráfico de barras */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.chartScrollView}
                contentContainerStyle={styles.chartContainer}
              >
                {data?.recaudadoPorDia.map((dia) => {
                  const isMax = dia.total === maxRecaudado && maxRecaudado > 0;
                  return (
                    <View key={dia.fecha} style={styles.barContainer}>
                      <Text
                        style={[styles.barValue, isMax && styles.barValueMax]}
                      >
                        ${dia.total.toFixed(0)}
                      </Text>
                      <View style={styles.barWrapper}>
                        <View
                          style={[
                            styles.bar,
                            {
                              height: `${getBarHeight(dia.total, maxRecaudado)}%`,
                              backgroundColor: isMax
                                ? Colors.warning
                                : Colors.success,
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.barLabel}>
                        {formatDate(dia.fecha)}
                      </Text>
                      <Text style={styles.barVentas}>
                        {dia.ventas} {dia.ventas === 1 ? "v" : "v"}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>

              {/* Día con más recaudación */}
              {data?.diaMaxRecaudado && (
                <View style={styles.maxDayContainer}>
                  <Text style={styles.maxDayTitle}>
                    🏆 Día con más recaudación
                  </Text>
                  <Text style={styles.maxDayDate}>
                    {formatDate(data.diaMaxRecaudado.fecha)}
                  </Text>
                  <Text style={styles.maxDayValue}>
                    ${data.diaMaxRecaudado.total.toFixed(2)} (
                    {data.diaMaxRecaudado.ventas}{" "}
                    {data.diaMaxRecaudado.ventas === 1 ? "venta" : "ventas"})
                  </Text>
                </View>
              )}
            </View>
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
    width: "95%",
    maxHeight: "90%",
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
    backgroundColor: Colors.success,
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
    padding: Spacing.md,
    backgroundColor: Colors.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceLight,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: Spacing.sm,
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  summaryValue: {
    ...Typography.h3,
    color: Colors.textPrimary,
    fontWeight: "700",
  },
  summaryValueSmall: {
    ...Typography.bodyBold,
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
    backgroundColor: Colors.success,
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
  chartSection: {
    padding: Spacing.md,
  },
  chartTitle: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  chartScrollView: {
    maxHeight: 200,
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: Spacing.sm,
    gap: Spacing.sm,
  },
  barContainer: {
    alignItems: "center",
    width: 50,
  },
  barValue: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginBottom: 4,
    fontSize: 10,
  },
  barValueMax: {
    color: Colors.warning,
    fontWeight: "700",
  },
  barWrapper: {
    height: 120,
    width: 30,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.sm,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  bar: {
    width: "100%",
    borderRadius: BorderRadius.sm,
    minHeight: 4,
  },
  barLabel: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginTop: 4,
    fontSize: 9,
    textAlign: "center",
  },
  barVentas: {
    ...Typography.small,
    color: Colors.textSecondary,
    fontSize: 8,
  },
  maxDayContainer: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  maxDayTitle: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  maxDayDate: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  maxDayValue: {
    ...Typography.h4,
    color: Colors.success,
    fontWeight: "700",
    marginTop: Spacing.xs,
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
    color: Colors.success,
  },
});
