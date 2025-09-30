import React from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function Perfil() {


  type ItemProps = {dato: string};

  const lista = [
    { id: '1', nombre: "Mis datos" },
    { id: '2', nombre: "Mis torneos" },
    { id: '3', nombre: "Mis logros" },
    { id: '4', nombre: "Plata consumida hasta ahora" },
  ]


  const Item = ({dato}: ItemProps) => (
    <Pressable style={styles.item}>
      <Text style={styles.dato}>{dato}</Text>
    </Pressable>
  );

  return (
    <View
      style={styles.container}>
        <View style={styles.firstContainer}>
          <Image
            style={styles.profilePicture}
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/en/7/73/Trollface.png' }}
          />
          <Text style={styles.name}>Nombre Y apellido</Text>
        </View>

        <View style={styles.secondContainer}>
          <FlatList 
            data={lista}
            renderItem={({item}) => <Item dato={item.nombre} />}
            keyExtractor={item => item.id}
          />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
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
    borderRadius: 64,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  item: {
    backgroundColor: "#2196f3",
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
  },
  dato: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  }
});

