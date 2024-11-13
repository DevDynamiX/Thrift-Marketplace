import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Order {
    orderNumber: number;
    email: string;
    total: number;
}

const OrdersTable: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserEmail = async () => {
            try {
                const email = await AsyncStorage.getItem('userEmail');
                if (!email) {
                    setError('User email not found in AsyncStorage');
                    setLoading(false);
                    return;
                }
                setUserEmail(email);
                fetchOrders(email);
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
            const response = await fetch(`http://localhost:3000/orders?email=${email}`, {
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
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Orders</Text>
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
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'red',
        marginBottom: 8,
    },
    retryText: {
        fontSize: 16,
        color: '#007AFF',
        textDecorationLine: 'underline',
    },
    orderContainer: {
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
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    orderTotal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
});

export default OrdersTable;