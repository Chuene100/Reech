import { View, StyleSheet, Text, TextInput, Platform } from "react-native";
import React from "react";
import { Controller } from "react-hook-form";

//import custom
import { COLORS, SIZES } from "../constants";

const CustomOpportunityInput = ({
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
              {
                borderColor: error ? COLORS.purple : COLORS.darkGray,
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
              style={styles.inputOppCustom}
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
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 8,
    backgroundColor: COLORS.reechGray,
  },
  inputOppCustom: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 12,
  },
});

export default CustomOpportunityInput;
