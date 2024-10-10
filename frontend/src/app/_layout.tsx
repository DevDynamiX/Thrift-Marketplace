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
            name="auth/login"
            options={{
                title: "Sign In",
            }}
        />
        <Stack.Screen
            name="auth/register"
            options={{
                title: "Sign Up",
            }}
        />
    </Stack>;
};

export default RootLayout;