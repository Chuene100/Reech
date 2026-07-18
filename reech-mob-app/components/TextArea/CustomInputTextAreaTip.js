import { View, StyleSheet, Text, TextInput, Platform } from "react-native";
import React from "react";
import { Controller } from "react-hook-form";

//import custom
import { COLORS, SIZES } from "../../constants";

const CustomInputTextAreaTip = ({
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
                width: Platform.OS === "ios" ? "102%" : "100%",
                height: Platform.OS === "ios" ? 265 : 225,
                backgroundColor: COLORS.black,
                borderColor: error ? COLORS.purple : COLORS.black,
                borderWidth: 3,
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
              style={styles.inputsAreaRefTip}
              icon={icon}
              enablesReturnKeyAutomatically
              numberOfLines={140}
              multiline
            />
          </View>
          {error && (
            <Text
              style={{
                color: COLORS.purple,
                fontSize: 16,
                fontFamily: "PoppinsLight",
                padding: SIZES.padding - 22,
                marginHorizontal: SIZES.padding,
                marginVertical: 10,
                alignSelf: "center",
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
    padding: "5%",
    justifyContent: "center",
    alignItems: "center",
  },
  inputsAreaRefTip: {
    justifyContent: "center",
    alignSelf: "flex-start",
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 16,
  },
});

export default CustomInputTextAreaTip;
