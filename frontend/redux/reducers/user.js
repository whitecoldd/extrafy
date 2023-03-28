import {
  USER_POSTS_STATE_CHANGE,
  USER_STATE_CHANGE,
  USER_FOLLOWS_STATE_CHANGE,
  USER_CHATS_STATE_CHANGE,
  USER_MESSAGES_STATE_CHANGE,
  USER_MESSAGE_STATE_CHANGE,
  CLEAR_DATA,
} from "../constants";

const initialState = {
  currentUser: null,
  posts: [],
  chats: [],
  follows: [],
  messages: [],
  chatId: null,
};

export const user = (state = initialState, action) => {
  switch (action.type) {
    case USER_STATE_CHANGE:
      return {
        ...state,
        currentUser: action.currentUser,
      };
    case USER_POSTS_STATE_CHANGE:
      return {
        ...state,
        posts: action.posts,
      };
    case USER_FOLLOWS_STATE_CHANGE:
      return {
        ...state,
        follows: action.follows,
      };
    case USER_CHATS_STATE_CHANGE: {
      return {
        ...state,
        chats: [...state.chats, ...action.chats],
      };
    }
    case USER_MESSAGES_STATE_CHANGE: {
      return {
        ...state,
        messages: action.messages,
      };
    }
    case USER_MESSAGE_STATE_CHANGE: {
      return {
        ...state,
        messages: [...state.messages, ...action.messages],
        chatId: state.chatId,
      };
    }
    case CLEAR_DATA:
      return initialState;
    default:
      return state;
  }
};
