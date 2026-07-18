import React from "react";
import { Dimensions, StyleSheet, View, Platform } from "react-native";

//customs
import { HowToComponent } from "../../components";
import { COLORS } from "../../constants";

const HowToTutorialsScreen = () => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  return (
    <View
      style={[
        { width: windowWidth, height: windowHeight },
        styles.screenContainer,
      ]}>
      {/*How to component*/}
      <HowToComponent />
    </View>
  );
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: COLORS.transparent,
    marginTop: Platform.OS === "ios" ? -40 : -40,
  },
  headerItem: {
    width: "90%",
    backgroundColor: COLORS.transparent,
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  navText: {
    alignSelf: "center",
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
    textDecorationLine: "underline",
  },
});

export default HowToTutorialsScreen;
