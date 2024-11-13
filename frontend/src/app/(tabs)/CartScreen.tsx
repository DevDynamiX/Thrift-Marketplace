import React, {useEffect, useState, useContext, useRef} from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Button,
    Alert,
    ImageBackground,
    SafeAreaView,
    ActivityIndicator,
    ScrollView,
    StatusBar,
    Image,
    ImageStyle,
    TouchableOpacity,
    Dimensions,
    RefreshControl, Animated, Pressable
} from 'react-native';
import {router, useRouter} from "expo-router";
import {sum} from "@firebase/firestore";
import {useFonts} from "expo-font";
import Constants from "expo-constants";
import Icon from "react-native-vector-icons/Ionicons";
import {async} from "@firebase/util";

interface Product {
    id: number;
    itemName: string;
    itemPrice: number;
}
const { width } = Dimensions.get('window');
const itemSize = width/3;


const CartPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalWithShipping, setTotalWithShipping] = useState(0);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [ refresh, setRefresh] = useState(false);

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

    const shipping = 85;
    const freeShipping = 500;

    useEffect(() => {
        const newTotal = cartItems.reduce((sum,item)=>{
            const price = item.inventoryItem.onSale ? Number(item.inventoryItem.salePrice) || 0 : Number(item.inventoryItem.itemPrice) || 0;
            return sum + price;
            },0);

        const totalWithShipping  =  newTotal >= freeShipping ? newTotal : newTotal + shipping;

        setTotal(newTotal);
        setTotalWithShipping(totalWithShipping);
        },[cartItems]);


    const fetchCart= async () => {
        setIsLoading(true);
        //TODO: GET USER ID
        const userID = '1';
        try {
            const response = await fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/cart?userID=${userID}`);
            const data = await response.json();

            console.log("Fetched Cart:", data);

            if(Array.isArray(data)) {
                setCartItems(data);
            }else if (data){
                setCartItems([data]);
            }else{
                setCartItems([])
            }
        } catch (error) {
            console.error("Error fetching 'Cart': ", error);
            setCartItems([]);
        } finally {
            setIsLoading(false);
        }

    };

    useEffect(() => {
        fetchCart();
    }, []);

    const addToCart = (newItem) => {
        setCartItems(prevCartItems => [...prevCartItems, newItem]);
    };

    const removeFromCart = async (product)=>{

        Alert.alert('Remove Item', `Are you sure you want to remove "${product.inventoryItem.itemName}" from your Cart?`,
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Action cancelled"),
                    style: 'cancel',
                },
                {
                    text: 'Remove',
                    onPress: async () => {
                        const userID = '1';

                        try{
                            fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/cart/${product.inventoryItem.id}/${userID}`, {
                                method: 'DELETE',
                            })
                                .then(response => response.json())
                                .then(data => {
                                    console.log('Item removed from Cart:', data);
                                    setCartItems(prevCartItems  => prevCartItems.filter(item => item.id !== product.id));
                                    Alert.alert('Removed from Cart', `"${product.inventoryItem.itemName}" has been removed from your cart.`);
                                    fetchCart();
                                })
                                .catch(error => {
                                    console.error("Error removing from 'Cart': ", error);
                                });
                        }catch (error){
                            console.error("Error removing item from cart:", error);
                            Alert.alert('Error', 'Something went wrong while removing the item from your cart.');
                        }
                    },
                },
            ],
            {cancelable: true}
        );
    }

    const goToCart = () =>{
        router.push({
            pathname:'auth/PayGate',
            params:{totalWithShipping},
        });
    };

    const goHome = () =>{
        router.push({
            pathname:'(tabs)/HomeScreen',
        });
    };

    const handleRefresh = async () => {
        setRefresh(true);
        try{
            await fetchCart();
        } catch (error){
            console.error("Failed to refresh cart. ", error);
            Alert.alert('Error', 'Could not refresh cart.');
        }finally{
            setRefresh(false);
        }
    }


    const images = products ? [
        { uri: products.mainImage },
        { uri: products.image2 },
        { uri: products.image3 }] : [];


    const renderItem = ({ item }) => (
        <View style={styles.productCard}>
            <View style = {styles.itemHeaderLine}>
                <Text style={styles.name}>{item.inventoryItem.itemName}</Text>
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
                    <View key={item.inventoryItem.id} style={styles.imageContainer}>
                        <Image style={styles.clothesImage}
                               source={{uri: item.inventoryItem.mainImage}}/>

                        {item.inventoryItem.onSale && (
                            <View style={styles.discountBanner}>
                                <Text style={styles.discountText}>
                                    {`Now R${item.inventoryItem.salePrice}`}
                                </Text>
                            </View>
                        )}
                    </View>

                    <View style = {styles.itemDetails} >
                        <View style = {styles.itemNamePrice}>
                            <Text style={styles.itemName}>{item.inventoryItem.itemName}</Text>
                            <Text
                                style={[
                                    styles.price,
                                    item.inventoryItem.onSale && styles.salePriceText
                                ]}
                            >
                                {`R${item.inventoryItem.itemPrice}`}
                            </Text>
                        </View>

                        <View style = {styles.clothesDetails}>
                            <Text style={styles.text}>Colour: {item.inventoryItem.colour}</Text>
                            <Text style={styles.text}>Size: {item.inventoryItem.size}</Text>
                            <Text style={styles.text}>Damage: {item.inventoryItem.damage}</Text>
                        </View>
                    </View>
                </View>
        </View>
    );

    console.log("These are Cart Items: ", cartItems)

    return (
        <ImageBackground
            source={require('@assets/images/TMBackground.png')}
            resizeMode="stretch"
            style={styles.image}>
            <StatusBar barStyle="light-content" backgroundColor="black"/>

            <View style={styles.container}>
                <View style = {styles.content}>
                    <Image source={require('@assets/images/TMPageLogo.png')} style={styles.logo as ImageStyle}/>

                    <View style={styles.pageContent}>
                        {cartItems.length === 0 ? (
                            <ScrollView
                                contentContainerStyle={styles.emptyCartContainer}
                                refreshControl={
                                    <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
                                }>
                                <View style={styles.cartEmptyContainer}>
                                    <Text style={styles.emptyCartText}>Your cart is empty!</Text>
                                    <Icon name="sad-outline" size={30} color="#219281FF" />
                                </View>
                                <TouchableOpacity style={styles.buyNowButton} onPress={() => goHome()}>
                                    <Text style={styles.buttonText}> Buy? </Text>
                                    <Icon style={styles.happyIcon} name="happy-outline" size={30} color="#93D3AE" />
                                </TouchableOpacity>
                            </ScrollView>
                        ) : (
                            <FlatList
                                data={cartItems}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.inventoryItem.id.toString()}
                                contentContainerStyle={styles.cartList}
                                showsVerticalScrollIndicator={false}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refresh}
                                        onRefresh={handleRefresh}
                                    />
                                }
                            />
                        )}
                    </View>

                    <View style={styles.cartContainer}>
                        <Text style={styles.cartTitle}>Checkout: </Text>

                        <View style={styles.separator} />

                        <View style={styles.paymentDetails}>
                            <View style = {styles.paymentDetailsContainer}>
                                <Text style = {styles.text}>Your Cart Subtotal: </Text>
                                <Text style  = {styles.text}>R{Number(total).toFixed(2)}</Text>
                            </View>

                            {/*TODO: if total is over 500 its free*/}
                            <View style = {styles.paymentDetailsContainer}>
                                <Text style = {styles.text}>Shipping Fees: </Text>
                                <Text style  = {styles.text}>
                                    R{total >= 500 ? '0.00' : '85.00'}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.separator} />

                        <View style = {styles.totalContainer}>
                            <Text style={styles.totalText}>
                                R{cartItems.length === 0 ? '0.00' : Number(totalWithShipping).toFixed(2)}
                            </Text>
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
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        position: 'relative',
        bottom: '18%'
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    content: {
        width:'90%',
        height: '100%',
        position: "relative",
        bottom: '18%',
        left: '5%',
    },
    pageContent: {
        display:'flex',
        flexDirection: 'column',
        height: '54%',
        width: '100%',
        marginBottom: 50
    },

    productCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        padding: 10,
        marginBottom: 10,
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
        position: 'relative',
        bottom: 70
    },
    cartTitle: {
        fontFamily: 'sulphurPoint_Bold',
        color:'#333333',
        fontSize: 20,
    },
    cartItem: {
        fontFamily: 'sulphurPoint',
        textAlign: 'right',
        color:'green',
        fontSize: 12,
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
        padding: 5,
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
    noCartItem:{
        fontFamily: 'sulphurPoint',
        fontSize: 16,
        color: '#FF0000',
        textAlign: 'center',

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
        paddingLeft: 15,
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
    cartEmptyContainer:{
        flexDirection: 'row',
        alignItems:'center',
        margin:10
    },
    emptyCartContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        padding: 10,
        borderRadius: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,

    },
    emptyCartText: {
        fontFamily: 'sulphurPoint',
        color: '#219281FF',
        fontSize: 26,
        margin: 10,
    },
    buyNowButton: {
        flexDirection: 'row',
        backgroundColor: '#219281FF',
        paddingVertical: 15,
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
    },
    buttonText: {
        fontFamily: 'sulphurPoint',
        fontSize: 26,
        fontWeight: '600',
        color: '#93D3AE',
        marginLeft: 10,
    },
    happyIcon:{
        paddingLeft: 10
    }






});

export default CartPage;