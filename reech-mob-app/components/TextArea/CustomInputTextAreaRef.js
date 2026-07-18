import { View, StyleSheet, TextInput, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import React from "react";
import { Controller } from "react-hook-form";

//import custom
import { COLORS } from "../../constants";

const CustomInputTextAreaRef = ({
  control,
  name,
  rules = {},
  placeholder,
  keyboardType = "default",
  icon,
}) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View >
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
            <View
              style={[
                styles.container,
                {
                  borderWidth: error ? 1 : 0,
                  borderColor: error ? COLORS.purple : COLORS.darkGray,
                },
              ]}
            >
              <TextInput
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                autoCorrect={false}
                onBlur={onBlur}
                keyboardType={keyboardType}
                placeholder={placeholder}
                placeholderTextColor={COLORS.white}
                style={[styles.inputsAreaRef, { height: Platform.OS === "ios" ? 80 : 100 }]}
                icon={icon}
                enablesReturnKeyAutomatically
                multiline={!Keyboard.dismissed}
                returnKeyType="done"
              />
            </View>
          )}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 13,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.reechGray,
  },
  inputsAreaRef: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 14,
  },
});

export default CustomInputTextAreaRef;
