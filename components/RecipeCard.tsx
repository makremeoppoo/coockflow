import { COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "../app/styles";

function MetaItem({
  icon,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}) {
  return (
    <View style={styles.metaItem}>
      <Ionicons name={icon} size={12} color={COLORS.textMuted} />
      <Text style={styles.metaText}>{text}</Text>
    </View>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{label}</Text>
    </View>
  );
}

function formatIngredient(ing: string | { amount?: string; item?: string }): string {
  if (typeof ing === "string") return ing;
  return [ing.amount, ing.item].filter(Boolean).join(" ").trim() || "";
}

const SOURCE_PLATFORMS: Record<
  string,
  { icon: keyof typeof Ionicons.glyphMap; label: string; color: string; bg: string }
> = {
  youtube: { icon: "logo-youtube", label: "YouTube", color: "#E62117", bg: "#FFEBEE" },
  facebook: { icon: "logo-facebook", label: "Facebook", color: "#1877F2", bg: "#E8F0FE" },
  tiktok: { icon: "logo-tiktok", label: "TikTok", color: "#00F2EA", bg: "#E0F7FA" },
  instagram: { icon: "logo-instagram", label: "Instagram", color: "#E4405F", bg: "#FCE4EC" },
  default: { icon: "open-outline", label: "View Video", color: COLORS.orange, bg: COLORS.orangeLight },
};

function getSourcePlatform(
  url: string
): { icon: keyof typeof Ionicons.glyphMap; label: string; color: string; bg: string } {
  const lower = url.toLowerCase();
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) return SOURCE_PLATFORMS.youtube;
  if (lower.includes("tiktok.com")) return SOURCE_PLATFORMS.tiktok;
  if (lower.includes("facebook.com") || lower.includes("fb.watch") || lower.includes("fb.com")) return SOURCE_PLATFORMS.facebook;
  if (lower.includes("instagram.com")) return SOURCE_PLATFORMS.instagram;
  return SOURCE_PLATFORMS.default;
}

const RecipeCard = ({
  recipe,
  alreadyAdded,
  onDelete,
  addToGroceryList,
}: {
  recipe: any;
  alreadyAdded: boolean;
  onDelete: (id: string) => void;
  addToGroceryList: (recipe: any) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const expandAnim = useRef(new Animated.Value(0)).current;

  const springConfig = { damping: 22, mass: 0.6 };

  useEffect(() => {
    if (expanded) {
      Animated.parallel([
        Animated.spring(rotateAnim, {
          toValue: 1,
          useNativeDriver: true,
          ...springConfig,
        }),
        Animated.spring(expandAnim, {
          toValue: 1,
          useNativeDriver: false,
          ...springConfig,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(rotateAnim, {
          toValue: 0,
          useNativeDriver: true,
          ...springConfig,
        }),
        Animated.spring(expandAnim, {
          toValue: 0,
          useNativeDriver: false,
          ...springConfig,
        }),
      ]).start();
    }
  }, [expanded]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const ingredients = recipe.ingredients || [];
  const tags = recipe.tags || [];
  const estimatedIngredientsHeight = ingredients.length * 40;

  const ingredientsMaxHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, estimatedIngredientsHeight],
  });

  const ingredientsOpacity = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handleToggle = () => {
    setExpanded((e) => !e);
  };

  return (
    <View style={styles.card}>
      {/* Top Row: Emoji + Title + Delete */}
      <View style={styles.cardTopRow}>
        <View style={styles.cardEmojiWrap}>
          <Text style={styles.cardEmoji}>{recipe.emoji ?? "🍽️"}</Text>
        </View>
        <View style={styles.cardTitleBlock}>
          <Text style={styles.cardTitle} numberOfLines={expanded ? undefined : 2}>
            {recipe.title}
          </Text>
          <View style={styles.metaRow}>
            {recipe.servings != null && (
              <MetaItem icon="people-outline" text={`${recipe.servings} servings`} />
            )}
            {recipe.servings != null && (recipe.prepTime || recipe.cookTime) && (
              <View style={styles.metaDot} />
            )}
            {recipe.prepTime && (
              <MetaItem icon="time-outline" text={`Prep ${recipe.prepTime}`} />
            )}
            {recipe.prepTime && recipe.cookTime && <View style={styles.metaDot} />}
            {recipe.cookTime && (
              <MetaItem icon="flame-outline" text={`Cook ${recipe.cookTime}`} />
            )}
          </View>
        </View>
        <TouchableOpacity
          onPress={() => onDelete(recipe.id)}
          style={styles.deleteBtn}
          activeOpacity={0.5}
        >
          <Ionicons name="trash-outline" size={18} color={COLORS.red} />
        </TouchableOpacity>
      </View>

      {/* Tags */}
      {tags.length > 0 && (
        <View style={styles.tagRow}>
          {tags.map((tag: string, i: number) => (
            <Tag key={i} label={tag} />
          ))}
        </View>
      )}

      {/* Expand toggle */}
      <TouchableOpacity
        style={styles.expandToggle}
        onPress={handleToggle}
        activeOpacity={0.6}
      >
        <Text style={styles.expandText}>
          {expanded ? "Show less" : `Ingredients (${ingredients.length})`}
        </Text>
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <Ionicons name="chevron-down-outline" size={18} color={COLORS.orange} />
        </Animated.View>
      </TouchableOpacity>

      {/* Ingredients list — animated expand/collapse */}
      {ingredients.length > 0 && (
        <Animated.View
          style={{
            maxHeight: ingredientsMaxHeight,
            opacity: ingredientsOpacity,
            overflow: "hidden",
          }}
        >
          <View style={styles.ingredientsList}>
            {ingredients.map((ing: any, i: number) => (
              <View key={i} style={styles.ingredientRow}>
                <View style={styles.ingredientDot} />
                <Text style={styles.ingredientText}>{formatIngredient(ing)}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      )}

      {/* Actions */}
      <View style={styles.cardActions}>
        {!alreadyAdded && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => addToGroceryList(recipe)}
            activeOpacity={0.7}
          >
            <Ionicons name="cart-outline" size={16} color={COLORS.orange} />
            <Text style={styles.actionBtnText}>Add to Grocery</Text>
          </TouchableOpacity>
        )}

        {recipe.sourceUrl && (() => {
          const { icon, label, color, bg } = getSourcePlatform(recipe.sourceUrl);
          return (
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: bg }]}
              onPress={() => Linking.openURL(recipe.sourceUrl)}
              activeOpacity={0.7}
            >
              <Ionicons name={icon} size={16} color={color} />
              <Text style={[styles.actionBtnText, { color }]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })()}
      </View>
    </View>
  );
};

export default RecipeCard;
