import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../constants/theme';

interface EntornoCardProps {
  environmentName: string;
  onCargarProductos: () => void;
  onEditarProductos: () => void;
}

export default function EntornoCard({ 
  environmentName, 
  onCargarProductos, 
  onEditarProductos 
}: EntornoCardProps) {
  return (
    <View style={styles.envCard}>
      <Text style={styles.envName}>{environmentName}</Text>
      <View style={styles.envButtonsContainer}>
        <Pressable 
          style={styles.envButton} 
          onPress={onCargarProductos}
          accessibilityLabel="Cargar productos"
        >
          <Text style={styles.envButtonText}>Cargar productos</Text>
        </Pressable>
        <Pressable 
          style={styles.editButton} 
          onPress={onEditarProductos}
          accessibilityLabel="Editar productos"
        >
          <Text style={styles.editButtonText}>Editar productos</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  envCard: {
    width: '100%',
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    alignItems: 'flex-start',
    ...Shadows.md,
  },
  envName: {
    ...Typography.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  envButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  envButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  envButtonText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '600',
  },
  editButton: {
    flex: 1,
    backgroundColor: Colors.warning,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  editButtonText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '600',
  },
});
