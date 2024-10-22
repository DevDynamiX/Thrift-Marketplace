import React,{useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Image, Alert} from "react-native";
import DatePicker from "react-native-date-picker";

 const PaymentScreen =() =>
{
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv,setCVV] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderNumber, setOrderNumber] = useState<number|null>(null);

    const handlePayment = () =>{

        if(!cardNumber||!expiryDate||!cvv){
            Alert.alert("Error", "Please complete all fields");
        }

        setIsProcessing(true);

        setTimeout(()=>{
            setIsProcessing(false);
            const success = Math.random()>0.5;
            if(success){
                const generatedOrderNumber  = Math.floor(100000 +Math.random() * 900000);
                setOrderNumber(generatedOrderNumber);
                setStatusMessage('Payment Complete. Order Number: '+generatedOrderNumber);

                /*
                    //const payementdata = {generatedOrderNumber};

                //post request
                    fetch(api_url,{
                    method:'post',
                    headers:{
                    'Content-type':"application/json"
                    },
                    body:JSON.stringfy(paymentData),
                    })
                        .then(response=>response.json())
                        .then(data=>{
                            console.log(data);
                            };
                        .catch(error=>{
                            console.log(error);
                            });

                  //Query
                  Insert into tbl_order username, ordernumber

                  (( fetch username from seesion possibly))
                */
            }
            else {
                setStatusMessage('Payment Failed');
            }
        },2000);
    };

    const handleExpiryDateChange = (text:string)=>{
        if(text.length ===2 && !text.includes('/')){
            text=text+'/';
        }
        const formattedText = text.replace(/[^0-9\/]/g, '');

        if(formattedText.length <=5){
            setExpiryDate(formattedText);
        }
    }

    return (
        <View style={styles.container}>

            <View style={styles.inputContainer}>
                <TextInput
                style={styles.input}
                placeholder="First Name"/>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Last Name"/>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Billing Address"/>
            </View>

            <View style={styles.inputContainer}>
            <TextInput
            style={styles.input}
            placeholder="CardNumber"
            value={cardNumber}
            onChangeText={(text) => setCardNumber(text)}
            keyboardType="numeric"
            maxLength={16}/>

            {(cardNumber[0] ==='2'|| cardNumber [0]==='5') && (
                <Image
                    source={{ uri: 'https://icon2.cleanpng.com/20180824/kxc/kisspng-mastercard-logo-credit-card-visa-brand-mastercard-logo-icon-paypal-icon-logo-png-and-v-1713949472663.webp' }}
                    style={styles.cardImage}
                />
            )}
            {cardNumber[0] ==='3' && (
                <Image
                    source={{ uri: 'https://image.similarpng.com/very-thumbnail/2020/06/Logo-VISA-transparent-PNG.png' }}
                    style={styles.cardImage}
                />
            )}
            {cardNumber[0] ==='4' && (
                <Image
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


            <Button title="Pay Now" onPress={ handlePayment} disabled={isProcessing}/>
            {isProcessing &&<Text style={styles.processingText}>Proccessing Payment....</Text>}

            {statusMessage ? (
                <Text style={statusMessage.includes('Successful') ? styles.successText : styles.failureText}>
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