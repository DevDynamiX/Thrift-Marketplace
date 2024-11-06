import React, { useState, useEffect, useRef } from 'react';
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
    FlatList
} from 'react-native';
import  { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import Constants from "expo-constants";
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

const HomeScreen = () => {

    // Load fonts asynchronously
    const [fontsLoaded] = useFonts({
        'montserrat': require('@assets/fonts/Montserrat-VariableFont_wght.ttf'),
        'montserrat_Italic': require('@assets/fonts/Montserrat-Italic-VariableFont_wght.ttf'),
        'sulphurPoint': require('@assets/fonts/SulphurPoint-Regular.ttf'),
        'sulphurPoint_Bold': require('@assets/fonts/SulphurPoint-Bold.ttf'),
        'sulphurPoint_Light': require('@assets/fonts/SulphurPoint-Light.ttf'),
        'shrikhand': require('@assets/fonts/Shrikhand-Regular.ttf'),
    });

    const [isFavourited, setIsFavourited] = useState(false);
    const [playHeartAnimation, setPlayAnimation] = useState(false);
    const [isAddedToCart, setIsAddedToCart] = useState(false);
    const [playCartAnimation, setPlayCartAnimation] = useState(false);

    const [inventoryItems, setInventoryItems ] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);

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

    useEffect(() => {
        setIsLoading(true);
        fetch(`http://localhost:3000/inventory`)
            .then(response => response.json())
            .then( data => {
                setInventoryItems(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error fetching inventory: ", error);
                setIsLoading(false);
            });
    }, []);

    const toggleFavourite = () => {
        setIsFavourited(!isFavourited);
        setPlayAnimation(true);
    };

    const toggleCart = () => {
        setIsAddedToCart(!isAddedToCart);
        setPlayCartAnimation(true);
    };

    // If fonts are not loaded, show a loading indicator within the component itself
    if (!fontsLoaded) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="white" />
            </SafeAreaView>
        );
    }



    const saleItems =  inventoryItems.filter(item => item.onSale)||[];

    const handleScrollRight = (scrollRef:any, currentScrollX:any, setScrollX:any) => {
        if (scrollRef.current) {
            const newScrollPosition = currentScrollX + 100; // scroll by 100 pixels
            scrollRef.current.scrollTo({ x: newScrollPosition, animated: true });
            setScrollX(newScrollPosition); // update the current scroll position
        }
    };
    const addToCart = () => {
        const existingItemIndex = cartItems.findIndex(item => item.id === selectedItem);

        if(existingItemIndex !== -1) {
            const updatedCartItems = [...cartItems];
            updatedCartItems[existingItemIndex].quantity +=1;
        }
        else {
            setCartItems(cartItems);
        }
    }
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
        { uri: selectedItem.image3 }
    ] : [];

        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <StatusBar barStyle="light-content" backgroundColor="black"/>

                    <ImageBackground
                        source={require('@assets/images/TMBackground.png')}
                        resizeMode="stretch"
                        style={styles.image}>

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
                                                                {playHeartAnimation ? (
                                                                    <LottieView
                                                                        source={require('@assets/animations/likeButtonAnimation.json')}
                                                                        autoPlay
                                                                        loop={false}
                                                                        onAnimationFinish={() => setPlayAnimation(false)}
                                                                    />
                                                                ) : (
                                                                    <Icon
                                                                        name={item.isFavourited ? 'heart' : 'heart-outline'}
                                                                        style={[styles.staticHeart, item.isFavourited && styles.filledHeart]}
                                                                        size={30}
                                                                    />
                                                                )}
                                                            </TouchableOpacity>

                                                            <TouchableOpacity onPress={() => toggleCart(item.id)}>
                                                                {playCartAnimation ? (
                                                                    <LottieView
                                                                        source={require('@assets/animations/cartAnimation.json')}
                                                                        autoPlay
                                                                        loop={false}
                                                                        onAnimationFinish={() => setPlayCartAnimation(false)}
                                                                    />
                                                                ) : (
                                                                    <Icon
                                                                        name={item.isAddedToCart ? 'cart' : 'cart-outline'}
                                                                        style={[styles.staticCart, item.isAddedToCart && styles.filledCart]}
                                                                        size={30}
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
                                                                <TouchableOpacity
                                                                    onPress={() => toggleFavourite(item.id)}>
                                                                    {playHeartAnimation ? (
                                                                        <LottieView
                                                                            source={require('@assets/animations/likeButtonAnimation.json')}
                                                                            autoPlay
                                                                            loop={false}
                                                                            onAnimationFinish={() => setPlayAnimation(false)}
                                                                        />
                                                                    ) : (
                                                                        <Icon
                                                                            name={item.isFavourited ? 'heart' : 'heart-outline'}
                                                                            style={[styles.staticHeart, item.isFavourited && styles.filledHeart]}
                                                                            size={30}
                                                                        />
                                                                    )}
                                                                </TouchableOpacity>

                                                                <TouchableOpacity onPress={() => toggleCart(item.id)}>
                                                                    {playCartAnimation ? (
                                                                        <LottieView
                                                                            source={require('@assets/animations/cartAnimation.json')}
                                                                            autoPlay
                                                                            loop={false}
                                                                            onAnimationFinish={() => setPlayCartAnimation(false)}
                                                                        />
                                                                    ) : (
                                                                        <Icon
                                                                            name={item.isAddedToCart ? 'cart' : 'cart-outline'}
                                                                            style={[styles.staticCart, item.isAddedToCart && styles.filledCart]}
                                                                            size={30}
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
                                                <TouchableOpacity key={item.id} onPress={() => toggleModal(item)}>
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
                                                                {playHeartAnimation ? (
                                                                    <LottieView
                                                                        source={require('@assets/animations/likeButtonAnimation.json')}
                                                                        autoPlay
                                                                        loop={false}
                                                                        onAnimationFinish={() => setPlayAnimation(false)}
                                                                    />
                                                                ) : (
                                                                    <Icon
                                                                        name={item.isFavourited ? 'heart' : 'heart-outline'}
                                                                        style={[styles.staticHeart, item.isFavourited && styles.filledHeart]}
                                                                        size={30}
                                                                    />
                                                                )}
                                                            </TouchableOpacity>

                                                            <TouchableOpacity onPress={() => toggleCart(item.id)}>
                                                                {playCartAnimation ? (
                                                                    <LottieView
                                                                        source={require('@assets/animations/cartAnimation.json')}
                                                                        autoPlay
                                                                        loop={false}
                                                                        onAnimationFinish={() => setPlayCartAnimation(false)}
                                                                    />
                                                                ) : (
                                                                    <Icon
                                                                        name={item.isAddedToCart ? 'cart' : 'cart-outline'}
                                                                        style={[styles.staticCart, item.isAddedToCart && styles.filledCart]}
                                                                        size={30}
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
                                                    <Text style={styles.modalTitlePrice}>{`R${selectedItem.itemPrice}`}</Text>
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
                                                    <TouchableOpacity style={styles.modalLikeButton}>
                                                        <Icon name="heart-outline" style={styles.modalLikeButtonIcon} size={45} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={styles.addToCartButton} onPress={() => addToCart(item)}>
                                                        <Icon name="cart-outline" style={styles.cartButton} size={30} />
                                                        <Text style={styles.addToCartText}> Add To Cart</Text>
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
        height: 170,
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
        margin: 5,
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
        fontFamily: 'sulphurPoint_Bold',
        fontSize: 18,
        color: '#212121',
        marginLeft: 10,
        paddingBottom:'2%',
    },
    actionButtons: {
        display: 'flex',
        flexDirection: 'row',
        position: "absolute",
        zIndex: 2,
        left: '50%',
        bottom: '1%',

    },
    likeButton: {
        color: "#93D3AE",
    },
    cartButton: {
        color: "#93D3AE"
    },
    staticHeart: {
        color: "#93D3AE",
    },
    filledHeart: {
        color: "#FF0000",
    },
    staticCart: {
        color: "#93D3AE",
    },
    filledCart: {
        color: "#FF0000",
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
        fontSize: 22
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
    }
});

export default HomeScreen;