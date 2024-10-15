import React from 'react';
import {ImageBackground, StyleSheet, StatusBar, SafeAreaView, Image, Text} from 'react-native';

const CartScreen = () =>{
    return (
        <SafeAreaView style = {styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="black" />
            <ImageBackground
                source = {require('@assets/images/TMBackground.png')}
                resizeMode="stretch"
                style = {styles.image}>
                <Text>Cart Page</Text>
                <Image source = {require('@assets/images/TMPageLogo.png')} style={styles.logo}/>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'black',
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    logo:{
        resizeMode: 'contain',
        width: '60%',
        position: 'relative',
        right:'20%',
        bottom: '44%'
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