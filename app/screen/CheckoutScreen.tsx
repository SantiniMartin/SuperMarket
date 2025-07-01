import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  FlatList,
  Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useCart } from '@/context/CartContext';
import { usePurchaseHistory } from '@/context/PurchaseHistoryContext';

type PaymentMethod = 'credit' | 'debit' | null;

export default function CheckoutScreen() {
  const router = useRouter();
  const { cartItems, getTotalPrice, getTotalItems, clearCart } = useCart();
  const { addPurchase } = usePurchaseHistory();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleConfirmPurchase = () => {
    if (!selectedPayment) {
      Alert.alert('Método de pago requerido', 'Por favor selecciona un método de pago');
      return;
    }

    setModalVisible(true);
  };

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemImageBox}>
        <Image 
          source={{ uri: item.product.thumbnail }} 
          style={styles.itemImage}
          defaultSource={require('../../assets/images/icon.png')}
        />
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={2}>{item.product.title}</Text>
        <Text style={styles.itemBrand}>{item.product.brand}</Text>
        <Text style={styles.itemQuantity}>Cantidad: {item.quantity}</Text>
      </View>
      <View style={styles.itemPrice}>
        <Text style={styles.itemPriceText}>${(item.product.price * item.quantity).toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Finalizar Compra</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Resumen de productos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen de productos</Text>
          <FlatList
            data={cartItems}
            keyExtractor={item => item.product.id.toString()}
            renderItem={renderCartItem}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Métodos de pago */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Método de pago</Text>
          <TouchableOpacity
            style={[
              styles.paymentOption,
              selectedPayment === 'credit' && styles.paymentOptionSelected,
            ]}
            onPress={() => setSelectedPayment('credit')}>
            <View style={styles.paymentOptionContent}>
              <Icon
                name="card-outline"
                size={24}
                color={selectedPayment === 'credit' ? '#2e7d32' : '#666'}
              />
              <View style={styles.paymentOptionText}>
                <Text
                  style={[
                    styles.paymentOptionTitle,
                    selectedPayment === 'credit' &&
                      styles.paymentOptionTitleSelected,
                  ]}>
                  Tarjeta de Crédito
                </Text>
                <Text style={styles.paymentOptionSubtitle}>
                  Paga en cuotas sin interés
                </Text>
              </View>
            </View>
            {selectedPayment === 'credit' && (
              <Icon name="checkmark-circle" size={24} color="#2e7d32" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.paymentOption,
              selectedPayment === 'debit' && styles.paymentOptionSelected,
            ]}
            onPress={() => setSelectedPayment('debit')}>
            <View style={styles.paymentOptionContent}>
              <Icon
                name="card-outline"
                size={24}
                color={selectedPayment === 'debit' ? '#2e7d32' : '#666'}
              />
              <View style={styles.paymentOptionText}>
                <Text
                  style={[
                    styles.paymentOptionTitle,
                    selectedPayment === 'debit' &&
                      styles.paymentOptionTitleSelected,
                  ]}>
                  Tarjeta de Débito
                </Text>
                <Text style={styles.paymentOptionSubtitle}>
                  Pago inmediato desde tu cuenta
                </Text>
              </View>
            </View>
            {selectedPayment === 'debit' && (
              <Icon name="checkmark-circle" size={24} color="#2e7d32" />
            )}
          </TouchableOpacity>
        </View>

        {/* Información adicional */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información adicional</Text>
          <View style={styles.infoRow}>
            <Icon name="location-outline" size={20} color="#666" />
            <Text style={styles.infoText}>Entrega en 24-48 horas</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="shield-checkmark-outline" size={20} color="#666" />
            <Text style={styles.infoText}>Pago seguro y encriptado</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="refresh-outline" size={20} color="#666" />
            <Text style={styles.infoText}>Devolución gratuita en 30 días</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer con total y botón de confirmar */}
      <View style={styles.footer}>
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Productos ({getTotalItems()}):</Text>
            <Text style={styles.totalValue}>${getTotalPrice().toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Envío:</Text>
            <Text style={styles.totalValue}>Gratis</Text>
          </View>
          <View style={[styles.totalRow, styles.finalTotal]}>
            <Text style={styles.finalTotalLabel}>Total:</Text>
            <Text style={styles.finalTotalValue}>${getTotalPrice().toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[
            styles.confirmBtn,
            !selectedPayment && styles.confirmBtnDisabled
          ]} 
          onPress={handleConfirmPurchase}
          disabled={!selectedPayment}
        >
          <Icon name="card-outline" size={20} color="#fff" />
          <Text style={styles.confirmBtnText}>
            {selectedPayment ? 'Confirmar Compra' : 'Selecciona método de pago'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(!isModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Icon name="checkmark-circle" size={60} color="#2e7d32" />
            <Text style={styles.modalText}>¡Compra Exitosa!</Text>
            <Text style={styles.modalSubText}>Tu pedido ha sido procesado.</Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                addPurchase(cartItems, getTotalPrice());
                setModalVisible(!isModalVisible);
                clearCart();
                router.push('/');
              }}
            >
              <Text style={styles.textStyle}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

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
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemImageBox: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemImage: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
    borderRadius: 6,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
    marginBottom: 2,
  },
  itemBrand: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#999',
  },
  itemPrice: {
    alignItems: 'flex-end',
  },
  itemPriceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  paymentOptionSelected: {
    borderColor: '#2e7d32',
    backgroundColor: '#f0f8f0',
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentOptionText: {
    marginLeft: 12,
    flex: 1,
  },
  paymentOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 2,
  },
  paymentOptionTitleSelected: {
    color: '#2e7d32',
  },
  paymentOptionSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
  },
  footer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  totalSection: {
    marginBottom: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
  },
  finalTotal: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
    marginTop: 8,
  },
  finalTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  finalTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2e7d32',
    borderRadius: 12,
    paddingVertical: 16,
    elevation: 2,
  },
  confirmBtnDisabled: {
    backgroundColor: '#ccc',
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 15,
    width: 100,
    alignItems: 'center',
  },
  buttonClose: {
    backgroundColor: '#2e7d32',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalText: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalSubText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
}); 