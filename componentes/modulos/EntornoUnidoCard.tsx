import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from "../../constants/theme";

interface EntornoUnidoCardProps {
  environmentId: number;
  environmentName: string;
  companyName?: string;
  points?: number;
  onLeave?: (environmentId: number) => void;
}

export default function EntornoUnidoCard({
  environmentId,
  environmentName,
  companyName,
  points,
  onLeave,
}: EntornoUnidoCardProps) {
  const handleLeave = () => {
    Alert.alert(
      "Abandonar entorno",
      `¿Estás seguro de que deseas abandonar "${environmentName}"? Perderás tus ${points || 0} puntos en este entorno.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Abandonar",
          style: "destructive",
          onPress: () => onLeave?.(environmentId),
        },
      ],
    );
  };

  return (
    <View style={styles.joinedEnvCard}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.joinedEnvName}>{environmentName}</Text>
          {companyName && (
            <Text style={styles.companyName}>Empresa: {companyName}</Text>
          )}
        </View>
        <View style={styles.rightSection}>
          {onLeave && (
            <Pressable
              style={({ pressed }) => [
                styles.leaveButton,
                pressed && styles.leaveButtonPressed,
              ]}
              onPress={handleLeave}
            >
              <Text style={styles.leaveButtonText}>Salir</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  joinedEnvCard: {
    width: "100%",
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.success,
    ...Shadows.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  joinedEnvName: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  companyName: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  pointsBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  leaveButton: {
    backgroundColor: "#FF5252",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    marginLeft: Spacing.sm,
  },
  leaveButtonPressed: {
    opacity: 0.7,
  },
  leaveButtonText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: "600",
  },
  pointsText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: "600",
  },
});
