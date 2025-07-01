import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  name: string;
  lastName: string;
  email: string;
  avatar?: string; // base64 o uri local
  username?: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Verificar si hay un token guardado al iniciar la app
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userProfile');
      setIsAuthenticated(!!token);
      if (userData) setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const usersRaw = await AsyncStorage.getItem('users');
      const usersArr = usersRaw ? JSON.parse(usersRaw) : [];

      const existingUser = usersArr.find((u: any) => u.email === email);
      if (existingUser) {
        throw new Error('El correo electrónico ya está registrado.');
      }

      const nameParts = name.split(' ');
      const newUser = {
        name: nameParts[0],
        lastName: nameParts.slice(1).join(' '),
        email,
        password, // En una app real, esto debería estar hasheado
      };

      usersArr.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(usersArr));
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      // Busca el usuario en el array de usuarios
      const usersRaw = await AsyncStorage.getItem('users');
      if (!usersRaw) throw new Error('Usuario no registrado');
      const usersArr = JSON.parse(usersRaw);
      const profile = usersArr.find((u: any) => u.email === email);
      if (!profile) throw new Error('Usuario no registrado');
      if (profile.password !== password) throw new Error('Contraseña incorrecta');
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      await AsyncStorage.setItem('userToken', 'dummy-token');
      setUser(profile);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userProfile');
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!user) return;
      let updated = { ...user, ...data };
      if (data.name || data.lastName) {
        const first = data.name || user.name.split(' ')[0];
        const last = data.lastName || user.lastName;
        updated.name = `${first} ${last}`;
        updated.lastName = last;
      }
      if (data.username !== undefined) {
        updated.username = data.username;
      }
      setUser(updated);
      await AsyncStorage.setItem('userProfile', JSON.stringify(updated));
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateProfile, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 