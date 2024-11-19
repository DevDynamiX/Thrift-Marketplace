import React, {
    useState,
    useEffect,
     } from 'react';
import {
    View,
    ImageBackground,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    Text,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    TextInput
} from 'react-native';
import  { useFonts } from 'expo-font';
import LottieView from 'lottie-react-native';
import Constants from "expo-constants";
// Todo removed Navigitation as it caused a nested Navigition error
// import {useNavigation} from '@react-navigation/native';
import { Formik } from 'formik';
import {Picker} from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";


const { width } = Dimensions.get('window');
const itemSize = width/3;

const RecycleNow = () => {
    // Todo removed Navigitation as it caused a nested Navigition error
    // const navigation = useNavigation();

    // Load fonts asynchronously
    const [fontsLoaded] = useFonts({
        'sulphurPoint': require('@assets/fonts/SulphurPoint-Regular.ttf'),
        'sulphurPoint_Bold': require('@assets/fonts/SulphurPoint-Bold.ttf'),
        'sulphurPoint_Light': require('@assets/fonts/SulphurPoint-Light.ttf'),
        'shrikhand': require('@assets/fonts/Shrikhand-Regular.ttf'),
    });
    const [isRecyclingAnimationCompleted, setIsRecyclingAnimationCompleted] = useState({});
    const [playRecyclingAnimation, setPlayRecyclingAnimation] = useState({});
    const [loading, setLoading] = useState(false);


    // If fonts are not loaded, show a loading indicator within the component itself
    if (!fontsLoaded) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="white" />
            </SafeAreaView>
        );
    }

    //saving to the recycling table
    const handleRecyclingUpload = async ( values, {resetForm}) => {
        setLoading(true);

        try {
            const formData = {
                userID: 1,
                email: values.email,
                firstName: values.firstName,
                lastName: values.lastName,
                description: values.description,
                dropoffLocation: values.dropoffLocation,
            };

            console.log("Form data:", formData);

            const dbResponse = await fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/recycling`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const responseText = await dbResponse.text();
            const responseData = JSON.parse(responseText);
            console.log("Raw response:", responseData);

            if (!responseData.success) {
                alert(`Error: ${responseData.message}`);
                return;
            }

            Alert.alert("Success", "Recycling successfully logged!");
            resetForm();
        } catch (error) {
            console.error('Error:', error);
            Alert.alert("Error", "An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="black"/>

                <ImageBackground
                    source = {require('@assets/images/TMBackground.png')}
                    resizeMode="stretch"
                    style = {styles.image}>
                    <View style={styles.recContainer}>
                        //
                        {/*<Image source={require('@assets/images/TMPageLogo.png')} style={styles.logo as ImageStyle}/>*/}
                        <View style={styles.formContainer}>
                            <View style = {styles.top}>
                                <View style = {styles.exitRow}>
                                    // Todo removed Navigitation as it caused a nested Navigition error
                                    {/*<TouchableOpacity onPress={() => navigation.goBack()}>
                                        <Icon name="chevron-forward-outline" style={styles.backIcon} size={30} />
                                    </TouchableOpacity>*/}
                                    <Text style={styles.titleText}>Recycle Now</Text>
                                </View>
                                <View style={styles.separator} />
                            </View>

                            <Formik
                                initialValues={{
                                    userID: 1,
                                    email: '',
                                    firstName: '',
                                    lastName: '',
                                    description: '',
                                    dropoffLocation: '',
                                }}

                                onSubmit={handleRecyclingUpload}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
                                    <View style={styles.form}>
                                        <Text style = { styles.formHeaders }> Send Your Recycling: </Text>
                                        <Text style = { styles.infoText}> * indicates a required field </Text>

                                        {/*TODO: submit userID from session*/}
                                        <TextInput
                                            // onChangeText={handleChange('userID')}
                                            // onBlur={handleBlur('userID')}
                                            value={values.userID}
                                            editable={false}
                                        />

                                        <View style={styles.formFilled}>
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
                                                selectedValue={values.dropoffLocation}
                                                style={styles.pickerStyleRec}
                                                onValueChange={(itemValue) => setFieldValue('dropoffLocation', itemValue)}
                                                onBlur={handleBlur('dropoffLocation')}
                                            >
                                                <Picker.Item label="Select a Location" value="" />
                                                <Picker.Item label="Cresta Mall" value="Cresta Mall" />
                                                <Picker.Item label="Menlyn Mall" value="Menlyn Mall" />
                                                <Picker.Item label="Clearwater Mall" value="Clearwater Mall" />
                                                <Picker.Item label="Mall of Africa" value="Mall of Africa" />
                                                <Picker.Item label="Sandton City" value="Sandton City" />
                                                <Picker.Item label="V&A Waterfront" value="V&A Waterfront" />
                                            </Picker>

                                            <View style = { styles.submitBtnContainer}>
                                                <TouchableOpacity style = {styles.submitButton} onPress={handleSubmit}>
                                                    <LottieView
                                                        source={require('@assets/animations/recycleAnimation.json')}
                                                        autoPlay
                                                        loop={true}
                                                        style = { styles.recAnimationModal }
                                                    />
                                                    <Text style={ styles.buttonText}>Recycle Now!</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </Formik>
                        </View>
                    </View>
                </ImageBackground>
        </SafeAreaView>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#93D3AE',
    },
    image: {
//
        width: '100%',
        height: '100%',
    },
    recContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        width: '85%',
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        borderRadius: 10,
        padding: 15,
        marginTop: 30,
    },
    titleText: {
        fontFamily: 'shrikhand',
        fontSize: 26,
        color: '#219281FF',
        textAlign: 'center',
        marginBottom: 10,
    },
    formHeaders: {
        fontFamily: 'sulphurPoint_Bold',
        fontSize: 20,
        color: '#219281FF',
        paddingBottom: 10,
    },
    infoText: {
        fontFamily: 'sulphurPoint',
        color: '#FF0000',
        textAlign: 'right',
    },
    label: {
        fontSize: 14,
        marginBottom: 4,
        color: '#212121',
        fontFamily: 'sulphurPoint',
    },
    input: {
        height: 36,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 8,
        borderRadius: 4,
        color: '#219281FF',
    },
    pickerStyleRec: {
        fontFamily: 'sulphurPoint',
        fontSize: 13,
        color: '#219281FF',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginBottom: 10,
    },
    submitButton: {
        backgroundColor: '#219281FF',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 8,
        alignItems: "center",
        borderRadius: 5,
        marginTop: 15,
    },
    buttonText: {
        fontFamily: 'sulphurPoint',
        color: '#93D3AE',
        fontSize: 18,
    },
    recAnimationModal: {
        width: 36,
        height: 36,
        marginRight: 8,
    },


});

export default RecycleNow;
