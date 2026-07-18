import { Pressable, Text, StyleSheet, ActivityIndicator, View, Platform } from "react-native";
import React from "react";
import { COLORS } from "../../constants";

const CustomButton = ({
  onPress,
  text,
  type = "PRIMARY",
  bgColor,
  fgColor,
  icon,
  isLoading = false,
  from,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        styles[`container_${type}`],
        bgColor ? { backgroundColor: bgColor } : {},
      ]}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator
          size={16}
          color={from === "default" ? "#fff" : "#9e69c9"}
        />
      ) : (
        <View style={{ flexDirection: "row" }}>
          <Text style={{ top: Platform.OS === "ios" ? 5 : 3 }}>{icon}</Text>
          <Text
            style={[
              styles.text,
              styles[`text_${type}`],
              fgColor ? { color: fgColor } : {},
            ]}
          >
            {text}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 50,
    padding: 5,
    marginVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    borderRadius: 30,
    zIndex: 30
  },
  container_GENERAL: {
    backgroundColor: COLORS.darkGray,
  },
  container_ACTIVE: {
    backgroundColor: "transparent",
    borderColor: COLORS.transparent,
    borderWidth: 2,
    borderRadius: 30,
  },
  container_PRIMARY: {
    backgroundColor: COLORS.purple,
  },
  container_SECONDARY: {
    backgroundColor: COLORS.purple,
  },
  container_WHITE: {
    width: "100%",
    backgroundColor: COLORS.white,
  },
  container_WELCOME: {
    width: "100%",
    backgroundColor: `rgba(232, 236, 241, 0.3)`,
    borderRadius: 28,
    // borderWidth: 1.2,
    borderColor: COLORS.white,
  },
  container_TERTIARY: {},
  container_TRANSACTION: {
    backgroundColor: COLORS.transparent,
    borderColor: COLORS.darkGray,
    borderWidth: 2,
    borderRadius: 30,
  },

  container_BUBBLE: {
    backgroundColor: "transparent",
    borderColor: COLORS.transparent,
    borderWidth: 2,
    borderRadius: 30,
  },
  container_REQUEST: {
    backgroundColor: "transparent",
    borderColor: COLORS.transparent,
    borderWidth: 2,
    borderRadius: 30,
  },
  container_MATE: {
    backgroundColor: "transparent",
    borderColor: COLORS.transparent,
    borderWidth: 2,
    borderRadius: 30,
  },
  container_YES: {
    backgroundColor: COLORS.purple,
    borderColor: COLORS.purple,
    borderWidth: 0,
    borderRadius: 30,
    height: 40,
  },

  container_NO: {
    backgroundColor: COLORS.darkGray,
    borderColor: COLORS.darkGray,
    borderWidth: 0,
    borderRadius: 30,
    height: 40,
  },

  container_TRANSPARENT: {
    backgroundColor: "transparent",
    borderColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 30,
  },

  container_RESEND: {
    alignItems: "flex-start",
    marginVertical: -4,
  },
  container_DANGER: {
    backgroundColor: COLORS.purple,
    borderColor: COLORS.white,
    borderWidth: 2,
  },
  container_ACCOUNT: {
    backgroundColor: COLORS.transparent,
    borderColor: COLORS.purple,
    borderWidth: 2,
  },
  container_ACCOUNTBUBBLE: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.transparent,
    borderColor: COLORS.darkGray,
    borderWidth: 2,
    borderRadius: 30,
  },
  text: {
    fontSize: 14,
    fontFamily: "PoppinsBold",
    color: COLORS.white,
  },
  text_BUBBLE: {
    color: COLORS.purple,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  text_ACTIVE: {
    color: COLORS.greenActive,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  text_REQUEST: {
    color: COLORS.orange,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  text_MATE: {
    color: COLORS.darkGray,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  text_TERTIARY: {
    color: COLORS.lightBlue,
  },
  text_RESEND: {
    color: COLORS.lightBlue,
    fontSize: 14,
  },
  text_GENERAL: {
    fontFamily: "PoppinsBold",
    fontSize: 14,
  },
  text_DANGER: {
    color: COLORS.white,
    fontFamily: "PoppinsBold",
    fontSize: 14,
  },
  text_WHITE: {
    color: COLORS.purple,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  text_WELCOME: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: "PoppinsLight"
  },
  text_TRANSACTION: {
    color: COLORS.darkGray,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  text_ACCOUNT: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
});

export default CustomButton;
