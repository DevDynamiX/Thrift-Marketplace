import React, {useEffect, useState} from 'react';
import {
    View,
    Text,

    StyleSheet,
    Image,
    ImageBackground,
    SafeAreaView,
    ActivityIndicator,
    TouchableOpacity
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import {useFonts} from "expo-font";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {router, useRouter } from "expo-router";
import LottieView from "lottie-react-native";

// Make use of destructors to hold current state and allow the state to be updated.
const PostPay = () => {
    const [user, setUser] = useState({isLoggedIn: false, userToken: null, userEmail: null, firstName: null, userID: null})
    const router = useRouter();

    const { orderNumber } = useLocalSearchParams();

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

    if (!fontsLoaded) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="white" />
            </SafeAreaView>
        );
    }
    const goHome = () =>{
        console.log("go home");
        router.push({
            pathname:'(tabs)/HomeScreen',
        });
    };

    return (
        <ImageBackground
            source={require('@assets/images/TMBackground.png')}
            resizeMode="stretch"
            style={styles.image}>
            <View style = {styles.mainContainer}>
                <Image source = {require('@assets/images/TMPageLogo.png')} style={styles.logo}/>
                 <View style = {styles.statusMessageContainer}>
                     <Icon
                         name={ 'happy-outline'}
                         style={[
                             styles.happyFace,]}
                         size={35}
                     />
                     <View style = {styles.message}>
                         <LottieView
                             source={require('@assets/animations/celebrate.json')}
                             autoPlay
                             loop={false}
                             style = { styles.celebrateAnimationModal }
                         />
                         <Text style = {styles.orderText}>Thank you for placing an order with us {user.firstName}!</Text>

                         {orderNumber ? (
                             <Text style = {styles.orderNumberText}>Order Number: {orderNumber}</Text>  // Display the status message
                         ) : (
                             <Text style = {styles.noOrderNumberText}>No order number available</Text>
                         )}
                     </View>
                     <TouchableOpacity style = {styles.homeButtonContainer} onPress={() => goHome()}>
                         <View style = {styles.homeButton}>
                             <Icon
                                 name={'home-outline'}
                                 style={[
                                     styles.homeIcon,
                                 ]}
                                 size={20}
                             />
                             <Text style = {styles.homeButtonText}> Home </Text>
                         </View>
                     </TouchableOpacity>

                 </View>
            </View>
        </ImageBackground>
    );
};
export default PostPay;

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
        height: '35%',
        position: "relative",
        right: '10%',
        bottom: '20%'
    },
    image:{
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },

    statusMessageContainer: {
        alignSelf: 'center',
        width: '90%',
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        position:'relative',
        bottom: '25%',
        padding: 10
    },
    statusMessageText: {
        fontFamily: 'sulphurPoint',
    },
    homeButtonContainer:{
        zIndex: 6,
    },
    homeButton: {
        alignSelf: 'center',
        width: '30%',
        backgroundColor: '#219281FF',
        flexDirection: 'row',
        padding: 10,
        borderRadius: 10,
    },
    homeIcon: {
        color: '#93D3AE'
    },
    homeButtonText: {
        fontFamily: 'sulphurPoint',
        color: '#93D3AE',
        fontSize: 20
    },
    orderText: {
        fontFamily: 'sulphurPoint',
        color: '#219281FF',
        fontSize: 30,
        textAlign: 'center',
        marginBottom: 15,
        marginTop: 10,
    },
    happyFace: {
        marginTop: 10,
        color: '#219281FF',
        position: 'relative',
        left: '45%',
    },
    message: {
        fontFamily: 'sulphurPoint',
        margin: 5,
    },
    orderNumberText: {
        fontFamily: 'sulphurPoint',
        fontSize:20,
        color: '#93D3AE',
        textAlign: 'center',
        marginBottom: 15,
    },
    noOrderNumberText: {
        fontFamily: 'sulphurPoint',
        fontSize:20
    },
    celebrateAnimationModal: {
        position: 'absolute',
        alignSelf: 'center',
        zIndex: 5,
        width: 800,
        height: 800,
        top: '-50%'
    },


});
