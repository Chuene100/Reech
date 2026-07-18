import React, { useState } from "react";
import {
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

const DatePicker = ({ control, name, rules = {}, placeholder }) => {
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
                className={`bg-black w-full h-[40] p-[10] border-b border-b-darkGray my-[8]
                    ${error ? "border-b-purple" : "border-b-gray"}
                `}
            >
              {/*inputTextDate container section*/}

              <View className="font-normal color-white w-full">
                <TextInput
                  className={`w-full pt-0 px-${SIZES.padding - 11} flex flex-row border mt-[-5] mb-[-37]`}
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
                      className="ml-[20] bg-black"
                    />
                  </Pressable>
                )}
                {Platform.OS === "android" && (
                  <Pressable onPress={showAndroidDatePicker}>
                    <FontAwesome
                      name="calendar"
                      size={25}
                      color={COLORS.white}
                      className="ml-[20] bg-black"
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
                className={`text-purple self-stretch font-[${SIZES.body5}] p-[${SIZES.padding - 22}] mx-[${SIZES.padding}] pb-[10]`}
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

export default DatePicker;
