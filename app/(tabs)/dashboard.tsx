import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Platform, StyleSheet, Text, View, Pressable, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import CrearEntornoModal from '../../componentes/CrearEntornoModal';
import CargarProductosModal from '../../componentes/CargarProductosModal';
import EditarProductosModal from '../../componentes/EditarProductosModal';
import BarcodeScannerModal from '../../componentes/BarcodeScannerModal';
import ConfirmarProductoModal from '../../componentes/ConfirmarProductoModal';
import UnirseEntornoModal from '../../componentes/UnirseEntornoModal';
import EntornoCard from '../../componentes/modulos/EntornoCard';
import EntornoUnidoCard from '../../componentes/modulos/EntornoUnidoCard';
import EstadisticasCliente from '../../componentes/modulos/EstadisticasCliente';
import ListaComprasCliente from '../../componentes/modulos/ListaComprasCliente';
import ListaComprasCompany from '../../componentes/modulos/ListaComprasCompany';
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
  const [companyRegisters, setCompanyRegisters] = useState<Array<{
    id: number;
    datetime: string;
    product: { name: string; price: number };
    client: { user: { username: string; email: string } };
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

  const fetchCompanyRegisters = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch('http://192.168.0.208:3000/api/registers/company', {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });
      if (res.ok) {
        const data = await res.json();
        setCompanyRegisters(data || []);
      } else {
        console.warn('No se pudieron obtener los registros de la company');
      }
    } catch (e) {
      console.error('Error fetching company registers', e);
    }
  }, []);

  useEffect(() => {
    if (role === 2) {
      fetchMyEnvironments();
      fetchCompanyRegisters();
    } else if (role === 1) {
      fetchJoinedEnvironment();
      fetchMyRegisters();
    }
  }, [role, fetchMyEnvironments, fetchJoinedEnvironment, fetchMyRegisters, fetchCompanyRegisters]);

  // Refrescar registros cuando la pantalla vuelva a estar en foco
  useFocusEffect(
    useCallback(() => {
      if (role === 1) {
        fetchMyRegisters();
      } else if (role === 2) {
        fetchCompanyRegisters();
      }
    }, [role, fetchMyRegisters, fetchCompanyRegisters])
  );

  const handleCrear = () => {
    // Abrir modal para crear entorno en lugar de navegar
    setModalVisible(true);
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [unirseModalVisible, setUnirseModalVisible] = useState(false);
  const [cargarProductosVisible, setCargarProductosVisible] = useState(false);
  const [editarProductosVisible, setEditarProductosVisible] = useState(false);
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
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      {/* Card de entorno para Companies */}
      {role === 2 && myEnvironments.length > 0 && (
        <EntornoCard
          environmentName={myEnvironments[0].name}
          onCargarProductos={() => setCargarProductosVisible(true)}
          onEditarProductos={() => setEditarProductosVisible(true)}
        />
      )}

      {/* Card de entorno para Clientes */}
      {role === 1 && joinedEnvironment && (
        <EntornoUnidoCard environmentName={joinedEnvironment.name} />
      )}

      {/* Estadísticas para Clientes */}
      {role === 1 && myRegisters.length > 0 && (
        <EstadisticasCliente registers={myRegisters} />
      )}

      {/* Registros de compras para Clientes */}
      {role === 1 && (
        <ListaComprasCliente registers={myRegisters} />
      )}

      {/* Registros de compras para Companies */}
      {role === 2 && (
        <ListaComprasCompany registers={companyRegisters} />
      )}

      {role === 2 ? (
        <>
          {/* Solo mostrar el botón si no hay entornos creados */}
          {myEnvironments.length === 0 && (
            <Pressable style={styles.button} onPress={handleCrear} accessibilityLabel="Crear entorno">
              <Text style={styles.buttonText}>Crear entorno</Text>
            </Pressable>
          )}
          <CrearEntornoModal visible={modalVisible} onClose={() => setModalVisible(false)} onCreate={handleCreateEntorno} />
          <CargarProductosModal 
            visible={cargarProductosVisible} 
            onClose={() => setCargarProductosVisible(false)} 
            environmentName={myEnvironments.length > 0 ? myEnvironments[0].name : ''} 
            environmentId={myEnvironments.length > 0 ? myEnvironments[0].id : 0}
            onOpenScanner={handleOpenScanner}
            refreshTrigger={refreshTrigger}
          />
          <EditarProductosModal
            visible={editarProductosVisible}
            onClose={() => setEditarProductosVisible(false)}
            environmentName={myEnvironments.length > 0 ? myEnvironments[0].name : ''}
            environmentId={myEnvironments.length > 0 ? myEnvironments[0].id : 0}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    padding: 20,
    alignItems: 'center',
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
});
