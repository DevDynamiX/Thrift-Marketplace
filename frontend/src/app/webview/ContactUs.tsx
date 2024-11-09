import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

export default function App() {
    const [loading, setLoading] = useState(true); // Track loading state

    return (
        <View style={styles.container}>

            {loading && (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#219281FF" />
                </View>
            )}

            {/* WebView to load the page */}
            <WebView
                style={styles.webview}
                source={{ uri: 'https://thriftmarket.netlify.app/contact' }}
                onLoadStart={() => setLoading(true)}
                onLoadEnd={() => setLoading(false)}
                javaScriptEnabled={true}
                domStorageEnabled={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
    },
    webview: {
        flex: 1,
    },
    loader: {
        position: 'absolute',  // Position the spinner above the WebView
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
        zIndex: 1,  // Ensure the loader appears above the WebView
    },
});
