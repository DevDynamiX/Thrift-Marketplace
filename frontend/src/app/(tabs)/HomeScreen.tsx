import React from 'react';
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
    ImageStyle
} from 'react-native';
import  { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/Ionicons';


const { width } = Dimensions.get('window');
const itemSize = width/3;


const HomeScreen = () => {

    const [fontsLoaded] = useFonts({
        'montserrat' : require('@assets/fonts/Montserrat-VariableFont_wght.ttf'),
        'montserrat_Italic' : require('@assets/fonts/Montserrat-Italic-VariableFont_wght.ttf'),
        'sulphurPoint' : require('@assets/fonts/SulphurPoint-Regular.ttf'),
        'sulphurPoint_Bold' : require('@assets/fonts/SulphurPoint-Bold.ttf'),
        'sulphurPoint_Light' : require('@assets/fonts/SulphurPoint-Light.ttf'),
        'shrikhand': require('@assets/fonts/Shrikhand-Regular.ttf'),
    });

    if(!fontsLoaded){
        return <ActivityIndicator size="large" color="white" />;
    }

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
                            <View style = {styles.clothesRow}>
                                <Text style = {styles.headerText}>Recommended for 'user'</Text>
                                <ScrollView  horizontal={true} showsHorizontalScrollIndicator={false}>
                                    <View style = {styles.RowImages}>
                                        {/*Find way to display max 10 per row then button to view whole section*/}
                                        <Image style = {styles.clothesImage as ImageStyle} source = {require("@assets/images/\'Le Sirenuse\' Limoncello Shirt (Tencel).jpeg")}/>
                                        <Image style = {styles.clothesImage as ImageStyle} source = {require("@assets/images/1024x1024-Mens-SagaOne-Red-102422-Flatlay1_600x.webp")}/>
                                        <Image style = {styles.clothesImage as ImageStyle} source = {require("@assets/images/5141 Maha Basquiat 5_EEP T-Shirt Black - L _ Black.jpeg")}/>
                                        <Image style = {styles.clothesImage as ImageStyle} source = {require("@assets/images/AllSaints Rex Slim Fit Jeans in Jet Black at Nordstrom, Size 30 X 32.jpeg")}/>
                                    </View>
                                </ScrollView>
                                <View style = { styles.columnScrollMarker }>
                                    <Icon name="chevron-forward-outline" style = {styles.arrowIcon} size={ 30 } />
                                </View>
                            </View>

                            <View style = {styles.clothesRow}>
                                <Text style = {styles.headerText}> On Sale </Text>
                                <ScrollView  horizontal={true} showsHorizontalScrollIndicator={false}>
                                    <View style = {styles.RowImages}>
                                        {/*Find way to display max 10 per row then button to view whole section*/}
                                        <Image style = {styles.clothesImage as ImageStyle} source = {require("@assets/images/Ami De Coeur Short Black Unisex.jpeg")}/>
                                        <Image style = {styles.clothesImage as ImageStyle} source = {require("@assets/images/Balenciaga Oversize Double Face Wool Blend Crewneck Sweater in Black at Nordstrom, Size Small.jpeg")}/>
                                        <Image style = {styles.clothesImage as ImageStyle} source = {require("@assets/images/da5a8ddd-8db0-43ff-aa7d-4a93141d93e2.jpeg")}/>
                                        <Image style = {styles.clothesImage as ImageStyle} source = {require("@assets/images/Men's_Streetwear_Shorts.jpeg")}/>
                                    </View>
                                </ScrollView>
                                <View style = { styles.columnScrollMarker }>
                                    <Icon name="chevron-forward-outline" style = {styles.arrowIcon} size={ 30 } />
                                </View>
                            </View>

                            <View style = {styles.clothesRow}>
                                <Text style = {styles.headerText}> New In </Text>
                                <ScrollView  horizontal={true} showsHorizontalScrollIndicator={false}>
                                    <View style = {styles.RowImages}>
                                        {/*Find way to display max 10 per row then button to view whole section*/}
                                        <Image style = {styles.clothesImage as ImageStyle} source = {require("@assets/images/Chomp Mongo Skate Tee.jpeg")}/>
                                        <Image style = {styles.clothesImage as ImageStyle} source = {require("@assets/images/LEVI\'S® _ 501® ORIGINAL JEANS.jpeg")}/>
                                        <Image style = {styles.clothesImage as ImageStyle} source = {require("@assets/images/Metallica T Shirt Mop Photo Damage Inc Tour Official Womens Junior Fit Black.jpeg")}/>
                                        <Image style = {styles.clothesImage as ImageStyle} source = {require("@assets/images/Metallica T Shirt Mop Photo Damage Inc Tour Official Womens Junior Fit Black.jpeg")}/>
                                    </View>
                                </ScrollView>
                                <View style = { styles.columnScrollMarker }>
                                    <Icon name="chevron-forward-outline" style = {styles.arrowIcon} size={ 30 } />
                                </View>
                            </View>

                            <View style = {styles.clothesRow}>
                                <Text style = {styles.headerText}>Recommended for 'user'</Text>
                                <ScrollView  horizontal={true} showsHorizontalScrollIndicator={false}>
                                    <View style = {styles.RowImages}>
                                        {/*Find way to display max 10 per row then button to view whole section*/}
                                        <Image style = {styles.clothesImage as ImageStyle} source = {require("@assets/images/New Haven Twill Jacket.jpeg")}/>
                                        <Image style = {styles.clothesImage as ImageStyle} source = {require("@assets/images/Ami De Coeur Short Black Unisex.jpeg")}/>
                                        <Image style = {styles.clothesImage as ImageStyle} source = {require("@assets/images/O\'Neill Men\'s Mixed Bag T-Shirt in Black, Size Medium.jpeg")}/>
                                        <Image style = {styles.clothesImage as ImageStyle} source = {require("@assets/images/\'Le Sirenuse\' Limoncello Shirt (Tencel).jpeg")}/>
                                    </View>
                                </ScrollView>
                                <View style = { styles.columnScrollMarker }>
                                    <Icon name="chevron-forward-outline" style = {styles.arrowIcon} size={ 30 } />
                                </View>
                            </View>
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
        marginTop: '10%'
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
        flex: 1,
        flexDirection: "column",
        position: "relative",
        bottom: '50%',
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



    //marker
    columnScrollMarker: {
        width: '10%',
        height: '87%',
        position: "relative",
        backgroundColor: 'rgba(229, 229, 229, 0.85)',
        zIndex: 2,
        position: "absolute",
        left: 340,
        top: '13%'


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
    }
});

export default HomeScreen;