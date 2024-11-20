import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, StatusBar, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from "expo-constants";
import { TouchableOpacity } from 'react-native';
import {date} from "yup";
import {useFonts} from "expo-font";

interface Order {
    orderNumber: number;
    email: string;
    total: number;
    address: string;
    completed: boolean;
    CreateDate:Date;
}

const OrdersTable: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingOrder, setUpdatingOrder] = useState<number | null>(null);

    const [fontsLoaded] = useFonts({
        'sulphurPoint': require('@assets/fonts/SulphurPoint-Regular.ttf'),
        'sulphurPoint_Bold': require('@assets/fonts/SulphurPoint-Bold.ttf'),
        'sulphurPoint_Light': require('@assets/fonts/SulphurPoint-Light.ttf'),
        'shrikhand': require('@assets/fonts/Shrikhand-Regular.ttf'),
    });

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/orders`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: Order[] = await response.json();
            setOrders(data);
            setLoading(false);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching orders';
            console.error('Fetch Error:', errorMessage);
            setError(errorMessage);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const toggleOrderCompletion = async (orderNumber: number) => {
        setUpdatingOrder(orderNumber);
        try {
            const response = await fetch(
                `${Constants.expoConfig?.extra?.BACKEND_HOST}/orders/${orderNumber}/status`,
                {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update order');
            }

            const updatedOrder = await response.json();
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.orderNumber === orderNumber
                        ? { ...order, completed: updatedOrder.completed }
                        : order
                )
            );
        } catch (error) {
            console.error('Error updating order:', error);
            Alert.alert(
                'Error',
                'Failed to update order status. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setUpdatingOrder(null);
        }
    };
    // let me know of any problems please
    const renderItem = ({ item }: { item: Order }) => (
        <View style={styles.orderContainer}>
            <Text style={styles.orderNumber}>Order: {item.orderNumber}</Text>
            <Text style={styles.orderEmail}>Email: {item.email}</Text>
            <Text style={styles.orderEmail}>Address: {item.address}</Text>
            <Text style={styles.orderEmail}>Total: R{item.total}</Text>
            <TouchableOpacity
                onPress={() => toggleOrderCompletion(item.orderNumber)}
                style={[
                    styles.statusButton,
                    { backgroundColor: item.completed ? '#4CAF50' : '#FF9800' }
                ]}
                disabled={updatingOrder === item.orderNumber}
            >
                {updatingOrder === item.orderNumber ? (
                    <ActivityIndicator color="white" size="small" />
                ) : (
                    <Text style={styles.statusButtonText}>
                        {item.completed ? 'Completed' : 'Pending'}
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );

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
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Error: {error}</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => {
                            setError(null);
                            setLoading(true);
                            fetchOrders();
                        }}
                    >
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <ImageBackground
            source = {require('@assets/images/TMBackground.png')}
            resizeMode="stretch"
            style = {styles.image}>
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={orders}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.orderNumber.toString()}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No orders found</Text>
                        </View>
                    )}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        //backgroundColor: '#fff',
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        opacity: 0.90,
    },
    headerContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    headerText: {
        fontFamily: 'shrikhand',
        fontSize: 24,
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
        fontFamily: 'sulphurPoint_Bold',
        fontSize: 18,
        color: 'red',
        marginBottom: 8,
    },
    retryButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
    },
    retryText: {
        fontFamily: 'sulphurPoint',
        color: '#fff',
        fontSize: 16,
    },
    orderContainer: {
        width: '90%',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    orderNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    orderEmail: {
        fontFamily: 'sulphurPoint',
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    statusButton: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 8,
    },
    statusButtonText: {
        fontFamily: 'sulphurPoint_Bold',
        color: '#fff',
        fontSize: 14,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontFamily: 'sulphurPoint',
        fontSize: 16,
        color: '#666',
    },
});

export default OrdersTable;