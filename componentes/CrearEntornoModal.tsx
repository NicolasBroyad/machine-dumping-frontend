import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../config/api';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../constants/theme';

type Env = {
  id: number;
  name: string;
  companyId: number;
};

interface CrearEntornoModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (env: Env) => void;
}

export default function CrearEntornoModal({ visible, onClose, onCreate }: CrearEntornoModalProps) {
  const [nombre, setNombre] = useState('');

  const handleCreate = () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'Por favor ingresa el nombre del entorno');
      return;
    }
    createEnvironment(nombre.trim());
  };

  const createEnvironment = async (nombreEnv: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.ENVIRONMENTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: nombreEnv }),
      });

      const data = await res.json();

      if (res.ok) {
        onCreate(data);
        setNombre('');
      } else {
        Alert.alert('Error', data.message || 'No se pudo crear el entorno');
      }
    } catch (error) {
      console.error('Error creando environment:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Crear entorno</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre del entorno"
            placeholderTextColor="#999"
            value={nombre}
            onChangeText={setNombre}
          />

          <Pressable style={styles.primaryButton} onPress={handleCreate}>
            <Text style={styles.primaryButtonText}>Crear entorno</Text>
          </Pressable>

          <Pressable style={styles.cancelButton} onPress={() => { setNombre(''); onClose(); }}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalContent: {
    width: '85%',
    maxWidth: 420,
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.lg,
  },
  title: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  input: {
    width: '100%',
    borderWidth: 2,
    borderColor: Colors.surfaceLight,
    backgroundColor: Colors.surface,
    color: Colors.textPrimary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    width: '100%',
    alignItems: 'center',
    ...Shadows.md,
  },
  primaryButtonText: {
    ...Typography.bodyBold,
    color: Colors.white,
  },
  cancelButton: {
    marginTop: Spacing.md,
    width: '100%',
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
  },
  cancelButtonText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
