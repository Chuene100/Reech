import React, { useState } from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import { Controller } from "react-hook-form";
import CalendarPicker from "react-native-calendar-picker";
import moment from "moment";

//import custom
import { COLORS } from "../constants";

const CustomCalendarRangerPicker = ({
  control,
  name,
  rules = {},
  duration,
  noDate,
}) => {
  const [selectedStartDate, setSelectedStartDate] = useState(
    duration?.selectedStartDate ?? null
  );
  const [selectedEndDate, setSelectedEndDate] = useState(
    duration?.selectedEndDate ?? null
  );

  const onDateChange = (date, type, { onChange }) => {
    if (type === "END_DATE") {
      setSelectedEndDate(date);
    } else {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    }
    const updatedDates = {
      selectedStartDate: type === "END_DATE" ? selectedStartDate : date,
      selectedEndDate: type === "END_DATE" ? date : selectedEndDate,
    };
    onChange(updatedDates);
  };

  const startDate = new Date(Date.now());
  const endDate = new Date(2050, 6, 3);
  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange }, fieldState: { error } }) => (
        <>
          <View
            style={[
              styles.container,
              {
                borderColor: error ? COLORS.purple : COLORS.darkGray,
              },
            ]}
          >
            <CalendarPicker
              value={{ selectedStartDate, selectedEndDate }}
              onDateChange={(date, type) => {
                onDateChange(date, type, { onChange });
              }}
              width={Platform.OS === "ios" ? 360 : 320}
              allowRangeSelection={true}
              minDate={startDate}
              maxDate={endDate}
              weekdays={weekdays}
              months={months}
              previousTitle="<"
              previousTitleStyle={styles.previousTitleText}
              nextTitle=">"
              nextTitleStyle={styles.nextTitleText}
              todayBackgroundColor={COLORS.transparent}
              todayTextStyle={styles.todayTextItem}
              selectedDayColor={COLORS.purpleDark}
              selectedDayTextColor={COLORS.white}
              scaleFactor={375}
              textStyle={styles.calendarTextItem}
              selectedRangeStartStyle={styles.calendarRangePickerItem}
              selectedRangeEndStyle={styles.calendarRangePickerItem}
              selectedRangeStyle={styles.calendarRangeContainer}
            />
            {noDate ? null : <View style={styles.calendarRangeResultContainer}>
              <Text style={styles.calendarTextDateResultItem}>
                Start:{" "}
                {selectedStartDate
                  ? `${moment(selectedStartDate).format("ll")}`
                  : "No date"}
              </Text>
              <Text style={styles.calendarTextDateResultItem}>
                End:{" "}
                {selectedEndDate
                  ? `${moment(selectedEndDate).format("ll")}`
                  : "No date"}
              </Text>
            </View>}
          </View>
        </>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 20,
    backgroundColor: COLORS.transparent,
  },
  previousTitleText: {
    color: COLORS.purple,
    fontSize: 16,
    left: Platform.OS === "ios" ? 0 : 10,
  },
  nextTitleText: {
    color: COLORS.purple,
    fontSize: 16,
    right: Platform.OS === "ios" ? 0 : 10,
  },
  todayTextItem: {
    color: COLORS.purple,
  },
  calendarTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  calendarRangeResultContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
    paddingHorizontal: Platform.OS === "ios" ? 40 : 20,
  },
  calendarTextDateResultItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsRegular",
  },
  calendarRangePickerItem: {
    backgroundColor: COLORS.purpleDark,
    borderRadius: Platform.OS === "ios" ? 20 : 18,
    width: Platform.OS === "ios" ? 27 : 22,
    height: Platform.OS === "ios" ? 27 : 22,
  },
  calendarRangeContainer: {
    width: "148%",
    borderRadius: Platform.OS === "ios" ? 20 : 18,
    backgroundColor: COLORS.purpleDarker,
  },
});

export default CustomCalendarRangerPicker;
