import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Modal, TextInput } from 'react-native';

type Category = {
    id: string;
    name: string;
};

const ViewCategories = () => {
    const [categories, setCategories] = useState<Category[]>([
        { id: '1', name: 'Category 1' },
        { id: '2', name: 'Category 2' },
        { id: '3', name: 'Category 3' },
    ]);

    const [modalVisible, setModalVisible] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
    const [editedName, setEditedName] = useState('');

    const handleDelete = (categoryId: string) => {
        Alert.alert(
            'Delete',
            'Are you sure you want to delete this category?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    onPress: () => {
                        setCategories((prevCategories) =>
                            prevCategories.filter((category) => category.id !== categoryId)
                        );
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    const handleEdit = (category: Category) => {
        setCurrentCategory(category);
        setEditedName(category.name);
        setModalVisible(true);
    };

    const handleSaveEdit = () => {
        if (currentCategory) {
            setCategories((prevCategories) =>
                prevCategories.map((category) =>
                    category.id === currentCategory.id ? { ...category, name: editedName } : category
                )
            );
            setModalVisible(false);
        }
    };

    const renderCategory = ({ item }: { item: Category }) => (
        <View style={styles.categoryContainer}>
            <Text style={styles.categoryName}>{item.name}</Text>
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
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>View Categories</Text>
            <FlatList
                data={categories}
                renderItem={renderCategory}
                keyExtractor={(item) => item.id}
            />
            {currentCategory && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Edit Category</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Category Name"
                            value={editedName}
                            onChangeText={setEditedName}
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
    categoryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 2,
    },
    categoryName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4DAE91',
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    editButton: {
        backgroundColor: '#FFC107', // Bootstrap yellow
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
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

export default ViewCategories;
