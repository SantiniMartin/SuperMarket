// src/components/LocationHeader.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

const LocationHeader = () => {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setAddress('Permiso denegado');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const [place] = await Location.reverseGeocodeAsync(location.coords);

      if (place) {
        const fullAddress = `${place.street ?? ''} ${place.name ?? ''}`;
        setAddress(fullAddress.trim());
      }
    })();
  }, []);

  return (
    <View style={styles.locationContainer}>
      <Text style={styles.label}>Ubicación</Text>
      <Text style={styles.locationText}>
        {address ? address : <ActivityIndicator size="small" />}
      </Text>
    </View>
  );
};

export default LocationHeader;

const styles = StyleSheet.create({
  locationContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
});
