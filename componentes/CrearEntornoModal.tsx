import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      const res = await fetch('http://192.168.0.208:3000/api/environments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#2e6ef7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 10,
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
});
