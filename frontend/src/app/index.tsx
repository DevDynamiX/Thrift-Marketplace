import {router} from "expo-router";
import { StyleSheet, Text, View, Pressable } from "react-native";

const IndexPage = () => {
  return (
      <View style={styles.container}>
        <View style={styles.main}>
          <Text style={styles.title}>Howzit MaseKint</Text>
          <Text style={styles.title}>Welcome to Thrift Market!</Text>
          <Text style={styles.subtitle}>This page is till a working in progress</Text>
          <Text style={styles.subtitle}>Currently testing how the Expo Router works via Pressable</Text>
          <Pressable
              onPress={() =>
                  router.push({
                    pathname: "/tempFolderForRouting/[Id]",
                    params: {Id: 1},
                  })}
          >
            <Text>Click here to go "into" the app :)</Text>
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
