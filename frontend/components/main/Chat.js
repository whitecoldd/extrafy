import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersMessages, sendMessage } from "../../redux/actions";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Chat = (props) => {
  const scrollViewRef = useRef();
  const { user } = props.route.params;
  const dispatch = useDispatch();
  const currentUser = firebase.auth().currentUser;
  const messages = useSelector((state) => state.userState.messages);
  const [text, setText] = useState("");

  const chatId =
    currentUser.uid < user.uid
      ? `${currentUser.uid}_${user.uid}`
      : `${user.uid}_${currentUser.uid}`;

  useEffect(() => {
    dispatch(fetchUsersMessages(chatId));
  }, []);

  const onSendMessage = () => {
    if (text.length > 0) {
      dispatch(sendMessage(chatId, text, user.uid));
      setText("");
    }
  };

  const renderMessage = (message) => {
    const isSentByCurrentUser = message.sender === currentUser.uid;
    const time = new Date(message.created_at?.seconds * 1000);
    const realTime = `${time.getHours()}:${
      (time.getMinutes() < 10 ? "0" : "") + time.getMinutes()
    }`;
    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          isSentByCurrentUser
            ? styles.sentMessageContainer
            : styles.receivedMessageContainer,
        ]}
      >
        <Text
          style={[
            (styles.messageContainer,
            isSentByCurrentUser
              ? styles.sentMessageText
              : styles.receivedMessageText),
          ]}
        >
          {message.text}
        </Text>
        <Text style={styles.timeCont}>{realTime}</Text>
      </View>
    );
  };

  return (
    <LinearGradient colors={["#fcfac9", "#b69ccb"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={styles.container}
      >
        <View style={styles.header}>
          <View style={{ borderRadius: 30, overflow: "hidden", marginRight: 10 }}>
            <Image
              style={{ flex: 1, aspectRatio: 1 / 1 }}
              source={{ uri: user?.pfp }}
            />
          </View>
          <Text style={styles.headerText}>{user.username}</Text>
        </View>
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({ animated: true })
          }
          style={styles.messageList}
        >
          {messages?.length > 0 ? (
            messages.map((chat) => renderMessage(chat))
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
              <Text>No messages yet!</Text>
            </View>
          )}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message"
            value={text}
            onChangeText={(value) => setText(value)}
          />
          <TouchableOpacity onPress={onSendMessage}>
            <MaterialCommunityIcons name="send" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 50,
    padding: 5,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    marginBottom: 10,
    borderBottomColor: "white",
    borderBottomWidth: 1,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  messageList: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
  },
  messageContainer: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
  },
  sentMessageContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#fcfac9",
  },
  receivedMessageContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#b69ccb",
  },
  sentMessageText: {
    color: "#333",
    fontWeight: "500",
  },
  receivedMessageText: {
    color: "#333",
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  input: {
    flex: 1,
    height: 35,
  },
  timeCont: {
    fontSize: 10,
    textAlign: "right",
    textAlignVertical: "bottom",
    paddingLeft: 5,
  },
});

export default Chat;
