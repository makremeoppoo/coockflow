import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import BackgroundPattern from "../../components/BackgroundPattern";
import {
  DiscoverInputCard,
  DiscoverPageHeader,
  DiscoverTipCard,
} from "../../components/discover";
import { appwriteConfig } from "../../lib/appwrite";
import {
  extractRecipeWithGemini,
  getVideoContent,
} from "../../lib/recipeFromVideo";
import styles from "../styles";

const HOW_IT_WORKS = [
  { num: "1", text: "Paste a recipe video URL" },
  { num: "2", text: "AI extracts ingredients & steps" },
  { num: "3", text: "Add to grocery list" },
  { num: "4", text: "Cook with confidence!" },
];

const FEATURES = [
  { num: "•", text: "Smart ingredient parsing" },
  { num: "•", text: "Organized grocery lists" },
  { num: "•", text: "Save favorite recipes" },
];

export default function Discover() {
  const [videoUrl, setVideoUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]);

  const loadRecipes = useCallback(async () => {
    const stored = await AsyncStorage.getItem("recipes");
    setSavedRecipes(JSON.parse(stored || "[]"));
  }, []);

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  useFocusEffect(
    useCallback(() => {
      loadRecipes();
    }, [loadRecipes])
  );

  const saveToStorage = useCallback(async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error("Storage error:", error);
    }
  }, []);

  const extractRecipe = useCallback(async () => {
    if (!videoUrl.trim()) {
      Alert.alert("Error", "Please enter a video URL");
      return;
    }

    const apiKey =
      appwriteConfig.geminiApiKey ?? process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? "";
    if (!apiKey) {
      Alert.alert(
        "Error",
        "Missing Gemini API key. Add EXPO_PUBLIC_GEMINI_API_KEY to .env"
      );
      return;
    }

    setIsExtracting(true);
    try {
      const videoContent = await getVideoContent(videoUrl.trim());
      const recipeData = await extractRecipeWithGemini(
        videoContent,
        apiKey,
        appwriteConfig.geminiModel ?? "gemini-2.0-flash"
      );

      const recipe = {
        ...recipeData,
        id: Date.now().toString(),
        sourceUrl: videoUrl.trim(),
        addedDate: new Date().toISOString(),
      };

      const updatedRecipes = [...savedRecipes, recipe];
      setSavedRecipes(updatedRecipes);
      await saveToStorage("recipes", updatedRecipes);
      setVideoUrl("");

      Alert.alert("Success! ✨", `"${recipe.title}" has been added to your recipes`);
    } catch (error) {
      console.error("Extraction error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to extract recipe. Please try again.";
      Alert.alert("Extraction Failed", message);
    } finally {
      setIsExtracting(false);
    }
  }, [videoUrl, savedRecipes, saveToStorage]);

  const extractDisabled = !videoUrl.trim() || isExtracting;

  return (
    <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <BackgroundPattern />
        <DiscoverPageHeader />

        <Animated.View
          entering={FadeInUp.duration(320).springify().damping(24).mass(0.7)}
        >
          <DiscoverInputCard
            videoUrl={videoUrl}
            onVideoUrlChange={setVideoUrl}
            isExtracting={isExtracting}
            onExtract={extractRecipe}
            disabled={extractDisabled}
          />
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(320).springify().damping(24).mass(0.7).delay(80)}
        >
          <DiscoverTipCard title="✨ How it works" items={HOW_IT_WORKS} />
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(320).springify().damping(24).mass(0.7).delay(160)}
        >
          <DiscoverTipCard title="🎯 Features" items={FEATURES} />
        </Animated.View>
    </ScrollView>
  );
}
