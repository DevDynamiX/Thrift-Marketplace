import React, { useReducer, useRef} from 'react';
import {StyleSheet, Text, View, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, useDerivedValue} from 'react-native-reanimated';
import Svg, {Path} from 'react-native-svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BottomTabBarProps, createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';
import Home from "../(tabs)/HomeScreen";
import Search from "../(tabs)/SearchScreen";
import Cart from "../(tabs)/CartScreen";
import Profile from "../(tabs)/ProfileScreen";
import Scaler from "./Scaler";

const Tab = createBottomTabNavigator();

const BottomTabs = () => {

    const {bottom} = useSafeAreaInsets();
    const [layout, dispatch] = useReducer((state: any[], action: any) => [...state, action], []);

    const handleLayout = (event: any, index: any) => {
        const {x} = event.nativeEvent.layout;
        dispatch({x, index});
    };

    const xOffset = useDerivedValue(() => {
        if (layout.length === 0) return 0;
        return layout[layout.length - 1]?.x - 25;
    }, [layout]);

    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{translateX: withTiming(xOffset.value, {duration: 250})}],
    }));

    const AnimatedTabBar = ({state, navigation, descriptors}: BottomTabBarProps) => {
        return (
            <View style={[styles.tabBar, {paddingBottom: bottom}]}>
                <Animated.View style={[styles.activeBackground, animatedStyles]}>
                    <Svg width={110} height={60} viewBox=" 0 0 110 60">
                        <Path
                            fill="#219281"
                            d="M20 0h70v25c0 19.33-15.67 35-35 35S20 44.33 20 25V0zM20 20V0H0c11.046 0 20 8.954 20 20zm90-20H90v20c0-11.046 8.954-20 20-20z"
                        />
                    </Svg>
                </Animated.View>
                <View style={styles.tabBarContainer}>
                    {state.routes.map((route, index) => {
                        const active = index === state.index;
                        const {options} = descriptors[route.key];

                        return (
                            <TabBarComponent
                                key={route.key}
                                active={active}
                                options={options}
                                onLayout={(e: any) => handleLayout(e, index)}
                                onPress={() => navigation.navigate(route.name)}
                            />
                        );
                    })}
                </View>
            </View>
        );
    };

    const TabBarComponent = ({active, options, onLayout, onPress}: {
        active: boolean,
        options: any,
        onLayout: (event: any) => void,
        onPress: () => void
    }) => {        //console.log(active);

        const ref = useRef(null);

        const animatedCircleStyles = useAnimatedStyle(() => ({
            transform: [
                {
                    scale: withTiming(active ? 1 : 0, {duration: 250}),
                },
            ],
        }), [active]);

        return (
            <Pressable onPress={onPress} onLayout={onLayout} style={styles.component}>
                <Animated.View style={[styles.componentCircle, animatedCircleStyles]}></Animated.View>
                <View style={styles.iconContainer}>
                    {options.tabBarIcon ? options.tabBarIcon({ref}) : <Text>?</Text>}
                </View>
            </Pressable>
        );
    };

    return (
        <Tab.Navigator
            initialRouteName='Home'
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName: "home" | "home-outline" | "search" | "search-outline" | "cart" | "cart-outline" | "person" | "person-outline" | undefined;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Search') {
                        iconName = focused ? 'search' : 'search-outline';
                    } else if (route.name === 'Cart') {
                        iconName = focused ? 'cart' : 'cart-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                        console.log(iconName);
                    } else if (route.name === 'Search') {
                        iconName = focused ? 'search' : 'search-outline';
                        console.log(iconName);
                    } else if (route.name === 'Cart') {
                        iconName = focused ? 'cart' : 'cart-outline';
                        console.log(iconName);
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                        console.log(iconName);
                    }

                    return (
                        <Scaler pose={focused ? 'active' : 'inactive'}>
                            <Ionicons name={iconName} size={24} color={focused ? '#219281' : '#219281'}/>
                        </Scaler>
                    );

                },
                tabBarActiveTintColor: '#219281',
                tabBarInactiveTintColor: '#219281',
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: '#93D3AE',
                    borderTopColor: 'transparent',
                    elevation: 5,
                },
                headerShown: false,
            })}

            tabBar={undefined}
            //tabBar = {props => <AnimatedTabBar {...props}/>}
        >
            <Tab.Screen name="Home" component={Home}/>
            <Tab.Screen name="Search" component={Search}/>
            <Tab.Screen name="Cart" component={Cart}/>
            <Tab.Screen name="Profile" component={Profile}/>
        </Tab.Navigator>

    );

};

const styles = StyleSheet.create({
    tabBar: {
        display: 'flex',
        backgroundColor: '#93D3AE',
    },
    activeBackground: {
        backgroundColor: '#93D3AE',
        position: 'absolute',
        bottom: 0,
        left: '0%',
        transform: [{translateX: -55}], // Center the background
    },
    tabBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingVertical: 3,
    },
    component: {
        height: 60,
        width: 60,
        marginTop: -5,
    },
    componentCircle: {
        flex: 1,
        position: "relative",
        bottom: 2,
        borderRadius: 30,
        backgroundColor: '#93D3AE',
    },
    iconContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default BottomTabs;