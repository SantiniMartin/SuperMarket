import { View } from "react-native";
import ItemStore from "@/components/store/ItemStore";

export default function DetailStore() {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      <ItemStore />
    </View>
  );
}
