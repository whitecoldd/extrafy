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

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(thunk),
});

const firebaseConfig = {
  apiKey: "AIzaSyDPXwmwYiJY-AQr9HZiqpSHQ6kH-k0JtOg",
  authDomain: "extrafy-207f3.firebaseapp.com",
  projectId: "extrafy-207f3",
  storageBucket: "extrafy-207f3.appspot.com",
  messagingSenderId: "1098605566918",
  appId: "1:1098605566918:web:27ace386c4e100a5c3f0c7",
  measurementId: "G-5V8N8EEZ87",
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const Stack = createNativeStackNavigator();

export default function App({ navigation }) {
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
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
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
              options={{ headerShown: false }}
            />
            {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
            <Stack.Screen
              name="Add"
              component={AddScreen}
              navigation={navigation}
            />
            <Stack.Screen
              name="Save"
              component={SaveScreen}
              navigation={navigation}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
}
