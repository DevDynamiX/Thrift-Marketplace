import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';

const TabsLayout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#219281', // Active tab color
                tabBarInactiveTintColor: '#7E7E7E', // Inactive tab color
                tabBarStyle: {
                    backgroundColor: '#93D3AE', // Tab bar background color
                    borderTopColor: 'transparent',
                    elevation: 5,
                },
                headerShown: false, // Hide the header
            }}
        >
            <Tabs.Screen
                name="HomeScreen"
                options={{
                    headerTitle: "Home",
                    title: "Home",
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Ionicons name={focused ? 'home' : 'home-outline'} size={focused ? 30 : 24} color={focused ? '#219281' : '#7E7E7E'} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="SearchScreen"
                options={{
                    headerTitle: "Search",
                    title: "Search",
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Ionicons name={focused ? 'search' : 'search-outline'} size={focused ? 30 : 24} color={focused ? '#219281' : '#7E7E7E'} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="CartScreen"
                options={{
                    headerTitle: "Cart",
                    title: "Cart",
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Ionicons name={focused ? 'cart' : 'cart-outline'} size={focused ? 30 : 24} color={focused ? '#219281' : '#7E7E7E'} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="ProfileScreen"
                options={{
                    headerTitle: "Profile",
                    title: "Profile",
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Ionicons name={focused ? 'person' : 'person-outline'} size={focused ? 30 : 24} color={focused ? '#219281' : '#7E7E7E'} />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;