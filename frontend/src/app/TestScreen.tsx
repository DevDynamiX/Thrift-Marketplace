import React from 'react';
import { StyleSheet, SafeAreaView, View, Image, Text, ImageBackground } from 'react-native';
import {NavigationProp} from '@react-navigation/native'; // Import NavigationProp

interface ChangePasswordProps {
    navigation: NavigationProp<any>; // Define type for navigation prop
}

export default function ChangePassword({}: ChangePasswordProps) {

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
            <ImageBackground
                source={require('@assets/images/Screenshot 2024-09-24 at 07.42.45.png')}
                style={styles.backgroundImage}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Image
                            resizeMode="contain"
                            style={styles.headerImg}
                            source={require('@assets/images/Picture 1.png')}
                        />
                        <Text style={styles.title}>Wow such empty</Text>
                    </View>
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
        color: '#FF4500', // Orange color for the text
        textDecorationLine: 'underline',
    },
});
