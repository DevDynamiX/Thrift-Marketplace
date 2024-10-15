import React, {useState} from 'react';
import { StyleSheet, SafeAreaView, View, Image, Text, TextInput, ScrollView, ImageBackground, Pressable } from 'react-native';
import {router} from "expo-router";

export default function ResetPassword() {
    const [email, setEmail] = useState('');

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
            <ImageBackground
                source={require('@assets/images/TMBackground.png')}
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

                            <Text style={styles.title}>
                                Reset Password
                            </Text>

                            <Text style={styles.subtitle}>
                                Enter your signup email to receive a
                                <Text style={{marginLeft: 20}}> password reset link.</Text>
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
                                    onChangeText={(email) => setEmail(email)}
                                    placeholder="john@example.com"
                                    placeholderTextColor="#6b7280"
                                    style={styles.inputControl}
                                    value={email}
                                />
                            </View>

                            <View style={styles.formAction}>
                                <Pressable
                                    onPress={() =>
                                        router.push({
                                            pathname: "/auth/PasswordResetScreen",
                                        })
                                    }
                                    style={{marginTop: 'auto'}}
                                >
                                    <View style={styles.btn}>
                                        <Text style={styles.btnText}>Send Reset Link</Text>
                                    </View>
                                </Pressable>
                            </View>

                            {/* Add new text elements below the button */}
                            <Text style={styles.accountText}>
                                Don't have an account?
                            </Text>

                            <Pressable
                                onPress={() =>
                                    router.push({
                                        pathname: "/auth/RegisterScreen",
                                    })
                                }
                                style={{marginTop: 'auto'}}
                            >
                                <Text style={styles.signUpText}>
                                    Sign Up
                                </Text>
                            </Pressable>
                        </View>
                    </ScrollView>

                    <Pressable
                        onPress={() =>
                            router.push({
                                pathname: "/auth/LoginScreen",
                            })
                        }
                        style={{marginTop: 'auto'}}
                    >
                        <Text style={styles.formFooter}>
                            Remembered your password?{' '}
                            <Text style={{textDecorationLine: 'underline'}}>Sign in</Text>
                        </Text>
                    </Pressable>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

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
        color: '#ec5707',
        marginBottom: 6,
        paddingBottom: 15,
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
    },
    formAction: {
        marginTop: 16,
        marginBottom: 16,
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
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#6ABFAD',
    },
    btnText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    accountText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#222',
        textAlign: 'center',
        marginTop: 20,
    },
    signUpText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#ec5707',
        textAlign: 'center',
        marginTop: 8,
        textDecorationLine: "underline",
    },
    formFooter: {
        fontSize: 15,
        fontWeight: '600',
        color: '#222',
        textAlign: 'center',
    },
});
