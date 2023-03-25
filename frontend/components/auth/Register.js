import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Snackbar } from "react-native-paper";
import firebase from "firebase/compat/app";
const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(true);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.length == 0 || email.length == 0 || password.length == 0) {
      setIsValid({
        bool: true,
        boolSnack: true,
        message: "Please fill out everything",
      });
      return;
    }
    if (password.length < 6) {
      setIsValid({
        bool: true,
        boolSnack: true,
        message: "Password must be at least 6 characters long",
      });
      return;
    }
    if (password.length > 12) {
      setIsValid({
        bool: true,
        boolSnack: true,
        message: "passwords must be at most 12 characters long",
      });
      return;
    }

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
            pfp: "default",
            followsCount: 0,
            followersCount: 0,
          });
        console.log(result);
      })
      .catch((error) => {
        setIsValid({
          bool: true,
          boolSnack: true,
          message: "Something went wrong",
        });
        console.log(error);
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
        Register
      </Text>
      <TextInput
        style={styles.searchBox}
        placeholder="username"
        onChangeText={(username) =>
          setUsername(
            username
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/\s+/g, "")
              .replace(/[^a-z0-9]/gi, "")
          )
        }
      />
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
        <Text style={{ color: "#FFFFE0" }}>Sign Up!</Text>
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

export default Register;
