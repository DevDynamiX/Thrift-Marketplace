import React, {useEffect, useRef, useState} from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    Image,
    StatusBar,
    Pressable, Button, Animated, Alert, ScrollView
} from 'react-native';
import {handleLogout} from '../index';
import Constants from "expo-constants";
import { router, useRouter} from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the types for props in MenuButton
type MenuButtonProps = {
    text: string;
    iconSource: any;
    path?: string;
    navigateTo?: (path: string) => void;
    onPress?: () => void; // Mark as optional because not all buttons need it
}

const MenuButton = ({ text, iconSource, path, navigateTo, onPress }: MenuButtonProps) => {
    return (
        <TouchableOpacity
            onPress={() => {
                if (onPress) {
                    onPress();
                } else if (path && navigateTo) {
                    navigateTo(path);
                }
            }}
            style={styles.menuButton}
        >
            <Image source={iconSource} style={styles.icon} />
            <Text style={styles.menuText}>{text}</Text>
        </TouchableOpacity>
    );
}
//
const Profile: React.FC = () => {

    const [username, setUsername] = useState('');
    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const userDataString = await AsyncStorage.getItem('userData');
                console.log('Stored email:', userDataString);

                if (userDataString) {
                    const userData = JSON.parse(userDataString);
                    console.log('Email from userData:', userData.email);
                    setUsername(userData.firstName);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchUserName();
    }, []);

    const router = useRouter();
    const [selectedItem, setSelectedItem] = useState(null);
    const [isItemModalVisible, setIsItemModalVisible] = useState(false);

    const toggleItemModal = () => {
        setIsItemModalVisible(!isItemModalVisible);
    };

    const buttonScale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(buttonScale, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(buttonScale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    const navigateTo = (path: string) => {
        router.push(path);
    };

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="black" translucent={true}/>
            <ImageBackground
                source={require('@assets/images/TMBackground.png')} // Replace with your background image
                style={styles.backgroundImage}
            >

                <SafeAreaView style={styles.safeArea}>
                    <Image source={require('@assets/images/TMPageLogo.png')} style={styles.tmlogo}/>
                    <ScrollView contentContainerStyle={styles.menuItemsScroll}>
                        <View style={styles.transparentContainer}>
                            <View style={styles.header}>
                                <Image
                                    source={require('@assets/images/Ellipse5.png')}
                                    style={styles.logo}
                                />
                                <View style={styles.greetingContainer}>
                                    <Text style={styles.greeting}>Hello,</Text>
                                    <Text style={styles.username}>{username || 'user'}</Text>
                                </View>
                            </View>

                            <View style={styles.greenLine}></View>

                            {/* Menu Buttons */}
                            <MenuButton
                                text="Your Details"
                                iconSource={require('@assets/images/gamer.png')}
                                path="/pages/userdetails"
                                navigateTo={navigateTo}
                            />
                            <MenuButton
                                text="Your Favorites"
                                iconSource={require('@assets/images/heart.png')}
                                path="/pages/YourFavourites"
                                navigateTo={navigateTo}
                            />
                            <MenuButton
                                text="Recycle Now"
                                iconSource={require('@assets/images/received.png')}
                                path="/pages/Recycling"
                                navigateTo={navigateTo}
                            />
                            <MenuButton
                                text="Order History"
                                iconSource={require('@assets/images/retro-game.png')}
                                path="/pages/OrderHistory"
                                navigateTo={navigateTo}
                            />
                            {/* Logout button */}
                            <MenuButton
                                text="Logout"
                                iconSource={require('@assets/images/videogame.png')}
                                onPress={() => {
                                    console.log("Logging out");
                                    handleLogout();
                                }}
                            />

                            <View style={styles.greenSeparator}></View>

                            <MenuButton
                                text="Terms and Conditions"
                                iconSource={require('@assets/images/logo.png')}
                                path="../webview/TermsOfService"
                                navigateTo={navigateTo}
                            />

                            <MenuButton
                                text="Support"
                                iconSource={require('@assets/images/IMG_3695.jpg')}
                                path="../webview/ContactUs"
                                navigateTo={navigateTo}
                            />
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </ImageBackground>
        </>
    );
};

export default Profile;

const styles = StyleSheet.create({
    backgroundImage: {
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: -1,
        resizeMode: 'cover',
    },
    safeArea: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        bottom: '24%',
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 50,
        height: 50,
        marginRight: 10,
        borderRadius: 25,
        marginBottom: 8
    },
    menuItemsScroll: {
        width: '95%',
        flexDirection: 'row',
        position: "relative",
    },
    greetingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    greeting: {
        fontFamily: 'sulphurPoint',
        fontSize: 24,
        color: '#000',
        marginRight: 5,
    },
    username: {
        fontFamily: 'shrikhand',
        fontSize: 24,
        color: 'rgb(92,183,165)',
        fontWeight: 'bold',
    },
    greenLine: {
        height: 3,
        width: '100%',
        backgroundColor: 'rgb(92,183,165)',
        marginBottom: 20,
        borderRadius: 2,
    },
    greenSeparator: {
        height: 2,
        width: '70%',
        backgroundColor: 'rgb(92,183,165)',
        marginTop: 5,
        marginBottom: 15,
        borderRadius: 2,
    },
    transparentContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 15,
        padding: 15,
        width: '95%',
        height: '100%',
        alignItems: 'center',
        position: "relative",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        borderColor: 'rgb(92,183,165)',
    },
    menuButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgb(92,183,165)',
        paddingVertical: 10,
        borderRadius: 30,
        marginBottom: 15,
        justifyContent: 'center',
        width: '90%',
        elevation: 5, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },//
    menuText: {
        fontFamily: 'sulphurPoint',
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginLeft: 10,
    },
    buttonText: {
        fontFamily: 'sulphurPoint',
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginLeft: 10,
    },
    icon: {
        width: 24,
        height: 24,
        marginLeft: 15,
    },
    tmlogo: {
        resizeMode: 'contain',
        width: '65%',
        position: 'relative',
        top: '14%',
        right: '12%',

    },
});
