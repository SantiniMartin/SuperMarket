import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { fetchWeeklyOffers, fetchDailyOffers, Product } from '@/services/productsService';
import { useRouter } from 'expo-router';
import { useFavorites } from '@/context/FavoritesContext';
import { useCart } from '@/context/CartContext';
import Icon from 'react-native-vector-icons/Ionicons';
import productosData from '../productos_supermercados_actualizado.json';
import ProductCard from './ui/ProductCard';

// Mapa estático de imágenes locales
const productImages: { [key: string]: any } = {
  'desodorante.webp': require('../assets/images/products/desodorante.webp'),
  'mayonesa.webp': require('../assets/images/products/mayonesa.webp'),
  'toallas femeninas.webp': require('../assets/images/products/toallas femeninas.webp'),
  'papel higienico.jpg': require('../assets/images/products/papel higienico.jpg'),
  'mermelada.webp': require('../assets/images/products/mermelada.webp'),
  'lentejas.png': require('../assets/images/products/lentejas.png'),
  'sal dos anclas.webp': require('../assets/images/products/sal dos anclas.webp'),
  'fideo spaghetti.jpg': require('../assets/images/products/fideo spaghetti.jpg'),
  'manteca sancor.jpeg': require('../assets/images/products/manteca sancor.jpeg'),
  'pure de tomate.jpg': require('../assets/images/products/pure de tomate.jpg'),
  'carne.jpg': require('../assets/images/products/carne.jpg'),
  'pechuga de polloo.png': require('../assets/images/products/pechuga de polloo.png'),
  'manzana.jpg': require('../assets/images/products/manzana.jpg'),
  'cebolla.jpg': require('../assets/images/products/cebolla.jpg'),
  'banana.jpg': require('../assets/images/products/banana.jpg'),
  'atun la campagnola.webp': require('../assets/images/products/atun la campagnola.webp'),
  'gaseosa coca cola.jpg': require('../assets/images/products/gaseosa coca cola.jpg'),
  'cerveza quilmes.jpg': require('../assets/images/products/cerveza quilmes.jpg'),
  'detergente ala.jpg': require('../assets/images/products/detergente ala.jpg'),
  'cacao nesquik.jpg': require('../assets/images/products/cacao nesquik.jpg'),
  'arveja arcor.jpeg': require('../assets/images/products/arveja arcor.jpeg'),
  'azucar ledesma.jpg': require('../assets/images/products/azucar ledesma.jpg'),
  'yerba taragui.webp': require('../assets/images/products/yerba taragui.webp'),
  'pan bimbo.webp': require('../assets/images/products/pan bimbo.webp'),
  'queso cremoso.jpg': require('../assets/images/products/queso cremoso.jpg'),
  'leche sancor.jpg': require('../assets/images/products/leche sancor.jpg'),
  'shampoo sedal.webp': require('../assets/images/products/shampoo sedal.webp'),
  'lavandina con ayudin.jpg': require('../assets/images/products/lavandina con ayudin.jpg'),
  'galletita bagley.webp': require('../assets/images/products/galletita bagley.webp'),
  'harina cañuelas.jpg': require('../assets/images/products/harina cañuelas.jpg'),
  'zanahorias.jpg': require('../assets/images/products/zanahorias.jpg'),
  'aceite cocinero.jpg': require('../assets/images/products/aceite cocinero.jpg'),
  'arroz gallo.png': require('../assets/images/products/arroz gallo.png'),
  'café la morenita.jpg': require('../assets/images/products/café la morenita.jpg'),
  'agua mineral.jpg': require('../assets/images/products/agua mineral.jpg'),
  'pañales.webp': require('../assets/images/products/pañales.webp'),
  'jugo en polvo.jpeg': require('../assets/images/products/jugo en polvo.jpeg'),
  'choclo en lata.jpg': require('../assets/images/products/choclo en lata.jpg'),
  'jabon de tocador.jpg': require('../assets/images/products/jabon de tocador.jpg'),
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

const WeeklyOffers = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
<<<<<<< HEAD
  const [ratings, setRatings] = useState<{[id: string]: number}>({});
=======
  const { addToCart, removeFromCart, isInCart } = useCart();
>>>>>>> aa07ce891fe369ed3f42daf89f043793472bb021

  useEffect(() => {
    // Tomar productos con oferta del JSON local
    const allProducts = productosData.supermarkets.flatMap((s: any) => s.products.map((p: any) => ({...p, supermarket: s.name, logo_url: s.logo_url})));
    const offers = allProducts.filter((p: any) => p.has_offer).slice(0, 5);
    setOffers(offers);
    setLoading(false);
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#f57c00" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ofertas Semanales</Text>
        <TouchableOpacity onPress={() => router.push('/screen/AllOffers')}>
          <Text style={styles.seeAll}>Ver todos</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={offers}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }: { item: any }) => (
<<<<<<< HEAD
          <ProductCard
            name={item.name}
            image={getProductImageSource(item.image_url, item['category_image_url'] ?? '')}
            categories={[item.category]}
            discountPercent={item.discount_percent}
            price={item.price}
            oldPrice={item.price / (1 - (item.discount_percent || 0) / 100)}
            brand={item.brand}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={() => isFavorite(item.id) ? removeFavorite(item.id) : addFavorite(item)}
            onAddToCart={() => {}}
            rating={ratings[item.id] || 0}
            onRate={(r) => setRatings({...ratings, [item.id]: r})}
          />
=======
          <View style={styles.card}>
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
            <Text style={styles.productTitle} numberOfLines={2}>{item.name}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              <Text style={styles.discount}> -{item.discount_percent}%</Text>
            </View>
            <Text style={styles.oldPrice}>Antes: ${(item.price / (1 - (item.discount_percent || 0) / 100)).toFixed(2)}</Text>
            <Text style={styles.brand}>{item.brand || ''}</Text>
            <Text style={[styles.brand, { fontSize: 12, color: '#aaa' }]}>{item.category || ''}</Text>
            <Text style={[styles.brand, { fontSize: 12, color: '#aaa' }]}>{item['supermarket_name'] || item['supermarket'] || ''}</Text>
            <TouchableOpacity style={styles.cartBtn} onPress={() => isInCart(item.id) ? removeFromCart(item.id) : addToCart(item, 1)}>
              <Icon name={isInCart(item.id) ? 'cart' : 'cart-outline'} size={20} color={isInCart(item.id) ? '#2e7d32' : '#2e7d32'} />
            </TouchableOpacity>
          </View>
>>>>>>> aa07ce891fe369ed3f42daf89f043793472bb021
        )}
      />
    </View>
  );
};

export const DailyOffers = () => {
  const [offers, setOffers] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
<<<<<<< HEAD
  const [ratings, setRatings] = useState<{[id: string]: number}>({});
=======
  const { addToCart, removeFromCart, isInCart } = useCart();
>>>>>>> aa07ce891fe369ed3f42daf89f043793472bb021

  useEffect(() => {
    const loadOffers = async () => {
      const data = await fetchDailyOffers(5);
      setOffers(data);
      setLoading(false);
    };
    loadOffers();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#f57c00" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mejores ofertas de hoy</Text>
        <TouchableOpacity onPress={() => router.push('/screen/AllOffers')}>
          <Text style={styles.seeAll}>Ver todo</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={offers}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }: { item: any }) => (
<<<<<<< HEAD
          <ProductCard
            name={item.title}
            image={getProductImageSource(item.thumbnail, item['category_image_url'] ?? '')}
            categories={[item.category]}
            discountPercent={item.discountPercentage}
            price={item.price}
            oldPrice={item.price / (1 - (item.discountPercentage || 0) / 100)}
            brand={item.brand}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={() => isFavorite(item.id) ? removeFavorite(item.id) : addFavorite(item)}
            onAddToCart={() => {}}
            rating={ratings[item.id] || 0}
            onRate={(r) => setRatings({...ratings, [item.id]: r})}
          />
=======
          <View style={styles.card}>
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
              <Image source={getProductImageSource(item.thumbnail, item['category_image_url'] ?? '')} style={styles.image} />
            </View>
            <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              <Text style={styles.discount}> -{item.discountPercentage}%</Text>
            </View>
            <Text style={styles.oldPrice}>Antes: ${(item.price / (1 - (item.discountPercentage || 0) / 100)).toFixed(2)}</Text>
            <Text style={styles.brand}>{item.brand || ''}</Text>
            <Text style={[styles.brand, { fontSize: 12, color: '#aaa' }]}>{item.category || ''}</Text>
            <Text style={[styles.brand, { fontSize: 12, color: '#aaa' }]}>{item['supermarket_name'] || item['supermarket'] || ''}</Text>
            <TouchableOpacity style={styles.cartBtn} onPress={() => isInCart(item.id) ? removeFromCart(item.id) : addToCart(item, 1)}>
              <Icon name={isInCart(item.id) ? 'cart' : 'cart-outline'} size={20} color={isInCart(item.id) ? '#2e7d32' : '#2e7d32'} />
            </TouchableOpacity>
          </View>
>>>>>>> aa07ce891fe369ed3f42daf89f043793472bb021
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    color: 'blue',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 8,
    marginVertical: 4,
    alignItems: 'center',
    width: 160,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  imageBox: {
    backgroundColor: '#fafafa',
    borderRadius: 14,
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  productTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
    fontSize: 14,
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
    fontSize: 17,
  },
  discount: {
    color: '#e53935',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 4,
  },
  oldPrice: {
    color: '#888',
    textDecorationLine: 'line-through',
    fontSize: 13,
    marginBottom: 2,
  },
  brand: {
    color: '#555',
    fontSize: 13,
    marginTop: 2,
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

export default WeeklyOffers;
