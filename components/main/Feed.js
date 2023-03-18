import { View, Text, Image, FlatList, StyleSheet, Button } from "react-native";
import React, { useEffect, useState } from "react";

import { connect } from "react-redux";

const Feed = (props) => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    let posts = [];
    if (props.usersLoaded === props.follows.length) {
      for (let i = 0; i < props.follows.length; i++) {
        const user = props.users.find((a) => a.uid === props.follows[i]);
        if (user != undefined) {
          posts = [...posts, ...user.posts];
        }
      }
      posts.sort(function (x, y) {
        return x.created_at - y.created_at;
      });

      setPosts(posts);
    }
  }, [props.usersLoaded]);

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
  users: store.usersState.users,
  usersLoaded: store.usersState.usersLoaded,
});
export default connect(mapStateToProps, null)(Feed);
