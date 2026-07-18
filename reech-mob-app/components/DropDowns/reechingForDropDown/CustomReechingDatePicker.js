import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
} from "react-native";
import { Controller } from "react-hook-form";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

//import dependencies
import { COLORS, SIZES } from "../../../constants";

const CustomReechingDatePicker = ({
  control,
  name,
  rules = {},
  placeholder = "Date of birth",
}) => {
  const [selectedDate, setSelectedDate] = useState();
  const [datePickerVisible, setDatePickerVisibility] = useState(false);

  //android dateTimePicker
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  //show date picker: ios
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  //hide date picker: ios
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  //handle date picker: ios
  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  //handle onChange: android
  const onChangeA = (event, selectedAndroidDate) => {
    const currentDate = selectedAndroidDate;
    setShow(true);
    setDate(currentDate);
    console.log(currentDate);
  };

  const showMode = (currentMode) => {
    if (Platform.OS === "android") {
      setShow(true);
    }
    setMode(currentMode);
  };

  const showAndroidDatePicker = () => {
    showMode("date");
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => {
        return (
          <>
            <View
              style={[
                styles.container,
                { borderColor: error ? COLORS.purple : COLORS.gray },
              ]}
            >
              {/*inputsReeching container section*/}

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.inputsReeching}
                  editable={false}
                  onChangeText={onChange}
                  value={
                    value instanceof Date
                      ? moment(value).format("YYYY-MM-DD")
                      : placeholder
                  }
                  placeholder={placeholder}
                  placeholderTextColor={COLORS.darkGray}
                />

                {Platform.OS === "ios" && (
                  <Pressable onPress={showDatePicker}>
                    <FontAwesome
                      name="calendar"
                      size={25}
                      color={COLORS.white}
                      style={[styles.icon, styles.pressable]}
                    />
                  </Pressable>
                )}
                {Platform.OS === "android" && (
                  <Pressable onPress={showAndroidDatePicker}>
                    <FontAwesome
                      name="calendar"
                      size={25}
                      color={COLORS.white}
                      style={[styles.icon, styles.pressable]}
                    />
                  </Pressable>
                )}

                {/*show date picker*/}
                {Platform.OS === "ios" && (
                  <DateTimePickerModal
                    minimumDate={new Date("1950-01-01")}
                    maximumDate={new Date("2250-12-31")}
                    isVisible={datePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                    onChange={(selectedIOSDate) => {
                      onChange(selectedIOSDate);
                    }}
                  />
                )}

                {Platform.OS !== "ios" && show && (
                  <DateTimePicker
                    key={value}
                    value={value instanceof Date ? value : new Date()}
                    mode={mode}
                    onChange={(e, selectedAndroidDate) => {
                      setShow(e.type !== "set");
                      onChange(selectedAndroidDate);
                    }}
                    minimumDate={new Date("1950-01-01")}
                    maximumDate={new Date("2250-12-31")}
                    positiveButtonLabel="OK!"
                    neutralButtonLabel="clear"
                  />
                )}
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
                  paddingBottom: 10,
                }}
              >
                {error.message || "Oops, something went wrong!"}
              </Text>
            )}
          </>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.purple,
    width: "100%",
    height: 50,
    padding: 10,
    marginVertical: 8,
    borderRadius: 5,
  },
  inputsReeching: {
    left: 125,
    fontSize: 16,
    fontFamily: "PoppinsBold",
    color: COLORS.white,
    width: "100%",
  },
  inputContainer: {
    width: "100%",
    paddingTop: 0,
    paddingHorizontal: SIZES.padding - 11,
    flexDirection: "row",
    marginTop: 0,
    marginBottom: -37,
  },
  pressable: {
    backgroundColor: COLORS.transparent,
  },
  icon: {
    marginLeft: -20,
  },
});

export default CustomReechingDatePicker;
