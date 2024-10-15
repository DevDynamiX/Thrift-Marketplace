import React, {useRef} from "react";
import {StyleSheet, View, Text, Pressable, Animated} from "react-native";
import {router} from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";

const App = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    return (
        <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
            <View style={styles.main}>
                {/* Main App Button */}
                <Pressable
                    style={styles.button}
                    onPress={() =>
                        router.push({
                            pathname: "/(tabs)/HomeScreen",
                        })
                    }
                >
                    <Icon name="home-outline" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Main App (Alpha build)</Text>
                </Pressable>

                {/* Auth Button */}
                <Pressable
                    style={styles.button}
                    onPress={() =>
                        router.push({
                            pathname: "/auth/LoginScreen"
                        })
                    }
                >
                    <Icon name="log-in-outline" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Authentication Screens</Text>
                </Pressable>

                {/* Welcome Button */}
                <Pressable
                    style={styles.button}
                    onPress={() =>
                        router.push({
                            pathname: "welcome/WelcomeScreen"
                        })
                    }
                >
                    <Icon name="happy-outline" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Welcome Screen</Text>
                </Pressable>

                {/* Test Environment Button */}
                <Pressable
                    style={styles.button}
                    onPress={() =>
                        router.push({
                            pathname: "TestScreen"
                        })
                    }
                >
                    <Icon name="hammer-outline" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Test Environment</Text>
                </Pressable>
            </View>
        </Animated.View>
    );
};

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        backgroundColor: "#000000",
    },
    main: {
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 38,
        fontWeight: "bold",
        color: "#1d3557",
        marginBottom: 24,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#457b9d",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    buttonText: {
        fontSize: 18,
        color: "#fff",
        marginLeft: 10,
    },
});