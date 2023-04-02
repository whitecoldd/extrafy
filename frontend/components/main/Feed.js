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
import ImageColors from "react-native-image-colors";

const Feed = (props) => {
  console.log(ImageColors);
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
  const [btnColor, setBtnColor] = useState("#fff07d");

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#fcfac9", "#b69ccb"]} style={styles.container}>
        <View style={styles.container}>
          <FlatList
            numColumns={1}
            horizontal={false}
            data={posts}
            // contentContainerStyle={styles.scrollViewContent}
            renderItem={({ item }) => {
              // const handleColors = async () => {
              //   const colors = await ImageColors?.getColors(item.downloadURL);
              //   const backgroundColor =
              //     colors.platform === "android"
              //       ? colors.dominant
              //       : colors.background;
              //   const contrastColor = useContrastColor(backgroundColor);
              //   setBtnColor(contrastColor);
              // };
              // handleColors();
              return (
                <View style={styles.postContainer}>
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        padding: 10,
                        alignItems: "center",
                        alignContent: "center",
                      }}
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
                    </View>

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
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={styles.comment}
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
                          size={44}
                          color={btnColor}
                        />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.userContainer}>{item.caption}</Text>
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

// const useContrastColor = (color) => {
//   const luminance = getLuminance(color);
//   return luminance > 0.5 ? "#000000" : "#FFFFFF";
// };

// const getLuminance = (color) => {
//   const [r, g, b] = color.match(/\w\w/g).map((c) => parseInt(c, 16));
//   const [R, G, B] = [r / 255, g / 255, b / 255];
//   const luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;
//   return luminance;
// };

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
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  follows: store.userState.follows,
  feed: store.usersState.feed,
  usersFollowsLoaded: store.usersState.usersFollowsLoaded,
});
export default connect(mapStateToProps, null)(Feed);
