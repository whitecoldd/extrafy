import { Camera, CameraType } from "expo-camera";
import { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons, Feather, AntDesign } from "@expo/vector-icons";

export default function Add({ navigation }) {
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
        <View style={styles.btnContainer}>
          <TouchableOpacity title="Flip Image" onPress={toggleCameraType}>
            <MaterialCommunityIcons
              name="camera-flip"
              size={50}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginLeft: 50, marginRight: 50 }}
            onPress={() => takePic()}
          >
            <Feather name="circle" size={70} color="white" />
          </TouchableOpacity>
          <TouchableOpacity title="Choose From Gallery" onPress={pickImage}>
            <AntDesign name="picture" size={50} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.posContainer}>
          <TouchableOpacity
            title="SaveBtn"
            onPress={() => navigation.navigate("Save", { image })}
          >
            <Feather name="save" size={50} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.pictureContainer}>
          {image ? <Image source={{ uri: image }} style={{flex:1}} /> : null}
        </View>
      </View>
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
    flexDirection: "column",
    position: "relative",
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
  posContainer: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  btnContainer: {
    position: "absolute",
    bottom: 5,
    right: "12%",
    flexDirection: "row",
    alignItems: "center",
  },
  pictureContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: "white",
  },
});
