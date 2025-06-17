import { View, Text, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView, ImageBackground } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter, Stack } from 'expo-router';
import { Product, fetchWeeklyOffers } from '@/services/productsService';

const PAGE_SIZE = 20;

export default function AllOffersScreen() {
  const router = useRouter();
  const [offers, setOffers] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadOffers = async (reset = false) => {
    if (!reset && loadingMore) return;
    if (!reset && !hasMore) return;
    if (reset) {
      setLoading(true);
      setSkip(0);
    } else {
      setLoadingMore(true);
    }
    const newSkip = reset ? 0 : skip;
    const data = await fetchWeeklyOffers(PAGE_SIZE, newSkip);
    if (reset) {
      setOffers(data);
    } else {
      setOffers(prev => [...prev, ...data]);
    }
    setHasMore(data.length === PAGE_SIZE);
    setSkip(newSkip + PAGE_SIZE);
    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    loadOffers(true);
  }, []);

  const filteredOffers = offers.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: Product }) => (
    <SafeAreaView style={styles.card}>
      <View style={styles.imageBox}>
        <Image source={{ uri: item.thumbnail }} style={styles.image} />
      </View>
      <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">{item.title}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        <Text style={styles.discount}> -{item.discountPercentage}%</Text>
      </View>
      <Text style={styles.oldPrice}>Antes: ${(item.price / (1 - (item.discountPercentage || 0) / 100)).toFixed(2)}</Text>
      <Text style={styles.brand}>{item.brand}</Text>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Todas las Ofertas</Text>

      <TextInput
        style={styles.input}
        placeholder="Buscar ofertas..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#f57c00" style={{ marginTop: 40 }} />
      ) : filteredOffers.length === 0 ? (
        <Text style={styles.noResults}>No se encuentran resultados</Text>
      ) : (
        <FlatList
          data={filteredOffers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          ListFooterComponent={
            hasMore ? (
              <TouchableOpacity style={styles.loadMoreBtn} onPress={() => loadOffers()} disabled={loadingMore}>
                <Text style={styles.loadMoreText}>{loadingMore ? 'Cargando...' : 'Cargar más'}</Text>
              </TouchableOpacity>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  backText: {
    color: 'blue',
    fontSize: 14,
    marginBottom: 8,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#f57c00',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  list: {
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 6,
    alignItems: 'center',
    width: '42%',
    height: 220,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 0,
    marginHorizontal: 16,
  },
  imageBox: {
    backgroundColor: '#fafafa',
    borderRadius: 14,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
  },
  image: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
    fontSize: 15,
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
    fontSize: 18,
  },
  discount: {
    color: '#e53935',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 4,
  },
  oldPrice: {
    color: '#bbb',
    textDecorationLine: 'line-through',
    fontSize: 14,
    marginBottom: 2,
  },
  brand: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'normal',
    textAlign: 'center',
  },
  noResults: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
  },
  loadMoreBtn: {
    backgroundColor: '#f57c00',
    borderRadius: 8,
    paddingVertical: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  loadMoreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
