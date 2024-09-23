import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import "./tailwind.css";

export default function App() {
  return (
      <SafeAreaView style={styles.container}>
          <View style={styles.container}>
              <Text style={styles.title}>Welcome to Thrift Market!</Text>
              <Text>you can start by editing Index.tsx</Text>
          </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
