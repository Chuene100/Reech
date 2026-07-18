import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, Platform } from "react-native";
import SelectList from "react-native-dropdown-select-list";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { Controller } from "react-hook-form";

//import custom
import { COLORS, images, SIZES } from "../../constants";

const CustomSearchInput = ({
  control,
  name,
  rules = {},
  placeholder,
  keyboardType = "default",
}) => {
  const navigation = useNavigation();

  const [selectedBubblePerson, setSelectedBubblePerson] = useState("");
  const bubblePeopleData = [
    {
      id: 1,
      value: "👤 Phillip Kau",
    },
    {
      id: 2,
      value: "👤 Andile Moekwena",
    },
    {
      id: 3,
      value: "👤 Puleng Tshabalala",
    },
    {
      id: 4,
      value: "👤 Samantha Smith",
    },
    {
      id: 5,
      value: "👤 Richardo Mudra",
    },
  ];

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
          <SafeAreaView
            style={[
              styles.container,
              {
                backgroundColor: COLORS.black,
                borderColor: error ? COLORS.purple : COLORS.darkGray,
              },
            ]}
          >
            <SelectList
              onSelect={() => [
                alert(selectedBubblePerson),
                navigation.navigate("BubbleMateProfileViewScreen"),
              ]}
              setSelected={setSelectedBubblePerson}
              data={bubblePeopleData}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              search={true}
              placeholder={placeholder}
              keyboardType={keyboardType}
              maxHeight={Platform.OS === "ios" ? 150 : 105}
              boxStyles={styles.boxStyles}
              inputStyles={styles.dropdownInput}
              dropdownStyles={styles.dropdownContainer}
              dropdownItemStyles={styles.dropdownItems}
              dropdownTextStyle={styles.dropdownText}
              arrowicon={
                <FontAwesome
                  name="chevron-down"
                  size={14}
                  color={COLORS.white}
                />
              }
              searchicon={
                <FontAwesome name="search" size={16} color={COLORS.white} />
              }
            />
          </SafeAreaView>
          {error && (
            <Text
              style={{
                color: COLORS.purple,
                alignSelf: "stretch",
                fontSize: SIZES.body5,
                padding: SIZES.padding - 22,
                marginHorizontal: SIZES.padding,
                marginVertical: 0,
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.black,
    width: "100%",
    height: 40,
    padding: 0,
  },
  boxStyles: {
    borderRadius: 10,
    borderWidth: 0,
    borderColor: COLORS.transparent,
    backgroundColor: COLORS.darkGray,
    marginRight: Platform.OS === "android" ? "5%" : "2%",
  },
  dropdownInput: {
    paddingLeft: "5%",
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 14,
  },
  dropdownContainer: {
    position: "relative",
    height: 200,
    padding: "2%",
    borderColor: COLORS.transparent,
    backgroundColor: COLORS.darkGray,
    marginRight: Platform.OS === "android" ? "5%" : "2%",
  },
  dropdownItems: {
    paddingLeft: "5%",
    borderBottomColor: COLORS.white,
    borderBottomWidth: 1,
  },
  dropdownText: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 20,
  },
});

export default CustomSearchInput;
