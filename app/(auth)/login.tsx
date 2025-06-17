// app/(auth)/login.tsx
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setErrorMsg('');
    try {
      await login(email, password);
    } catch (error: any) {
      setErrorMsg(error.message || 'Error al iniciar sesión');
    }
  };

  return (
    <View style={styles.container}>
      <>
        <Text style={styles.title}>Iniciar Sesión</Text>
        {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
        <View style={{ width: '100%', position: 'relative', marginBottom: 14 }}>
          <TextInput
            style={[styles.input, { marginBottom: 0 }]}
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            placeholderTextColor="#888"
          />
        </View>
        <View style={{ width: '100%', position: 'relative', marginBottom: 14 }}>
          <TextInput
            style={[styles.input, { marginBottom: 0 }]}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.eyeIconAbsolute} onPress={() => setShowPassword(v => !v)}>
            <Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#888" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>INGRESAR</Text>
        </TouchableOpacity>
        <Link href="/register" style={styles.link}>
          ¿No tenés cuenta? Registrate
        </Link>
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    paddingHorizontal: 24,
  },
  formBox: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 28,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#222',
    letterSpacing: 0.5,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 12,
    marginBottom: 14,
    borderRadius: 10,
    backgroundColor: '#fafbfc',
    fontSize: 16,
    color: '#222',
  },
  button: {
    width: '100%',
    backgroundColor: Colors.buttons.green,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: '#2e7d32',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  link: {
    color: Colors.buttons.blue,
    marginTop: 18,
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 15,
  },
  error: {
    color: '#e53935',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  eyeIconAbsolute: {
    position: 'absolute',
    right: 16,
    top: 0,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
});