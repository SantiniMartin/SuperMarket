import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
} from "react-native";

export default function Index() {
  return (
    <ScrollView>
      <View>
        <Image
          source={{
            uri: "https://reactnative.dev/docs/assets/p_cat2.png",
          }}
          style={{ width: 200, height: 200 }}
        />
      </View>
      <Text>Ingrese su usuario:</Text>
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          color: "gray",
        }}
        placeholder="example user"
      />
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
        }}
        defaultValue="Ingrese su usuario:"
      />
    </ScrollView>
  );
}
