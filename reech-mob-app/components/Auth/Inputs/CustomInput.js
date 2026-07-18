import React from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { Controller } from "react-hook-form";

//import custom
import { COLORS } from "../../../constants";

const CustomInput = ({
  control,
  name,
  invalue,
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
        field: { value = invalue, onChange, onBlur },
        fieldState: { error },
      }) => (
        <>
          <View
            style={[
              styles.container,
              { borderBottomColor: error ? COLORS.purple : COLORS.darkGray },
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
              style={styles.inputs}
              secureTextEntry={secureTextEntry}
              icon={icon}
              enablesReturnKeyAutomatically
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
    height: 40,
    padding: 10,
    borderBottomWidth: 1,
    marginVertical: 8,
    backgroundColor: COLORS.black,
  },
  inputs: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
});

export default CustomInput;
