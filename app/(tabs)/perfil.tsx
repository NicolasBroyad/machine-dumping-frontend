import React, { useState } from "react";
import {
  StyleSheet, Text, View, Pressable, Alert, ActivityIndicator, ScrollView, StatusBar
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { Colors, BorderRadius, Spacing, Typography, Shadows } from "../../constants/theme";

interface Usuario {
  nombre: string;
  username?: string;
  role: number;
}

export default function Perfil() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  const cargarPerfil = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem('usuario');
      if (raw) {
        const user = JSON.parse(raw);
        setUsuario(user);
      } else {
        router.replace('/');
      }
    } catch (error) {
      console.error("Error al cargar perfil:", error);
      Alert.alert("Error", "No se pudo cargar el perfil");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      cargarPerfil();
    }, [cargarPerfil])
  );

  const cerrarSesion = async () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('usuario');
            router.replace('/');
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!usuario) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>No se pudo cargar el perfil</Text>
      </View>
    );
  }

  const tipoUsuario = usuario.role === 1 ? 'Cliente' : 'Compañía';

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Mi Perfil</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(usuario.nombre || usuario.username || '?').charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={[
            styles.badge,
            usuario.role === 1 ? styles.badgeCliente : styles.badgeCompany
          ]}>
            <Text style={styles.badgeText}>
              {usuario.role === 1 ? '👤' : '🏪'} {tipoUsuario}
            </Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nombre de Usuario</Text>
            <Text style={styles.infoValue}>{usuario.nombre || usuario.username}</Text>
          </View>
        </View>
      </View>

      <Pressable 
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && styles.buttonPressed
        ]} 
        onPress={cerrarSesion}
        accessibilityLabel="Cerrar sesión"
      >
        <Text style={styles.logoutButtonText}>🚪 Cerrar Sesión</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  errorText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    alignSelf: 'flex-start',
  },
  profileCard: {
    width: '100%',
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.white,
  },
  badge: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  badgeCliente: {
    backgroundColor: Colors.success,
  },
  badgeCompany: {
    backgroundColor: Colors.warning,
  },
  badgeText: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.white,
  },
  infoSection: {
    width: '100%',
    gap: Spacing.md,
  },
  infoRow: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  infoLabel: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginBottom: Spacing.xs,
  },
  infoValue: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  logoutButton: {
    width: '100%',
    backgroundColor: Colors.error,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.md,
  },
  logoutButtonText: {
    ...Typography.bodyBold,
    color: Colors.white,
    fontSize: 16,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
