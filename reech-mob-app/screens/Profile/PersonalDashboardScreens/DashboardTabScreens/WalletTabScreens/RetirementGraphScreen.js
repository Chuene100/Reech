import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "../../../../../constants";

const RetirementGraphScreen = () => {
  return (
    <View style={styles.incomingContainer}>
      <Text style={styles.incomingHeader}>Total Retirement Funds</Text>
    </View>
  );
};

export default RetirementGraphScreen;

const styles = StyleSheet.create({
  incomingContainer: {
    left: 60,
    top: 10,
    width: "78%",
    height: "82%",
    padding: 20,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: COLORS.darkGray,
  },
  incomingHeader: {
    top: 5,
    alignSelf: "center",
    color: COLORS.darkGray,
    fontSize: 18,
    fontFamily: "PoppinsBold",
  },
});
