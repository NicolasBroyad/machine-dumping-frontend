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
            <Text style={styles.titulo}>
            Tabla de compras en maquinas expendedoras
            </Text>
            <FlatList
                style={styles.tabla}
                data={personas}
                keyExtractor={(persona) => persona.nombre}
                renderItem={({ item: persona }) => (
                <View>
                    <Text style={styles.textoLista}>
                    {persona.posicion+'°'} {persona.puntuacion+'pts'} {persona.nombre} {'$'+ persona.dineroGastado}
                    </Text>
                </View>
            )}
            />
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
    alignItems: "center",     // alinea el título + lista en el centro horizontal
    gap: 10,
  },
  titulo: {
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },    
  tabla: {
    backgroundColor: "#2196f3",
    padding: 10,
    borderRadius: 10,
  },
  textoLista: {
    color: "white",
    fontWeight: "bold",
  }
});
