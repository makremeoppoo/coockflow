import { COLORS, images } from "@/constants";
import { TabBarIconProps } from "@/type";
import { Tabs } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  Platform,
  Text,
  View,
} from "react-native";
import styles from "../styles";

const TabBarIcon = ({ focused, icon, title }: TabBarIconProps) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.05 : 1,
      useNativeDriver: true,
      damping: 18,
      mass: 0.6,
    }).start();
  }, [focused]);

  return (
    <View style={styles.navItem}>
      <Animated.View
        style={[
          styles.navIconWrap,
          focused && styles.navIconWrapActive,
          { transform: [{ scale }] },
        ]}
      >
        <Image
          source={icon}
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
          tintColor={focused ? COLORS.orange : COLORS.textMuted}
        />
      </Animated.View>
      <Text
        style={[styles.navLabel, focused && styles.navLabelActive]}
        numberOfLines={1}
      >
        {title}
      </Text>
    </View>
  );
};

const tabBarStyle = {
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  marginHorizontal: 20,
  height: 72,
  position: "absolute" as const,
  bottom: 28,
  backgroundColor: COLORS.card,
  borderTopWidth: 1,
  borderTopColor: COLORS.border,
  shadowColor: COLORS.text,
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 8,
  paddingBottom: Platform.OS === "ios" ? 20 : 12,
  paddingTop: 8,
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle,
        tabBarActiveTintColor: COLORS.orange,
        tabBarInactiveTintColor: COLORS.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "My Recipes",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="My Recipes" icon={images.home} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Grocery List",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="Grocery List" icon={images.bag} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Discover",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="Discover" icon={images.star} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
