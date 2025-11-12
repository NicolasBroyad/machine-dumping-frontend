import React from "react";
import {
  FlatList, Image, Modal, Pressable,
  StyleSheet, Text, TextInput, View
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { usePerfil } from "../../componentes/usePerfil";

type ItemProps = { dato: string };

export default function Perfil() {
  const { profile, updateName, updatePicture } = usePerfil();

  const lista = [
    { id: "1", nombre: "Mis datos" },
    { id: "2", nombre: "Mis torneos" },
    { id: "3", nombre: "Mis logros" },
    { id: "4", nombre: "Plata consumida hasta ahora" },
  ];

  const [modalVisible, setModalVisible] = React.useState<boolean>(false);

  const handlePress = (dato: string) => {
    if (dato === "Mis datos") {
      setModalVisible(true);
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

  return (
    <View style={styles.container}>
      <View style={styles.firstContainer}>
        <Image style={styles.profilePicture} source={{ uri: profile.picture }} />
        <Text style={styles.name}>{profile.name}</Text> 
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
              placeholder="Nombre y apellido"
              value={profile.name}
              onChangeText={updateName}
            />

            <TextInput
              style={styles.input}
              placeholder="URL de la foto"
              value={profile.picture}
              onChangeText={updatePicture}
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
