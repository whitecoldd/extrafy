import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUsersData } from "../../redux/actions";
import Loading from "../Loading";

const Comments = (props) => {
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState("");
  const [comment, setComment] = useState("");
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
  }, [props.route.params.postId, props.users, comments]);

  const onCommentSend = () => {
    firebase
      .firestore()
      .collection("posts")
      .doc(props.route.params.uid)
      .collection("userPosts")
      .doc(props.route.params.postId)
      .collection("comments")
      .add({
        userid: firebase.auth().currentUser.uid,
        comment,
      });
  };

  // if(comments.user == undefined){
  //   return <Loading/>
  // }

  return (
    <View style={styles.container}>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={comments}
        renderItem={({ item }) => (
          <View>
            {item.user !== undefined ? (
              <Text style={styles.text}>{item.user?.username}</Text>
            ) : null}
            <Text style={styles.comment}>{item.comment}</Text>
          </View>
        )}
      />
      <View style={styles.commentSendBox}>
        <TextInput
          placeholder="Write a comment..."
          onChangeText={(comment) => setComment(comment)}
          style={styles.inputBox}
          multiline
          editable
          autoCapitalize="sentences"
          aria-busy
        />
        <TouchableOpacity onPress={() => onCommentSend()}>
          <MaterialCommunityIcons
            name="send-circle"
            size={26}
            color={"#ab87ff"}
          />
        </TouchableOpacity>
      </View>
    </View>
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
    backgroundColor: "#f0e6ef",
  },
  text: {
    fontSize: 22,
  },
  comment: {
    marginLeft: 10,
  },
  inputBox: {
    height: 40,
    borderRadius: 10,
    paddingTop: 10,
    fontSize: 16,
    width: "90%",
  },
  commentSendBox: {
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
});
