import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { fetchWeeklyOffers, fetchDailyOffers, Product } from '@/services/productsService';
import { useRouter } from 'expo-router';

const WeeklyOffers = () => {
  const [offers, setOffers] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter(); // ← CAMBIO

  useEffect(() => {
    const loadOffers = async () => {
      const data = await fetchWeeklyOffers(5, 0); // solo las 5 primeras para esta sección
      setOffers(data);
      setLoading(false);
    };

    loadOffers();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#f57c00" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ofertas Semanales</Text>
        <TouchableOpacity onPress={() => router.push('/screen/AllOffers')}>
          <Text style={styles.seeAll}>Ver todos</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={offers}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.imageBox}>
              <Image source={{ uri: item.thumbnail }} style={styles.image} />
            </View>
            <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              <Text style={styles.discount}> -{item.discountPercentage}%</Text>
            </View>
            <Text style={styles.oldPrice}>Antes: ${(item.price / (1 - (item.discountPercentage || 0) / 100)).toFixed(2)}</Text>
            <Text style={styles.brand}>{item.brand}</Text>
          </View>
        )}
      />
    </View>
  );
};

export const DailyOffers = () => {
  const [offers, setOffers] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const loadOffers = async () => {
      const data = await fetchDailyOffers(5);
      setOffers(data);
      setLoading(false);
    };
    loadOffers();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#f57c00" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mejores ofertas de hoy</Text>
        <TouchableOpacity onPress={() => router.push('/screen/AllOffers')}>
          <Text style={styles.seeAll}>Ver todo</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={offers}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.imageBox}>
              <Image source={{ uri: item.thumbnail }} style={styles.image} />
            </View>
            <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              <Text style={styles.discount}> -{item.discountPercentage}%</Text>
            </View>
            <Text style={styles.oldPrice}>Antes: ${(item.price / (1 - (item.discountPercentage || 0) / 100)).toFixed(2)}</Text>
            <Text style={styles.brand}>{item.brand}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    color: 'blue',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 8,
    marginVertical: 4,
    alignItems: 'center',
    width: 160,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  imageBox: {
    backgroundColor: '#fafafa',
    borderRadius: 14,
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  productTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
    fontSize: 14,
    color: '#111',
    lineHeight: 18,
    maxWidth: 110,
    maxHeight: 38,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  price: {
    color: '#2e7d32',
    fontWeight: 'bold',
    fontSize: 17,
  },
  discount: {
    color: '#e53935',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 4,
  },
  oldPrice: {
    color: '#888',
    textDecorationLine: 'line-through',
    fontSize: 13,
    marginBottom: 2,
  },
  brand: {
    color: '#555',
    fontSize: 13,
    marginTop: 2,
  },
});

export default WeeklyOffers;
