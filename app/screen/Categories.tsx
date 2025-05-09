// app/category/[name].tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const CategoryPage = () => {
  const { name } = useLocalSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const response = await fetch(`https://fakestoreapi.com/products/category/${name}`);
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching category products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [name]);

  const applyFilters = () => {
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || Number.MAX_VALUE;

    const filtered = products.filter(
      (item) => item.price >= min && item.price <= max
    );

    setFilteredProducts(filtered);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#f57c00" style={{ marginTop: 20 }} />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>← Volver</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Productos de {name}</Text>

      <View style={styles.filterContainer}>
        <TextInput
          placeholder="Precio mínimo"
          keyboardType="numeric"
          value={minPrice}
          onChangeText={setMinPrice}
          style={styles.input}
        />
        <TextInput
          placeholder="Precio máximo"
          keyboardType="numeric"
          value={maxPrice}
          onChangeText={setMaxPrice}
          style={styles.input}
        />
        <TouchableOpacity onPress={applyFilters} style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Filtrar</Text>
        </TouchableOpacity>
      </View>

      {filteredProducts.length === 0 ? (
        <Text style={styles.noResults}>No se encontraron productos.</Text>
      ) : (
        <FlatList
          data={filteredProducts}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
              <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.price}>${item.price}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default CategoryPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: 'white',
  },
  back: {
    color: '#f57c00',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#f57c00',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  filterButton: {
    backgroundColor: '#f57c00',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  filterButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
  grid: {
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 10,
    margin: 5,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  productTitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  price: {
    fontWeight: 'bold',
    color: '#f57c00',
    marginTop: 4,
  },
});
