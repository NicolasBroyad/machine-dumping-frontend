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
import { API_ENDPOINTS } from '../config/api';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../constants/theme';

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
      const res = await fetch(API_ENDPOINTS.ENVIRONMENTS_ALL, {
        headers: { Authorization: `Bearer ${token}` },
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
      const res = await fetch(API_ENDPOINTS.JOIN_ENVIRONMENT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
            <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
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
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxHeight: '70%',
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    ...Shadows.lg,
  },
  title: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  loader: {
    marginVertical: Spacing.xxl,
  },
  emptyText: {
    ...Typography.body,
    textAlign: 'center',
    color: Colors.textTertiary,
    marginVertical: Spacing.xxl,
  },
  list: {
    maxHeight: 300,
  },
  envItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  envName: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  companyName: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  joinButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  joinButtonText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.surfaceLight,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  cancelButtonText: {
    ...Typography.bodyBold,
    color: Colors.textSecondary,
  },
});
