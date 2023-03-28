import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserChats } from "../../redux/actions/index.js";

const ChatList = ({ navigation }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.userState.currentUser);
  const chats = useSelector((state) => state.userState.chats);

  useEffect(() => {
    dispatch(fetchUserChats());
  }, []);

  const onPressChat = (user) => {
    navigation.navigate("Chat", { user });
  };

  console.log(chats);

  const renderChat = ({ item }) => {
    const otherUser = item.users.filter(
      (user) => user.uid !== currentUser.uid
    )[0];
    return (
      <TouchableOpacity
        style={styles.chatContainer}
        onPress={() => onPressChat(otherUser)}
      >
        <Text style={styles.chatUsername}>{otherUser.username}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {chats.length !== 0 ? (
        <FlatList
          data={chats}
          renderItem={renderChat}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text>No chats yet</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
