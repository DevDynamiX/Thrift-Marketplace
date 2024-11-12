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

        {/* All the new stuff i added  */}
    <Stack.Screen
        name="Admin/Adminpanel"
        options={{
            title: "Admin",
            headerStyle: {
                backgroundColor: "#5CB7A5",
            },
            headerTintColor: "white",
        }}
    />


        <Stack.Screen
            name="Admin/InsertProducts"
            options={{
                title: "Insert",
                headerStyle: {
                    backgroundColor: "#5CB7A5",
                },
                headerTintColor: "white",
            }}
        />

        <Stack.Screen
            name="Admin/ViewProduct"
            options={{
                title: "Edit Product",
                headerStyle: {
                    backgroundColor: "#5CB7A5",
                },
                headerTintColor: "white",
            }}
        />



        <Stack.Screen
            name="Admin/Category"
            options={{
                title: "Category",
                headerStyle: {
                    backgroundColor: "#5CB7A5",
                },
                headerTintColor: "white",
            }}
        />

        <Stack.Screen
            name="Admin/ViewCategory"
            options={{
                title: "Category",
                headerStyle: {
                    backgroundColor: "#5CB7A5",
                },
                headerTintColor: "white",
            }}
        />







    <Stack.Screen
        name="Admin/userlist"
        options={{
            title: "Registred Users",
            headerStyle: {
                backgroundColor: "#5CB7A5",
            },
            headerTintColor: "white",
        }}
    />

        <Stack.Screen
            name="Admin/Recycling"
            options={{
                title: "Recyling",
                headerStyle: {
                    backgroundColor: "#5CB7A5",
                },
                headerTintColor: "white",
            }}
        />


        <Stack.Screen
            name="Admin/AdminInventoryUpload"
            options={{
                title: "Inventory Upload",
                headerStyle: {
                    backgroundColor: "#5CB7A5",
                },
                headerTintColor: "white",
            }}
        />


        <Stack.Screen
            name="webview/TermsOfService"
            options={{
                title: "Terms Of Service",
                headerStyle: {
                    backgroundColor: "#5CB7A5",
                },
                headerTintColor: "white",
            }}
        />


        <Stack.Screen
            name="webview/ContactUs"
            options={{
                title: "Support",
                headerStyle: {
                    backgroundColor: "#5CB7A5",
                },
                headerTintColor: "white",
            }}
        />

</Stack>;









    {/* All the new stuff i added  */}
};

export default RootLayout;