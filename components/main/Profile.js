import { View, Text, Image, FlatList, StyleSheet, Button } from "react-native";
import React, { useEffect, useState } from "react";

import { connect } from "react-redux";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

import Loading from "../Loading";

const Profile = (props) => {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [follow, setFollow] = useState(false);
  useEffect(() => {
    const { currentUser, posts } = props;
    if (props.route.params.uid === firebase.auth().currentUser.uid) {
      setUser(currentUser);
      setUserPosts(posts);
    } else {
      firebase
        .firestore()
        .collection("users")
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data());
          } else {
            console.log("User doesn't exist");
          }
        });

      firebase
        .firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .orderBy("created_at", "desc")
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          console.log(posts);
          setUserPosts(posts);
        });
    }
    if (props.follows.indexOf(props.route.params.uid) > -1) {
      setFollow(true);
    } else {
      setFollow(false);
    }
  }, [props.route.params.uid, props.follows]);

  const onFollow = () => {
    firebase
      .firestore()
      .collection("follows")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollows")
      .doc(props.route.params.uid)
      .set({});
  };
  const onUnfollow = () => {
    firebase
      .firestore()
      .collection("follows")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollows")
      .doc(props.route.params.uid)
      .delete();
  };

  if (user === null) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text>{user.username}</Text>
        <Text>{user.email}</Text>
        {props.route.params.uid !== firebase.auth().currentUser.uid ? (
          <View>
            {follow ? (
              <Button title="Unfollow" onPress={() => onUnfollow()} />
            ) : (
              <Button title="Follow" onPress={() => onFollow()} />
            )}
          </View>
        ) : null}
      </View>
      <View style={styles.gallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={userPosts}
          renderItem={({ item }) => (
            <View style={styles.imgContainer}>
              <Image style={styles.image} source={{ uri: item.downloadURL }} />
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
    aspectRatio: 1 / 1,
  },
  imgContainer: {
    flex: 1 / 3,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  follows: store.userState.follows,
});
export default connect(mapStateToProps, null)(Profile);
