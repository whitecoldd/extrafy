import React, { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Snackbar } from "react-native-paper";

const Distance = ({ initialValue, onSave, visible, onCancel }) => {
  const [value, setValue] = useState(initialValue);
  const [isValid, setIsValid] = useState(true);
  const handleTextChange = (text) => {
    const number = parseInt(text, 10);
    if (number >= 10 && number <= 10000) {
      setValue(text.toString());
    }
  };
  const handleSave = () => {
    if (value <= 10 && value >= 10000) {
      setIsValid({
        bool: true,
        boolSnack: true,
        message: "Distance value should more than 10km and less than 10000",
      });
    } else {
      onSave(value);
    }
  };

  const handleCancel = () => {
    setValue(initialValue);
    onCancel();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <LinearGradient
        colors={["#fcfac9", "#b69ccb"]}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Enter the location distance:</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "gray",
            borderRadius: 10,
            padding: 5,
            margin: 10,
          }}
          value={value}
          keyboardType="numeric"
          onChangeText={handleTextChange}
          placeholder="10...10000"
          maxLength={5}
          min="10"
          max="10000"
        />
        <TouchableOpacity onPress={handleSave} style={{ padding: 10 }}>
          <Text>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCancel} style={{ padding: 10 }}>
          <Text>Cancel</Text>
        </TouchableOpacity>
        <Snackbar
          visible={isValid.boolSnack}
          duration={2000}
          onDismiss={() => {
            setIsValid({ boolSnack: false });
          }}
        >
          {isValid.message}
        </Snackbar>
      </LinearGradient>
    </Modal>
  );
};

export default Distance;
