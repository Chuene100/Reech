import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
import { Controller } from "react-hook-form";
import { Entypo } from "@expo/vector-icons";

//import custom
import { COLORS, SIZES } from "../../../constants";

const CustomInputLocation = ({
  control,
  name,
  rules = {},
  placeholder,
  keyboardType = "default",
  icon,
}) => {
  const [rightIcon, setRightIcon] = useState("location-pin");

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
            <View style={styles.inputContainer}>
              <TextInput
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                autoCorrect={false}
                onBlur={onBlur}
                keyboardType={keyboardType}
                placeholder={placeholder}
                placeholderTextColor={COLORS.darkGray}
                style={styles.inputsLoc}
                icon={icon}
                enablesReturnKeyAutomatically
              />
              <Entypo
                name={rightIcon}
                size={25}
                color={COLORS.white}
                style={{ marginLeft: -20 }}
              />
            </View>
          </View>
          {error && (
            <Text
              style={{
                color: COLORS.purple,
                alignSelf: "stretch",
                fontSize: SIZES.body5,
                padding: SIZES.padding - 22,
                marginHorizontal: SIZES.padding,
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
    backgroundColor: COLORS.white,
    width: "100%",
    height: 40,
    padding: 10,
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: 1,
    marginVertical: 8,
  },
  inputsLoc: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    width: "100%",
  },
  inputContainer: {
    width: "100%",
    paddingTop: 0,
    paddingHorizontal: SIZES.padding - 11,
    flexDirection: "row",
    borderWidth: 1,
    marginTop: -5,
    marginBottom: -37,
  },
});

export default CustomInputLocation;
