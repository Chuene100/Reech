import { View, StyleSheet, Text, TextInput, Platform } from "react-native";
import React from "react";
import { Controller } from "react-hook-form";

//import custom
import { COLORS, SIZES } from "../../constants";

const CustomInputTextArea = ({
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
                width: Platform.OS === "ios" ? "95%" : "90%",
                height: Platform.OS === "ios" ? 265 : 225,
                marginLeft: "-20%",
                backgroundColor: COLORS.lightGray,
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
              placeholderTextColor={COLORS.black}
              style={styles.inputsAreaBubble}
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
                marginVertical: 5,

                right: 90,
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
    padding: "5%",
    justifyContent: "center",
    alignItems: "center",
  },
  inputsAreaBubble: {
    justifyContent: "center",
    alignSelf: "center",
    fontFamily: "PoppinsLight",
    color: COLORS.black,
    fontSize: 15,
  },
});

export default CustomInputTextArea;
