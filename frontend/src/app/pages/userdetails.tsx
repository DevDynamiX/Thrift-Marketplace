import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Alert,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
    Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { handleLogout } from '../index';

// Define the user data type
type UserData = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
};

const EditUserDetails = () => {
    const [userId, setUserId] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDataString = await AsyncStorage.getItem('userData');
                if (userDataString) {
                    const userData: UserData = JSON.parse(userDataString);
                    setUserId(userData.id);
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

    const handleUpdate = async () => {
        try {
            const BACKEND_HOST = Constants.expoConfig?.extra?.BACKEND_HOST;
            if (!BACKEND_HOST) {
                Alert.alert('Error', 'Backend host is not configured.');
                return;
            }

            const updatedFields: Partial<UserData & { password?: string }> = {};
            if (email) updatedFields.email = email;
            if (firstName) updatedFields.firstName = firstName;
            if (lastName) updatedFields.lastName = lastName;
            if (password) updatedFields.password = password;

            const response = await fetch(`${BACKEND_HOST}/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer YOUR_TOKEN`, // Adjust if using tokens
                },
                body: JSON.stringify(updatedFields),
            });

            if (response.ok) {
                const updatedUserData: UserData = await response.json();
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
                        placeholder={password ? 'Leave empty to keep current password' : 'Type new password to update'}
                        placeholderTextColor="#aaa"
                    />

                    <TouchableOpacity style={styles.menuButton} onPress={handleUpdate}>
                        <Image source={require('assets/images/update.png')} style={styles.icon} />
                        <Text style={styles.buttonText}>Update Details</Text>
                    </TouchableOpacity>

                    <View style={styles.orContainer}>
                        <View style={styles.line} />
                        <Text style={styles.orText}>OR</Text>
                        <View style={styles.line} />
                    </View>

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
//
export default EditUserDetails;
