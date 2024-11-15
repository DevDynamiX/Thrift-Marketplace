import React, { useState } from 'react';
import {
    View,
    ImageBackground,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    Image,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Keyboard,
    Alert, RefreshControl, KeyboardAvoidingView, Platform, TouchableWithoutFeedback
} from 'react-native';
import { Formik } from 'formik';
import * as ImagePicker from 'expo-image-picker';
import { useFonts } from "expo-font";
import Icon from 'react-native-vector-icons/Ionicons';
import Constants from 'expo-constants';
import { Picker } from '@react-native-picker/picker';

const InsertProdScreen = () => {

    const [fontsLoaded] = useFonts({
        'montserrat': require('@assets/fonts/Montserrat-VariableFont_wght.ttf'),
        'montserrat_Italic': require('@assets/fonts/Montserrat-Italic-VariableFont_wght.ttf'),
        'sulphurPoint': require('@assets/fonts/SulphurPoint-Regular.ttf'),
        'sulphurPoint_Bold': require('@assets/fonts/SulphurPoint-Bold.ttf'),
        'sulphurPoint_Light': require('@assets/fonts/SulphurPoint-Light.ttf'),
        'shrikhand': require('@assets/fonts/Shrikhand-Regular.ttf'),
    });

    const [ refresh, setRefresh] = useState(false);

    const [imageUris, setImageUris] = useState({
        mainImage: '',
        image2: '',
        image3: '',
    });

    const handleRefresh = () => {
        setRefresh(true);
        setTimeout(() => {
            setRefresh(false);
        }, 1000); // Simulate the refresh duration, you can adjust this
    };

    const handleImagePick = async (imageType: string, setFieldValue: Function) => {
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert('Permission to access the gallery is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const selectedImage = result.assets[0];
            if (selectedImage && selectedImage.uri) {
                setImageUris(prevState => ({
                    ...prevState,
                    [imageType]: selectedImage.uri,
                }));

                setFieldValue(imageType, selectedImage.uri);
                console.log('Selected image:', result);
            }
        } else {
            Alert.alert('Warning','Image selection canceled or no image found. ' )
            console.log("Image selection canceled or no image found.");
        }
    };

    const removeImage = (imageType: string) => {
        setImageUris(prevState => ({
            ...prevState,
            [imageType]: '',
        }));
    };

    //for db use

    //get admin ID from session
    //const [adminID, setAdminID] = useState('');
    const [loading, setLoading] = useState(false);

    interface InventoryFormValues {
        SKU: string;
        itemName: string;
        itemPrice: number;
        description: string;
        category: string;
        size: string;
        colour: string;
        sex: string;
        damage: string;
        material: string;
        onSale: boolean;
        salePrice: number;
        discountPercent: number;
        mainImage: string;
        image2: string;
        image3: string;
    }

    //displaying on sale fields if toggled
    const [ onSale, setOnSale ] = useState(false);

    //saving the form data
    const handleInventoryUpload = async (values: InventoryFormValues, {resetForm}) => {
        setLoading(true);

        try {
            let adjustedSalePrice =  values.salePrice;

            if (values.onSale){
                if (!adjustedSalePrice) {
                    alert('A sale price is required if an item is on sale.');
                    setLoading(false);
                    return;
                }}

            const formData = {
                SKU: values.SKU,
                itemName: values.itemName,
                itemPrice: values.salePrice ? values.salePrice : values.itemPrice,
                description: values.description,
                category: values.category,
                size: values.size,
                colour: values.colour,
                sex: values.sex,
                damage: values.damage,
                material: values.material,
                onSale: values.onSale,
                salePrice: values.onSale ?  adjustedSalePrice : null,
                discountPercent: values.onSale ? values.discountPercent : null,
                mainImage: imageUris.mainImage ? {
                    uri: imageUris.mainImage,
                    name: 'mainImage.jpg',
                    type: 'image/jpeg',
                }: null,
                image2: imageUris.image2 ? {
                    uri: imageUris.image2,
                    name: 'image2.jpg',
                    type: 'image/jpeg'
                }: null,
                image3: imageUris.image3 ? {
                    uri: imageUris.image3,
                    name: 'image3.jpg',
                    type: 'image/jpeg'
                }:null,
            };

            console.log("Form data:", formData);

            const dbResponse = await fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/inventory`, {
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
            Alert.alert("Success", "Item successfully added to inventory!");
            resetForm();
            resetImages();
        } catch (error) {
            console.error('Error:', error);
            Alert.alert("Error", "An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const resetImages = () => {
        setImageUris({
            mainImage: '',
            image2: '',
            image3: ''
        })
    }

    return (
        <SafeAreaView style = {styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="black" />
            <ImageBackground
                source = {require('@assets/images/TMBackground.png')}
                resizeMode="stretch"
                style = {styles.image}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.avoidingView}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style = { styles.mainContainer }>
                            {/* <Image source = {require('@assets/images/TMPageLogo.png')} style={styles.logo}/>*/}
                    <ScrollView style = {styles.Formik}
                                refreshControl={
                                    <RefreshControl refreshing={refresh} onRefresh={() => handleRefresh()} />
                                }
                    >
                        {/*form to handle inventory uploads*/}
                        <Formik
                            initialValues={{
                                SKU: '',
                                itemName: '',
                                itemPrice: '',
                                description: '',
                                category: '',
                                size: '',
                                colour: '',
                                sex: '',
                                damage: '',
                                material: '',
                                onSale: false,
                                salePrice: null,
                                discountPercent: null,
                                mainImage: '',
                                image2: '',
                                image3: '',
                            }}
                            onSubmit={handleInventoryUpload}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, resetForm }) => (
                                <View style={styles.formContainer}>
                                    <Text style = { styles.formHeader }> Add Item to Inventory: </Text>
                                    <Text style = { styles.infoText}> * indicates a required field </Text>


                                    <Text style={styles.label}> SKU*:</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange('SKU')}
                                        onBlur={handleBlur('SKU')}
                                        value={values.SKU}
                                        placeholderTextColor="#6b7280"
                                        placeholder="Enter SKU"
                                    />


                                    <Text style={styles.label}>Item Name*: </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange('itemName')}
                                        onBlur={handleBlur('itemName')}
                                        placeholderTextColor="#6b7280"
                                        value={values.itemName}
                                        placeholder="Enter item name"
                                    />

                                    <Text style={styles.label}>Item Price*: </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange('itemPrice')}
                                        onBlur={handleBlur('itemPrice')}
                                        value={values.itemPrice}
                                        placeholderTextColor="#6b7280"
                                        placeholder="Enter price"
                                        keyboardType="numeric"
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

                                    <Text style={styles.label}>Category*: </Text>
                                    <Picker
                                        selectedValue={values.category}
                                        style={styles.pickerStyle}
                                        onValueChange={(itemValue) => setFieldValue('category', itemValue)}
                                        onBlur={handleBlur('category')}
                                    >
                                        <Picker.Item label="Select a category" value="" />
                                        <Picker.Item label="Dress" value="dress" />
                                        <Picker.Item label="T-shirt" value="tshirt" />
                                        <Picker.Item label="Jeans" value="jeans" />
                                        <Picker.Item label="Knits" value="Knits" />
                                        <Picker.Item label="Shorts" value="shorts" />
                                        <Picker.Item label="Button-up" value="buttonup" />
                                        <Picker.Item label="Trousers" value="trousers" />
                                        <Picker.Item label="Skirt" value="skirt" />
                                        <Picker.Item label="Jacket" value="jacket" />
                                    </Picker>

                                    <Text style={styles.label}> Size*: </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange('size')}
                                        onBlur={handleBlur('size')}
                                        placeholderTextColor="#6b7280"
                                        value={values.size}
                                        placeholder="Enter item size (e.g. S, M, L OR 6, 12, 16)"
                                    />

                                    <Text style={styles.label}>Colour*: </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange('colour')}
                                        onBlur={handleBlur('colour')}
                                        placeholderTextColor="#6b7280"
                                        value={values.colour}
                                        placeholder="Enter item colour"
                                    />

                                    <Text style={styles.label}>Sex*: </Text>
                                    <View style={styles.radioContainer}>
                                        <TouchableOpacity
                                            style={styles.radioButton}
                                            onPress={() => setFieldValue('sex', 'male')}
                                        >
                                            <View style={[styles.radioCircle, values.sex === 'male' && styles.selectedRadio]} />
                                            <Text style={styles.radioLabel}>Male</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.radioButton}
                                            onPress={() => setFieldValue('sex', 'female')}
                                        >
                                            <View style={[styles.radioCircle, values.sex === 'female' && styles.selectedRadio]} />
                                            <Text style={styles.radioLabel}>Female</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.radioButton}
                                            onPress={() => setFieldValue('sex', 'unisex')}
                                        >
                                            <View style={[styles.radioCircle, values.sex === 'unisex' && styles.selectedRadio]} />
                                            <Text style={styles.radioLabel}>Unisex</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <Text style={styles.label}> Damage*: </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange('damage')}
                                        onBlur={handleBlur('damage')}
                                        placeholderTextColor="#6b7280"
                                        value={values.damage}
                                        placeholder="Enter item damage"
                                    />

                                    <Text style={styles.label}>Material*: </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange('material')}
                                        onBlur={handleBlur('material')}
                                        placeholderTextColor="#6b7280"
                                        value={values.material}
                                        placeholder="Enter item material"
                                    />

                                    <Text style={styles.label}>Is On Sale?</Text>
                                    <View style={styles.radioContainerSale}>
                                        <TouchableOpacity
                                            style={styles.radioButton}
                                            onPress={() => {setOnSale(true);
                                                setFieldValue('onSale', true);
                                        }}
                                        >
                                            <View style={[styles.radioCircle, values.onSale === true && styles.selectedRadio]} />
                                            <Text style={styles.radioLabel}>Yes</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.radioButton}
                                            onPress={() => {
                                                setOnSale(false);
                                                setFieldValue('onSale', false);
                                                setFieldValue('salePrice', null);
                                                setFieldValue('discountPercent', null);

                                            }}
                                        >
                                            <View style={[styles.radioCircle, values.onSale === false && styles.selectedRadio]} />
                                            <Text style={styles.radioLabel}>No</Text>
                                        </TouchableOpacity>
                                    </View>

                                    { onSale && (
                                        <>
                                            <Text style={styles.label}>Sale Price: </Text>
                                            <TextInput
                                                style={styles.input}
                                                onChangeText={handleChange('salePrice')}
                                                onBlur={handleBlur('salePrice')}
                                                placeholderTextColor="#6b7280"
                                                value={values.salePrice}
                                                placeholder="Enter the sale price of the item"
                                                keyboardType= 'numeric'
                                            />

                                            <Text style={styles.label}>Discount Percent (%): </Text>
                                            <TextInput
                                                style={styles.input}
                                                onChangeText={handleChange('discountPercent')}
                                                onBlur={handleBlur('discountPercent')}
                                                placeholderTextColor="#6b7280"
                                                value={values.discountPercent}
                                                placeholder="Enter the percentage of the item discount (e.g. 10%, 20% )"
                                                keyboardType= 'numeric'
                                            />
                                        </>
                                    )}

                                    <Text style={styles.label}>Main Image*:</Text>
                                    <TouchableOpacity
                                        onPress={() => handleImagePick('mainImage', setFieldValue)}
                                        style={styles.imagePicker}
                                    >
                                        {imageUris.mainImage ? (
                                            <Image source={{ uri: imageUris.mainImage }} style={styles.imagePreview} />
                                        ) : (
                                            <Text style = {styles.warnLabel}>No Image Selected</Text>
                                        )}
                                    </TouchableOpacity>
                                    {imageUris.mainImage ? (
                                        <TouchableOpacity onPress={() => removeImage('mainImage')}>
                                            <View style = {styles.deleteIconContainer}>
                                                <Icon name = 'trash-outline' size={15} color="#F96635" />
                                                <Text style={styles.removeImageText}>Remove Image</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ) : null}

                                    <Text style={styles.label}>Image 2*:</Text>
                                    <TouchableOpacity
                                        onPress={() => handleImagePick('image2', setFieldValue)}
                                        style={styles.imagePicker}
                                    >
                                        {imageUris.image2 ? (
                                            <Image source={{ uri: imageUris.image2 }} style={styles.imagePreview} />
                                        ) : (
                                            <Text style = {styles.warnLabel}>No Image Selected</Text>
                                        )}
                                    </TouchableOpacity>
                                    {imageUris.image2 ? (
                                        <TouchableOpacity onPress={() => removeImage('image2')}>
                                            <View style = {styles.deleteIconContainer}>
                                                <Icon name = 'trash-outline' size={15} color="#F96635" />
                                                <Text style={styles.removeImageText}>Remove Image</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ) : null}

                                    <Text style={styles.label}>Image 3*:</Text>
                                    <TouchableOpacity
                                        onPress={() => handleImagePick('image3', setFieldValue)}
                                        style={styles.imagePicker}
                                    >
                                        {imageUris.image3 ? (
                                            <Image source={{ uri: imageUris.image3 }} style={styles.imagePreview} />
                                        ) : (
                                            <Text style = {styles.warnLabel}>No Image Selected</Text>
                                        )}
                                    </TouchableOpacity>
                                    {imageUris.image3 ? (
                                        <TouchableOpacity onPress={() => removeImage('image3')}>
                                            <View style = {styles.deleteIconContainer}>
                                                <Icon name = 'trash-outline' size={15} color="#F96635" />
                                                <Text style={styles.removeImageText}>Remove Image</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ) : null}

                                    <View style = { styles.submitBtnContainer}>
                                        <TouchableOpacity style = {styles.submitButton} onPress={handleSubmit}>
                                            <Icon name = 'download-outline' size={24} color="#93D3AE" />
                                            <Text style={ styles.buttonText}>Add to Inventory</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </Formik>
                    </ScrollView>
                </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </ImageBackground>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        //flex:1,
        height:'100%',
        backgroundColor:'#219281FF',
    },
    mainContainer: {
        //flex: 1,
        //flexDirection: 'column',
        width: '100%',
        //height: '100%',
        justifyContent: 'space-evenly',
        paddingBottom: '5%'
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        opacity: 0.95,

    },
    logo: {
        resizeMode: 'contain',
        width: '65%',
        height: '20%',
        position: "relative",
        left: "5%"
    },

    formContainer: {
        height: '95%',
        width: '90%',
        display: 'flex',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
        marginBottom: '10%',
        position: 'relative',
        top: '2.5%'

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
        bottom: '3%',
        marginTop: '35',
    },
    submitBtnContainer: {
        margin: '10%',
        width: 'auto',
    },
    //
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
        position: "relative",
        bottom: '5%'

    },
    buttonText: {
        fontFamily: 'sulphurPoint',
        color: '#93D3AE',
        fontSize: 18,
        marginRight: 15,
    },
    previewContainer: {
        marginTop: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    previewImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
        resizeMode: 'cover',
    },
    removeButton: {
        marginTop: 10,
    },
    warnLabel: {
        color: '#F96635',
        marginBottom: 10,
        marginTop: 2
    },
    imagePicker: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 15,
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
    },
    imagePlaceholder: {
        color: '#6b7280',
    },
    removeImageText: {
        color: '#F96635',
        textAlign: 'center',
    },
    deleteIconContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '5%'
    },
    radioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        marginBottom: '5%'
    },
    radioContainerSale: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginVertical: 10,
        marginBottom: '5%'
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#219281FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    selectedRadio: {
        backgroundColor: '#93D3AE',
    },
    radioLabel: {
        fontSize: 14,
        color: '#212121',
        fontFamily: 'sulphurPoint',
    },
    infoText: {
        fontSize: 14,
        color: '#F96635',
        fontFamily: 'sulphurPoint',
        textAlign: "right",
        marginBottom: '2%',
    },
    pickerStyle:  {
        fontFamily: 'sulphurPoint',
        fontSize: 14,
        color: '#219281FF',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginBottom: '5%'
    },
    header: {
        fontSize: 24,
        fontFamily: 'shrikhand',
        textAlign: 'center',
        color: '#219281FF',
    },
    avoidingView:{
        width: '100%',
    }


});

export default InsertProdScreen;