import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Auth from "./components/auth/Auth";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import firebase from "firebase/compat";
import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./redux/reducers";
import thunk from "redux-thunk";
import Main from "./components/Main";
import Loading from "./components/Loading";

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

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
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
            component={Auth}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    );
}
