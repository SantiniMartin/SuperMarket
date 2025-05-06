import LocationHeader from '@/components/LocationHeader';
import WeeklyOffers from '@/components/WeeklyOffers';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

export default function HomeScreen() {
  return (

    <SafeAreaView style={styles.container}>
      {/* Ubicación, búsqueda y notificación */}
      <SafeAreaView style={styles.header}>
        <View style={styles.locationContainer}>
          <Icon name="location-outline" size={20} />
          <LocationHeader />
        </View>
        <View style={styles.headerIcons}>
          <Icon name="search-outline" size={24} style={styles.icon} />
          <Icon name="notifications-outline" size={24} style={styles.icon} />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.body}>
        {/* Ofertas semanales */}
        <View>
          <WeeklyOffers />
        </View>
        

        {/* Categorías */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categorías</Text>
          <TouchableOpacity>
            <Text style={styles.link}>Ver todo</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.grid}>
          <View style={styles.smallCard}></View>
          <View style={styles.smallCard}></View>
        </View>

        {/* Mejores ofertas hoy */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mejores ofertas hoy</Text>
          <TouchableOpacity>
            <Text style={styles.link}>Ver todo</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.grid}>
          <View style={styles.smallCard}></View>
          <View style={styles.smallCard}></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center'
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  locationText: { marginLeft: 6, fontSize: 16 },
  headerIcons: { flexDirection: 'row' },
  icon: { marginLeft: 12 },
  body: { paddingHorizontal: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  largeCard: {
    height: 100,
    backgroundColor: '#eee',
    borderRadius: 12,
    marginBottom: 20
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  link: { color: 'blue' },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  smallCard: {
    width: '48%',
    height: 80,
    backgroundColor: '#eee',
    borderRadius: 12
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#ccc'
  }
});