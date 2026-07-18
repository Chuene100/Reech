import React from "react";
import { StyleSheet, View, Text } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { Controller } from "react-hook-form";
import { FontAwesome } from "@expo/vector-icons";

//import dependencies
import { COLORS, SIZES } from "../../constants";

const CustomDropDownExperienceBubble = ({
  control,
  name,
  rules = {},
  placeholder,
}) => {
  const jobIndustry = [
    "What qualifies me",
    "What I'm working on",
    "Where I've worked",
    "Beyond work",
    "My Community Engagements",
    "Events & Conferences",
    "How To",
    "Thought",
    "My bloopers",
  ];

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      placeholder={placeholder}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <View
            style={[
              styles.container,
              { borderColor: error ? COLORS.purple : COLORS.gray },
            ]}
          >
            <View style={styles.dropDown}>
              <SelectDropdown
                data={jobIndustry}
                value={value}
                onChangeText={onChange}
                onSelect={(selectedItem, index) => {
                  onChange(selectedItem);
                }}
                defaultButtonText={placeholder}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
                buttonStyle={styles.dropdown1BtnStyle}
                buttonTextStyle={styles.dropdown1BtnTxtStyle}
                renderDropdownIcon={(isOpened) => {
                  return (
                    <FontAwesome
                      name={isOpened ? "chevron-up" : "chevron-down"}
                      color={COLORS.darkGray}
                      size={16}
                      style={{ left: 5 }}
                    />
                  );
                }}
                dropdownIconPosition={"right"}
                dropdownStyle={styles.dropdown1DropdownStyle}
                rowStyle={styles.dropdown1RowStyle}
                rowTextStyle={styles.dropdown1RowTxtStyle}
              />
            </View>
          </View>
          {error && (
            <Text
              style={{
                color: COLORS.purple,
                alignSelf: "stretch",
                fontSize: SIZES.body5,
                padding: SIZES.padding - 22,
                marginHorizontal: SIZES.padding,
                left: 7,
                bottom: 10,
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

export default CustomDropDownExperienceBubble;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: SIZES.padding,
  },
  dropDown: {
    width: "100%",
  },
  dropdown1BtnStyle: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.transparent,
    borderRadius: 10,
  },
  dropdown1BtnTxtStyle: {
    color: COLORS.white,
    justifyContent: "flex-start",
    textAlign: "left",
    fontSize: 14,
    fontWeight: "400",
  },
  dropdown1DropdownStyle: {
    backgroundColor: COLORS.darkGray,
  },
  dropdown1RowStyle: {
    backgroundColor: COLORS.black,
  },
  dropdown1RowTxtStyle: {
    fontSize: 14,
    color: COLORS.white,
    textAlign: "left",
    paddingLeft: 10,
  },
});
