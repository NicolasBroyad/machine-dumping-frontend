import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../constants/theme';

interface Register {
  id: number;
  datetime: string;
  product: {
    name: string;
    price: number;
  };
}

interface EstadisticasClienteProps {
  registers: Register[];
}

export default function EstadisticasCliente({ registers }: EstadisticasClienteProps) {
  const totalGastado = registers.reduce((sum, reg) => sum + reg.product.price, 0);
  const cantidadProductos = registers.length;

  return (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Total Gastado</Text>
        <Text style={styles.statValue}>${totalGastado.toFixed(2)}</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Productos Comprados</Text>
        <Text style={styles.statValueCount}>{cantidadProductos}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadows.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
    fontWeight: '500',
  },
  statValue: {
    ...Typography.h2,
    fontWeight: '700',
    color: Colors.success,
  },
  statValueCount: {
    ...Typography.h2,
    fontWeight: '700',
    color: Colors.primary,
  },
});
