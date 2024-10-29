import React, { useRef } from 'react';
import { View, Text, Image, Animated, Pressable, ScrollView, StyleSheet } from 'react-native';
import { router } from "expo-router";
import {useFonts} from "expo-font";


const AdminDashboard = () => {

    const [fontsLoaded] = useFonts({
        'montserrat': require('@assets/fonts/Montserrat-VariableFont_wght.ttf'),
        'montserrat_Italic': require('@assets/fonts/Montserrat-Italic-VariableFont_wght.ttf'),
        'sulphurPoint': require('@assets/fonts/SulphurPoint-Regular.ttf'),
        'sulphurPoint_Bold': require('@assets/fonts/SulphurPoint-Bold.ttf'),
        'sulphurPoint_Light': require('@assets/fonts/SulphurPoint-Light.ttf'),
        'shrikhand': require('@assets/fonts/Shrikhand-Regular.ttf'),
    });

    const buttonScale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(buttonScale, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(buttonScale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    const navigateTo = (path: string) => {
        router.push(path);
    };

    return (
        <View style={styles.container}>
            {/* Navbar */}
            <View style={styles.navbar}>
                <Image
                    source={require('@assets/images/logo.png')}
                    style={styles.logo}
                />
                <Text style={styles.navText}>Welcome Admin</Text>
            </View>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Manage Details</Text>
            </View>

            {/*/!* Admin Details *!/*/}
            {/*<View style={styles.adminSection}>*/}
            {/*    <View style={styles.adminImageContainer}>*/}
            {/*        <Image*/}
            {/*            source={require('@assets/images/logo.png')}*/}
            {/*            style={styles.adminImage}*/}
            {/*        />*/}
            {/*        <Text style={styles.adminName}>Admin</Text>*/}
            {/*    </View>*/}
            {/*</View>*/}

            {/* Button Section */}
            <ScrollView contentContainerStyle={styles.buttonSection}>
                <CustomButton text="Insert Products" path="/Admin/AdminInventoryUpload" navigateTo={navigateTo} />
                <CustomButton text="View Products" path="/Admin/ViewProduct" navigateTo={navigateTo} />
                <CustomButton text="View Recycling" path="/Admin/Recycling" navigateTo={navigateTo} />
                {/*<CustomButton text="Insert Categories" path="/Admin/Category" navigateTo={navigateTo} />*/}
                {/*<CustomButton text="View Categories" path="/Admin/ViewCategory" navigateTo={navigateTo} />*/}
                {/*<CustomButton text="Insert Brands" path="/auth/InsertBrands" navigateTo={navigateTo} />*/}
                {/*<CustomButton text="View Brands" path="/auth/ViewBrands" navigateTo={navigateTo} />*/}
                <CustomButton text="All Orders" path="/auth/AllOrders" navigateTo={navigateTo} />
                <CustomButton text="List Payments" path="/auth/ListPayments" navigateTo={navigateTo} />
                <CustomButton text="List Users" path="/auth/ListUsers" navigateTo={navigateTo} />
                <CustomButton text="Logout" path="/auth/LoginScreen" navigateTo={navigateTo} />
            </ScrollView>

            {/* Bottom White Bar */}
            <View style={styles.bottomBar}>
                <Text style={styles.bottomText}>Thriftmarket © 2024</Text>
            </View>
        </View>
    );
};

// Reusable button component with animation
interface CustomButtonProps {
    text: string;
    path: string;
    navigateTo: (path: string) => void;
}

const CustomButton = ({ text, path, navigateTo }: CustomButtonProps) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={() => {
                    console.log(`Navigating to: ${path}`);
                    navigateTo(path);
                }}
                style={styles.button}
            >
                <Text style={styles.buttonText}>{text}</Text>
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#93D3AE',
    },
    navbar: {
        backgroundColor: '#4DAE91',
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 4,
    },
    logo: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    navText: {
        fontFamily:'sulphurPoint',
        color: '#1a1a1a',
        fontSize: 18,
        fontWeight: 'bold',
    },
    header: {
        fontFamily: 'shrikhand',
        backgroundColor: '#219281FF',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#cacaca',
    },
    headerText: {
        color: '#cacaca',
        textAlign: 'center',
        fontSize: 22,
        fontWeight: 'bold',
    },
    // adminSection: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     padding: 20,
    //     backgroundColor: '#6c757d',
    //     borderBottomWidth: 1,
    //     borderBottomColor: '#dee2e6',
    // },
    // adminImageContainer: {
    //     flex: 1,
    //     alignItems: 'center',
    // },
    // adminImage: {
    //     width: 100,
    //     height: 100,
    //     borderRadius: 50,
    //     resizeMode: 'contain',
    //     borderWidth: 2,
    //     borderColor: '#fff',
    //     marginBottom: 10,
    // },
    // adminName: {
    //     color: '#fff',
    //     textAlign: 'center',
    //     fontSize: 18,
    //     fontWeight: '500',
    // },
    buttonSection: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    button: {
        backgroundColor: '#4DAE91',
        paddingVertical: 15,
        marginVertical: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    bottomBar: {
        backgroundColor: '#fff',
        padding: 15,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#dee2e6',
    },
    bottomText: {
        fontSize: 14,
        color: '#333',
    },
});

export default AdminDashboard;
