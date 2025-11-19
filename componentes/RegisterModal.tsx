import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { API_ENDPOINTS } from '../config/api';

interface RegisterModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RegisterModal({ visible, onClose, onSuccess }: RegisterModalProps) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<number>(1); // 1 = Cliente por defecto

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: username, 
          email, 
          password,
          id_role: selectedRole 
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar token y usuario en AsyncStorage
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('usuario', JSON.stringify(data.usuario));
        
        Alert.alert("Éxito", `Cuenta creada correctamente. Bienvenido ${data.usuario.nombre}!`);
        
        // Limpiar campos
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setSelectedRole(1);
        onClose();
        onSuccess();
        
        // Redirigir al dashboard
        router.replace('/dashboard');
      } else {
        Alert.alert("Error", data.message || "No se pudo crear la cuenta");
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
          <Text style={styles.modalTitle}>Crear cuenta</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          {/* Selector de Rol */}
          <View style={styles.roleContainer}>
            <Text style={styles.roleLabel}>Selecciona tu rol:</Text>
            <View style={styles.roleButtons}>
              <Pressable 
                style={[
                  styles.roleButton, 
                  selectedRole === 1 && styles.roleButtonSelected
                ]}
                onPress={() => setSelectedRole(1)}
              >
                <Text style={[
                  styles.roleButtonText,
                  selectedRole === 1 && styles.roleButtonTextSelected
                ]}>
                  👤 Soy Cliente
                </Text>
              </Pressable>

              <Pressable 
                style={[
                  styles.roleButton, 
                  selectedRole === 2 && styles.roleButtonSelected
                ]}
                onPress={() => setSelectedRole(2)}
              >
                <Text style={[
                  styles.roleButtonText,
                  selectedRole === 2 && styles.roleButtonTextSelected
                ]}>
                  🏪 Soy Vendedor
                </Text>
              </Pressable>
            </View>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirmar contraseña"
            placeholderTextColor="#999"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <Pressable style={styles.modalButton} onPress={handleRegister}>
            <Text style={styles.modalButtonText}>Registrarse</Text>
          </Pressable>

          <Pressable style={styles.cancelButton} onPress={onClose}>
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
  roleContainer: {
    width: '100%',
    marginVertical: 12,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B8B8D1',
    marginBottom: 10,
    textAlign: 'center',
  },
  roleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  roleButton: {
    flex: 1,
    backgroundColor: '#2A2A42',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#353552',
    alignItems: 'center',
  },
  roleButtonSelected: {
    backgroundColor: 'rgba(108, 99, 255, 0.15)',
    borderColor: '#6C63FF',
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B8B8D1',
    textAlign: 'center',
  },
  roleButtonTextSelected: {
    color: '#6C63FF',
  },
});
