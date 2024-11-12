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
    RefreshControl
} from 'react-native';
import  { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import Constants from "expo-constants";

import {boolean} from "yup";
import AsyncStorage from '@react-native-async-storage/async-storage';
import items from "ajv/lib/vocabularies/applicator/items";

interface Product {
    id: number;
    itemName: string;
    itemPrice: number;
    salePrice: number;
}

const { width } = Dimensions.get('window');
const itemSize = width/3;


const HomeScreen = React.memo(() => {

    // Load fonts asynchronously
    const [fontsLoaded] = useFonts({
        'montserrat': require('@assets/fonts/Montserrat-VariableFont_wght.ttf'),
        'montserrat_Italic': require('@assets/fonts/Montserrat-Italic-VariableFont_wght.ttf'),
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
    const [isLoading, setIsLoading] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [likedItems, setLikedItems] = useState([]);

    const recommendedScrollRef = useRef(null);
    const [recommendedScrollX, setRecommendedScrollX] = useState(0);
    const saleScrollRef = useRef(null);
    const [saleScrollX, setSaleScrollX] = useState(0);
    const newInScrollRef = useRef(null);
    const [newInScrollX, setNewInScrollX] = useState(0);

    const [isItemModalVisible, setIsItemModalVisible] = useState(false); // Main item modal
    const [isImageModalVisible, setIsImageModalVisible] = useState(false); // Image modal
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // If fonts are not loaded, show a loading indicator within the component itself
    if (!fontsLoaded) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="white" />
            </SafeAreaView>
        );
    }

    //saving liked items to table
    const toggleFavourite = (id) => {
        console.log(`Toggling favourite for ${id}`);

        if (!id) {
            console.error("Item ID is missing");
            return;
        }

        if (typeof id === 'undefined') {
            console.error('ID is undefined');
            return;
        }

        const newIsFavourited = !isFavourited[id];

        setIsFavourited((prev) => ({
            ...prev,
            [id]: newIsFavourited,
        }));

        if (newIsFavourited) {
            setPlayHeartAnimation((prev) => ({
                ...prev,
                [id]: true,
            }));

            console.log("Attempting to add like:", {itemID: id, userID: 1 });

            setLikedItems((prevLikedItems = []) => {
                const likedItem = prevLikedItems.some(item => item.id === id);

                if (!likedItem) {

                    // TODO: get userID from session

                    fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/likes`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': "application/json",
                        },
                        body: JSON.stringify({ itemID: id, userID: 1 }),
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Item added to likes:', data);
                            if(data && data.likes) {
                                console.log("Likes found: ", data.likes);
                                setLikedItems((prevLikedItem) => [...prevLikedItems, {id}]);
                            } else {
                                console.error('Unexpected response data: ', data);
                            }
                        })
                        .catch(error => {
                            console.error("Error adding to 'Likes': ", error);
                        });
                }
            });
        } else {
            setPlayHeartAnimation((prev) => ({
                ...prev,
                [id]: false,
            }));

            //TODO: change to userID
            fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/likes/${id}/1`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Item removed from likes:', data);
                    setLikedItems(prevLikedItems  => prevLikedItems.filter(item => item.id != id));
                })
                .catch(error => {
                    console.error("Error removing from 'Likes': ", error);
                });
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
            console.log("Attempting to add to cart:", { itemID: id, userID: 1 });

            setPlayCartAnimation((prev) => ({
                ...prev,
                [id]: true,
            }))

            setCartItems((prevCartItems = []) => {
                const existingItem = prevCartItems.some(item => item.id === id);
                if (!existingItem) {
                        console.log("Attempting to add to cart:", {itemID: id, userID: 1});

                        // TODO: get userID from session
                        fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/cart`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': "application/json",
                            },
                            body: JSON.stringify({itemID: id, userID: 1}),
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

            //TODO: change to userID
            fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/cart/${id}/1`, {
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

    // const fetchCartItems = async () => {
    //     const userID = '1'; // Replace with actual user ID logic
    //     try {
    //         const response = await fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/cart/${userID}`);
    //         const data = await response.json();
    //         console.log("Fetched Cart Items:", data);
    //         setCartItems(data.items); // Set cart items from the response
    //
    //         // Set the cart state to reflect if the item is in the cart
    //         const updatedIsAddedToCart = {};
    //         data.items.forEach(item => {
    //             updatedIsAddedToCart[item.id] = true; // Mark the item as in the cart
    //         });
    //         setAddedToCart(updatedIsAddedToCart); // Update the cart state
    //     } catch (error) {
    //         console.error("Error fetching cart items:", error);
    //     }
    // };

// Fetch cart items when the component mounts
//     useEffect(() => {
//         fetchCartItems();
//     }, []);

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

    //render error could be here
    //fetch inventory from Table
    const fetchInventory = async () => {
        try {
            const response = await fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/inventory`);
            const data = await response.json();
            console.log("Fetched data:", data);
            setInventoryItems(data);
        } catch (error) {
            console.error("Error fetching inventory: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchInventory().finally(() => setIsLoading(false));
    }, []);

    // fetch likes from Table
    const fetchLikes = async () => {
        //TODO: GET USER ID
        const userID = '1';
        try {
            const response = await fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/likes?userID=${userID}`);
            const data = await response.json();
            console.log("Fetched Likes:", data);
            setLikedItems(data);

            const updatedIsFavourited = {};

            data.forEach(item => {
                updatedIsFavourited[item.unit.id] = true;
            });
            setIsFavourited(updatedIsFavourited);

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

    const saleItems =  inventoryItems.filter(item => item.onSale)||[];

    const handleScrollRight = (scrollRef:any, currentScrollX:any, setScrollX:any) => {
        if (scrollRef.current) {
            const newScrollPosition = currentScrollX + 100;
            scrollRef.current.scrollTo({ x: newScrollPosition, animated: true });
            setScrollX(newScrollPosition);
        }
    };

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
                            onRefresh={fetchInventory}
                        />
                    }
                >
                    <StatusBar barStyle="light-content" backgroundColor="black"/>

                    <ImageBackground
                        source={require('@assets/images/TMBackground.png')}
                        resizeMode="stretch"
                        style={styles.image}>
                        <Text>.</Text>
                            <View style={styles.MainContainer}>
                            <Image source={require('@assets/images/TMPageLogo.png')} style={styles.logo as ImageStyle}/>

                            {/*TODO: Filter by gender*/}
                            <View style={styles.rowsContainer}>
                                {/*Recommended Row*/}
                                <View style={styles.clothesRow}>
                                    <Text style={styles.headerText}>Recommended for you</Text>
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        ref={recommendedScrollRef}
                                        onScroll={(event) => setRecommendedScrollX((event.nativeEvent.contentOffset.x))}
                                        scrollEventThrottle={16}
                                        style={{flexGrow: 0}}
                                        testID = "recommendedScrollView"
                                    >
                                        <View style={styles.RowImages}>
                                            {inventoryItems.slice(0, 10).map((item) => (
                                                <TouchableOpacity key={item.id} onPress={() => toggleItemModal(item)} testID = {`recommendedItem-${item}`}>
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

                                                        <View style={styles.actionButtons}>
                                                            <TouchableOpacity onPress={() => toggleFavourite(item.id)}>
                                                                {isFavourited[item.id] && playHeartAnimation[item.id] ? (
                                                                    <LottieView
                                                                        source={require('@assets/animations/likeButtonAnimation.json')}
                                                                        autoPlay
                                                                        loop={false}
                                                                        onAnimationFinish={() =>
                                                                            setPlayHeartAnimation((prev) => ({
                                                                            ...prev,
                                                                            [item.id]: false,
                                                                        }))
                                                                        }
                                                                        style={styles.heartAnimation}
                                                                    />
                                                                ) : (
                                                                    <Icon
                                                                        name={isFavourited[item.id] ? 'heart' : 'heart-outline'}
                                                                        style={[
                                                                            styles.staticHeart,
                                                                            isFavourited[item.id] && styles.filledHeart,
                                                                        ]}
                                                                        size={30}
                                                                    />
                                                                )}
                                                            </TouchableOpacity>

                                                            <TouchableOpacity onPress={() => toggleCart(item.id)}>
                                                                {isAddedToCart[item.id] && playCartAnimation[item.id] ? (
                                                                    <LottieView
                                                                        source={require('@assets/animations/cartAnimation.json')}
                                                                        autoPlay
                                                                        loop={false}
                                                                        onAnimationFinish={() => handleAnimationFinish(item.id)}
                                                                        style = { styles.cartAnimation }
                                                                    />
                                                                ) : (
                                                                    <Icon
                                                                        name={isAddedToCart[item.id] ? 'checkmark-circle' : 'cart-outline'}
                                                                        style={[
                                                                            styles.staticCart,
                                                                            isAddedToCart[item.id] && styles.filledCart
                                                                        ]}
                                                                        size={32}
                                                                    />
                                                                )}
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </ScrollView>
                                    <TouchableOpacity style={styles.columnScrollMarker}
                                                      onPress={() => handleScrollRight(recommendedScrollRef, recommendedScrollX, setRecommendedScrollX)}>
                                        <View>
                                            <Icon name="chevron-forward-outline" style={styles.arrowIcon} size={30}/>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                {/*On Sale Row*/}
                                {saleItems.length > 0 && (
                                    <View style={styles.clothesRow}>
                                        <Text style={styles.headerText}>On Sale:</Text>
                                        <ScrollView
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            ref={saleScrollRef}
                                            onScroll={(event) => setSaleScrollX((event.nativeEvent.contentOffset.x))}
                                            scrollEventThrottle={16}
                                            style={{flexGrow: 0}}
                                        >
                                            <View style={styles.RowImages}>
                                                {saleItems.map((item) => (
                                                    <TouchableOpacity key={item.id} onPress={() => toggleItemModal(item)}>
                                                        <View key={item.id} style={styles.imageContainer}>
                                                            <Image style={styles.clothesImage}
                                                                   source={{uri: item.mainImage}}/>

                                                            {item.salePrice && (
                                                                <View style={styles.discountBanner}>
                                                                    <Text style={styles.discountText}>
                                                                        {`Now R${item.salePrice}`}
                                                                    </Text>
                                                                </View>
                                                            )}

                                                            <View style={styles.actionButtons}>
                                                                <TouchableOpacity onPress={() => toggleFavourite(item.id)}>
                                                                    {isFavourited[item.id] && playHeartAnimation[item.id] ? (
                                                                        <LottieView
                                                                            source={require('@assets/animations/likeButtonAnimation.json')}
                                                                            autoPlay
                                                                            loop={false}
                                                                            onAnimationFinish={() =>
                                                                                setPlayHeartAnimation((prev) => ({
                                                                                    ...prev,
                                                                                    [item.id]: false,
                                                                                }))
                                                                            }
                                                                            style={styles.heartAnimation}
                                                                        />
                                                                    ) : (
                                                                        <Icon
                                                                            name={isFavourited[item.id] ? 'heart' : 'heart-outline'}
                                                                            style={[
                                                                                styles.staticHeart,
                                                                                isFavourited[item.id] && styles.filledHeart,
                                                                            ]}
                                                                            size={30}
                                                                        />
                                                                    )}
                                                                </TouchableOpacity>

                                                                <TouchableOpacity onPress={() => toggleCart(item.id)}>
                                                                    {isAddedToCart[item.id] && playCartAnimation[item.id] ? (
                                                                        <LottieView
                                                                            source={require('@assets/animations/cartAnimation.json')}
                                                                            autoPlay
                                                                            loop={false}
                                                                            onAnimationFinish={() => handleAnimationFinish(item.id)}
                                                                            style = { styles.cartAnimation }
                                                                        />
                                                                    ) : (
                                                                        <Icon
                                                                            name={isAddedToCart[item.id] ? 'checkmark-circle' : 'cart-outline'}
                                                                            style={[
                                                                                styles.staticCart,
                                                                                isAddedToCart[item.id] && styles.filledCart
                                                                            ]}
                                                                            size={32}
                                                                        />
                                                                    )}
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </ScrollView>
                                        <TouchableOpacity style={styles.columnScrollMarker}
                                                          onPress={() => handleScrollRight(saleScrollRef, saleScrollX, setSaleScrollX)}>
                                            <View>
                                                <Icon name="chevron-forward-outline" style={styles.arrowIcon}
                                                      size={30}/>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {/* New In Row*/}
                                <View style={styles.clothesRow}>
                                    <Text style={styles.headerText}> New In </Text>
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        ref={newInScrollRef}
                                        onScroll={(event) => setNewInScrollX((event.nativeEvent.contentOffset.x))}
                                        scrollEventThrottle={16}
                                        style={{flexGrow: 0}}
                                    >

                                        <View style={styles.RowImages}>
                                            {inventoryItems.slice(0, 10).map((item) => (
                                                <TouchableOpacity key={item.id} onPress={() => toggleItemModal(item)}>
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
                                                        <View style={styles.actionButtons}>
                                                            <TouchableOpacity onPress={() => toggleFavourite(item.id)}>
                                                                {isFavourited[item.id] && playHeartAnimation[item.id] ? (
                                                                    <LottieView
                                                                        source={require('@assets/animations/likeButtonAnimation.json')}
                                                                        autoPlay
                                                                        loop={false}
                                                                        onAnimationFinish={() =>
                                                                            setPlayHeartAnimation((prev) => ({
                                                                                ...prev,
                                                                                [item.id]: false,
                                                                            }))
                                                                        }
                                                                        style={styles.heartAnimation}
                                                                    />
                                                                ) : (
                                                                    <Icon
                                                                        name={isFavourited[item.id] ? 'heart' : 'heart-outline'}
                                                                        style={[
                                                                            styles.staticHeart,
                                                                            isFavourited[item.id] && styles.filledHeart,
                                                                        ]}
                                                                        size={30}
                                                                    />
                                                                )}
                                                            </TouchableOpacity>

                                                            <TouchableOpacity onPress={() => toggleCart(item.id)}>
                                                                {isAddedToCart[item.id] && playCartAnimation[item.id] ? (
                                                                    <LottieView
                                                                        source={require('@assets/animations/cartAnimation.json')}
                                                                        autoPlay
                                                                        loop={false}
                                                                        onAnimationFinish={() => handleAnimationFinish(item.id)}
                                                                        style = { styles.cartAnimation }
                                                                    />
                                                                ) : (
                                                                    <Icon
                                                                        name={isAddedToCart[item.id] ? 'checkmark-circle' : 'cart-outline'}
                                                                        style={[
                                                                            styles.staticCart,
                                                                            isAddedToCart[item.id] && styles.filledCart
                                                                        ]}
                                                                        size={32}
                                                                    />
                                                                )}
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </ScrollView>
                                    <TouchableOpacity style={styles.columnScrollMarker}
                                                      onPress={() => handleScrollRight(newInScrollRef, newInScrollX, setNewInScrollX)}>
                                        <View>
                                            <Icon name="chevron-forward-outline" style={styles.arrowIcon} size={30}/>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <Text> hi </Text>

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
                                                        <Text style={styles.modalTitle}>{selectedItem.itemName}</Text>
                                                    </View>

                                                    <Text
                                                        style={[
                                                            styles.modalTitlePrice,
                                                            selectedItem.onSale && styles.salePriceText
                                                        ]}
                                                    >
                                                        {`R${selectedItem.itemPrice}`}
                                                    </Text>

                                                </View>
                                                <View style={styles.separator} />

                                                <View style={styles.imageGrid}>
                                                    {/* Trigger the image modal when any image is clicked */}
                                                    <TouchableOpacity onPress={() => openImageModal(0)}>
                                                        <View style={styles.modalImage}>
                                                            {selectedItem.onSale && (
                                                                <View style={styles.discountBanner}>
                                                                    <Text style={styles.discountText}>
                                                                        {`Now R${selectedItem.salePrice}`}
                                                                    </Text>
                                                                </View>
                                                            )}
                                                            <Image style={styles.modalImage} source={{ uri: selectedItem.mainImage }} />
                                                        </View>
                                                    </TouchableOpacity>
                                                    <View style={styles.imagesLeft}>
                                                        <TouchableOpacity onPress={() => openImageModal(1)}>
                                                            <Image style={styles.modalImage2} source={{ uri: selectedItem.image2 }} />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={() => openImageModal(2)}>
                                                            <Image style={styles.modalImage3} source={{ uri: selectedItem.image3 }} />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>

                                                {/* Additional item details and buttons */}
                                                <View style={styles.separator} />
                                                <View style={styles.itemInfo}>
                                                    <View style={styles.topRow}>
                                                        <Text style={styles.modalInfoTitle}>{selectedItem.itemName}</Text>
                                                        <Text style={styles.modalInfoSKU}>{`Ref: ${selectedItem.SKU}`}</Text>
                                                    </View>
                                                    <Text style={styles.modalInfo}>{`Colour: ${selectedItem.colour}`}</Text>
                                                    <Text style={styles.modalInfo}>{`Size: ${selectedItem.size}`}</Text>
                                                    <Text style={styles.modalInfo}>{`Damage: ${selectedItem.damage}`}</Text>
                                                    <Text style={styles.modalDescription}>{selectedItem.description}</Text>
                                                </View>
                                                <View style={styles.modalActionButtons}>
                                                    <TouchableOpacity onPress={() => toggleFavourite(selectedItem.id)} style={styles.modalLikeButton}>
                                                        {isFavourited[selectedItem.id] && playHeartAnimation[selectedItem.id] ? (
                                                            <LottieView
                                                                source={require('@assets/animations/likeButtonAnimation.json')}
                                                                autoPlay
                                                                loop={false}
                                                                onAnimationFinish={() =>
                                                                    setPlayHeartAnimation((prev) => ({
                                                                        ...prev,
                                                                        [selectedItem.id]: false,
                                                                    }))
                                                                }
                                                                style={styles.likeAnimation}
                                                            />
                                                        ) : (
                                                            <Icon
                                                                name={isFavourited[selectedItem.id] ? 'heart' : 'heart-outline'}
                                                                style={[
                                                                    styles.staticHeartModal,
                                                                    isFavourited[selectedItem.id] && styles.filledHeartModal,
                                                                ]}
                                                                size={45}
                                                            />
                                                        )}
                                                    </TouchableOpacity>


                                                    <TouchableOpacity onPress={() => toggleCart(selectedItem.id)} style={styles.addToCartButton}>
                                                        {isAddedToCart[selectedItem.id] && playCartAnimation[selectedItem.id] ? (
                                                            <LottieView
                                                                source={require('@assets/animations/cartAnimation.json')}
                                                                autoPlay
                                                                loop={false}
                                                                onAnimationFinish={() => handleAnimationFinish(selectedItem.id)}
                                                                style = { styles.cartAnimationModal }
                                                            />
                                                        ) : (
                                                            <Icon
                                                                name={isAddedToCart[selectedItem.id] ? 'checkmark-circle' : 'cart-outline'}
                                                                style={[
                                                                    styles.staticCartModal,
                                                                    isAddedToCart[selectedItem.id] && styles.filledCartModal
                                                                ]}
                                                                size={32}
                                                            />
                                                        )}
                                                        <Text style={styles.addToCartText}>
                                                            {isAddedToCart[selectedItem.id] ? 'Added to cart' : 'Add to cart'}
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
                            <Text>.</Text>
                        </View>
                    </ImageBackground>
                </ScrollView>
            </SafeAreaView>
    );
})

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#93D3AE',

    },
    image: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    MainContainer: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        marginTop: '4%'
    },

    logo: {
        resizeMode: 'contain' as ImageStyle['resizeMode'],
        width: '65%',
        position: "relative",
        bottom: '10%',
        marginBottom: '8%',
        marginLeft: '5%'
    },

    //all the rows and titles
    rowsContainer: {
        flex: 1,
        padding: 15,
        width: '100%',
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        position: "relative",
        top: '10%',
        right: '2%'
    },

    //each row of images with title
    clothesRow: {
        //flex: 1,
        width: '100%',
        height: 200,
        flexDirection: "column",
        position: "relative",
        bottom: '60%',
        marginVertical:10,
    },

    //each row of images
    RowImages: {
        flex: 1,
        flexDirection: 'row',
        height: 180,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: "center",
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

    //marker
    columnScrollMarker: {
        width: '15%',
        height: '87%',
        backgroundColor: 'rgba(229, 229, 229, 0.85)',
        position: "absolute",
        zIndex: 2,
        left: 340,
        top: '14%'
    },
    arrowIcon: {
        color: '#212121',
        position: "relative",
        top: 70,
        left: '5%'
    },
    headerText: {
        fontFamily: 'sulphurPoint_Bold',  // Keep the bold font for emphasis
        fontSize: 28,  // Slightly increase font size for readability
        color: '#3b3b3b',  // Dark gray for contrast
        backgroundColor: 'rgba(33, 146, 129, 0.5)',  // Transparent light green background
        padding: '2px 4px',  // Tight padding to fit background to text
        borderRadius: 4,  // Rounded corners for a soft look
        textTransform: 'capitalize',  // Soft capitalized style
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',  // Subtle shadow for depth
        borderBottomWidth: 1,  // Thin underline for emphasis
        borderBottomColor: '#5a5a5a',  // Darker accent for underline
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
    modalLikeButton: {},
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

});


export default HomeScreen;