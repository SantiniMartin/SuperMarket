import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, SafeAreaView, Image, Modal, ScrollView, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { fetchProducts, fetchCategories } from '@/services/api';
import { Product } from '@/services/productsService';
import { Stack, useRouter } from 'expo-router';
import { useFavorites } from '@/context/FavoritesContext';
import { useCart } from '@/context/CartContext';
import ProductCard from '../components/ui/ProductCard';
import productosData from '../productos_supermercados_actualizado.json';

const productImages: { [key: string]: any } = {
  'zanahorias.jpg': require('../assets/images/products/zanahorias.jpg'),
  'harina cañuelas.jpg': require('../assets/images/products/harina cañuelas.jpg'),
  'arroz gallo.png': require('../assets/images/products/arroz gallo.png'),
  'café la morenita.jpg': require('../assets/images/products/café la morenita.jpg'),
  'aceite cocinero.jpg': require('../assets/images/products/aceite cocinero.jpg'),
  'atun la campagnola.webp': require('../assets/images/products/atun la campagnola.webp'),
  'cerveza quilmes.jpg': require('../assets/images/products/cerveza quilmes.jpg'),
  'lavandina con ayudin.jpg': require('../assets/images/products/lavandina con ayudin.jpg'),
  'banana.jpg': require('../assets/images/products/banana.jpg'),
  'shampoo sedal.webp': require('../assets/images/products/shampoo sedal.webp'),
  'galletita bagley.webp': require('../assets/images/products/galletita bagley.webp'),
  'manzana.jpg': require('../assets/images/products/manzana.jpg'),
  'cebolla.jpg': require('../assets/images/products/cebolla.jpg'),
  'arveja arcor.jpeg': require('../assets/images/products/arveja arcor.jpeg'),
  'gaseosa coca cola.jpg': require('../assets/images/products/gaseosa coca cola.jpg'),
  'detergente ala.jpg': require('../assets/images/products/detergente ala.jpg'),
  'fideo spaghetti.jpg': require('../assets/images/products/fideo spaghetti.jpg'),
  'queso cremoso.jpg': require('../assets/images/products/queso cremoso.jpg'),
  'desodorante.webp': require('../assets/images/products/desodorante.webp'),
  'agua mineral.jpg': require('../assets/images/products/agua mineral.jpg'),
  'manteca sancor.jpeg': require('../assets/images/products/manteca sancor.jpeg'),
  'lentejas.png': require('../assets/images/products/lentejas.png'),
  'sal dos anclas.webp': require('../assets/images/products/sal dos anclas.webp'),
  'jugo en polvo.jpeg': require('../assets/images/products/jugo en polvo.jpeg'),
  'papel higienico.jpg': require('../assets/images/products/papel higienico.jpg'),
  'pechuga de polloo.png': require('../assets/images/products/pechuga de polloo.png'),
  'carne.jpg': require('../assets/images/products/carne.jpg'),
  'pan bimbo.webp': require('../assets/images/products/pan bimbo.webp'),
  'pure de tomate.jpg': require('../assets/images/products/pure de tomate.jpg'),
  'toallas femeninas.webp': require('../assets/images/products/toallas femeninas.webp'),
  'cacao nesquik.jpg': require('../assets/images/products/cacao nesquik.jpg'),
  'jabon de tocador.jpg': require('../assets/images/products/jabon de tocador.jpg'),
  'choclo en lata.jpg': require('../assets/images/products/choclo en lata.jpg'),
  'leche sancor.jpg': require('../assets/images/products/leche sancor.jpg'),
  'azucar ledesma.jpg': require('../assets/images/products/azucar ledesma.jpg'),
  'mayonesa.webp': require('../assets/images/products/mayonesa.webp'),
  'pañales.webp': require('../assets/images/products/pañales.webp'),
  'yerba taragui.webp': require('../assets/images/products/yerba taragui.webp'),
  'mermelada.webp': require('../assets/images/products/mermelada.webp'),
};

function getProductImageSource(image_url: string) {
  if (!image_url) return require('../assets/images/products/placeholder.png');
  if (image_url.startsWith('http')) return { uri: image_url };
  return productImages[image_url] || require('../assets/images/products/placeholder.png');
}

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
  const { addToCart, isInCart } = useCart();

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
    // Obtener todos los productos de todos los supermercados y adaptarlos al tipo Product
    let idCounter = 1;
    const allProducts = productosData.supermarkets.flatMap((s) => s.products.map((p) => ({
      id: typeof p.id === 'number' ? p.id : Number(p.id.toString().replace(/\D/g, '')) || idCounter++,
      title: p.name,
      price: 0, // No se usa
      description: '', // No se usa
      category: p.category,
      thumbnail: p.image_url ? (p.image_url.startsWith('http') ? p.image_url : p.image_url) : '',
      images: [],
      rating: 0,
      stock: p.stock,
      brand: p.brand,
      discountPercentage: 0,
    })));
    // Filtrar productos únicos por nombre y marca
    const uniqueMap = new Map();
    allProducts.forEach((p) => {
      const key = `${p.title.toLowerCase()}|${(p.brand || '').toLowerCase()}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, p);
      }
    });
    const uniqueProducts = Array.from(uniqueMap.values());
    setProducts(uniqueProducts);
    setFiltered(uniqueProducts);
    // Extraer categorías únicas
    setCategories(['Todos los productos', ...Array.from(new Set(uniqueProducts.map(p => p.category)))]);
    setLoading(false);
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

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      name={item.title}
      image={getProductImageSource(item.thumbnail)}
      categories={[]}
      price={item.price}
      brand={item.brand}
      isFavorite={isFavorite(item.id)}
      onToggleFavorite={() => handleFavorite(item)}
      onAddToCart={() => addToCart(item)}
      rating={item.rating || 0}
      onRate={() => {}}
      discountPercent={item.discountPercentage}
      oldPrice={item.price / (1 - (item.discountPercentage || 0) / 100)}
      isInCart={isInCart(item.id)}
      compact={true}
    />
  );

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