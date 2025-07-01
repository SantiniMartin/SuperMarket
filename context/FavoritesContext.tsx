import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Product } from "@/services/productsService";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Product } from "@/services/productsService";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FavoritesContextType {
  favorites: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);

  // Cargar favoritos al iniciar
  useEffect(() => {
    AsyncStorage.getItem("favorites").then((data) => {
      if (data) setFavorites(JSON.parse(data));
    });
  }, []);

  // Guardar favoritos cada vez que cambian
  useEffect(() => {
    AsyncStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (product: Product) => {
    if (!favorites.find((f) => f.id === product.id)) {
      setFavorites([...favorites, product]);
    }
  };

  const removeFavorite = (productId: number) => {
    setFavorites(favorites.filter((f) => f.id !== productId));
  };

  const isFavorite = (productId: number) => {
    return favorites.some((f) => f.id === productId);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context)
    throw new Error("useFavorites must be used within a FavoritesProvider");
  return context;
};
