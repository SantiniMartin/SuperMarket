import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { SearchBar } from "react-native-elements";
import React, { useState } from "react";
import { Card, Button, Icon } from "@rneui/themed";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  FlatList,
} from "react-native";

// Cargar supermercados desde el JSON
const supermercados =
  require("../../productos_supermercados.json").supermarkets;

const Store = () => {
  const [texto, setTexto] = useState("");
  const router = useRouter();

  const buscar = (valor) => {
    setTexto(valor);
  };

  // Filtrar supermercados por nombre
  const supermercadosFiltrados = supermercados.filter((s) =>
    s.name.toLowerCase().includes(texto.toLowerCase())
  );

  return (
    <SafeAreaView>
      <View style={styles.view}>
        <Text style={styles.text}>TIENDAS</Text>

        <SearchBar
          value={texto}
          onChangeText={buscar}
          platform="default"
          placeholder="Buscar tiendas..."
          lightTheme
          round
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.searchInputContainer}
          inputStyle={styles.searchInput}
          placeholderTextColor="#999"
        />

        <StatusBar style="auto" />

        <Card>
          <Card.Title>Supermercados</Card.Title>
          <Card.Divider />
          <FlatList
            data={supermercadosFiltrados}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.cardContent}>
                <Image
                  style={styles.image}
                  resizeMode="contain"
                  source={{ uri: item.logo_url }}
                />
                <Text style={styles.Text}>{item.name}</Text>
                <Button
                  color={"green"}
                  icon={
                    <Icon
                      name="store"
                      color="#ffffff"
                      iconStyle={{ marginRight: 10 }}
                    />
                  }
                  buttonStyle={{
                    borderRadius: 0,
                    marginLeft: 0,
                    marginRight: 0,
                    marginBottom: 0,
                  }}
                  title="Ver Tienda"
                  onPress={() => {
                    const tiendaSerializada = JSON.stringify(item);
                    router.push({
                      pathname: "/detail_store",
                      params: { tienda: tiendaSerializada },
                    });
                  }}
                />
              </View>
            )}
          />
        </Card>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: {
    paddingTop: 30,
  },
  text: {
    fontSize: 32,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 100,
    alignSelf: "center",
    marginBottom: 10,
  },
  Text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 10,
  },
  cardContent: {
    marginBottom: 20,
  },
  searchContainer: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  searchInputContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    height: 40,
    borderBottomWidth: 0,
  },
  searchInput: {
    fontSize: 16,
    color: "#333",
  },
});

export default Store;
