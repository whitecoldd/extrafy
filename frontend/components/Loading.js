import { View, Image } from "react-native";
import React from "react";

const Loading = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image
        source={require("../assets/loading.gif")}
        style={{ width: 100, height: 100 }}
      />
    </View>
  );
};

export default Loading;
