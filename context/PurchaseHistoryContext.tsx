import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '@/services/productsService';

interface CartItem {
  product: Product;
  quantity: number;
}

interface Purchase {
  id: string;
  items: CartItem[];
  total: number;
  date: Date;
}

interface PurchaseHistoryContextType {
  purchaseHistory: Purchase[];
  addPurchase: (items: CartItem[], total: number) => void;
  clearHistory: () => void;
}

const PurchaseHistoryContext = createContext<PurchaseHistoryContextType | undefined>(undefined);

export const PurchaseHistoryProvider = ({ children }: { children: ReactNode }) => {
  const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);

  useEffect(() => {
    const loadPurchaseHistory = async () => {
      try {
        const historyJson = await AsyncStorage.getItem('purchaseHistory');
        if (historyJson) {
          const parsedHistory = JSON.parse(historyJson).map((p: any) => ({...p, date: new Date(p.date)}));
          setPurchaseHistory(parsedHistory);
        }
      } catch (error) {
        console.error('Failed to load purchase history.', error);
      }
    };

    loadPurchaseHistory();
  }, []);

  const addPurchase = async (items: CartItem[], total: number) => {
    const newPurchase: Purchase = {
      id: Date.now().toString(),
      items,
      total,
      date: new Date(),
    };

    try {
      const updatedHistory = [...purchaseHistory, newPurchase];
      setPurchaseHistory(updatedHistory);
      const historyJson = JSON.stringify(updatedHistory);
      await AsyncStorage.setItem('purchaseHistory', historyJson);
    } catch (error) {
      console.error('Failed to save purchase history.', error);
    }
  };

  const clearHistory = async () => {
    try {
      setPurchaseHistory([]);
      await AsyncStorage.removeItem('purchaseHistory');
    } catch (error) {
      console.error('Failed to clear purchase history.', error);
    }
  };

  return (
    <PurchaseHistoryContext.Provider value={{ purchaseHistory, addPurchase, clearHistory }}>
      {children}
    </PurchaseHistoryContext.Provider>
  );
};

export const usePurchaseHistory = () => {
  const context = useContext(PurchaseHistoryContext);
  if (context === undefined) {
    throw new Error('usePurchaseHistory must be used within a PurchaseHistoryProvider');
  }
  return context;
};

// Helper para formatear fecha y hora
export function formatPurchaseDate(date: Date) {
  return date.toLocaleDateString();
}
