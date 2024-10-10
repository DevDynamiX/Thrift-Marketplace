import React, {useState} from 'react';
import { router } from "expo-router";
import { StyleSheet, SafeAreaView, View, Image, Text, TouchableOpacity, TextInput, ScrollView, ImageBackground, Pressable } from 'react-native';

export default function Example() {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

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
                                Login <Text style={{color: '#ec5707'}}>Thrift Market</Text>
                            </Text>
                            <Text style={styles.subtitle}>
                                Get started with our app,just create an account and enjoy the experience
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
                                    onChangeText={(email) => setForm({...form, email})}
                                    placeholder="john@example.com"
                                    placeholderTextColor="#6b7280"
                                    style={styles.inputControl}
                                    value={form.email}
                                />
                            </View>
                            <View style={styles.input}>
                                <Text style={styles.inputLabel}>Password</Text>
                                <TextInput
                                    autoCorrect={false}
                                    clearButtonMode="while-editing"
                                    onChangeText={(password) => setForm({...form, password})}
                                    placeholder="********"
                                    placeholderTextColor="#6b7280"
                                    style={styles.inputControl}
                                    secureTextEntry={true}
                                    value={form.password}
                                />
                            </View>
                            <View style={styles.formAction}>
                                <TouchableOpacity
                                    onPress={() => {
                                        // handle onPress
                                    }}
                                >
                                    <View style={styles.btn}>
                                        <Text style={styles.btnText}>Sign in</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            {/* Google Sign-In Button */}
                            <TouchableOpacity
                                onPress={() => {
                                    // handle Google sign-in
                                }}
                                style={styles.googleBtn}
                            >
                                <Image
                                    //Todo - Change to google_logo.svg
                                    source={require('@assets/images/google_logo.png')}
                                    style={styles.googleLogo}
                                />
                                <Text style={styles.btnText}>Sign in with Google</Text>
                            </TouchableOpacity>

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

                    <Pressable
                        onPress={() =>
                            router.push({
                                pathname: "/auth/RegisterScreen"
                            })
                        }
                        style={{marginTop: 'auto'}}
                    >
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
