import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import LoginModal from "../componentes/LoginModal";
import RegisterModal from "../componentes/RegisterModal";
import { BorderRadius, Colors, Shadows, Spacing, Typography } from "../constants/theme";

export default function Index() {
  const router = useRouter();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const usuario = await AsyncStorage.getItem('usuario');
      
      if (token && usuario) {
        // Si hay sesión activa, redirigir al dashboard
        router.replace('/dashboard');
      }
    } catch (error) {
      console.error('Error verificando sesión:', error);
    } finally {
      setIsCheckingSession(false);
    }
  };

  const handleRegisterSuccess = () => {
    setShowLoginModal(true);
  };

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  // Mostrar loading mientras verifica la sesión
  if (isCheckingSession) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Verificando sesión...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoGlow}>
            <Image
              source={require('../assets/images/maquina-de-dulces.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        <Text style={styles.welcomeText}>Machine Dumping</Text>
        <Text style={styles.subtitle}>Tu asistente de compras inteligente</Text>

        <View style={styles.buttonsContainer}>
          <Pressable 
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed
            ]} 
            onPress={() => setShowRegisterModal(true)}
          >
            <Text style={styles.buttonText}>Crear cuenta</Text>
          </Pressable>

          <Pressable 
            style={({ pressed }) => [
              styles.buttonOutline,
              pressed && styles.buttonPressed
            ]} 
            onPress={() => setShowLoginModal(true)}
          >
            <Text style={styles.buttonOutlineText}>Iniciar sesión</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <View style={styles.decorativeLine} />
          <Text style={styles.footerText}>Escanea, Compara, Ahorra</Text>
          <View style={styles.decorativeLine} />
        </View>
      </View>

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
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  logoContainer: {
    marginBottom: Spacing.xl,
  },
  logoGlow: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceLight,
    ...Shadows.glow,
  },
  logo: {
    width: 120,
    height: 120,
  },
  welcomeText: {
    ...Typography.h1,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xxl,
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 320,
    gap: Spacing.md,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    ...Shadows.md,
  },
  buttonText: {
    ...Typography.bodyBold,
    color: Colors.white,
    fontSize: 18,
  },
  buttonOutline: {
    borderRadius: BorderRadius.lg,
    padding: 2,
    backgroundColor: Colors.surfaceLight,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  buttonOutlineText: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    fontSize: 18,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xxl,
    gap: Spacing.md,
  },
  decorativeLine: {
    width: 40,
    height: 2,
    backgroundColor: Colors.primary,
    opacity: 0.5,
  },
  footerText: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
});