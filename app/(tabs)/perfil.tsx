import React, { useState } from "react";
import {
  StyleSheet, Text, View, Pressable, Alert, ActivityIndicator, ScrollView
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

interface Usuario {
  nombre: string;
  username?: string;
  role: number; // 1 = Cliente, 2 = Company
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
        <ActivityIndicator size="large" color="#2e6ef7" />
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
      <Text style={styles.title}>Perfil</Text>

      {/* Card de información del usuario */}
      <View style={styles.profileCard}>
        <View style={styles.iconContainer}>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Nombre de Usuario</Text>
          <Text style={styles.username}>{usuario.nombre || usuario.username}</Text>
          <View style={[
            styles.badge,
            usuario.role === 1 ? styles.badgeCliente : styles.badgeCompany
          ]}>
            <Text style={styles.badgeText}>{tipoUsuario}</Text>
          </View>
        </View>
      </View>

      {/* Botón de cerrar sesión */}
      <Pressable 
        style={styles.logoutButton} 
        onPress={cerrarSesion}
        accessibilityLabel="Cerrar sesión"
      >
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  profileCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 50,
  },
  infoContainer: {
    alignItems: 'center',
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 8,
  },
  badgeCliente: {
    backgroundColor: '#e3f2fd',
  },
  badgeCompany: {
    backgroundColor: '#fff3e0',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  logoutButton: {
    width: '100%',
    backgroundColor: '#f44336',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
