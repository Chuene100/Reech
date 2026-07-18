import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput, Pressable } from "react-native";
import { Controller } from "react-hook-form";
import { Feather } from "@expo/vector-icons";

//import custom
import { COLORS, SIZES } from "../../../constants";

const CustomInput = ({
  control,
  name,
  rules = {},
  placeholder,
  keyboardType = "default",
  secureTextEntry,
  icon,
}) => {
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState("eye-off");

  const handlePasswordVisibility = () => {
    if (rightIcon === "eye-off") {
      setRightIcon("eye");
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === "eye") {
      setRightIcon("eye-off");
      setPasswordVisibility(!passwordVisibility);
    }
  };

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
                backgroundColor: COLORS.darkGray,
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
                placeholderTextColor={COLORS.white}
                style={styles.inputsPass}
                secureTextEntry={passwordVisibility}
                icon={icon}
                enablesReturnKeyAutomatically
              />

              <Pressable
                onPress={handlePasswordVisibility}
                style={{ backgroundColor: COLORS.transparent }}
              >
                <Feather
                  name={rightIcon}
                  size={25}
                  color={COLORS.white}
                  style={{
                    marginLeft: -20,
                    backgroundColor: COLORS.transparent,
                  }}
                />
              </Pressable>
            </View>
          </View>
          {error && (
            <Text
              style={{
                color: COLORS.purple,
                alignSelf: "stretch",
                fontSize: SIZES.body5,
                padding: SIZES.padding - 22,
                bottom: 5,
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
    borderColor: COLORS.transparent,
    borderWidth: 0,
    marginVertical: 8,
  },
  inputsPass: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    width: "100%",
  },
  inputContainer: {
    width: "100%",
    paddingTop: 0,
    paddingHorizontal: SIZES.padding - 11,
    flexDirection: "row",
    borderWidth: 0,
    marginTop: -5,
    marginBottom: -37,
  },
});

export default CustomInput;
