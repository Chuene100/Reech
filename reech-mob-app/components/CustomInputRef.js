import React from "react";
import { View, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Controller } from "react-hook-form";

//import custom
import { COLORS } from "../constants";

const CustomInputRef = ({
  control,
  name,
  rules = {},
  placeholder,
  money,
  icon,
}) => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View>
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
            <View
              style={[
                styles.container,
                {
                  borderWidth: error ? 1 : 0,
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
                keyboardType={money ? "numeric" : "default"}
                placeholder={placeholder}
                placeholderTextColor={COLORS.white}
                style={styles.inputRef}
                icon={icon}
                enablesReturnKeyAutomatically
              />
            </View>
          )}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 50,
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    backgroundColor: COLORS.reechGray,
  },
  inputRef: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 14,
  },
});

export default CustomInputRef;
