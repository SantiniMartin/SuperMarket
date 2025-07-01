import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface ProductCardProps {
  name: string;
  image: any;
  categories: string[];
  discountPercent?: number;
  price: number;
  oldPrice?: number;
  brand?: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAddToCart: () => void;
  rating: number;
  onRate: (rating: number) => void;
  compact?: boolean;
  cartAdded?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  name,
  image,
  categories,
  discountPercent,
  price,
  oldPrice,
  brand,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  rating,
  onRate,
  compact = false,
  cartAdded = false,
}) => {
  if (compact) {
    return (
      <View style={[styles.card, { minWidth: 160, maxWidth: 190, width: '90%', alignSelf: 'center', padding: 18, height: 270, justifyContent: 'space-between' }]}> 
        <View style={styles.imageBox}>
          <Image source={image} style={styles.image} />
        </View>
        <Text style={styles.productTitle} numberOfLines={2}>{name}</Text>
        {brand ? <Text style={styles.brand}>{brand}</Text> : null}
        <TouchableOpacity
          style={{ backgroundColor: cartAdded ? '#2e7d32' : '#e8f5e9', borderRadius: 8, padding: 10, marginTop: 10 }}
          onPress={onAddToCart}
        >
          <Icon name="cart-outline" size={22} color={cartAdded ? '#fff' : '#2e7d32'} />
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.chipContainer}>
          {categories.map((cat, idx) => (
            <View key={cat+idx} style={[styles.chip, idx === 0 && styles.organic, idx === 1 && styles.bestSeller]}> 
              <Text style={[styles.chipText, idx === 0 && {color: '#388e3c'}, idx === 1 && {color: '#8e24aa'}]}>{cat}</Text>
            </View>
          ))}
          {discountPercent ? (
            <View style={styles.discountChip}>
              <Text style={styles.discountText}>{discountPercent}% OFF</Text>
            </View>
          ) : null}
        </View>
        <TouchableOpacity style={styles.favoriteBtn} onPress={onToggleFavorite}>
          <Icon name={isFavorite ? 'heart' : 'heart-outline'} size={22} color="#e53935" />
        </TouchableOpacity>
      </View>
      <View style={styles.imageBox}>
        <Image source={image} style={styles.image} />
      </View>
      <Text style={styles.productTitle} numberOfLines={2}>{name}</Text>
      {brand ? <Text style={styles.brand}>{brand}</Text> : null}
      <View style={styles.priceRow}>
        <Text style={styles.price}>${price.toFixed(2)}</Text>
        {oldPrice ? <Text style={styles.oldPrice}>${oldPrice.toFixed(2)}</Text> : null}
      </View>
      <View style={styles.ratingRow}>
        {[1,2,3,4,5].map(i => (
          <TouchableOpacity key={i} onPress={() => onRate(i)}>
            <Icon name={i <= rating ? 'star' : 'star-outline'} size={18} color="#FFD600" />
          </TouchableOpacity>
        ))}
        <Text style={styles.ratingText}>({rating})</Text>
      </View>
      <TouchableOpacity
        style={[styles.cartBtn, cartAdded && { backgroundColor: '#2e7d32' }]}
        onPress={onAddToCart}
      >
        <Icon name="cart-outline" size={20} color={cartAdded ? '#fff' : '#2e7d32'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    margin: 8,
    alignItems: 'center',
    width: 170,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    position: 'relative',
  },
  topRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
    maxWidth: 110,
  },
  chip: {
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginRight: 3,
    marginBottom: 2,
  },
  organic: {
    backgroundColor: '#e8f5e9',
  },
  bestSeller: {
    backgroundColor: '#f3e5f5',
  },
  discountChip: {
    backgroundColor: '#fffde7',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginRight: 3,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: '#FFD600',
  },
  chipText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  discountText: {
    color: '#FFD600',
    fontWeight: 'bold',
    fontSize: 11,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 2,
    padding: 2,
  },
  imageBox: {
    backgroundColor: '#fafafa',
    borderRadius: 14,
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    marginTop: 8,
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
    marginBottom: 4,
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
    gap: 8,
  },
  price: {
    color: '#2e7d32',
    fontWeight: 'bold',
    fontSize: 17,
  },
  oldPrice: {
    color: '#888',
    textDecorationLine: 'line-through',
    fontSize: 13,
    marginLeft: 4,
  },
  brand: {
    color: '#555',
    fontSize: 13,
    marginTop: 2,
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    gap: 2,
  },
  ratingText: {
    color: '#888',
    fontSize: 12,
    marginLeft: 4,
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

export default ProductCard;