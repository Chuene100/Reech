import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Switch } from "react-native-paper";
import { Controller } from "react-hook-form";

//import dependencies
import { COLORS, SIZES } from "../constants";

const CustomAccountToggler = ({
  control,
  name,
  rules = {},
  invalue,
  notify,
}) => {
  const [isEnabled, setIsEnabled] = useState(false);

  const onToggleSwitch = () => {
    const updatedValue = !isEnabled;
    setIsEnabled(updatedValue);
    notify({
      value: updatedValue,
    });
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <>
          <View
            style={[
              styles.container,
              { borderColor: error ? COLORS.purple : COLORS.gray },
            ]}
          >
            <Switch
              onBlur={onBlur}
              value={value}
              onValueChange={invalue === "opp" ? onToggleSwitch : onChange}
              trackColor={{
                false: COLORS.darkGray,
                true: COLORS.purple,
              }}
              thumbColor={
                invalue === "opp"
                  ? isEnabled
                    ? COLORS.white
                    : COLORS.purple
                  : isEnabled
                    ? COLORS.purple
                    : COLORS.white
              }
              ios_backgroundColor={{
                false: COLORS.transparent,
                true: COLORS.transparent,
              }}
              onChange={() => onChange(!isEnabled)}
              style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
            />
          </View>
          {error && (
            <Text
              style={{
                color: COLORS.purple,
                alignSelf: "stretch",
                fontSize: SIZES.body5,
                padding: SIZES.padding - 22,
                marginTop: 15,

                marginHorizontal: SIZES.padding * 3,
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

export default CustomAccountToggler;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
