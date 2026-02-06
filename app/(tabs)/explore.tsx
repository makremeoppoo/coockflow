import PaywallModal from "@/components/PaywallModal";
import { COLORS } from "@/constants";
import { usePremium } from "@/context/PremiumContext";
import { useScrollToHideTabBar, useTabBarVisibility } from "@/context/TabBarVisibilityContext";
import { appwriteConfig } from "@/lib/appwrite";
import { canExtractFree, FREE_LIMIT, incrementFreeExtractions } from "@/lib/freeLimit";
import {
  extractRecipeWithGemini,
  getVideoContent,
} from "@/lib/recipeFromVideo";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import BackgroundPattern from "../../components/BackgroundPattern";
import {
  DiscoverInputCard,
  DiscoverPageHeader,
  DiscoverTipCard,
} from "../../components/discover";
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
  const { onScroll } = useScrollToHideTabBar();
  const { setVisible } = useTabBarVisibility();
  const { isPro } = usePremium();
  const [showPaywall, setShowPaywall] = useState(false);
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
      setVisible(true);
      loadRecipes();
    }, [loadRecipes, setVisible])
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

    const { allowed } = await canExtractFree(isPro);
    if (!allowed) {
      setShowPaywall(true);
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

      if (!isPro) await incrementFreeExtractions();

      Alert.alert("Success! ✨", `"${recipe.title}" has been added to your recipes`);
    } catch (error) {
      console.error("Extraction error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to extract recipe. Please try again.";
      Alert.alert("Extraction Failed", message);
    } finally {
      setIsExtracting(false);
    }
  }, [videoUrl, savedRecipes, saveToStorage, isPro]);

  const extractDisabled = !videoUrl.trim() || isExtracting;

  return (
    <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <BackgroundPattern />
        <DiscoverPageHeader />

        {!isPro && (
          <TouchableOpacity
            onPress={() => setShowPaywall(true)}
            style={styles.exploreUnlockCta}
            activeOpacity={0.8}
          >
            <Ionicons name="sparkles" size={18} color={COLORS.orange} />
            <Text style={styles.exploreUnlockCtaText}>
            Unlock unlimited extractions → {FREE_LIMIT} free extractions remaining
          </Text>
          </TouchableOpacity>
        )}

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

        <PaywallModal visible={showPaywall} onClose={() => setShowPaywall(false)} />
    </ScrollView>
  );
}
