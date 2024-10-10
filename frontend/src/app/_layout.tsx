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
            }}
        />
        <Stack.Screen
            name="auth/RegisterScreen"
            options={{
                title: "Sign Up",
            }}
        />
        <Stack.Screen
            name="profile/ProfileScreen"
            options={{
                title: "Profile",
            }}
        />
        <Stack.Screen
            name="welcome/WelcomeScreen"
            options={{
                title: "Welcome",
            }}
        />
        <Stack.Screen
            name="auth/PasswordRecoveryScreen"
            options={{
                title: "Password Recovery",
            }}
        />
        <Stack.Screen
            name="auth/PasswordResetScreen"
            options={{
                title: "Password Reset",
            }}
        />
        <Stack.Screen
            name="TestScreen"
            options={{
                title: "Test Environment",
            }}
        />
    </Stack>;
};

export default RootLayout;