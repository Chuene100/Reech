import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Switch } from "react-native-paper";
import { Controller } from "react-hook-form";

//import dependencies
import { COLORS } from "../constants";

const CustomItemToggler = ({ control, name, rules = {}, invalue, notify }) => {
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
              onChange={() => onChange(!isEnabled)}
              onValueChange={
                invalue === "useMyLocation" || invalue === "notifications" || invalue === "useMyPreferenceLocation"
                  ? onToggleSwitch
                  : onChange
              }
              trackColor={{ false: COLORS.white, true: COLORS.teal }}
              ios_backgroundColor={COLORS.reechGray}
              thumbColor={
                invalue === "useMyLocation" || invalue === "notifications" || invalue === "useMyPreferenceLocation"
                  ? isEnabled ? COLORS.white : COLORS.teal
                  : !isEnabled ? COLORS.teal : COLORS.white
              }
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
          </View>
        </>
      )}
    />
  );
};

export default CustomItemToggler;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
