import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    Image,
    StatusBar,
    Button
} from 'react-native';
import { handleLogout } from '../index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {router} from "expo-router";

const Profile: React.FC = () => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const storedUserName = await AsyncStorage.getItem('userEmail');
                console.log('Stored email:', storedUserName);
                if (storedUserName) {
                    const name = storedUserName.split('@')[0];
                    setUsername(name);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchUserName();
    }, []);

    const navigateToHistory = () => {
        router.push("(ProfileScreenPanel)/OrderHistory");
    }

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="black" translucent={true} />
            <ImageBackground
                source={require('@assets/images/TMBackground.png')} // Replace with your background image
                style={styles.backgroundImage}
            >
                <SafeAreaView style={styles.safeArea}>
                    <Image source={require('@assets/images/TMPageLogo.png')} style={styles.tmlogo} />

                    <View style={styles.transparentContainer}>
                        <View style={styles.header}>
                            <Image
                                source={require('@assets/images/Ellipse5.png')} // Replace with your logo image
                                style={styles.logo}
                            />
                            <View style={styles.greetingContainer}>
                                <Text style={styles.greeting}>Hello,</Text>
                                <Text style={styles.username}>{username || 'user'}</Text>
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
                            <Text style={styles.menuText}>Recycle Now</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuButton} onPress={() => navigateToHistory()}>
                            <Image
                                source={require('@assets/images/retro-game.png')} // Replace with your icon
                                style={styles.icon}
                            />
                            <Text style={styles.menuText}>Order History</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuButton}>
                            <Image
                                source={require('@assets/images/videogame.png')} // Replace with your icon
                                style={styles.icon}
                            />
                            <Button title="Logout" onPress={handleLogout} />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </ImageBackground>
        </>
    );
};

export default Profile;

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
        position: 'relative',
        bottom: '25%'
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
        right: '12%'
    }
});
