import { View, Text, Pressable } from "react-native";
import React from "react";
import { router } from "expo-router";

const dummyData = () => {
    const navigateToSIgnUp = () =>{
        router.push("auth/PayGate");
    }
    return (
        <View>
            <Text>Stop looking for M5's on autotrader Tyrique</Text>
            <Pressable onPress={navigateToSIgnUp}>
                <Text> Pay now, need money for gti coilovers </Text>
            </Pressable>
        </View>
            );
};

export default dummyData;
