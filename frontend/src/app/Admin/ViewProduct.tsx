import React, { useState } from 'react';
import { View, Text, FlatList, Image, Button, StyleSheet, TextInput, Modal, Alert, TouchableOpacity } from 'react-native';
import {useFonts} from "expo-font";


// Define the Product type
type Product = {
    id: string;
    title: string;
    description: string;
    category: string;
    brand: string;
    price: string;
    image1: any;
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

    const [products, setProducts] = useState<Product[]>([
        {
            id: '1',
            title: 'Ami De Coeur Short Black Unisex',
            description: 'Description of Product 1',
            category: 'Category 1',
            brand: 'Brand 1',
            price: 'R10',
            image1: require('@assets/images/Ami De Coeur Short Black Unisex.jpeg'), // Using require() for images
        },
        {
            id: '2',
            title: 'Chomp Mongo Skate Tee',
            description: 'Description of Product 2',
            category: 'Category 2',
            brand: 'Brand 2',
            price: 'R20',
            image1: require('@assets/images/Chomp Mongo Skate Tee.jpeg'), // Using require() for images
        },
        {
            id: '3',
            title: 'New Haven Twill Jacket',
            description: 'Description of Product 3',
            category: 'Category 3',
            brand: 'Brand 3',
            price: 'R30',
            image1: require('@assets/images/New Haven Twill Jacket.jpeg'), // Using require() for images
        },
    ]);

    const [modalVisible, setModalVisible] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
    const [editedProduct, setEditedProduct] = useState<Product>({
        id: '',
        title: '',
        description: '',
        category: '',
        brand: '',
        price: '',
        image1: require('@assets/images/Ami De Coeur Short Black Unisex.jpeg'), // Default image
    });

    const handleEdit = (product: Product) => {
        setCurrentProduct(product);
        setEditedProduct(product);
        setModalVisible(true);
    };

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
            <Image source={item.image1} style={styles.productImage} />
            <View style={styles.productDetails}>
                <Text style={styles.productTitle}>{item.title}</Text>
                <Text>{item.description}</Text>
                <Text>{item.category}</Text>
                <Text>{item.brand}</Text>
                <Text>{item.price}</Text>

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

    return (
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
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Edit Product</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Title"
                            value={editedProduct.title}
                            onChangeText={(text) => setEditedProduct({ ...editedProduct, title: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Description"
                            value={editedProduct.description}
                            onChangeText={(text) =>
                                setEditedProduct({ ...editedProduct, description: text })
                            }
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Category"
                            value={editedProduct.category}
                            onChangeText={(text) => setEditedProduct({ ...editedProduct, category: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Brand"
                            value={editedProduct.brand}
                            onChangeText={(text) => setEditedProduct({ ...editedProduct, brand: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Price"
                            value={editedProduct.price}
                            onChangeText={(text) => setEditedProduct({ ...editedProduct, price: text })}
                        />
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 20,
        color: '#4DAE91',
        fontWeight: 'bold',
    },
    productContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 2,
        borderColor: '#4DAE91',
        borderWidth: 1,
    },
    productImage: {
        width: 60,
        height: 60,
        marginRight: 15,
    },
    productDetails: {
        flex: 1,
    },
    productTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4DAE91',
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    editButton: {
        backgroundColor: '#FFC107', // Bootstrap yellow
        padding: 10,
        marginRight: 10,
        borderRadius: 5,
    },
    deleteButton: {
        backgroundColor: '#FF5252', // Red for delete
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    modalView: {
        flex: 1,
        backgroundColor: '#fff',
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
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#4DAE91',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    saveButton: {
        backgroundColor: '#4DAE91',
        padding: 10,
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: '#FF5252',
        padding: 10,
        borderRadius: 5,
    },
});

export default ViewProducts;
