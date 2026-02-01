import { images } from "@/constants";
import { TabBarIconProps } from "@/type";
import cn from "clsx";
import { Tabs } from "expo-router";
import { Image, Text, View } from "react-native";

const TabBarIcon = ({ focused, icon, title }: TabBarIconProps) => (
    <View className="tab-icon">
        <Image source={icon} className="size-7" resizeMode="contain" tintColor={focused ? '#276266' : '#5D5F6D'} />
        <Text className={cn('text-sm font-bold', focused ? 'text-primary':'text-gray-200')}>
            {title}
        </Text>
    </View>
)

export default function TabLayout() {
    return (
        <Tabs 
        screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    borderTopLeftRadius: 50,
                    borderTopRightRadius: 50,
                    borderBottomLeftRadius: 50,
                    borderBottomRightRadius: 50,
                    marginHorizontal: 20,
                    height: 80,
                    position: 'absolute',
                    bottom: 40,
                    backgroundColor: 'white',
                    shadowColor: '#1a1a1a',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 5
                }
            }}>
            <Tabs.Screen
                name='index'
                options={{
                    title: 'My Recipes',
                    tabBarIcon: ({ focused }) => <TabBarIcon title="My Recipes" icon={images.home} focused={focused} />
                }}
            />
            <Tabs.Screen
                name='search'
                options={{
                    title: 'Search',
                    tabBarIcon: ({ focused }) => <TabBarIcon title="Grocery List" icon={images.bag} focused={focused} />
                }}
            />
            <Tabs.Screen
                name='explore'
                options={{
                    title: 'Discovry',
                    tabBarIcon: ({ focused }) => <TabBarIcon title="Discovry" icon={images.star} focused={focused} />
                }}
            />
       

        </Tabs>
    );
}
