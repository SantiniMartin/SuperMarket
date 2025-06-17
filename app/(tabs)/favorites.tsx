import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFavorites } from '@/context/FavoritesContext';

export default function FavoritesScreen() {
  const [tab, setTab] = React.useState<'favoritos' | 'lista'>('favoritos');
  const { favorites, removeFavorite } = useFavorites();

  const renderFavorite = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.imageBox}>
        <Image source={{ uri: item.thumbnail }} style={styles.image} />
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.brand}>{item.brand}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>${item.price}</Text>
      </View>
      <TouchableOpacity style={styles.removeBtn} onPress={() => removeFavorite(item.id)}>
        <Icon name="close-circle" size={22} color="#e53935" />
      </TouchableOpacity>
    </View>
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    minHeight: 90,
  },
  imageBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  infoBox: {
    flex: 1,
  },
  brand: {
    fontSize: 14,
    color: '#444',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  title: {
    fontSize: 15,
    color: '#222',
    marginBottom: 2,
  },
  price: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  removeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
  },
});
