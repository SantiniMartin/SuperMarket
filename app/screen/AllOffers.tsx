import { View, Text, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView  } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter, Stack } from 'expo-router';
import { Product, fetchWeeklyOffers } from '@/services/productsService';

export default function AllOffersScreen() {
  const router = useRouter();
  const [offers, setOffers] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const data = await fetchWeeklyOffers();
        setOffers(data);
      } catch (error) {
        console.error('Error al cargar ofertas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOffers();
  }, []);

  const filteredOffers = offers.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: Product }) => (
    <SafeAreaView style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.price}>${item.price.toFixed(2)}</Text>
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
          />
        )}
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
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
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: '48%',
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    textAlign: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f57c00',
    marginTop: 4,
  },
  noResults: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
  },
});
