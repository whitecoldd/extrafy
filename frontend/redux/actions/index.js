import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/auth";
import {
  USER_STATE_CHANGE,
  USER_POSTS_STATE_CHANGE,
  USERS_POSTS_STATE_CHANGE,
  USER_FOLLOWS_STATE_CHANGE,
  USERS_DATA_STATE_CHANGE,
  CLEAR_DATA,
  USERS_LIKES_STATE_CHANGE,
} from "../constants/index.js";

export function clearData() {
  return (dispatch) => {
    dispatch({ type: CLEAR_DATA });
  };
}

export function fetchUser() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() });
        } else {
          console.log("User doesn't exist");
        }
      });
  };
}
export function fetchUserPosts() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(firebase.auth().currentUser.uid)
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
        dispatch({ type: USER_POSTS_STATE_CHANGE, posts });
      });
  };
}
export function fetchUserFollows() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("follows")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollows")
      .onSnapshot((snapshot) => {
        let follows = snapshot.docs.map((doc) => {
          const id = doc.id;
          return id;
        });
        console.log(follows);
        dispatch({ type: USER_FOLLOWS_STATE_CHANGE, follows });
        for (let i = 0; i < follows.length; i++) {
          dispatch(fetchUsersData(follows[i], true));
        }
      });
  };
}

export function fetchUsersData(uid, getPosts) {
  return (dispatch, getState) => {
    const found = getState().usersState.users.some((el) => el.uid === uid);

    if (!found) {
      firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            let user = snapshot.data();
            user.uid = snapshot.id;

            dispatch({ type: USERS_DATA_STATE_CHANGE, user });
            dispatch(fetchUsersFollowsPosts(user.uid));
          } else {
            console.log("User doesn't exist");
          }
        });
      if (getPosts) {
        dispatch(fetchUsersFollowsPosts(uid));
      }
    }
  };
}
export function fetchUsersFollowsPosts(uid) {
  return (dispatch, getState) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(uid)
      .collection("userPosts")
      .orderBy("created_at", "desc")
      .get()
      .then((snapshot) => {
        const uid = snapshot.docs[0].ref.path.split("/")[1];
        console.log(uid);
        const user = getState().usersState.users.find((el) => el.uid === uid);

        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data, user };
        });
        for (let i = 0; i < posts.length; i++) {
          dispatch(fetchUsersFollowsLikes(uid, posts[i].id));
        }
        dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid });
      });
  };
}
export function fetchUsersFollowsLikes(uid, postId) {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(uid)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot((snapshot) => {
        console.log(snapshot);
        const postId = snapshot._delegate._key.path.segments[3];
        let currentUserLike = false;
        if (snapshot.exists) {
          currentUserLike = true;
        }
        dispatch({ type: USERS_LIKES_STATE_CHANGE, postId, currentUserLike });
      });
  };
}