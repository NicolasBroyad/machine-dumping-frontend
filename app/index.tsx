import React, { useState } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.welcomeText}>Bienvenido a Machine Dumping App</Text>

      <Pressable style={styles.button} onPress={() => setShowRegisterModal(true)}>
        <Text style={styles.buttonText}>Crear cuenta</Text>
      </Pressable>

      <Pressable style={[styles.button, styles.outline]} onPress={() => setShowLoginModal(true)}>
        <Text style={[styles.buttonText, styles.outlineText]}>Iniciar sesión</Text>
      </Pressable>

      <Pressable style={[styles.button, styles.guestButton]} onPress={() => router.replace('/ranking')}>
        <Text style={[styles.buttonText, styles.guestText]}>Entrar como invitado</Text>
      </Pressable>

      {/* Modal de Registro */}
      <Modal visible={showRegisterModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Crear cuenta</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nombre completo"
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              secureTextEntry
            />

            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña"
              placeholderTextColor="#999"
              secureTextEntry
            />

            <Pressable style={styles.modalButton} onPress={() => {
              // TODO: implementar lógica de registro
              setShowRegisterModal(false);
            }}>
              <Text style={styles.modalButtonText}>Registrarse</Text>
            </Pressable>

            <Pressable style={styles.cancelButton} onPress={() => setShowRegisterModal(false)}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal de Login */}
      <Modal visible={showLoginModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Iniciar sesión</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              secureTextEntry
            />

            <Pressable style={styles.modalButton} onPress={() => {
              // TODO: implementar lógica de login
              setShowLoginModal(false);
            }}>
              <Text style={styles.modalButtonText}>Iniciar sesión</Text>
            </Pressable>

            <Pressable style={styles.cancelButton} onPress={() => setShowLoginModal(false)}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>

            <Pressable style={styles.linkButton} onPress={() => {
              setShowLoginModal(false);
              setShowRegisterModal(true);
            }}>
              <Text style={styles.linkButtonText}>¿No tienes cuenta? Regístrate</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#2e6ef7',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    marginTop: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  outline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2e6ef7',
  },
  outlineText: {
    color: '#2e6ef7',
  },
  guestButton: {
    backgroundColor: '#999',
    borderWidth: 0,
  },
  guestText: {
    color: '#fff',
  },
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
  linkButton: {
    marginTop: 16,
    padding: 8,
  },
  linkButtonText: {
    color: '#2e6ef7',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});