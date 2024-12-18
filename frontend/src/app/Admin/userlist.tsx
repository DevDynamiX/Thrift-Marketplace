import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    ImageBackground,
    TextInput,
    Modal,
    KeyboardAvoidingView,
    Platform,
    RefreshControl
} from "react-native";
import axios from "axios";
import { Linking } from 'react-native';
import Constants from "expo-constants";
import {useFonts} from "expo-font";
// push
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
    const [editedPassword, setEditedPassword] = useState<string>(''); // Password input left empty
    const [ refresh, setRefresh] = useState(false);
    const [fontsLoaded] = useFonts({
        'sulphurPoint': require('@assets/fonts/SulphurPoint-Regular.ttf'),
        'sulphurPoint_Bold': require('@assets/fonts/SulphurPoint-Bold.ttf'),
        'sulphurPoint_Light': require('@assets/fonts/SulphurPoint-Light.ttf'),
        'shrikhand': require('@assets/fonts/Shrikhand-Regular.ttf'),
    });

    const fetchUsers  =  () => {
        axios
            .get(`${Constants.expoConfig?.extra?.BACKEND_HOST}/users`)
            .then((response) => {
                setUsers(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to fetch users");
                setLoading(false);
            });
    }

    // Fetch users from the backend
    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRefresh = async () => {
        setRefresh(true);
        try{
            await fetchUsers();
        } catch (error){
            console.error("Failed to refresh . ", error);
            Alert.alert('Error', 'Could not refresh .');
        }finally{
            setRefresh(false);
        }
    }

    // Handle Delete user with confirmation
    const deleteUser = (userId: number) => {
        Alert.alert(
            "Delete User",
            "Are you sure you want to terminate this user's account?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: () => {
                        axios
                            .delete(`${Constants.expoConfig?.extra?.BACKEND_HOST}/users/${userId}`)
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

    // Email all users
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
        setEditedPassword(''); // Keep password field empty initially
        setIsEditing(true);
    };

    // Handle saving the edited user details
    const saveEditedUser = () => {
        if (!selectedUser) return;

        const updatedUser = {
            firstName: editedFirstName,
            lastName: editedLastName,
            email: editedEmail,
            password: editedPassword, // Include updated password if provided
        };
        //

        axios
            .put(`${Constants.expoConfig?.extra?.BACKEND_HOST}/users/${selectedUser.id}`, updatedUser)
            .then(() => {
                axios.get(`${Constants.expoConfig?.extra?.BACKEND_HOST}/users`)
                    .then((response) => {
                        setUsers(response.data);
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
                <Text style={styles.header}>User List</Text>

                <TouchableOpacity
                    style={[styles.button, styles.contactButton, styles.emailAllButton]}
                    onPress={emailAllUsers}
                >
                    <Text style={styles.emailAllText}>Email All Users</Text>
                </TouchableOpacity>

                <FlatList
                    data={users}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refresh}
                            onRefresh={handleRefresh}
                        />
                    }
                />
            </View>

            {/* Modal for Editing User */}
            <Modal
                visible={isEditing}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsEditing(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit User</Text>

                        {/* First Name Field */}
                        <Text style={styles.modalLabel}>Change First Name</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="First Name"
                            value={editedFirstName}
                            onChangeText={setEditedFirstName}
                        />

                        {/* Last Name Field */}
                        <Text style={styles.modalLabel}>Change Last Name</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Last Name"
                            value={editedLastName}
                            onChangeText={setEditedLastName}
                        />

                        {/* Email Field */}
                        <Text style={styles.modalLabel}>Change Email</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Email"
                            value={editedEmail}
                            onChangeText={setEditedEmail}
                        />

                        {/* Password Field */}
                        <Text style={styles.modalLabel}>Change Password (Leave blank to keep the same🚫)</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="New Password"
                            placeholderTextColor="#219281"
                            value={editedPassword}
                            onChangeText={setEditedPassword}
                            secureTextEntry // Make password input secure
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
                </KeyboardAvoidingView>
            </Modal>
        </ImageBackground>
    );
};
const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        opacity: 0.90,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
        fontSize: 30,
        fontFamily: 'shrikhand',
        textAlign: 'center',
        marginBottom: 20,
        color: '#219281FF',
    },
    userRow: {
        padding: 20,
        backgroundColor: "rgb(255,255,255)",
        marginBottom: 20,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        marginVertical: 10,
    },
    userId: {
        fontSize: 24,
        color: "#555",
        marginBottom: 5,
        fontFamily: 'shrikhand',
    },
    userName: {
        fontSize: 22,
        color: "#93D3AE",
        marginBottom: 5,
        fontFamily: 'shrikhand',
    },
    userEmail: {
        fontFamily: 'sulphurPoint',
        fontSize: 16,
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
        backgroundColor: '#F96635',
    },
    contactButton: {
        backgroundColor: '#F9A822',
    },
    editButton: {
        backgroundColor: '#219281FF',
    },
    buttonText: {
        color: '#fff',
        fontFamily: 'sulphurPoint_Bold',
        fontSize: 18,
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
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
    },
    modalLabel: {
        fontSize: 14,
        fontWeight: "bold",
        marginVertical: 5,
    },
    modalInput: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    saveButton: {
        backgroundColor: '#28a745',
    },
    cancelButton: {
        backgroundColor: '#ff4747',
    },
    emailAllButton: {
        backgroundColor: '#93D3AE',
        color: '',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 2,
        borderColor: '#219281FF',
        borderWidth: 3
    },
    emailAllText: {
        fontFamily: 'sulphurPoint',
        fontSize: 28,
        margin: 5,
        textAlign: 'center',
        color: '#219281FF',
    }
});

export default UsersList;
