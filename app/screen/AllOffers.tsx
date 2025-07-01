import { View, Text, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView, ImageBackground } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter, Stack } from 'expo-router';
import { Product, fetchWeeklyOffers } from '@/services/productsService';
import { useFavorites } from '@/context/FavoritesContext';
import { useCart } from '@/context/CartContext';
import Icon from 'react-native-vector-icons/Ionicons';
import productosData from '../../productos_supermercados_actualizado.json';

const PAGE_SIZE = 20;

// Mapa estático de imágenes locales
const productImages: { [key: string]: any } = {
  'desodorante.webp': require('../../assets/images/products/desodorante.webp'),
  'mayonesa.webp': require('../../assets/images/products/mayonesa.webp'),
  'toallas femeninas.webp': require('../../assets/images/products/toallas femeninas.webp'),
  'papel higienico.jpg': require('../../assets/images/products/papel higienico.jpg'),
  'mermelada.webp': require('../../assets/images/products/mermelada.webp'),
  'lentejas.png': require('../../assets/images/products/lentejas.png'),
  'sal dos anclas.webp': require('../../assets/images/products/sal dos anclas.webp'),
  'fideo spaghetti.jpg': require('../../assets/images/products/fideo spaghetti.jpg'),
  'manteca sancor.jpeg': require('../../assets/images/products/manteca sancor.jpeg'),
  'pure de tomate.jpg': require('../../assets/images/products/pure de tomate.jpg'),
  'carne.jpg': require('../../assets/images/products/carne.jpg'),
  'pechuga de polloo.png': require('../../assets/images/products/pechuga de polloo.png'),
  'manzana.jpg': require('../../assets/images/products/manzana.jpg'),
  'cebolla.jpg': require('../../assets/images/products/cebolla.jpg'),
  'banana.jpg': require('../../assets/images/products/banana.jpg'),
  'atun la campagnola.webp': require('../../assets/images/products/atun la campagnola.webp'),
  'gaseosa coca cola.jpg': require('../../assets/images/products/gaseosa coca cola.jpg'),
  'cerveza quilmes.jpg': require('../../assets/images/products/cerveza quilmes.jpg'),
  'detergente ala.jpg': require('../../assets/images/products/detergente ala.jpg'),
  'cacao nesquik.jpg': require('../../assets/images/products/cacao nesquik.jpg'),
  'arveja arcor.jpeg': require('../../assets/images/products/arveja arcor.jpeg'),
  'azucar ledesma.jpg': require('../../assets/images/products/azucar ledesma.jpg'),
  'yerba taragui.webp': require('../../assets/images/products/yerba taragui.webp'),
  'pan bimbo.webp': require('../../assets/images/products/pan bimbo.webp'),
  'queso cremoso.jpg': require('../../assets/images/products/queso cremoso.jpg'),
  'leche sancor.jpg': require('../../assets/images/products/leche sancor.jpg'),
  'shampoo sedal.webp': require('../../assets/images/products/shampoo sedal.webp'),
  'lavandina con ayudin.jpg': require('../../assets/images/products/lavandina con ayudin.jpg'),
  'galletita bagley.webp': require('../../assets/images/products/galletita bagley.webp'),
  'harina cañuelas.jpg': require('../../assets/images/products/harina cañuelas.jpg'),
  'zanahorias.jpg': require('../../assets/images/products/zanahorias.jpg'),
  'aceite cocinero.jpg': require('../../assets/images/products/aceite cocinero.jpg'),
  'arroz gallo.png': require('../../assets/images/products/arroz gallo.png'),
  'café la morenita.jpg': require('../../assets/images/products/café la morenita.jpg'),
  'agua mineral.jpg': require('../../assets/images/products/agua mineral.jpg'),
  'pañales.webp': require('../../assets/images/products/pañales.webp'),
  'jugo en polvo.jpeg': require('../../assets/images/products/jugo en polvo.jpeg'),
  'choclo en lata.jpg': require('../../assets/images/products/choclo en lata.jpg'),
  'jabon de tocador.jpg': require('../../assets/images/products/jabon de tocador.jpg'),
};

function getProductImageSource(image_url: string, category_image_url: string) {
  if (image_url && !image_url.startsWith('http')) {
    if (productImages[image_url]) {
      return productImages[image_url];
    }
    return { uri: category_image_url || 'https://via.placeholder.com/150' };
  }
  return { uri: image_url || category_image_url || 'https://via.placeholder.com/150' };
}

export default function AllOffersScreen() {
  const router = useRouter();
  const [offers, setOffers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { addToCart, removeFromCart, isInCart } = useCart();

  const loadOffers = async (reset = false) => {
    if (!reset && loadingMore) return;
    if (!reset && !hasMore) return;
    if (reset) {
      setLoading(true);
      setSkip(0);
    } else {
      setLoadingMore(true);
    }
    const allProducts = productosData.supermarkets.flatMap((s: any) => s.products.map((p: any) => ({...p, supermarket: s.name, logo_url: s.logo_url})));
    const allOffers = allProducts.filter((p: any) => p.has_offer);
    const newSkip = reset ? 0 : skip;
    const data = allOffers.slice(newSkip, newSkip + PAGE_SIZE);
    if (reset) {
      setOffers(data);
    } else {
      setOffers(prev => [...prev, ...data]);
    }
    setHasMore(newSkip + PAGE_SIZE < allOffers.length);
    setSkip(newSkip + PAGE_SIZE);
    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    loadOffers(true);
  }, []);

  const filteredOffers = offers.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: any }) => (
    <SafeAreaView style={styles.card}>
      <TouchableOpacity
        style={styles.favoriteBtn}
        onPress={() => isFavorite(item.id) ? removeFavorite(item.id) : addFavorite(item)}
      >
        <Icon
          name={isFavorite(item.id) ? 'heart' : 'heart-outline'}
          size={20}
          color={isFavorite(item.id) ? '#e53935' : '#e53935'}
        />
      </TouchableOpacity>
      <View style={styles.imageBox}>
        <Image source={getProductImageSource(item.image_url, item['category_image_url'] ?? '')} style={styles.image} />
      </View>
      <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">{item.name}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        <Text style={styles.discount}> -{item.discount_percent}%</Text>
      </View>
      <Text style={styles.oldPrice}>Antes: ${(item.price / (1 - (item.discount_percent || 0) / 100)).toFixed(2)}</Text>
      <Text style={styles.brand}>{item.brand || item.supermarket}</Text>
      <Text style={[styles.brand, { fontSize: 12, color: '#aaa' }]}>{item.supermarket_name || item.supermarket}</Text>
      <TouchableOpacity 
        style={styles.cartBtn}
        onPress={() => isInCart(item.id) ? removeFromCart(item.id) : addToCart(item, 1)}
      >
        <Icon 
          name={isInCart(item.id) ? 'cart' : 'cart-outline'} 
          size={20} 
          color={isInCart(item.id) ? '#2e7d32' : '#2e7d32'} 
        />
      </TouchableOpacity>
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
          ListFooterComponent={
            hasMore ? (
              <TouchableOpacity style={styles.loadMoreBtn} onPress={() => loadOffers()} disabled={loadingMore}>
                <Text style={styles.loadMoreText}>{loadingMore ? 'Cargando...' : 'Cargar más'}</Text>
              </TouchableOpacity>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 8,
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
    borderRadius: 18,
    padding: 18,
    marginBottom: 6,
    alignItems: 'center',
    width: '42%',
    height: 220,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 0,
    marginHorizontal: 16,
  },
  imageBox: {
    backgroundColor: '#fafafa',
    borderRadius: 14,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
  },
  image: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
    fontSize: 15,
    color: '#111',
    lineHeight: 18,
    maxWidth: 110,
    maxHeight: 38,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  price: {
    color: '#2e7d32',
    fontWeight: 'bold',
    fontSize: 18,
  },
  discount: {
    color: '#e53935',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 4,
  },
  oldPrice: {
    color: '#bbb',
    textDecorationLine: 'line-through',
    fontSize: 14,
    marginBottom: 2,
  },
  brand: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'normal',
    textAlign: 'center',
  },
  noResults: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
  },
  loadMoreBtn: {
    backgroundColor: '#f57c00',
    borderRadius: 8,
    paddingVertical: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  loadMoreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
  },
  cartBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    padding: 6,
  },
});
