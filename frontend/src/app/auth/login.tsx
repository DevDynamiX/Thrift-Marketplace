import React, { useState } from 'react';
import { router } from "expo-router";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    ActivityIndicator,
    Button,
    Alert, Pressable
} from 'react-native';
import { Firebase_Auth } from "@/FirebaseConfig";
import { signInWithEmailAndPassword } from "@firebase/auth";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = Firebase_Auth;

    const signIn = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter both email and password");
            return;
        }
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
            Alert.alert("Success", "Logged in successfully");

            router.push("auth/dummy");
        } catch (error: any) {
            console.log(error);
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    }

    const navigateToSIgnUp = () =>{
        router.push("auth/register");
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                autoCapitalize="none"
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
            ) : (
                <Button title="Login" onPress={signIn} />
            )}
            <Pressable onPress={navigateToSIgnUp}>
                <Text style={styles.signUpText}> Don't have an account? Sign Up </Text>
            </Pressable>
        </View>
    );
}

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 16,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginBottom: 16,
    },
    signUpText: {
        marginTop: 16,
        textAlign: 'center',
        color: 'blue',
    }
});