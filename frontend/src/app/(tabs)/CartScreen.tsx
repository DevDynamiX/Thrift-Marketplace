import React from 'react';
import {View, ImageBackground, StyleSheet, StatusBar, SafeAreaView, Image, Text} from 'react-native';

const CartScreen = () =>{
    return (
        <SafeAreaView style = {styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="black" />
                <ImageBackground
                    source = {require('@assets/images/TMBackground.png')}
                    resizeMode="stretch"
                    style = {styles.image}>
                    <View style = { styles.mainContainer }>
                        <Image source = {require('@assets/images/TMPageLogo.png')} style={styles.logo}/>
                        <Text>Cart Page</Text>
                    </View>
                </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'black',
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
        justifyContent: 'center',
        alignItems: 'center',
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