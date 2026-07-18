import React from "react";
import { StyleSheet, View, Text, Platform } from "react-native";

//import customs
import { COLORS } from "../../../constants";
import { VouchForNavigation } from "../../../Navigations";
import NavHeader from "@/components/Headers/NavHeader";

const VouchForBubbleMateScreen = () => {
  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.contentContainerBubbleMateVouch}>
        <NavHeader message="What would you like to do?" />

        <View style={styles.headingContainer}>
          <Text style={styles.headingText}>Vouch for</Text>
        </View>
      </View>
    );
  }

  function renderContentSection() {
    return (
      <View style={styles.contentListItems}>
        <VouchForNavigation />
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
  contentContainerBubbleMateVouch: {
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },
  headingContainer: {
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  headingText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //content list section
  contentListItems: {
    flexDirection: "column",
    justifyContent: "flex-start",
    marginTop: Platform.OS === "ios" ? "14%" : "8%",
  },
});

export default VouchForBubbleMateScreen;
