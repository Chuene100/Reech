import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { GroupDropdown } from "sharingan-rn-modal-dropdown";
import { Controller } from "react-hook-form";
import DropDownPicker from "react-native-dropdown-picker";
import Icon from "@mdi/react";
import { mdiImageSearch } from "@mdi/js";

//import dependencies
import { reechImageLibrary } from "../../../assets/data/reechInfoData";
import { COLORS, SIZES } from "../../../constants";

const ReechingForImageDD = ({ control, name, rules = {} }) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({
        field: { value = values, onChange, onBlur },
        fieldState: { error },
      }) => (
        <>
          <View
            style={[
              styles.container,
              { borderColor: error ? COLORS.purple : COLORS.gray },
            ]}
          >
            <View style={styles.dropDown}>
              <GroupDropdown
                label=""
                removeLabel
                data={reechImageLibrary}
                enableSearch={true}
                enableAvatar
                avatarSize={35}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                borderRadius={25}
                primaryColor={COLORS.white}
                disableSelectionTick
                underlineColor={COLORS.transparent}
                headerTextStyle={{
                  paddingVertical: 10,
                  backgroundColor: COLORS.transparent,
                }}
                itemSelectIcon={<Icon path={mdiImageSearch} size={1} />}
                dropdownIcon={<Icon path={mdiImageSearch} size={5} />}
                dropdownIconSize={20}
                itemSelectIconSize={20}
                activityIndicatorColor={COLORS.purple}
                mainContainerStyle={styles.mainContainerStyle}
                selectedItemViewStyle={styles.selectedItemViewStyle}
                selectedItemTextStyle={styles.selectedItemTextStyle}
                textInputPlaceholderColor={COLORS.white}
                textInputStyle={styles.textInputStyle}
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
                marginTop: -8,
                marginBottom: 8,
                right: 10,
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

export default ReechingForImageDD;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  mainContainerStyle: {
    backgroundColor: "#720e9e",
    borderRadius: 20,
  },
  selectedItemViewStyle: {
    backgroundColor: "#720e9e",
  },
  selectedItemTextStyle: {
    fontWeight: "bold",
  },
  textInputStyle: {
    backgroundColor: COLORS.transparent,
    borderRadius: 0,
  },
});
