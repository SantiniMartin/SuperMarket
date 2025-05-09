import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

const imageMap: Record<string, string> = {
  "electronics": "https://plus.unsplash.com/premium_photo-1683121716061-3faddf4dc504?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "jewelery": "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "men's clothing": "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
  "women's clothing": "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
        <TouchableOpacity onPress={() => router.push('../screen/Categories')}>
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
                <Text style={styles.categoryText}>{cat}</Text>
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
