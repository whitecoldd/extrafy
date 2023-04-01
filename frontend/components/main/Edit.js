import { Feather, FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
// import * as Updates from 'expo-updates';
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
//import { container, form, navbar, text, utils } from "../../styles";

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
          color="green"
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
        console.log(`transferred: ${snapshot.bytesTransferred}`);
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

  return (
    <View>
      <TouchableOpacity
        style={{ backgroundColor: "pink", marginBottom: 10, padding: 20 }}
        onPress={() => pickImage()}
      >
        {image == "default" ? (
          <FontAwesome5 name="user-circle" size={80} color="black" />
        ) : (
          <Image
            source={{
              uri: image,
            }}
          />
        )}
        <Text>Change Profile Photo</Text>
      </TouchableOpacity>

      <TextInput
        value={name}
        style={{ backgroundColor: "pink", marginBottom: 10, padding: 20 }}
        placeholder="Name"
        onChangeText={(name) => setName(name)}
      />
      <TextInput
        value={description}
        style={{ backgroundColor: "pink", marginBottom: 10, padding: 20 }}
        placeholderTextColor={"#e8e8e8"}
        placeholder="Description"
        onChangeText={(description) => {
          setDescription(description);
        }}
      />
      <Button title="Logout" onPress={() => onLogout()} />
    </View>
  );
}

export default Edit;
