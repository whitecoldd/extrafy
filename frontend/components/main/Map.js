import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Distance from "./Distance";

export default function MapScreen(props) {
  const db = firebase.firestore();
  const [userLocation, setUserLocation] = useState({
    latitude: 47.1611615,
    longitude: 19.5057541,
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const [value, setValue] = useState("10");
  const [modalVisible, setModalVisible] = useState(false);
  const [filteredUsers, setfilteredUsers] = useState([]);
  useEffect(() => {
    const getUsersNearby = async (radius) => {
      const center = new firebase.firestore.GeoPoint(
        userLocation.latitude,
        userLocation.longitude
      );
      const maxLat = center.latitude + radius / 111000;
      const minLat = center.latitude - radius / 111000;
      const query = db
        .collection("users")
        .where(
          "location",
          ">=",
          new firebase.firestore.GeoPoint(minLat, center.longitude)
        )
        .where(
          "location",
          "<=",
          new firebase.firestore.GeoPoint(maxLat, center.longitude)
        );
      const snapshot = await query.get();
      const nearbyUsers = snapshot.docs.map((doc) => {
        const data = doc.data();
        const id = doc.id;
        return { id, ...data };
      });
      const filteredUsers = nearbyUsers.filter(
        (user) => user.id !== firebase.auth().currentUser.uid
      );
      setfilteredUsers(filteredUsers);
      console.log(filteredUsers);
    };

    const getLocationAsync = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        distanceInterval: 10,
      });
      if (location && location.coords) {
        const { latitude, longitude } = location.coords;
        const userRef = firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser?.uid);
        await userRef.update({
          location: new firebase.firestore.GeoPoint(latitude, longitude),
        });
        setUserLocation({
          latitude,
          longitude,
        });
        return location;
      } else {
        console.warn("Cannot get user location");
      }
    };

    if (firebase.auth().currentUser) {
      getLocationAsync().then(() => getUsersNearby(value));
    }
  }, [firebase.auth().currentUser, userLocation, value]);

  const handleSave = (newValue) => {
    setValue(newValue);
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };
  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <MaterialCommunityIcons
          name="signal-distance-variant"
          size={24}
          color="black"
          onPress={() => setModalVisible(true)}
        />
      ),
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Distance
        initialValue={value}
        onSave={handleSave}
        visible={modalVisible}
        onCancel={handleCancel}
      />
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={userLocation} pinColor="red" title="You are here" />
        {filteredUsers?.map((user, i) => (
          <Marker
            key={i}
            coordinate={{
              latitude: user?.location?.latitude,
              longitude: user?.location?.longitude,
            }}
            pinColor={"blue"}
            title={user?.username}
            tappable={true}
            onPress={() =>
              props.navigation.navigate("Profile", { uid: user.id })
            }
          >
            <Image
              style={{ height: 35, width: 35, borderRadius: 30 }}
              source={{ uri: user?.pfp }}
            />
          </Marker>
        ))}
      </MapView>
    </View>
  );
}
