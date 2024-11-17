import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform, ImageBackground, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router'; // Import useRouter for navigation
import { handleLogout } from '../index';

const EditUserDetails = () => {
    const [userId, setUserId] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);

    const router = useRouter(); // Access the router

    // Load user details from AsyncStorage
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDataString = await AsyncStorage.getItem('userData');
                if (userDataString) {
                    const userData = JSON.parse(userDataString);
                    setUserId(userData.id); // Adjust key names as per backend
                    setEmail(userData.email);
                    setFirstName(userData.firstName);
                    setLastName(userData.lastName);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error loading user data:', error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Validate inputs before updating
    const validateInputs = () => {
        if (!email || !firstName || !lastName || !password) {
            Alert.alert('Error', 'Please fill in all fields.');
            return false;
        }
        return true;
    };

    // Update user details
    const handleUpdate = async () => {
        if (!validateInputs()) return;

        try {
            const BACKEND_HOST = Constants.expoConfig?.extra?.BACKEND_HOST;
            if (!BACKEND_HOST) {
                Alert.alert('Error', 'Backend host is not configured.');
                return;
            }

            const response = await fetch(`${BACKEND_HOST}/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer YOUR_TOKEN`, // Adjust if using tokens
                },
                body: JSON.stringify({ email, firstName, lastName, password }),
            });

            if (response.ok) {
                const updatedUserData = await response.json();
                await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
                Alert.alert('Success', 'User details updated successfully!');
            } else {
                Alert.alert('Error', 'Failed to update user details.');
            }
        } catch (error) {
            console.error('Error updating user details:', error);
            Alert.alert('Error', 'Something went wrong.');
        }
    };

    // Delete user account
    const handleDelete = async () => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete your account? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const BACKEND_HOST = Constants.expoConfig?.extra?.BACKEND_HOST;
                            if (!BACKEND_HOST) {
                                Alert.alert('Error', 'Backend host is not configured.');
                                return;
                            }

                            const response = await fetch(`${BACKEND_HOST}/users/${userId}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer YOUR_TOKEN`,
                                },
                            });

                            if (response.ok) {
                                // Clear user data from AsyncStorage
                                await AsyncStorage.removeItem('userData');
                                Alert.alert('Success', 'Your account has been deleted.');


                                handleLogout();


                            } else {
                                Alert.alert('Error', 'Failed to delete your account.');
                            }
                        } catch (error) {
                            console.error('Error deleting account:', error);
                            Alert.alert('Error', 'Something went wrong.');
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ImageBackground source={require('assets/images/Your.png')} style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.transparentContainer}
            >
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <Text style={styles.header}>Your Details</Text>

                    <Text style={styles.label}>Email:</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                    />
                    <Text style={styles.label}>First Name:</Text>
                    <TextInput
                        style={styles.input}
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                    <Text style={styles.label}>Last Name:</Text>
                    <TextInput
                        style={styles.input}
                        value={lastName}
                        onChangeText={setLastName}
                    />
                    <Text style={styles.label}>Password:</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry={true}
                        value={password}
                        onChangeText={setPassword}
                        placeholder={password ? "Leave to keep password" : "Type new password to edit"}
                        placeholderTextColor="#aaa"
                    />

                    {/* Update button with icon */}
                    <TouchableOpacity style={styles.menuButton} onPress={handleUpdate}>
                        <Image source={require('assets/images/update.png')} style={styles.icon} />
                        <Text style={styles.buttonText}>Update Details</Text>
                    </TouchableOpacity>

                    <View style={styles.orContainer}>
                        <View style={styles.line} />
                        <Text style={styles.orText}>OR</Text>
                        <View style={styles.line} />
                    </View>

                    {/* Delete button with icon */}
                    <TouchableOpacity style={[styles.menuButton, { backgroundColor: 'red' }]} onPress={handleDelete}>
                        <Image source={require('assets/images/delete-account.png')} style={styles.icon} />
                        <Text style={styles.buttonText}>Delete Account</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'cover',
    },
    transparentContainer: {
        flex: 0.9,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 20,
        borderRadius: 10,
        width: '90%',
    },
    header: {
        fontFamily: 'shrikhand',
        fontSize: 40,
        color: '#219281FF',
        marginBottom: 20,
        textAlign: 'left',
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: 'flex-start',
    },
    label: {
        fontSize: 16,
        marginVertical: 10,
        color: '#000',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        marginBottom: 20,
        backgroundColor: 'transparent',
        color: 'rgb(0,122,103)',
    },
    menuButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgb(92,183,165)',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 15,
        marginBottom: 15,
        justifyContent: 'center',
        width: '100%',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    line: {
        height: 1,
        backgroundColor: '#ccc',
        flex: 1,
    },
    orText: {
        marginHorizontal: 10,
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
});

export default EditUserDetails;
