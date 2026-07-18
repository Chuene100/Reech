import React from "react";
import { StyleSheet, View, Text } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { Controller } from "react-hook-form";
import { FontAwesome } from "@expo/vector-icons";

//import dependencies
import { COLORS, SIZES } from "../../constants";

const CustomDropDown = ({ control, name, rules = {}, invalue }) => {
  const empStatus = ["unemployed", "employed", "student"];

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { data, value, onChange }, fieldState: { error } }) => (
        <>
          <View
            style={[
              styles.container,
              { borderColor: error ? COLORS.purple : COLORS.gray },
            ]}
          >
            <View style={styles.dropDown}>
              <SelectDropdown
                data={empStatus}
                value={value}
                onChangeText={onChange}
                onSelect={(selectedItem, index) => {
                  onChange(selectedItem);
                }}
                defaultButtonText={invalue ?? "Employment status"}
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
                      color={COLORS.white}
                      size={18}
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

export default CustomDropDown;

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
    backgroundColor: COLORS.black,
    borderBottomWidth: 1,
    borderColor: COLORS.darkGray,
  },
  dropdown1BtnTxtStyle: {
    color: COLORS.white,
    textAlign: "left",
    fontSize: 14,
    marginLeft: 3,
    textTransform: "capitalize",
  },
  dropdown1DropdownStyle: {
    backgroundColor: "#EFEFEF",
  },
  dropdown1RowStyle: {
    backgroundColor: COLORS.black,
    borderBottomColor: COLORS.darkGray,
  },
  dropdown1RowTxtStyle: {
    color: COLORS.white,
    textAlign: "left",
    paddingLeft: 5,
    fontSize: 14,
    marginLeft: 8,
    textTransform: "capitalize",
  },
});
