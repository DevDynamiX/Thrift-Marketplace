import React, {useState} from 'react';
import { StyleSheet, SafeAreaView, View, Image, Text, TouchableOpacity, TextInput, ScrollView, ImageBackground, Pressable } from 'react-native';
import {router} from "expo-router";

export default function ChangePassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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

                            <Text style={styles.title}>
                                Change Password
                            </Text>

                            <Text style={styles.subtitle}>
                                Enter a new password and confirm it below.
                            </Text>
                        </View>

                        {/* Display password criteria above the input fields */}
                        <View style={styles.passwordCriteria}>
                            <Text style={styles.criteriaText}>• One uppercase letter</Text>
                            <Text style={styles.criteriaText}>• One special character</Text>
                            <Text style={styles.criteriaText}>• One number</Text>
                            <Text style={styles.criteriaText}>• Minimum 8 characters long</Text>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.input}>
                                <Text style={styles.inputLabel}>New Password</Text>
                                <TextInput
                                    secureTextEntry={true}
                                    onChangeText={(password) => setNewPassword(password)}
                                    placeholder="Enter new password"
                                    placeholderTextColor="#6b7280"
                                    style={styles.inputControl}
                                    value={newPassword}
                                />
                            </View>

                            <View style={styles.input}>
                                <Text style={styles.inputLabel}>Confirm Password</Text>
                                <TextInput
                                    secureTextEntry={true}
                                    onChangeText={(password) => setConfirmPassword(password)}
                                    placeholder="Confirm new password"
                                    placeholderTextColor="#6b7280"
                                    style={styles.inputControl}
                                    value={confirmPassword}
                                />
                            </View>

                            <View style={styles.formAction}>
                                <TouchableOpacity
                                    onPress={() => {
                                        // handle password change action
                                        console.log("New password:", newPassword);
                                    }}
                                >
                                    <View style={styles.btn}>
                                        <Text style={styles.btnText}>Change Password</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <Pressable
                                onPress={() =>
                                    router.push({
                                        pathname: "/auth/LoginScreen",
                                    })
                                }
                                style={styles.backButton}
                            >
                                <Text style={styles.backText}>Return to Login</Text>
                            </Pressable>
                        </View>
                    </ScrollView>
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
        color: '#1D2A32',
        marginBottom: 6,
        paddingBottom: 15,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        fontWeight: '500',
        color: '#929292',
        textAlign: 'center',
        marginBottom: 20,
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
    passwordCriteria: {
        marginTop: 20,
        marginBottom: 20,
        alignItems: 'center',
        paddingBottom: 10,


    },
    criteriaText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#222',
        textAlign: 'center',
        marginBottom: 8,

    },
    formAction: {
        marginTop: 16,
        marginBottom: 16,
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
    backButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    backText: {
        fontSize: 16,
        color: '#FF4500',
        textDecorationLine: 'underline',
    },
});
