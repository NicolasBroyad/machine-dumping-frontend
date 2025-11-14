import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Platform, StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const raw = await AsyncStorage.getItem('usuario');
        if (raw) {
          const usuario = JSON.parse(raw);
          // Esperamos que el objeto tenga la propiedad `role` numérica (1=Cliente, 2=Vendedor/Company)
          setRole(usuario.role ?? null);
        }
      } catch (e) {
        console.error('Error leyendo usuario desde AsyncStorage', e);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleCrear = () => {
    // Ruta placeholder: el proyecto puede no tener estas pantallas todavía
    // Si existen, navegar a la ruta correspondiente. Ajustar si es necesario.
    try {
      // Cast a `any` because las rutas personalizadas pueden no estar tipadas en expo-router
      router.push('/crear-entorno' as any);
    } catch (e) {
      Alert.alert('Crear entorno', 'Aquí se debería abrir la pantalla para crear un entorno.');
    }
  };

  const handleUnirse = () => {
    try {
      router.push('/unirse-entorno' as any);
    } catch (e) {
      Alert.alert('Unirse a un entorno', 'Aquí se debería abrir la pantalla para unirse a un entorno.');
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      {role === 2 ? (
        <Pressable style={styles.button} onPress={handleCrear} accessibilityLabel="Crear entorno">
          <Text style={styles.buttonText}>Crear entorno</Text>
        </Pressable>
      ) : (
        <Pressable style={styles.button} onPress={handleUnirse} accessibilityLabel="Unirse a un entorno">
          <Text style={styles.buttonText}>Unirse a un entorno</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2e6ef7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
