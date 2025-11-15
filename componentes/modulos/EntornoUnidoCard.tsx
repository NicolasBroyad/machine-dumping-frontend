import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface EntornoUnidoCardProps {
  environmentName: string;
}

export default function EntornoUnidoCard({ environmentName }: EntornoUnidoCardProps) {
  return (
    <View style={styles.joinedEnvCard}>
      <Text style={styles.joinedLabel}>Entorno al que estás unido:</Text>
      <Text style={styles.joinedEnvName}>{environmentName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  joinedEnvCard: {
    width: '100%',
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4caf50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  joinedLabel: {
    fontSize: 14,
    color: '#2e7d32',
    marginBottom: 8,
    fontWeight: '500',
  },
  joinedEnvName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1b5e20',
  },
});
