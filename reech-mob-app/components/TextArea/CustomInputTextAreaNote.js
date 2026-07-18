import { View, StyleSheet, Text, TextInput, Platform } from "react-native";
import React from "react";
import { Controller } from "react-hook-form";

//import custom
import { COLORS, SIZES } from "../../constants";

const CustomInputTextAreaNote = ({
  control,
  name,
  rules = {},
  placeholder,
  keyboardType = "default",
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
          <View style={styles.container}>
            <TextInput
              value={value}
              onChangeText={onChange}
              autoCapitalize="none"
              autoCorrect={false}
              onBlur={onBlur}
              keyboardType={keyboardType}
              placeholder={placeholder}
              placeholderTextColor={COLORS.gray}
              style={styles.inputsAreaNote}
              icon={icon}
              enablesReturnKeyAutomatically
              numberOfLines={50}
              multiline
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
                marginVertical: 5,
                fontFamily: "PoppinsLight",
              }}
            >
              {error.message || "Oops, something went wrong!"}
            </Text>
          )}
        </>
      )
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: "80%",
    height: 100,
    padding: 10,
    marginVertical: 8,
    marginLeft: 60,
  },
  inputsAreaNote: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 15,
  },
});

export default CustomInputTextAreaNote;
