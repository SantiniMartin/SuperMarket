import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, Pressable, TouchableOpacity, SafeAreaView } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function CategoryProducts(){
  const { category } = useLocalSearchParams();
  const [products, setProducts] : any = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (category) {
      fetch(`https://fakestoreapi.com/products/category/${category}`)
        .then(res => res.json())
        .then(data => {
          setProducts(data);
          setLoading(false);
        });
    }
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
        <Text>No se encontraron productos.</Text>
      </View>
    );
  }

  return (
      <View style={styles.container}>

        <TouchableOpacity onPress={() => router.push('./Categories')}>
          <Text style={styles.link}>← Volver</Text>
        </TouchableOpacity>
        <FlatList style={{ backgroundColor: '#fff' }}
          data={products}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <SafeAreaView style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text numberOfLines={2} style={styles.title}>{item.title}</Text>
              <Text style={styles.price}>${item.price}</Text>
            </SafeAreaView>
          )}
        />
      </View>
  );
};

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
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    width: '48%',
    elevation: 2,
  },
  image: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  price: {
    color: 'green',
    fontWeight: 'bold',
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
  }
});
