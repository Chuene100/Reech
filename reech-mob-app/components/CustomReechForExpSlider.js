import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Controller } from "react-hook-form";
import Slider from "@react-native-community/slider";

//import custom
import { COLORS, SIZES } from "../constants";

const CustomReechForExpSlider = ({ control, name, rules = {} }) => {
  const [data, setSliderData] = useState(0);

  const sliderChange = (onChange) => {
    setSliderData(data);
    onChange;
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <>
          <Slider
            value={value}
            onValueChange={onChange}
            step={1}
            minimumValue={0}
            maximumValue={10}
            minimumTrackTintColor={COLORS.purpleDarker}
            maximumTrackTintColor={COLORS.purpleDarker}
            tapToSeek={true}
            thumbTintColor={COLORS.purple}
            style={styles.sliderItem}
          />
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationTextItem}>Not required</Text>
            <Text style={styles.locationTextItem}>
              {value === 0
                ? ""
                : value === 1
                  ? "1 year"
                  : value === 2
                    ? "2 years"
                    : value === 3
                      ? "3 years"
                      : value === 4
                        ? "4 years"
                        : value === 5
                          ? "5 years"
                          : value === 6
                            ? "6 years"
                            : value === 7
                              ? "7 years"
                              : value === 8
                                ? "8 years"
                                : value === 9
                                  ? "9 years"
                                  : value === 10
                                    ? ""
                                    : null}
            </Text>
            <Text style={styles.locationTextItem}>+10 years</Text>
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

export default CustomReechForExpSlider;
