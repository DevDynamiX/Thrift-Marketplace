import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface ProductDetails {
    productTitle: string;
    description: string;
    productKeywords: string;
    productCategory: string;
    productBrand: string;
    productPrice: string;
}

const InsertProduct = () => {
    const [productDetails, setProductDetails] = useState<ProductDetails>({
        productTitle: '',
        description: '',
        productKeywords: '',
        productCategory: '',
        productBrand: '',
        productPrice: '',
    });

    const [images, setImages] = useState<(string | null)[]>([null, null, null]); // Array for 3 images

    const handleInputChange = (name: keyof ProductDetails, value: string) => {
        setProductDetails({
            ...productDetails,
            [name]: value,
        });
    };

    // Image picker handler for individual image slots
    const pickImage = async (index: number) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            // Update the specific image slot
            const newImages = [...images];
            newImages[index] = result.assets[0].uri;
            setImages(newImages);
        }
    };

    const handleSubmit = () => {
        const {
            productTitle,
            description,
            productKeywords,
            productCategory,
            productBrand,
            productPrice,
        } = productDetails;

        // Check for empty fields
        if (
            !productTitle ||
            !description ||
            !productKeywords ||
            !productCategory ||
            !productBrand ||
            !productPrice
        ) {
            Alert.alert('Please fill all fields');
            return;
        }

        // Check if all 3 images are selected
        if (images.some((image) => !image)) {
            Alert.alert('Please select 3 images');
            return;
        }

        // Placeholder for actual submission logic
        Alert.alert('Product inserted successfully');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Insert Product</Text>
            <View style={styles.inputContainer}>
                {Object.keys(productDetails).map((key) => (
                    <TextInput
                        key={key}
                        placeholder={key.replace(/([A-Z])/g, ' $1').trim()} // Format key for placeholder
                        placeholderTextColor="#a0a0a0"
                        style={styles.input}
                        value={productDetails[key as keyof ProductDetails]}
                        onChangeText={(text) => handleInputChange(key as keyof ProductDetails, text)}
                        keyboardType={key === 'productPrice' ? 'numeric' : 'default'} // Numeric keyboard for price
                    />
                ))}
            </View>

            {/* Image Upload Section */}
            <View style={styles.imageButtonsContainer}>
                {[0, 1, 2].map((index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.imageButton}
                        onPress={() => pickImage(index)}
                    >
                        <Text style={styles.buttonText}>Image {index + 1}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Display selected images or "No image selected" */}
            <View style={styles.imagePreviewContainer}>
                {images.map((image, index) => (
                    <View key={index} style={styles.imageWrapper}>
                        {image ? (
                            <Image source={{ uri: image }} style={styles.imagePreview} />
                        ) : (
                            <Text style={styles.noImageText}>No image selected</Text>
                        )}
                    </View>
                ))}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Insert Product</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f4f6f9',
        flexGrow: 1,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 30,
        color: '#4DAE91',
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        height: 55,
        borderColor: '#4DAE91',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 15,
        borderRadius: 10,
        backgroundColor: '#fff',
        fontSize: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    button: {
        backgroundColor: '#4DAE91',
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    imageButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    imageButton: {
        backgroundColor: '#FFC107',
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 12,
        alignItems: 'center',
    },
    imagePreviewContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    imageWrapper: {
        flex: 1,
        alignItems: 'center',
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 10,
        borderColor: '#4DAE91',
        borderWidth: 2,
    },
    noImageText: {
        color: '#a0a0a0',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default InsertProduct;
