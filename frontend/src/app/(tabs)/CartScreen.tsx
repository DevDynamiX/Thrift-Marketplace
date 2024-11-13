import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import {router, useRouter} from "expo-router";
import {sum} from "@firebase/firestore";

interface Product {
    id: number;
    itemName: string;
    itemPrice: number;
}

const Home: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const router = useRouter();

    useEffect(() => {
       const newTotal = cart.reduce((sum,item)=>{
           const price = Number(item.itemPrice)||0;
           return sum + price;
       },0);
       setTotal(newTotal);
    },[cart]);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3000/inventory');

            if (!response.ok) throw new Error('Something went wrong!');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };


    const addToCart = (product: Product) => {
        setCart((prevCart)=>[...prevCart,product]);
        Alert.alert('Added to Cart', `${product.itemName} has been added to your cart.`);
    };

    const removeFromCart =(product:Product)=>{
        setCart((prevCart)=>prevCart.filter((item)=>item.id !== product.id));
        Alert.alert('Removed to Cart', `${product.itemName} has been removed from your cart.`);
    }

    const goToCart = () =>{
        router.push({
            pathname:'auth/PayGate',
            params:{total},
        });
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const renderItem = ({ item }: { item: Product }) => (
        <View style={styles.productCard}>
            <Text style={styles.name}>{item.itemName}</Text>
            <Text style={styles.price}>R{item.itemPrice}</Text>
            <Button title="Add to Cart" onPress={() => addToCart(item)} />
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
            />
            <View style={styles.cartContainer}>
                <Text style={styles.cartTitle}>Shopping Cart</Text>
                {cart.map((item, index) => (
                    <Text key={index} style={styles.cartItem}>{item.itemName} - R{item.itemPrice}
                        <Button title="Remove"onPress={() => removeFromCart(item)} />
                    </Text>
                ))}
                <Text style={styles.totalText}>Total: R{Number(total).toFixed(2)}</Text>
                <Button title="Proceed to Payment" onPress={() => goToCart()} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        padding: 16,
    },
    listContainer: {
        paddingBottom: 100,
    },
    productCard: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 16,
        color: 'green',
        marginTop: 4,
    },
    description: {
        fontSize: 14,
        color: '#555',
        marginTop: 8,
    },
    cartContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    cartTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    cartItem: {
        fontSize: 16,
    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    cartItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 4,
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cartItemDetails: {
        flex: 1,
    },
    cartItemName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    cartItemPrice: {
        fontSize: 16,
        color: 'green',
    },
});

export default Home;

//const displayLoggedUser = () =>{
//     const [username, setUsername] = useState('');
//
//     useEffect(() => {
//         const fetchUserName = async ()=>{
//             try {
//                 const storedUserName = await AsyncStorage.getItem('username');
//                 if (storedUserName){
//                     setUsername(storedUserName);
//                 }
//             }
//             catch(error){
//                 console.error(error);
//             }
//         };
//         fetchUserName();
//     }, []);
// }