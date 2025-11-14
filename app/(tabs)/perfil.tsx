import React, { useEffect, useState } from "react";
import {
  FlatList, Image, Modal, Pressable,
  StyleSheet, Text, TextInput, View, Alert, ActivityIndicator
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";

type ItemProps = { dato: string };

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  tipo: 'cliente' | 'compania';
}

export default function Perfil() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [nuevoNombre, setNuevoNombre] = useState("");

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        // Si no hay token, mostrar datos de ejemplo para desarrollo
        const usuarioEjemplo: Usuario = {
          id: 0,
          nombre: "Usuario Invitado",
          email: "invitado@example.com",
          tipo: "cliente"
        };
        setUsuario(usuarioEjemplo);
        setNuevoNombre(usuarioEjemplo.nombre);
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:3000/api/auth/perfil', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setUsuario(data);
        setNuevoNombre(data.nombre);
      } else {
        Alert.alert("Error", "No se pudo cargar el perfil");
        if (response.status === 401) {
          // Token expirado o inválido
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('usuario');
          router.replace('/');
        }
      }
    } catch (error) {
      console.error("Error al cargar perfil:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const cerrarSesion = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('usuario');
    Alert.alert("Sesión cerrada", "Has cerrado sesión exitosamente");
    router.replace('/');
  };

  // Opciones según tipo de usuario
  const getListaOpciones = () => {
    if (usuario?.tipo === 'compania') {
      return [
        { id: "1", nombre: "Mis datos" },
        { id: "2", nombre: "Productos registrados" },
        { id: "3", nombre: "Estadísticas de ventas" },
        { id: "4", nombre: "Campañas activas" },
        { id: "5", nombre: "Gestión de promociones" },
        { id: "6", nombre: "Cerrar sesión" },
      ];
    } else {
      return [
        { id: "1", nombre: "Mis datos" },
        { id: "2", nombre: "Mis torneos" },
        { id: "3", nombre: "Mis logros" },
        { id: "4", nombre: "Plata consumida hasta ahora" },
        { id: "5", nombre: "Historial de compras" },
        { id: "6", nombre: "Cerrar sesión" },
      ];
    }
  };

  const lista = getListaOpciones();

  const handlePress = (dato: string) => {
    if (dato === "Mis datos") {
      setModalVisible(true);
    } else if (dato === "Cerrar sesión") {
      cerrarSesion();
    }
  };

  const Item = ({ dato }: ItemProps) => {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
        opacity: scale.value
      }
    });

    return (
      <Pressable 
        onPressIn={() => {
          scale.value = withSpring(0.9);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        onPress={() => handlePress(dato)}
      >
        <Animated.View style={[styles.item, animatedStyle]}>
          <Text style={styles.dato}>{dato}</Text>
        </Animated.View>
      </Pressable>
    );
  };

  const SaveButton = ({ onPress }: { onPress: () => void }) => {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
        opacity: scale.value
      }
    });

    return (
      <Pressable 
        onPressIn={() => {
          scale.value = withSpring(0.9);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        onPress={onPress}
      >
        <Animated.View style={[styles.saveButton, animatedStyle]}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </Animated.View>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <Text style={{ color: '#fff', fontSize: 18 }}>Cargando perfil...</Text>
      </View>
    );
  }

  if (!usuario) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <Text style={{ color: '#fff', fontSize: 18 }}>No se pudo cargar el perfil</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.firstContainer}>
        <Image 
          style={styles.profilePicture} 
          source={{ uri: 'https://via.placeholder.com/150' }} 
        />
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{usuario.nombre}</Text>
          <View style={[
            styles.badge, 
            usuario.tipo === 'compania' ? styles.badgeCompania : styles.badgeCliente
          ]}>
            <Text style={styles.badgeText}>
              {usuario.tipo === 'compania' ? '🏢 Compañía' : '👤 Cliente'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.secondContainer}>
        <FlatList
          data={lista}
          renderItem={({ item }) => <Item dato={item.nombre} />}
          keyExtractor={(item) => item.id}
        />
      </View>
      

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
              Editar perfil
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre de usuario"
              value={nuevoNombre}
              onChangeText={setNuevoNombre}
            />

            <SaveButton onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({

  container: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center",
    backgroundColor: "#03213aff"
  },
  firstContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  nameContainer: {
    alignItems: 'flex-start',
    gap: 8,
  },
  secondContainer: {
    flex: 3,
    flexDirection: "column",
    justifyContent: "space-evenly",
    paddingLeft: 20,
  },
  profilePicture: { 
    width: 128, 
    height: 128, 
    borderRadius: 64 
  },
  name: { 
    fontSize: 24, 
    fontWeight: "bold", 
    color: "#fff"
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  badgeCliente: {
    backgroundColor: '#4CAF50',
  },
  badgeCompania: {
    backgroundColor: '#FF9800',
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  item: {
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: "#2196f3",
  },
  dato: { 
    fontSize: 18, 
    color: "white", 
    fontWeight: "bold" 
  },
  modalContainer: {
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%", 
    backgroundColor: "white",
    borderRadius: 10, 
    padding: 20, 
    alignItems: "center",
  },
  input: {
    width: "100%", 
    borderWidth: 1, 
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10, 
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: "#2196f3",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
