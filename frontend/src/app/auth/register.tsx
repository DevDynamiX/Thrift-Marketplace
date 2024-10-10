import React, { useState } from 'react';
import { router } from "expo-router";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    ActivityIndicator,
    Button,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { Firebase_Auth } from "@/FirebaseConfig";
import { createUserWithEmailAndPassword } from "@firebase/auth";

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = Firebase_Auth;

    const handleSignUp = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter both email and password");
            return;
        }
        if (password.length < 6) {
            Alert.alert("Error", "Password should be at least 6 characters long");
            return;
        }
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response);
            Alert.alert("Success", "Registered successfully");
            setEmail('');
            setPassword('');
        } catch (error:any) {
            console.log(error);
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    }

    const navigateToSignIn = () =>{
        router.push("auth/login");
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Text style={styles.title}>Sign Up</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onChangeText={(text) => setEmail(text)}
                />
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    placeholder="Password"
                    value={password}
                    autoCapitalize="none"
                    onChangeText={(text) => setPassword(text)}
                />

                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : <View style={styles.buttonContainer}>
                    <Button title="Sign Up" onPress={handleSignUp} />

                    <Button title="Login" onPress={navigateToSignIn} />
                </View>}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default SignUp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginBottom: 16,
        paddingVertical:20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
});