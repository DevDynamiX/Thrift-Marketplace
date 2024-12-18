import React, {useState} from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    Image,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ImageBackground,
    Pressable,
    Alert, StatusBar
} from 'react-native';
import { router } from "expo-router";
import Constants from 'expo-constants';
import { Picker } from "@react-native-picker/picker";
import { Firebase_Auth } from "@/firebaseConfig";
import { createUserWithEmailAndPassword } from "@firebase/auth";
import {useFonts} from "expo-font";

const SignUp = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [gender, setGender] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [isFocus, setIsFocus] = useState(false);

    const [fontsLoaded] = useFonts({
        'sulphurPoint': require('@assets/fonts/SulphurPoint-Regular.ttf'),
        'sulphurPoint_Bold': require('@assets/fonts/SulphurPoint-Bold.ttf'),
        'sulphurPoint_Light': require('@assets/fonts/SulphurPoint-Light.ttf'),
        'shrikhand': require('@assets/fonts/Shrikhand-Regular.ttf'),
    });

    const handleSignUp = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }
        if (password.length < 6) {
            Alert.alert("Error", "Password should be at least 6 characters long");
            return;
        }
        setLoading(true);
        try {
            // Send the user data to your backend
            const dbResponse = await fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password,
                    gender: gender,
                }),
            });

            if (!dbResponse.ok) {
                const errorData = await dbResponse.json();
                console.log("Backend error response:", errorData.message);
                Alert.alert("Error", errorData.message || "Failed to register user in the backend");
                return;
            }

            Alert.alert("Success", "Registered successfully");
            router.push("auth/LoginScreen");
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
            <StatusBar barStyle="light-content" backgroundColor="black" />
            <ImageBackground
                source={require('@assets/images/TMBackground.png')}
                style={styles.backgroundImage}
            >
                <View style={styles.container}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
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
                                <Text style={styles.inputLabel}>Gender</Text>
                                <Picker
                                    selectedValue={gender}
                                    style = {styles.picker}
                                    onValueChange={(itemValue) => setGender(itemValue)}
                                >
                                    <Picker.Item label="Select Gender" value="" />
                                    <Picker.Item label="Male" value="male" />
                                    <Picker.Item label="Female" value="female" />
                                    <Picker.Item label="Other" value="other" />
                                </Picker>
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
        color: '#1D2A32',
        marginBottom: 6,
        fontFamily: 'shrikhand'
    },
    subtitle: {
        fontFamily: 'sulphurPoint_Bold',
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
    formFooter: {
        fontSize: 15,
        fontWeight: '600',
        color: '#222',
        textAlign: 'center',
        letterSpacing: 0.15,
        fontFamily: 'sulphurPoint',
    },
    input: {
        marginBottom: 16,
    },
    inputLabel: {
        fontFamily: 'sulphurPoint_Bold',
        fontSize: 20,
        fontWeight: '600',
        color: '#219281FF',
        marginBottom: 8,
        marginLeft: 10
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

    placeholderStyle: {
        fontFamily: 'sulphurPoint',
        fontSize: 16,
    },
    selectedTextStyle: {
        fontFamily: 'sulphurPoint',
        fontSize: 16,
    },
    btn: {
        fontFamily: 'sulphurPoint',
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
        fontFamily: 'sulphurPoint',
        fontSize: 22,
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
    picker: {
        fontFamily: 'sulphurPoint',
        fontSize: 13,
        color: '#222',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginBottom: 10,
    },
});

