import React, { useEffect, useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
const ChatList = ({ navigation }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unsub = firebase.firestore()
      .collection("chats")
      .where("users", "array-contains", firebase.auth().currentUser.uid)
      .orderBy("created_at", "desc")
      .onSnapshot((snapshot) => {
        const chatList = snapshot.docs.map((doc) => {
          const chat = doc.data();
          chat.id = doc.id;
          return chat;
        });
        setChats(chatList);
      });

    return unsub;
  }, []);

  const renderItem = ({ item }) => (
    <ListItem
      key={item.id}
      bottomDivider
      onPress={() => navigation.navigate("Chat", { chat: item })}
    >
      <Avatar rounded source={{ uri: item.photoURL }} />
      <ListItem.Content>
        <ListItem.Title>{item.displayName}</ListItem.Title>
        <ListItem.Subtitle>{item.lastMessage}</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChatList;