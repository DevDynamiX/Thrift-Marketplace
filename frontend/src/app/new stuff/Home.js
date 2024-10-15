import React from 'react';
import {View,
    ImageBackground,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    Image,
    Text,
    Dimensions,
    ActivityIndicator,
    ScrollView
    } from 'react-native';
import  { useFonts } from 'expo-font';

const { width } = Dimensions.get('window');
const itemSize = width/3;


function Home(){

    const [fontsLoaded] = useFonts({
        'montserrat' : require('@assets/Fonts/Montserrat-VariableFont_wght.ttf'),
        'sulphurPoint' : require('@assets/Fonts/SulphurPoint-Regular.ttf'),
        'shrikhand': require('@assets/Fonts/Shrikhand-Regular.ttf'),
    });

    if(!fontsLoaded){
        return <ActivityIndicator size="large" color="white" />;
    }

    return (
        <SafeAreaView style = {styles.container}>
            <ScrollView>
                <StatusBar barStyle="light-content" backgroundColor="black" />

                <ImageBackground
                    source = {require('@assets/Images/TMBackground.png')}
                    resizeMode="stretch"
                    style = {styles.image}>

                    <View style={styles.MainContainer}>

                        <Image source = {require('@assets/Images/TMPageLogo.png')} style={styles.logo}/>

                        <View style = {styles.rowsContainer}>
                            <View style = {styles.clothesRow}>
                                <Text style = {styles.rowHeader}>Recommended for 'user'</Text>
                                <ScrollView  horizontal={true} showsHorizontalScrollIndicator={false}>
                                    <View style = {styles.RowImages}>
                                        {/*Find way to display max 10 per row then button to view whole section*/}
                                        <Image style = {styles.clothesImage} source = {require("@assets/Images/\'Le Sirenuse\' Limoncello Shirt (Tencel).jpeg")}/>
                                        <Image style = {styles.clothesImage} source = {require("@assets/Images/1024x1024-Mens-SagaOne-Red-102422-Flatlay1_600x.webp")}/>
                                        <Image style = {styles.clothesImage} source = {require("@assets/Images/5141 Maha Basquiat 5_EEP T-Shirt Black - L _ Black.jpeg")}/>
                                        <Image style = {styles.clothesImage} source = {require("@assets/Images/AllSaints Rex Slim Fit Jeans in Jet Black at Nordstrom, Size 30 X 32.jpeg")}/>
                                    </View>
                                </ScrollView>
                            </View>

                            <View style = {styles.clothesRow}>
                                <Text style = {styles.rowHeader}> On Sale </Text>
                                <ScrollView  horizontal={true} showsHorizontalScrollIndicator={false}>
                                    <View style = {styles.RowImages}>
                                        {/*Find way to display max 10 per row then button to view whole section*/}
                                        <Image style = {styles.clothesImage} source = {require("@assets/Images/Ami De Coeur Short Black Unisex.jpeg")}/>
                                        <Image style = {styles.clothesImage} source = {require("@assets/Images/Balenciaga Oversize Double Face Wool Blend Crewneck Sweater in Black at Nordstrom, Size Small.jpeg")}/>
                                        <Image style = {styles.clothesImage} source = {require("@assets/Images/da5a8ddd-8db0-43ff-aa7d-4a93141d93e2.jpeg")}/>
                                        <Image style = {styles.clothesImage} source = {require("@assets/Images/kkboxly  Men\'s Streetwear Shorts, Chicago Graphic Drawstring Stretchy Short Pants For Workout Fitness, Summer Clothings Men\'s Fashion Outfits - Apricot 1 _ S(31).jpeg")}/>
                                    </View>
                                </ScrollView>
                            </View>

                            <View style = {styles.clothesRow}>
                                <Text style = {styles.rowHeader}> New In </Text>
                                <ScrollView  horizontal={true} showsHorizontalScrollIndicator={false}>
                                    <View style = {styles.RowImages}>
                                        {/*Find way to display max 10 per row then button to view whole section*/}
                                        <Image style = {styles.clothesImage} source = {require("@assets/Images/Chomp Mongo Skate Tee.jpeg")}/>
                                        <Image style = {styles.clothesImage} source = {require("@assets/Images/LEVI\'S® _ 501® ORIGINAL JEANS.jpeg")}/>
                                        <Image style = {styles.clothesImage} source = {require("@assets/Images/Metallica T Shirt Mop Photo Damage Inc Tour Official Womens Junior Fit Black.jpeg")}/>
                                        <Image style = {styles.clothesImage} source = {require("@assets/Images/Metallica T Shirt Mop Photo Damage Inc Tour Official Womens Junior Fit Black.jpeg")}/>
                                    </View>
                                </ScrollView>
                            </View>

                            <View style = {styles.clothesRow}>
                                <Text style = {styles.rowHeader}>Recommended for 'user'</Text>
                                <ScrollView  horizontal={true} showsHorizontalScrollIndicator={false}>
                                    <View style = {styles.RowImages}>
                                        {/*Find way to display max 10 per row then button to view whole section*/}
                                        <Image style = {styles.clothesImage} source = {require("@assets/Images/New Haven Twill Jacket.jpeg")}/>
                                        <Image style = {styles.clothesImage} source = {require("@assets/Images/Ami De Coeur Short Black Unisex.jpeg")}/>
                                        <Image style = {styles.clothesImage} source = {require("@assets/Images/O\'Neill Men\'s Mixed Bag T-Shirt in Black, Size Medium.jpeg")}/>
                                        <Image style = {styles.clothesImage} source = {require("@assets/Images/\'Le Sirenuse\' Limoncello Shirt (Tencel).jpeg")}/>
                                    </View>
                                </ScrollView>
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
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    MainContainer: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },

    logo:{
        resizeMode: 'contain',
        width: '65%',
        position: "relative",
        bottom: '10%',
        marginBottom: '8%'
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
        height: "100%",
        width:'100%',
        marginVertical:10,
        display: 'flex',
        justifyContent: 'center',
        padding:5,
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
        resizeMode: 'cover',
        shadowColor: '#000',
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: '100%',
        shadowRadius: 4,
        elevation: 5,
        margin: 5,
    },

    //page texts
    text: {
        color: 'black',
        fontSize: 42,
        lineHeight: 40,
        fontWeight: 'bold',
        backgroundColor: 'white',
    },
    rowHeader: {
        color: '#212121',
        //fontFamily: 'arial',
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 10,
        fontStyle: "italic",
        paddingBottom:'2%',
    }
});

export default Home;