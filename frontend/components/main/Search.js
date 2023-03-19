import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const Search = ({ navigation }) => {
  const [users, setUsers] = useState([]);

  const fetchUsers = (search) => {
    firebase
      .firestore()
      .collection("users")
      .where("username", ">=", search)
      .get()
      .then((snapshot) => {
        let results = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setUsers(results);
      });
  };
  return (
    <View>
      <TextInput
        placeholder="Search"
        onChangeText={(search) => fetchUsers(search)}
      />
      <FlatList
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile", { uid: item.id })}
          >
            <Text>{item.username}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Search;
