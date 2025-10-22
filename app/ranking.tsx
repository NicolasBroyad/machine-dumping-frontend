import React from 'react';
import { FlatList, StyleSheet, Text, View, Image } from 'react-native';

export default function Tabla() {
  const personas = [
    { posicion: 1, puntuacion: 5, nombre: "Matute", dineroGastado: 200 },
    { posicion: 2, puntuacion: 3, nombre: "Nico", dineroGastado: 150 },
    { posicion: 3, puntuacion: 4, nombre: "Santi", dineroGastado: 100 },
    { posicion: 4, puntuacion: 2, nombre: "Juani", dineroGastado: 80 },
    { posicion: 5, puntuacion: 1, nombre: "Lucho", dineroGastado: 50 },
    { posicion: 6, puntuacion: 0, nombre: "Ana", dineroGastado: 30 },
    { posicion: 7, puntuacion: 0, nombre: "Carlos", dineroGastado: 20 },
    { posicion: 8, puntuacion: 0, nombre: "Laura", dineroGastado: 10 },
    { posicion: 9, puntuacion: 0, nombre: "Diego", dineroGastado: 5 },
    { posicion: 10, puntuacion: 0, nombre: "Marta", dineroGastado: 2 },
  ];

  return (
    <View style={styles.container}>
        <View style={styles.centro}>
          <View style={styles.tablaContainer}>
              <Text style={styles.titulo}>
              Ranking
              </Text>
              <Image
                source={require('../assets/images/winner.png')}
                style={styles.rankingImage}
                resizeMode="contain"
              />
              <View style={styles.tabla}>
                <View style={styles.tablaHeaderContainer}>
                  <Text style={[styles.textoPosicionLista, styles.textoHeaderTabla]}>Pos</Text>
                  <Text style={[styles.textoPuntuacionLista, styles.textoHeaderTabla]}>Pts</Text>
                  <Text style={[styles.textoNombreLista, styles.textoHeaderTabla]}>Nombre</Text>
                  <Text style={[styles.textoDineroGastadoLista, styles.textoHeaderTabla]}>Gastado</Text>
                </View>
                <FlatList
                  style={styles.flatList}
                  contentContainerStyle={{ flexGrow: 1 }}
                  data={personas}
                  keyExtractor={(persona) => persona.nombre}
                  renderItem={({ item: persona, index }) => {
                    const isLast = index === personas.length - 1;
                    const isFirst = index === 0;
                    const isSecond = index === 1;
                    const isThird = index === 2;
                    return (
                      <View style={[styles.listaRowContainer, isLast && styles.lastRow, isFirst && styles.firstRow]}>
                        <Text style={[styles.textoPosicionLista, isFirst && styles.firstText, isSecond && styles.secondText, isThird && styles.thirdText]}>
                          {persona.posicion + '°'}
                        </Text>
                        <Text style={[styles.textoPuntuacionLista, isFirst && styles.firstText, isSecond && styles.secondText, isThird && styles.thirdText]}>
                          {persona.puntuacion + 'pts'} 
                        </Text>
                        <Text style={[styles.textoNombreLista, isFirst && styles.firstText, isSecond && styles.secondText, isThird && styles.thirdText]}>
                          {persona.nombre}
                        </Text>
                        <Text style={[styles.textoDineroGastadoLista, isFirst && styles.firstText, isSecond && styles.secondText, isThird && styles.thirdText]}>
                          {'$' + persona.dineroGastado}
                        </Text>
                      </View>
                    );
                  }}
                />
              </View>

          </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centro: {
    // alinea el título + lista en el centro horizontal
    gap: 10,
    flex: 1,
  },
  titulo: {
    color: "white",
    fontWeight: "bold",
    fontSize: 32,
    textAlign: "center",
  },    
  tablaContainer: {
    backgroundColor: "#03213aff",
    padding: 25,
    width: '100%',
    flex: 1,
    gap: 30,
  },
    rankingImage: {
      width: 100,
      height: 100,
      alignSelf: 'center',
      marginBottom: 10,
    },
  tabla: {
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 10,
  },
  flatList: {
  }, 
  tablaHeaderContainer: {
    flexDirection: "row",     // fila
    fontWeight: "bold",
    backgroundColor: "rgba(255,255,255,0.75)", //rgba(18, 94, 235, 0.5)
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
  },
  textoHeaderTabla: {
    fontWeight: '700',
    fontSize: 16,
    color: 'black',
  },
  listaRowContainer: {
    flexDirection: "row",     // fila
    borderBottomColor: "rgba(255,255,255,0.3)",
    borderBottomWidth: 1,
  },
  lastRow: {
    borderBottomWidth: 0,
    overflow: 'hidden',
  },
  firstRow: {
     // slight gold background255,215,0,1)'
  },
  firstText: {
    fontWeight: '700',
    fontSize: 16,
    color: 'rgb(255,215,0)',
  },
  secondText: {
    fontWeight: '700',
    fontSize: 16,
    color: 'rgb(192,192,192)',
  },
  thirdText: {
    fontWeight: '700',
    fontSize: 16,
    color: 'rgb(205,127,50)',
  },

  textoPosicionLista: {
    color: "white",
    flex: 1,                  // todas las columnas ocupan el mismo espacio
    textAlign: "center",
    padding: 10,
  },
  textoPuntuacionLista: {
    color: "white",
    flex: 1,
    textAlign: "center",
    padding: 10,
  },
  textoNombreLista: {
    color: "white",
    flex: 1,
    textAlign: "center",
    padding: 10,
  },
  textoDineroGastadoLista: {
    color: "white",
    flex: 1,
    textAlign: "center",
    padding: 10,
  },
});
