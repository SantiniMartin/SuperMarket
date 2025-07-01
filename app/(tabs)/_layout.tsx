import { Tabs } from 'expo-router';
import React from 'react';

import Icon from 'react-native-vector-icons/Ionicons';
import { ViewStyle } from 'react-native';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#fdf6ec',
          borderTopWidth: 0,
          borderTopColor: '#ccc',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 10,
          height: 60,
          paddingBottom: 6,
        }as ViewStyle,
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'index':
              return <Icon name="home-outline" size={size} color={color} />;
            case 'stores':
              return <Icon name="storefront-outline" size={size} color={color} />;
            case 'cart':
              return <Icon name="cart-outline" size={size} color={color} />;
            case 'favorites':
              return <Icon name="heart-outline" size={size} color={color} />;
            case 'history':
              return <Icon name="receipt-outline" size={size} color={color} />;
            case 'settings':
              return <Icon name="settings-outline" size={size} color={color} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="stores" options={{ title: 'Tiendas' }} />
      <Tabs.Screen name="cart" options={{ title: 'Carrito' }} />
      <Tabs.Screen name="favorites" options={{ title: 'Favoritos' }} />
      <Tabs.Screen name="history" options={{ title: 'Historial', href: null }} />
      <Tabs.Screen name="notifications" options={{ title: 'Notificaciones', href: null }} />
      <Tabs.Screen name="settings" options={{ title: 'Ajustes' }} />
    </Tabs>
  );
}
