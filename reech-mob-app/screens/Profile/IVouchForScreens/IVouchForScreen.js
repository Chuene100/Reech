import React from "react";
import { StyleSheet, View, Text, Platform } from "react-native";

//import customs
import { COLORS } from "../../../constants";
import { IVouchForNavigation } from "../../../Navigations";
import NavHeader from "@/components/Headers/NavHeader";

const VouchedForScreen = () => {
  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.contentContainerIVouchForScreen}>
        <NavHeader message="What would you like to do?" />
        <View style={styles.content}>
          <Text style={styles.headingText}>I Vouch for</Text>
        </View>
      </View>
    );
  }

  function renderContentSection() {
    return (
      <View style={styles.contentListContainer}>
        <View style={styles.contentListItems}>
          <IVouchForNavigation />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeaderSection()}
      {renderContentSection()}
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
  contentContainerIVouchForScreen: {
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },
  content: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  headingText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //content list section
  contentListContainer: {
    flex: 1,
  },
  contentListItems: {
    flexDirection: "column",
    justifyContent: "flex-start",
    marginTop: Platform.OS === "ios" ? "14%" : "8%",
    margin: "5%",
  },
});

export default VouchedForScreen;
