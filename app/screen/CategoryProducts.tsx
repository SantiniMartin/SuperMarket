import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { fetchProductsByCategory } from '@/services/api';
import { useFavorites } from '@/context/FavoritesContext';
import { useCart } from '@/context/CartContext';
import Icon from 'react-native-vector-icons/Ionicons';
import ProductCard from '../../components/ui/ProductCard';

const PAGE_SIZE = 10;

export default function CategoryProducts() {
  const { category } = useLocalSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { addToCart, removeFromCart, isInCart } = useCart();

  const loadProducts = async (reset = false) => {
    if (!category) return;
    if (!reset && loadingMore) return;
    if (!reset && !hasMore) return;
    if (reset) {
      setLoading(true);
      setSkip(0);
    } else {
      setLoadingMore(true);
    }
    const newSkip = reset ? 0 : skip;
    const data = await fetchProductsByCategory(category as string, PAGE_SIZE, newSkip);
    if (reset) {
      setProducts(data);
    } else {
      setProducts(prev => [...prev, ...data]);
    }
    setHasMore(data.length === PAGE_SIZE);
    setSkip(newSkip + PAGE_SIZE);
    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    loadProducts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="orange" />
        <Text style={styles.loadingText}>Cargando productos...</Text>
      </View>
    );
  }

  if (!products.length) {
    return (
      <View style={styles.centered}>
        <Text>No se encontraron productos con oferta.</Text>
      </View>
    );
  }

  const renderProduct = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.favoriteBtn}
        onPress={() => isFavorite(item.id) ? removeFavorite(item.id) : addFavorite(item)}
      >
        <Icon
          name={isFavorite(item.id) ? 'heart' : 'heart-outline'}
          size={20}
          color={isFavorite(item.id) ? '#e53935' : '#e53935'}
        />
      </TouchableOpacity>
      <Image source={{ uri: item.thumbnail }} style={styles.image} />
      <Text numberOfLines={2} style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>${item.price} <Text style={styles.discount}>-{item.discountPercentage}%</Text></Text>
      <Text style={styles.oldPrice}>Antes: ${ (item.price / (1 - item.discountPercentage / 100)).toFixed(2) }</Text>
      <Text style={styles.brand}>{item.brand}</Text>
      <TouchableOpacity 
        style={styles.cartBtn}
        onPress={() => isInCart(item.id) ? removeFromCart(item.id) : addToCart(item, 1)}
      >
        <Icon 
          name={isInCart(item.id) ? 'cart' : 'cart-outline'} 
          size={20} 
          color={isInCart(item.id) ? '#2e7d32' : '#2e7d32'} 
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push('./Categories')}>
        <Text style={styles.link}>← Volver</Text>
      </TouchableOpacity>
      <FlatList
        style={{ backgroundColor: '#fff' }}
        data={products}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={renderProduct}
        ListFooterComponent={
          hasMore ? (
            <TouchableOpacity style={styles.loadMoreBtn} onPress={() => loadProducts()} disabled={loadingMore}>
              <Text style={styles.loadMoreText}>{loadingMore ? 'Cargando...' : 'Cargar más'}</Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
    alignItems: 'center',
    width: '48%',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    height: 110,
    width: 110,
    resizeMode: 'contain',
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    fontSize: 15,
  },
  price: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 16,
  },
  oldPrice: {
    color: '#888',
    textDecorationLine: 'line-through',
    fontSize: 13,
    marginBottom: 2,
  },
  discount: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 13,
  },
  brand: {
    color: '#555',
    fontSize: 13,
    marginTop: 2,
  },
  link: {
    color: 'blue',
    fontSize: 14,
    marginBottom: 8,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  loadingText: {
    color: '#555',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
  favoriteBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
  },
  cartBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    padding: 6,
  },
});
