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
import { COLORS, SIZES } from "../../constants";

const CustomDatePicker = ({ control, name, rules = {}, placeholder }) => {
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
    setShow(event.type !== "set");
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
              {/*inputTextDate container section*/}

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.inputTextDate}
                  editable={false}
                  onChangeText={onChange}
                  value={
                    value instanceof Date
                      ? moment(value).format("YYYY-MM-DD")
                      : "Date of birth"
                  }
                  placeholder="Date of birth"
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
    backgroundColor: COLORS.black,
    width: "100%",
    height: 40,
    padding: 10,
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: 1,
    marginVertical: 8,
  },
  inputTextDate: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    width: "100%",
  },
  inputContainer: {
    width: "100%",
    paddingTop: 0,
    paddingHorizontal: SIZES.padding - 11,
    flexDirection: "row",
    borderWidth: 1,
    marginTop: -5,
    marginBottom: -37,
  },
  pressable: {
    backgroundColor: COLORS.black,
  },
  icon: {
    marginLeft: -20,
  },
});

export default CustomDatePicker;
