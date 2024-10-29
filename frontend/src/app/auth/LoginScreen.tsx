import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, Image, Text, TouchableOpacity, TextInput, ScrollView, ImageBackground, Pressable, Alert } from 'react-native';
import { router } from "expo-router";
import Constants from 'expo-constants';
import { Firebase_Auth } from "@/firebaseConfig";
import { signInWithEmailAndPassword } from "@firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {

    const [email, setEmail] = useState('');
    const username = email;
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    // const auth = Firebase_Auth;

    const storeUserSession = async(userToken:string):Promise<void> =>{
        try{
            await AsyncStorage.setItem('userToken', userToken);
            await AsyncStorage.setItem('userEmail', email);
            await AsyncStorage.setItem('lastLoginTime',new Date().toISOString() );
        }
        catch(error){
            console.log(error);
        }
    }

    const signIn = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter both email and password");
            return;
        }

        setLoading(true);

        try {
            // const response = await signInWithEmailAndPassword(auth, email, password);
            // console.log(response);
            // Alert.alert("Success", "Logged in successfully");

            // Fetch user role from the backend
            const response = await fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                Alert.alert("Error", errorData.message || "Failed to log in");
                return;
            }

            const data = await response.json(); // Get user details and role
            console.log("User data:", data); // Check if you receive the correct data

            // Navigate based on user role
            switch (data.role) {
                case 'Admin':
                    router.replace("Admin/Adminpanel"); // Replace with your admin panel route
                    break;
                default:
                    router.replace("(tabs)/HomeScreen"); // Replace with your user home screen route
                    break;
            }
        } catch (error) {
            console.error("Login error:", error);
            Alert.alert("Error", "An error occurred while logging in");
            // const token = await Response.user.getIdToken();
            // await storeUserSession(token);

            router.replace("(tabs)/HomeScreen");
        } finally {
            setLoading(false);
        }
    }

    const navigateToSIgnUp = () => {
        router.push("auth/RegisterScreen");
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
            <ImageBackground
                source={require('@assets/images/funky_background.png')}
                style={styles.backgroundImage}
            >
                <View style={styles.container}>
                    <ScrollView>
                        <View style={styles.header}>
                            <Image
                                resizeMode="contain"
                                style={styles.headerImg}
                                source={require('@assets/images/logo.png')}
                            />
                            <Text>API: {Constants.expoConfig?.extra?.BACKEND_HOST}</Text>
                            <Text style={[styles.title, { color: '#ec5707' }]}>Thrift Market</Text>
                            <Text style={styles.title}>
                                Login
                            </Text>
                        </View>
                        <View style={styles.form}>
                            <View style={styles.input}>
                                <Text style={styles.inputLabel}>Email address</Text>
                                <TextInput
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    clearButtonMode="while-editing"
                                    keyboardType="email-address"
                                    onChangeText={(text) => setEmail(text)}
                                    placeholder="john@example.com"
                                    placeholderTextColor="#6b7280"
                                    style={styles.inputControl}
                                    value={email}
                                />
                            </View>
                            <View style={styles.input}>
                                <Text style={styles.inputLabel}>Password</Text>
                                <TextInput
                                    autoCorrect={false}
                                    clearButtonMode="while-editing"
                                    onChangeText={(text) => setPassword(text)}
                                    placeholder="********"
                                    placeholderTextColor="#6b7280"
                                    style={styles.inputControl}
                                    secureTextEntry={true}
                                    value={password}
                                />
                            </View>
                            <View style={styles.formAction}>
                                <TouchableOpacity onPress={signIn}>
                                    <View style={styles.btn}>
                                        <Text style={styles.btnText}>Sign in</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <Pressable
                                onPress={() =>
                                    router.push({
                                        pathname: "/auth/PasswordRecoveryScreen"
                                    })
                                }
                                style={{marginTop: 'auto'}}
                            >
                                <Text style={styles.formLink}>Forgot password?</Text>
                            </Pressable>
                        </View>
                    </ScrollView>


                    <Pressable onPress={navigateToSIgnUp}>
                        <Text style={styles.formFooter}>
                            Don't have an account?{' '}
                            <Text style={{textDecorationLine: 'underline'}}>Sign up</Text>
                        </Text>
                    </Pressable>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );

}

export const checkUserSession = async () => {
    try {
        const userToken = await AsyncStorage.getItem('userToken');
        const userEmail = await AsyncStorage.getItem('userEmail');

        return {
            isLoggedIn: !!userToken,
            userToken,
            userEmail
        };
    }catch(error) {
        console.log(error);
        return {
            isLoggedIn: false,
            userToken: null,
            userEmail: null
        };
    }
};

export const clearUserSession = async () => {
    try {
        await AsyncStorage.multiRemove(['userToken', 'userEmail', 'lastLoginTime']);
    }catch(error) {
        console.log(error);
    }
}

export default Login;

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        height: '120%',
    },
    container: {
        paddingVertical: 24,
        paddingHorizontal: 24,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 15,
        margin: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 31,
        fontWeight: '700',
        color: '#1D2A32',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 15,
        fontWeight: '500',
        color: '#929292',
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 36,
    },
    headerImg: {
        width: 80,
        height: 80,
        alignSelf: 'center',
        marginBottom: 36,
    },
    form: {
        marginBottom: 24,
        paddingHorizontal: 24,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    formAction: {
        marginTop: 4,
        marginBottom: 16,
    },
    formLink: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ec5707',
        textAlign: 'center',
    },
    formFooter: {
        fontSize: 15,
        fontWeight: '600',
        color: '#222',
        textAlign: 'center',
        letterSpacing: 0.15,
    },
    input: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 17,
        fontWeight: '600',
        color: '#222',
        marginBottom: 8,
    },
    inputControl: {
        height: 50,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 15,
        fontWeight: '500',
        color: '#222',
        borderWidth: 1,
        borderColor: '#C9D3DB',
        borderStyle: 'solid',
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        backgroundColor: '#ec5707',
        borderColor: '#ec5707',
    },
    googleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        backgroundColor: 'rgb(57,56,56)',
        borderColor: 'rgb(57,56,56)',
        marginTop: 10,
        marginBottom: 10
    },
    googleLogo: {
        width: 24,
        height: 24,
        marginRight: 8,
        opacity: 0.8,
    },
    btnText: {
        fontSize: 18,
        lineHeight: 26,
        fontWeight: '600',
        color: '#fff',
    },
});