import EmptyState from "@/components/EmptyState";
import RecipeCard from "@/components/RecipeCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, View } from 'react-native';
import styles from "../styles";

export default function Index() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [addedRecipes, setAddedRecipes] = useState<any[]>([]);
  AsyncStorage.getItem('recipes').then((recipes) => {
      setRecipes(JSON.parse(recipes || '[]'));
    });
    AsyncStorage.getItem('addedRecipes').then((addedRecipes) => {
      setAddedRecipes(JSON.parse(addedRecipes || '[]'));
    });

  const handleDeleteRecipe = async (id: string) => {
    Alert.alert(
      'Delete recipe',
      'Are you sure you want to delete this recipe?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedRecipes = recipes.filter((r) => r.id !== id);
  
            setRecipes(updatedRecipes);
            await AsyncStorage.setItem(
              'recipes',
              JSON.stringify(updatedRecipes)
            );
          },
        },
      ]
    );
  };

  const addToGroceryList = async (recipe: any) => {
  
    const stored = await AsyncStorage.getItem('groceryList');

    const storedAdded = await AsyncStorage.getItem('addedRecipes');

    const list = stored ? JSON.parse(stored) : [];
  
    recipe.ingredients.forEach((ing: any) => {
      if (!list.some((i: any) => i.item === ing.item)) {
        list.push({ 
          ...ing, 
          id: `${recipe.id}-${ing.item}-${Date.now()}`,
          checked: false,
          fromRecipe: recipe.title
        });
      }
    });
  
    const updated = [...(JSON.parse(storedAdded || '[]') || []), recipe.id];
  
    await AsyncStorage.multiSet([
      ['groceryList', JSON.stringify(list)],
      ['addedRecipes', JSON.stringify(updated)],
    ]);
  };

    const saveToStorage = async (key: string, data: any) => {
      try {
        await AsyncStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error('Storage error:', error);
      }
    };

  return (<ScrollView style={styles.tabContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Recipe Collection</Text>
   
          </View>

          {recipes.length === 0 ? 
          <EmptyState onExplore={() => router.push('/explore')} /> : (
            recipes.map((recipe) => (
             <RecipeCard key={recipe.id} recipe={recipe}  
              alreadyAdded={addedRecipes.includes(recipe.id)}
             onDelete={handleDeleteRecipe} 
             addToGroceryList={addToGroceryList} />
            ))
          )}
        </ScrollView>
      );

}

