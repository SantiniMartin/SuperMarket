import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, SafeAreaView, Image, Modal, ScrollView, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { fetchProducts, fetchCategories } from '@/services/api';
import { Product } from '@/services/productsService';
import { Stack, useRouter } from 'expo-router';
import { useFavorites } from '@/context/FavoritesContext';

export default function SearchScreen() {
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos los productos');
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const router = useRouter();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  // Animación de pop para el corazón
  const scaleAnim = useRef<{ [key: number]: Animated.Value }>({}).current;
  const triggerPop = (id: number) => {
    if (!scaleAnim[id]) scaleAnim[id] = new Animated.Value(1);
    Animated.sequence([
      Animated.timing(scaleAnim[id], { toValue: 1.3, duration: 120, useNativeDriver: true }),
      Animated.timing(scaleAnim[id], { toValue: 1, duration: 120, useNativeDriver: true })
    ]).start();
  };

  const handleFavorite = (item: Product) => {
    triggerPop(item.id);
    if (isFavorite(item.id)) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [prods, cats] = await Promise.all([
        fetchProducts(),
        fetchCategories()
      ]);
      setProducts(prods);
      setFiltered(prods);
      setCategories(['Todos los productos', ...cats]);
      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    let filteredList = products;
    if (selectedCategory !== 'Todos los productos') {
      filteredList = filteredList.filter(p => p.category === selectedCategory);
    }
    if (search) {
      filteredList = filteredList.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
    }
    // Ordenamiento
    if (sortOption === 'price-asc') {
      filteredList = [...filteredList].sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      filteredList = [...filteredList].sort((a, b) => b.price - a.price);
    } else if (sortOption === 'name') {
      filteredList = [...filteredList].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'discount') {
      filteredList = [...filteredList].sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
    }
    setFiltered(filteredList);
  }, [search, products, selectedCategory, sortOption]);

  const renderProduct = ({ item }: { item: Product }) => {
    if (!scaleAnim[item.id]) scaleAnim[item.id] = new Animated.Value(1);
    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.favoriteBtn}
          onPress={() => handleFavorite(item)}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim[item.id] }] }}>
            <Icon
              name={isFavorite(item.id) ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite(item.id) ? '#e53935' : '#e53935'}
            />
          </Animated.View>
        </TouchableOpacity>
        <View style={styles.imageBox}>
          {item.thumbnail ? (
            <Image source={{ uri: item.thumbnail }} style={{ width: 60, height: 60, resizeMode: 'contain', borderRadius: 10 }} />
          ) : (
            <Text style={{ color: '#bbb' }}>Img Product</Text>
          )}
        </View>
        <Text style={styles.productName} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.storeName}>{item.brand}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          <TouchableOpacity style={styles.cartBtn}>
            <Icon name="cart-outline" size={18} color="#2e7d32" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/') }>
          <Icon name="arrow-back-outline" size={22} color="#222" />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Icon name="search-outline" size={20} color="#888" style={{ marginRight: 6 }} />
            <TextInput
              style={styles.input}
              placeholder="Buscar producto..."
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterModal(true)}>
            <Icon name="filter-outline" size={22} color="#222" />
          </TouchableOpacity>
        </View>
        <View style={styles.chipRow}>
          {categories.slice(0, 5).map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, selectedCategory === cat && styles.chipSelected]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.chipText, selectedCategory === cat && styles.chipTextSelected]}>{cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ')}</Text>
            </TouchableOpacity>
          ))}
          {categories.length > 5 && (
            <TouchableOpacity style={styles.chip} onPress={() => setShowAllCategories(true)}>
              <Text style={styles.chipText}>...</Text>
            </TouchableOpacity>
          )}
        </View>
        <Modal
          visible={showAllCategories}
          transparent
          animationType="fade"
          onRequestClose={() => setShowAllCategories(false)}
        >
          <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowAllCategories(false)}>
            <View style={styles.modalContent}>
              <ScrollView>
                {categories.slice(5).map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.modalChip, selectedCategory === cat && styles.chipSelected]}
                    onPress={() => {
                      setSelectedCategory(cat);
                      setShowAllCategories(false);
                    }}
                  >
                    <Text style={[styles.chipText, selectedCategory === cat && styles.chipTextSelected]}>{cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ')}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
        <Modal
          visible={filterModal}
          transparent
          animationType="fade"
          onRequestClose={() => setFilterModal(false)}
        >
          <TouchableOpacity style={styles.modalOverlay} onPress={() => setFilterModal(false)}>
            <View style={styles.filterModalContent}>
              <Text style={styles.filterTitle}>Ordenar por</Text>
              <TouchableOpacity style={styles.filterOption} onPress={() => { setSortOption('price-asc'); setFilterModal(false); }}>
                <Text style={sortOption === 'price-asc' ? styles.filterOptionSelected : styles.filterOptionText}>Precio: menor a mayor</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterOption} onPress={() => { setSortOption('price-desc'); setFilterModal(false); }}>
                <Text style={sortOption === 'price-desc' ? styles.filterOptionSelected : styles.filterOptionText}>Precio: mayor a menor</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterOption} onPress={() => { setSortOption('name'); setFilterModal(false); }}>
                <Text style={sortOption === 'name' ? styles.filterOptionSelected : styles.filterOptionText}>Nombre</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterOption} onPress={() => { setSortOption('discount'); setFilterModal(false); }}>
                <Text style={sortOption === 'discount' ? styles.filterOptionSelected : styles.filterOptionText}>Descuento</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterOption} onPress={() => { setSortOption(''); setFilterModal(false); }}>
                <Text style={!sortOption ? styles.filterOptionSelected : styles.filterOptionText}>Sin orden</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
        {loading ? (
          <Text style={{ textAlign: 'center', marginTop: 40 }}>Cargando productos...</Text>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.list}
            renderItem={renderProduct}
          />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    alignSelf: 'flex-start',
    backgroundColor: '#f5f6fa',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  backText: {
    fontSize: 17,
    marginLeft: 8,
    color: '#222',
    fontWeight: 'bold',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#222',
  },
  filterBtn: {
    backgroundColor: '#f5f6fa',
    borderRadius: 12,
    padding: 10,
  },
  chipRow: {
    flexDirection: 'row',
    marginBottom: 16,
    flexWrap: 'wrap',
    paddingLeft: 2,
  },
  chip: {
    backgroundColor: '#f5f6fa',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 7,
    marginRight: 10,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: '#2e7d32',
  },
  chipText: {
    color: '#222',
    fontSize: 14,
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
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
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    width: '48%',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    position: 'relative',
  },
  imageBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  productName: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
    marginBottom: 2,
    color: '#111',
    minHeight: 32,
  },
  storeName: {
    color: '#555',
    fontSize: 13,
    marginBottom: 2,
    textAlign: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    width: '100%',
    justifyContent: 'space-between',
  },
  price: {
    color: '#2e7d32',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cartBtn: {
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    padding: 6,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    minWidth: 220,
    maxHeight: 350,
    elevation: 8,
  },
  modalChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterModalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 22,
    minWidth: 220,
    elevation: 8,
    alignItems: 'flex-start',
  },
  filterTitle: {
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 12,
    color: '#222',
  },
  filterOption: {
    paddingVertical: 8,
  },
  filterOptionText: {
    fontSize: 15,
    color: '#222',
  },
  filterOptionSelected: {
    fontSize: 15,
    color: '#2e7d32',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
}); 