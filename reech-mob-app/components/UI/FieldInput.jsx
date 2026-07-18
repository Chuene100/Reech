import { View, Text, TextInput, Platform } from "react-native";
import React from "react";
import { Controller } from "react-hook-form";

//import custom
import { COLORS, SIZES } from "../../../constants";

const FieldInput = ({
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
            className={`bg-black w-full h-[40] p-[10] border-b border-b-darkGray my-[8]`}
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
              className={`font-normal text-white text-[15px]`}
              secureTextEntry={secureTextEntry}
              icon={icon}
              enablesReturnKeyAutomatically
            />
          </View>
          {error && (
            <Text
                className={`text-purple self-stretch text-[${SIZES.body5}px] p-[${SIZES.padding-22} mx-[${SIZES.padding} my-0]]`}
            >
              {error.message || "Oops, something went wrong!"}
            </Text>
          )}
        </>
      )}
    />
  );
};

export default FieldInput;
