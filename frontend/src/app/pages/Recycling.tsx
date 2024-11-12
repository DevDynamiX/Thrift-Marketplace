
import React, {
    useState,
    useEffect,
    useRef,
    useContext } from 'react';
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
    FlatList,
    Alert, Animated, Pressable, TextInput
} from 'react-native';
import  { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import Constants from "expo-constants";
import {useNavigation} from '@react-navigation/native';
import { Formik } from 'formik';
import {Picker} from "@react-native-picker/picker";


const { width } = Dimensions.get('window');
const itemSize = width/3;


const RecycleNow = () => {
    const navigation = useNavigation();

    // Load fonts asynchronously
    const [fontsLoaded] = useFonts({
        'montserrat': require('@assets/fonts/Montserrat-VariableFont_wght.ttf'),
        'montserrat_Italic': require('@assets/fonts/Montserrat-Italic-VariableFont_wght.ttf'),
        'sulphurPoint': require('@assets/fonts/SulphurPoint-Regular.ttf'),
        'sulphurPoint_Bold': require('@assets/fonts/SulphurPoint-Bold.ttf'),
        'sulphurPoint_Light': require('@assets/fonts/SulphurPoint-Light.ttf'),
        'shrikhand': require('@assets/fonts/Shrikhand-Regular.ttf'),
    });

    // If fonts are not loaded, show a loading indicator within the component itself
    if (!fontsLoaded) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="white" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <StatusBar barStyle="light-content" backgroundColor="black"/>

                <ImageBackground
                    source = {require('@assets/images/TMBackground.png')}
                    resizeMode="stretch"
                    style = {styles.image}>
                    <Text>.</Text>
                    <View style={styles.recContainer}>
                        <Image source={require('@assets/images/TMPageLogo.png')} style={styles.logo as ImageStyle}/>

                        {/*TODO: Filter by gender*/}
                        <View style={styles.formContainer}>
                            <View style = {styles.exitRow}>
                                <TouchableOpacity onPress={() => navigation.goBack()}>
                                    <Icon name="chevron-forward-outline" style={styles.backIcon} size={30} />
                                </TouchableOpacity>
                                <Text style={styles.titleText}>Recycle Now</Text>
                            </View>
                            <Formik
                                initialValues={{
                                    email: '',
                                    firstName: '',
                                    lastName: '',
                                    description: '',
                                    dropoffLocation: '',
                                }}

                                //onSubmit={}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
                                    <View style={styles.formContainer}>
                                        <Text style = { styles.formHeader }> Send Your Recycling: </Text>
                                        <Text style = { styles.infoText}> * indicates a required field </Text>


                                        <Text style={styles.label}> Email*:</Text>
                                        <TextInput
                                            style={styles.input}
                                            onChangeText={handleChange('email')}
                                            onBlur={handleBlur('email')}
                                            value={values.email}
                                            placeholderTextColor="#6b7280"
                                            placeholder="Enter Email You Signed Up With"
                                        />


                                        <Text style={styles.label}>First Name*: </Text>
                                        <TextInput
                                            style={styles.input}
                                            onChangeText={handleChange('firstName')}
                                            onBlur={handleBlur('firstName')}
                                            placeholderTextColor="#6b7280"
                                            value={values.firstName}
                                            placeholder="Enter First Name"
                                        />

                                        <Text style={styles.label}>Last Name*: </Text>
                                        <TextInput
                                            style={styles.input}
                                            onChangeText={handleChange('lastName')}
                                            onBlur={handleBlur('lastName')}
                                            value={values.lastName}
                                            placeholderTextColor="#6b7280"
                                            placeholder="Enter Last Name"
                                        />

                                        <Text style={styles.label}>Description*: </Text>
                                        <TextInput
                                            style={styles.input}
                                            onChangeText={handleChange('description')}
                                            onBlur={handleBlur('description')}
                                            placeholderTextColor="#6b7280"
                                            value={values.description}
                                            placeholder="Enter item description"
                                        />

                                        <Text style={styles.label}>Drop-off Location*: </Text>
                                        <Picker
                                            selectedValue={values.category}
                                            style={styles.pickerStyle}
                                            onValueChange={(itemValue) => setFieldValue('dropoffLocation', itemValue)}
                                            onBlur={handleBlur('dropoffLocation')}
                                        >
                                            <Picker.Item label="Select a Location" value="" />
                                            <Picker.Item label="Cresta Mall" value="cresta_mall" />
                                            <Picker.Item label="Menlyn Mall" value="menlyn_mall" />
                                            <Picker.Item label="Clearwater Mall" value="clearwater_mall" />
                                            <Picker.Item label="Mall of Africa" value="mall_of_africa" />
                                            <Picker.Item label="Sandton City" value="sandton_city" />
                                            <Picker.Item label="V&A Waterfront" value="VA_waterfront" />
                                        </Picker>



                                        <View style = { styles.submitBtnContainer}>
                                            <TouchableOpacity style = {styles.submitButton} onPress={handleSubmit}>
                                                <Icon name = 'download-outline' size={24} color="#93D3AE" />
                                                <Text style={ styles.buttonText}>Recycle Now!</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </Formik>
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
        // /backgroundColor:'#93D3AE',

    },
    image: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    favsContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        //position: 'relative',
    },
    logo: {
        resizeMode: 'contain' as ImageStyle['resizeMode'],
        width: 260,
        position:'relative',
        bottom: '10%'
    },
    exitRow: {
        flexDirection: 'row'
    },
    titleText: {
        fontFamily: 'shrikhand',
        fontSize: 25,
        color: '#219281FF',
        marginLeft: 10,
        paddingBottom:'2%',
    },
    backIcon: {
        transform: [{ rotate: '180deg' }],
        color: '#93D3AE',
    },
    formContainer: {
        height: '100%',
        width: '90%',
        display: 'flex',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        borderRadius: 10,
        position: 'relative',
        left: '5%',
        top: '0.5%',
        marginBottom: '1%',

    },
    formHeader: {
        fontFamily: 'shrikhand',
        color: '#219281FF',
        fontSize: 28,
        textAlign: 'center',
        marginBottom: '5%',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#212121',
        fontFamily: 'sulphurPoint',
    },
    input: {
        height: 30,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        paddingLeft: 10,
        borderRadius: 4,
        fontFamily: 'sulphurPoint',
        color: '#219281FF',
    },
    Formik: {
        position: "relative",
        bottom: '3%'
    },
    submitBtnContainer: {
        margin: '10%',
        width: 'auto',
    },
    submitButton: {
        backgroundColor: '#219281FF',
        display: "flex",
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        padding: 10,
        alignItems: "center",
        borderRadius: 5,
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
    buttonText: {
        fontFamily: 'sulphurPoint',
        color: '#93D3AE',
        fontSize: 18,
        marginRight: 15,
    },

});


export default RecycleNow;
