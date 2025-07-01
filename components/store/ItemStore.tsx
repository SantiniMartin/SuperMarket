import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

export default function ItemStore() {
  const { tienda } = useLocalSearchParams();
  const router = useRouter();

  if (!tienda) {
    return (
      <View style={styles.container}>
        <Text style={styles.name}>Tienda no encontrada</Text>
      </View>
    );
  }

  let parsed;
  try {
    parsed = JSON.parse(tienda);
  } catch (e) {
    console.error("Error al parsear tienda:", e);
    return (
      <View style={styles.container}>
        <Text style={styles.name}>Error al cargar la tienda</Text>
      </View>
    );
  }

  const productos = parsed.products;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>

      <Image source={{ uri: parsed.logo_url }} style={styles.logo} />
      <Text style={styles.name}>{parsed.name}</Text>

      {Array.isArray(productos) && productos.length > 0 ? (
        <FlatList
          data={productos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <Image
                source={{ uri: item.image_url }}
                style={styles.productImage}
              />
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>${item.price}</Text>
              <TouchableOpacity
                style={styles.detailButton}
                onPress={() => {
                  const productoSerializado = JSON.stringify(item);
                  router.push({
                    pathname: "/detail_store",
                    params: { producto: productoSerializado },
                  });
                }}
              >
                <Text style={styles.detailButtonText}>Ver producto</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.name}>No hay productos disponibles</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  logo: {
    width: 150,
    height: 80,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  backButton: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  backText: {
    fontSize: 16,
    color: "#333",
  },
  productCard: {
    marginBottom: 20,
    alignItems: "center",
  },
  productImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  productPrice: {
    fontSize: 16,
    color: "#666",
  },
  detailButton: {
    marginTop: 10,
    backgroundColor: "green",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  detailButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
