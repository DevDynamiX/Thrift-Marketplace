import React, { useState, useEffect } from 'react';
import {View, FlatList, Text, StyleSheet, StatusBar, ImageBackground, Image, ScrollView} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from "expo-constants";
import {useFonts} from "expo-font";

interface Order {
    orderNumber: number;
    email: string;
    total: number;
    address: string;
}

const OrdersTable: React.FC = () => {
    const [fontsLoaded] = useFonts({
        'sulphurPoint': require('@assets/fonts/SulphurPoint-Regular.ttf'),
        'sulphurPoint_Bold': require('@assets/fonts/SulphurPoint-Bold.ttf'),
        'sulphurPoint_Light': require('@assets/fonts/SulphurPoint-Light.ttf'),
        'shrikhand': require('@assets/fonts/Shrikhand-Regular.ttf'),
    });

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    const [user, setUser] = useState({isLoggedIn: false, userToken: null, userEmail: null, firstName: null, userID: null})

    //getting user data from session
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userDataString = await AsyncStorage.getItem('userData');
                console.log('*************');
                console.log('Stored user data:', userDataString);
                console.log('*************');

                if (userDataString) {
                    const userData = JSON.parse(userDataString);
                    console.log('Email from userData:', userData.email);
                    console.log('ID from userData:', userData.id);

                    setUser({
                        isLoggedIn: true, // Assuming the user is logged in if data exists
                        userToken: userData.token || null,
                        userEmail: userData.email || null,
                        firstName: userData.firstName || null,
                        userID: userData.id || null,
                    });

                    console.log('*************');
                    console.log('Updated user state:', {
                        isLoggedIn: true,
                        userToken: userData.token || null,
                        userEmail: userData.email || null,
                        firstName: userData.firstName || null,
                        userID: userData.id || null,
                    });
                    console.log('*************');
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchUserEmail = async () => {
            try {
                const userDataString = await AsyncStorage.getItem('userData');

                if (userDataString) {
                    const userData = JSON.parse(userDataString);
                    const email = userData.email;
                    setUserEmail(email);
                    fetchOrders(email);
                }

            } catch (error) {
                console.error('Error fetching user email:', error);
                setError('Error fetching user email');
                setLoading(false);
            }
        };
        fetchUserEmail();
    }, []);

    const fetchOrders = async (email: string) => {
        try {
            const response = await fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/orders?email=${email}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                try {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                } catch (e) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }

            const data: Order[] = await response.json();

            if (!Array.isArray(data)) {
                throw new Error('Server returned invalid data format');
            }

            const filteredData = data.filter(order => order.email === email);

            setOrders(filteredData);
            setLoading(false);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching orders';
            console.error('Fetch Error:', errorMessage);
            setError(errorMessage);
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: Order }) => (
        <View style={styles.orderContainer}>
            <Text style={styles.orderNumber}>Order: {item.orderNumber}</Text>
            <Text style={styles.orderEmail}>Email: {item.email}</Text>
            <Text style={styles.orderEmail}>Address: {item.address}</Text>
        </View>
    );

    const keyExtractor = (item: Order): string => item.orderNumber.toString();

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading orders...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <>
            <StatusBar barStyle="light-content" backgroundColor="black" translucent={true}/>

            <ImageBackground
                source={require('@assets/images/TMBackground.png')}
                resizeMode="stretch"
                style={styles.backgroundImage}
            >
                <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Error: {error}</Text>
                    <Text
                        style={styles.retryText}
                        onPress={() => {
                            setError(null);
                            setLoading(true);
                            fetchOrders(userEmail || '');
                        }}
                    >
                        Tap to retry
                    </Text>
                </View>
            </SafeAreaView>
            </ImageBackground>
        </>
        );
    }

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="black" translucent={true}/>

            <ImageBackground
                source={require('@assets/images/TMBackground.png')}
                resizeMode="stretch"
                style={styles.backgroundImage}
            >
                <SafeAreaView style={styles.container}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>Your Orders:</Text>
                    </View>
                    <FlatList<Order>
                        data={orders}
                        renderItem={renderItem}
                        keyExtractor={keyExtractor}
                        ListEmptyComponent={() => (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No orders found</Text>
                            </View>
                        )}
                    />
                </SafeAreaView>
            </ImageBackground>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex:1,
        opacity: 0.97,
    },
    headerContainer: {
        width:'90%',
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
        alignSelf: 'center'
    },
    headerText: {
        fontFamily: 'shrikhand',
        fontSize: 30,
        color: '#219281FF',
        textAlign: 'center'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontFamily: 'sulphurPoint_Bold',
        fontSize: 18,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontFamily: 'sulphurPoint',
        fontSize: 18,
        marginBottom: 8,
        color: '#FF0000',
    },
    retryText: {
        fontSize: 16,
        color: '#219281FF',
        textDecorationLine: 'underline',
    },
    orderContainer: {
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(249,249,249, 1)',
    },
    orderNumber: {
        fontFamily: 'sulphurPoint_Bold',
        fontSize: 26,
        marginBottom: 4,
        color: '#93D3AE',

    },
    orderEmail: {
        fontFamily: 'sulphurPoint',
        fontSize: 16,
        color: '#219281FF',
        marginBottom: 4,
    },

    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width:'90%',
        backgroundColor: '#ffffff',
        padding: 20,
        marginTop: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
        alignSelf: 'center'
    },
    emptyText: {
        fontFamily: 'sulphurPoint',
        fontSize: 20,
        color: '#FF0000',
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    safeArea: {
         justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        bottom: '24%',
        width: '100%',
    },
});

export default OrdersTable;