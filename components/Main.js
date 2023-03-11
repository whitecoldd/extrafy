import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUser } from "../redux/actions/index.js";
import Loading from "./Loading.js";

const Main = (props) => {
  const { fetchUser, currentUser } = props;
  useEffect(() => {
    fetchUser();
  }, []);
  console.log(currentUser);

  if (currentUser == undefined) {
    return <Loading />;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{currentUser.username} is logged in</Text>
    </View>
  );
};

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});
const mapDispatchProps = (dispatch) =>
  bindActionCreators({ fetchUser }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Main);
