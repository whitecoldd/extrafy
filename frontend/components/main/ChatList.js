import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
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
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ChatList = ({ navigation }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.userState.currentUser);

  const follows = useSelector((state) => state.userState.follows);
  const users = useSelector((state) => state.usersState.users);
  useEffect(() => {
    dispatch(fetchUsersChats());
    dispatch(fetchUserFollows());
  }, []);

  const onPressChat = (user) => {
    navigation.navigate("Chat", { user });
  };

  const renderChat = ({ item }) => {
    const otherUser = users.filter((member) => member.uid === item)[0];

    return (
      <TouchableOpacity
        style={styles.chatContainer}
        onPress={() => onPressChat(otherUser)}
      >
        <View style={{ borderRadius: 30, overflow: "hidden" }}>
          <Image
            style={{ flex: 1, aspectRatio: 1 / 1 }}
            source={{ uri: otherUser?.pfp }}
          />
        </View>
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
          <View
            style={{
              flex: 1,
              height: 400,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialCommunityIcons
              name="message-bulleted-off"
              size={24}
              color="black"
            />
            <Text>No chats yet!</Text>
          </View>
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
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 50,
  },
  chatUsername: {
    fontWeight: "bold",
    fontSize: 16,
    paddingLeft: 10,
  },
});

export default ChatList;
