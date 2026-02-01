import {
  GroceryCategorySection,
  GroceryListHeader,
} from "@/components/grocery";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ScrollView } from "react-native";
import styles from "../styles";

function groupByCategory(list: any[]): Record<string, any[]> {
  return list.reduce((acc: Record<string, any[]>, item: any) => {
    const category = item.category || "other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});
}

export default function Search() {
  const [groceryList, setGroceryList] = useState<any[]>([]);

  const loadData = useCallback(async () => {
    const stored = await AsyncStorage.getItem("groceryList");
    setGroceryList(JSON.parse(stored || "[]"));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const toggleItem = useCallback(
    async (id: string) => {
      const updated = groceryList.map((item: any) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      );
      setGroceryList(updated);
      await AsyncStorage.setItem("groceryList", JSON.stringify(updated));
    },
    [groceryList]
  );

  const grouped = groupByCategory(groceryList);
  const uncheckedCount = groceryList.filter((item: any) => !item.checked).length;

  return (
    <ScrollView
      style={styles.scrollArea}
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <GroceryListHeader
          totalCount={groceryList.length}
          uncheckedCount={uncheckedCount}
        />

        {Object.entries(grouped).map(([category, items]) => (
          <GroceryCategorySection
            key={category}
            category={category}
            items={items}
            onToggleItem={toggleItem}
          />
        ))}
    </ScrollView>
  );
}
