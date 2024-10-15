import React from 'react';
import {
    View,
    ImageBackground,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    Image,
    Text,
    ScrollView,
    Dimensions
} from 'react-native';
import { SearchBar } from 'react-native-elements';

const { width } = Dimensions.get('window');
const itemSize = width/3;

function Search(){
    return (
        <SafeAreaView style = {styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="black" />
            <ImageBackground
                source = {require('../assets/Images/TMBackground.png')}
                resizeMode="stretch"
                style = {styles.image}>
                <View style = {styles.mainContainer}>
                    <View style = {styles.itemsContainer}>
                        <Image source = {require('../assets/Images/TMPageLogo.png')} style={styles.logo}/>
                        <View style = {styles.searchBarContainer}>
                            <SearchBar
                                inputStyle={{
                                    backgroundColor:'#219281',
                                    //font-family: 'sulphurPoint',
                                    paddingLeft: 5,
                            }}
                                containerStyle={{
                                    width:"100%",
                                    alignSelf: "center",
                                    backgroundColor:'#219281',
                                    borderColor: '#219281',
                                    borderRadius: 10,
                                    shadowColor: '#000',
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 1,
                                    shadowRadius: 4,
                                    elevation: 5, }}
                                placeholderTextColor={'#93D3AE'}
                                placeholder = {'search'}
                                searchIcon = {{
                                    color: '#93D3AE',
                                    size:30
                                }}
                                //showLoading={false}
                                clearIcon={{
                                    color: '#219281'
                                }}
                                inputContainerStyle={{
                                    backgroundColor:'#219281',
                                }}
                            ></SearchBar>
                        </View>
                    </View>

                    <View style = {styles.rowsContainer}>
                        <View style = {styles.clothesRow}>
                            <Text style = {styles.rowHeader}>Recommended for 'user'</Text>
                            <ScrollView  horizontal={true} showsHorizontalScrollIndicator={false}>
                                <View style = {styles.RowImages}>
                                    {/*Find way to display max 10 per row then button to view whole section*/}
                                    <Image style = {styles.clothesImage} source = {require("../assets/Images/\'Le Sirenuse\' Limoncello Shirt (Tencel).jpeg")}/>
                                    <Image style = {styles.clothesImage} source = {require("../assets/Images/1024x1024-Mens-SagaOne-Red-102422-Flatlay1_600x.webp")}/>
                                    <Image style = {styles.clothesImage} source = {require("../assets/Images/5141 Maha Basquiat 5_EEP T-Shirt Black - L _ Black.jpeg")}/>
                                    <Image style = {styles.clothesImage} source = {require("../assets/Images/AllSaints Rex Slim Fit Jeans in Jet Black at Nordstrom, Size 30 X 32.jpeg")}/>
                                </View>
                            </ScrollView>
                        </View>

                        <View style = {styles.clothesRow}>
                            <Text style = {styles.rowHeader}> On Sale </Text>
                            <ScrollView  horizontal={true} showsHorizontalScrollIndicator={false}>
                                <View style = {styles.RowImages}>
                                    {/*Find way to display max 10 per row then button to view whole section*/}
                                    <Image style = {styles.clothesImage} source = {require("../assets/Images/Ami De Coeur Short Black Unisex.jpeg")}/>
                                    <Image style = {styles.clothesImage} source = {require("../assets/Images/Balenciaga Oversize Double Face Wool Blend Crewneck Sweater in Black at Nordstrom, Size Small.jpeg")}/>
                                    <Image style = {styles.clothesImage} source = {require("../assets/Images/da5a8ddd-8db0-43ff-aa7d-4a93141d93e2.jpeg")}/>
                                    <Image style = {styles.clothesImage} source = {require("../assets/Images/kkboxly  Men\'s Streetwear Shorts, Chicago Graphic Drawstring Stretchy Short Pants For Workout Fitness, Summer Clothings Men\'s Fashion Outfits - Apricot 1 _ S(31).jpeg")}/>
                                </View>
                            </ScrollView>
                        </View>

                        <View style = {styles.clothesRow}>
                            <Text style = {styles.rowHeader}> New In </Text>
                            <ScrollView  horizontal={true} showsHorizontalScrollIndicator={false}>
                                <View style = {styles.RowImages}>
                                    {/*Find way to display max 10 per row then button to view whole section*/}
                                    <Image style = {styles.clothesImage} source = {require("../assets/Images/Chomp Mongo Skate Tee.jpeg")}/>
                                    <Image style = {styles.clothesImage} source = {require("../assets/Images/LEVI\'S® _ 501® ORIGINAL JEANS.jpeg")}/>
                                    <Image style = {styles.clothesImage} source = {require("../assets/Images/Metallica T Shirt Mop Photo Damage Inc Tour Official Womens Junior Fit Black.jpeg")}/>
                                    <Image style = {styles.clothesImage} source = {require("../assets/Images/Metallica T Shirt Mop Photo Damage Inc Tour Official Womens Junior Fit Black.jpeg")}/>
                                </View>
                            </ScrollView>
                        </View>

                        <View style = {styles.clothesRow}>
                            <Text style = {styles.rowHeader}>Recommended for 'user'</Text>
                            <ScrollView  horizontal={true} showsHorizontalScrollIndicator={false}>
                                <View style = {styles.RowImages}>
                                    {/*Find way to display max 10 per row then button to view whole section*/}
                                    <Image style = {styles.clothesImage} source = {require("../assets/Images/New Haven Twill Jacket.jpeg")}/>
                                    <Image style = {styles.clothesImage} source = {require("../assets/Images/Ami De Coeur Short Black Unisex.jpeg")}/>
                                    <Image style = {styles.clothesImage} source = {require("../assets/Images/O\'Neill Men\'s Mixed Bag T-Shirt in Black, Size Medium.jpeg")}/>
                                    <Image style = {styles.clothesImage} source = {require("../assets/Images/\'Le Sirenuse\' Limoncello Shirt (Tencel).jpeg")}/>
                                </View>
                            </ScrollView>
                        </View>
                    </View>

                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        justifyContent: 'space-evenly',

    },
    container: {
        flex:1,
        backgroundColor:'black',
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    logo:{
        resizeMode: 'contain',
        width: '65%',
        position: "relative",
        top: '17%',
    },
    itemsContainer: {
        width: '100%',
        marginLeft: "5%",
        alignSelf: "center",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        bottom: "30%"
    },
    searchBarContainer: {
        width: '90%',
        display: 'flex',
        position: "relative",
        bottom: '15%',
    },
    searchBar:{

    },

    rowsContainer: {
        flex: 1,
        padding: 5,
        height: 170,
        width: '100%',
        flexDirection: "column",
        position: 'relative',
        bottom: '40%'
    },

    //each row of images with title
    clothesRow: {
        flex: 1,
        flexDirection: "column",
        height: 170,
        width:'100%',
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

export default Search;