import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput, Pressable } from "react-native";
import { Controller } from "react-hook-form";
import { Feather } from "@expo/vector-icons";

//import custom
import { COLORS, SIZES } from "../../../constants";

const CustomInputPasswordSignIn = ({
  control,
  name,
  invalue,
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
        field: { value = invalue, onChange, onBlur },
        fieldState: { error },
      }) => (
        <>
          <View
            style={[
              styles.container,
              {
                borderBottomWidth: error ? 1 : 1,
                borderBottomColor: error ? COLORS.purple : COLORS.darkGray,
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
                style={styles.inputsPassword}
                secureTextEntry={passwordVisibility}
                icon={icon}
                enablesReturnKeyAutomatically
              />

              <Pressable
                onPress={handlePasswordVisibility}
                style={{ backgroundColor: COLORS.black }}
              >
                <Feather
                  name={rightIcon}
                  size={20}
                  color={COLORS.white}
                  style={{ marginLeft: -20 }}
                />
              </Pressable>
            </View>
          </View>
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
    marginVertical: 8,
    backgroundColor: COLORS.black,
  },
  inputsPassword: {
    fontSize: 12,
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

export default CustomInputPasswordSignIn;
