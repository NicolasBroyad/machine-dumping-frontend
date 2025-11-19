import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BorderRadius, Colors } from "../../constants/theme";

export default function TabsLayout() {
  const [userRole, setUserRole] = useState<number | null>(null);
  const insets = useSafeAreaInsets();

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
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.backgroundCard,
          borderTopWidth: 0,
          height: (Platform.OS === 'ios' ? 65 : 55) + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 10,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Image
                source={require('../../assets/images/dashboard.png')}
                style={[styles.icon, { tintColor: color }]}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen 
        name="scan"
        options={{
          title: "Escanear",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Image
                source={require('../../assets/images/barcode-scan.png')}
                style={[styles.icon, { tintColor: color }]}
                resizeMode="contain"
              />
            </View>
          ),
          href: userRole === 2 ? null : '/scan',
        }}
      />
      <Tabs.Screen 
        name="perfil" 
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Image
                source={require('../../assets/images/account-tie.png')}
                style={[styles.icon, { tintColor: color }]}
                resizeMode="contain"
              />
            </View>
          ),
        }} 
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  iconContainerActive: {
    backgroundColor: Colors.surface,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
