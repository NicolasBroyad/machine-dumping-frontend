import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Environment {
  id: number;
  name: string;
  companyName: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onJoin: (env: Environment) => void;
}

export default function UnirseEntornoModal({ visible, onClose, onJoin }: Props) {
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchEnvironments();
    }
  }, [visible]);

  const fetchEnvironments = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch('http://192.168.0.208:3000/api/environments/all', {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });
      if (res.ok) {
        const data = await res.json();
        setEnvironments(data || []);
      } else {
        Alert.alert('Error', 'No se pudieron cargar los entornos');
      }
    } catch (e) {
      console.error('Error fetching environments', e);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (env: Environment) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch('http://192.168.0.208:3000/api/environments/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ environmentId: env.id }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('¡Éxito!', `Te has unido al entorno "${env.name}"`);
        onJoin(env);
      } else {
        Alert.alert('Error', data.message || 'No se pudo unir al entorno');
      }
    } catch (e) {
      console.error('Error joining environment', e);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    }
  };

  const renderItem = ({ item }: { item: Environment }) => (
    <Pressable style={styles.envItem} onPress={() => handleJoin(item)}>
      <View>
        <Text style={styles.envName}>{item.name}</Text>
        <Text style={styles.companyName}>Empresa: {item.companyName}</Text>
      </View>
      <View style={styles.joinButton}>
        <Text style={styles.joinButtonText}>Unirse</Text>
      </View>
    </Pressable>
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Selecciona un entorno</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#2e6ef7" style={styles.loader} />
          ) : environments.length === 0 ? (
            <Text style={styles.emptyText}>No hay entornos disponibles</Text>
          ) : (
            <FlatList
              data={environments}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.list}
            />
          )}

          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  loader: {
    marginVertical: 30,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 30,
  },
  list: {
    maxHeight: 300,
  },
  envItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 10,
  },
  envName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  companyName: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  joinButton: {
    backgroundColor: '#2e6ef7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
});
