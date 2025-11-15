import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#2e6ef7',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4caf50',
  },
  statValueCount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2e6ef7',
  },
});
