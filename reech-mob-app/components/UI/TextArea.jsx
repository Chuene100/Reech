import { View, TextInput, Platform } from "react-native";
import React from "react";
import { Controller } from "react-hook-form";

//import custom
import { COLORS } from "../../constants";
import ErrorMessage from "./ErrorMessage";

const TextArea = ({
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
            className={`bg-black w-full h-[${Platform.OS === 'ios' ? 145 : 100}] p-[10] border-b border-b-darkGray my-[8] ${error ? "border-purple" : "border-darkGray"}`}
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
              icon={icon}
              enablesReturnKeyAutomatically
              numberOfLines={50}
              multiline
            />
          </View>
          {error && (
            <ErrorMessage error={error} />
          )}
        </>
      )}
    />
  );
};

export default TextArea;
