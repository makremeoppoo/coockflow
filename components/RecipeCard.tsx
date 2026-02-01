import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import styles from "../app/styles";


const RecipeCard = ({
    recipe,
    alreadyAdded,
    onDelete,
    addToGroceryList
  }: {
    recipe: any;
    alreadyAdded: boolean;
    onDelete: (id: string) => void;
    addToGroceryList: (recipe: any) => void;
  }) => {
    const [showAllIngredients, setShowAllIngredients] = useState(false);
  
    const ingredients = recipe.ingredients || [];
    const visibleIngredients = showAllIngredients
      ? ingredients
      : ingredients.slice(0, 3);
  
    return (
      <View style={styles.recipeCard}>
        {/* Header */}
        <View style={styles.recipeHeader}>
          <Text style={styles.recipeTitle}>{recipe.title}</Text>
  
          <TouchableOpacity onPress={() => onDelete(recipe.id)}>
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
  
        {/* Meta */}
        <View style={styles.recipeMetaContainer}>
          {recipe.servings && (
            <Text style={styles.recipeMeta}>🍽️ {recipe.servings}</Text>
          )}
          {recipe.prepTime && (
            <Text style={styles.recipeMeta}>⏱️ Prep: {recipe.prepTime}</Text>
          )}
          {recipe.cookTime && (
            <Text style={styles.recipeMeta}>🔥 Cook: {recipe.cookTime}</Text>
          )}
        </View>
  
        {/* Tags */}
        {recipe.tags?.length > 0 && (
          <View style={styles.tagContainer}>
            {recipe.tags.map((tag: string, i: number) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
  
        {/* Ingredients */}
        <View style={styles.ingredientsPreview}>
          <Text style={styles.ingredientsTitle}>
            Ingredients ({ingredients.length})
          </Text>
  
          {visibleIngredients.map((ing: any, i: number) => (
            <Text key={i} style={styles.ingredientText}>
              • {ing.amount} {ing.item}
            </Text>
          ))}
  
          {ingredients.length > 3 && (
            <TouchableOpacity
              onPress={() => setShowAllIngredients((prev) => !prev)}
            >
              <Text style={styles.moreText}>
                {showAllIngredients
                  ? 'Show less'
                  : `+${ingredients.length - 3} more`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
       {!alreadyAdded && <View style={styles.recipeActions}>
          <TouchableOpacity
            style={styles.actionButtonGreen}
            onPress={() => addToGroceryList(recipe)}
          >
            <Ionicons name="cart" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>Add to Grocery List</Text>
          </TouchableOpacity>
  
        </View>}
        {/* Source */}
        {recipe.sourceUrl && (
          <TouchableOpacity
            style={styles.viewSourceButton}
            onPress={() => Linking.openURL(recipe.sourceUrl)}
          >
            <Ionicons name="open-outline" size={14} color="#f97316" />
            <Text style={styles.viewSourceText}>View Original Video</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  

export default RecipeCard
