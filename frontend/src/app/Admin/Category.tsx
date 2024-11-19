import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const InsertCategories = () => {
    const [categoryName, setCategoryName] = useState('');

    const handleInsert = () => {
        if (categoryName.trim() === '') {
            Alert.alert('Validation Error', 'Please enter a category name.');
            return;
        }

        Alert.alert('Success', `Category "${categoryName}" added successfully!`);
        setCategoryName(''); // Clear the input after submission
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Insert New Category</Text>
            <TextInput
                style={styles.input}
                placeholder="Category Name"
                value={categoryName}
                onChangeText={setCategoryName}
            />
            <TouchableOpacity style={styles.button} onPress={handleInsert}>
                <Text style={styles.buttonText}>Insert Category</Text>
            </TouchableOpacity>
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
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#FFC107', // Bootstrap yellow
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default InsertCategories;
