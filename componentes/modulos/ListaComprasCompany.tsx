import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
    BorderRadius,
    Colors,
    Shadows,
    Spacing,
    Typography,
} from "../../constants/theme";

interface CompanyRegister {
  id: number;
  datetime: string;
  price: number; // Precio histórico al momento de la compra
  product: {
    name: string;
    price: number;
  };
  client: {
    user: {
      username: string;
    };
  };
}

interface ListaComprasCompanyProps {
  registers: CompanyRegister[];
}

export default function ListaComprasCompany({
  registers,
}: ListaComprasCompanyProps) {
  if (registers.length === 0) {
    return null;
  }

  // Calcular altura dinámica: cada item mide ~100px, máximo 4 items visibles
  const itemHeight = 100;
  const maxVisibleItems = 4;
  const dynamicHeight = Math.min(
    registers.length * itemHeight,
    maxVisibleItems * itemHeight,
  );

  return (
    <View style={styles.registersCard}>
      <Text style={styles.registersTitle}>
        Compras Registradas en el Entorno
      </Text>
      <ScrollView
        style={[styles.scrollView, { maxHeight: dynamicHeight }]}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={true}
      >
        {registers.map((item) => (
          <View key={item.id} style={styles.companyRegisterItem}>
            <View style={styles.registerInfo}>
              <Text style={styles.registerProductName}>
                {item.product.name}
              </Text>
              <Text style={styles.clientName}>
                Cliente: {item.client.user.username}
              </Text>
              <Text style={styles.registerDate}>
                {new Date(item.datetime).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
            <Text style={styles.registerPrice}>${item.price.toFixed(2)}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  registersCard: {
    width: "100%",
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
  scrollView: {
    // La altura se establece dinámicamente en el componente
  },
  registerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    textAlign: "center",
    marginTop: Spacing.sm,
    fontStyle: "italic",
  },
  companyRegisterItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  clientName: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: "600",
    marginBottom: 2,
  },
});
