import { Tabs } from "expo-router";
import React from "react";
import { Image, StyleSheet } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="ranking"
        options={{
          title: "Ranking",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../assets/images/ranking.png')}
              style={[styles.icon, { tintColor: color, width: size, height: size }]}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen 
        name="index"
        options={{
          title: "Scan",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../assets/images/barcode-scan.png')}
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
            source={require('../assets/images/account-tie.png')}
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
    // default size, overridden by inline width/height
    width: 24,
    height: 24,
  },
});
