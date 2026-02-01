import BackgroundPattern from "@/components/BackgroundPattern";
import EmptyState from "@/components/EmptyState";
import RecipeCard from "@/components/RecipeCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  ScrollView,
  Text,
  View,
} from "react-native";
import styles from "../styles";

const STAGGER_DELAY = 80;

function AnimatedCard({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.spring(opacity, {
          toValue: 1,
          useNativeDriver: true,
          damping: 22,
          mass: 0.7,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 22,
          mass: 0.7,
        }),
      ]).start();
    }, index * STAGGER_DELAY);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
      }}
    >
      {children}
    </Animated.View>
  );
}

export default function Index() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [addedRecipes, setAddedRecipes] = useState<string[]>([]);

  const loadData = useCallback(async () => {
    const [storedRecipes, storedAdded] = await Promise.all([
      AsyncStorage.getItem("recipes"),
      AsyncStorage.getItem("addedRecipes"),
    ]);
    setRecipes(JSON.parse(storedRecipes || "[]"));
    setAddedRecipes(JSON.parse(storedAdded || "[]"));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleDeleteRecipe = async (id: string) => {
    Alert.alert(
      "Delete recipe",
      "Are you sure you want to delete this recipe?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const updatedRecipes = recipes.filter((r) => r.id !== id);
            setRecipes(updatedRecipes);
            await AsyncStorage.setItem(
              "recipes",
              JSON.stringify(updatedRecipes)
            );
          },
        },
      ]
    );
  };

  const addToGroceryList = async (recipe: any) => {
    const stored = await AsyncStorage.getItem("groceryList");
    const storedAdded = await AsyncStorage.getItem("addedRecipes");
    const list = stored ? JSON.parse(stored) : [];

    (recipe.ingredients || []).forEach((ing: any) => {
      const item = typeof ing === "string" ? ing : ing?.item;
      if (item && !list.some((i: any) => (i.item || i) === item)) {
        list.push({
          ...(typeof ing === "object" ? ing : {}),
          item: item,
          id: `${recipe.id}-${item}-${Date.now()}`,
          checked: false,
          fromRecipe: recipe.title,
        });
      }
    });

    const updated = [...(JSON.parse(storedAdded || "[]") || []), recipe.id];
    setAddedRecipes(updated);

    await AsyncStorage.multiSet([
      ["groceryList", JSON.stringify(list)],
      ["addedRecipes", JSON.stringify(updated)],
    ]);
  };

  return (
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
      <BackgroundPattern />
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.pageTitle}>My Recipe Collection</Text>
          <Text style={styles.pageSubtitle}>
            {recipes.length === 0
              ? "No recipes yet"
              : `${recipes.length} recipe${recipes.length === 1 ? "" : "s"}`}
          </Text>
        </View>
      </View>

      {recipes.length === 0 ? (
        <EmptyState onExplore={() => router.push("/explore")} />
      ) : (
        recipes.map((recipe, index) => (
          <AnimatedCard key={recipe.id} index={index}>
            <RecipeCard
              recipe={recipe}
              alreadyAdded={addedRecipes.includes(recipe.id)}
              onDelete={handleDeleteRecipe}
              addToGroceryList={addToGroceryList}
            />
          </AnimatedCard>
        ))
      )}
      </ScrollView>
  );
}
