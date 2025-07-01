import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { usePurchaseHistory } from '@/context/PurchaseHistoryContext';

interface CartItem {
  product: any;
  quantity: number;
}

interface Purchase {
  id: string;
  items: CartItem[];
  total: number;
  date: Date;
}

const PurchaseHistoryScreen = () => {
  const { purchaseHistory } = usePurchaseHistory();
  const router = useRouter();

  const renderPurchase = ({ item }: { item: Purchase }) => (
    <View style={styles.purchaseContainer}>
      <View style={styles.purchaseHeader}>
        <Text style={styles.purchaseDate}>{new Date(item.date).toLocaleDateString()}</Text>
        <Text style={styles.purchaseTotal}>Total: ${item.total.toFixed(2)}</Text>
      </View>
      <FlatList
        data={item.items}
        keyExtractor={(productItem) => productItem.product.id.toString()}
        renderItem={({ item: productItem }) => (
          <View style={styles.productItem}>
            <Image source={{ uri: productItem.product.thumbnail }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productTitle}>{productItem.product.title}</Text>
              <Text style={styles.productQuantity}>Cantidad: {productItem.quantity}</Text>
            </View>
            <Text style={styles.productPrice}>${(productItem.product.price * productItem.quantity).toFixed(2)}</Text>
          </View>
        )}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historial de Compras</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={purchaseHistory.sort((a, b) => b.date.getTime() - a.date.getTime())}
        keyExtractor={(item) => item.id}
        renderItem={renderPurchase}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay compras en el historial.</Text>}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 SuperMarket. Todos los derechos reservados.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  listContainer: {
    padding: 16,
  },
  purchaseContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
  },
  purchaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  purchaseDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  purchaseTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  productImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 14,
    color: '#333',
  },
  productQuantity: {
    fontSize: 12,
    color: '#777',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  footerText: {
    fontSize: 12,
    color: '#888',
  },
});

export default PurchaseHistoryScreen;
