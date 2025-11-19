import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View, Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../config/api';

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginModal({ visible, onClose, onSwitchToRegister }: LoginModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('usuario', JSON.stringify(data.usuario));
        
        Alert.alert("Éxito", `Bienvenido ${data.usuario.nombre}!`);
        setEmail("");
        setPassword("");
        onClose();
        router.replace('/dashboard');
      } else {
        Alert.alert("Error", data.message || "Credenciales incorrectas");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor");
      console.error(error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Iniciar sesión</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Email o Usuario"
            placeholderTextColor="#999"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Pressable style={styles.modalButton} onPress={handleLogin}>
            <Text style={styles.modalButtonText}>Iniciar sesión</Text>
          </Pressable>

          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </Pressable>

          <Pressable style={styles.linkButton} onPress={onSwitchToRegister}>
            <Text style={styles.linkButtonText}>¿No tienes cuenta? Regístrate</Text>
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
    maxWidth: 400,
    backgroundColor: '#252541',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#353552',
    backgroundColor: '#2A2A42',
    color: '#FFFFFF',
    padding: 14,
    marginVertical: 8,
    borderRadius: 12,
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginTop: 12,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#353552',
  },
  cancelButtonText: {
    color: '#B8B8D1',
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 20,
    padding: 8,
  },
  linkButtonText: {
    color: '#6C63FF',
    fontSize: 14,
    fontWeight: '600',
  },
});
