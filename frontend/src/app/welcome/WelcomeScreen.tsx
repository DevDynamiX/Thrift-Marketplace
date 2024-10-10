import React from 'react';
import {StyleSheet, View, Text, Image, StatusBar, Pressable} from 'react-native';
import {router} from "expo-router";

function SplashScreen() {
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="black" barStyle="light-content"/>
            <Image
                source={require('@assets/images/logo.png')} // Replace with your splash logo image
                style={styles.logo}
            />

            {/* White Container with rounded edges */}
            <View style={styles.whiteContainer}>
                <Text style={styles.title}>Welcome to Thrift Market</Text>
                <Text style={styles.subtitle}>
                    Get started by signing up or logging in to explore great deals!
                </Text>

                <Pressable
                    onPress={() =>
                        router.replace({
                            pathname: "/auth/LoginScreen",
                        })
                    }
                    style={styles.getStartedButton}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#5CB7A5',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60, // Add top and bottom padding
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 30,
    },
    whiteContainer: {
        backgroundColor: '#fff', // White background
        paddingVertical: 20,
        paddingHorizontal: 30,
        borderRadius: 20, // Rounded edges
        alignItems: 'center', // Center the text and button
        width: '80%', // Adjust the width as needed
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // For shadow on Android
    },
    title: {
        fontSize: 28,
        color: '#ec5707',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#929292',
        textAlign: 'center',
        marginBottom: 20,
    },
    getStartedButton: {
        backgroundColor: '#ec5707',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default SplashScreen;

