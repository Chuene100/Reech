import { View, StyleSheet, Text, TextInput, Platform } from "react-native";
import React from "react";
import { Controller } from "react-hook-form";

//import custom
import { COLORS, SIZES } from "../../../constants";

const CustomReechingInput = ({
  control,
  name,
  rules = {},
  placeholder,
  keyboardType = "numeric",
  secureTextEntry,
  icon,
  onChangeText,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { value = 0, onChange, onBlur },
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
              onChangeText={(text) => {
                onChange(text);
                onChangeText?.(text);
              }}
              autoCapitalize="none"
              autoCorrect={false}
              onBlur={onBlur}
              keyboardType={keyboardType}
              placeholder={placeholder}
              placeholderTextColor={COLORS.white}
              style={styles.inputsReeching}
              secureTextEntry={secureTextEntry}
              icon={icon}
              enablesReturnKeyAutomatically
            />
          </View>
          {error && (
            <Text style={styles.errorMessage}>
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
    height: 40,
    padding: 10,
  },
  inputsReeching: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  errorMessage: {
    color: COLORS.purple,
    fontSize: SIZES.body5,
    padding: SIZES.padding - 22,
    marginHorizontal: SIZES.padding,
    marginVertical: 0,
    bottom: 45,
    right: 90,
  },
});

export default CustomReechingInput;
