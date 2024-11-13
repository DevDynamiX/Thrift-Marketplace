import React, {useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    Button,
    StyleSheet,
    TextInput,
    Modal,
    Alert,
    TouchableOpacity,
    ImageBackground,
    ScrollView, RefreshControl
} from 'react-native';
import {useFonts} from "expo-font";
import {Picker} from "@react-native-picker/picker";
import { Formik } from 'formik';
import Constants from "expo-constants";
import Icon from "react-native-vector-icons/Ionicons";

//TODO: SAVE GENERATED discount to table
const ViewRecycling = () => {

    const [recyclingItems, setRecyclingItems ] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const [selectedItem, setSelectedItem] = useState(null);

    const [ refresh, setRefresh] = useState(false);

    const [fontsLoaded] = useFonts({
        'montserrat': require('@assets/fonts/Montserrat-VariableFont_wght.ttf'),
        'montserrat_Italic': require('@assets/fonts/Montserrat-Italic-VariableFont_wght.ttf'),
        'sulphurPoint': require('@assets/fonts/SulphurPoint-Regular.ttf'),
        'sulphurPoint_Bold': require('@assets/fonts/SulphurPoint-Bold.ttf'),
        'sulphurPoint_Light': require('@assets/fonts/SulphurPoint-Light.ttf'),
        'shrikhand': require('@assets/fonts/Shrikhand-Regular.ttf'),
    });

    const handleRefresh = async () => {
        setRefresh(true);
        try{
            await fetchRecycling();
        } catch (error){
            console.error("Failed to refresh cart. ", error);
            Alert.alert('Error', 'Could not refresh cart.');
        }finally{
            setRefresh(false);
        }
    }

    //fetch from recycling db
    const fetchRecycling = async () => {
        try {
            const response = await fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/recycling`);
            if (!response.ok) {
                throw new Error('Failed to fetch Recycling data');
            }
            const data = await response.json();
            setRecyclingItems(data);

        } catch (error) {
            console.error('Error fetching Recycling data: ', error);
        }
    };

// useEffect to fetch data on mount
    useEffect(() => {
        fetchRecycling();
    }, []);


    //delete request
    const handleItemDelete = async (id) => {
        try {
            //use recyclingID here
            const response = await fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/recycling/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if(!response.ok) {
                throw new Error('Failed to remove item!');
            }

            fetchRecycling();

            Alert.alert('Success', 'Item Successfully removed from Recycling queue!');
        }catch (error){
            Alert.alert('Error', 'Could not remove entry from recycling queue!');
            console.error('Error deleting item:', error)
        }

    }

    //view recycling details
    const openEditModal = (item:id) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const closeModal = () => {
        setSelectedItem(null);
        setModalVisible(false);
    };

    //warn for delete
    const warnUser = (id) => {
        Alert.alert(
            'DELETE',
            'Are you sure you want to delete this item?',
            [
                {
                    text: 'NO',
                    onPress: () => console.log('Delete cancelled'),
                    style: 'cancel',

                },
                {
                    text: 'YES',
                    onPress: () => handleItemDelete(id)
                }
            ]
        )
    }

    const Random = (length = 5) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    };

    //saving to discount table
    const handleDiscountUpload = async (values) => {
        const discountPercent = Number(values.discount);

        // Generate random string for the discount code
        const random = Random(5);  // Assuming you have a function to generate a random string

        if (!discountPercent) {
            Alert.alert('Please Select a discount percentage!');
            return;
        }

        const discountCode = `TM-${random}-${discountPercent}`;

        // Prepare form data
        const formData = {
            discountCode,
            recyclingId:item.id,
            userID: 1,
        };

        try {
            const response = await fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/discounts`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            // Check if response is okay before parsing
            if (response.ok) {
                const responseText = await response.text();
                let responseData = {};
                try {
                    responseData = JSON.parse(responseText);
                    console.log('Parsed Response:', responseData);

                    if (!responseData.success) {
                        Alert.alert('Error', 'Could not save discount.');
                        return;
                    }

                    Alert.alert('Success', `Discount Code generated and saved for: ${selectedItem.firstName}`);
                    setModalVisible(false);  // Close modal
                } catch (error) {
                    console.error('Error parsing response:', error);
                    Alert.alert('Error', 'Invalid response format.');
                }
            } else {
                console.error('Failed response:', response.status);
                alert('Failed to save discount.');
            }
        } catch (error) {
            console.error('Error: ', error);
            Alert.alert('Error', 'Could not save discount. Please try again.');
        }
    };


    const renderProduct = ({ item }) => (
        <View style={styles.productContainer}>
            {item.onSale && <NewBanner/>}
            <View style={styles.recDetails}>
                <Text style={styles.recTitle}>{item.email}</Text>
                <Text style = {styles.recBody}>{item.firstName} {item.lastName}</Text>
                <Text style = {styles.recBody}>{item.description}</Text>
                <Text style = {styles.recBody}>{item.dropoffLocation}</Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => openEditModal(item)}
                    >
                        <Text style={styles.buttonText}>Accept</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => warnUser(item.id)}
                    >
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                </View>


            </View>
        </View>
    );


    const NewBanner = () => (
        <View style = { styles.bannerContainer }>
            <Text style = {styles.bannerText}> New </Text>
        </View>
    );

    return (
        <ImageBackground
            source = {require('@assets/images/TMBackground.png')}
            resizeMode="stretch"
            style = {styles.image}>
            <View style={styles.container}>
                <Text style={styles.header}>Manage Recycling</Text>
                <FlatList
                    data={recyclingItems}
                    renderItem={renderProduct}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refresh}
                            onRefresh={handleRefresh}
                        />
                    }
                />

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={closeModal}
                >

                        <View style = {styles.modalContainer}>
                            <Formik
                                initialValues={{
                                    discountCode: '',
                                }}
                                onSubmit={handleDiscountUpload}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
                                    <View style={styles.modalView}>
                                        <View style = { styles.headerContainer}>
                                            <Text style={styles.modalTitle}>Send Discount:</Text>
                                        </View>

                                        <Picker
                                            style={styles.pickerStyle}
                                            onValueChange={handleChange('discount')}
                                        >
                                            <Picker.Item label="Select a Discount Percent" value="" />
                                            <Picker.Item label="5%" value="5" />
                                            <Picker.Item label="10%" value="10" />
                                            <Picker.Item label="15%" value="15" />
                                            <Picker.Item label="20%" value="20" />
                                            <Picker.Item label="25%" value="25" />
                                            <Picker.Item label="30%" value="30" />
                                            <Picker.Item label="35%" value="35" />
                                            <Picker.Item label="40%" value="40" />
                                            <Picker.Item label="45%" value="45" />
                                            <Picker.Item label="50%" value="50" />
                                            <Picker.Item label="55%" value="55" />
                                            <Picker.Item label="60%" value="60" />
                                            <Picker.Item label="65%" value="65" />
                                            <Picker.Item label="70%" value="70" />
                                            <Picker.Item label="75%" value="75" />
                                            <Picker.Item label="80%" value="80" />
                                            <Picker.Item label="85%" value="85" />
                                            <Picker.Item label="90%" value="90" />
                                            <Picker.Item label="95%" value="95" />
                                            <Picker.Item label="100%" value="100" />
                                        </Picker>

                                        <View style={styles.modalButtonContainer}>
                                            <Text>Send --user-- an email:</Text>
                                            <View style = {styles.modalButtons}>
                                                <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                                                    <Text style={styles.buttonText}>Send</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={styles.cancelButton}
                                                    onPress={() => setModalVisible(false)}
                                                >
                                                    <Text style={styles.buttonText}>Cancel</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>)}
                            </Formik>
                        </View>
                </Modal>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        width: '100%',
    },
    header: {
        fontSize: 24,
        fontFamily: 'shrikhand',
        textAlign: 'center',
        marginBottom: 20,
        color: '#219281FF',
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    productContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 2,

    },
    recDetails: {
        width: '100%'
    },
    recTitle: {
        fontFamily: 'sulphurPoint_Bold',
        fontSize: 22,
        color: '#219281FF',
    },
    recBody: {
        fontFamily: 'sulphurPoint',
        fontSize: 18,
        paddingTop: 1,
        paddingBottom: 1
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'flex-end'

    },
    editButton: {
        backgroundColor: '#F9A822',
        padding: 10,
        marginRight: 10,
        borderRadius: 5,
    },
    deleteButton: {
        backgroundColor: '#F96635',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontFamily: 'sulphurPoint',
        fontWeight: 'bold',
    },
    modalView: {
        flex: 1,
        backgroundColor: '#ffffff',
        marginTop: 100,
        marginHorizontal: 20,
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
    },
    modalContainer: {
        flexDirection: 'column',
        height: '45%'
    },
    modalTitle: {
        fontFamily: 'shrikhand',
        fontSize: 25,
        marginBottom: 10,
        textAlign: 'center',
        color: '#4DAE91',
    },
    input: {
        fontFamily: 'sulphurPoint',
        borderWidth: 1,
        borderColor: '#cacaca',
        padding: 10,
        borderRadius: 5,
        color: '#219281FF'
    },
    modalButtonContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop:10,
    },
    modalButtons: {
        marginTop: 20,
        flexDirection: 'row',
    },
    saveButton: {
        fontFamily: 'sulphurPoint',
        backgroundColor: '#219281FF',
        padding: 10,
        marginRight: 15,
        borderRadius: 5,
        position: 'relative',
    },
    cancelButton: {
        fontFamily: 'sulphurPoint',
        backgroundColor: '#F96635',
        padding: 10,
        borderRadius: 5,
    },
    radioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginVertical: 10,
        marginBottom: '5%'
    },
    radioContainerSale: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginVertical: 10,
        marginBottom: '5%'
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#219281FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    selectedRadio: {
        backgroundColor: '#93D3AE',
    },
    radioLabel: {
        fontSize: 14,
        color: '#212121',
        fontFamily: 'sulphurPoint',
    },
    infoText: {
        fontSize: 14,
        color: '#F96635',
        fontFamily: 'sulphurPoint',
        textAlign: "right",
        marginBottom: '2%',
    },
    pickerStyle:  {
        fontFamily: 'sulphurPoint',
        fontSize: 14,
        color: '#219281FF',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginBottom: '5%'
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#212121',
        fontFamily: 'sulphurPoint',
    },
    previewContainer: {
        marginTop: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    previewImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
        resizeMode: 'cover',
    },
    removeButton: {
        marginTop: 10,
    },
    warnLabel: {
        color: '#F96635',
        marginBottom: 10,
        marginTop: 2
    },


    bannerContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#FF0000',
        padding: 5,
        borderRadius: 5,
        zIndex: 1,
    },
    bannerText: {
        color: '#FFFFFF', // Text color
        fontWeight: 'bold',
    },

});

export default ViewRecycling;
