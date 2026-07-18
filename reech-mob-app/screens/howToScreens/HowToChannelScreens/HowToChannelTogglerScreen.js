import React from "react";
import { Platform, StyleSheet, View } from "react-native";

//customs
import { COLORS } from "../../../constants";
import { HowToChannelNavigation } from "../../../Navigations";
import NavHeader from "@/components/Headers/NavHeader";
import { FontAwesome } from "@expo/vector-icons";

const HowToChannelTogglerScreen = ({ route }) => {
  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <NavHeader
          icon={<FontAwesome name="search" size={22} color={COLORS.white} />}
          consoleMsg={"enable user to search channels"}
        />
      </View>
    );
  }

  //render navigation
  function renderNavigationSection() {
    return (
      <View style={styles.navigationContainer}>
        <HowToChannelNavigation idx={route?.params?.idx ?? 0} />
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
    top: Platform.OS === "ios" ? 50 : 20,
    flexDirection: "column",
    height: 0,
    zIndex: 99,
  },
  headerContentItem: {},
  screenContentContainer: {
    top: Platform.OS === "ios" ? 0 : -20,
  },

  //navigation section
  navigationContainer: {
    flexDirection: "column",
  },
});

export default HowToChannelTogglerScreen;
