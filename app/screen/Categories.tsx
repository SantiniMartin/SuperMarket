import { View, Text, ImageBackground, Pressable, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { fetchCategories } from '@/services/api';

const CATEGORY_IMAGES: Record<string, string> = {
  beauty: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
  fragrances: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  furniture: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
  groceries: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
  'home-decoration': 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
  'kitchen-accessories': 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c',
  laptops: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
  'mens-shirts': 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f',
  'mens-shoes': 'https://images.unsplash.com/photo-1519741497674-611481863552',
  'mens-watches': 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b',
  'mobile-accessories': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
  motorcycle: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d',
  'skin-care': 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2',
  smartphones: 'https://images.unsplash.com/photo-1510557880182-3d4d3c1b2606',
  'sports-accessories': 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c',
  sunglasses: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
  tablets: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
  tops: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f',
  vehicle: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d',
  'womens-bags': 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
  'womens-dresses': 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f',
  'womens-jewellery': 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
  'womens-shoes': 'https://images.unsplash.com/photo-1519741497674-611481863552',
  'womens-watches': 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b',
};
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca';

export default function Categories (){
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCategories()
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
          keyExtractor={(item) => item as string}
          numColumns={1}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => handlePress(item)}>
              <ImageBackground
                source={{ uri: CATEGORY_IMAGES[item as string] || DEFAULT_IMAGE }}
                resizeMode="cover"
                style={styles.imageBackground}
                imageStyle={{ borderRadius: 12 }}
              >
                <View style={styles.overlay}>
                  <Text style={styles.categoryText}>{
                    (item as string).charAt(0).toUpperCase() + (item as string).slice(1).replace(/-/g, ' ')
                  }</Text>
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
    height: 800,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  categoryText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 32,
    textTransform: 'capitalize',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
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
