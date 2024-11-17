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
    RefreshControl, Modal, TextInput
} from 'react-native';
import {router, useRouter} from "expo-router";
import {useFonts} from "expo-font";
import Constants from "expo-constants";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";


interface Product {
    id: number;
    itemName: string;
    itemPrice: number;
}
const { width } = Dimensions.get('window');
const itemSize = width/3;


const CartPage: React.FC = () => {
    const [user, setUser] = useState({isLoggedIn: false, userToken: null, userEmail: null, firstName: null, userID: null})

    const [products, setProducts] = useState<Product[]>([]);
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalWithShipping, setTotalWithShipping] = useState(0);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [ refresh, setRefresh] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const [discountCode, setDiscountCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(null);
    const [discounts, setDiscounts ] = useState([]);

    const [fontsLoaded] = useFonts({
        'sulphurPoint': require('@assets/fonts/SulphurPoint-Regular.ttf'),
        'sulphurPoint_Bold': require('@assets/fonts/SulphurPoint-Bold.ttf'),
        'sulphurPoint_Light': require('@assets/fonts/SulphurPoint-Light.ttf'),
        'shrikhand': require('@assets/fonts/Shrikhand-Regular.ttf'),
    });

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
                        isLoggedIn: true,
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

    if (!fontsLoaded) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="white" />
            </SafeAreaView>
        );
    }

    useEffect(() => {
        const fetchUserDiscounts = async () => {
            if (!user.userID) {
                console.warn("UserID is null; skipping fetch.");
                return;
            }

            setIsLoading(true);

            try {
                const response = await fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/discounts/${user.userID}`);
                if (!response.ok) {
                    console.log("No Discounts for: ", user.firstName)
                    throw new Error('Failed to fetch discounts data');
                }
                const data = await response.json();

                console.log("Discounts fetched: ", data)

                setDiscounts(data);
            } catch (error) {
                console.error('Error fetching discounts data: ', error);
            } finally {
                setIsLoading(false);
            }
        };
        if(user.userID) {
            console.log(`User ID available, fetching discounts for ${user.firstName}`);
            fetchUserDiscounts();
        }
    }, [user.userID]);

    const shipping = 85;
    const freeShipping = 500;

    const validateCode = (discountCode) => {
        console.log("Discount Code to Validate: ", discountCode)
        console.log("Available Discounts: ", discounts);

        if(!discountCode) {
            Alert.alert("No Discounts available!");
        }
        if (!Array.isArray(discounts) || discounts.length === 0) {
            console.warn("Discounts are not available or empty.");
            return undefined;
        }
        const availableDiscounts = discounts || [];
        const discount = discounts.find(d => d.discountCode === discountCode.trim)

        if (!discount) {
            console.log('Discount not found for code:', discountCode);
        }

        console.log('Available Discounts:', availableDiscounts);
        console.log('Discount Code to Validate:', discountCode);

        if (availableDiscounts) {
            const discount = availableDiscounts.find(d => d.discountCode === discountCode);
            console.log('Found Discount:', discount);
        } else {
            console.error('Available Discounts is undefined or null');
        }

        return discount;
    }

    const handleDiscountSubmit = () => {
        const discount = validateCode(discountCode);

        console.log("Discount: ", discount)

        if (!discount) {
            Alert.alert("Error", "Invalid Discount Code!");
            return;
        }

        setAppliedDiscount(discount);
        Alert.alert(`Discount Applied: ${discount.discountCode}`);
    }

    useEffect(() => {
        const newTotal = cartItems.reduce((sum,item)=>{
            const price = item.inventoryItem.onSale ? Number(item.inventoryItem.salePrice) || 0
                : Number(item.inventoryItem.itemPrice) || 0;
            return sum + price;
            },0);

        let discountedTotal = newTotal;

        if (appliedDiscount) {
            const discountPercent = parseInt(appliedDiscount.discountCode.slice(-2), 10);

            console.log("Discount percent: ", discountPercent)

            if(isNaN(discountPercent)) {
                const discountAmount = (newTotal * discountPercent)/100;
                discountedTotal =  newTotal -  discountAmount;
            }
        }

        const totalWithShipping  =  discountedTotal >= freeShipping ? discountedTotal : discountedTotal + shipping;

        setTotal(discountedTotal);
        setTotalWithShipping(totalWithShipping);
        },[cartItems, appliedDiscount]);

    let isFetching = false;

    const fetchCart= async (isRefresh = false) => {
        if (!user.userID) {
            console.warn("UserID is null; skipping fetch.");
            return;
        }

        if (isFetching) return;
        isFetching = true;

        try {
            console.log("User ID: ", user.userID);
            const response = await fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/cart/${user.userID}`);
            if (!response.ok) {
                console.log("No Cart for: ", user.firstName)
                throw new Error('Failed to fetch cart data');
            }
            const data = await response.json();

            console.log(`Fetched ${user.firstName}'s Cart:`, data);

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
            isFetching = false;
        }
    };

    useEffect(() => {
        if(user.userID){
            console.log("UserID available, fetching cart.");
            setIsLoading(true);
            fetchCart();
        } else {
            console.warn("UserID is null, skipping fetch.");
        }
    }, [user.userID]);

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
                        const userID = user.userID;

                        try{
                            fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/cart/${product.inventoryItem.id}/${userID}`, {
                                method: 'DELETE',
                            })
                                .then(response => response.json())
                                .then(data => {
                                    console.log(`Item removed from ${user.firstName}'s Cart:`, data);
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
            await fetchCart(true);
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

    const openModal  = () => {
        setModalVisible(true)
    };

    const closeModal = () => {
        setModalVisible(false)
    }

    return (
        <ImageBackground
            source={require('@assets/images/TMBackground.png')}
            resizeMode="stretch"
            style={styles.image}>
            <StatusBar barStyle="light-content" backgroundColor="black"/>

            <View style={styles.container}>
                <View style = {styles.content}>
                    <Image source={require('@assets/images/TMPageLogo.png')} style={styles.logo as ImageStyle}/>

                    <View style = { styles.applyDiscountContainer}>
                        <TouchableOpacity style = {styles.submitButton} onPress={openModal}>
                            <View style = {styles.iconContainer}><Image style = {styles.discountCodeIcon} source={require("@assets/images/promo-code.png")}/></View>
                            <Text style = {styles.discountCodeText}>Use Discount Code</Text>
                        </TouchableOpacity>

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={closeModal} // Handle the back button on Android
                        >
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <View style = {styles.couponIconContainer}><Image source={require('@assets/images/coupon.png')} style={styles.couponIcon} /></View>
                                    <TextInput
                                        style={styles.codeInput}
                                        placeholder="Enter Discount Code"
                                        value={discountCode}
                                        onChangeText={setDiscountCode}
                                    />
                                    <View style={styles.dicountCodeButtonsContainer}>
                                        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                                            <Text style={styles.buttonText}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.saveButton}
                                            onPress={handleDiscountSubmit}
                                        >
                                            <Text style={styles.buttonText}>Save</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>


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
        top: '2%',
        left: '5%',
    },
    pageContent: {
        display:'flex',
        flexDirection: 'column',
        height: '45%',
        width: '100%',
        marginBottom: 100,
        bottom: '45%',
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
        padding: 10,
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
        bottom: '58%'
    },
    cartTitle: {
        fontFamily: 'sulphurPoint_Bold',
        color:'#333333',
        fontSize: 22,
        marginLeft: 10
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
        position: "relative",
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
        height: 120,
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
        height: 120,
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
        marginLeft: 10
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
        fontSize: 16,
        width: '55%'
    },
    salePriceText: {
        position:'relative',
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
    },
    submitButton: {
        backgroundColor: '#219281FF',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
        borderRadius: 5,
        height: '25%',
        marginBottom: '10%',
        position: 'relative',
        bottom: '76%'
    },
    discountCodeText: {
        fontSize: 20,
        fontFamily: 'sulphurPoint',
        color: '#93D3AE',
        position: 'relative',
        right: '6%'
    },
    discountCodeIcon: {
        width:'35%',
        height:'50%',
    },
    iconContainer:{
        width:'30%',
        height:'120%',
        alignItems:'center',
        justifyContent:'center',
        position: 'relative',
        left: '0%',
    },
    applyDiscountContainer: {
        marginBottom: 10,
    },
    modalContainer: {
        backgroundColor: 'rgba(255,255,255,0.86)',
        margin: 10,
        padding: 5,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        height: '50%'
    },
    modalContent: {
        alignItems:'center',
        padding:5,
    },
    modalTitle: {
        fontFamily: 'shrikhand',
        fontSize: 25,
        color: "#219281FF"
    },
    couponIconContainer: {
        width: '40%',
        height: '40%',
        marginBottom: 5,
        alignItems:'center',
    },
    couponIcon: {
        width: 70,
        height: 70,
    },
    codeInput: {
        fontFamily: 'sulphurPoint',
        fontSize: 18,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'rgba(28,28,28,0.5)',
        padding: 10,
        paddingLeft: 25,
        paddingRight: 25,
        marginBottom: 10,
    },
    dicountCodeButtonsContainer: {
        flexDirection: 'row',
        marginTop: 10,
        width: 250,
        justifyContent: 'space-evenly',
    },
    closeButton: {
        backgroundColor: '#F9A822',
        alignItems: 'center',
        textAlign: 'center',
        padding: 10,
        paddingLeft:15,
        paddingRight: 15,
        borderRadius: 10,
        marginRight: 23,
    },
    saveButton: {
        alignItems: 'center',
        backgroundColor: '#219281FF',
        padding: 10,
        borderRadius: 10,
        marginLeft: 20,
        paddingLeft:15,
        paddingRight: 15,
    },
    buttonText: {
        fontFamily: 'sulphurPoint',
        fontSize: 22,
        textAlign:'center',
        color: 'white'
    },



    
});

export default CartPage;