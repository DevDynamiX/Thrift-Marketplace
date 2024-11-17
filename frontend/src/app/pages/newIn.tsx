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
    Platform,
    Clipboard
} from 'react-native';
import  { useFonts } from 'expo-font';
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ViewNewIn= () => {
    const [user, setUser] = useState({isLoggedIn: false, userToken: null, userEmail: null, firstName: null, userID: null})

    const [isLoading, setIsLoading] = useState(false);

    const [discounts, setDiscounts ] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [fontsLoaded] = useFonts({
        'sulphurPoint': require('@assets/fonts/SulphurPoint-Regular.ttf'),
        'sulphurPoint_Bold': require('@assets/fonts/SulphurPoint-Bold.ttf'),
        'sulphurPoint_Light': require('@assets/fonts/SulphurPoint-Light.ttf'),
        'shrikhand': require('@assets/fonts/Shrikhand-Regular.ttf'),
    });

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

    let isFetching = false;

    const fetchUserDiscounts = async (isRefresh = false) => {
        if (!user.userID) {
            console.warn("UserID is null; skipping fetch.");
            return;
        }

        if (isFetching) return;
        isFetching = true;

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
            isFetching = false;
        }
    };

    useEffect(() => {
        if (user.userID) {
            console.log("UserID available, fetching discounts.");
            setIsLoading(true);
            fetchUserDiscounts();
        } else {
            console.warn("UserID is null, skipping fetch.");
        }
    }, [user.userID]);


    const openEditModal = (item) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const closeModal = () => {
        setSelectedItem(null);
        setModalVisible(false);
    };

    const copyToClipboard = (text) => {
        Clipboard.setString(text);
        Alert.alert('Copied to clipboard!');
    };


    const renderDiscount = ({ item }) => {
        if (!item) return null;

        return (
            <View key={item.id} style={styles.codeContainer}>
                <View style={styles.discountHeader}>
                    <Image
                        style={styles.discountIcon}
                        source={require('@assets/images/discount.png')}
                    />
                    <Text style={styles.discountsPercentInfo}>
                        {item.discountCode.slice(-2)}% OFF
                    </Text>
                </View>
                <Text style={styles.discountsInfo}>
                    Code: <Text style={styles.discountCode}>{item.discountCode}</Text>
                </Text>
                <TouchableOpacity
                    style={styles.copyButton}
                    onPress={() => copyToClipboard(item.discountCode)}>
                    <Text style={styles.buttonText}>Copy Code</Text>
                </TouchableOpacity>
            </View>
        );
    };


    return (
        <ImageBackground
            source = {require('@assets/images/TMBackground.png')}
            resizeMode="stretch"
            style = {styles.image}>
            <View style={styles.container}>
                <View style={styles.discountsAppliedContainer}>
                    <Text style={styles.discountLine}>Discounts for {user.firstName}:</Text>
                </View>
                <FlatList
                    data={discounts}
                    renderItem={renderDiscount}
                    keyExtractor={(item) => item.id}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading}
                            onRefresh={() => fetchUserDiscounts(true)}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        width: '100%',
    },
    header: {
        fontSize: 30,
        fontFamily: 'shrikhand',
        textAlign: 'left',
        marginBottom: 20,
        color: '#219281FF',
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        opacity: 0.90,
    },

    discountLine: {
        fontFamily: 'shrikhand',
        fontSize: 25,
        color: 'rgb(92,183,165)',
        textAlign: 'center',
    },
    discountsAppliedContainer:{
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
    },
    codeContainer:{
        position: 'relative',
        top: '10%',
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 15,
    },
    discountsInfo:{
        margin:10,
        width: '100%',
        fontFamily: 'sulphurPoint',
        fontSize: 22,
        textAlign: 'center'
    },
    discountsPercentInfo:{
        margin:10,
        width: '100%',
        fontFamily: 'shrikhand',
        fontSize: 30,
        color: '#FF0000',
        textAlign: 'center',
    },
    discountCode: {
        fontFamily: 'sulphurPoint',
        color: '#219281FF'
    },
    noDiscountContainer:{},
    noDiscountsText:{
        fontFamily: 'sulphurPoint',
        fontSize: 22,
    },
    copyButton: {
        flexDirection: 'row',
        backgroundColor: 'rgb(92,183,165)',
        paddingVertical: 10,
        borderRadius: 30,
        marginBottom: 9,
        marginTop: 15,
        justifyContent: 'center',
        width: '90%',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    buttonText:{
        fontFamily: 'sulphurPoint',
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginLeft: 10,
    },
    discountHeader:{
        flexDirection: 'row',
    },
    discountIcon: {
        width: 40,
        height: 40,
        position: 'relative',
        left: '28%',
        top: '5%',
        transform: [{ rotate: '-45deg' }]
    },
});

export default ViewNewIn;
