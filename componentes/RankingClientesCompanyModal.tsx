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

interface ClienteRanking {
  clientId: number;
  username: string;
  total: number;
  compras: number;
  posicion: number;
}

interface RankingClientesData {
  environmentId: number;
  environmentName: string;
  totalClientes: number;
  totalRecaudado: number;
  ranking: ClienteRanking[];
}

interface RankingClientesCompanyModalProps {
  visible: boolean;
  onClose: () => void;
  environmentId: number | null;
}

export default function RankingClientesCompanyModal({
  visible,
  onClose,
  environmentId,
}: RankingClientesCompanyModalProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RankingClientesData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchRankingClientes = useCallback(async () => {
    if (!environmentId) return;

    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(
        API_ENDPOINTS.STATISTICS_COMPANY_RANKING_CLIENTES(environmentId),
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.ok) {
        const responseData = await res.json();
        setData(responseData);
      } else {
        setError("No se pudo cargar el ranking de clientes");
      }
    } catch (e) {
      console.error("Error fetching ranking clientes:", e);
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }, [environmentId]);

  useEffect(() => {
    if (visible && environmentId) {
      fetchRankingClientes();
    }
  }, [visible, environmentId, fetchRankingClientes]);

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
            <Text style={styles.title}>Ranking de Clientes</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>

          {data && (
            <View style={styles.summaryContainer}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{data.totalClientes}</Text>
                <Text style={styles.summaryLabel}>Clientes</Text>
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
              <ActivityIndicator size="large" color={Colors.secondary} />
              <Text style={styles.loadingText}>Cargando ranking...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable
                style={styles.retryButton}
                onPress={fetchRankingClientes}
              >
                <Text style={styles.retryButtonText}>Reintentar</Text>
              </Pressable>
            </View>
          ) : data && data.ranking.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Aún no hay clientes con compras en este entorno
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.rankingList}>
              {/* Header de la tabla */}
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.colPos]}>#</Text>
                <Text style={[styles.tableHeaderText, styles.colUser]}>
                  Cliente
                </Text>
                <Text style={[styles.tableHeaderText, styles.colCompras]}>
                  Compras
                </Text>
                <Text style={[styles.tableHeaderText, styles.colTotal]}>
                  Total
                </Text>
              </View>

              {/* Filas del ranking */}
              {data?.ranking.map((item) => (
                <View
                  key={item.clientId}
                  style={[
                    styles.rankingRow,
                    item.posicion <= 3 && styles.topRow,
                  ]}
                >
                  <View style={[styles.colPos, styles.posContainer]}>
                    <Text
                      style={[
                        styles.positionText,
                        { color: getRankColor(item.posicion) },
                      ]}
                    >
                      {getRankEmoji(item.posicion)} {item.posicion}°
                    </Text>
                  </View>
                  <Text
                    style={[styles.usernameText, styles.colUser]}
                    numberOfLines={1}
                  >
                    {item.username}
                  </Text>
                  <Text style={[styles.comprasText, styles.colCompras]}>
                    {item.compras}
                  </Text>
                  <Text style={[styles.totalText, styles.colTotal]}>
                    ${item.total.toFixed(2)}
                  </Text>
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
    maxHeight: "80%",
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
    backgroundColor: Colors.secondary,
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
    backgroundColor: Colors.secondary,
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
  rankingList: {
    maxHeight: 400,
  },
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceLight,
  },
  tableHeaderText: {
    ...Typography.small,
    color: Colors.textSecondary,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  colPos: {
    width: 60,
  },
  colUser: {
    flex: 1,
  },
  colCompras: {
    width: 60,
    textAlign: "center",
  },
  colTotal: {
    width: 80,
    textAlign: "right",
  },
  rankingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceLight,
    backgroundColor: Colors.backgroundCard,
  },
  topRow: {
    backgroundColor: Colors.surface,
  },
  posContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  positionText: {
    ...Typography.bodyBold,
    fontWeight: "700",
  },
  usernameText: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  comprasText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  totalText: {
    ...Typography.bodyBold,
    color: Colors.success,
    textAlign: "right",
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
    color: Colors.secondary,
  },
});
