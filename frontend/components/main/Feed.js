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

const windowHeight = Dimensions.get("window").height;

const Feed = (props) => {
  const [posts, setPosts] = useState([]);
  console.log(windowHeight);
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
  const [scrollY] = useState(new Animated.Value(0));
  const [isAboveHalf, setIsAboveHalf] = useState(false);

  useEffect(() => {
    const listenerId = scrollY.addListener(({ value }) => {
      setIsAboveHalf(value < windowHeight / 2);
    });
    return () => {
      scrollY.removeListener(listenerId);
    };
  }, [scrollY]);
  return (
    <View style={styles.container}>
      <LinearGradient colors={["#fcfac9", "#b69ccb"]} style={styles.container}>
        <View style={styles.container}>
          <Animated.FlatList
            numColumns={1}
            horizontal={false}
            data={posts}
            // contentContainerStyle={styles.scrollViewContent}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              {
                useNativeDriver: true,
              }
            )}
            renderItem={({ item }) => (
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

                  <Text style={styles.userContainer}>{item.caption}</Text>
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
                        color={isAboveHalf ? "#fff07d" : "#ab87ff"}
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
                        color={isAboveHalf ? "#fff07d" : "#ab87ff"}
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
                      color={isAboveHalf ? "#fff07d" : "#ab87ff"}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
  icon: {
    marginRight: 15,
    marginLeft: 5,
  },
  likeAndComment: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 7,
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
  image: {
    flex: 1,
    aspectRatio: 1,
  },
  btn: {
    flex: 1 / 5,
  },
  imgContainer: {
    borderRadius: 10,
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
