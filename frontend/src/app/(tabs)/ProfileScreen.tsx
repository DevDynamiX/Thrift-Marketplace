import React from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    Image,
    StatusBar,
} from 'react-native';
import { router } from "expo-router";
import { handleLogout } from '../index';

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
                    onPress(); // Call the onPress if provided (for logout)
                } else if (path && navigateTo) {
                    navigateTo(path); // Call navigateTo if path is provided
                }
            }}
            style={styles.menuButton}
        >
            <Image source={iconSource} style={styles.icon} />
            <Text style={styles.menuText}>{text}</Text>
        </TouchableOpacity>
    );
}

export default function Menu() {

    const navigateTo = (path: string) => {
        router.push(path);
    };

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="black" translucent={true}/>
            <ImageBackground
                source={require('@assets/images/TMBackground.png')}
                style={styles.backgroundImage}
            >
                <SafeAreaView style={styles.safeArea}>
                    <Image source={require('@assets/images/TMPageLogo.png')} style={styles.tmlogo}/>
                    <View style={styles.transparentContainer}>
                        <View style={styles.header}>
                            <Image
                                source={require('@assets/images/Ellipse5.png')}
                                style={styles.logo}
                            />
                            <View style={styles.greetingContainer}>
                                <Text style={styles.greeting}>Hello,</Text>
                                <Text style={styles.username}>User</Text>
                            </View>
                        </View>

                        <View style={styles.greenLine}></View>

                        {/* Menu Buttons */}
                        <MenuButton
                            text="Your Details"
                            iconSource={require('@assets/images/gamer.png')}
                            path="/YourDetails"
                            navigateTo={navigateTo}
                        />
                        <MenuButton
                            text="Your Favorites"
                            iconSource={require('@assets/images/heart.png')}
                            path="/Favorites"
                            navigateTo={navigateTo}
                        />
                        <MenuButton
                            text="Recycle Now"
                            iconSource={require('@assets/images/received.png')}
                            path="/RecycleNow"
                            navigateTo={navigateTo}
                        />
                        <MenuButton
                            text="Order History"
                            iconSource={require('@assets/images/retro-game.png')}
                            path="/OrderHistory"
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

                        <MenuButton
                            text="Terms and Conditions"
                            iconSource={require('@assets/images/logo.png')}
                            path="../webview/TermsOfService"
                            navigateTo={navigateTo}
                        />


                        <MenuButton
                            text="Contact Us"
                            iconSource={require('@assets/images/adaptive-icon.png')}
                            path="../webview/ContactUs"
                            navigateTo={navigateTo}
                        />

                    </View>
                </SafeAreaView>
            </ImageBackground>
        </>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        width: '100%',
        height: '100%',
    },
    safeArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10,
    },
    logo: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    greetingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    greeting: {
        fontSize: 24,
        color: '#000',
        marginRight: 5,
    },
    username: {
        fontSize: 24,
        color: 'rgb(92,183,165)',
        fontWeight: 'bold',
    },
    greenLine: {
        height: 2,
        width: '100%',
        backgroundColor: 'rgb(92,183,165)',
        marginBottom: 20,
    },
    transparentContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        alignItems: 'center',
        position: "relative",
        bottom: '25%',
    },
    menuButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgb(92,183,165)',
        paddingVertical: 15,
        borderRadius: 5,
        marginBottom: 15,
        justifyContent: 'center',
        width: '100%',
    },
    menuText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginLeft: 10,
    },
    icon: {
        width: 24,
        height: 24,
        position: 'absolute',
        left: 15,
    },
    tmlogo: {
        resizeMode: 'contain',
        width: '65%',
        position: 'relative',
        bottom: '6%',
        right: '12%',
    },
});
