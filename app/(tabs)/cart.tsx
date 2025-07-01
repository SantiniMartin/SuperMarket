import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  Image, 
  FlatList,
  Alert,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'expo-router';

export default function CartScreen() {
  const router = useRouter();
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalItems, 
    getTotalPrice 
  } = useCart();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Carrito vacío', 'Agrega productos antes de continuar');
      return;
    }
    
    // Navegar a la pantalla de checkout
    router.push('../screen/CheckoutScreen');
  };

  const handleClearCart = () => {
    Alert.alert(
      'Vaciar carrito',
      '¿Estás seguro de que quieres vaciar el carrito?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Vaciar', style: 'destructive', onPress: clearCart }
      ]
    );
  };

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.imageBox}>
        <Image 
          source={{ uri: item.product.thumbnail }} 
          style={styles.image}
          defaultSource={require('../../assets/images/icon.png')}
        />
      </View>
      
      <View style={styles.infoBox}>
        <Text style={styles.brand}>{item.product.brand}</Text>
        <Text style={styles.title} numberOfLines={2}>{item.product.title}</Text>
        <Text style={styles.price}>${item.product.price}</Text>
      </View>

      <View style={styles.quantityBox}>
        <TouchableOpacity 
          style={styles.quantityBtn}
          onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
        >
          <Icon name="remove" size={16} color="#2e7d32" />
        </TouchableOpacity>
        
        <Text style={styles.quantityText}>{item.quantity}</Text>
        
        <TouchableOpacity 
          style={styles.quantityBtn}
          onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
        >
          <Icon name="add" size={16} color="#2e7d32" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.removeBtn} 
        onPress={() => removeFromCart(item.product.id)}
      >
        <Icon name="close-circle" size={22} color="#e53935" />
      </TouchableOpacity>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Carrito de Compras</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Icon name="cart-outline" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptySubtitle}>
            Agrega productos desde las ofertas o búsqueda
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Carrito de Compras</Text>
        <TouchableOpacity onPress={handleClearCart} style={styles.clearBtn}>
          <Icon name="trash-outline" size={20} color="#e53935" />
          <Text style={styles.clearText}>Vaciar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={item => item.product.id.toString()}
        renderItem={renderCartItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Productos:</Text>
            <Text style={styles.summaryValue}>{getTotalItems()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total:</Text>
            <Text style={styles.totalPrice}>${getTotalPrice().toFixed(2)}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Icon name="card-outline" size={20} color="#fff" />
          <Text style={styles.checkoutText}>Finalizar Compra</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#fff5f5',
  },
  clearText: {
    marginLeft: 4,
    color: '#e53935',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  list: {
    paddingHorizontal: 16,
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
  quantityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 8,
    marginRight: 12,
  },
  quantityBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  removeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
  },
  footer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  summary: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2e7d32',
    borderRadius: 12,
    paddingVertical: 16,
    elevation: 2,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 