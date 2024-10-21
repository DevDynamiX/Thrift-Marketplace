import React, { useState } from 'react';
import {
    View,
    ImageBackground,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    Image,
    Text,
    Button,
    TextInput,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Formik } from 'formik';
import * as ImagePicker from 'expo-image-picker'; import * as Yup from 'yup';
import {useFonts} from "expo-font";
import Icon from 'react-native-vector-icons/Ionicons';


const CartScreen = () =>{

    const [fontsLoaded] = useFonts({
        'montserrat': require('@assets/fonts/Montserrat-VariableFont_wght.ttf'),
        'montserrat_Italic': require('@assets/fonts/Montserrat-Italic-VariableFont_wght.ttf'),
        'sulphurPoint': require('@assets/fonts/SulphurPoint-Regular.ttf'),
        'sulphurPoint_Bold': require('@assets/fonts/SulphurPoint-Bold.ttf'),
        'sulphurPoint_Light': require('@assets/fonts/SulphurPoint-Light.ttf'),
        'shrikhand': require('@assets/fonts/Shrikhand-Regular.ttf'),
    });

    const [imageUris, setImageUris] = useState({
        mainImage: '',
        image2: '',
        image3: '',
    });

    const handleImagePick = async (imageType: string, setFieldValue: Function) => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert('Permission to access the gallery is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
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
            console.log("Image selection canceled or no image found");
        }
    };

    const removeImage = (imageType:  string) => {
        setImageUris( prevState => ({
            ...prevState,
            [imageType]: null,
        }));
    }

    return (
        <SafeAreaView style = {styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="black" />
            <ImageBackground
                source = {require('@assets/images/TMBackground.png')}
                resizeMode="stretch"
                style = {styles.image}>
                <View style = { styles.mainContainer }>
                    <Image source = {require('@assets/images/TMPageLogo.png')} style={styles.logo}/>
                    <ScrollView style = {styles.Formik} >
                        {/*form to handle inventory uploads*/}
                        <Formik
                            initialValues={{
                                SKU: '',
                                name: '',
                                price: '',
                                description: '',
                                category: '',
                                size: '',
                                colour: '',
                                sex: '',
                                damage: '',
                                material: '',
                                onSale: '',
                                discountPrice: '',
                                discountPercent: '',
                                mainImageUrl: '',
                                image2Url: '',
                                image3Url: '',
                            }}
                            onSubmit={values => {
                                console.log('Form Data Submitted:', values);
                            }}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
                                <View style={styles.formContainer}>
                                    <Text style = { styles.formHeader }> Add Item to Inventory: </Text>
                                    <Text style={styles.label}> SKU:</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange('SKU')}
                                        onBlur={handleBlur('SKU')}
                                        value={values.SKU}
                                        placeholder="Enter SKU"
                                    />


                                    <Text style={styles.label}>Item Name: </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange('name')}
                                        onBlur={handleBlur('name')}
                                        value={values.name}
                                        placeholder="Enter item name"
                                    />

                                    <Text style={styles.label}>Item Price: </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange('price')}
                                        onBlur={handleBlur('price')}
                                        value={values.price}
                                        placeholder="Enter price"
                                        keyboardType="numeric"
                                    />

                                    <Text style={styles.label}>Description: </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange('description')}
                                        onBlur={handleBlur('description')}
                                        value={values.description}
                                        placeholder="Enter item description"
                                    />

                                    <Text style={styles.label}>Category: </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange('category')}
                                        onBlur={handleBlur('category')}
                                        value={values.category}
                                        placeholder="Enter item category (e.g. T-shirt, dress, etc)"
                                    />

                                    <Text style={styles.label}> Size: </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange('size')}
                                        onBlur={handleBlur('size')}
                                        value={values.size}
                                        placeholder="Enter item size (e.g. S, M, L OR 6, 12, 16)"
                                    />

                                    <Text style={styles.label}>Colour: </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange('colour')}
                                        onBlur={handleBlur('colour')}
                                        value={values.colour}
                                        placeholder="Enter item colour"
                                    />

                                    <Text style={styles.label}>Sex: </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange('sex')}
                                        onBlur={handleBlur('sex')}
                                        value={values.sex}
                                        placeholder="Enter item sex"
                                    />

                                    <Text style={styles.label}> Damage: </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange('damage')}
                                        onBlur={handleBlur('damage')}
                                        value={values.damage}
                                        placeholder="Enter item damage"
                                    />

                                    <Text style={styles.label}>Material: </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange('material')}
                                        onBlur={handleBlur('material')}
                                        value={values.material}
                                        placeholder="Enter item material"
                                    />

                                    <Text style={styles.label}>Is On Sale?</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange('onSale')}
                                        onBlur={handleBlur('onSale')}
                                        value={values.onSale}
                                        placeholder="Select 'yes' if item is on sale"
                                    />

                                    <Text style={styles.label}>Sale Price: </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange('discountPrice')}
                                        onBlur={handleBlur('discountPrice')}
                                        value={values.discountPrice}
                                        placeholder="Enter the sale price of the item"
                                    />

                                    <Text style={styles.label}>Discount Percent (%): </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange('discountPercent')}
                                        onBlur={handleBlur('discountPercent')}
                                        value={values.discountPercent}
                                        placeholder="Enter the percentage of the item discount (e.g. 10%, 20% )"
                                    />

                                    <Text style={styles.label}>Main Image:</Text>
                                    <Button
                                        color='#93D3AE'
                                        title="Select Image"
                                        onPress={() => handleImagePick('mainImageUrl', setFieldValue)}
                                    />

                                    {imageUris.mainImage ? (
                                        <View style={styles.previewContainer}>
                                            <Image source={{ uri: imageUris.mainImage }} style={styles.previewImage} />
                                            <TouchableOpacity style={styles.removeButton} onPress={() => removeImage('mainImage')}>
                                                <Button title="Remove Image" onPress={() => removeImage('mainImage')} />
                                            </TouchableOpacity>
                                        </View>
                                    ):(
                                        <Text style = {styles.warnLabel}>No Image Selected</Text>
                                    )}

                                    <Text style={styles.label}>Image 2:</Text>
                                    <Button
                                        color='#93D3AE'
                                        title="Select Image"
                                        onPress={() => handleImagePick('image2Url', setFieldValue)}
                                    />

                                    {imageUris.image2 ? (
                                        <View style={styles.previewContainer}>
                                            <Image source={{ uri: imageUris.image2 }} style={styles.previewImage} />
                                            <TouchableOpacity style={styles.removeButton} onPress={() => removeImage('image2')}>
                                                <Button title="Remove Image" onPress={() => removeImage('image2')} />
                                            </TouchableOpacity>
                                        </View>
                                    ):(
                                        <Text style = {styles.warnLabel}>No Image Selected</Text>
                                    )}

                                    <Text style={styles.label}>Image 3:</Text>
                                    <Button
                                        color='#93D3AE'
                                        title="Select Image"
                                        onPress={() => handleImagePick('image3Url', setFieldValue)}
                                    />

                                    {imageUris.image3 ? (
                                        <View style={styles.previewContainer}>
                                            <Image source={{ uri: imageUris.image3 }} style={styles.previewImage} />
                                            <TouchableOpacity style={styles.removeButton} onPress={() => removeImage('image3')}>
                                                <Button title="Remove Image" onPress={() => removeImage('image3')} />
                                            </TouchableOpacity>
                                        </View>
                                    ):(
                                        <Text style = {styles.warnLabel}>No Image Selected</Text>
                                    )}

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
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        height:'100%',
        backgroundColor:'#219281FF',
    },
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        justifyContent: 'space-evenly',
        paddingBottom: '5%'
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    logo: {
        resizeMode: 'contain',
        width: '65%',
        height: '20%',
        position: "relative",
        top: '3%',
        left: "5%"
    },
    text: {
        color: 'black',
        fontSize: 42,
        lineHeight: 40,
        fontWeight: 'bold',
        backgroundColor: 'white',
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
        height: '100%'
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
        color: '#FF0000',
        marginBottom: 10,
        marginTop: 2
    }






});

export default CartScreen;