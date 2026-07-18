import { View, StyleSheet, Text, TextInput, Platform } from "react-native";
import React from "react";
import { Controller } from "react-hook-form";

//import custom
import { COLORS, SIZES } from "../constants";

const CustomInputDescriptionAddMain = ({
  control,
  name,
  rules = {},
  placeholder,
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
              placeholder={placeholder}
              placeholderTextColor={COLORS.darkGray}
              style={styles.inputDescription}
              secureTextEntry={secureTextEntry}
              icon={icon}
              enablesReturnKeyAutomatically
              multiline={multiline}
            />
          </View>
          {error && (
            <Text style={styles.errorMessageItem}>
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
    width: "100%",
    height: 60,
    paddingHorizontal: 0,
    justifyContent: "center",
    backgroundColor: COLORS.black,
  },
  inputDescription: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  errorMessageItem: {
    color: COLORS.purple,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    paddingVertical: 2,
    paddingHorizontal: 15,
  },
});

export default CustomInputDescriptionAddMain;
