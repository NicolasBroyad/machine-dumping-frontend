import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import RegisterModal from "../componentes/RegisterModal";
import LoginModal from "../componentes/LoginModal";

export default function Index() {
  const router = useRouter();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleRegisterSuccess = () => {
    // Después de registrarse exitosamente, abrir el modal de login
    setShowLoginModal(true);
  };

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

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

      <RegisterModal 
        visible={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={handleRegisterSuccess}
      />

      <LoginModal 
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={handleSwitchToRegister}
      />
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
});