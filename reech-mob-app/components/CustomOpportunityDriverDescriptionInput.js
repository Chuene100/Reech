import { View, StyleSheet, Text, TextInput, Platform } from "react-native";
import React from "react";
import { Controller } from "react-hook-form";

//import custom
import { COLORS, SIZES } from "../constants";

const CustomOpportunityDriverDescriptionInput = ({
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
                backgroundColor: COLORS.reechGray,
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
              placeholderTextColor={COLORS.darkGray}
              style={styles.inputOppDriver}
              secureTextEntry={secureTextEntry}
              icon={icon}
              enablesReturnKeyAutomatically
              multiline
            />
          </View>
          {error && (
            <Text
              style={{
                color: COLORS.purple,
                alignSelf: "stretch",
                fontSize: SIZES.body5,
                padding: SIZES.padding - 22,
                marginHorizontal: SIZES.padding,
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
    height: "100%",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 8,
  },
  inputOppDriver: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 15,
  },
});

export default CustomOpportunityDriverDescriptionInput;
