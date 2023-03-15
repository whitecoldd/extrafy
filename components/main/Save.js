import { View, Text, Image, TextInput, Button } from "react-native";
import React, { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/firestore";
import "firebase/firebase-storage-compat";
import "firebase/compat/auth";

const Save = (props) => {
  console.log(props.route.params.image);
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
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(function () {
        props.navigation.popToTop();
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <Image source={{ uri: uri }} />
      <TextInput
        placeholder="Caption goes here..."
        onChangeText={(caption) => setCaption(caption)}
      />
      <Button title="Save post" onPress={() => uploadImg(uri)} />
    </View>
  );
};

export default Save;
