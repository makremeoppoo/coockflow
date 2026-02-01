import styles from "@/app/styles";
import { formatGroceryItemLabel } from "@/utils/grocery";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export type GroceryItem = {
  id?: string;
  item?: string;
  amount?: string;
  checked?: boolean;
  fromRecipe?: string;
  category?: string;
  [key: string]: unknown;
};

type GroceryItemRowProps = {
  item: GroceryItem;
  index: number;
  onToggle: (id: string) => void;
};

export default function GroceryItemRow({
  item,
  index,
  onToggle,
}: GroceryItemRowProps) {
  const checked = !!item.checked;

  return (
    <TouchableOpacity
      style={[styles.groceryItem, checked && styles.groceryItemChecked]}
      onPress={() => item.id && onToggle(item.id)}
      activeOpacity={0.7}
    >
      <View
        style={[styles.groceryCheckbox, checked && styles.groceryCheckboxChecked]}
      >
        {checked && <Ionicons name="checkmark" size={14} color="#fff" />}
      </View>
      <View style={styles.groceryContent}>
        <Text
          style={[styles.groceryText, checked && styles.groceryTextChecked]}
        >
          {formatGroceryItemLabel(item)}
        </Text>
        {item.fromRecipe && (
          <Text style={styles.groceryFrom}>from {item.fromRecipe}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
