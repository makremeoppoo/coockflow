import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import styles from "../styles";


const Search = () => {
    const [groceryList, setGroceryList] = useState([]);
    AsyncStorage.getItem('groceryList').then((groceryList) => {
      setGroceryList(JSON.parse(groceryList || '[]'));
    });

  // Clear checked items from grocery list
  const clearCheckedItems = () => {
    Alert.alert('Clear Items', 'Remove all checked items?', [   
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        onPress: () => {
          const updatedList = groceryList.filter((item: any) => !item.checked);
          setGroceryList(updatedList);
          AsyncStorage.setItem('grocery', JSON.stringify(updatedList));
        },
      },
    ]);
  };
  // Group grocery items by category
  const groupedGroceryList = groceryList.reduce((acc: any, item: any) => {
    const category = item.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});
    return (<ScrollView style={styles.tabContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Grocery List</Text>
          {groceryList.some((item: any) => item.checked) && (
            <TouchableOpacity style={styles.clearButton} onPress={clearCheckedItems}>
              <Ionicons name="trash" size={16} color="#fff" />
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

       
         {Object.entries(groupedGroceryList).map(([category, items]: any) => (
            <View key={category} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <Ionicons name="list" size={18} color="#f97316" />
                <Text style={styles.categoryTitle}>{category.toUpperCase()}</Text>
              </View>

              {items.map((item: any, index: number) => (
                <TouchableOpacity
                  key={item.id || `${item.item}-${index}`}
                  style={[
                    styles.groceryItem,
                    item.checked && styles.groceryItemChecked,
                  ]}
                >
                  <View
                    style={[
                      styles.checkbox,
                      item.checked && styles.checkboxChecked,
                    ]}
                  >
                    {item.checked && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </View>

                  <View style={styles.groceryItemContent}>
                    <Text
                      style={[
                        styles.groceryItemText,
                        item.checked && styles.groceryItemTextChecked,
                      ]}
                    >
                      {item.amount} {item.item}
                    </Text>
                    {item.fromRecipe && (
                      <Text style={styles.groceryItemFrom}>from {item.fromRecipe}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))
        }
      </ScrollView>
    )
}

export default Search
