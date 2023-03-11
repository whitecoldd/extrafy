import { View, Text, TextInput, Button } from "react-native";
import React, { useState } from "react";

import firebase from "firebase/compat";
const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .set({
            username,
            email,
          });
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <View>
      <Text style={{ textAlign: "center" }}>Register</Text>
      <TextInput
        placeholder="name"
        onChangeText={(username) => setUsername(username)}
      />
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
      <Button onPress={handleSubmit} title="Sign Up!" />
    </View>
  );
};

export default Register;
