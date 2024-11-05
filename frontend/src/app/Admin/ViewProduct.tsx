import React, {useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    Button,
    StyleSheet,
    TextInput,
    Modal,
    Alert,
    TouchableOpacity,
    ImageBackground,
    ScrollView
} from 'react-native';
import {useFonts} from "expo-font";
import {Picker} from "@react-native-picker/picker";
import { Formik } from 'formik';
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";



// Define the Product type
type Product = {
    id: string;
    SKU: string,
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
    image2?: string;
    image3?: string;
};


const ViewProducts = () => {

    const [inventoryItems, setInventoryItems ] = useState<Product[]>([]);
    //const [isLoading, setIsLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    const [selectedItem, setSelectedItem] = useState(null);

    const [fontsLoaded] = useFonts({
        'montserrat': require('@assets/fonts/Montserrat-VariableFont_wght.ttf'),
        'montserrat_Italic': require('@assets/fonts/Montserrat-Italic-VariableFont_wght.ttf'),
        'sulphurPoint': require('@assets/fonts/SulphurPoint-Regular.ttf'),
        'sulphurPoint_Bold': require('@assets/fonts/SulphurPoint-Bold.ttf'),
        'sulphurPoint_Light': require('@assets/fonts/SulphurPoint-Light.ttf'),
        'shrikhand': require('@assets/fonts/Shrikhand-Regular.ttf'),
    });

    const [imageUris, setImageUris] = useState({
        mainImage: null,
        image2: null,
        image3: null,
    });

    const fetchInventoryData = async () => {
        try {
            const response = await fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/inventory`);
            if (!response.ok) {
                throw new Error('Failed to fetch inventory data');
            }
            const data = await response.json();
            setInventoryItems(data);
        } catch (error) {
            console.error('Error fetching inventory data: ', error);
        }
    };

// useEffect to fetch data on mount
    useEffect(() => {
        fetchInventoryData();
    }, []);

    useEffect(() => {
        if (selectedItem) {
            setImageUris({
                mainImage: selectedItem.mainImage,
                image2: selectedItem.image2,
                image3: selectedItem.image3,
            });
        }
    }, [selectedItem]);

    //TODO: handle update
    const handleUpdatedItem = async (values) => {
        try {
            console.log('Values being sent: ', values);

            let adjustedSalePrice =  values.salePrice;

            if (values.onSale){
                if (!adjustedSalePrice) {
                    alert('A sale price is required if an item is on sale.');
                    return;
                }}

            const formData = new FormData();

            // Append basic fields
            formData.append('SKU', values.SKU);
            formData.append('itemName', values.itemName);
            formData.append('itemPrice', values.salePrice ? values.salePrice : values.itemPrice);
            formData.append('description', values.description);
            formData.append('category', values.category);
            formData.append('size', values.size);
            formData.append('colour', values.colour);
            formData.append('sex', values.sex);
            formData.append('damage', values.damage);
            formData.append('material', values.material);
            formData.append('onSale', values.onSale);
            formData.append('salePrice', values.onSale ? adjustedSalePrice : null);
            formData.append('discountPercent', values.onSale ? values.discountPercent : null);

            // Append images if they exist


            console.log("Form data:", formData);

            const response = await fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/inventory/${values.SKU}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

                const responseBody =  await response.text();
                console.log('Response Status: ', response.status);
                console.log('Response Body: ', responseBody);

            if (!response.ok) {
                throw new Error('Failed to Update Item!');
            }

            const updatedItem = JSON.parse(responseBody);
            if(updatedItem){
                Alert.alert("Success",
                    `Successfully Updated Item!`,
                    [{
                        text: 'OK', onPress: () => {
                            fetchInventoryData();
                            closeModal()
                        }}]
            );
                console.log('Item successfully updated: ', updatedItem);
            }
        }
        catch (error) {
            Alert.alert('Error', 'Could not update item!');
            console.error('Error updating item: ',error);
        }
    }

    const handleItemDelete = async (id) => {
        try {
            const response = await fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/inventory/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if(!response.ok) {
                throw new Error('Failed to remove item!');
            }

            fetchInventoryData();

            Alert.alert('Success', 'Item Successfully removed from inventory!');
        }catch (error){
            Alert.alert('Error', 'Could not remove item!');
            console.error('Error deleting item:', error)
        }

    }


    const openEditModal = (item:Product) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const closeModal = () => {
        setSelectedItem(null);
        setModalVisible(false);
    };

    const warnUser = (id) => {
        Alert.alert(
            'DELETE',
            'Are you sure you want to delete this item?',
            [
                {
                    text: 'NO',
                    onPress: () => console.log('Delete cancelled'),
                    style: 'cancel',

                },
                {
                    text: 'YES',
                    onPress: () => handleItemDelete(id)
                }
            ]
        )
    }

    const renderProduct = ({ item }: { item: Product }) => (
            <View style={styles.productContainer}>
                {item.onSale && <OnSaleBanner/>}
                <Image source={{ uri: item.mainImage }} style={styles.productImage} />
                <View style={styles.productDetails}>
                    <Text style={styles.productTitle}>{item.itemName}</Text>
                    <Text>{item.SKU}</Text>
                    <Text>{item.description}</Text>
                    <Text>{item.category}</Text>
                    <Text>{item.onSale ? item.salePrice : item.itemPrice} </Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => openEditModal(item)}
                        >
                            <Text style={styles.buttonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => warnUser(item.id)}
                        >
                            <Text style={styles.buttonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
    );


    const handleImagePick = async (field, setFieldValue) => {
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

        if (!result.canceled) {
            if (result.assets && result.assets.length > 0) {
                setFieldValue(field, result.assets[0].uri);}
            } else {
            Alert.alert('Warning', 'Image selection canceled or no image found.');
            console.log("Image selection canceled or no image found.");
        }

    };

    const removeImage = (field, setFieldValue) => {
        setFieldValue(field, '');
    };

    const OnSaleBanner = () => (
        <View style = { styles.bannerContainer }>
            <Text style = {styles.bannerText}> On Sale </Text>
        </View>
    );

    return (
        <ImageBackground
            source = {require('@assets/images/TMBackground.png')}
            resizeMode="stretch"
            style = {styles.image}>
            <View style={styles.container}>
            <Text style={styles.header}>Manage Products</Text>
                <FlatList
                    data={inventoryItems}
                    renderItem={renderProduct}
                    keyExtractor={(item) => item.id}
                />

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={closeModal}
                    >

                        <ScrollView style={styles.modalContainer}>
                            {selectedItem && (
                                <Formik
                                    initialValues={selectedItem}
                                    onSubmit={handleUpdatedItem}
                                >
                                    {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
                                            <View style={styles.modalView}>
                                                <View style = { styles.headerContainer}>
                                                    <Text style={styles.modalTitle}>Edit Product</Text>
                                                    <TouchableOpacity onPress={() => closeModal()}>
                                                        <View style = {styles.closeModal}>
                                                            <Icon name = 'close' size = {30} color = {'#212121'}></Icon>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>


                                                 <Text style = {styles.label}> Item Name: </Text>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Title"
                                                    value={values.itemName}
                                                    onChangeText={handleChange('itemName')}
                                                />

                                                <Text style = {styles.label}> Item Price: </Text>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Price"
                                                    value={values.itemPrice}
                                                    keyboardType="numeric"
                                                    onChangeText={handleChange('itemPrice')}
                                                />

                                                <Text style = {styles.label}> Description: </Text>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Description"
                                                    value={values.description}
                                                    onChangeText={handleChange('description')}
                                                />
                                                <Text style={styles.label}>Category: </Text>
                                                <Picker
                                                    selectedValue={values.category}
                                                    style={styles.pickerStyle}
                                                    onValueChange={handleChange('category')}
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

                                                <Text style={styles.label}> Size: </Text>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Enter item size (e.g. S, M, L OR 6, 12, 16)"
                                                    value={values.size}
                                                    onChangeText={handleChange('size')}
                                                />

                                                <Text style={styles.label}>Colour: </Text>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Enter item colour"
                                                    value={values.colour}
                                                    onChangeText={handleChange('colour')}
                                                />

                                                <Text style={styles.label}>Sex:</Text>
                                                <View style={styles.radioContainer}>
                                                    {['male', 'female', 'unisex'].map((sex) => (
                                                        <TouchableOpacity
                                                            key={sex}
                                                            style={styles.radioButton}
                                                            onPress={() => setFieldValue('sex', sex)}
                                                        >
                                                            <View style={[styles.radioCircle, values.sex === sex && styles.selectedRadio]} />
                                                            <Text style={styles.radioLabel}>{sex.charAt(0).toUpperCase() + sex.slice(1)}</Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>

                                                <Text style={styles.label}> Damage*: </Text>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Enter damage (if any)"
                                                    value={values.damage}
                                                    onChangeText={handleChange('damage')}
                                                />

                                                <Text style={styles.label}> Material*: </Text>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Enter item material"
                                                    value={values.material}
                                                    onChangeText={handleChange('material')}
                                                />

                                                <Text style={styles.label}>Is On Sale?</Text>
                                                <View style={styles.radioContainerSale}>
                                                    <TouchableOpacity
                                                        style={styles.radioButton}
                                                        onPress={() => setFieldValue('onSale', true)}
                                                    >
                                                        <View style={[styles.radioCircle, handleChange.onSale && styles.selectedRadio]} />
                                                        <Text style={styles.radioLabel}>Yes</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={styles.radioButton}
                                                        onPress={() => setFieldValue('onSale', false)}
                                                    >
                                                        <View style={[styles.radioCircle, !values.onSale && styles.selectedRadio]} />
                                                        <Text style={styles.radioLabel}>No</Text>
                                                    </TouchableOpacity>
                                                </View>

                                                {values.onSale && (
                                                    <>
                                                        <Text style={styles.label}>Sale Price: </Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            value={values.salePrice}
                                                            onChangeText={handleChange('salePrice')}
                                                            placeholder="Enter the sale price of the item"
                                                            keyboardType="numeric"
                                                        />
                                                        <Text style={styles.label}>Discount Percent (%): </Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            value={values.discountPercent}
                                                            onChangeText = {text => setFieldValue('discountPercent', parseFloat(text) || 0)}
                                                            placeholder="Enter the percentage of the item discount (e.g. 10%, 20% )"
                                                            keyboardType="numeric"
                                                        />
                                                    </>
                                                )}

                                                <Text style={styles.label}>Main Image*:</Text>
                                                <TouchableOpacity
                                                    onPress={() => handleImagePick('mainImage', setFieldValue)}
                                                    style={styles.imagePicker}
                                                >
                                                    {values.mainImage ? (
                                                        <Image source={{ uri: values.mainImage }} style={styles.imagePreview} />
                                                    ) : (
                                                        <Text style = {styles.warnLabel}>No Image Selected</Text>
                                                    )}
                                                </TouchableOpacity>
                                                {values.mainImage ? (
                                                    <TouchableOpacity onPress={() => removeImage('mainImage', setFieldValue)}>
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
                                                    {values.image2 ? (
                                                        <Image source={{ uri: values.image2 }} style={styles.imagePreview} />
                                                    ) : (
                                                        <Text style = {styles.warnLabel}>No Image Selected</Text>
                                                    )}
                                                </TouchableOpacity>
                                                {values.image2 ? (
                                                    <TouchableOpacity onPress={() => removeImage('image2', setFieldValue)}>
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
                                                    {values.image3 ? (
                                                        <Image source={{ uri: values.image3 }} style={styles.imagePreview} />
                                                    ) : (
                                                        <Text style = {styles.warnLabel}>No Image Selected</Text>
                                                    )}
                                                </TouchableOpacity>
                                                {values.image3 ? (
                                                    <TouchableOpacity onPress={() => removeImage('image3', setFieldValue)}>
                                                        <View style = {styles.deleteIconContainer}>
                                                            <Icon name = 'trash-outline' size={15} color="#F96635" />
                                                            <Text style={styles.removeImageText}>Remove Image</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                ) : null}


                                                <View style={styles.modalButtonContainer}>
                                                    <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                                                        <Text style={styles.buttonText}>Save</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={styles.cancelButton}
                                                        onPress={() => setModalVisible(false)}
                                                    >
                                                        <Text style={styles.buttonText}>Cancel</Text>
                                                    </TouchableOpacity>
                                                </View>
                                    </View>)}
                                </Formik>
                            )}
                        </ScrollView>
                    </Modal>
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
        fontSize: 24,
        fontFamily: 'shrikhand',
        textAlign: 'center',
        marginBottom: 20,
        color: '#219281FF',
        fontWeight: 'bold',
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    productContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 2,

    },
    productImage: {
        width: '30%',
        height: 'auto',
        marginRight: 15,
        borderColor: '#2121',
        borderWidth: 1,
        borderRadius: 8,
    },
    productDetails: {
        flex: 1,
    },
    productTitle: {
        fontFamily: 'shrikhand',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#219281FF',
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    editButton: {
        backgroundColor: '#F9A822',
        padding: 10,
        marginRight: 10,
        borderRadius: 5,
    },
    deleteButton: {
        backgroundColor: '#F96635',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontFamily: 'sulphurPoint',
        fontWeight: 'bold',
    },
    modalView: {
        flex: 1,
        backgroundColor: 'rgb(255, 255, 255)',
        marginTop: 100,
        marginHorizontal: 20,
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
    },
    modalTitle: {
        fontFamily: 'shrikhand',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#4DAE91',
    },
    input: {
        fontFamily: 'sulphurPoint',
        borderWidth: 1,
        borderColor: '#cacaca',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        color: '#219281FF'
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop:10,
    },
    saveButton: {
        fontFamily: 'sulphurPoint',
        backgroundColor: '#219281FF',
        padding: 10,
        marginRight: 15,
        borderRadius: 5,
        position: 'relative',
    },
    cancelButton: {
        fontFamily: 'sulphurPoint',
        backgroundColor: '#F96635',
        padding: 10,
        borderRadius: 5,
    },
    radioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
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
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#212121',
        fontFamily: 'sulphurPoint',
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
    closeModal: {
        backgroundColor: 'rgba(250,102,53,0.75)',
        width: 30,
        height: 30,
        borderRadius: 100,
        justifyContent: 'center',
        position: 'relative',
        left: '100%',
        bottom: '210%'
    },
    bannerContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#FF0000',
        padding: 5,
        borderRadius: 5,
        zIndex: 1,
    },
    bannerText: {
        color: '#FFFFFF', // Text color
        fontWeight: 'bold',
    },

});

export default ViewProducts;
