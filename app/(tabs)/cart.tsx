import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useCart } from '@/context/CartContext';
import supermarketsData from '@/productos_supermercados_actualizado.json';
import { usePayment } from '@/context/PaymentContext';

export default function CartScreen() {
  const {
    cart,
    clearCart,
    getTotalItems,
    getTotalPrice,
    updateQuantity,
    removeFromCart
  } = useCart();

  const { cards, addCard, selectedCardId, selectCard } = usePayment();

  const [expandedSupermarketId, setExpandedSupermarketId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<string | null>(null);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardType, setNewCardType] = useState<'Visa' | 'Mastercard'>('Visa');
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardHolder, setNewCardHolder] = useState('');
  const [successModal, setSuccessModal] = useState(false);

  // Obtener supermercados con productos en el carrito
  const supermarkets = (supermarketsData as any).supermarkets.filter((sm: any) => cart[sm.id] && cart[sm.id].length > 0);

  // Calcular totales por supermercado
  const supermarketTotals = supermarkets.map((sm: any) => ({
    id: sm.id,
    name: sm.name,
    logo_url: sm.logo_url,
    total: getTotalPrice(sm.id),
    quantity: cart[sm.id]?.reduce((sum, item) => sum + item.quantity, 0) || 0
  }));

  // Mejor y peor compra
  const sorted = [...supermarketTotals].sort((a, b) => a.total - b.total);
  const mejor = sorted[0];
  const peor = sorted[sorted.length - 1];
  const ahorro = peor && mejor ? (peor.total - mejor.total) : 0;

  const handleBuy = (supermarketId: string) => {
    setModalVisible(supermarketId);
    setShowAddCard(false);
    setNewCardType('Visa');
    setNewCardNumber('');
    setNewCardHolder('');
  };

  const handleAddCard = () => {
    if (newCardNumber.length >= 4 && newCardHolder.trim()) {
      addCard({
        type: newCardType,
        number: newCardNumber.slice(-4),
        holder: newCardHolder.trim(),
      });
      setShowAddCard(false);
      setNewCardNumber('');
      setNewCardHolder('');
    }
  };

  if (supermarketTotals.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Carrito</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Icon name="cart-outline" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptySubtitle}>
            Agrega productos desde la búsqueda
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Carrito</Text>
        <TouchableOpacity onPress={clearCart} style={styles.clearBtn}>
          <Icon name="trash-outline" size={20} color="#e53935" />
          <Text style={styles.clearText}>Vaciar</Text>
        </TouchableOpacity>
      </View>

      {/* Encabezado de ahorro */}
      <View style={styles.savingsBox}>
        <View style={styles.savingsRow}>
          <Text style={styles.savingsLabel}>Ahorro</Text>
          <Text style={styles.savingsValue}>${ahorro.toLocaleString('es-AR')}</Text>
        </View>
        <Text style={styles.savingsSub}>
          Mejor: ${mejor?.total.toLocaleString('es-AR')} y Peor: ${peor?.total.toLocaleString('es-AR')}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {supermarketTotals.map((sm: any, idx: number) => (
          <View key={sm.id}>
            <TouchableOpacity
              style={styles.supermarketCard}
              onPress={() => setExpandedSupermarketId(expandedSupermarketId === sm.id ? null : sm.id)}
              activeOpacity={0.85}
            >
              <View style={styles.logoBox}>
                {sm.logo_url ? (
                  <Image source={{ uri: sm.logo_url }} style={styles.logo} />
                ) : (
                  <View style={styles.logoPlaceholder} />
                )}
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.supermarketName}>{sm.name}</Text>
                <View style={styles.row}>
                  <Icon name="receipt-outline" size={18} color="#888" />
                  <Text style={styles.quantityText}>{sm.quantity}</Text>
                </View>
              </View>
              <View style={styles.priceBox}>
                <Text style={styles.priceText}>${sm.total.toLocaleString('es-AR')}</Text>
              </View>
              <Icon name={expandedSupermarketId === sm.id ? 'chevron-up' : 'chevron-forward'} size={22} color="#888" style={styles.arrowBtn} />
            </TouchableOpacity>
            {expandedSupermarketId === sm.id && (
              <View style={styles.superCardBox}>
                {/* Lista de productos */}
                {cart[sm.id].map((item, i) => (
                  <View key={item.product.id} style={styles.productRowMockup}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.productNameMockup}>{item.product.name || item.product.title}</Text>
                      <Text style={styles.productUnitPrice}>${item.product.price ? item.product.price.toLocaleString('es-AR') : '-'} c/u</Text>
                    </View>
                    <View style={styles.qtyBoxMockup}>
                      <TouchableOpacity onPress={() => updateQuantity(sm.id, item.product.id.toString(), item.quantity - 1)} style={styles.qtyBtnMockup}>
                        <Icon name="remove-circle-outline" size={28} color="#1976d2" />
                      </TouchableOpacity>
                      <Text style={styles.qtyTextMockup}>{item.quantity}</Text>
                      <TouchableOpacity onPress={() => updateQuantity(sm.id, item.product.id.toString(), item.quantity + 1)} style={styles.qtyBtnMockup}>
                        <Icon name="add-circle-outline" size={28} color="#1976d2" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.productTotalPrice}>${(item.product.price ? item.product.price * item.quantity : 0).toLocaleString('es-AR')}</Text>
                  </View>
                ))}
                {/* Resumen de compra */}
                <View style={styles.summaryBoxMockup}>
                  <View style={styles.summaryRowMockup}>
                    <Text style={styles.summaryLabelMockup}>Subtotal:</Text>
                    <Text style={styles.summaryValueMockup}>
                      ${cart[sm.id].reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0).toLocaleString('es-AR')}
                    </Text>
                  </View>
                  <View style={styles.summaryRowMockup}>
                    <Text style={styles.summaryLabelMockup}>iva (21%):</Text>
                    <Text style={styles.summaryValueMockup}>
                      ${Math.round(cart[sm.id].reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0) * 0.21).toLocaleString('es-AR')}
                    </Text>
                  </View>
                  <View style={styles.summaryRowMockup}>
                    <Text style={styles.summaryLabelTotal}>Total</Text>
                    <Text style={styles.summaryValueTotal}>
                      ${Math.round(cart[sm.id].reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0) * 1.21).toLocaleString('es-AR')}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.buyBtnMockup} onPress={() => handleBuy(sm.id)}>
                    <Text style={styles.buyBtnText}>Comprar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Modal de selección de tarjeta */}
      <Modal
        visible={!!modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Métodos de pago</Text>
            {cards.length === 0 && !showAddCard && (
              <Text style={{ marginBottom: 12 }}>No tienes tarjetas guardadas.</Text>
            )}
            {cards.map(card => (
              <TouchableOpacity
                key={card.id}
                style={[styles.cardItem, selectedCardId === card.id && styles.cardItemSelected]}
                onPress={() => selectCard(card.id)}
              >
                <Icon name={card.type === 'Visa' ? 'card-outline' : 'card-outline'} size={24} color="#1976d2" style={{ marginRight: 10 }} />
                <Text style={styles.cardType}>{card.type}</Text>
                <Text style={styles.cardNumber}>**** **** **** {card.number}</Text>
                <Text style={styles.cardHolder}>{card.holder}</Text>
              </TouchableOpacity>
            ))}
            {selectedCardId && !showAddCard && (
              <TouchableOpacity
                style={styles.confirmPayBtn}
                onPress={() => {
                  setModalVisible(null);
                  setSuccessModal(true);
                }}
              >
                <Text style={styles.confirmPayBtnText}>Confirmar pago</Text>
              </TouchableOpacity>
            )}
            {showAddCard && (
              <View style={styles.addCardBox}>
                <Text style={styles.addCardTitle}>Agregar nueva tarjeta</Text>
                <View style={styles.addCardRow}>
                  <TouchableOpacity
                    style={[styles.cardTypeBtn, newCardType === 'Visa' && styles.cardTypeBtnSelected]}
                    onPress={() => setNewCardType('Visa')}
                  >
                    <Text style={styles.cardType}>Visa</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.cardTypeBtn, newCardType === 'Mastercard' && styles.cardTypeBtnSelected]}
                    onPress={() => setNewCardType('Mastercard')}
                  >
                    <Text style={styles.cardType}>Mastercard</Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Número de tarjeta"
                  keyboardType="numeric"
                  maxLength={16}
                  value={newCardNumber}
                  onChangeText={setNewCardNumber}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Nombre del titular"
                  value={newCardHolder}
                  onChangeText={setNewCardHolder}
                />
                <TouchableOpacity style={styles.addCardBtn} onPress={handleAddCard}>
                  <Text style={styles.addCardBtnText}>Guardar tarjeta</Text>
                </TouchableOpacity>
              </View>
            )}
            {!showAddCard && (
              <TouchableOpacity style={styles.addMethodBtn} onPress={() => setShowAddCard(true)}>
                <Text style={styles.addMethodBtnText}>+ Agregar método de pago</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setModalVisible(null)}>
              <Text style={styles.closeModalBtnText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de éxito de pago */}
      <Modal
        visible={successModal}
        transparent
        animationType="fade"
        onRequestClose={() => setSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContent}>
            <Icon name="checkmark-circle" size={60} color="#2e7d32" style={{ marginBottom: 16 }} />
            <Text style={styles.successTitle}>¡Pago realizado!</Text>
            <Text style={styles.successMsg}>El pago se realizó correctamente.</Text>
            <TouchableOpacity style={styles.successBtn} onPress={() => setSuccessModal(false)}>
              <Text style={styles.successBtnText}>Aceptar</Text>
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
  savingsBox: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f5faff',
    borderWidth: 1,
    borderColor: '#e0f0ff',
    marginBottom: 0,
  },
  savingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  savingsLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  savingsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  savingsSub: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  list: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  supermarketCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  logoBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'contain',
  },
  logoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
  infoBox: {
    flex: 1,
    justifyContent: 'center',
  },
  supermarketName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    marginLeft: 4,
    fontSize: 15,
    color: '#555',
    fontWeight: '500',
  },
  priceBox: {
    minWidth: 80,
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  arrowBtn: {
    marginLeft: 8,
    padding: 4,
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
  superCardBox: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 14,
  },
  productRowMockup: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productNameMockup: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  productUnitPrice: {
    fontSize: 14,
    color: '#666',
  },
  qtyBoxMockup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  qtyBtnMockup: {
    padding: 4,
  },
  qtyTextMockup: {
    marginHorizontal: 8,
    fontSize: 15,
    color: '#555',
    fontWeight: '500',
  },
  productTotalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  summaryBoxMockup: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f5faff',
    borderWidth: 1,
    borderColor: '#e0f0ff',
  },
  summaryRowMockup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  summaryLabelMockup: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  summaryValueMockup: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  summaryLabelTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  summaryValueTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  buyBtnMockup: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#1976d2',
    alignItems: 'center',
  },
  buyBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 16,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0f0ff',
    borderRadius: 8,
    marginBottom: 8,
  },
  cardItemSelected: {
    borderColor: '#1976d2',
  },
  cardType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  cardNumber: {
    fontSize: 14,
    color: '#666',
  },
  cardHolder: {
    fontSize: 14,
    color: '#666',
  },
  addCardBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f5faff',
    borderWidth: 1,
    borderColor: '#e0f0ff',
  },
  addCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 16,
  },
  addCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTypeBtn: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#e0f0ff',
    borderRadius: 8,
    marginRight: 8,
  },
  cardTypeBtnSelected: {
    borderColor: '#1976d2',
  },
  input: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0f0ff',
    borderRadius: 8,
  },
  addCardBtn: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#1976d2',
    alignItems: 'center',
  },
  addCardBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  addMethodBtn: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#1976d2',
    alignItems: 'center',
  },
  addMethodBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeModalBtn: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#1976d2',
    alignItems: 'center',
  },
  closeModalBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  confirmPayBtn: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#1976d2',
    alignItems: 'center',
  },
  confirmPayBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  successModalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    maxHeight: '80%',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 16,
  },
  successMsg: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  successBtn: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#1976d2',
    alignItems: 'center',
  },
  successBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});