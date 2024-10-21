import React from 'react';
import { StyleSheet, SafeAreaView, ImageBackground, StatusBar } from 'react-native';

const CartScreen = () => {
    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="black" translucent={true} />
            <ImageBackground
                source={require('@assets/images/TMBackground.png')} // Replace with your background image
                style={styles.backgroundImage}
            >
                <SafeAreaView style={styles.safeArea}>
                    {/* You can add other components here if needed */}
                </SafeAreaView>
            </ImageBackground>
        </>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover', // Ensures the background image covers the screen
        width: '100%',
        height: '100%',
    },
    safeArea: {
        flex: 1,
    },
});

export default CartScreen;