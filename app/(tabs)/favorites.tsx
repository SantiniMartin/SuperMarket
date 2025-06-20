import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFavorites } from '@/context/FavoritesContext';
import ProductCard from '../../components/ui/ProductCard';

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

export default function FavoritesScreen() {
  const [tab, setTab] = React.useState<'favoritos' | 'lista'>('favoritos');
  const { favorites, removeFavorite, addFavorite } = useFavorites();
  const [ratings, setRatings] = React.useState<{[id: string]: number}>({});

  const renderFavorite = ({ item }: { item: any }) => (
    <ProductCard
      name={item.title || item.name}
      image={getProductImageSource(item.image_url || item.thumbnail, item.category_image_url)}
      categories={[item.category]}
      discountPercent={item.discount_percent || item.discountPercentage}
      price={item.price}
      oldPrice={item.discount_percent || item.discountPercentage ? item.price / (1 - ((item.discount_percent || item.discountPercentage || 0) / 100)) : undefined}
      brand={item.brand}
      isFavorite={true}
      onToggleFavorite={() => removeFavorite(item.id)}
      onAddToCart={() => {}}
      rating={ratings[item.id] || 0}
      onRate={(r) => setRatings({...ratings, [item.id]: r})}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === 'favoritos' && styles.tabSelected]}
          onPress={() => setTab('favoritos')}
        >
          <Icon name="bookmark" size={18} color={tab === 'favoritos' ? '#2e7d32' : '#888'} />
          <Text style={[styles.tabText, tab === 'favoritos' && styles.tabTextSelected]}>Favoritos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'lista' && styles.tabSelected]}
          onPress={() => setTab('lista')}
        >
          <Icon name="cart-outline" size={18} color={tab === 'lista' ? '#2e7d32' : '#888'} />
          <Text style={[styles.tabText, tab === 'lista' && styles.tabTextSelected]}>Lista Compra</Text>
        </TouchableOpacity>
      </View>
      {tab === 'favoritos' ? (
        <FlatList
          data={favorites}
          keyExtractor={item => item.id.toString()}
          renderItem={renderFavorite}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<View style={styles.emptyList}><Text>No tienes productos favoritos.</Text></View>}
        />
      ) : (
        <View style={styles.emptyList}><Text>Lista de compra vacía</Text></View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 18,
    justifyContent: 'center',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginHorizontal: 6,
  },
  tabSelected: {
    backgroundColor: '#e8f5e9',
    borderColor: '#2e7d32',
    borderWidth: 1,
  },
  tabText: {
    marginLeft: 6,
    color: '#888',
    fontWeight: 'bold',
    fontSize: 15,
  },
  tabTextSelected: {
    color: '#2e7d32',
  },
  list: {
    paddingBottom: 24,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
});
