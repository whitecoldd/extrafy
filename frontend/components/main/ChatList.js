import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserFollows,
  fetchUsersChats,
} from "../../redux/actions/index.js";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { LinearGradient } from "expo-linear-gradient";

const ChatList = ({ navigation }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.userState.currentUser);

  const follows = useSelector((state) => state.userState.follows);
  const users = useSelector((state) => state.usersState.users);
  useEffect(() => {
    dispatch(fetchUsersChats());
    dispatch(fetchUserFollows());
  }, []);
  console.log(users);
  console.log(follows);

  const onPressChat = (user) => {
    navigation.navigate("Chat", { user });
  };

  const renderChat = ({ item }) => {
    const otherUser = users.filter((member) => member.uid === item)[0];
    console.log(otherUser);
    return (
      <TouchableOpacity
        style={styles.chatContainer}
        onPress={() => onPressChat(otherUser)}
      >
        <Text style={styles.chatUsername}>{otherUser?.username}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={["#fcfac9", "#b69ccb"]} style={styles.container}>
      <View style={styles.container}>
        {follows.length !== 0 ? (
          <FlatList
            data={follows}
            renderItem={renderChat}
            keyExtractor={(item) => item}
          />
        ) : (
          <Text>No chats yet</Text>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  chatUsername: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ChatList;
