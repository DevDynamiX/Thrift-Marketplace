import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, ImageBackground } from "react-native";
import axios from "axios";
import { Linking } from 'react-native';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch users from the backend
    useEffect(() => {
        axios
            .get("http://192.168.1.116:3000/users") // from local env and change homie
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
    const deleteUser = (userId) => {
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
                            .delete(`http://192.168.1.116:3000/users/${userId}`)
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
    const contactUser = (email) => {
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

    const renderItem = ({ item }) => (
        <View style={styles.userRow}>
            {/* Display userId */}
            <Text style={styles.userId}>ID: {item.id}</Text>

            <Text style={styles.userName}>{item.firstName} {item.lastName}</Text>
            <Text
                style={styles.userEmail}
                onPress={() => contactUser(item.email)}
            >
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
            </View>
        </View>
    );

    // Show loading or error state
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
                {/* Title Text */}
                <Text style={styles.productTitle}>User List</Text>

                {/* Button to email all users */}
                <TouchableOpacity
                    style={[styles.button, styles.contactButton, styles.emailAllButton]} // Apply new style here
                    onPress={emailAllUsers}
                >
                    <Text style={styles.buttonText}>Email All Users</Text>
                </TouchableOpacity>

                <FlatList
                    data={users}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            </View>
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
        marginBottom: 20, // Space below title
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
        color: '#219281FF',
        marginBottom: 10,
        textDecorationLine: 'underline',
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 5,
        justifyContent: "center",
        alignItems: "center",
        elevation: 3,
    },
    deleteButton: {
        backgroundColor: "#F96635",
    },
    contactButton: {
        backgroundColor: "#6b87cc",
    },
    emailAllButton: {
        minWidth: 200,
        alignSelf: "center",
        marginBottom: 20,
        minHeight: 60
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    errorText: {
        fontSize: 18,
        color: "red",
        textAlign: "center",
        marginTop: 20,
    },
});

export default UsersList;
