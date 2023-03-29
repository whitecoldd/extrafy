import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";

import { connect } from "react-redux";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/auth";
import { FontAwesome } from "@expo/vector-icons";
const Feed = (props) => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    if (
      props.usersFollowsLoaded === props.follows.length &&
      props.follows.length !== 0
    ) {
      const sortedFeed = [...props.feed].sort(function (x, y) {
        return y.created_at - x.created_at;
      });
      const uniqueFeed = sortedFeed.filter((post, index) => {
        const firstIndex = sortedFeed.findIndex(
          (p) => p.id === post.id && p.user.uid === post.user.uid
        );
        return index === firstIndex;
      });
      setPosts(uniqueFeed);
    }
  }, [props.usersFollowsLoaded, props.feed]);

  const onLike = (userId, postId) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(userId)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .set({});
  };
  const onDislike = (userId, postId) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(userId)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .delete();
  };

  return (
    <View style={styles.container}>
      <View style={styles.gallery}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts}
          renderItem={({ item }) => (
            <View>
              <View>
                <Text style={styles.userContainer}>{item.user.username}</Text>
                <Image
                  style={styles.image}
                  source={{ uri: item.downloadURL }}
                />
                <Text style={styles.userContainer1}>{item.caption}</Text>
              </View>
              <View style={styles.likeAndComment}>
                {item.currentUserLike ? (
                  <TouchableOpacity
                    onPress={() => onDislike(item.user.uid, item.id)}
                  >
                    <FontAwesome
                      style={styles.icon}
                      name="heart"
                      size={24}
                      color="#ab87ff"
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    title="Like"
                    onPress={() => onLike(item.user.uid, item.id)}
                  >
                    <FontAwesome
                      style={styles.icon}
                      name="heart-o"
                      size={24}
                      color="#ab87ff"
                    />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate("Comments", {
                      postId: item.id,
                      uid: item.user.uid,
                    })
                  }
                >
                  <FontAwesome
                    style={styles.iconComm}
                    name="comments-o"
                    size={28}
                    color="#ab87ff"
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0e6ef",
  },
  userContainer: {
    backgroundColor: "#ab87ff",
    padding: 5,
    fontSize: 22,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    overflow: "hidden",
  },
  userContainer1: {
    backgroundColor: "#ab87ff",
    padding: 5,
    fontSize: 22,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    overflow: "hidden",
  },
  icon: {
    marginRight: 15,
    marginLeft: 5,
  },
  likeAndComment: {
    marginTop: 10,
    marginBottom: 10,
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  iconComm: {
    marginBottom: 2,
  },
  info: {
    margin: 10,
  },
  gallery: { flex: 1 },
  image: {
    flex: 1,
    aspectRatio: 1,
  },
  btn: {
    flex: 1 / 5,
  },
  // imgContainer: {
  //   borderRadius: 10,
  //   borderColor: "black",
  //   overflow: "hidden"
  // },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  follows: store.userState.follows,
  feed: store.usersState.feed,
  usersFollowsLoaded: store.usersState.usersFollowsLoaded,
});
export default connect(mapStateToProps, null)(Feed);
