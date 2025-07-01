import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type CardType = 'Visa' | 'Mastercard';

export interface PaymentCard {
  id: string;
  type: CardType;
  number: string; // solo los últimos 4 dígitos visibles
  holder: string;
}

interface PaymentContextType {
  cards: PaymentCard[];
  addCard: (card: Omit<PaymentCard, 'id'>) => void;
  removeCard: (id: string) => void;
  selectedCardId: string | null;
  selectCard: (id: string) => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const [cards, setCards] = useState<PaymentCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Cargar tarjetas desde AsyncStorage al iniciar
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('payment_cards');
        if (stored) setCards(JSON.parse(stored));
        const selected = await AsyncStorage.getItem('selected_card');
        if (selected) setSelectedCardId(selected);
      } catch (e) {
        console.error('Error loading payment cards', e);
      }
    })();
  }, []);

  // Guardar tarjetas en AsyncStorage cada vez que cambien
  useEffect(() => {
    AsyncStorage.setItem('payment_cards', JSON.stringify(cards)).catch(e => {
      console.error('Error saving payment cards', e);
    });
  }, [cards]);

  // Guardar tarjeta seleccionada
  useEffect(() => {
    if (selectedCardId)
      AsyncStorage.setItem('selected_card', selectedCardId).catch(e => {
        console.error('Error saving selected card', e);
      });
  }, [selectedCardId]);

  const addCard = (card: Omit<PaymentCard, 'id'>) => {
    const id = Math.random().toString(36).slice(2, 10);
    setCards(prev => [...prev, { ...card, id }]);
    setSelectedCardId(id);
  };

  const removeCard = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
    if (selectedCardId === id) setSelectedCardId(null);
  };

  const selectCard = (id: string) => setSelectedCardId(id);

  return (
    <PaymentContext.Provider value={{ cards, addCard, removeCard, selectedCardId, selectCard }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error('usePayment must be used within a PaymentProvider');
  return ctx;
}; 