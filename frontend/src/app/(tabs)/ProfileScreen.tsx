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
    Pressable
} from 'react-native';
import {router} from "expo-router";

export default function Menu() {
    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="plum" translucent={true}/>
            <ImageBackground
                source={require('@assets/images/TMBackground.png')} // Replace with your background image
                style={styles.backgroundImage}
            >
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.transparentContainer}>
                        <View style={styles.header}>
                            <Image
                                source={require('@assets/images/Ellipse5.png')} // Replace with your logo image
                                style={styles.logo}
                            />
                            <View style={styles.greetingContainer}>
                                <Text style={styles.greeting}>Hello,</Text>
                                <Text style={styles.username}>User</Text>
                            </View>
                        </View>

                        <View style={styles.greenLine}></View>

                        <TouchableOpacity style={styles.menuButton}>
                            <Image
                                source={require('@assets/images/gamer.png')} // Replace with your icon
                                style={styles.icon}
                            />
                            <Text style={styles.menuText}>Your Details</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuButton}>
                            <Image
                                source={require('@assets/images/heart.png')} // Replace with your icon
                                style={styles.icon}
                            />
                            <Text style={styles.menuText}>Your Favorites</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuButton}>
                            <Image
                                source={require('@assets/images/received.png')} // Replace with your icon
                                style={styles.icon}
                            />
                            <Text style={styles.menuText}>Order History</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuButton}>
                            <Image
                                source={require('@assets/images/retro-game.png')} // Replace with your icon
                                style={styles.icon}
                            />
                            <Text style={styles.menuText}>Address Book</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuButton}>
                            <Image
                                source={require('@assets/images/videogame.png')} // Replace with your icon
                                style={styles.icon}
                            />
                            <Text style={styles.menuText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </ImageBackground>
        </>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover', // Ensures the background image covers the screen
        width: '100%',
        height: '120%',
    },
    safeArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60, // Increased padding at the top and bottom
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10,
    },
    logo: {
        width: 50, // Adjust size as necessary
        height: 50,
        marginRight: 10, // Space between logo and text
    },
    greetingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    greeting: {
        fontSize: 24,
        color: '#000', // Darker text for the greeting
        marginRight: 5,
    },
    username: {
        fontSize: 24,
        color: 'rgb(92,183,165)', // Green text for the username
        fontWeight: 'bold',
    },
    greenLine: {
        height: 2,
        width: '100%',
        backgroundColor: 'rgb(92,183,165)', // Green line below header
        marginBottom: 20,
    },
    transparentContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // More transparent container
        borderRadius: 10,
        padding: 20,
        width: '90%',
        alignItems: 'center', // Center everything inside the container
    },
    menuButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgb(92,183,165)', // Button color
        paddingVertical: 15,
        borderRadius: 5, // Make buttons rectangular
        marginBottom: 15,
        justifyContent: 'center', // Center the text
        width: '100%',
    },
    menuText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginLeft: 10, // Space between icon and text
    },
    icon: {
        width: 24,
        height: 24,
        position: 'absolute',
        left: 15, // Position the icon on the left side
    },
});



