import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Platform, StyleSheet, Text, View } from 'react-native';

type Persona = {
  posicion: number;
  puntuacion: number;
  nombre: string;
  dineroGastado: number;
};

export default function Tabla() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
    const fetchRanking = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/ranking`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        const mapped = (data as any[]).map((u: any, i: number): Persona => ({
          posicion: i + 1,
          puntuacion: 0,
          nombre: u.nombre,
          dineroGastado: u.totalGastado,
        }));
        setPersonas(mapped);
      } catch (err) {
        const e: any = err;
        setError(e?.message || 'Error fetching ranking');
        console.error('Fetch ranking error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  return (
    <View style={styles.container}>
        <View style={styles.centro}>
          <View style={styles.tablaContainer}>
              <Text style={styles.titulo}>
              Ranking
              </Text>
              <Image
                source={require('../../assets/images/winner.png')}
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

                {loading ? (
                  <View style={{ padding: 20, alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={{ color: 'white', marginTop: 10 }}>Cargando ranking...</Text>
                  </View>
                ) : error ? (
                  <View style={{ padding: 20, alignItems: 'center' }}>
                    <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
                    <Text style={{ color: 'white', marginTop: 10, fontSize: 12 }}>
                      Verifica que el backend esté corriendo en el puerto 3000
                    </Text>
                  </View>
                ) : (
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
                )}
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
    gap: 10,
    flex: 1,
  },
  titulo: {
    color: "white",
    fontWeight: "bold",
    fontSize: 32,
    textAlign: "center",
    marginTop: 40,
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
    flexDirection: "row",
    fontWeight: "bold",
    backgroundColor: "rgba(255,255,255,0.75)",
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
  },
  textoHeaderTabla: {
    fontWeight: '700',
    fontSize: 16,
    color: 'black',
  },
  listaRowContainer: {
    flexDirection: "row",
    borderBottomColor: "rgba(255,255,255,0.3)",
    borderBottomWidth: 1,
  },
  lastRow: {
    borderBottomWidth: 0,
    overflow: 'hidden',
  },
  firstRow: {
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
    flex: 1,
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
