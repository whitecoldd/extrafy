import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import React from "react";

import { connect } from "react-redux";
const Profile = (props) => {
  const { currentUser, posts } = props;
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text>{currentUser.username}</Text>
        <Text>{currentUser.email}</Text>
      </View>
      <View style={styles.gallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={posts}
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
});
export default connect(mapStateToProps, null)(Profile);
