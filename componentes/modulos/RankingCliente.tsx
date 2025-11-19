import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../constants/theme';

interface RankingData {
  posicion: number;
  totalParticipantes: number;
  total: number;
}

interface RankingClienteProps {
  ranking: RankingData | null;
}

export default function RankingCliente({ ranking }: RankingClienteProps) {
  if (!ranking) {
    return null;
  }

  // Función para obtener el sufijo ordinal (1°, 2°, 3°, etc.)
  const getOrdinalSuffix = (pos: number): string => {
    return `${pos}°`;
  };

  // Determinar color según posición
  const getRankColor = (pos: number): string => {
    if (pos === 1) return Colors.warning; // Oro
    if (pos === 2) return Colors.textSecondary; // Plata
    if (pos === 3) return Colors.accent; // Bronce
    return Colors.primary; // Default
  };

  const rankColor = getRankColor(ranking.posicion);

  return (
    <View style={[styles.card, { borderLeftColor: rankColor }]}>
      <Text style={styles.label}>TU POSICIÓN EN EL RANKING</Text>
      <View style={styles.rankContainer}>
        <Text style={[styles.rankNumber, { color: rankColor }]}>
          {getOrdinalSuffix(ranking.posicion)}
        </Text>
        <Text style={styles.rankTotal}>de {ranking.totalParticipantes}</Text>
      </View>
      <Text style={styles.totalText}>
        Total gastado: <Text style={styles.totalAmount}>${ranking.total.toFixed(2)}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    ...Shadows.md,
    borderLeftWidth: 4,
  },
  label: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    fontWeight: '600',
    letterSpacing: 1,
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.sm,
  },
  rankNumber: {
    ...Typography.h1,
    fontWeight: '700',
    marginRight: Spacing.xs,
  },
  rankTotal: {
    ...Typography.h4,
    color: Colors.textSecondary,
  },
  totalText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  totalAmount: {
    ...Typography.bodyBold,
    color: Colors.success,
  },
});
