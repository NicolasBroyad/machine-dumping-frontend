import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.welcomeText}>Welcome to Machine Dumping App!</Text>

      <Pressable style={styles.button} onPress={() => router.replace('/ranking')}>
        <Text style={styles.buttonText}>Entrar a la app</Text>
      </Pressable>

      <Pressable style={[styles.button, styles.outline]} onPress={() => router.replace('/perfil')}>
        <Text style={[styles.buttonText, styles.outlineText]}>Ir a perfil (ej.)</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#2e6ef7',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  outline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2e6ef7',
  },
  outlineText: {
    color: '#2e6ef7',
  },
});