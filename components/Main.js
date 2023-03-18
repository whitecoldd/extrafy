import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  fetchUser,
  fetchUserPosts,
  fetchUserFollows,
  clearData,
} from "../redux/actions/index.js";
import Loading from "./Loading.js";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import FeedScreen from "./main/Feed.js";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ProfileScreen from "./main/Profile.js";
import SearchScreen from "./main/Search.js";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
  return null;
};

const Main = (props) => {
  const { clearData, fetchUser, fetchUserPosts, fetchUserFollows, navigation } =
    props;
  useEffect(() => {
    clearData();
    fetchUser();
    fetchUserPosts();
    fetchUserFollows();
  }, []);

  // if (currentUser == undefined) {
  //   return <Loading />;
  // }

  return (
    <Tab.Navigator
      initialRouteName="Feed"
      labeled={false}
      activeColor="#4a4063"
      shifting={false}
      inactiveColor="#ab87ff"
      barStyle={{ backgroundColor: "#f0e6ef" }}
    >
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="home"
              color={color}
              size={26}
              focused={false}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        navigation={navigation}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="magnify"
              color={color}
              size={26}
              focused={false}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("Profile", {
              uid: firebase.auth().currentUser.uid,
            });
          },
        })}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-circle"
              color={color}
              size={26}
              focused={false}
            />
          ),
        }}
      />
      <Tab.Screen
        name="AddScreen"
        component={EmptyScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("Add");
          },
        })}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="plus-box" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});
const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    { fetchUser, fetchUserPosts, fetchUserFollows, clearData },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(Main);
