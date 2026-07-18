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
import { COLORS } from "../constants";

const CustomDatePickerVouch = ({ control, name, rules = {}, }) => {
  
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
        field: { onChange, value },
        fieldState: { error },
      }) => {
        return (
          <>
            <View
              style={[
                styles.container,
                { borderColor: error ? COLORS.purple : COLORS.reechGray },
              ]}
            >
              {/*inputDate container section*/}

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.inputDate}
                  editable={false}
                  onChangeText={onChange}
                  value={
                    value instanceof Date
                      ? moment(value).format("YYYY-MM-DD")
                      : "Year/Month/Day"
                  }
                  placeholder="Year/Month/Day"
                  placeholderTextColor={COLORS.darkGray}
                />

                {Platform.OS === "ios" && (
                  <Pressable onPress={showDatePicker}>
                    <FontAwesome
                      name={value ? "calendar" : "chevron-down"}
                      size={16}
                      color={COLORS.darkGray}
                      style={{ right: Platform.OS === "ios" ? 4 : 0 }}
                    />
                  </Pressable>
                )}
                {Platform.OS === "android" && (
                  <Pressable onPress={showAndroidDatePicker}>
                    <FontAwesome
                      name={value ? "calendar" : "chevron-down"}
                      size={16}
                      color={COLORS.darkGray}
                      style={{ right: Platform.OS === "ios" ? 4 : 0 }}
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
              <Text style={styles.errorMessageItem}>
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
    width: "100%",
  },
  inputDate: {
    fontSize: 12,
    fontFamily: "PoppinsLight",
    color: COLORS.white,
  },
  inputContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: COLORS.reechGray,
  },
  errorMessageItem: {
    color: COLORS.purple,
    fontSize: 12,
    paddingVertical: 2,
    paddingHorizontal: 15,
  },
});

export default CustomDatePickerVouch;
