import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUsersData } from "../../redux/actions";
import { Snackbar } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

const Comments = (props) => {
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState("");
  const [comment, setComment] = useState("");
  const [IsValid, setIsValid] = useState(true);
  useEffect(() => {
    function matchUserToComment(comments) {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].hasOwnProperty("user")) {
          continue;
        }
        const user = props.users.find((x) => x.uid === comments[i].userid);
        if (user == undefined) {
          props.fetchUsersData(comments[i].userid, false);
        } else {
          comments[i].user = user;
        }
      }
      setComments(comments);
    }
    if (props.route.params.postId !== postId) {
      firebase
        .firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .doc(props.route.params.postId)
        .collection("comments")
        .orderBy("created_at", "desc")
        .get()
        .then((snapshot) => {
          let comments = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          matchUserToComment(comments);
        });
      setPostId(props.route.params.postId);
    } else {
      matchUserToComment(comments);
    }
  }, [props.route.params.postId, props.users]);

  const onCommentSend = () => {
    if (comment !== "") {
      firebase
        .firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .doc(props.route.params.postId)
        .collection("comments")
        .add({
          userid: firebase.auth().currentUser.uid,
          created_at: firebase.firestore.FieldValue.serverTimestamp(),
          comment,
        });
      setComment("");
    } else {
      setIsValid({
        bool: true,
        boolSnack: true,
        message: "Comment can't be empty",
      });
    }
  };
  return (
    <LinearGradient colors={["#fcfac9", "#b69ccb"]} style={styles.container}>
      <View style={{ flex: 7 }}>
        <Image
          style={{ flex: 1, resizeMode: "stretch" }}
          source={{ uri: props.route.params.post.downloadURL }}
        />
      </View>
      <View style={{ flex: 3 }}>
        <FlatList
          numColumns={1}
          data={comments}
          horizontal={false}
          renderItem={({ item }) => {
            const time = new Date(item.created_at?.seconds * 1000);
            const realTime = `${time.getHours()}:${
              (time.getMinutes() < 10 ? "0" : "") + time.getMinutes()
            }`;
            return (
              <View
                style={{
                  flex: 1,
                  paddingBottom: 10,
                  borderBottomColor: "black",
                  borderBottomWidth: 1,
                  marginHorizontal: 5,
                }}
              >
                {item.user !== undefined ? (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      paddingVertical: 10,
                      alignItems: "center",
                      alignContent: "center",
                    }}
                    onPress={() =>
                      props.navigation.navigate("Profile", {
                        uid: item.user.uid,
                      })
                    }
                  >
                    <View style={{ borderRadius: 30, overflow: "hidden" }}>
                      <Image
                        style={{ flex: 1, aspectRatio: 1 / 1 }}
                        source={{ uri: item.user.pfp }}
                      />
                    </View>
                    <Text style={styles.text}>{item.user?.username}</Text>
                  </TouchableOpacity>
                ) : null}
                <View style={styles.comment}>
                  <Text>{item.comment}</Text>
                  <Text>{realTime}</Text>
                </View>
              </View>
            );
          }}
        />
      </View>
      <View style={styles.commentSendBox}>
        <TextInput
          placeholder="Write a comment..."
          onChangeText={(value) => setComment(value)}
          style={styles.inputBox}
          multiline
          editable
          value={comment}
          autoCapitalize="sentences"
        />
        <TouchableOpacity onPress={() => onCommentSend()}>
          <MaterialCommunityIcons
            name="send-circle"
            size={26}
            color={"black"}
          />
        </TouchableOpacity>
        <Snackbar
          visible={IsValid.boolSnack}
          duration={2000}
          onDismiss={() => {
            setIsValid({ boolSnack: false });
          }}
        >
          {IsValid.message}
        </Snackbar>
      </View>
    </LinearGradient>
  );
};

const mapStateToProps = (store) => ({
  users: store.usersState.users,
});
const mapDispatchProps = (dispatch) =>
  bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Comments);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 22,
    marginLeft: 5,
  },
  comment: {
    marginHorizontal: 10,
    width: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputBox: {
    height: 40,
    borderRadius: 10,
    fontSize: 16,
    width: "90%",
  },
  commentSendBox: {
    borderRadius: 10,
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    margin: 1,
    borderColor: "black",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
