import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import * as geofirestore from "geofirestore";

export default function MapScreen() {
  const db = firebase.firestore();
  const geoFirestore = geofirestore.initializeApp(db);

  const [userLocation, setUserLocation] = useState({
    latitude: 47.1611615,
    longitude: 19.5057541,
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const [users, setUsers] = useState([]);
  useEffect(() => {
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
        console.log(location);
        return location;
      } else {
        console.warn("Cannot get user location");
      }
    };

    if (firebase.auth().currentUser) {
      getLocationAsync();
    }
  }, [firebase.auth().currentUser]);
  const usersRef = geoFirestore.collection("users");
  const query = usersRef.near({
    center: new firebase.firestore.GeoPoint(
      userLocation.latitude,
      userLocation.longitude
    ),
    radius: 10, // in kilometers
  });
  // query.on("key_entered", async (key, documentSnapshot, distance) => {
  //   const userLocation = await documentSnapshot.get("location");
  //   const user = { id: key, location: userLocation };
  //   setUsers((prevUsers) => [...prevUsers, user]);
  // });
  // query.on("key_entered", async (key, document, distance) => {
  //   console.log(key, document, distance);
  //   const userLocation = await document?.data()?.location;
  //   console.log(userLocation);
  //   if (userLocation) {
  //     const user = { id: key, location: userLocation };
  //     setUsers((prevUsers) => [...prevUsers, user]);
  //   }
  // });
  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (userLocation) {
    text = JSON.stringify(userLocation);
  }
  console.log(userLocation);
  return (
    <View style={{ flex: 1 }}>
      <Text>{text}</Text>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={userLocation} title="You are here" />
        {users.map((user) => (
          <Marker
            key={user.id}
            coordinate={user.location}
            title="Another user"
          />
        ))}
      </MapView>
    </View>
  );
}
