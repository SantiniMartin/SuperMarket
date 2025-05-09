// services/productsService.ts

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export const fetchWeeklyOffers = async (): Promise<Product[]> => {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const products: Product[] = await response.json();

    // Simular ofertas seleccionando aleatoriamente 5 productos
    const shuffled = products;
    const selected = shuffled;

    return selected;
  } catch (error) {
    console.error('Error fetching weekly offers:', error);
    return [];
  }
};
