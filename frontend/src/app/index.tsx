import React, {useEffect, useRef} from "react";
import {StyleSheet, View, Text, Pressable, Animated} from "react-native";
import {router} from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import {checkUserSession, clearUserSession} from "@/app/auth/LoginScreen";
import {Firebase_Auth} from "@/firebaseConfig";

export const handleLogout = async () => {
    await Firebase_Auth.signOut();
    await clearUserSession();
    router.replace("auth/LoginScreen");

}

const logoutButton = ()=>{
    return(
        <Pressable
            onPress={handleLogout}
            style={styles.button}
        ><Text>Logout</Text></Pressable>
    );
};

const App = () => {
    useEffect(() => {
        const checkSession = async ()=>{
            const {isLoggedIn} = await checkUserSession();
            if(isLoggedIn){
                router.replace("(tabs)/HomeScreen");
            }
        };
        checkSession();
    }, []);

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


                {/* Anonymous Lading Button */}
                <Pressable
                    style={styles.button}
                    onPress={() =>
                        router.push({
                            pathname: "welcome/WelcomeScreen"
                        })
                    }
                >
                    <Icon name="happy-outline" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Anonymous Landing</Text>
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

                {/* All the new stuff i added  */}

                {/* Admin */}
                <Pressable
                    style={styles.button}
                    onPress={() =>
                        router.push({
                            pathname: "Admin/Adminpanel"
                        })
                    }
                >
                    <Icon name="hammer-outline" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Admin</Text>
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