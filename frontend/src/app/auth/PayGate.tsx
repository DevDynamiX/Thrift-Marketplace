import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";

// Make use of destructors to hold current state and allow the state to be updated.
const PaymentScreen = () => {
    const { total } = useLocalSearchParams();
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCVV] = useState('');
    const [email, setEmail] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async () => {
        // basic validation , adjust if required
        // validation of user entry to simulate use of payment system
        if (!cardNumber || !expiryDate || !cvv || !email) {
            Alert.alert("Error", "Please complete all fields");
            return;
        }

        setIsProcessing(true);

        //implementation of error checking
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));// simulating proccess time due to local testing

            const orderNumber = Math.floor(100000 + Math.random() * 900000);// generation of order number

            // Saves order to table orders in databse
            const response = await fetch('http://localhost:3000/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderNumber: orderNumber,
                    email: email,
                    total: Number(total)
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Transaction failed');//notification  of transaction failure
            }
            const data = await response.json();
            setStatusMessage(`Payment Complete. Order Number: ${orderNumber}`);
        } catch (error) {
            setStatusMessage(error instanceof Error ? error.message : 'Payment Failed');
            Alert.alert("Error", "Payment failed. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };
    // formating of date [MM/YY]
    const handleExpiryDateChange = (text: string) => {
        if (text.length === 2 && !text.includes('/')) {
            text = text + '/';
        }
        const formattedText = text.replace(/[^0-9\/]/g, '');

        if (formattedText.length <= 5) {
            setExpiryDate(formattedText);
        }
    };

    return (
        <View style={styles.container}>
            <View>
                <Text>Total Amount: R{Number(total).toFixed(2)}</Text>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
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

            <Button
                title={isProcessing ? "Processing..." : "Pay Now"}
                onPress={handlePayment}
                disabled={isProcessing}
            />

            {isProcessing && <Text style={styles.processingText}>Processing Payment...</Text>}

            {statusMessage ? (
                <Text style={statusMessage.includes('Complete') ? styles.successText : styles.failText}>
                    {statusMessage}
                </Text>
            ) : null}
        </View>
    );
};
export default PaymentScreen;

const styles = StyleSheet.create({
    container: {
        padding:20,
        justifyContent:"center",
    },
    input:{
        borderWidth:0,
        marginVertical:10,
        paddingHorizontal:5,
    },
    processingText:{
      marginTop:20,
      color:'blue',
    },
    successText:{
        color:'green',
    },
    failText:{
        color:'red',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 10,
    },
    cardImage:{
        width:40,
        height:25,
    },
});
