import { View, StyleSheet, Text, TextInput, Platform } from "react-native";
import React from "react";
import { Controller } from "react-hook-form";

//import custom
import { COLORS, SIZES } from "../constants";

const CustomInputVouch = ({
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
                backgroundColor: COLORS.black,
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
              placeholderTextColor={COLORS.darkGray}
              style={styles.inputVouch}
              secureTextEntry={secureTextEntry}
              icon={icon}
              enablesReturnKeyAutomatically
              multiline={multiline}
            />
          </View>
          {error && (
            <Text
              style={{
                color: COLORS.purple,
                alignSelf: "stretch",
                fontSize: SIZES.body5,
                padding: SIZES.padding - 22,
                marginHorizontal: SIZES.padding,
                marginVertical: 0,
                left: 7,
                bottom: 10,
              }}
            >
              {error.message || "Oops, something went wrong!"}
            </Text>
          )}
        </>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.black,
    width: "100%",
    height: 45,
    padding: 10,
    marginVertical: 8,
  },
  inputVouch: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 16,
    left: 5,
    bottom: 5,
  },
});

export default CustomInputVouch;
