import React from "react";

import { View, Text, StyleSheet } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { Controller } from "react-hook-form";
import { FontAwesome } from "@expo/vector-icons";

//import dependencies
import { COLORS } from "../../constants";

const DropDown = ({
  data,
  control,
  name,
  placeholder,
  rules = {},
  notifyChange,
  minimal,
  noBgColor,
  rowText,
  textAlign,
  iconColor,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      placeholder={placeholder}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <>
          <View
            className={`w-full py-4} 
                ${error ? "border-b border-purple" : "border-gray"}
            `}
          >
            <View className="w-full">
              <SelectDropdown
                data={data}
                value={value}
                onChangeText={onChange}
                onSelect={(selectedItem) => {
                  onChange(selectedItem);
                  notifyChange && notifyChange({ value: selectedItem });
                }}
                defaultButtonText={placeholder}
                buttonTextAfterSelection={(selectedItem) => {
                  return rowText
                    ? selectedItem[rowText]
                    : selectedItem.split("|")[0];
                }}
                rowTextForSelection={(item) => {
                  return rowText ? item[rowText] : item.split("|")[0];
                }}
                buttonStyle={
                  !minimal
                    ? styles.dropdownStandard
                    : noBgColor
                      ? styles.dropdownNoBg
                      : styles.dropdownMinimal
                }
                buttonTextStyle={
                  !minimal
                    ? textStyle(textAlign).textStandard
                    : textStyle(textAlign).textMinimal
                }
                renderDropdownIcon={(isOpened) => {
                  return (
                    <FontAwesome
                      name={isOpened ? "chevron-up" : "chevron-down"}
                      color={iconColor ? COLORS[iconColor] : COLORS.darkGray}
                      size={18}
                      style={{ left: 10 }}
                    />
                  );
                }}
                dropdownIconPosition={"right"}
                dropdownStyle={styles.dropdown1DropdownStyle}
                rowStyle={!minimal ? styles.rowStandard : styles.rowMinimal}
                rowTextStyle={
                  !minimal ? styles.rowTxtStandard : styles.rowTxtMinimal
                }
              />
            </View>
          </View>
        </>
      )}
    />
  );
};

const styles = StyleSheet.create({
  dropdownStandard: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.reechGray,
    borderRadius: 35,
  },
  dropdownMinimal: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.black,
    borderRadius: 0,
    borderWidth: 1,
    borderBottomColor: COLORS.darkGray,
  },
  dropdownNoBg: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.transparent,
    borderRadius: 35,
  },
  dropdown1DropdownStyle: {
    backgroundColor: COLORS.reechGray,
  },
  rowStandard: {
    backgroundColor: COLORS.black,
    borderBottomColor: COLORS.reechGray,
  },
  rowMinimal: {
    backgroundColor: COLORS.black,
    borderBottomColor: COLORS.darkGray,
  },
  rowTxtStandard: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    textAlign: "left",
    paddingLeft: 10,
  },
  rowTxtMinimal: {
    color: COLORS.white,
    fontSize: 12,
    textAlign: "left",
    paddingLeft: 10,
    fontFamily: "PoppinsLight",
  },
});

const textStyle = (textAlign) =>
  StyleSheet.create({
    textStandard: {
      color: COLORS.white,
      justifyContent: "center",
      textAlign: textAlign ? textAlign : "left",
      fontSize: 12,
      paddingLeft: 5,
      fontFamily: "PoppinsLight",
    },
    textMinimal: {
      color: COLORS.white,
      fontSize: 12,
      textAlign: textAlign ? textAlign : "left",
      marginLeft: 0,
      fontFamily: "PoppinsLight",
    },
  });

export default DropDown;
