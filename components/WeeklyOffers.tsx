// components/WeeklyOffers.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchWeeklyOffers, Product } from '../services/productsService';

const WeeklyOffers = () => {
  const [offers, setOffers] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadOffers = async () => {
      const data = await fetchWeeklyOffers();
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
      <Text style={styles.title}>Ofertas Semanales</Text>
      <FlatList
        data={offers}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.productTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 16,
  },
  card: {
    marginVertical: 4,
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 8,
    marginHorizontal: 8,
    alignItems: 'center',
    width: 140,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  productTitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f57c00',
    marginTop: 4,
  },
});

export default WeeklyOffers;
