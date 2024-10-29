import React, { useState } from 'react';
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
    isOnSale: boolean;
    salePrice: string;
    discountPercent: string;
    mainImage: any;
    image2: any;
    image3: any;
};

const ViewProducts = () => {

    const [fontsLoaded] = useFonts({
        'montserrat': require('@assets/fonts/Montserrat-VariableFont_wght.ttf'),
        'montserrat_Italic': require('@assets/fonts/Montserrat-Italic-VariableFont_wght.ttf'),
        'sulphurPoint': require('@assets/fonts/SulphurPoint-Regular.ttf'),
        'sulphurPoint_Bold': require('@assets/fonts/SulphurPoint-Bold.ttf'),
        'sulphurPoint_Light': require('@assets/fonts/SulphurPoint-Light.ttf'),
        'shrikhand': require('@assets/fonts/Shrikhand-Regular.ttf'),
    });


    //TODO: display what is in the DB in Desc order of ID
    const [products, setProducts] = useState<Product[]>([
        {
            id: '1',
            SKU: 'mens_short_black',
            itemName: 'Ami De Coeur Short Black Unisex',
            description: 'Description of Product 1',
            category: 'Category 1',
            itemPrice: 'R10',
            mainImage: require('@assets/images/Ami De Coeur Short Black Unisex.jpeg'),
            isOnSale: false,
            salePrice: '',
            discountPercent: '',
            size: '',
            colour: '',
            sex: '',
            damage: '',
            material: '',

        },
        {
            id: '2',
            SKU: 'mens_shirt_white',
            itemName: 'Chomp Mongo Skate Tee',
            description: 'Description of Product 2',
            category: 'Category 2',
            itemPrice: 'R20',
            mainImage: require('@assets/images/Chomp Mongo Skate Tee.jpeg'),
            isOnSale: false,
            salePrice: '',
            discountPercent: '',
            size: '',
            colour: '',
            sex: '',
            damage: '',
            material: '',
        },
        {
            id: '3',
            SKU: 'mens_bomber_khaki',
            itemName: 'New Haven Twill Jacket',
            description: 'Description of Product 3',
            category: 'Category 3',
            itemPrice: 'R30',
            mainImage: require('@assets/images/New Haven Twill Jacket.jpeg'),
            isOnSale: false,
            salePrice: '',
            discountPercent: '',
            size: '',
            colour: '',
            sex: '',
            damage: '',
            material: '',
        },
    ]);

    const [modalVisible, setModalVisible] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
    const [editedProduct, setEditedProduct] = useState<Product>({
        id: '',
        SKU: '',
        itemName: '',
        description: '',
        category: '',
        itemPrice: '',
        image1: require('@assets/images/Ami De Coeur Short Black Unisex.jpeg'), // Default image
        isOnSale: false,
        salePrice: '',
        discountPercent: '',
        size: '',
        colour: '',
        sex: '',
        damage: '',
        material: '',
    });


    const handleEdit = (product: Product) => {
        setCurrentProduct(product);
        setEditedProduct({...product});
        setModalVisible(true);
    };

    //TODO: Get to delete from DB
    const handleDelete = (productId: string) => {
        Alert.alert(
            'Delete',
            'Are you sure you want to delete this product?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    onPress: () => {
                        setProducts((prevProducts) =>
                            prevProducts.filter((product) => product.id !== productId)
                        );
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    //TODO: get to save changes to DB
    const handleSaveEdit = () => {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id === editedProduct.id ? editedProduct : product
            )
        );
        setModalVisible(false);
    };

    const renderProduct = ({ item }: { item: Product }) => (
            <View style={styles.productContainer}>
                <Image source={item.mainImage} style={styles.productImage} />
                <View style={styles.productDetails}>
                    <Text style={styles.productTitle}>{item.itemName}</Text>
                    <Text>{item.SKU}</Text>
                    <Text>{item.description}</Text>
                    <Text>{item.category}</Text>
                    <Text>{item.itemPrice}</Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => handleEdit(item)}
                        >
                            <Text style={styles.buttonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDelete(item.id)}
                        >
                            <Text style={styles.buttonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
    );

    //TODO: find way to update DB
    const handleItemEdit = () => {
        console.log('We submitted');
        Alert.alert('Success', 'Your changes have been saved!');
        setModalVisible(false);
    }


    const [imageUris, setImageUris] = useState({
        mainImage: '',
        image2: '',
        image3: '',
    });

    const handleImagePick = async (imageType: string, setFieldValue: Function) => {
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();

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



    return (
        <ImageBackground
            source = {require('@assets/images/TMBackground.png')}
            resizeMode="stretch"
            style = {styles.image}>
            <View style={styles.container}>
            <Text style={styles.header}>Manage Products</Text>
            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id}
            />

            {currentProduct && (

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >

                    <ScrollView>

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
                                salePrice: '',
                                discountPercent: '',
                                mainImage: '',
                                image2: '',
                                image3: '',
                            }}
                            onSubmit={handleItemEdit}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
                                    <View style={styles.modalView}>
                                        <View style = { styles.headerContainer}>
                                            <Text style={styles.modalTitle}>Edit Product</Text>
                                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                                <View style = {styles.closeModal}>
                                                    <Icon name = 'close' size = {30} color = {'#212121'}></Icon>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                <Text style = {styles.label}> Item Name: </Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Title"
                                    value={editedProduct.itemName}
                                    onChangeText={(text) => setEditedProduct({ ...editedProduct, itemName: text })}
                                />

                                <Text style = {styles.label}> Item Price: </Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Price"
                                    value={editedProduct.itemPrice}
                                    onChangeText={(text) => setEditedProduct({ ...editedProduct, itemPrice: number })}
                                />

                                <Text style = {styles.label}> Description: </Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Description"
                                    value={editedProduct.description}
                                    onChangeText={(text) =>
                                        setEditedProduct({ ...editedProduct, description: text })
                                }
                                />
                                <Text style={styles.label}>Category: </Text>
                                <Picker
                                    selectedValue={editedProduct.category}
                                    style={styles.pickerStyle}
                                    onValueChange={(itemValue) => setEditedProduct('category', itemValue)}
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
                                    value={editedProduct.size}
                                    onChangeText={(text) => setEditedProduct({ ...editedProduct, size: text })}
                                />

                                <Text style={styles.label}>Colour: </Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter item colour"
                                    value={editedProduct.colour}
                                    onChangeText={(text) => setEditedProduct({ ...editedProduct, colour: text })}
                                />

                                <Text style={styles.label}>Sex*: </Text>
                                <View style={styles.radioContainer}>
                                    <TouchableOpacity
                                        style={styles.radioButton}
                                        onPress={() => setEditedProduct({ ...editedProduct, sex: 'male' })}
                                    >
                                        <View style={[styles.radioCircle, editedProduct.sex === 'male' && styles.selectedRadio]} />
                                        <Text style={styles.radioLabel}>Male</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.radioButton}
                                        onPress={() => setEditedProduct({ ...editedProduct, sex: 'female' })}
                                    >
                                        <View style={[styles.radioCircle, editedProduct.sex === 'female' && styles.selectedRadio]} />
                                        <Text style={styles.radioLabel}>Female</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.radioButton}
                                        onPress={() => setEditedProduct({ ...editedProduct, sex: 'unisex' })}
                                    >
                                        <View style={[styles.radioCircle, editedProduct.sex === 'unisex' && styles.selectedRadio]} />
                                        <Text style={styles.radioLabel}>Unisex</Text>
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.label}> Damage*: </Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter damage (if any)"
                                    value={editedProduct.damage}
                                    onChangeText={(text) => setEditedProduct({ ...editedProduct, damage: text })}
                                />

                                <Text style={styles.label}> Material*: </Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter item material"
                                    value={editedProduct.material}
                                    onChangeText={(text) => setEditedProduct({ ...editedProduct, material: text })}
                                />

                                <Text style={styles.label}>Is On Sale?</Text>
                                <View style={styles.radioContainerSale}>
                                    <TouchableOpacity
                                        style={styles.radioButton}
                                        onPress={() => setEditedProduct({ ...editedProduct, isOnSale: true, itemPrice: '' })}
                                    >
                                        <View style={[styles.radioCircle, editedProduct.isOnSale && styles.selectedRadio]} />
                                        <Text style={styles.radioLabel}>Yes</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.radioButton}
                                        onPress={() => setEditedProduct({ ...editedProduct, isOnSale: false })}
                                    >
                                        <View style={[styles.radioCircle, !editedProduct.isOnSale && styles.selectedRadio]} />
                                        <Text style={styles.radioLabel}>No</Text>
                                    </TouchableOpacity>
                                </View>

                                {editedProduct.isOnSale && (
                                    <>
                                        <Text style={styles.label}>Sale Price: </Text>
                                        <TextInput
                                            style={styles.input}
                                            value={editedProduct.salePrice}
                                            onChangeText={(text) => setEditedProduct({ ...editedProduct, salePrice: text })}
                                            placeholder="Enter the sale price of the item"
                                            keyboardType="numeric"
                                        />
                                        <Text style={styles.label}>Discount Percent (%): </Text>
                                        <TextInput
                                            style={styles.input}
                                            value={editedProduct.discountPercent}
                                            onChangeText={(text) => setEditedProduct({ ...editedProduct, discountPercent: text })}
                                            placeholder="Enter the percentage of the item discount (e.g. 10%, 20% )"
                                            keyboardType="numeric"
                                        />
                                    </>
                                )}

                                <Text style={styles.label}>Main Image*:</Text>
                                <TouchableOpacity
                                    onPress={() => handleImagePick('mainImage', setEditedProduct)}
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
                                    onPress={() => handleImagePick('image2', setEditedProduct)}
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
                                    onPress={() => handleImagePick('image3', setEditedProduct)}
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
                    </ScrollView>
                </Modal>
            )}
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        width: '100%'
        //backgroundColor: '#f5f5f5',
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

});

export default ViewProducts;
