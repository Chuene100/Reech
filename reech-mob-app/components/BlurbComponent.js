import { View, StyleSheet, Text, TextInput, Platform } from "react-native";
import React from "react";
import { Controller } from "react-hook-form";

//import custom
import { COLORS, SIZES } from "../constants";

const BlurbComponent = ({
  control,
  name,
  invalue,
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
        field: { value = invalue, onChange, onBlur },
        fieldState: { error },
      }) => (
        <>
          <View
            style={[
              styles.container,
              {
                backgroundColor: COLORS.black,
                borderColor: error ? COLORS.purple : COLORS.transparent,
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
              style={styles.inputBlurb}
              icon={icon}
              multiline
            />
          </View>
          {error && (
            <Text
              style={{
                top: 5,
                color: COLORS.purple,
                alignSelf: "flex-start",
                fontSize: SIZES.body5,
                padding: SIZES.padding - 22,
                marginHorizontal: 2,
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
    width: "100%",
  },
  inputBlurb: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight"
  },
});

export default BlurbComponent;
