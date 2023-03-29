import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import {
  USER_STATE_CHANGE,
  USER_POSTS_STATE_CHANGE,
  USERS_POSTS_STATE_CHANGE,
  USER_FOLLOWS_STATE_CHANGE,
  USERS_DATA_STATE_CHANGE,
  USER_MESSAGES_STATE_CHANGE,
  USER_MESSAGE_STATE_CHANGE,
  CLEAR_DATA,
  USERS_LIKES_STATE_CHANGE,
  USER_CHATS_STATE_CHANGE,
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

// export function fetchUserChats() {
//   return (dispatch) => {
//     const chats = [];

//     firebase
//       .firestore()
//       .collection("chats")
//       .where("participants", "array-contains", firebase.auth().currentUser.uid)
//       .get()
//       .then((snapshot) => {
//         snapshot.forEach((doc) => {
//           console.log(snapshot);
//           const chatId = doc.id;
//           const chat = doc.data();
//           const participants = chat.participants;
//           const otherParticipant = participants.find(
//             (participant) => participant !== firebase.auth().currentUser.uid
//           );
//           const otherUserRef = firebase.firestore().collection("users").doc(otherParticipant);
//           otherUserRef.get().then((doc) => {
//             const otherUser = doc.data();
//             const chatWithOtherUser = {
//               id: chatId,
//               user: {
//                 uid: otherUser.uid,
//                 username: otherUser.username,
//               },
//               chatId,
//             };
//             chats.push(chatWithOtherUser);
//             console.log(chats);
//             dispatch({ type: USER_CHATS_STATE_CHANGE, chats: chats });
//           });
//         });
//       });
//   };
// }

export function fetchUsersChats() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("chats")
      .onSnapshot((snapshot) => {
        console.log(snapshot);
        let chats = snapshot.docs.map((doc) => {
          const id = doc.id;
          return id;
        });
        dispatch({ type: USER_CHATS_STATE_CHANGE, chats });
        for (let i = 0; i < chats.length; i++) {
          dispatch(fetchUsersData(chats[i], true));
        }
      });
  };
}

export function fetchUsersMessages(chatId) {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .orderBy("created_at", "asc")
      .onSnapshot((snapshot) => {
        let messages = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        dispatch({
          type: USER_MESSAGES_STATE_CHANGE,
          messages,
          chatId,
          chatId,
        });
      });
  };
}

export function sendMessage(chatId, message, otherUserId) {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .add({
        text: message,
        sender: firebase.auth().currentUser.uid,
        receiver: otherUserId,
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        dispatch({
          type: USER_MESSAGE_STATE_CHANGE,
          message,
          chatId,
          otherUserId,
        });
      })
      .catch((error) => {
        console.log(error);
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
        const postId = snapshot._delegate._key.path.segments[3];
        let currentUserLike = false;
        if (snapshot.exists) {
          currentUserLike = true;
        }
        dispatch({ type: USERS_LIKES_STATE_CHANGE, postId, currentUserLike });
      });
  };
}
