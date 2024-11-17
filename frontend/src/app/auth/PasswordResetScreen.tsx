import React, {useState} from 'react';
import { StyleSheet, SafeAreaView, View, Image, Text, TouchableOpacity, TextInput, ScrollView, ImageBackground, Pressable } from 'react-native';
import {router} from "expo-router";
import {useFonts} from "expo-font";

export default function ChangePassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [fontsLoaded] = useFonts({
        'sulphurPoint': require('@assets/fonts/SulphurPoint-Regular.ttf'),
        'sulphurPoint_Bold': require('@assets/fonts/SulphurPoint-Bold.ttf'),
        'sulphurPoint_Light': require('@assets/fonts/SulphurPoint-Light.ttf'),
        'shrikhand': require('@assets/fonts/Shrikhand-Regular.ttf'),
    });

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
            <ImageBackground
                source={require('@assets/images/TMBackground.png')}
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
        fontFamily: 'shrikhand',
        fontSize: 31,
        color: '#ec5707',
        marginBottom: 6,
        paddingBottom: 15,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: 'sulphurPoint',
        fontSize: 15,
        color: '#929292',
        textAlign: 'center',
        width: '75%'
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
        fontFamily: 'sulphurPoint_Bold',
        fontSize: 17,
        color: '#219281FF',
        marginBottom: 8,
        marginLeft: 10,
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
        marginBottom: 20,
        alignItems: 'center',
        paddingBottom: 10,
    },
    criteriaText: {
        fontFamily: 'sulphurPoint_Bold',
        fontSize: 16,
        color: '#ec5707',
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
        fontFamily: 'sulphurPoint',
        fontSize: 22,
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
        fontFamily: 'sulphurPoint'
    },
});
