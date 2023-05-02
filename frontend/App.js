import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthScreen from "./components/auth/Auth";
import RegisterScreen from "./components/auth/Register";
import LoginScreen from "./components/auth/Login";
import MainScreen from "./components/Main";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./redux/reducers";
import thunk from "redux-thunk";
import Loading from "./components/Loading";
import AddScreen from "./components/main/Add";
import SaveScreen from "./components/main/Save";
import CommentsScreen from "./components/main/Comments";
import ChatScreen from "./components/main/Chat";
import MapScreen from "./components/main/Map";
import EditScreen from "./components/main/Edit";
import ProfileScreen from "./components/main/Profile";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      thunk: thunk,
    }),
});

const firebaseConfig = {
  apiKey: "********",
  authDomain: "********",
  projectId: "********",
  storageBucket: "********",
  messagingSenderId: "********",
  appId: "********",
  measurementId: "********",
};
let db;
if (firebase.apps.length === 0) {
  db = firebase.initializeApp(firebaseConfig);
}
const Stack = createNativeStackNavigator();

export default function App(props, { navigation }) {
  const [loaded, setLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const auth = firebase.auth();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        setLoaded(true);
        setLoggedIn(false);
      } else {
        setLoaded(true);
        setLoggedIn(true);
      }
    });
  }, []);

  if (!loaded) {
    return <Loading />;
  } else if (!loggedIn) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Auth">
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              headerStyle: {
                backgroundColor: "#b69ccb",
              },
            }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerStyle: {
                backgroundColor: "#b69ccb",
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen
              name="Main"
              component={MainScreen}
              options={{
                headerStyle: {
                  backgroundColor: "#fcfac9",
                },
              }}
            />
            <Stack.Screen
              name="ProfileS"
              navigation={navigation}
              component={ProfileScreen}
              options={{
                headerStyle: {
                  backgroundColor: "#fcfac9",
                },
              }}
            />
            <Stack.Screen
              name="Add"
              component={AddScreen}
              navigation={navigation}
              options={{
                headerStyle: {
                  backgroundColor: "#fcfac9",
                },
              }}
            />
            <Stack.Screen
              name="Save"
              component={SaveScreen}
              navigation={navigation}
              options={{
                headerStyle: {
                  backgroundColor: "#fcfac9",
                },
              }}
            />
            <Stack.Screen
              name="Comments"
              component={CommentsScreen}
              navigation={navigation}
              options={{
                headerStyle: {
                  backgroundColor: "#fcfac9",
                },
              }}
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              navigation={navigation}
              options={{
                headerStyle: {
                  backgroundColor: "#fcfac9",
                },
              }}
            />
            <Stack.Screen
              name="Map"
              component={MapScreen}
              navigation={navigation}
              options={{
                headerStyle: {
                  backgroundColor: "#fcfac9",
                },
              }}
            />
            <Stack.Screen
              name="Edit"
              component={EditScreen}
              navigation={navigation}
              options={{
                headerStyle: {
                  backgroundColor: "#fcfac9",
                },
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
}
