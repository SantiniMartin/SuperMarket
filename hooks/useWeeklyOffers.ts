import { useEffect, useState } from 'react';
import { fetchWeeklyOffers, Product } from '@/services/productsService';

export const useWeeklyOffers = () => {
  const [offers, setOffers] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      const data = await fetchWeeklyOffers();
      setOffers(data);
      setLoading(false);
    };
    load();
  }, []);

  return { offers, loading };
};
