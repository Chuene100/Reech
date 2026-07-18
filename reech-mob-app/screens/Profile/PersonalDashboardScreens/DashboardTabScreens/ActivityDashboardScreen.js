import React from "react";
import { Image, StyleSheet, View, Text, Platform } from "react-native";

//import customs
import { COLORS, images } from "../../../../constants";
import { CustomPersonalDBHeader } from "../../../../components";
import NavHeader from "@/components/Headers/NavHeader";

const ActivityDashboardScreen = () => {
  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <NavHeader message="What would you like to do?" />
      </View>
    );
  }

  //profile with move count
  function renderMiddleSection() {
    return (
      <View style={styles.middleSectionContainer}>
        <View style={styles.middleSectionContent}>
          {/*profile section*/}
          <CustomPersonalDBHeader />

          {/*info section*/}
          <View style={styles.infoContainer}>
            <View style={styles.textInfoContainer}>
              <Text style={styles.textInfoItem}>
                More activity coming soon!
              </Text>
            </View>

            <Image
              source={images.reechieGeneral}
              style={styles.infoImageItem}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeaderSection()}
      {renderMiddleSection()}
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
  headerContainer: {
    zIndex: 9,
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },

  //middle screen section
  middleSectionContainer: {
    flex: 1,
  },
  middleSectionContent: {
    paddingHorizontal: 25,
    flexDirection: "column",
  },

  //info section
  infoContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  textInfoContainer: {
    marginTop: Platform.OS === "ios" ? 130 : 80,
  },
  textInfoItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  infoImageItem: {
    top: 20,
    width: 300,
    height: 300,
    resizeMode: "cover",
  },
});

export default ActivityDashboardScreen;
