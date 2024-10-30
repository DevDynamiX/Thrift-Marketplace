import React, { useState, useEffect } from 'react';
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
    TouchableOpacity
} from 'react-native';
import  { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import Constants from "expo-constants";


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
    const [isLoading, setIsLoading] = useState(false);

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


    useEffect(() => {
        fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/inventory`)
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


    // @ts-ignore
    return (
        <SafeAreaView style = {styles.container}>
            <ScrollView>
                <StatusBar barStyle="light-content" backgroundColor="black" />

                <ImageBackground
                    source = {require('@assets/images/TMBackground.png')}
                    resizeMode="stretch"
                    style = {styles.image}>

                    <View style={styles.MainContainer}>
                        <Image source = {require('@assets/images/TMPageLogo.png')} style={styles.logo as ImageStyle}/>

                        <View style = {styles.rowsContainer}>
                            <View style={styles.clothesRow}>
                                <Text style={styles.headerText}>Recommended for you</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <View style={styles.RowImages}>
                                        {inventoryItems.slice(0, 10).map((item) => (
                                            <View key={item.id} style={styles.imageContainer}>
                                                <Image style={styles.clothesImage} source={ { uri: item.mainImage } } />

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
                                        ))}
                                    </View>
                                </ScrollView>
                                <View style = { styles.columnScrollMarker }>
                                    <Icon name="chevron-forward-outline" style = {styles.arrowIcon} size={ 30 } />
                                </View>
                            </View>

                            {/*TODO: ADD sales and new*/}

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
        width: '10%',
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
        top: '45%',
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
    }

});

export default HomeScreen;