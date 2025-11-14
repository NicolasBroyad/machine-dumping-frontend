import { Tabs } from "expo-router";
import React from "react";
import { Image, StyleSheet } from 'react-native';

export default function TabsLayout() {
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
