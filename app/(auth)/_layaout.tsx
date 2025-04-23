// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // ocultamos la barra superior para diseño personalizado
      }}
    />
  );
}
