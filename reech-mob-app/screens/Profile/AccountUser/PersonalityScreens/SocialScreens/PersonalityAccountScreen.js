import React from "react";

//customs
import { COLORS, images } from "../../../../../constants";
import { SocialPersonalityNavigation } from "../../../../../Navigations";
import { Image, Platform, StyleSheet, Text, View } from "react-native";

//customs
import NavHeader from "@/components/Headers/NavHeader";

const PersonalityAccountScreen = () => {
  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerContentItem}>
          <NavHeader
            message="What would you like to do?"
          />
        </View>

        {/*background image*/}
        <View style={styles.bgImageContainer}>
          <Image source={{ uri: images.s0 }} style={styles.bgImageItem} />
          <View style={styles.bgTextContainer}>
            <Text style={styles.bgTextItem}>Social</Text>
          </View>
        </View>
      </View>
    );
  }

  //render navigation
  function renderNavigationSection() {
    return (
      <View style={styles.navigationContainer}>
        <SocialPersonalityNavigation />
      </View>
    );
  }

  //screen items
  function renderScreenItems() {
    return (
      <View style={styles.screenContentContainer}>
        {renderHeaderSection()}
        {renderNavigationSection()}
      </View>
    );
  }

  //screen content
  return <View style={styles.container}>{renderScreenItems()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //header
  headerContainer: {
    flexDirection: "column",
    height: 230,
  },
  headerContentItem: {
    zIndex: 99,
  },
  screenContentContainer: {
    top: Platform.OS === "ios" ? 45 : 0,
  },
  bgImageContainer: {
    bottom: 90,
  },
  bgImageItem: {
    width: "100%",
    height: 310,
    resizeMode: "cover",
  },
  bgTextContainer: {
    bottom: 35,
    marginHorizontal: 8,
  },
  bgTextItem: {
    bottom: 0,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //navigation section
  navigationContainer: {
    marginTop: Platform.OS === "ios" ? 85 : 45,
    flexDirection: "column",
    backgroundColor: COLORS.purple,
  },
});

export default PersonalityAccountScreen;
