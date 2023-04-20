import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";

import { connect } from "react-redux";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

import Loading from "../Loading";
import { LinearGradient } from "expo-linear-gradient";

const Profile = (props) => {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [follow, setFollow] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const { currentUser, posts } = props;
    if (props.route.params.uid === firebase.auth().currentUser.uid) {
      setUser(currentUser);
      setUserPosts(posts);
      setLoading(false);
    } else {
      firebase
        .firestore()
        .collection("users")
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            props.navigation.setOptions({
              title: snapshot.data().username,
            });
            setUser({ uid: props.route.params.uid, ...snapshot.data() });
          } else {
            console.log("User doesn't exist");
          }
          setLoading(false);
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
          setUserPosts(posts);
        });
    }
    if (props.follows.indexOf(props.route.params.uid) > -1) {
      setFollow(true);
    } else {
      setFollow(false);
    }
  }, [props.route.params.uid, props.follows, props.currentUser, props.posts]);

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

  const onLogout = () => {
    firebase.auth().signOut();
  };

  if (user === null) {
    return null;
  }
  if (loading) {
    return <Loading />;
  }

  return (
    <LinearGradient colors={["#fcfac9", "#b69ccb"]} style={styles.container}>
      <View
        style={
          props.route.params.uid !== firebase.auth().currentUser.uid
            ? styles.info
            : styles.infoSelf
        }
      >
        <View style={{ borderRadius: 30, overflow: "hidden" }}>
          <Image
            style={{ flex: 1, aspectRatio: 1 / 1 }}
            source={{ uri: user.pfp }}
          />
        </View>
        <View>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.name}>{user?.name}</Text>
        </View>
        {props.route.params.uid !== firebase.auth().currentUser.uid ? (
          <View style={styles.btnContainer1}>
            {follow ? (
              <TouchableOpacity style={styles.btn} onPress={() => onUnfollow()}>
                <Text style={{ backgroundColor: "transparent" }}>Unfollow</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.btn} onPress={() => onFollow()}>
                <Text style={{ backgroundColor: "transparent" }}>Follow</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.btn}
              onPress={() => props.navigation.navigate("Chat", { user })}
            >
              <Text style={{ backgroundColor: "transparent" }}>Message</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <TouchableOpacity onPress={() => onLogout()}>
              <MaterialCommunityIcons name="logout" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate("Edit", { pfp: user?.pfp })
              }
            >
              <FontAwesome5 name="edit" size={24} color="black" />
            </TouchableOpacity>
          </View>
        )}
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  info: {
    flex: 1 / 5,
    margin: 10,
  },
  infoSelf: {
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  gallery: { flex: 4 / 5 },
  image: {
    aspectRatio: 1 / 1,
    margin: 1,
  },
  imgContainer: {
    flex: 1 / 3,
  },
  btnContainer1: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 0,
  },
  btn: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "#ab87ff",
    backgroundColor: "#ab87ff",
    fontSize: 16,
    width: "40%",
    padding: 8,
    color: "#FFFFE0",
    marginTop: 5,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  name: {
    fontSize: 16,
    color: "#666",
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  follows: store.userState.follows,
});
export default connect(mapStateToProps, null)(Profile);
