import { StatusBar } from "expo-status-bar";
import { SearchBar } from "react-native-elements";

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

    avatar: require("../../assets/images/products/carne.jpg"),
  },
  {
    name: "andy vitale",
    avatar: require("../../assets/images/products/cebolla.jpg"),
  },
  {
    name: "katy friedson",
    avatar: require("../../assets/images/products/banana.jpg"),
  },
];

const Store = () => {
  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View style={styles.view}>
          <Text style={styles.text}>TIENDA</Text>
          <SearchBar
            platform="default"
            placeholder="Search Here..."
            lightTheme={true}
            round={true}
          />
          <SafeAreaView style={styles.container}></SafeAreaView>
          <StatusBar style="auto" />
          <Card>
            <Card.Title>Productos</Card.Title>
            <Card.Divider />
            {users.map((i, a) => {
              return (
                <View key={a}>
                  <Image
                    style={styles.image}
                    resizeMode="cover"
                    source={i.avatar}
                  />
                  <Text>{i.name}</Text>
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
});

export default Store;
