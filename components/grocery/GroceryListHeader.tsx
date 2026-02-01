import styles from "@/app/styles";
import { Text, View } from "react-native";

type GroceryListHeaderProps = {
  totalCount: number;
  uncheckedCount: number;
};

export default function GroceryListHeader({
  totalCount,
  uncheckedCount,
}: GroceryListHeaderProps) {
  const subtitle =
    totalCount === 0
      ? "No items yet"
      : uncheckedCount === 0
        ? "All done!"
        : `${uncheckedCount} left to get`;

  return (
    <View style={styles.pageHeader}>
      <View>
        <Text style={styles.pageTitle}>Grocery List</Text>
        <Text style={styles.pageSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}
