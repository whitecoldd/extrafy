import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUser, fetchUserPosts } from "../redux/actions/index.js";
import Loading from "./Loading.js";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import FeedScreen from "./main/Feed.js";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ProfileScreen from "./main/Profile.js";
import AddScreen from "./main/Add.js";

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
  return null;
};

const Main = (props) => {
  const { fetchUser, fetchUserPosts } = props;
  useEffect(() => {
    fetchUser();
    fetchUserPosts();
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
        name="FeedC"
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
        name="ProfileC"
        component={ProfileScreen}
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
        name="AddC"
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
  bindActionCreators({ fetchUser, fetchUserPosts }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Main);
