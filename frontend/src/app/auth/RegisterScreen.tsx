import React, {useState} from 'react';
import { StyleSheet, SafeAreaView, View, Image, Text, TouchableOpacity, TextInput, ScrollView, ImageBackground, Pressable , Alert} from 'react-native';
import { router } from "expo-router";
import { Firebase_Auth } from "@/firebaseConfig";
import { createUserWithEmailAndPassword } from "@firebase/auth";

const SignUp = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [gender, setGender] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFocus, setIsFocus] = useState(false);

    const handleSignUp = async () => {
        if (!firstName || !lastName || !email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }
        if (password.length < 6) {
            Alert.alert("Error", "Password should be at least 6 characters long");
            return;
        }
        setLoading(true);
        try {
            // create the user with Firebase
            const firebaseResponse = await createUserWithEmailAndPassword(Firebase_Auth, email, password);
            console.log("Firebase response:", firebaseResponse);

            const { user } = firebaseResponse;
            const { email: userEmail, uid } = user;

            // Send the user data to your backend
            const dbResponse = await fetch("http://localhost:3000/register", { // Update the URL as necessary
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email: userEmail,
                    password, // Note: Use a hashed password in the backend
                    gender,
                    firebaseUid: uid, // Send Firebase UID to your backend
                }),
            });

            if (!dbResponse.ok) {
                const errorData = await dbResponse.json();
                console.log("Backend error response:", errorData);
                Alert.alert("Error", errorData.message || "Failed to register user in the backend");
                return;
            }

            Alert.alert("Success", "Registered successfully");
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            setGender('');
        } catch (error:any) {
            console.error("Sign-up error:", error.message);
            Alert.alert("Error", error.message || "An error occurred while signing up");
        } finally {
            setLoading(false);
        }
    }

    const navigateToSignIn = () =>{
        router.push("auth/LoginScreen");
    }

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

                            <Text style={[styles.title, { color: '#ec5707' }]}>Thrift Market</Text>
                            <Text style={styles.title}>
                                Sign Up
                            </Text>

                            <Text style={styles.subtitle}>
                                Create an account to enjoy our services
                            </Text>
                        </View>
                        <View style={styles.form}>
                            <View style={styles.input}>
                                <Text style={styles.inputLabel}>First Name</Text>
                                <TextInput
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onChangeText={(text) => setFirstName(text)}
                                    placeholder="first name"
                                    placeholderTextColor="#6b7280"
                                    style={styles.inputControl}
                                    value={firstName}
                                />
                            </View>
                            <View style={styles.input}>
                                <Text style={styles.inputLabel}>Last Name</Text>
                                <TextInput
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onChangeText={(text) => setLastName(text)}
                                    placeholder="last name"
                                    placeholderTextColor="#6b7280"
                                    style={styles.inputControl}
                                    value={lastName}
                                />
                            </View>
                            <View style={styles.input}>
                                <Text style={styles.inputLabel}>Email address</Text>
                                <TextInput
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType="email-address"
                                    onChangeText={(text) => setEmail(text)}
                                    placeholder="email"
                                    placeholderTextColor="#6b7280"
                                    style={styles.inputControl}
                                    value={email}
                                />
                            </View>
                            <View style={styles.input}>
                                <Text style={styles.inputLabel}>Password</Text>
                                <TextInput
                                    autoCorrect={false}
                                    onChangeText={(text) => setPassword(text)}
                                    placeholder="password"
                                    placeholderTextColor="#6b7280"
                                    style={styles.inputControl}
                                    secureTextEntry={true}
                                    value={password}
                                />
                            </View>


                            {/* Gender Dropdown */}
                            {/*<View style={styles.input}>*/}
                            {/*    <Text style={styles.inputLabel}>Gender</Text>*/}
                            {/*    <Dropdown*/}
                            {/*        style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}*/}
                            {/*        placeholderStyle={styles.placeholderStyle}*/}
                            {/*        selectedTextStyle={styles.selectedTextStyle}*/}
                            {/*        data={genderData}*/}
                            {/*        labelField="label"*/}
                            {/*        valueField="value"*/}
                            {/*        placeholder={!isFocus ? 'Select gender' : '...'}*/}
                            {/*        value={gender}*/}
                            {/*        onFocus={() => setIsFocus(true)}*/}
                            {/*        onBlur={() => setIsFocus(false)}*/}
                            {/*        onChange={item => {*/}
                            {/*            setGender(item.value);*/}
                            {/*            setIsFocus(false);*/}
                            {/*        }}*/}
                            {/*    />*/}
                            {/*</View>*/}

                            <View style={styles.formAction}>
                                <TouchableOpacity
                                    onPress={handleSignUp}
                                >
                                    <View style={styles.btn}>
                                        <Text style={styles.btnText}>Sign Up</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>

                    <Pressable
                        onPress={navigateToSignIn}
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

export default SignUp;

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

