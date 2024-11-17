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

//TODO: GET USER ID
const ViewRecycling = () => {
    const [discountedItems, setDiscountedItems] = useState([]);  // State to track discounted items
    const [recyclingItems, setRecyclingItems ] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const [recyclingSectionItems, setRecyclingSectionItems] = useState([]);
    const [discountedSectionItems, setDiscountedSectionItems] = useState([]);

    const [selectedItem, setSelectedItem] = useState(null);

    const [ refresh, setRefresh] = useState(false);

    const [fontsLoaded] = useFonts({
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

            console.log('Recycling: Backend Response: ', data);

            const updatedRecyclingItems = data.map(item => ({
                ...item,
                discountApplied: false,
            }));

            return updatedRecyclingItems;

        } catch (error) {
            console.error('Error fetching Recycling data: ', error);
            return [];
        }
    };

    const fetchDiscounts =  async () => {
        try {
            const response = await fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/discounts`);
            if (!response.ok) {
                throw new Error('Failed to fetch Discounts data');
            }
            const data = await response.json();

            console.log('Discounts: Backend Response: ', data);

            const updatedDiscountItems = data.map(item => ({
                ...item,
                discountApplied: true,
            }));

            return updatedDiscountItems;

        } catch (error) {
            console.error('Error fetching Discounts data: ', error);
            return [];
        }
    }

    useEffect(() => {
        const categoriseItems = async () => {
            try {
                const recycling = await fetchRecycling();
                setRecyclingItems(recycling);

                const discounts = await fetchDiscounts();
                setDiscountedItems(discounts);

                const discountedIDs = discounts.map((discount) => discount.recycling?.id);

                const updatedRecyclingItems = recycling.map((item) => ({ ...item, discountApplied: discountedIDs.includes(item.id) }));

                const topItems =  updatedRecyclingItems.filter((item) => !item.discountApplied);
                const bottomItems = updatedRecyclingItems.filter((item) => item.discountApplied);

                setRecyclingSectionItems(topItems);
                setDiscountedSectionItems(bottomItems);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        }
        categoriseItems();
    }, []);


    //delete request for recycling
    const handleItemDelete = async (id, discountApplied) => {
        try {
            if(discountApplied){
                const response = await fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/discounts/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                console.log("Attempting to delete discount with ID:", id);

                if(!response.ok) {
                    throw new Error('Failed to remove discount!');
                }

                console.log("Deleted discount with ID:", id);

                Alert.alert('Success', 'Discount Successfully removed from Recycling queue!');
            }else {
                //use recyclingID here
                const response = await fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/recycling/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                console.log("Attempting to delete entry with ID:", id);

                if (!response.ok) {
                    throw new Error('Failed to remove item!');
                }

                console.log("Deleted entry with ID:", id);


                Alert.alert('Success', 'Item Successfully removed from Recycling queue!');
            }
            fetchRecycling()
            fetchDiscounts()
        }catch (error){
            Alert.alert('Error', 'Could not remove entry or discount!');
            console.error('Error deleting item:', error)
        }

    }

    //view recycling details
    const openEditModal = (item) => {
        console.log('Opening modal for: ', item);
        console.log('opening modal for: ', item.id)
        setSelectedItem(item);
        setModalVisible(true);
    };

    const closeModal = () => {
        setSelectedItem(null);
        setModalVisible(false);
    };

    //warn for delete
    const warnUser = (id, discountApplied) => {
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
                    onPress: () => handleItemDelete(id, discountApplied)
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

    console.log('SelectedItem: ', selectedItem);

    //saving to discount table
    const handleDiscountUpload = async (values) => {
        const discountPercent = Number(values.discount);

        // Generate random string for the discount code
        const random = Random(5);

        if (!discountPercent) {
            Alert.alert('Please Select a discount percentage!');
            return;
        }

        const discountCode = `TM-${random}-${discountPercent}`;

        // Prepare form data
        const formData = {
            discountCode,
            recyclingId:selectedItem!.id,
            userID: selectedItem!.user.id,
        };

        console.log('Recycle item ID: ', selectedItem!.id);
        console.log('User ID: ', selectedItem!.user.id );

        console.log("Data being sent: ", formData)

        try {
            const response = await fetch(`${Constants.expoConfig?.extra?.BACKEND_HOST}/discounts`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const responseText = await response.text();
                let responseData = {};
                try {
                    responseData = JSON.parse(responseText);
                    if (!responseData.success) {
                        Alert.alert('Error', 'Could not save discount.');
                        return;
                    }

                    Alert.alert('Success', `Discount Code generated and saved for: ${selectedItem.firstName}`);

                    console.log('Discount saved for recycling ID: ', selectedItem.id);

                    setDiscountedItems((prev) => [...prev, {...selectedItem, discountApplied: true}]);
                    setRecyclingItems((prev) => prev.filter(item => item.id !== selectedItem.id));

                    console.log('Recycling items:', recyclingItems)
                    console.log('Discount items:', discountedItems)

                    setModalVisible(false);
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
            <View style={styles.recDetails}>
                <Text style={styles.recTitle}>{item.email}</Text>
                <Text style={styles.recBodyName}>
                    {item.firstName} {item.lastName}
                </Text>
                <Text style={styles.recBody}>{item.description}</Text>
                <Text style={styles.recBody}>{item.dropoffLocation}</Text>

                <View style={styles.buttonContainer}>
                    {!item.discountApplied && (
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => openEditModal(item)}
                        >
                            <Text style={styles.buttonText}>Accept</Text>
                        </TouchableOpacity>
                    )}

                    {item.discountApplied && (
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => warnUser(item.id, true)}
                        >
                            <Text style={styles.buttonText}>Delete Discount</Text>
                        </TouchableOpacity>
                    )}

                    {!item.discountApplied && (
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => warnUser(item.id, false)}
                        >
                            <Text style={styles.buttonText}>Delete</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );

    // Render Footer
    const renderFooter = () => {
        if (discountedSectionItems.length === 0) return null;

        return (
            <View>
                <View style={styles.separator} />
                <View style={styles.discountsAppliedContainer}>
                    <Text style={styles.discountHeader}>Discounts Generated:</Text>
                </View>
                <FlatList
                    data={discountedSectionItems}
                    renderItem={renderProduct}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        );
    };

    return (
        <ImageBackground
            source = {require('@assets/images/TMBackground.png')}
            resizeMode="stretch"
            style = {styles.image}>
            <View style={styles.container}>
                <Text style={styles.header}>Manage Recycling</Text>
                <FlatList
                    data={recyclingSectionItems}
                    renderItem={renderProduct}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refresh}
                            onRefresh={handleRefresh}
                        />
                    }
                    ListFooterComponent={ renderFooter }
                />


                {modalVisible && (
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
                                                <Text>Send   <Text style = {styles.emailText}>'{selectedItem.email}'</Text>  an email? </Text>
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
                )}
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
        fontSize: 30,
        fontFamily: 'shrikhand',
        textAlign: 'left',
        marginBottom: 20,
        color: '#219281FF',
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        opacity: 0.95,

    },
    productContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgb(255,255,255)',
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
        fontFamily: 'shrikhand',
        fontSize: 22,
        color: '#219281FF',
    },
    recBody: {
        fontFamily: 'sulphurPoint',
        fontSize: 20,
        paddingTop: 1,
        paddingBottom: 1,
        marginLeft:10,
        color: '#1a1a1a'
    },
    recBodyName: {
        fontFamily: 'sulphurPoint_Bold',
        fontSize: 22,
        paddingTop: 1,
        paddingBottom: 1,
        marginBottom: 5,
        color: '#93D3AE'
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
    separator: {
        alignSelf: 'center',
        height: 2,
        width: '80%',
        backgroundColor: 'rgb(92,183,165)',
        marginTop: 5,
        marginBottom: 15,
        borderRadius: 2,
    },
    discountHeader: {
        fontFamily: 'shrikhand',
        fontSize: 25,
        color: 'rgb(92,183,165)',
        textAlign: 'center',
    },
    discountsAppliedContainer:{
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 20
    },
    emailText: {
        color: 'rgb(92,183,165)',
    }

});

export default ViewRecycling;
