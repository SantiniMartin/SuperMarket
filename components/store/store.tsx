import { StatusBar } from "expo-status-bar";
import { SearchBar } from "react-native-elements";
import React, { useState } from "react";
import { Card, Button, Icon } from "@rneui/themed";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  FlatList,
  TextInput,
} from "react-native";

// const lista = [
//   {
//     name: "Carne",

//     avatar: require("../../assets/images/products/carne.jpg"),
//   },
//   {
//     name: "Cebolla",
//     avatar: require("../../assets/images/products/cebolla.jpg"),
//   },
//   {
//     name: "banana",
//     avatar: require("../../assets/images/products/banana.jpg"),
//   },
// ];

const lista = require("../../productos_supermercados.json").supermarkets[0]
  .products;

const Store = () => {
  const [texto, setTexto] = useState("");
  //const [resultados, setResultados] = useState(lista);

  const buscar = (valor) => {
    setTexto(valor);

    //const filtrados = lista.filter((item) =>
    // item.name.toLowerCase().includes(valor.toLowerCase())
  };
  //setResultados(filtrados);
  const productosFiltrados = lista.filter((item) =>
    item.name.toLowerCase().includes(texto.toLowerCase())
  );
  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View style={styles.view}>
          <Text style={styles.text}>TIENDA</Text>
          <SearchBar
            value={texto}
            onChangeText={buscar}
            platform="default"
            placeholder="Buscar..."
            lightTheme={true}
            round={true}
          />

          <SafeAreaView style={styles.container}></SafeAreaView>
          <StatusBar style="auto" />
          <Card>
            <Card.Title>Productos</Card.Title>
            <Card.Divider />
            {productosFiltrados.map((i, a) => {
              return (
                <View key={a}>
                  <Image
                    style={styles.image}
                    resizeMode="cover"
                    source={i.image_url}
                  />
                  <Text style={styles.Text}>{i.name}</Text>
                  <Button
                    icon={
                      <Icon
                        name="code"
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
                    title="VIEW NOW"
                    onPress={() => {
                      console.log("Button pressed for product:", i.name);
                    }}
                  />
                </View>
              );
            })}
          </Card>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // Crea columnas
    flexWrap: "wrap", // Permite que los elementos fluyan a la siguiente fila
    justifyContent: "space-around", // Distribuye los elementos
  },

  text: {
    fontSize: 32,
    fontWeight: "bold",
    color: "black",
  },
  view: {
    //esto separa d la barra de notificacion 30
    paddingTop: 30,
  },
  image: {
    width: 360,
    height: 350,
  },
  statusbar: {
    paddingTop: 30,
  },
  Text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
});

export default Store;
