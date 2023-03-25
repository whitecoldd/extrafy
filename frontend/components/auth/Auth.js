import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

export default function Auth({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0e6ef",
      }}
    >
      <Text
        style={{
          textAlign: "center",
          marginBottom: 5,
          fontSize: 22,
          fontWeight: "bold",
        }}
      >
        <Text>Auth</Text>
      </Text>
      <TouchableOpacity
        style={styles.btnBox}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={{color: "#FFFFE0",}}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btnBox}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={{color: "#FFFFE0",}}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  btnBox: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "#ab87ff",
    backgroundColor: "#ab87ff",
    fontSize: 16,
    width: "50%",
    padding: 12,
    color: "#FFFFE0",
    marginTop: 5,
  },
});
