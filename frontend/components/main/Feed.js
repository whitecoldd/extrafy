import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Button,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
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
  //#fff07d #ab87ff
  const [btnColor, setBtnColor] = useState("white");

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#fcfac9", "#b69ccb"]} style={styles.container}>
        <View style={styles.container}>
          <FlatList
            numColumns={1}
            horizontal={false}
            data={posts}
            renderItem={({ item }) => {
              return (
                <View style={styles.postContainer}>
                  <View>
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        padding: 10,
                        alignItems: "center",
                        alignContent: "center",
                      }}
                      onPress={() =>
                        props.navigation.navigate("ProfileS", {
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
                      <Text style={styles.userContainer}>
                        {item.user.username}
                      </Text>
                    </TouchableOpacity>

                    <View style={styles.imgContainer}>
                      <Image
                        style={styles.image}
                        source={{ uri: item.downloadURL }}
                      />
                    </View>
                    <View style={styles.likeAndComment}>
                      {item.currentUserLike ? (
                        <TouchableOpacity
                          style={styles.like}
                          onPress={() => onDislike(item.user.uid, item.id)}
                        >
                          <FontAwesome
                            style={styles.icon}
                            name="heart"
                            size={40}
                            color={btnColor}
                          />
                          <Text style={styles.likeCountText}>
                            {item.likesCount}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          title="Like"
                          style={styles.like}
                          onPress={() => onLike(item.user.uid, item.id)}
                        >
                          <FontAwesome
                            style={styles.icon}
                            name="heart-o"
                            size={40}
                            color={btnColor}
                          />
                          <Text style={styles.dislikeCountText}>
                            {item.likesCount}
                          </Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={styles.comment}
                        onPress={() =>
                          props.navigation.navigate("Comments", {
                            postId: item.id,
                            uid: item.user.uid,
                            post: item,
                          })
                        }
                      >
                        <FontAwesome
                          style={styles.iconComm}
                          name="comments-o"
                          size={44}
                          color={btnColor}
                        />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.captionContainer}>{item.caption}</Text>
                  </View>
                </View>
              );
            }}
          />
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postContainer: {
    borderRadius: 10,
  },
  userContainer: {
    padding: 5,
    marginLeft: 5,
    marginBottom: 5,
    fontSize: 22,
    overflow: "hidden",
  },
  captionContainer: {
    padding: 5,
    margin: 5,
    fontSize: 22,
    overflow: "hidden",
    color: "white"
  },
  icon: {
    marginRight: 15,
    marginLeft: 5,
  },
  like: { position: "absolute", top: -50, left: 5 },
  comment: { position: "absolute", top: -53, right: 10 },
  iconComm: {
    marginBottom: 2,
  },
  info: {
    margin: 10,
  },
  image: {
    flex: 1,
    aspectRatio: 1,
  },
  btn: {
    flex: 1 / 5,
  },
  imgContainer: {
    borderRadius: 20,
    overflow: "hidden",
  },
  likeCountText: {
    position: "absolute",
    top: 10,
    left: 21,
    fontWeight: "700",
  },
  dislikeCountText: {
    position: "absolute",
    top: 10,
    left: 21,
    fontWeight: "700",
    color: "white",
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  follows: store.userState.follows,
  feed: store.usersState.feed,
  usersFollowsLoaded: store.usersState.usersFollowsLoaded,
});
export default connect(mapStateToProps, null)(Feed);
