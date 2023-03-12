import { View, Text, TextInput, Button } from "react-native";
import React, { useState } from "react";

import firebase from "firebase/compat/app";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      });
  };
  return (
    <View>
      <Text style={{ textAlign: "center" }}>Login</Text>
      <TextInput
        placeholder="email"
        name="email"
        onChangeText={(email) => setEmail(email)}
      />
      <TextInput
        placeholder="password"
        name="password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <Button onPress={handleSubmit} title="Sign In!" />
    </View>
  );
};

export default Login;
