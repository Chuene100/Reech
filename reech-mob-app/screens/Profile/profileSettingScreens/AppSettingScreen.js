import React from "react";
import { StyleSheet, View, Text, Platform } from "react-native";

//import customs
import { COLORS } from "../../../constants";
import { ComingSoonInAppScreen } from "../../../components";
import NavHeader from "@/components/Headers/NavHeader";

const AppSettingScreen = () => {
  //header section
  function renderHeaderComponent() {
    return (
      <View style={styles.headerComponentContainer}>
        <NavHeader message="What would you like to do?" />
      </View>
    );
  }

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.content}>
        <Text style={styles.headingText}>App Settings</Text>
      </View>
    );
  }

  function renderComingSoon() {
    return (
      <View style={styles.comingSoon}>
        <ComingSoonInAppScreen />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeaderComponent()}
      {renderHeaderSection()}
      {renderComingSoon()}
    </View>
  );
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerComponentContainer: {
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },

  //header text
  content: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  headingText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  comingSoon: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AppSettingScreen;
