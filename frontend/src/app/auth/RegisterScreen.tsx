import React, {useState} from 'react';
import { StyleSheet, SafeAreaView, View, Image, Text, TouchableOpacity, TextInput, ScrollView, ImageBackground, Pressable } from 'react-native';
import { router } from "expo-router";
import {Dropdown} from 'react-native-element-dropdown';

const genderData = [
    {label: 'Male', value: 'male'},
    {label: 'Female', value: 'female'},
    {label: 'Non-binary', value: 'Non-binary'},
    {label: 'Other', value: 'Other'},
    {label: 'Decline to state', value: 'Decline to state'},
];

export default function RegisterScreen() {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        confirmEmail: '',
        password: '',
        confirmPassword: '',
        gender: '',
    });


    const [isFocus, setIsFocus] = useState(false);

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
            <ImageBackground
                source={require('@assets/images/Screenshot 2024-09-24 at 07.42.45.png')}
                style={styles.backgroundImage}
            >
                <View style={styles.container}>
                    <ScrollView>
                        <View style={styles.header}>
                            <Image
                                resizeMode="contain"
                                style={styles.headerImg}
                                source={require('@assets/images/Picture 1.png')}
                            />
                            <Text style={styles.title}>
                                Sign Up <Text style={{color: '#ec5707'}}>Thrift Market</Text>
                            </Text>
                            <Text style={styles.subtitle}>
                                Create an account to enjoy our services
                            </Text>

                            <Text>Sign Up</Text>
                            <TextInput placeholder="Email" />
                            <TextInput placeholder="Password" secureTextEntry />
                        </View>
                        <View style={styles.form}>
                            <View style={styles.input}>
                                <Text style={styles.inputLabel}>First Name</Text>
                                <TextInput
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onChangeText={(firstName) => setForm({...form, firstName})}
                                    placeholder="John"
                                    placeholderTextColor="#6b7280"
                                    style={styles.inputControl}
                                    value={form.firstName}
                                />
                            </View>
                            <View style={styles.input}>
                                <Text style={styles.inputLabel}>Last Name</Text>
                                <TextInput
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onChangeText={(lastName) => setForm({...form, lastName})}
                                    placeholder="Doe"
                                    placeholderTextColor="#6b7280"
                                    style={styles.inputControl}
                                    value={form.lastName}
                                />
                            </View>
                            <View style={styles.input}>
                                <Text style={styles.inputLabel}>Email address</Text>
                                <TextInput
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType="email-address"
                                    onChangeText={(email) => setForm({...form, email})}
                                    placeholder="john@example.com"
                                    placeholderTextColor="#6b7280"
                                    style={styles.inputControl}
                                    value={form.email}
                                />
                            </View>
                            <View style={styles.input}>
                                <Text style={styles.inputLabel}>Confirm Email</Text>
                                <TextInput
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType="email-address"
                                    onChangeText={(confirmEmail) => setForm({...form, confirmEmail})}
                                    placeholder="john@example.com"
                                    placeholderTextColor="#6b7280"
                                    style={styles.inputControl}
                                    value={form.confirmEmail}
                                />
                            </View>
                            <View style={styles.input}>
                                <Text style={styles.inputLabel}>Password</Text>
                                <TextInput
                                    autoCorrect={false}
                                    onChangeText={(password) => setForm({...form, password})}
                                    placeholder="********"
                                    placeholderTextColor="#6b7280"
                                    style={styles.inputControl}
                                    secureTextEntry={true}
                                    value={form.password}
                                />
                            </View>
                            <View style={styles.input}>
                                <Text style={styles.inputLabel}>Confirm Password</Text>
                                <TextInput
                                    autoCorrect={false}
                                    onChangeText={(confirmPassword) => setForm({...form, confirmPassword})}
                                    placeholder="********"
                                    placeholderTextColor="#6b7280"
                                    style={styles.inputControl}
                                    secureTextEntry={true}
                                    value={form.confirmPassword}
                                />
                            </View>

                            {/* Gender Dropdown */}
                            <View style={styles.input}>
                                <Text style={styles.inputLabel}>Gender</Text>
                                <Dropdown
                                    style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    data={genderData}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={!isFocus ? 'Select gender' : '...'}
                                    value={form.gender}
                                    onFocus={() => setIsFocus(true)}
                                    onBlur={() => setIsFocus(false)}
                                    onChange={item => {
                                        setForm({...form, gender: item.value});
                                        setIsFocus(false);
                                    }}
                                />
                            </View>

                            <View style={styles.formAction}>
                                <TouchableOpacity
                                    onPress={() => {
                                        // handle sign-up logic
                                    }}
                                >
                                    <View style={styles.btn}>
                                        <Text style={styles.btnText}>Sign Up</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            {/* Google Sign-Up Button */}
                            <TouchableOpacity
                                onPress={() => {
                                    // handle Google sign-up logic
                                }}
                                style={styles.googleBtn}
                            >
                                <Image
                                    style={styles.googleLogo}
                                    //Todo - Change to google_logo.svg
                                    source={require('@assets/images/google_logo.png')}
                                />
                                <Text style={styles.btnText}>Sign up with Google</Text>
                            </TouchableOpacity>

                        </View>
                    </ScrollView>

                    <Pressable
                        onPress={() =>
                            router.replace({
                                pathname: "/auth/LoginScreen"
                            })
                        }
                        style={{marginTop: 'auto'}}
                    >
                        <Text style={styles.formFooter}>
                            Already have an account?{' '}
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
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        backgroundColor: 'white',
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
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
        fontSize: 18,
        lineHeight: 26,
        color: '#ffffff',
    },
    googleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        backgroundColor: 'rgb(57,56,56)', // Background color for the Google button
        borderColor: 'rgb(57,56,56)', // Border color for the Google button
        marginTop: 10, // Add margin to separate from the Sign up button
    },
    googleLogo: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
});

