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
                    backgroundColor: "#5CB7A5",
                },
                headerTintColor: "white",
            }}
        />
        <Stack.Screen
            name="auth/RegisterScreen"
            options={{
                title: "Sign Up",
                headerStyle: {
                    backgroundColor: "#5CB7A5",
                },
                headerTintColor: "white",
            }}
        />
        <Stack.Screen
            name="profile/ProfileScreen"
            options={{
                title: "Profile",
                headerStyle: {
                    backgroundColor: "#5CB7A5",
                },
                headerTintColor: "white",
            }}
        />
        <Stack.Screen
            name="welcome/WelcomeScreen"
            options={{
                title: "Welcome",
                headerStyle: {
                    backgroundColor: "#5CB7A5",
                },
                headerTintColor: "white",
            }}
        />
        <Stack.Screen
            name="auth/PasswordRecoveryScreen"
            options={{
                title: "Password Recovery",
                headerStyle: {
                    backgroundColor: "#5CB7A5",
                },
                headerTintColor: "white",
            }}
        />
        <Stack.Screen
            name="auth/PasswordResetScreen"
            options={{
                title: "Password Reset",
                headerStyle: {
                    backgroundColor: "#5CB7A5",
                },
                headerTintColor: "white",
            }}
        />
        <Stack.Screen
            name="TestScreen"
            options={{
                title: "Test Environment",
                headerStyle: {
                    backgroundColor: "#5CB7A5",
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

export default RootLayout;