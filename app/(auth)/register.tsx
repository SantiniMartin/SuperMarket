// app/(auth)/register.tsx
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Colors } from '@/constants/Colors';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrarse</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
     <Button
                 title="Crear cuenta"
                 color={Colors.buttons.green}
                 onPress={() => console.log('Register')}
                 />
      <Link href="/login" style={styles.link}>
        ¿Ya tenés cuenta? Iniciá sesión
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
   container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: Colors.buttons.gray,
      },
      title: {
        fontSize: 26,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        color: Colors.buttons.text,
      },
      input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
      },
      link: {
        color: Colors.buttons.blue,
        marginTop: 15,
        textAlign: 'center',
        fontWeight: '500',
      },
});
