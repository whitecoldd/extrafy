import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import firebase from "firebase/compat/app";
import "firebase/firestore";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const Save = (props) => {
  const uri = props.route.params.image;
  const childPath = `post/${
    firebase.auth().currentUser.uid
  }/${Math.random().toString(36)}`;
  const [caption, setCaption] = useState("");
  const uploadImg = async (uri) => {
    const res = await fetch(uri);
    const blob = await res.blob();
    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = (snapshot) => {
      console.log(
        `transferred: ${(
          (snapshot.bytesTransferred / snapshot.totalBytes) *
          100
        ).toFixed()} %`
      );
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        savePostData(snapshot);
        console.log(snapshot);
      });
    };
    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  const savePostData = (downloadURL) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(firebase.auth().currentUser.uid)
      .collection("userPosts")
      .add({
        downloadURL,
        caption,
        likesCount: 0,
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(function () {
        props.navigation.popToTop();
      });
  };

  return (
    <LinearGradient colors={["#fcfac9", "#b69ccb"]} style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Image style={{ flex: 1, aspectRatio: 1 / 1 }} source={{ uri: uri }} />
        <View style={{ flexDirection: "row", alignItems:'center' }}>
          <TextInput
            style={{ height: 80, width: '90%' }}
            placeholder="   Caption goes here..."
            onChangeText={(caption) => setCaption(caption)}
          />
          <TouchableOpacity onPress={() => uploadImg(uri)}>
            <MaterialCommunityIcons name="publish" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Save;
