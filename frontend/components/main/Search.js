import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import React, { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const Search = ({ navigation }) => {
  const [users, setUsers] = useState([]);

  const fetchUsers = (search) => {
    firebase
      .firestore()
      .collection("users")
      .where("username", ">=", search.toLowerCase())
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
    <LinearGradient colors={["#fcfac9", "#b69ccb"]} style={styles.container}>
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
          <Ionicons name="search-circle" size={28} color="black" />
        </TouchableOpacity>
      </View>
      <FlatList
        numColumns={1}
        data={users}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userContainer}
            onPress={() => navigation.navigate("ProfileS", { uid: item.id })}
          >
            <View style={{ borderRadius: 30, overflow: 'hidden' }}>
              <Image
                style={{ flex: 1, aspectRatio: 1/1  }}
                source={{ uri: item?.pfp }}
              />
            </View>
            <Text style={styles.result}>{item.username}</Text>
          </TouchableOpacity>
        )}
      />
    </LinearGradient>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputBox: {
    height: 40,
    borderRadius: 10,
    fontSize: 16,
    width: "90%",
  },
  userContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 50,
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
  result: {
    fontSize: 22,
    paddingLeft: 10
  },
});
