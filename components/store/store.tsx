import { StatusBar } from "expo-status-bar";

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Card, Button, Icon } from "@rneui/themed";

const users = [
  {
    name: "brynn",
    avatar:
      "https://images-na.ssl-images-amazon.com/images/M/MV5BMTgxMTc1MTYzM15BMl5BanBnXkFtZTgwNzI5NjMwOTE@._V1_UY256_CR16,0,172,256_AL_.jpg",
  },

  {
    name: "andy vitale",
    avatar:
      "https://images-na.ssl-images-amazon.com/images/M/MV5BMTgxMTc1MTYzM15BMl5BanBnXkFtZTgwNzI5NjMwOTE@._V1_UY256_CR16,0,172,256_AL_.jpg",
  },
  {
    name: "katy friedson",
    avatar:
      "https://images-na.ssl-images-amazon.com/images/M/MV5BMTgxMTc1MTYzM15BMl5BanBnXkFtZTgwNzI5NjMwOTE@._V1_UY256_CR16,0,172,256_AL_.jpg",
  },
];

const Store = () => {
  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View style={styles.view}>
          <Text style={styles.text}>Pagina de Tienda</Text>
          <SafeAreaView style={styles.container}>
            <Button>Primary</Button>
            <Button>Primary</Button>
          </SafeAreaView>
          <StatusBar style="auto" />
          <Card>
            <Card.Title>HELLO WORLD</Card.Title>
            <Card.Divider />
            {users.map((i, a) => {
              return (
                <View key={a}>
                  <Image
                    style={styles.image}
                    resizeMode="cover"
                    source={{ uri: i.avatar }}
                  />
                  <Text>{i.name}</Text>
                </View>
              );
            })}
            <Card.Image
              style={{ padding: 0 }}
              source={{
                uri: "https://awildgeographer.files.wordpress.com/2015/02/john_muir_glacier.jpg",
              }}
            />
            <Text style={{ marginBottom: 10 }}>
              The idea with React Native Elements is more about component
              structure than actual design.
            </Text>
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
            />
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
});

export default Store;
