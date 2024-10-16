import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Easing, StatusBar, Pressable } from 'react-native';
import { router } from "expo-router";

function SplashScreen() {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const circle1Anim = useRef(new Animated.Value(0)).current;
    const circle2Anim = useRef(new Animated.Value(0)).current;
    const circle3Anim = useRef(new Animated.Value(0)).current;
    const circle4Anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {

        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.1,
                    duration: 3000,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 3000,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }),
            ])
        ).start();


        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 10000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        // Animate circles for a dynamic background
        Animated.loop(
            Animated.sequence([
                Animated.timing(circle1Anim, {
                    toValue: 1,
                    duration: 6000,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }),
                Animated.timing(circle1Anim, {
                    toValue: 0,
                    duration: 6000,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(circle2Anim, {
                    toValue: 1,
                    duration: 8000,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }),
                Animated.timing(circle2Anim, {
                    toValue: 0,
                    duration: 8000,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(circle3Anim, {
                    toValue: 1,
                    duration: 10000,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }),
                Animated.timing(circle3Anim, {
                    toValue: 0,
                    duration: 10000,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }),
            ])
        ).start();


        Animated.loop(
            Animated.sequence([
                Animated.timing(circle4Anim, {
                    toValue: 1,
                    duration: 10000,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }),
                Animated.timing(circle4Anim, {
                    toValue: 0,
                    duration: 10000,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }),
            ])
        ).start();



    }, [scaleAnim, rotateAnim, circle1Anim, circle2Anim, circle3Anim]);


    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });


    const circle1Translate = circle1Anim.interpolate({
        inputRange: [0, 1],
        outputRange: [-50, 50],
    });
    const circle2Translate = circle2Anim.interpolate({
        inputRange: [0, 1],
        outputRange: [50, -50],
    });
    const circle3Translate = circle3Anim.interpolate({
        inputRange: [0, 1],
        outputRange: [-30, 30],
    });

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="black" barStyle="light-content" />

            {}
            <Animated.View style={[styles.circle, styles.circle1, { transform: [{ translateY: circle1Translate }] }]} />
            <Animated.View style={[styles.circle, styles.circle2, { transform: [{ translateY: circle2Translate }] }]} />
            <Animated.View style={[styles.circle, styles.circle3, { transform: [{ translateY: circle3Translate }] }]} />
            <Animated.View style={[styles.circle, styles.circle4, { transform: [{ translateY: circle3Translate }] }]} />

            {}
            <Animated.Image
                source={require('@assets/images/logo.png')}
                style={[styles.logo, { transform: [{ scale: scaleAnim }, { rotate: spin }] }]}
            />

            {}
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
        overflow: 'hidden',
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 30,
    },
    whiteContainer: {
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 30,
        borderRadius: 20,
        alignItems: 'center',
        width: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
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
    circle: {
        position: 'absolute',
        borderRadius: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    circle1: {
        width: 200,
        height: 200,
        top: 50,
        left: -100,
    },
    circle2: {
        width: 250,
        height: 250,
        bottom: 50,
        right: -150,
    },
    circle3: {
        width: 150,
        height: 150,
        bottom: 100,
        left: 0,
    },

    circle4: {
        width: 120,
        height: 120,
        top: 50,
        right: -60,
    },
});

export default SplashScreen;
