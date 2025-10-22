import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function Tabla() {
  const personas = [
    { posicion: 1, puntuacion: 5, nombre: "Matute", dineroGastado: 200 },
    { posicion: 2, puntuacion: 3, nombre: "Nico", dineroGastado: 150 },
    { posicion: 3, puntuacion: 4, nombre: "Santi", dineroGastado: 100 },
  ];

  return (
    <View style={styles.container}>
        <View style={styles.centro}>
          <View style={styles.tablaContainer}>
              <Text style={styles.titulo}>
              Ranking
              </Text>
              <View style={styles.tablaHeaderContainer}>
                <Text style={styles.textoPosicionLista}>Pos</Text>
                <Text style={styles.textoPuntuacionLista}>Pts</Text>
                <Text style={styles.textoNombreLista}>Nombre</Text>
                <Text style={styles.textoDineroGastadoLista}>Gastado</Text>
              </View>
              <FlatList
                style={styles.tabla}
                data={personas}
                keyExtractor={(persona) => persona.nombre}
                renderItem={({ item: persona }) => (
                <View style={styles.listaRowContainer}>
                  <Text style={styles.textoPosicionLista}>
                    {persona.posicion+'°'}
                  </Text>
                  <Text style={styles.textoPuntuacionLista}>
                    {persona.puntuacion+'pts'} 
                  </Text>
                  <Text style={styles.textoNombreLista}>
                    {persona.nombre}
                  </Text>
                  <Text style={styles.textoDineroGastadoLista}>
                    {'$'+ persona.dineroGastado}
                  </Text>
                </View>
            )}
            />
          </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // centra el bloque entero verticalmente
    alignItems: "center",     // centra horizontalmente
    backgroundColor: "#fff",
  },
  centro: {
    // alinea el título + lista en el centro horizontal
    gap: 10,
  },
  titulo: {
    color: "white",
    margin: 20,
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },    
  tablaContainer: {
    backgroundColor: "#2196f3",
    padding: 25,
    borderRadius: 10,
    width: 400,
  },
  tabla: {
    //Flatlist
  }, 
  tablaHeaderContainer: {
    flexDirection: "row",     // fila
    borderColor: "white",
    borderWidth: 1,
    fontWeight: "bold",
    backgroundColor: "#1976d2",
  },
  listaRowContainer: {
    flexDirection: "row",     // fila
    borderColor: "white",
    borderWidth: 1,
  },

  textoPosicionLista: {
    color: "white",
    flex: 1,                  // todas las columnas ocupan el mismo espacio
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "white",
    padding: 10,
  },
  textoPuntuacionLista: {
    color: "white",
    flex: 1,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "white",
    padding: 10,
  },
  textoNombreLista: {
    color: "white",
    flex: 1,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "white",
    padding: 10,
  },
  textoDineroGastadoLista: {
    color: "white",
    flex: 1,
    textAlign: "center",
    padding: 10,
  },
});
