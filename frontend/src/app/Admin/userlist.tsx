import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, ImageBackground, TextInput, Modal } from "react-native";
import axios from "axios";
import { Linking } from 'react-native';

// Define the User type
interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

const UsersList = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [editedFirstName, setEditedFirstName] = useState<string>('');
    const [editedLastName, setEditedLastName] = useState<string>('');
    const [editedEmail, setEditedEmail] = useState<string>('');

    // Fetch users from the backend
    useEffect(() => {
        axios
            .get("http://192.168.1.126:3000/users") // Replace with your own from local env
            .then((response) => {
                setUsers(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to fetch users");
                setLoading(false);
            });
    }, []);

    // Handle Delete user with confirmation
    const deleteUser = (userId: number) => {
        Alert.alert(
            "Delete User",
            "Are you sure you want to terminate this user's account?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => {
                        axios
                            .delete(`http://192.168.1.126:3000/users/${userId}`)
                            .then(() => {
                                setUsers(users.filter(user => user.id !== userId));
                                Alert.alert("Success", "User deleted successfully");
                            })
                            .catch((err) => {
                                Alert.alert("Error", "Failed to delete user");
                            });
                    }
                }
            ],
            { cancelable: false }
        );
    };

    // Open email client to contact user
    const contactUser = (email: string) => {
        Linking.openURL(`mailto:${email}`).catch(err => console.error("Failed to open email client", err));
    };

    // Function to email all users
    const emailAllUsers = () => {
        if (users.length === 0) {
            Alert.alert("No users", "There are no users to email.");
            return;
        }

        const emails = users.map(user => user.email).join(", ");
        Linking.openURL(`mailto:${emails}`).catch(err => console.error("Failed to open email client", err));
    };

    // Handle editing user details
    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setEditedFirstName(user.firstName);
        setEditedLastName(user.lastName);
        setEditedEmail(user.email);
        setIsEditing(true);
    };

    // Handle saving the edited user details
    const saveEditedUser = () => {
        if (!selectedUser) return;

        const updatedUser = {
            firstName: editedFirstName,
            lastName: editedLastName,
            email: editedEmail,
        };

        axios
            .put(`http://192.168.1.126:3000/users/${selectedUser.id}`, updatedUser) // Update user
            .then(() => {
                // Re-fetch the updated user list from the backend
                axios.get("http://192.168.1.126:3000/users") // Re-fetch users
                    .then((response) => {
                        setUsers(response.data); // Update users state with the new data
                        setIsEditing(false);
                        Alert.alert("Success", "User details updated");
                    })
                    .catch((err) => {
                        Alert.alert("Error", "Failed to fetch updated users");
                    });
            })
            .catch((err) => {
                Alert.alert("Error", "Failed to update user details");
            });
    };

    const renderItem = ({ item }: { item: User }) => (
        <View style={styles.userRow}>
            <Text style={styles.userId}>ID: {item.id}</Text>
            <Text style={styles.userName}>{item.firstName} {item.lastName}</Text>
            <Text style={styles.userEmail} onPress={() => contactUser(item.email)}>
                {item.email}
            </Text>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={() => deleteUser(item.id)}
                >
                    <Text style={styles.buttonText}>Terminate</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.contactButton]}
                    onPress={() => contactUser(item.email)}
                >
                    <Text style={styles.buttonText}>Contact</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.editButton]}
                    onPress={() => handleEditUser(item)}
                >
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }

    return (
        <ImageBackground source={require('assets/images/TMBackground.png')} style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.productTitle}>User List</Text>

                <TouchableOpacity
                    style={[styles.button, styles.contactButton, styles.emailAllButton]}
                    onPress={emailAllUsers}
                >
                    <Text style={styles.buttonText}>Email All Users</Text>
                </TouchableOpacity>

                <FlatList
                    data={users}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id != null ? item.id.toString() : Math.random().toString()} // Safe keyExtractor
                />
            </View>

            {/* Modal for Editing User */}
            <Modal
                visible={isEditing}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsEditing(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit User</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="First Name"
                            value={editedFirstName}
                            onChangeText={setEditedFirstName}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Last Name"
                            value={editedLastName}
                            onChangeText={setEditedLastName}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Email"
                            value={editedEmail}
                            onChangeText={setEditedEmail}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.button, styles.saveButton]}
                                onPress={saveEditedUser}
                            >
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => setIsEditing(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        opacity: 0.85,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    productTitle: {
        fontFamily: 'shrikhand',
        fontSize: 25,
        fontWeight: 'bold',
        color: '#219281FF',
        marginBottom: 20,
        textAlign: 'center',
    },
    userRow: {
        padding: 20,
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        marginBottom: 20,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        marginVertical: 10,
    },
    userId: {
        fontSize: 14,
        color: "#555",
        marginBottom: 5,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#333",
        marginBottom: 5,
    },
    userEmail: {
        fontFamily: 'shrikhand',
        fontSize: 16,
        fontWeight: 'bold',
        color: "#219281FF",
        marginBottom: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    deleteButton: {
        backgroundColor: '#ff4747', // Red for delete
    },
    contactButton: {
        backgroundColor: '#ffc107', // Bootstrap Yellow for contact
    },
    editButton: {
        backgroundColor: '#28a745', // Green for edit
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        textAlign: 'center',
        color: 'red',
        fontSize: 18,
        marginTop: 20,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    modalInput: {
        height: 40,
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    saveButton: {
        backgroundColor: '#28a745',
    },
    cancelButton: {
        backgroundColor: '#ff4747',
    },
    emailAllButton: {
        marginBottom: 20,
    },
});

export default UsersList;
