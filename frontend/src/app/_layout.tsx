import {Stack} from "expo-router";

const RootLayout = () => {
    return <Stack>
        <Stack.Screen
            name="(tabs)"
            options={{
                headerShown: false,
            }}
        />
        <Stack.Screen
            name="auth/LoginScreen"
            options={{
                title: "Sign In",
                headerStyle: {
                    backgroundColor: "purple",
                },
                headerTintColor: "white",
            }}
        />
        <Stack.Screen
            name="auth/RegisterScreen"
            options={{
                title: "Sign Up",
                headerStyle: {
                    backgroundColor: "purple",
                },
                headerTintColor: "white",
            }}
        />
        <Stack.Screen
            name="welcome/WelcomeScreen"
            options={{
                title: "Welcome",
                headerStyle: {
                    backgroundColor: "green",
                },
                headerTintColor: "white",
            }}
        />
        <Stack.Screen
            name="auth/PasswordRecoveryScreen"
            options={{
                title: "Password Recovery",
                headerStyle: {
                    backgroundColor: "purple",
                },
                headerTintColor: "white",
            }}
        />
        <Stack.Screen
            name="auth/PasswordResetScreen"
            options={{
                title: "Password Reset",
                headerStyle: {
                    backgroundColor: "purple",
                },
                headerTintColor: "white",
            }}
        />
        <Stack.Screen
            name="TestScreen"
            options={{
                title: "Test Environment",
                headerStyle: {
                    backgroundColor: "red",
                },
                headerTintColor: "white",
            }}
        />
        <Stack.Screen
            name="index"
            options={{
                title: "Home",
                headerStyle: {
                    backgroundColor: "black",
                },
                headerTintColor: "white",
            }}
        />
    </Stack>;
};

