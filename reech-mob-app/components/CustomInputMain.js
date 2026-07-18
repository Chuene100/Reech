import { View, StyleSheet, TextInput } from "react-native";
import React from "react";
import { Controller } from "react-hook-form";

//import custom
import { COLORS } from "../constants";

const CustomInputMain = ({
  control,
  name,
  rules = {},
  placeholder,
  keyboardType = "default",
  secureTextEntry,
  icon,
  multiline = true,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <>
          <View
            style={[
              styles.container,
              {
                borderBottomColor: error ? COLORS.purple : COLORS.darkGray,
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
              style={styles.inputMain}
              secureTextEntry={secureTextEntry}
              icon={icon}
              enablesReturnKeyAutomatically
              multiline={multiline}
            />
          </View>
        </>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    top: 5,
    width: "100%",
    height: 45,
    padding: 10,
    marginVertical: 8,
    backgroundColor: COLORS.black,
  },
  inputMain: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 12,
    left: 5,
    bottom: 5,
  },
});

export default CustomInputMain;
