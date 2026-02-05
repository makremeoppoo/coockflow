/** @format */

import { COLORS, images } from "@/constants";
import {
  TabBarVisibilityProvider,
  useTabBarVisibility,
} from "@/context/TabBarVisibilityContext";
import { TabBarIconProps } from "@/type";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BottomTabBar } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "../styles";

const FAB_SIZE = 56;
const FAB_BOTTOM = 28;
const FAB_RIGHT = 20;

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
        ]}>
        <Image
          source={icon}
          style={{ width: 24, height: 24 }}
          resizeMode='contain'
          tintColor={focused ? COLORS.orange : COLORS.textMuted}
        />
      </Animated.View>
      <Text
        style={[styles.navLabel, focused && styles.navLabelActive]}
        numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
};

const TAB_BAR_BOTTOM = 36;

const tabBarStyle = {
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  borderBottomLeftRadius: 24,
  borderBottomRightRadius: 24,
  marginHorizontal: 20,
  marginBottom: 12,
  height: 72,
  position: "absolute" as const,
  bottom: TAB_BAR_BOTTOM,
  backgroundColor: "rgba(255, 255, 255, 0.6)",
  borderTopWidth: 1,
  borderColor: "rgba(236, 236, 236, 0.6)",
  shadowColor: COLORS.text,
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 8,
  paddingBottom: Platform.OS === "ios" ? 20 : 12,
  paddingTop: 8,
};

const TAB_BAR_HEIGHT = 72 + TAB_BAR_BOTTOM;

function TabLayoutContent() {
  const { visible, setVisible } = useTabBarVisibility();
  const translateY = useRef(new Animated.Value(0)).current;
  const fabOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : TAB_BAR_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible, translateY]);

  useEffect(() => {
    Animated.timing(fabOpacity, {
      toValue: visible ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [visible, fabOpacity]);

  const tabBar = (props: BottomTabBarProps) => (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: TAB_BAR_HEIGHT + 20,
      }}
      pointerEvents='box-none'>
      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          transform: [{ translateY }],
        }}
        pointerEvents={visible ? "auto" : "none"}>
        <BottomTabBar {...props} />
      </Animated.View>
      <Animated.View
        style={{
          position: "absolute",
          right: FAB_RIGHT,
          bottom: FAB_BOTTOM,
          opacity: fabOpacity,
        }}
        pointerEvents={visible ? "none" : "auto"}>
        <TouchableOpacity
          onPress={() => setVisible(true)}
          activeOpacity={0.85}
          style={{
            width: FAB_SIZE,
            height: FAB_SIZE,
            borderRadius: FAB_SIZE / 2,
            backgroundColor: COLORS.orange,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 8,
          }}>
          <Ionicons name='menu' size={28} color='#fff' />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle,
        tabBarActiveTintColor: COLORS.orange,
        tabBarInactiveTintColor: COLORS.textMuted,
      }}
      tabBar={tabBar}>
      <Tabs.Screen
        name='index'
        options={{
          title: "My Recipes",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              title='My Recipes'
              icon={images.home}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='search'
        options={{
          title: "Grocery List",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              title='Grocery List'
              icon={images.bag}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='explore'
        options={{
          title: "Discover",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title='Discover' icon={images.star} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  return (
    <TabBarVisibilityProvider>
      <TabLayoutContent />
    </TabBarVisibilityProvider>
  );
}
