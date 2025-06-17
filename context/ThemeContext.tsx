import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProviderCustom = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') {
        setThemeState(stored);
      } else {
        const sys = Appearance.getColorScheme();
        setThemeState(sys === 'dark' ? 'dark' : 'light');
      }
    })();
  }, []);

  useEffect(() => {
    if (theme) {
      AsyncStorage.setItem('theme', theme);
    }
  }, [theme]);

  const setTheme = (t: 'light' | 'dark') => setThemeState(t);

  if (!theme) return null;

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeCustom = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useThemeCustom must be used within a ThemeProviderCustom');
  return context;
}; 