import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Controller } from "react-hook-form";
import Slider from "@react-native-community/slider";

//import custom
import { COLORS, SIZES } from "../constants";

const CustomAgeSlider = ({ control, name, rules = {} }) => {
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
            maximumValue={80}
            minimumTrackTintColor={COLORS.reechGray}
            maximumTrackTintColor={COLORS.reechGray}
            tapToSeek={true}
            thumbTintColor={COLORS.teal}
            style={styles.sliderItem}
          />
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationTextItem}></Text>
            <Text style={styles.locationTextItem}>
              {value === 0
                ? "0 years"
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
                ? "10 years"
                : value === 11
                ? "11 years"
                : value === 12
                ? "12 years"
                : value === 13
                ? "13 years"
                : value === 14
                ? "14 years"
                : value === 15
                ? "15 years"
                : value === 16
                ? "16years"
                : value === 17
                ? "17 years"
                : value === 18
                ? "18 years"
                : value === 19
                ? "19 year"
                : value === 20
                ? "20 years"
                : value === 21
                ? "21 years"
                : value === 22
                ? "22 years"
                : value === 23
                ? "23 years"
                : value === 24
                ? "24 years"
                : value === 25
                ? "25 years"
                : value === 26
                ? "26 years"
                : value === 27
                ? "27 years"
                : value === 28
                ? "28 years"
                : value === 29
                ? "29 years"
                : value === 30
                ? "30 year"
                : value === 31
                ? "31 years"
                : value === 32
                ? "32 years"
                : value === 33
                ? "33 years"
                : value === 34
                ? "34 years"
                : value === 35
                ? "35 years"
                : value === 36
                ? "36 years"
                : value === 37
                ? "37 years"
                : value === 38
                ? "38 years"
                : value === 39
                ? "39 years"
                : value === 40
                ? "40 years"
                : value === 41
                ? "41 year"
                : value === 42
                ? "42 years"
                : value === 43
                ? "43 years"
                : value === 44
                ? "44 years"
                : value === 45
                ? "45 years"
                : value === 46
                ? "46 years"
                : value === 47
                ? "47 years"
                : value === 48
                ? "48 years"
                : value === 49
                ? "49 years"
                : value === 50
                ? "50 years"
                : value === 51
                ? "51 years"
                : value === 52
                ? "52 year"
                : value === 53
                ? "53 years"
                : value === 54
                ? "54 years"
                : value === 55
                ? "55 years"
                : value === 56
                ? "56 years"
                : value === 57
                ? "57 years"
                : value === 58
                ? "58 years"
                : value === 59
                ? "59 years"
                : value === 60
                ? "60 years"
                : value === 61
                ? "61 years"
                : value === 62
                ? "62 years"
                : value === 63
                ? "63 year"
                : value === 64
                ? "64 years"
                : value === 65
                ? "65 years"
                : value === 66
                ? "66 years"
                : value === 67
                ? "67 years"
                : value === 68
                ? "68 years"
                : value === 69
                ? "69 years"
                : value === 70
                ? "70 years"
                : value === 71
                ? "71 years"
                : value === 72
                ? "72 years"
                : value === 73
                ? "73 years"
                : value === 74
                ? "74 year"
                : value === 75
                ? "75 years"
                : value === 76
                ? "76 years"
                : value === 77
                ? "77 years"
                : value === 78
                ? "78 years"
                : value === 79
                ? "79 years"
                : value === 80
                ? "80 years"
                : null}
            </Text>
            <Text style={styles.locationTextItem}></Text>
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

export default CustomAgeSlider;
