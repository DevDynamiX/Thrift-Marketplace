import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
// come back
export default function App() {
    const [loading, setLoading] = useState(true); // Track loading state

    return (
        <View style={styles.container}>
            {loading && (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#219281FF" />
                </View>
            )}

            <WebView
                style={styles.webview}
                source={{ uri: 'https://thriftmarket.netlify.app' }}
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
        marginTop: 0,
    },
    webview: {
        flex: 1,
    },
    loader: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
        zIndex: 1,
    },
});

