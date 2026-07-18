import { View, StyleSheet, TextInput, Platform } from "react-native";
import React from "react";
import { Controller } from "react-hook-form";

//import custom
import { COLORS } from "../../constants";

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
                borderBottomColor: error ? COLORS.purple : COLORS.darkGray,
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
              style={styles.inputsArea}
              icon={icon}
              enablesReturnKeyAutomatically
              numberOfLines={50}
              multiline
            />
          </View>
        </>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: Platform.OS === "ios" ? 145 : 100,
    padding: 10,
    borderBottomWidth: 1,
    marginVertical: 8,
    backgroundColor: COLORS.black,
  },
  inputsArea: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 12,
  },
});

export default CustomInputTextArea;
