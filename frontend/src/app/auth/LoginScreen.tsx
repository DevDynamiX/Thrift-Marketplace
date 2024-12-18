import React, { useState } from 'react';
import { router } from "expo-router";
import { StyleSheet, SafeAreaView, View, Image, Text, TouchableOpacity, TextInput, ScrollView, ImageBackground, Pressable, Alert } from 'react-native';
import { Firebase_Auth } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const Login = () => {

    const [email, setEmail] = useState('');
    const username = email;
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = Firebase_Auth;

    const storeUserSession = async(userData: object): Promise<void> =>{
        try{
            await AsyncStorage.multiSet([
                ['userData', JSON.stringify(userData)],
                ['lastLoginTime', new Date().toISOString()]
            ]);
        }
        catch(error){
            console.log("Error storing user session:", error);
        }
    }

    const signIn = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter both email and password");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                Alert.alert("Error", errorData.message || "Failed to log in");
                return;
            }

            const data = await response.json();
            await storeUserSession(data);

            console.log("user_role",data.user_role);
            switch (data.user_role) {
                case 'Admin':
                    router.replace("Admin/Adminpanel");
                    break;
                case 'User':
                    router.replace("(tabs)/HomeScreen");
                    break;
                default:
                    Alert.alert("Error", "Invalid user role");
                    break;
            }
        } catch (error: any) {
            console.log(error);
            Alert.alert("Error", error.message);
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
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.header}>
                            <Image
                                resizeMode="contain"
                                style={styles.headerImg}
                                source={require('@assets/images/logo.png')}
                            />

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
                                    autoCapitalize="none"
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
        const userDataString = await AsyncStorage.getItem('userData');

        if (userDataString) {
            const userData = JSON.parse(userDataString);
            const userToken = userData.token;
            const userEmail = userData.email;
            const userName = userData.firstName;
            const userID = userData.id;

            console.log({
                "User Token": userToken,
                "User Email": userEmail,
                "User Name": userName,
                "User ID": userID
            });

            return {
                isLoggedIn: !!userToken,
                userToken,
                userEmail,
                userName,
                userID
            };
        }

    }catch(error) {
        console.log(error);
        return {
            isLoggedIn: false,
            userToken: null,
            userEmail: null,
            userName: null,
            userID: null
        };
    }
};

export const clearUserSession = async () => {
    try {
        await AsyncStorage.multiRemove(['userToken', 'userEmail', 'lastLoginTime', 'userName', 'userID']);
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
        fontFamily: 'shrikhand',
        fontSize: 31,
        color: '#1D2A32',
        marginBottom: 6,
    },
    subtitle: {
        fontFamily: 'sulphurPoint',
        fontSize: 15,
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
        fontFamily: 'sulphurPoint',
        fontSize: 18,
        fontWeight: '600',
        color: '#ec5707',
        textAlign: 'center',
    },
    formFooter: {
        fontFamily: 'sulphurPoint',
        fontSize: 15,
        fontWeight: '600',
        color: '#222',
        textAlign: 'center',
        letterSpacing: 0.15,
    },
    input: {
        fontFamily: 'sulphurPoint',
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 20,
        fontWeight: '600',
        color: '#219281FF',
        marginBottom: 8,
        marginLeft: 10,
        fontFamily: 'sulphurPoint_Bold',

    },
    inputControl: {
        fontFamily: 'sulphurPoint',
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
    btnText: {
        fontSize: 22,
        lineHeight: 26,
        fontWeight: '600',
        color: '#fff',
        fontFamily: 'sulphurPoint',
    },

});
