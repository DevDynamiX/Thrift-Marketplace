import {router} from "expo-router";
import { StyleSheet, Text, View, Pressable } from "react-native";

const IndexPage = () => {
    return (
        <View style={styles.container}>
            <View style={styles.main}>
                <Text style={styles.title}>Lol you pressed it</Text>
                <Text style={styles.subtitle}>You navigated into the tempFolder's Index.tsx file</Text>
                <Pressable
                    onPress={() =>
                        router.push({
                          pathname: "/tempFolderForRouting/[Id]",
                          params: {Id: 2},
                        })}
                >
                    <Text>Would be funny if you pressed on this :)</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default IndexPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
