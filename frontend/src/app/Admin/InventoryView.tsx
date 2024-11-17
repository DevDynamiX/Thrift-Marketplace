import React, { useState } from 'react';
import {
    View,
    ImageBackground,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    Image,
    Text,
    Button,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Alert,
    Switch,
    Modal
} from 'react-native';

import {useFonts} from "expo-font";
import Icon from 'react-native-vector-icons/Ionicons';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';

const CartScreen = () =>{

    const [fontsLoaded] = useFonts({
        'sulphurPoint': require('@assets/fonts/SulphurPoint-Regular.ttf'),
        'sulphurPoint_Bold': require('@assets/fonts/SulphurPoint-Bold.ttf'),
        'sulphurPoint_Light': require('@assets/fonts/SulphurPoint-Light.ttf'),
        'shrikhand': require('@assets/fonts/Shrikhand-Regular.ttf'),
    });

    const [tableHead, setTableHead] = useState(['Image', 'SKU', 'Name', 'Price','On Sale?', 'Actions']);
    const [tableData, setTableData] = useState([
        ['@assets/images/2.png', 'M1', 'Shirt', 'R5', false, ''],
        ['@assets/images/2.png', 'M2', 'Jeans', 'R100', false, ''],
        ['@assets/images/2.png', 'M3', 'Shorts', 'R50', false, ''],
        ['@assets/images/2.png', 'M4', 'Jacket', 'R250', false, ''],
    ]);

    // Function to handle button click in the table
    const handleDeletePress = (index) => {
        Alert.alert(`Are you sure you want to delete ${index + 1}?`);
    };

    const handleEditPress = (index) => {
        Alert.alert(`Redirect to edit page for item ${index + 1}?`);
    };


    //uri will be stored in the db for images
    const renderImage = (imageSource) => (
        <View style = { styles.imageContainer }>
            <Image
                source={{uri: imageSource}}
                style = {styles.imageThumbnail}
            />
        </View>
    );
    const renderButtons = (index) => (
        <View style = { styles.actionBtnContainer}>
            <TouchableOpacity onPress={() => handleDeletePress(index)}>
                <View>
                    <Icon name = 'trash-outline' size={20} color="#F96635" />
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleEditPress(index)}>
                <View >
                    <Icon name = 'create-outline' size={20} color="#219281FF" />
                </View>
            </TouchableOpacity>
    </View>
    );
    const toggleSwitch = (index) => {
        setTableData(prevData => {
            const newData = [...prevData];
            const isOnSale =  !newData[index][4]

            if (isOnSale) {
                Alert.alert (
                    'Put Item on Sale',
                    'Are you sure you want to put this item on sale?',
                    [
                                {
                                    text: 'No',
                                    onPress: () => {
                                        newData[index][4] = false;
                                        setTableData(newData);
                                        Alert.alert('Item not on sale');
                                    },
                                    style: 'cancel',
                                },
                                {
                                    text: 'Yes',
                                    onPress: () => {
                                        showDiscountForm(index);
                                    },
                                },
                            ]
                    );
                }else{
                Alert.alert('Item not on sale');
                newData[index][4] = false;
                setTableData(newData);
            }

            return newData;
        });
    };

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItemIndex, setSelectedItemIndex] = useState(null);

    const showDiscountForm = (index) => {

        setSelectedItemIndex(index);
        setModalVisible(true);


    };

    const renderSaleButton = (index) => (
        <View style = { styles.saleButtonContainer }>
            <Text style = { styles.saleText }>N</Text>
            <Switch
                value = {tableData[index][4]}
                onValueChange={() => toggleSwitch(index)}
                style = { styles.saleButton }
            />
            <Text style = { styles.saleText }>Y</Text>
        </View>
);



    return (
        <SafeAreaView style = {styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="black" />
            <ImageBackground
                source = {require('@assets/images/TMBackground.png')}
                resizeMode="stretch"
                style = {styles.image}>
                <View style = { styles.mainContainer }>
                    <Image source = {require('@assets/images/TMPageLogo.png')} style={styles.logo}/>
                    <ScrollView>

                        <Modal
                            animationType = 'slide'
                            transparent = {true}
                            visible = {modalVisible}
                            onRequestClose = { () => {
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <View style = {styles.onSaleModal}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter new price"
                                    keyboardType="numeric"
                                />
                                <Button
                                    title="Submit"
                                    onPress={() => {
                                        // Submit the new price logic here
                                        setModalVisible(false);
                                    }}
                                />
                                <Button
                                    title="Cancel"
                                    onPress={() => setModalVisible(false)}
                                />

                            </View>


                        </Modal>

                        <View style={styles.tableContainer}>
                            <Text style = { styles.tableHeader}> Inventory for 'company name'</Text>
                            <Table borderStyle={{ borderColor: '#212121', borderWidth: 0.5 }}>
                                <Row data={tableHead} style={styles.head} textStyle={styles.headerText} />
                                {
                                    tableData.map((rowData, index) => (
                                        <TableWrapper key={index} style={styles.row}>
                                            {
                                                rowData.map((cellData, cellIndex) => (
                                                    <Cell
                                                        key={cellIndex}
                                                        data={
                                                        cellIndex === 0 ? renderImage(cellData) :
                                                            cellIndex === 5 ? renderButtons(index) :
                                                                cellIndex === 4 ? renderSaleButton(index) :
                                                                    cellData}
                                                        textStyle={styles.text}
                                                    />
                                                ))
                                            }
                                        </TableWrapper>
                                    ))
                                }
                            </Table>
                        </View>
                    </ScrollView>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        height:'100%',
        backgroundColor:'#219281FF',
    },
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        justifyContent: 'space-evenly',
        paddingBottom: '5%'
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    logo: {
        resizeMode: 'contain',
        width: '65%',
        height: '20%',
        position: "relative",
        top: '3%',
        left: "5%"
    },

    tableContainer: {
        flex: 1,
        padding: 10,
        paddingTop: '5%',
        backgroundColor: '#93D3AE',
        borderRadius: 10,
        marginVertical: 20,
        margin: 5
    },
    tableHeader: {
        fontFamily:'shrikhand',
        color: '#219281FF',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: '5%'
    },
    head: {
        height: 40,
        backgroundColor: '#219281FF',
    },
    headerText: {
        fontFamily: 'sulphurPoint_Bold',
        margin: 6,
        fontSize: 15,
        color: '#212121',
    },
    text: {
        fontFamily: 'sulphurPoint',
        margin: 6,
        color: '#212121',
        fontSize: 12,
    },
    row: {
        flexDirection: 'row',
        backgroundColor: '#FFF9E3',
        borderColor: '#212121',
    },
    imageThumbnail: {
        width: 50,
        height: 50,
        borderRadius: 5,
        resizeMode: 'contain',
    },
    actionBtnContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-around"
    },
    saleButtonContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: "center",
    },
    saleText: {
        fontFamily: "sulphurPoint",
        fontSize: 10
    }

});

export default CartScreen;