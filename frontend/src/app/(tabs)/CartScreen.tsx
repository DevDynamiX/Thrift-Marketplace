import React from 'react';
import { StyleSheet, SafeAreaView, ImageBackground, StatusBar, View, Text, Image } from 'react-native';

const CartScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="black" />
            <ImageBackground
                source={require('@assets/images/TMBackground.png')}
                resizeMode="stretch"
                style={styles.image}>
                <View style={styles.mainContainer}>
                    <Image source={require('@assets/images/TMPageLogo.png')} style={styles.logo} />
                    <Text style={styles.text}>Cart Page</Text>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        justifyContent: 'space-evenly',
    },
    image: {
        flex: 1,
        resizeMode: 'cover', // Ensures the background image covers the screen
        width: '100%',
        height: '100%',
    },
    logo: {
        resizeMode: 'contain',
        width: '65%',
        position: "relative",
        bottom: '28%',
        left: "5%"
    },
    text: {
        color: 'black',
        fontSize: 42,
        lineHeight: 40,
        fontWeight: 'bold',
        backgroundColor: 'white',
    },
});

export default CartScreen;
