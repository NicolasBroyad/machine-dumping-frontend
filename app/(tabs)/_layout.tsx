import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TabsLayout() {
  const [userRole, setUserRole] = useState<number | null>(null);

  useEffect(() => {
    const loadUserRole = async () => {
      try {
        const raw = await AsyncStorage.getItem('usuario');
        if (raw) {
          const usuario = JSON.parse(raw);
          setUserRole(usuario.role ?? null);
        }
      } catch (e) {
        console.error('Error leyendo usuario desde AsyncStorage', e);
      }
    };
    loadUserRole();
  }, []);

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../../assets/images/dashboard.png')}
              style={[styles.icon, { tintColor: color, width: size, height: size }]}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen 
        name="scan"
        options={{
          title: "Scan",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../../assets/images/barcode-scan.png')}
              style={[styles.icon, { tintColor: color, width: size, height: size }]}
              resizeMode="contain"
            />
          ),
          // Ocultar tab si es company (role 2)
          href: userRole === 2 ? null : '/scan',
        }}
      />
      <Tabs.Screen name="perfil" 
      options={{
        title: "Perfil",
        tabBarIcon: ({ color, size }) => (
          <Image
            source={require('../../assets/images/account-tie.png')}
            style={[styles.icon, { tintColor: color, width: size, height: size }]}
            resizeMode="contain"
          />
        ),
      }} 
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});
