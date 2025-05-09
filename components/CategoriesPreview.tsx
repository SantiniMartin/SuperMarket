import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

const imageMap: Record<string, string> = {
  "electronics": "https://i.imgur.com/MYOQkVQ.jpg",
  "jewelery": "https://i.imgur.com/lP1zL1u.jpg",
  "men's clothing": "https://i.imgur.com/7t3I8RZ.jpg",
  "women's clothing": "https://i.imgur.com/YLx6aE2.jpg",
};

const CategoriesPreview = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products/categories');
        const data = await response.json();
        const shuffled = data.sort(() => 0.5 - Math.random());
        setCategories(shuffled.slice(0, 2));
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <ActivityIndicator size="small" color="#f57c00" />;
  }

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Categorías</Text>
        <TouchableOpacity onPress={() => router.push('./screen/Categories')}>
          <Text style={styles.link}>Ver todo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {categories.map((cat) => (
          <TouchableOpacity key={cat} style={styles.card}>
            <ImageBackground
              source={{ uri: imageMap[cat] }}
              style={styles.image}
              imageStyle={{ borderRadius: 10 }}
            >
              <View style={styles.overlay}>
                <Text style={styles.categoryText}>{cat.toUpperCase()}</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default CategoriesPreview;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginHorizontal: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: 'blue',
    fontSize: 14,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 8,
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
