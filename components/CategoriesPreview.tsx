import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchCategories } from '@/services/api';

const imageMap: Record<string, string> = {
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
const defaultImage = 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca';

const CategoriesPreview = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCategories();
        const shuffled = data.sort(() => 0.5 - Math.random());
        setCategories(shuffled.slice(0, 2));
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="small" color="#f57c00" />;
  }

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Categorías</Text>
        <TouchableOpacity onPress={() => router.push('../screen/Categories')}>
          <Text style={styles.link}>Ver todo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {categories.map((cat) => (
          <TouchableOpacity key={cat} style={styles.card}>
            <ImageBackground
              source={{ uri: imageMap[cat] || defaultImage }}
              style={styles.image}
              imageStyle={{ borderRadius: 10 }}
            >
              <View style={styles.overlay}>
                <Text style={styles.categoryText}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  link: {
    color: 'blue',
    fontSize: 14,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  card: {
    flex: 1,
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 6,
  },
  categoryText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default CategoriesPreview;
