import styles from "@/app/styles";
import { Text, View } from "react-native";
import GroceryItemRow, { GroceryItem } from "./GroceryItemRow";

type GroceryCategorySectionProps = {
  category: string;
  items: GroceryItem[];
  onToggleItem: (id: string) => void;
};

export default function GroceryCategorySection({
  category,
  items,
  onToggleItem,
}: GroceryCategorySectionProps) {
  return (
    <View style={{ marginBottom: 4 }}>
      <Text style={styles.groceryGroupTitle}>{category}</Text>
      {items.map((item, index) => (
        <GroceryItemRow
          key={item.id || `${item.item}-${index}`}
          item={item}
          index={index}
          onToggle={onToggleItem}
        />
      ))}
    </View>
  );
}
