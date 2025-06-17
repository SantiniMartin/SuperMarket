// services/productsService.ts

import { fetchProducts } from './api';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  thumbnail: string;
  images?: string[];
  rating?: number;
  stock?: number;
  brand?: string;
  discountPercentage?: number;
}

export const fetchWeeklyOffers = async (limit = 20, skip = 0): Promise<Product[]> => {
  try {
    const products: Product[] = await fetchProducts();
    // Filtrar productos con descuento
    const offers = products.filter(p => p.discountPercentage && p.discountPercentage > 0);
    return offers.slice(skip, skip + limit);
  } catch (error) {
    console.error('Error fetching weekly offers:', error);
    return [];
  }
};

export const fetchDailyOffers = async (limit = 5): Promise<Product[]> => {
  try {
    const products: Product[] = await fetchProducts();
    // Filtrar productos con descuento y ordenar por mayor descuento
    const offers = products
      .filter(p => p.discountPercentage && p.discountPercentage > 0)
      .sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
    return offers.slice(0, limit);
  } catch (error) {
    console.error('Error fetching daily offers:', error);
    return [];
  }
};
