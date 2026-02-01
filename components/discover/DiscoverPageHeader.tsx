import styles from "@/app/styles";
import { Text, View } from "react-native";

export default function DiscoverPageHeader() {
  return (
    <View style={styles.pageHeader}>
      <View>
        <Text style={styles.pageTitle}>Discover</Text>
        <Text style={styles.pageSubtitle}>
          Paste a recipe video link. Get ingredients, steps & grocery list.
        </Text>
      </View>
    </View>
  );
}
