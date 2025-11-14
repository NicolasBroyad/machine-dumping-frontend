import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View, Alert } from "react-native";

interface RegisterModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RegisterModal({ visible, onClose, onSuccess }: RegisterModalProps) {
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
      const response = await fetch('http://192.168.0.208:3000/api/auth/register', {
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
        Alert.alert("Éxito", "Cuenta creada correctamente");
        // Limpiar campos
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setSelectedRole(1);
        onClose();
        onSuccess();
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: '#2e6ef7',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 8,
    marginTop: 12,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  roleContainer: {
    width: '100%',
    marginVertical: 12,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  roleButtonSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2e6ef7',
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  roleButtonTextSelected: {
    color: '#2e6ef7',
  },
});
