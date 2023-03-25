import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { Ionicons } from "@expo/vector-icons";

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

  const onSearch = () => {};
  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search"
          onChangeText={(search) => fetchUsers(search)}
          style={styles.inputBox}
          multiline
          editable
          aria-busy
        />
        <TouchableOpacity onPress={() => onSearch()}>
          <Ionicons name="search-circle" size={28} color="#ab87ff" />
        </TouchableOpacity>
      </View>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={users}
        style={styles.dropdown}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile", { uid: item.id })}
          >
            <Text style={styles.result}>{item.username}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0e6ef",
  },
  inputBox: {
    height: 40,
    borderRadius: 10,
    fontSize: 16,
    width: "90%",
  },
  searchBox: {
    borderRadius: 10,
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    margin: 1,
    borderColor: "#ab87ff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdown: {
    borderRadius: 10,
    backgroundColor: "#ab87ff",
  },
  result: {
    fontSize: 22,
  },
});
