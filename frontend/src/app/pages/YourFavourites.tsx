import React, {
    useState,
    useEffect,
    useRef,} from 'react';
import {
    View,
    ImageBackground,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    Image,
    Text,
    Dimensions,
    ActivityIndicator,
    ScrollView,
    ImageStyle,
    TouchableOpacity,
    Modal,
    FlatList,
    Alert,
    Animated,
    Pressable,
    RefreshControl
} from 'react-native';
import  { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import Constants from "expo-constants";
import { router, useRouter} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get('window');
const itemSize = width/3;

const YourFavourites = () => {
    const router = useRouter();

    const [user, setUser] = useState({isLoggedIn: false, userToken: null, userEmail: null, firstName: null, userID: null})

    // Load fonts asynchronously
    const [fontsLoaded] = useFonts({
        'sulphurPoint': require('@assets/fonts/SulphurPoint-Regular.ttf'),
        'sulphurPoint_Bold': require('@assets/fonts/SulphurPoint-Bold.ttf'),
        'sulphurPoint_Light': require('@assets/fonts/SulphurPoint-Light.ttf'),
        'shrikhand': require('@assets/fonts/Shrikhand-Regular.ttf'),
    });

    const [isFavourited, setIsFavourited] = useState({});
    const [playHeartAnimation, setPlayHeartAnimation] = useState({});
    const [isAddedToCart, setAddedToCart] = useState({});
    const [playCartAnimation, setPlayCartAnimation] = useState({});
    const [isCartAnimationCompleted, setIsCartAnimationCompleted] = useState({});

    const [inventoryItems, setInventoryItems ] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const [likedItems, setLikedItems] = useState([]);

    const [isItemModalVisible, setIsItemModalVisible] = useState(false); // Main item modal
    const [isImageModalVisible, setIsImageModalVisible] = useState(false); // Image modal
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

    // If fonts are not loaded, show a loading indicator within the component itself
    if (!fontsLoaded) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="white" />
            </SafeAreaView>
        );
    }

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


    //saving liked items to table
    const toggleFavourite = (id) => {
        console.log(`Toggling Favourite for ${id}`);

        if (!id) {
            console.error("Item ID is missing");
            return;
        }

        if (typeof id === 'undefined') {
            console.error('ID is undefined');
            return;
        }

        if (isFavourited[id]) {
            console.log("Attempting to remove like:", { itemID: id, userID: user.userID });

            fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/likes/${id}/${user.userID}`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(data => {
                    console.log("Item removed from ${user.firstName}'s likes:", data);
                    setLikedItems(prevLikedItems  => prevLikedItems.filter(item => item.id !== id));
                    setIsFavourited(prev => ({
                        ...prev,
                        [id]: false,
                    }));
                    Alert.alert('Success', 'Item removed from your Likes. ');
                    fetchLikes();
                })
                .catch(error => {
                    console.error("Error removing from 'Likes': ", error);
                });
        }else{
            console.log("Item is not liked yet, no action taken");
        }
    }


    //saving cart items to table
    const toggleCart = (id) => {
        console.log(`Toggling cart for ${id}`);

        if (!id) {
            console.error("Item ID is missing");
            return;
        }

        if (typeof id === 'undefined') {
            console.error('ID is undefined');
            return;
        }

        const newAddedToCart = !isAddedToCart[id];

        setAddedToCart((prev) => ({
            ...prev,
            [id]: newAddedToCart,
        }));

        if (newAddedToCart) {
            console.log("Attempting to add to ${user.firstName}'s cart:", { itemID: id, userID: user.userID });

            setPlayCartAnimation((prev) => ({
                ...prev,
                [id]: true,
            }))

            setCartItems((prevCartItems = []) => {
                const existingItem = prevCartItems.some(item => item.id === id);
                if (!existingItem) {
                    console.log("Attempting to add to cart:", {itemID: id, userID: user.userID});

                    fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/cart`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': "application/json",
                        },
                        body: JSON.stringify({itemID: id, userID: user.userID}),
                    })
                        .then(response => response.json())
                        .then((data) => {
                            console.log('Item added to cart:', data);
                            if (data && data.item) {
                                setCartItems((prevCartItem) => [...prevCartItems, {id}]);
                                setAddedToCart(prev =>({...prev, [id]:true}))
                            }
                        })
                        .catch(error => {
                            console.error("Error adding to 'Cart': ", error);
                        });
                }
            });
        } else {

            console.log(`Removing item ${id} from cart`);

            setPlayCartAnimation((prev) => ({
                ...prev,
                [id]: false
            }))

            fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/cart/${id}/${user.userID}`, {
                method: 'DELETE',
            })
                .then((response) => response.json())
                .then(() => {
                    setCartItems((prevCartItems = [])  => prevCartItems.filter(item => item.id != id));
                    setAddedToCart((prev) => ({
                        ...prev,
                        [id]: false,
                    }));
                }).catch(error => {
                console.error("Error removing from 'Cart': ", error);
            });
        }
    }

    const handleAnimationFinish = (id) => {
        setIsCartAnimationCompleted((prev) => ({
            ...prev,
            [id]: true,
        }));
        setPlayCartAnimation((prev) => ({
            ...prev,
            [id]: false,
        }));
    }

    // fetch likes from Table
    const fetchLikes = async () => {
        try {
            const response = await fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/likes?userID=${user.userID}`);
            const data = await response.json();

            console.log(`Fetched ${user.firstName}'s Likes:`, data);

            if(!Array.isArray(data)){
                console.error("Fetched data is not in an array: ", data);
                setLikedItems([]);
            }else {
                setLikedItems(data);
            }
        } catch (error) {
            console.error("Error fetching 'Likes': ", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchLikes();
    }, []);

    useEffect(() => {
        const updatedIsFavourited = {};

        likedItems.forEach(item => {
            updatedIsFavourited[item.unit.id] = true;
        });

        setIsFavourited(updatedIsFavourited);
    }, [likedItems]);

    if(isLoading){
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    const saleItems =  inventoryItems.filter(item => item.onSale)||[];


    const toggleItemModal = (item:any) => {
        setSelectedItem(item);
        setIsItemModalVisible(!isItemModalVisible);
    };

    const openImageModal = (index:any) => {
        setSelectedImageIndex(index);
        setIsImageModalVisible(true);
    };

    const closeImageModal = () => {
        setIsImageModalVisible(false);
    };

    const images = selectedItem ? [
        { uri: selectedItem.mainImage },
        { uri: selectedItem.image2 },
        { uri: selectedItem.image3 }] : [];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={fetchLikes}
                    />
                }
                contentContainerStyle={styles.scrollViewContent}
            >
                <StatusBar barStyle="light-content" backgroundColor="black"/>

                <ImageBackground
                    source = {require('@assets/images/TMBackground.png')}
                    resizeMode="stretch"
                    style = {styles.image}>
                    <View style={styles.favsContainer}>
                        <Image source={require('@assets/images/TMPageLogo.png')} style={styles.logo as ImageStyle}/>

                        <View style={styles.favsGridContainer}>
                            {/*Recommended Row*/}
                            <View style={styles.favesRow}>
                                <View style = {styles.exitRow}>
                                    <Text style={styles.titleText}>Your Favourites</Text>

                                </View>

                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <View style={styles.favsImages}>
                                        {likedItems.slice(0, 10).map((likedItem) => (
                                            <TouchableOpacity key={likedItem.id} onPress={() => toggleItemModal(likedItem)} >
                                                <View key={likedItem.id} style={styles.imageContainer}>
                                                    <Image style={styles.clothesImage}
                                                           source={{uri: likedItem.unit.mainImage}}/>

                                                    {likedItem.unit.onSale && (
                                                        <View style={styles.discountBanner}>
                                                            <Text style={styles.discountText}>
                                                                {`Now R${likedItem.unit.salePrice}`}
                                                            </Text>
                                                        </View>
                                                    )}

                                                    <View style={styles.actionButtons}>
                                                        <TouchableOpacity onPress={() => toggleFavourite(likedItem.unit.id)}>
                                                            <Icon
                                                                name={isFavourited[likedItem.unit.id] ? 'heart' : 'heart-outline'}
                                                                style={[
                                                                    styles.staticHeart,
                                                                    isFavourited[likedItem.unit.id] && styles.filledHeart,
                                                                ]}
                                                                size={30}
                                                            />
                                                        </TouchableOpacity>

                                                        <TouchableOpacity onPress={() => toggleCart(likedItem.unit.id)}>
                                                            {isAddedToCart[likedItem.unit.id] && playCartAnimation[likedItem.unit.id] ? (
                                                                <LottieView
                                                                    source={require('@assets/animations/cartAnimation.json')}
                                                                    autoPlay
                                                                    loop={false}
                                                                    onAnimationFinish={() => handleAnimationFinish(likedItem.unit.id)}
                                                                    style = { styles.cartAnimation }
                                                                />
                                                            ) : (
                                                                <Icon
                                                                    name={isAddedToCart[likedItem.unit.id] ? 'checkmark-circle' : 'cart-outline'}
                                                                    style={[
                                                                        styles.staticCart,
                                                                        isAddedToCart[likedItem.unit.id] && styles.filledCart
                                                                    ]}
                                                                    size={32}
                                                                />
                                                            )}
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                        <View style = {styles.addMore}>
                                            <CustomButton  path="(tabs)/HomeScreen" navigateTo={navigateTo} />
                                        </View>
                                    </View>
                                </ScrollView>

                            </View>


                            {/*when you click on an item*/}
                            {selectedItem && (
                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    visible={isItemModalVisible}
                                    onRequestClose={() => setIsItemModalVisible(false)}
                                >
                                    <View style={styles.modalContainer}>
                                        <View>
                                            <TouchableOpacity
                                                style={styles.closeButton}
                                                onPress={() => setIsItemModalVisible(false)}
                                            >
                                                <Icon name="chevron-forward-outline" style={styles.backIcon} size={30} />
                                                <Text style={styles.closeButtonText}>Back to Home</Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={styles.modalContent}>
                                            <View style={styles.titleRow}>
                                                <View style = { styles.modalTitleContainer}>
                                                    <Text style={styles.modalTitle}>{selectedItem.unit.itemName}</Text>
                                                </View>

                                                <Text
                                                    style={[
                                                        styles.modalTitlePrice,
                                                        selectedItem.unit.onSale && styles.salePriceText
                                                    ]}
                                                >
                                                    {`R${selectedItem.unit.itemPrice}`}
                                                </Text>

                                            </View>
                                            <View style={styles.separator} />

                                            <View style={styles.imageGrid}>
                                                {/* Trigger the image modal when any image is clicked */}
                                                <TouchableOpacity onPress={() => openImageModal(0)}>
                                                    <View style={styles.modalImage}>
                                                        {selectedItem.unit.onSale && (
                                                            <View style={styles.discountBanner}>
                                                                <Text style={styles.discountText}>
                                                                    {`Now R${selectedItem.unit.salePrice}`}
                                                                </Text>
                                                            </View>
                                                        )}
                                                        <Image style={styles.modalImage} source={{ uri: selectedItem.unit.mainImage }} />
                                                    </View>
                                                </TouchableOpacity>
                                                <View style={styles.imagesLeft}>
                                                    <TouchableOpacity onPress={() => openImageModal(1)}>
                                                        <Image style={styles.modalImage2} source={{ uri: selectedItem.unit.image2 }} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => openImageModal(2)}>
                                                        <Image style={styles.modalImage3} source={{ uri: selectedItem.unit.image3 }} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>

                                            {/* Additional item details and buttons */}
                                            <View style={styles.separator} />
                                            <View style={styles.itemInfo}>
                                                <View style={styles.topRow}>
                                                    <Text style={styles.modalInfoTitle}>{selectedItem.unit.itemName}</Text>
                                                    <Text style={styles.modalInfoSKU}>{`Ref: ${selectedItem.unit.SKU}`}</Text>
                                                </View>
                                                <Text style={styles.modalInfo}>{`Colour: ${selectedItem.unit.colour}`}</Text>
                                                <Text style={styles.modalInfo}>{`Size: ${selectedItem.unit.size}`}</Text>
                                                <Text style={styles.modalInfo}>{`Damage: ${selectedItem.unit.damage}`}</Text>
                                                <Text style={styles.modalDescription}>{selectedItem.unit.description}</Text>
                                            </View>
                                            <View style={styles.modalActionButtons}>
                                                <TouchableOpacity onPress={() => toggleFavourite(selectedItem.unit.id)} style={styles.modalLikeButton}>
                                                    {isFavourited[selectedItem.unit.id] && playHeartAnimation[selectedItem.unit.id] ? (
                                                        <LottieView
                                                            source={require('@assets/animations/likeButtonAnimation.json')}
                                                            autoPlay
                                                            loop={false}
                                                            onAnimationFinish={() =>
                                                                setPlayHeartAnimation((prev) => ({
                                                                    ...prev,
                                                                    [selectedItem.unit.id]: false,
                                                                }))
                                                            }
                                                            style={styles.likeAnimation}
                                                        />
                                                    ) : (
                                                        <Icon
                                                            name={isFavourited[selectedItem.unit.id] ? 'heart' : 'heart-outline'}
                                                            style={[
                                                                styles.staticHeartModal,
                                                                isFavourited[selectedItem.unit.id] && styles.filledHeartModal,
                                                            ]}
                                                            size={45}
                                                        />
                                                    )}
                                                </TouchableOpacity>


                                                <TouchableOpacity onPress={() => toggleCart(selectedItem.unit.id)} style={styles.addToCartButton}>
                                                    {isAddedToCart[selectedItem.unit.id] && playCartAnimation[selectedItem.unit.id] ? (
                                                        <LottieView
                                                            source={require('@assets/animations/cartAnimation.json')}
                                                            autoPlay
                                                            loop={false}
                                                            onAnimationFinish={() => handleAnimationFinish(selectedItem.unit.id)}
                                                            style = { styles.cartAnimationModal }
                                                        />
                                                    ) : (
                                                        <Icon
                                                            name={isAddedToCart[selectedItem.unit.id] ? 'checkmark-circle' : 'cart-outline'}
                                                            style={[
                                                                styles.staticCartModal,
                                                                isAddedToCart[selectedItem.unit.id] && styles.filledCartModal
                                                            ]}
                                                            size={32}
                                                        />
                                                    )}
                                                    <Text style={styles.addToCartText}>
                                                        {isAddedToCart[selectedItem.unit.id] ? 'Added to cart' : 'Add to cart'}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </Modal>
                            )}
                            {/* Image modal - Separate from the main item modal */}
                            <Modal
                                visible={isImageModalVisible}
                                transparent={true}
                                onRequestClose={closeImageModal}
                            >
                                <View style={styles.modalBackground}>
                                    <TouchableOpacity
                                        style={styles.closeImageButton}
                                        onPress={closeImageModal}
                                    >
                                        <Text style={styles.closeImageButtonText}>
                                            <Icon name="close-outline" size={45} />
                                        </Text>
                                    </TouchableOpacity>

                                    {/* FlatList to scroll through images */}
                                    <FlatList
                                        data={images}
                                        horizontal
                                        pagingEnabled
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(_, index) => index.toString()}
                                        renderItem={({ item }) => (
                                            <Image style={styles.fullscreenImage} source={item} />
                                        )}
                                        initialScrollIndex={selectedImageIndex}
                                        getItemLayout={(data, index) => (
                                            { length: width, offset: width * index, index }
                                        )}
                                    />
                                </View>
                            </Modal>
                        </View>
                    </View>
                </ImageBackground>
            </ScrollView>
        </SafeAreaView>
    );
}

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
        <Animated.View style={{transform: [{scale: scaleAnim}]}}>
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={() => {
                    console.log(`Navigating to: ${path}`);
                    navigateTo(path);
                }}
                style={styles.button}
            >
                <Icon
                    name={'add-circle'}
                    style={[
                        styles.addMoreButton,
                    ]}
                    size={50}
                />
            </Pressable>
        </Animated.View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#93D3AE',
    },
    image: {
         flex: 1,
        justifyContent: 'center',
        width: '100%',
    },
    favsContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        position: 'relative',
        bottom: '17%'
    },

    logo: {
        resizeMode: 'contain' as ImageStyle['resizeMode'],
        width: 260,
        position:'relative',
        right: '12%',
        bottom: '47%'
    },

    //all the rows and titles
    favsGridContainer: {
        padding: 15,
        width: '90%',
        position: "absolute",
        top: '16%',
        backgroundColor: 'rgba(255,255,255,0.75)',
        borderRadius: 10,
    },
    //each row of images
    favsImages: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
    },
    //each image
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
        margin: 5,
    },
    exitRow: {
        flexDirection: 'row'
    },
    titleText: {
        fontFamily: 'shrikhand',
        fontSize: 25,
        color: '#219281FF',
        marginLeft: 10,
        paddingBottom:'2%',
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    titleRow: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    modalContent: {
        width: '90%',
        height: 'auto',
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitleContainer: {
        width: '80%'
    },
    modalTitle: {
        fontFamily: 'sulphurPoint_Bold',
        color:'#212121',
        fontSize: 24,
        marginBottom: 5,
    },
    modalTitlePrice: {
        fontFamily: 'sulphurPoint_Bold',
        color:'#212121',
        fontSize: 24,
        marginBottom: 5,
    },
    salePriceText: {
        position:'relative',
        right: '15%',
        top:'1%',
        fontSize: 16,
        textDecorationLine: 'line-through',
        color: 'gray',
    },

    imageGrid: {
        width: '95%',
        height:250,
        flexDirection: 'row-reverse',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 25,
    },
    modalImage: {
        width: 170,
        height: '100%',
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 10,

    },
    imagesLeft: {
        flexDirection: 'column',
        width:'45%',
        marginRight: 10
    },
    modalImage2: {
        width: '100%',
        height:135,
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 10,
    },
    modalImage3: {
        width: '100%',
        height: 105,
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 10,
    },
    itemInfo: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    topRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        marginBottom: 20
    },
    modalInfoTitle: {
        fontFamily: 'sulphurPoint',
        fontSize: 21,
        color:'#212121',
    },
    modalInfoSKU: {
        fontFamily: 'sulphurPoint',
        color: '#63656B',
        fontSize: 13,
    },
    modalInfo: {
        fontFamily: 'sulphurPoint',
        color: '#63656B',
        marginBottom: 15,
        fontSize: 17,
    },
    modalDescription: {
        fontFamily: 'sulphurPoint',
        color: '#63656B',
        marginBottom: 25,
        fontSize: 19,
        marginTop: 15,
    },
    modalActionButtons: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    addToCartButton: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#219281FF',
        padding: 10,
        paddingLeft: 25,
        paddingRight: 25,
        borderRadius: 10,
    },
    addToCartText: {
        color: '#93D3AE',
        fontFamily: 'sulphurPoint',
        fontSize: 22,
        marginLeft: '10%'
    },
    modalLikeButtonIcon: {
        color: '#212121'
    },

    closeButton: {
        width: 350,
        display:'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
    },
    backIcon: {
        transform: [{ rotate: '180deg' }],
        color: '#93D3AE',
    },
    closeButtonText: {
        fontFamily: 'sulphurPoint',
        color: '#93D3AE',
        fontSize: 20
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(55,55,55,0.18)',
        marginVertical: 10,
        width: '100%',
    },
    modalBackground: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeImageButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1,
    },
    closeImageButtonText: {
        backgroundColor: '#93D3AE',
        color: '#219281FF',
        fontSize: 16,
        borderRadius: 50
    },
    fullscreenImage: {
        width: width,
        height: width,
        resizeMode: 'contain',
    },
    imageModalContainer: {
        backgroundColor: 'red'
    },
    heartAnimation: {
        width:115,
        height: 115,
        display: 'flex',
        flexDirection: 'row',
        position: "absolute",
        zIndex: 2,
        left: -43,
        bottom: -40
    },
    cartAnimation: {
        width:40,
        height: 40,
        display: 'flex',
        flexDirection: 'row',
        position: "relative",
        zIndex: 2,
        right: '-20%',
        bottom: '12%',
        //backgroundColor: 'green'
    },
    actionButtons: {
        width: '50%',
        height:'20%',
        display: 'flex',
        flexDirection: 'row',
        position: "absolute",
        zIndex: 2,
        justifyContent: 'space-between',
        left:'50%',
        top:'80%'
    },
    staticHeart: {
        position: 'absolute',
        zIndex: 3,
        left: 2,
        color: "#93D3AE",
    },
    filledCart:{
        color: '#219281FF',
        position: 'relative',
        bottom: '4%'
    },
    filledHeart: {
        color: '#FF0000',
    },
    staticCart: {
        color: "#93D3AE",
    },
    filledHeartModal:{
        color: '#FF0000',

    },
    staticHeartModal:{
        color: "#93D3AE",

    },
    likeAnimation: {
        width:200,
        height: 200,
        position: "absolute",
        zIndex: 2,
        bottom: -100,
        left: -77
    },
    staticCartModal: {
        color: "#93D3AE",

    },
    filledCartModal: {
        color: "#93D3AE",
    },
    cartAnimationModal: {
        width:35,
        height: 35,
        display: 'flex',
        flexDirection: 'row',
        position: "relative",
        zIndex: 2,
        right: '0%',
        bottom: 0,
    },
    addMore: {
        backgroundColor: 'rgba(147,211,174,0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 170,
        width: itemSize,
        borderRadius: 5,
        resizeMode: 'cover' as ImageStyle['resizeMode'],
        margin: 5,

    },
    addMoreButton: {
        color: '#219281FF',

    },
    favesRow: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    scrollViewContent: {
        flexGrow: 1
    }

});


export default YourFavourites;
