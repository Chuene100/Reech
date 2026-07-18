import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Controller } from "react-hook-form";
import Slider from "@react-native-community/slider";

//import custom
import { COLORS, SIZES } from "../constants";

const CustomReechForSlider = ({ control, name, rules = {} }) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value = 0, onChange }, fieldState: { error } }) => (
        <>
          <Slider
            value={value}
            onValueChange={onChange}
            step={1}
            minimumValue={0}
            maximumValue={30}
            minimumTrackTintColor={"#720e9e"}
            maximumTrackTintColor={"#4B0082"}
            tapToSeek={true}
            thumbTintColor={COLORS.purple}
            style={styles.sliderItem}
          />
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationTextItem}>0 km</Text>
            <Text style={styles.locationTextItem}>
              {value === 0 ? "" : value === 30 ? "" : value + " km"}
            </Text>
            <Text style={styles.locationTextItem}>30 km</Text>
          </View>
          {error && (
            <Text style={styles.errorText}>
              {error.message || "Oops, something went wrong!"}
            </Text>
          )}
        </>
      )}
    />
  );
};

const styles = StyleSheet.create({
  sliderItem: {
    width: "100%",
    height: 20,
  },
  locationTextContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  locationTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    marginBottom: 20,
  },
  errorText: {
    color: COLORS.purple,
    alignSelf: "stretch",
    fontSize: SIZES.body5,
    padding: SIZES.padding - 22,
    marginHorizontal: SIZES.padding,
    marginVertical: 0,
  },
});

export default CustomReechForSlider;
