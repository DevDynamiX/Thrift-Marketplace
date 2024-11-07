import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Button,
    Alert,
    ImageBackground,
    SafeAreaView,
    ActivityIndicator, ScrollView, StatusBar, Image, ImageStyle, TouchableOpacity, Dimensions
} from 'react-native';
import {router, useRouter} from "expo-router";
import {sum} from "@firebase/firestore";
import {useFonts} from "expo-font";
import Constants from "expo-constants";
import LottieView from "lottie-react-native";
import Icon from "react-native-vector-icons/Ionicons";


interface Product {
    id: number;
    itemName: string;
    itemPrice: number;
}
const { width } = Dimensions.get('window');
const itemSize = width/3;

const Home: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const router = useRouter();

    const [fontsLoaded] = useFonts({
        'montserrat': require('@assets/fonts/Montserrat-VariableFont_wght.ttf'),
        'montserrat_Italic': require('@assets/fonts/Montserrat-Italic-VariableFont_wght.ttf'),
        'sulphurPoint': require('@assets/fonts/SulphurPoint-Regular.ttf'),
        'sulphurPoint_Bold': require('@assets/fonts/SulphurPoint-Bold.ttf'),
        'sulphurPoint_Light': require('@assets/fonts/SulphurPoint-Light.ttf'),
        'shrikhand': require('@assets/fonts/Shrikhand-Regular.ttf'),
    });

    if (!fontsLoaded) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="white" />
            </SafeAreaView>
        );
    }

    useEffect(() => {
       const newTotal = cart.reduce((sum,item)=>{
           const price = Number(item.itemPrice)||0;
           return sum + price;
       },0);
       setTotal(newTotal);
    },[cart]);

    //TODO:fetch from users 'tempCart' table
    const fetchProducts = async () => {
        try {
            const response = await  fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/inventory`);

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
        Alert.alert('Removed to Cart', `"${product.itemName}" has been removed from your cart.`);
    }

    const goToCart = () =>{
        router.push({
            pathname:'auth/PayGate',
            params:{total},
        });
    };

    const images = products ? [
        { uri: products.mainImage },
        { uri: products.image2 },
        { uri: products.image3 }] : [];

    useEffect(() => {
        fetchProducts();
    }, []);

    //TODO: render what the user added to 'cart' table
    const renderItem = ({ item }: { item: Product }) => (
        <View style={styles.productCard}>
            <View style = {styles.itemHeaderLine}>
                <Text style={styles.name}>{item.itemName}</Text>
                <TouchableOpacity style = {styles.removeItemButton} onPress={() => removeFromCart(item)}>
                    <Icon
                        name={'trash-outline'}
                        style={[
                            styles.trashIcon,
                        ]}
                        size={20}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.separator} />

            <View style = {styles.cartItemBodyContainer}>
                <View key={item.id} style={styles.imageContainer}>
                    <Image style={styles.clothesImage}
                           source={{uri: item.mainImage}}/>

                    {item.onSale && (
                        <View style={styles.discountBanner}>
                            <Text style={styles.discountText}>
                                {`Now R${item.salePrice}`}
                            </Text>
                        </View>
                    )}
                </View>

                <View style = {styles.itemDetails} >
                    <View style = {styles.itemNamePrice}>
                        <Text style={styles.itemName}>{item.itemName}</Text>
                        <Text
                            style={[
                                styles.price,
                                item.onSale && styles.salePriceText
                            ]}
                        >
                            {`R${item.itemPrice}`}
                        </Text>
                    </View>

                    <View style = {styles.clothesDetails}>
                        <Text style={styles.text}>Colour: {item.colour}</Text>
                        <Text style={styles.text}>Size: {item.size}</Text>
                        <Text style={styles.text}>Damage: {item.damage}</Text>
                    </View>
                </View>
            </View>

        </View>
    );

    return (
        <ImageBackground
            source={require('@assets/images/TMBackground.png')}
            resizeMode="stretch"
            style={styles.image}>
            <StatusBar barStyle="light-content" backgroundColor="black"/>

                <View style={styles.container}>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style = {styles.content}>
                            <Image source={require('@assets/images/TMPageLogo.png')} style={styles.logo as ImageStyle}/>

                            <View style  = {styles.pageContent}>
                                <FlatList
                                    data={products}
                                    keyExtractor={(item) => item.id.toString()}
                                    renderItem={renderItem}
                                    contentContainerStyle={styles.listContainer}
                                />
                            </View>
                        </View>
                    </ScrollView>
                    <View style={styles.cartContainer}>
                        <Text style={styles.cartTitle}>Checkout: </Text>
                        {cart.map((item, index) => (
                            <Text key={index} style={styles.cartItem}>{item.itemName} - R{item.itemPrice}</Text>
                        ))}
                        <View style={styles.separator} />

                        <View style={styles.paymentDetails}>
                            <View style = {styles.paymentDetailsContainer}>
                                <Text style = {styles.text}>Your Cart Subtotal: </Text>
                                <Text style  = {styles.text}> R{Number(total).toFixed(2)} </Text>
                            </View>
                            <View style = {styles.paymentDetailsContainer}>
                                <Text style = {styles.text}>Discount Applied: </Text>
                                <Text style  = {styles.text}> -R[discountAmount] </Text>
                            </View>
                            <View style = {styles.paymentDetailsContainer}>
                                <Text style = {styles.text}>Shipping Fees: </Text>
                                <Text style  = {styles.text}> R[shipping fees] </Text>
                            </View>

                        </View>

                        <View style={styles.separator} />

                        <View style = {styles.totalContainer}>
                            {/*TODO: get total after discounts deducted and shipping is added*/}
                            <Text style={styles.totalText}>R{Number(total).toFixed(2)}</Text>
                            <TouchableOpacity style = {styles.paymentButton} onPress={() => goToCart()}>
                                <Icon
                                    name={ 'cart-outline'}
                                    style={[
                                        styles.staticCart,]}
                                    size={30}
                                />
                                <Text style = {styles.paymentText}> Pay Now</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginBottom: '19%'
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    content: {
        width:'90%',
        height: 'auto',
        position: "relative",
        bottom: '10%',
        left: '5%'
    },
    pageContent: {
        display:'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        width: '100%',
    },
    listContainer: {
        width: '100%',
        position: "relative",
    },
    productCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    name: {
        fontFamily:'sulphurPoint_Bold',
        fontSize: 20,
    },
    cartContainer: {
        backgroundColor: 'rgb(180,238,206)',
        margin: 10,
        marginBottom: 80,
        padding: 16,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 5,
    },
    cartTitle: {
        fontFamily: 'sulphurPoint_Bold',
        color:'#333333',
        fontSize: 20,
    },
    cartItem: {
        color:'#333333',
        fontSize: 16,
    },
    totalText: {
        color:'#333333',
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: 10,
        marginLeft: 15
    },
    paymentDetails: {
        marginLeft: 15,
        marginRight: 15
    },
    paymentDetailsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    cartItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
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
        fontFamily: 'sulphurPoint_Bold',
        fontSize: 16,
    },
    cartItemPrice: {
        fontFamily: 'sulphurPoint',
        fontSize: 16,
        color: 'green',
    },
    logo: {
        resizeMode: 'contain' as ImageStyle['resizeMode'],
        width: '70%',
        position: "static",
        top: 160,
        marginBottom: '8%',
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(55,55,55,0.18)',
        marginVertical: 10,
        width: '100%',
    },
    totalContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",

    },
    paymentButton: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#219281FF',
        width: '50%',
        padding: 10,
        paddingLeft: 25,
        paddingRight: 25,
        borderRadius: 10,
    },
    paymentText: {
        color: '#ffffff',
        fontFamily: 'sulphurPoint',
        fontSize: 20,
        marginLeft: '10%'
    },
    staticCart: {
        color: "#ffffff",
    },
    trashIcon: {
        color: '#FF0000'
    },
    removeItemButton: {
        width: 30,
        alignItems:'center',
        borderRadius: 100,
    },
    itemHeaderLine: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    imageContainer: {
        height: 170,
        width: itemSize,
        borderRadius: 5,
        resizeMode: 'cover' as ImageStyle['resizeMode'],
        shadowColor: '#000',
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 5,
    },
    clothesImage: {
        height: 170,
        width: itemSize,
        borderRadius: 5,
        resizeMode: 'cover' as ImageStyle['resizeMode'],
        shadowColor: '#000',
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 5,
    },
    discountBanner: {
        position: 'absolute',
        top: 15,
        right: 0,
        backgroundColor: '#FF0000',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        zIndex: 1,
    },
    discountText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cartItemBodyContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
    },
    itemNamePrice: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
        width: '55%',
        marginLeft: 5,
        alignContent: "center",
        marginBottom: 15,
        marginTop: 5
    },
    itemName: {
        fontFamily: 'sulphurPoint_Bold',
        fontSize: 20,
        width:'70%',
    },
    price: {
        fontFamily:'sulphurPoint',
        fontSize: 18,
        color: 'green',
        marginTop: 4,
    },
    itemDetails: {
        width:'100%',
        display: 'flex',
        flexDirection: 'column',
        marginLeft: 5,
    },
    clothesDetails: {
        marginLeft: 5,
    },
    text: {
        fontFamily: 'sulphurPoint',
        color: 'rgba(55,55,55,0.7)',
        fontSize: 16
    },
    salePriceText: {
        position:'relative',
        right: '15%',
        fontSize: 18,
        textDecorationLine: 'line-through',
        color: 'gray',
    },





});

export default Home;