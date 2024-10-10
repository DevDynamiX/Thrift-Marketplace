import { Text, View } from "react-native";
import {useLocalSearchParams} from "expo-router";

const TempPage = () => {
    const { Id } = useLocalSearchParams<{ Id: string }>();
    return (
        <View>
            <Text>TempPage - {Id}</Text>
        </View>
    );
};

export default TempPage;