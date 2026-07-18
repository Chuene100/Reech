import { View, StyleSheet, Text, TextInput, Platform } from "react-native";
import React from "react";
import { Controller } from "react-hook-form";

//import custom
import { COLORS, SIZES } from "../../constants";

const CustomInputTextAreaOpportunity = ({
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
          <View
            style={[
              styles.container,
              {
                width: "100%",
                height: Platform.OS === "ios" ? 200 : 160,
                backgroundColor: "#0d0d0d",
                borderColor: error ? COLORS.purple : COLORS.darkGray,
                borderRadius: 20,
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
              style={styles.inputsAreaOpp}
              icon={icon}
              enablesReturnKeyAutomatically={true}
              numberOfLines={250}
              multiline
            />
          </View>
          {error && (
            <Text
              style={{
                color: COLORS.purple,
                fontSize: SIZES.body5,
                padding: SIZES.padding - 22,
                marginHorizontal: SIZES.padding,
                marginTop: 5,
                right: 0,
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
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === "ios" ? 10 : 0,
  },
  inputsAreaOpp: {
    top: Platform.OS === "ios" ? 0 : -25,
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 12,
    paddingHorizontal: 15,
  },
});

export default CustomInputTextAreaOpportunity;
