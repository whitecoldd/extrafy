import { View, Text, Image, FlatList, StyleSheet, Button } from "react-native";
import React, { useEffect, useState } from "react";

import { connect } from "react-redux";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/auth";
const Feed = (props) => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    if (
      props.usersFollowsLoaded === props.follows.length &&
      props.follows.length !== 0
    ) {
      props.feed.sort(function (x, y) {
        return x.created_at - y.created_at;
      });

      setPosts(props.feed);
    }
    console.log(posts);
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
            <View style={styles.imgContainer}>
              <Text style={styles.container}>{item.user.username}</Text>
              <Image style={styles.image} source={{ uri: item.downloadURL }} />
              {item.currentUserLike ? (
                <Button
                  title="Dislike"
                  onPress={() => onDislike(item.user.uid, item.id)}
                />
              ) : (
                <Button
                  title="Like"
                  onPress={() => onLike(item.user.uid, item.id)}
                />
              )}
              <Text
                onPress={() =>
                  props.navigation.navigate("Comments", {
                    postId: item.id,
                    uid: item.user.uid,
                  })
                }
              >
                View comments...
              </Text>
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
    marginTop: 40,
  },
  info: {
    margin: 10,
  },
  gallery: { flex: 1 },
  image: {
    flex: 1,
    aspectRatio: 1,
  },
  imgContainer: {
    flex: 1,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  follows: store.userState.follows,
  feed: store.usersState.feed,
  usersFollowsLoaded: store.usersState.usersFollowsLoaded,
});
export default connect(mapStateToProps, null)(Feed);
