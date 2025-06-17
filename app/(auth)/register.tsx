// app/(auth)/register.tsx
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

export default function RegisterScreen() {
  const { login, updateProfile } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const validate = () => {
    const newErrors: any = {};
    if (!firstName) newErrors.firstName = 'El nombre es obligatorio';
    if (!lastName) newErrors.lastName = 'El apellido es obligatorio';
    if (!email) newErrors.email = 'El correo es obligatorio';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) newErrors.email = 'Correo inválido';
    if (!password) newErrors.password = 'La contraseña es obligatoria';
    else if (password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    if (!repeatPassword) newErrors.repeatPassword = 'Repite la contraseña';
    else if (password !== repeatPassword) newErrors.repeatPassword = 'Las contraseñas no coinciden';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    // Soporte multiusuario: guarda en array
    const newUser = {
      name: `${firstName} ${lastName}`,
      lastName,
      email,
      avatar: '',
      username: '',
      password,
    };
    let usersArr = [];
    const usersRaw = await AsyncStorage.getItem('users');
    if (usersRaw) usersArr = JSON.parse(usersRaw);
    if (usersArr.find((u: any) => u.email === email)) {
      setErrors({ email: 'Ya existe un usuario con ese correo' });
      return;
    }
    usersArr.push(newUser);
    await AsyncStorage.setItem('users', JSON.stringify(usersArr));
    // Guarda el usuario logueado actual
    await AsyncStorage.setItem('userProfile', JSON.stringify(newUser));
    await AsyncStorage.setItem('userToken', 'dummy-token');
    await login(email, password, firstName, lastName);
    await updateProfile({ name: firstName, lastName, email });
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.2)' }}>
          <View style={{ backgroundColor:'#fff', borderRadius:16, padding:32, alignItems:'center' }}>
            <Text style={{ fontWeight:'bold', fontSize:18, marginBottom:10 }}>¡Usuario creado!</Text>
            <Text style={{ color:'#555', fontSize:15 }}>Tu cuenta fue registrada correctamente.</Text>
          </View>
        </View>
      </Modal>
      <>
        <Text style={styles.title}>Registrarse</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={firstName}
          onChangeText={setFirstName}
          placeholderTextColor="#888"
        />
        {errors.firstName && <Text style={styles.error}>{errors.firstName}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Apellido"
          value={lastName}
          onChangeText={setLastName}
          placeholderTextColor="#888"
        />
        {errors.lastName && <Text style={styles.error}>{errors.lastName}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          placeholderTextColor="#888"
        />
        {errors.email && <Text style={styles.error}>{errors.email}</Text>}
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
        {errors.password && <Text style={styles.error}>{errors.password}</Text>}
        <View style={{ width: '100%', position: 'relative', marginBottom: 14 }}>
          <TextInput
            style={[styles.input, { marginBottom: 0 }]}
            placeholder="Repetir contraseña"
            value={repeatPassword}
            onChangeText={setRepeatPassword}
            secureTextEntry={!showRepeatPassword}
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.eyeIconAbsolute} onPress={() => setShowRepeatPassword(v => !v)}>
            <Icon name={showRepeatPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#888" />
          </TouchableOpacity>
        </View>
        {errors.repeatPassword && <Text style={styles.error}>{errors.repeatPassword}</Text>}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>CREAR CUENTA</Text>
        </TouchableOpacity>
        <Link href="/login" style={styles.link}>
          ¿Ya tenés cuenta? Iniciá sesión
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
    fontSize: 13,
    marginBottom: 6,
    marginLeft: 2,
    alignSelf: 'flex-start',
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
