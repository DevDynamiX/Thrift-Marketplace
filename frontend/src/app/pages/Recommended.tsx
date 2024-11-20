import React, {useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    Alert,
    TouchableOpacity,
    ImageBackground,
    RefreshControl,
    ScrollView, Dimensions, SafeAreaView, ActivityIndicator, StatusBar, ImageStyle, Modal
} from 'react-native';
import  { useFonts } from 'expo-font';
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useRouter} from "expo-router";
import LottieView from "lottie-react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface Product {
    id: number;
    itemName: string;
    itemPrice: number;
    salePrice: number;
}

const { width } = Dimensions.get('window');
const itemSize = width/3;

const ViewRecommended = () => {
    const [user, setUser] = useState({isLoggedIn: false, userToken: null, userEmail: null, firstName: null, userID: null})

    const [isFavourited, setIsFavourited] = useState({});
    const [playHeartAnimation, setPlayHeartAnimation] = useState({});
    const [isAddedToCart, setAddedToCart] = useState({});
    const [playCartAnimation, setPlayCartAnimation] = useState({});
    const [isCartAnimationCompleted, setIsCartAnimationCompleted] = useState({});
    const [inventoryItems, setInventoryItems ] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [likedItems, setLikedItems] = useState([]);
    const [isItemModalVisible, setIsItemModalVisible] = useState(false);
    const [isImageModalVisible, setIsImageModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const [fontsLoaded] = useFonts({
        'sulphurPoint': require('@assets/fonts/SulphurPoint-Regular.ttf'),
        'sulphurPoint_Bold': require('@assets/fonts/SulphurPoint-Bold.ttf'),
        'sulphurPoint_Light': require('@assets/fonts/SulphurPoint-Light.ttf'),
        'shrikhand': require('@assets/fonts/Shrikhand-Regular.ttf'),
    });

    let isFetching = false;

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

    const toggleFavourite = (id) => {
        console.log(`Toggling favourite for item with ID: ${id}, for user ID ${user.userID}`);

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

            console.log("Attempting to add like:", {itemID: id, userID: user.userID });

            setLikedItems((prevLikedItems = []) => {
                const items = Array.isArray(prevLikedItems) ? prevLikedItems : [];

                const likedItem = items.some(item => item.id === id);

                if (!likedItem) {
                    fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/likes`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': "application/json",
                        },
                        body: JSON.stringify({ itemID: id, userID: user.userID }),
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Item added to likes:', data);
                            if (data && Array.isArray(data)) {
                                data.forEach(item => {
                                    setIsFavourited[item.unit.id] = true;
                                });
                            } else {
                                console.warn(`No likes data found for userID ${user.userID}:`, data);
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

            fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/likes/${id}/${user.userID}`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(data => {
                    console.log(`Item removed from ${user.firstName}'s likes:`, data);
                    setLikedItems(prevLikedItems  => prevLikedItems.filter(item => item.id != id));
                })
                .catch(error => {
                    console.error("Error removing from 'Likes': ", error);
                });
        }
    }

    const toggleCart = (id) => {
        console.log(`Toggling cart for item with ID: ${id}, for ${user.firstName}. `);

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
            console.log("Attempting to add to cart:", { itemID: id, userID: user.userID });

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
            console.log(`Removing item ${id} from ${user.firstName}'s cart`);

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
                console.error(`Error removing from ${user.firstName}'s 'Cart': `, error);
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

    const saleItems = inventoryItems.filter(item => item.onSale) || [];

    const fetchLikes = async () => {
        if (!user.userID) {
            console.warn("UserID is null; skipping fetch.");
            return;
        }

        if (isFetching) return;
        isFetching = true;

        try {
            const response = await fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/likes?userID=${user.userID}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            // Debugging the entire response
            console.log("Full response:", result);

            const data = result.likes;

            // Check if data is an array
            if (!Array.isArray(data)) {
                console.warn("No likes data received or invalid format:", data);
                setLikedItems([]);
                return;
            }

            setLikedItems(data);

            const updatedIsFavourited = {};

            data.forEach(item => {
                if (item.unit?.id) {
                    updatedIsFavourited[item.unit.id] = true;
                } else {
                    console.warn("Invalid item in likes data:", item);
                }
            });

            setIsFavourited(updatedIsFavourited);

        } catch (error) {
            console.error(`Error fetching ${user.firstName}'s 'Likes': `, error);
        } finally {
            setIsLoading(false);
            isFetching = false;
        }
    };

    useEffect(() => {
        if (user.userID) {
            console.log("UserID available, fetching likes.");
            setIsLoading(true);
            fetchLikes();
        } else {
            console.warn("UserID is null, skipping fetch.");
        }
    }, [user.userID]);

    const toggleItemModal = (item) => {
        setSelectedItem(item);
        setIsItemModalVisible(!isItemModalVisible);
    };

    const openImageModal = (index) => {
        setSelectedImageIndex(index);
        setIsImageModalVisible(true);
    };

    const closeImageModal = () => {
        setIsImageModalVisible(false);
    };

    const images = selectedItem ? [
        { uri: selectedItem.mainImage },
        { uri: selectedItem.image2 },
        { uri: selectedItem.image3 }
    ] : [];

    if (!fontsLoaded) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="white" />
            </SafeAreaView>
        );
    }

    useEffect(() => {
        setIsLoading(true);
        fetchInventory().finally(() => setIsLoading(false));
    }, []);

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
                        gender: userData.gender || null,
                    });

                    console.log('*************');
                    console.log('Updated user state:', {
                        isLoggedIn: true,
                        userToken: userData.token || null,
                        userEmail: userData.email || null,
                        firstName: userData.firstName || null,
                        userID: userData.id || null,
                        gender: userData.gender || null,
                    });
                    console.log('*************');
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchUser();
    }, []);


    return (
        <SafeAreaView style = {styles.container}>

                <StatusBar barStyle="light-content" backgroundColor="black"/>

                <ImageBackground
                    source = {require('@assets/images/TMBackground.png')}
                    resizeMode="stretch"
                    style = {styles.image}>
                    <View style={styles.MainContainer}>
                        {/* Recommended Row */}
                        <View style={styles.clothesRow}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={isLoading}
                                        onRefresh={fetchInventory}
                                    />
                                }
                            >
                                <View style={styles.RowImages}>
                                    {inventoryItems
                                        .filter((item) => {
                                            if (user.gender === 'female') {
                                                return item.sex === 'female' || item.sex === 'unisex';
                                            } else if (user.gender === 'male') {
                                                return item.sex === 'male' || item.sex === 'unisex';
                                            } else {
                                                // For other genders, show all items
                                                return true;
                                            }
                                        })
                                        .map((item) => (
                                            <TouchableOpacity
                                                key={item.id}
                                                onPress={() => toggleItemModal(item)}
                                                testID={`recommendedItem-${item}`}
                                            >
                                                <View key={item.id} style={styles.imageContainer}>
                                                    <Image
                                                        style={styles.clothesImage}
                                                        source={{ uri: item.mainImage }}
                                                    />

                                                    {item.onSale && (
                                                        <View style={styles.discountBanner}>
                                                            <Text style={styles.discountText}>
                                                                {`Now R${item.salePrice}`}
                                                            </Text>
                                                        </View>
                                                    )}

                                                    <View style={styles.actionButtons}>
                                                        <TouchableOpacity onPress={() => toggleFavourite(item.id)}>
                                                            {isFavourited[item.id] &&
                                                            playHeartAnimation[item.id] ? (
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
                                                                    name={
                                                                        isFavourited[item.id]
                                                                            ? 'heart'
                                                                            : 'heart-outline'
                                                                    }
                                                                    style={[
                                                                        styles.staticHeart,
                                                                        isFavourited[item.id] &&
                                                                        styles.filledHeart,
                                                                    ]}
                                                                    size={30}
                                                                />
                                                            )}
                                                        </TouchableOpacity>

                                                        <TouchableOpacity onPress={() => toggleCart(item.id)}>
                                                            {isAddedToCart[item.id] &&
                                                            playCartAnimation[item.id] ? (
                                                                <LottieView
                                                                    source={require('@assets/animations/cartAnimation.json')}
                                                                    autoPlay
                                                                    loop={false}
                                                                    onAnimationFinish={() =>
                                                                        handleAnimationFinish(item.id)
                                                                    }
                                                                    style={styles.cartAnimation}
                                                                />
                                                            ) : (
                                                                <Icon
                                                                    name={
                                                                        isAddedToCart[item.id]
                                                                            ? 'checkmark-circle'
                                                                            : 'cart-outline'
                                                                    }
                                                                    style={[
                                                                        styles.staticCart,
                                                                        isAddedToCart[item.id] &&
                                                                        styles.filledCart,
                                                                    ]}
                                                                    size={32}
                                                                />
                                                            )}
                                                        </TouchableOpacity>
                                                    </View>
                                                    {item.isSold && (
                                                        <View style={styles.soldOverlay}>
                                                            <Icon name="sad-outline" style={styles.sadIcon}
                                                                  size={30}/>
                                                            <Text style={styles.soldText}>Sorry! This item is sold</Text>
                                                        </View>
                                                    )}
                                                </View>
                                            </TouchableOpacity>
                                        ))}

                                </View>
                            </ScrollView>
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
                    </View>
                </ImageBackground>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    MainContainer: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '4%',
    },

    //each row of images
    RowImages: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        alignItems: 'flex-start',
        paddingVertical: 10,
        marginHorizontal: 5,
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
    headerText: {
        fontFamily: 'sulphurPoint_Bold',
        fontSize: 24,
        color: '#3b3b3b',
        backgroundColor: 'rgba(33, 146, 129, 0.5)',
        borderRadius: 4,
        textTransform: 'capitalize',
        paddingLeft: 10,
        marginLeft: 6
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
    soldOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(33,146,129,0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        borderRadius: 5,
    },
    soldText: {
        textAlign: 'center',
        fontFamily: 'sulphurPoint_Bold',
        color: 'white',
        fontSize: 18,
    },
    sadIcon: {
        color: 'white',
        marginBottom: 10
    }

});

export default ViewRecommended;
