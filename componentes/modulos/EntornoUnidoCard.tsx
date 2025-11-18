import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../constants/theme';

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
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.success,
    ...Shadows.md,
  },
  joinedLabel: {
    ...Typography.caption,
    color: Colors.success,
    marginBottom: Spacing.sm,
    fontWeight: '500',
  },
  joinedEnvName: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
});
