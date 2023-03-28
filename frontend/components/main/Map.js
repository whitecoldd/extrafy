import { StyleSheet, Text, View } from "react-native";
import React from "react";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import * as Location from "expo-location";

const Map = () => {
  Location.requestForegroundPermissionsAsync().then((permission) => {
    if (permission.granted) {
      Location.getCurrentPositionAsync().then((position) => {
        const { latitude, longitude } = position.coords;
        const userRef = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid);
        userRef.set({
          location: new firebase.firestore().GeoPoint(latitude, longitude),
        });
      });
    }
  });
  return (
    <View>
      <Text>Map</Text>
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({});
