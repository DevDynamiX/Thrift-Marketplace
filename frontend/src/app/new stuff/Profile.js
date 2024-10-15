import React from 'react';
import {View, ImageBackground, StyleSheet, StatusBar, SafeAreaView, Image, Text} from 'react-native';

function Profile(){
    return (
        <SafeAreaView style = {styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="black" />
            <ImageBackground
                source = {require('@assets/Images/TMBackground.png')}
                resizeMode="stretch"
                style = {styles.image}>
                <Text>Profile Page</Text>
                <Image source = {require('@assets/Images/TMPageLogo.png')} style={styles.logo}/>
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

export default Profile;