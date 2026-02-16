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

interface RankingItem {
  clientId: number;
  username: string;
  total: number;
  compras: number;
  posicion: number;
}

interface RankingData {
  environmentId: number;
  environmentName: string;
  companyName: string;
  totalParticipantes: number;
  ranking: RankingItem[];
}

interface RankingDetalleModalProps {
  visible: boolean;
  onClose: () => void;
  environmentId: number | null;
  miPosicion?: number;
}

export default function RankingDetalleModal({
  visible,
  onClose,
  environmentId,
  miPosicion,
}: RankingDetalleModalProps) {
  const [loading, setLoading] = useState(true);
  const [rankingData, setRankingData] = useState<RankingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchRanking = useCallback(async () => {
    if (!environmentId) return;

    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(API_ENDPOINTS.STATISTICS_RANKING(environmentId), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setRankingData(data);
      } else {
        setError("No se pudo cargar el ranking");
      }
    } catch (e) {
      console.error("Error fetching ranking:", e);
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }, [environmentId]);

  useEffect(() => {
    if (visible && environmentId) {
      fetchRanking();
    }
  }, [visible, environmentId, fetchRanking]);

  const getRankColor = (pos: number): string => {
    if (pos === 1) return Colors.warning; // Oro
    if (pos === 2) return "#C0C0C0"; // Plata
    if (pos === 3) return "#CD7F32"; // Bronce
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
            <Text style={styles.title}>Ranking del Entorno</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>

          {rankingData && (
            <View style={styles.envInfo}>
              <Text style={styles.envName}>{rankingData.environmentName}</Text>
              <Text style={styles.envCompany}>
                {rankingData.totalParticipantes} participantes
              </Text>
            </View>
          )}

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Cargando ranking...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable style={styles.retryButton} onPress={fetchRanking}>
                <Text style={styles.retryButtonText}>Reintentar</Text>
              </Pressable>
            </View>
          ) : rankingData && rankingData.ranking.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Aún no hay compras registradas en este entorno
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.rankingList}>
              {/* Header de la tabla */}
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.colPos]}>#</Text>
                <Text style={[styles.tableHeaderText, styles.colUser]}>
                  Usuario
                </Text>
                <Text style={[styles.tableHeaderText, styles.colCompras]}>
                  Compras
                </Text>
                <Text style={[styles.tableHeaderText, styles.colTotal]}>
                  Total
                </Text>
              </View>

              {/* Filas del ranking */}
              {rankingData?.ranking.map((item) => (
                <View
                  key={item.clientId}
                  style={[
                    styles.rankingRow,
                    item.posicion === miPosicion && styles.myRow,
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
                    {item.posicion === miPosicion && " (Tú)"}
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
    backgroundColor: Colors.primary,
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
  envInfo: {
    padding: Spacing.md,
    backgroundColor: Colors.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceLight,
  },
  envName: {
    ...Typography.h4,
    color: Colors.textPrimary,
    fontWeight: "600",
  },
  envCompany: {
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
    backgroundColor: Colors.primary,
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
  myRow: {
    backgroundColor: Colors.primaryLight || "rgba(99, 102, 241, 0.1)",
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
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
    color: Colors.primary,
  },
});
