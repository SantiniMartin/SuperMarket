import { View, Text, ImageBackground, Pressable, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';

const CATEGORY_IMAGES = {
  "electronics": 'https://plus.unsplash.com/premium_photo-1683121716061-3faddf4dc504?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  "jewelery": 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  "men's clothing": 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f',
  "women's clothing": 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
};

export default function Categories (){
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('https://fakestoreapi.com/products/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="orange" />
        <Text style={styles.loadingText}>Cargando categorías...</Text>
      </View>
    );
  }

  // ✅ CORREGIDO: navegación como string simple con query param
  const handlePress = (category : any) => {
    router.push(`./CategoryProducts?category=${encodeURIComponent(category)}`);
  };

  return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.push('/(tabs)')}>
          <Text style={styles.link}>← Volver</Text>
        </TouchableOpacity>
        <FlatList
          data={categories}
          keyExtractor={(item) => item}
          numColumns={1}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => handlePress(item)}>
              <ImageBackground
                source={{ uri: CATEGORY_IMAGES[item] || 'https://via.placeholder.com/150' }}
                resizeMode="cover"
                style={styles.imageBackground}
                imageStyle={{ borderRadius: 12 }}
              >
                <View style={styles.overlay}>
                  <Text style={styles.categoryText}>{item}</Text>
                </View>
              </ImageBackground>
            </Pressable>
          )}
        />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    margin: 8,
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
  },
  categoryText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'capitalize',
  },
  list: {
    paddingBottom: 24,
  },
  link:{
    color: 'blue',
    fontSize: 14,
    marginBottom: 8,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
