import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";

import firebase from "firebase/compat/app";
import { Snackbar } from "react-native-paper";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(true);
  const handleSubmit = (e) => {
    e.preventDefault();
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
        setIsValid({
          bool: true,
          boolSnack: true,
          message: "Wrong email or password",
        });
      });
  };
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
        Login
      </Text>
      <TextInput
        style={styles.searchBox}
        placeholder="email"
        name="email"
        autoCapitalize="none"
        onChangeText={(email) => setEmail(email)}
      />
      <TextInput
        style={styles.searchBox}
        placeholder="password"
        name="password"
        autoCapitalize="none"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <TouchableOpacity style={styles.btnBox} onPress={handleSubmit}>
        <Text style={{ color: "#FFFFE0" }}>Sign In!</Text>
      </TouchableOpacity>
      <Snackbar
        visible={isValid.boolSnack}
        duration={2000}
        onDismiss={() => {
          setIsValid({ boolSnack: false });
        }}
      >
        {isValid.message}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  btnBox: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "#ab87ff",
    backgroundColor: "#ab87ff",
    fontSize: 16,
    width: "30%",
    padding: 12,
    color: "#FFFFE0",
    marginTop: 5,
  },
  searchBox: {
    borderRadius: 10,
    borderWidth: 2,
    padding: 10,
    margin: 3,
    borderColor: "#ab87ff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "70%",
  },
});

export default Login;
