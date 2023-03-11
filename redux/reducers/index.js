import { combineReducers } from "@reduxjs/toolkit";
import { user } from "./user";

const Reducers = combineReducers({
  userState: user,
});

export default Reducers;
