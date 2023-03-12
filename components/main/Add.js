import { Camera, CameraType } from "expo-camera";
import { useState } from "react";
import { Button, StyleSheet, Text, Image, View } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function Add() {
  const [type, setType] = useState(CameraType.back);
  const [shot, takeShot] = useState(null);
  const [image, setImage] = useState(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }
  const takePic = async () => {
    if (shot) {
      const data = await shot.takePictureAsync(null);
      console.log(data.uri);
      setImage(data.uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera
          style={styles.fixedRatio}
          type={type}
          ratio={"1:1"}
          ref={(ref) => takeShot(ref)}
        />
      </View>

      <Button
        style={styles.button}
        title="Flip Image"
        onPress={toggleCameraType}
      />
      <Button title="Take a Pic" onPress={() => takePic()} />
      <Button title="Choose From Gallery" onPress={pickImage} />
      {image && (
        <Image source={{ uri: image }} style={styles.pictureContainer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  pictureContainer: {
    flex: 1,
  },
});
