import React from "react";
import {
  Button, FlatList, Image, Modal, Pressable,
  StyleSheet, Text, TextInput, View
} from "react-native";
import { usePerfil } from "../componentes/usePerfil";

type ItemProps = { dato: string };

export default function Perfil() {
  const { perfil, actualizarNombre, actualizarFoto } = usePerfil();

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

  const Item = ({ dato }: ItemProps) => (
    <Pressable style={styles.item} onPress={() => handlePress(dato)}>
      <Text style={styles.dato}>{dato}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.firstContainer}>
        <Image style={styles.profilePicture} source={{ uri: perfil.foto }} />
        <Text style={styles.name}>{perfil.nombre}</Text>
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
              value={perfil.nombre}
              onChangeText={actualizarNombre}
            />

            <TextInput
              style={styles.input}
              placeholder="URL de la foto"
              value={perfil.foto}
              onChangeText={actualizarFoto}
            />

            <Button title="Guardar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
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
  profilePicture: { width: 128, height: 128, borderRadius: 64 },
  name: { fontSize: 24, fontWeight: "bold" },
  item: {
    backgroundColor: "#2196f3",
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
  },
  dato: { fontSize: 18, color: "white", fontWeight: "bold" },
  modalContainer: {
    flex: 1, justifyContent: "center", alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%", backgroundColor: "white",
    borderRadius: 10, padding: 20, alignItems: "center",
  },
  input: {
    width: "100%", borderWidth: 1, borderColor: "#ccc",
    padding: 10, marginVertical: 10, borderRadius: 8,
  },
});
