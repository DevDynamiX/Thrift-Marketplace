import {StyleSheet, View, Text, Pressable} from "react-native";
import {router} from "expo-router";

const App = () => {
    return (
        <View style={styles.container}>
            <View style={styles.main}>
                <Text style={styles.title}>Welcome to Thrift Market!</Text>

                <Pressable
                    onPress={() =>
                        router.push({
                            pathname: "/tempFolderForRouting/[Id]",
                        })
                    }
                >
                    <Text style={styles.subtitle}>Test Routing Environment</Text>
                </Pressable>

                <Pressable
                    onPress={() =>
                        router.push({
                            pathname: "/auth/login"
                        })
                    }
                >
                    <Text style={styles.subtitle}>Click here to Sign In</Text>
                </Pressable>

                <Pressable
                    onPress={() =>
                        router.push({
                            pathname: "/auth/register"
                        })
                    }
                >
                    <Text style={styles.subtitle}>Click here to Sign Up</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 24,
    },
    main: {
        flex: 1,
        justifyContent: "center",
        maxWidth: 960,
        marginHorizontal: "auto",
    },
    title: {
        fontSize: 48,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 30,
        color: "#38434D",
    },
});

