import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../constants/theme';

interface Register {
  id: number;
  datetime: string;
  product: {
    name: string;
    price: number;
  };
}

interface ListaComprasClienteProps {
  registers: Register[];
}

export default function ListaComprasCliente({ registers }: ListaComprasClienteProps) {
  if (registers.length === 0) {
    return null;
  }

  return (
    <View style={styles.registersCard}>
      <Text style={styles.registersTitle}>Mis Compras Registradas</Text>
      <FlatList
        data={registers.slice(0, 5)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.registerItem}>
            <View style={styles.registerInfo}>
              <Text style={styles.registerProductName}>{item.product.name}</Text>
              <Text style={styles.registerDate}>
                {new Date(item.datetime).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            <Text style={styles.registerPrice}>${item.product.price.toFixed(2)}</Text>
          </View>
        )}
        scrollEnabled={false}
      />
      {registers.length > 5 && (
        <Text style={styles.moreRegisters}>
          +{registers.length - 5} compras más
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  registersCard: {
    width: '100%',
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  registersTitle: {
    ...Typography.h4,
    marginBottom: Spacing.md,
    color: Colors.textPrimary,
  },
  registerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  registerInfo: {
    flex: 1,
  },
  registerProductName: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  registerDate: {
    ...Typography.small,
    color: Colors.textTertiary,
  },
  registerPrice: {
    ...Typography.bodyBold,
    color: Colors.success,
    marginLeft: Spacing.sm,
  },
  moreRegisters: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },
});
