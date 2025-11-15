import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

interface CompanyRegister {
  id: number;
  datetime: string;
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

export default function ListaComprasCompany({ registers }: ListaComprasCompanyProps) {
  if (registers.length === 0) {
    return null;
  }

  return (
    <View style={styles.registersCard}>
      <Text style={styles.registersTitle}>Compras Registradas en el Entorno</Text>
      <FlatList
        data={registers.slice(0, 10)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.companyRegisterItem}>
            <View style={styles.registerInfo}>
              <Text style={styles.registerProductName}>{item.product.name}</Text>
              <Text style={styles.clientName}>Cliente: {item.client.user.username}</Text>
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
      {registers.length > 10 && (
        <Text style={styles.moreRegisters}>
          +{registers.length - 10} compras más
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  registersCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  registersTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333',
  },
  registerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 6,
    marginBottom: 8,
  },
  registerInfo: {
    flex: 1,
  },
  registerProductName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  registerDate: {
    fontSize: 12,
    color: '#888',
  },
  registerPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4caf50',
    marginLeft: 10,
  },
  moreRegisters: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  companyRegisterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 6,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#2e6ef7',
  },
  clientName: {
    fontSize: 13,
    color: '#2e6ef7',
    fontWeight: '600',
    marginBottom: 2,
  },
});
