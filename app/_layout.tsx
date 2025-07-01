import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { CartProvider } from '@/context/CartContext';
import { PurchaseHistoryProvider } from '@/context/PurchaseHistoryContext';
import { ThemeProviderCustom, useThemeCustom } from '@/context/ThemeContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    
    if (!isAuthenticated && !inAuthGroup) {
      // Redirigir al login si no está autenticado
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirigir a la app si está autenticado
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
      <Stack.Screen name="screen/AllOffers" options={{ headerShown: false }}/>
      <Stack.Screen name="screen/Categories" options={{ headerShown: false }}/>
      <Stack.Screen name="screen/CategoryProducts" options={{ headerShown: false }}/>
      <Stack.Screen name="screen/CheckoutScreen" options={{ headerShown: false }}/>
    </Stack>
  );
}

function ThemedRoot() {
  const { theme } = useThemeCustom();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  if (!loaded) return null;
  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <PurchaseHistoryProvider>
              <RootLayoutNav />
            </PurchaseHistoryProvider>
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
      <StatusBar style="auto"/>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProviderCustom>
      <ThemedRoot />
    </ThemeProviderCustom>
  );
}
