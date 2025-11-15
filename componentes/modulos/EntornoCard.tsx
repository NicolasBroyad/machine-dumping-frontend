import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

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
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  envName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  envButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  envButton: {
    flex: 1,
    backgroundColor: '#2e6ef7',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  envButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  editButton: {
    flex: 1,
    backgroundColor: '#ff9800',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
