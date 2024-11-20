import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Image,
    Alert,
    ImageBackground,
    SafeAreaView,
    ActivityIndicator,
    ImageStyle, TouchableOpacity, Platform, KeyboardAvoidingView,
    Keyboard, TouchableWithoutFeedback
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import {useFonts} from "expo-font";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import {router, useRouter} from "expo-router";

// Make use of destructors to hold current state and allow the state to be updated.
const PaymentScreen = () => {
    const router = useRouter();

    const [user, setUser] = useState({isLoggedIn: false, userToken: null, userEmail: null, firstName: null, userID: null})

    const { totalWithShipping, discountCode } = useLocalSearchParams();
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCVV] = useState('');
    const [email, setEmail] = useState('');
    const [discount, setDiscount] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [address, setAddress] = useState('');
    const [username, setUsername] = useState('');

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

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const userDataString = await AsyncStorage.getItem('userData');
                console.log('Stored email:', userDataString);

                if (userDataString) {
                    const userData = JSON.parse(userDataString);
                    console.log('Email from userData:', userData.email);
                    setUsername(userData.email);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchUserName();
    }, []);

    if (!fontsLoaded) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="white" />
            </SafeAreaView>
        );
    }

    const handlePayment = async () => {
        // basic validation , adjust if required
        // validation of user entry to simulate use of payment system
        if (!cardNumber || !expiryDate || !cvv || !username || !address) {
            Alert.alert("Error", "Please complete all fields");
            return;
        }

        setIsProcessing(true);

        //implementation of error checking
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));// simulating proccess time due to local testing

            const orderNumber = Math.floor(100000 + Math.random() * 900000);// generation of order number

            // Saves order to table orders in databse
            const response = await fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderNumber: orderNumber,
                    email: username,    // Make sure 'username' matches the field the backend expects
                    address: address,
                    total: Number(totalWithShipping),   // Ensure total is a number
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Transaction failed');//notification  of transaction failure
            }
            const data = await response.json();

            setStatusMessage(`Payment Complete. Order Number: ${orderNumber}`);

            goToPostPay(orderNumber, discountCode)

        } catch (error) {
            setStatusMessage(error instanceof Error ? error.message : 'Payment Failed');
            console.log(error);
            Alert.alert("Error", "Payment failed. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const goToPostPay = (orderNumber, discountCode) =>{
        router.push({
            pathname:'pages/PostPay',
            params:{orderNumber, discountCode},
        });
    };

    // formating of date [MM/YY]
    const handleExpiryDateChange = (text: string) => {
        if (text.length === 2 && !text.includes('/')) {
            text = text + '/';
        }
        const formattedText = text.replace(/[^0-9\/]/g, '');

        if (formattedText.length <= 5) {
            const [inputMonth,inputYear] = formattedText.split('/').map(Number);

            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1;
            const currentYear = currentDate.getFullYear()%100;

            if(
                formattedText.includes('/') && !isNaN(inputMonth) && !isNaN(inputYear)
            ){
                setExpiryDate(formattedText);
            }else{
                setExpiryDate(formattedText);
            }
        }
    };

    return (
        <ImageBackground
            source={require('@assets/images/TMBackground.png')}
            resizeMode="stretch"
            style={styles.image}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.avoidingView}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style = {styles.mainContainer}>
                        <Image source = {require('@assets/images/TMPageLogo.png')} style={styles.logo}/>

                        <View style={styles.container}>
                            <View style = {styles.totalTextContainer}>
                                <Text style = {styles.totalText}>Total Amount: R{Number(totalWithShipping).toFixed(2)}</Text>
                            </View>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    value={username}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    editable={false}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Delivery Address"
                                    value={address}
                                    onChangeText={setAddress}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Card Number"
                                    value={cardNumber}
                                    onChangeText={setCardNumber}
                                    keyboardType="numeric"
                                    maxLength={16}
                                />
                                {(cardNumber[0] === '2' || cardNumber[0] === '5') && ( // use of a card identifier to add more vailidation limiting the amount of fruadulent acts
                                    <Image
                                        // card identifier
                                        source={{ uri: 'https://icon2.cleanpng.com/20180824/kxc/kisspng-mastercard-logo-credit-card-visa-brand-mastercard-logo-icon-paypal-icon-logo-png-and-v-1713949472663.webp' }}
                                        style={styles.cardImage}
                                    />
                                )}
                                {cardNumber[0] === '3' && (
                                    <Image
                                        // card identifier
                                        source={{ uri: 'https://image.similarpng.com/very-thumbnail/2020/06/Logo-VISA-transparent-PNG.png' }}
                                        style={styles.cardImage}
                                    />
                                )}
                                {cardNumber[0] === '4' && (
                                    <Image
                                        // card identifier
                                        source={{ uri: 'https://banner2.cleanpng.com/20180805/kii/a59ea355d7df4a5d908dd47ca00ef3ee.webp' }}
                                        style={styles.cardImage}
                                    />
                                )}
                            </View>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Expiry Date (MM/YY)"
                                    value={expiryDate}
                                    onChangeText={handleExpiryDateChange}
                                    keyboardType="numeric"
                                    maxLength={5}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="CVV"
                                    value={cvv}
                                    onChangeText={setCVV}
                                    keyboardType="numeric"
                                    maxLength={4}
                                />
                            </View>

                            <TouchableOpacity  style = {styles.payButton} onPress={handlePayment}  disabled={isProcessing}>
                                <Text style = {styles.payText}> {isProcessing ? "Processing..." : "Pay Now"} </Text>
                                <Icon
                                    name={ 'card-outline'}
                                    style={[
                                        styles.cardIcon,]}
                                    size={30}
                                />
                            </TouchableOpacity>



                            {isProcessing && <Text style={styles.processingText}>Processing Payment...</Text>}

                            {statusMessage ? (
                                <Text style={statusMessage.includes('Complete') ? styles.successText : styles.failText}>
                                    {statusMessage}
                                </Text>
                            ) : null}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};
export default PaymentScreen;

const styles = StyleSheet.create({
    container: {
        padding:20,
        justifyContent:"center",
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        margin: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
        alignSelf: 'center',

    },
    mainContainer: {
        position: 'relative',
        bottom: '5%'
    },
    logo: {
        resizeMode: 'contain',
        width: '100%',
        height: '20%',
        position: "relative",
        right: '12%',
        top: '2%'
    },
    input:{
        width: '100%',
        fontSize: 16,
        marginVertical:10,
        paddingHorizontal:5,
        fontFamily: 'sulphurPoint'
    },
    processingText:{
      marginTop:20,
      color:'#219281FF',
    },
    successText:{
        color:'green',
    },
    failText:{
        color:'#FF0000',
    },
    inputContainer: {
        fontFamily: 'sulphurPoint',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(51,51,51,0.19)',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 10,
    },
    cardImage:{
        width:40,
        height:25,
        position: "relative",
        right: 45
    },
    image:{
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    totalTextContainer: {},
    totalText: {
        fontFamily: 'sulphurPoint_Bold',
        fontSize: 25,
        color: '#333333'
    },
    payButton: {
        backgroundColor: '#219281',
        padding: 15,
        borderRadius: 10,
        justifyContent: "space-around",
        display: "flex",
        flexDirection: "row-reverse"
    },
    payText: {
        fontFamily: 'sulphurPoint',
        color:'rgb(180,238,206)',
        fontSize: 25,
    },
    cardIcon: {
        color:'rgb(180,238,206)',
    },
    avoidingView:{
        width: '100%'
    }

});
