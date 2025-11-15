import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Platform, StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import CrearEntornoModal from '../../componentes/CrearEntornoModal';
import CargarProductosModal from '../../componentes/CargarProductosModal';
import BarcodeScannerModal from '../../componentes/BarcodeScannerModal';
import ConfirmarProductoModal from '../../componentes/ConfirmarProductoModal';
import UnirseEntornoModal from '../../componentes/UnirseEntornoModal';
import { useCallback } from 'react';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const raw = await AsyncStorage.getItem('usuario');
        if (raw) {
          const usuario = JSON.parse(raw);
          // Esperamos que el objeto tenga la propiedad `role` numérica (1=Cliente, 2=Vendedor/Company)
          setRole(usuario.role ?? null);
        }
      } catch (e) {
        console.error('Error leyendo usuario desde AsyncStorage', e);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const [myEnvironments, setMyEnvironments] = useState<Array<{ id: number; name: string }>>([]);
  const [joinedEnvironment, setJoinedEnvironment] = useState<{ id: number; name: string } | null>(null);
  const [myRegisters, setMyRegisters] = useState<Array<{
    id: number;
    datetime: string;
    product: { name: string; price: number };
    environment: { name: string };
  }>>([]);

  const fetchMyEnvironments = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch('http://192.168.0.208:3000/api/environments/mine', {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });
      if (res.ok) {
        const data = await res.json();
        setMyEnvironments(data || []);
      } else {
        console.warn('No se pudieron obtener environments');
      }
    } catch (e) {
      console.error('Error fetching environments', e);
    }
  }, []);

  const fetchJoinedEnvironment = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch('http://192.168.0.208:3000/api/environments/joined', {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });
      if (res.ok) {
        const data = await res.json();
        setJoinedEnvironment(data.environment || null);
      } else {
        console.warn('No se pudo obtener el entorno unido');
      }
    } catch (e) {
      console.error('Error fetching joined environment', e);
    }
  }, []);

  const fetchMyRegisters = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch('http://192.168.0.208:3000/api/registers/mine', {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });
      if (res.ok) {
        const data = await res.json();
        setMyRegisters(data || []);
      } else {
        console.warn('No se pudieron obtener los registros');
      }
    } catch (e) {
      console.error('Error fetching registers', e);
    }
  }, []);

  useEffect(() => {
    if (role === 2) {
      fetchMyEnvironments();
    } else if (role === 1) {
      fetchJoinedEnvironment();
      fetchMyRegisters();
    }
  }, [role, fetchMyEnvironments, fetchJoinedEnvironment, fetchMyRegisters]);

  // Refrescar registros cuando la pantalla vuelva a estar en foco
  useFocusEffect(
    useCallback(() => {
      if (role === 1) {
        fetchMyRegisters();
      }
    }, [role, fetchMyRegisters])
  );

  const handleCrear = () => {
    // Abrir modal para crear entorno en lugar de navegar
    setModalVisible(true);
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [unirseModalVisible, setUnirseModalVisible] = useState(false);
  const [cargarProductosVisible, setCargarProductosVisible] = useState(false);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [confirmarVisible, setConfirmarVisible] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleOpenScanner = () => {
    setCargarProductosVisible(false); // Cerrar el modal de productos temporalmente
    setScannerVisible(true);
  };

  const handleBarcodeScanned = (barcode: string) => {
    setScannerVisible(false);
    setScannedBarcode(barcode);
    setConfirmarVisible(true);
  };

  const handleConfirmProduct = async (name: string, price: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const environmentId = myEnvironments.length > 0 ? myEnvironments[0].id : 0;
      
      const res = await fetch('http://192.168.0.208:3000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          name,
          price,
          barcode: scannedBarcode,
          environmentId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Producto creado', `${name} ha sido agregado al entorno`);
        setConfirmarVisible(false);
        setCargarProductosVisible(true); // Volver a abrir el modal de productos
        setRefreshTrigger(prev => prev + 1); // Trigger refresh
      } else {
        Alert.alert('Error', data.message || 'No se pudo crear el producto');
      }
    } catch (e) {
      console.error('Error creando producto', e);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    }
  };

  const handleCreateEntorno = (env: { id: number; name: string }) => {
    // Cuando el modal retorna, refrescar la lista y seleccionar el creado
    setModalVisible(false);
    // Si create retorna un objeto completo, refrescamos
    fetchMyEnvironments();
    Alert.alert('Entorno creado', `Nombre: ${env.name}`);
  };

  const handleUnirse = () => {
    setUnirseModalVisible(true);
  };

  const handleJoinEnvironment = (env: { id: number; name: string }) => {
    setUnirseModalVisible(false);
    setJoinedEnvironment(env);
    Alert.alert('¡Éxito!', `Te has unido al entorno "${env.name}"`);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      {/* Card de entorno para Companies */}
      {role === 2 && myEnvironments.length > 0 && (
        <View style={styles.envCard}>
          <Text style={styles.envName}>{myEnvironments[0].name}</Text>
          <Pressable style={styles.envButton} onPress={() => setCargarProductosVisible(true)}>
            <Text style={styles.envButtonText}>Cargar productos</Text>
          </Pressable>
        </View>
      )}

      {/* Card de entorno para Clientes */}
      {role === 1 && joinedEnvironment && (
        <View style={styles.joinedEnvCard}>
          <Text style={styles.joinedLabel}>Entorno al que estás unido:</Text>
          <Text style={styles.joinedEnvName}>{joinedEnvironment.name}</Text>
        </View>
      )}

      {/* Registros de compras para Clientes */}
      {role === 1 && myRegisters.length > 0 && (
        <View style={styles.registersCard}>
          <Text style={styles.registersTitle}>Mis Compras Registradas</Text>
          <FlatList
            data={myRegisters.slice(0, 5)}
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
          {myRegisters.length > 5 && (
            <Text style={styles.moreRegisters}>
              +{myRegisters.length - 5} compras más
            </Text>
          )}
        </View>
      )}

      {role === 2 ? (
        <>
          <Pressable style={styles.button} onPress={handleCrear} accessibilityLabel="Crear entorno">
            <Text style={styles.buttonText}>Crear entorno</Text>
          </Pressable>
          <CrearEntornoModal visible={modalVisible} onClose={() => setModalVisible(false)} onCreate={handleCreateEntorno} />
          <CargarProductosModal 
            visible={cargarProductosVisible} 
            onClose={() => setCargarProductosVisible(false)} 
            environmentName={myEnvironments.length > 0 ? myEnvironments[0].name : ''} 
            environmentId={myEnvironments.length > 0 ? myEnvironments[0].id : 0}
            onOpenScanner={handleOpenScanner}
            refreshTrigger={refreshTrigger}
          />
          <BarcodeScannerModal
            visible={scannerVisible}
            onClose={() => setScannerVisible(false)}
            onBarcodeScanned={handleBarcodeScanned}
          />
          <ConfirmarProductoModal
            visible={confirmarVisible}
            onClose={() => setConfirmarVisible(false)}
            barcode={scannedBarcode}
            onConfirm={handleConfirmProduct}
          />
        </>
      ) : (
        <>
          {!joinedEnvironment && (
            <Pressable style={styles.button} onPress={handleUnirse} accessibilityLabel="Unirse a un entorno">
              <Text style={styles.buttonText}>Unirse a un entorno</Text>
            </Pressable>
          )}
          <UnirseEntornoModal 
            visible={unirseModalVisible} 
            onClose={() => setUnirseModalVisible(false)}
            onJoin={handleJoinEnvironment}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2e6ef7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
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
  envButton: {
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
});
