import { Feather, FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import firebase from "firebase/compat/app";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Button,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import "firebase/compat/firestore";
import { useDispatch, useSelector } from "react-redux";

function Edit(props) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.userState.currentUser);
  const [name, setName] = useState(currentUser.username);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(currentUser.pfp);
  const [imageChanged, setImageChanged] = useState(false);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);

  const onLogout = async () => {
    firebase.auth().signOut();
    //Updates.reloadAsync()
  };

  useEffect(() => {
    (async () => {
      if (currentUser.description !== undefined) {
        setDescription(currentUser.description);
      }
    })();
  }, []);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <Feather
          //style={navbar.image}
          name="check"
          size={24}
          color="black"
          onPress={() => {
            console.log({ name, description });
            Save();
          }}
        />
      ),
    });
  }, [props.navigation, name, description, image, imageChanged]);

  const pickImage = async () => {
    if (true) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.uri);
        setImageChanged(true);
      }
    }
  };

  const Save = async () => {
    if (imageChanged) {
      const uri = image;
      const childPath = `profile/${firebase.auth().currentUser.uid}`;

      const response = await fetch(uri);
      const blob = await response.blob();

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
          firebase
            .firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .update({
              username: name,
              description: description,
              pfp: snapshot,
            })
            .then(() => {
              //   props.updateUserFeedPosts();
              props.navigation.goBack();
            });
        });
      };

      const taskError = (snapshot) => {
        console.log(snapshot);
      };

      task.on("state_changed", taskProgress, taskError, taskCompleted);
    } else {
      saveData({
        name,
        description,
      });
    }
  };

  const saveData = (data) => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .update(data)
      .then(() => {
        // updateUserFeedPosts();

        props.navigation.goBack();
      });
  };
  console.log(props.route.params.pfp);

  return (
    <LinearGradient colors={["#fcfac9", "#b69ccb"]} style={{ flex: 1 }}>
      <View style={{ flex: 1 / 3, flexDirection: "row" }}>
        <View style={{ flex: 1 / 2, marginLeft: 10 }}>
          {image === "default" ? (
            <FontAwesome5 name="user-circle" size={80} color="black" />
          ) : (
            <View style={{ flex: 1, overflow: "hidden", margin: 10 }}>
              <Image
                style={{ flex: 1, aspectRatio: 1 / 1 }}
                source={{ uri: image }}
              />
            </View>
          )}
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: "transparent",
            margin: 10,
            padding: 20,
            borderRadius: 30,
            flex: 1 / 2,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => pickImage()}
        >
          <MaterialCommunityIcons name="publish" size={44} color="black" />
          <Text>Change Profile Photo</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        value={name}
        style={{
          borderWidth: 1,
          borderColor: "black",
          backgroundColor: "transparent",
          margin: 10,
          padding: 15,
          borderRadius: 30,
        }}
        placeholder="Name"
        onChangeText={(name) => setName(name)}
      />
      <TextInput
        value={description}
        style={{
          borderWidth: 1,
          borderColor: "black",
          backgroundColor: "transparent",
          margin: 10,
          padding: 15,
          borderRadius: 30,
        }}
        placeholderTextColor={"gray"}
        placeholder="Description"
        onChangeText={(description) => {
          setDescription(description);
        }}
      />
      <Button title="Logout" onPress={() => onLogout()} />
    </LinearGradient>
  );
}

export default Edit;
