import { View, StyleSheet, Text, TextInput } from "react-native";
import React from "react";
import { Controller } from "react-hook-form";

//import custom
import { COLORS, SIZES } from "../constants";

const CustomAmountInput = ({
  control,
  name,
  rules = {},
  placeholder,
  keyboardType = "default",
  secureTextEntry,
  icon,
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
              placeholderTextColor={COLORS.white}
              style={styles.inputAmount}
              secureTextEntry={secureTextEntry}
              icon={icon}
              enablesReturnKeyAutomatically
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
    height: 60,
    padding: 10,
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: 1,
    marginVertical: 8,
    alignItems: "center",
  },
  inputAmount: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 35,
  },
});

export default CustomAmountInput;
