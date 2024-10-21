import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';

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

    const handleInputChange = (name: keyof ProductDetails, value: string) => {
        setProductDetails({
            ...productDetails,
            [name]: value,
        });
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
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Insert Product</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f4f6f9', // Light background for contrast
        flexGrow: 1,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 30,
        color: '#4DAE91', // Theme color
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        height: 55,
        borderColor: '#4DAE91', // Theme color for borders
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 15,
        borderRadius: 10,
        backgroundColor: '#fff',
        fontSize: 16,
        elevation: 2, // Adds shadow effect on Android
        shadowColor: '#000', // Shadow properties for iOS
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    button: {
        backgroundColor: '#4DAE91', // Theme color for button
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        elevation: 2, // Adds shadow effect on Android
        shadowColor: '#000', // Shadow properties for iOS
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
});

export default InsertProduct;
