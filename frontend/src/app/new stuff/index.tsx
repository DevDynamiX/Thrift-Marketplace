// @ts-ignore
import React, { useEffect } from 'react';
import {Text, View, ImageBackground, StyleSheet, Dimensions, StatusBar} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { Asset } from 'expo-asset';
// @ts-ignore
import BottomTabs from './BottomTabs';
import {SafeAreaProvider} from "react-native-safe-area-context";

async function loadAssets() {
    await Asset.loadAsync(require('@assets/Images/TMBackground.png'));
}

const { width, height } = Dimensions.get('window');
const aspectRatio = width / height;

function App(): JSX.Element{
    useEffect(() =>{
        loadAssets();
    }, []);

    return (
        <SafeAreaProvider>
            <NavigationContainer independent={true}>
                <StatusBar
                    barStyle = 'light-content'
                    translucent={true}
                    backgroundColor={'black'}
                />
                <BottomTabs/>
            </NavigationContainer>
        </SafeAreaProvider>
    );

}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'transparent',
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        aspectRatio: aspectRatio,
    },
    text: {
        color: 'black',
        fontSize: 42,
        lineHeight: 40,
        fontWeight: 'bold',
        textAlign: 'left',
        backgroundColor: 'white',
    },

});

export default App;