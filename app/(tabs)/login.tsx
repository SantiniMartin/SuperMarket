import { Link } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Button,
} from "react-native";

export default function Index() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
      <Text style={styles.infoLogueo}>Loguearse</Text>
      <Text style={styles.label}>Ingrese su usuario:</Text>
      <TextInput style={styles.input} placeholder="juan_perez@gmail.com"
      />
      <Text style={styles.label}>Ingrese su contraseña:</Text>
      <TextInput style={styles.input} placeholder="**********" />

      <Button
        title="Ingresar"
        color="#001f55"
        accessibilityLabel="Ingresar"
        onPress={() => console.log("Loguearse")}
      >
      </Button>

      <Link style={styles.creatAccount} href={"/recoverPassword"}>¿Olvidaste tu contraseña?</Link>
      <Link style={styles.creatAccount} href={"/register"}>¿No tenés cuenta? Registrate</Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
    marginVertical: 160,
  },
  infoLogueo: {
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 40,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "medium",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 10,
  },
  creatAccount: {
    color: "blue",
    fontSize: 14,
    marginTop: 20,
    textAlign: "center",
  },
});





