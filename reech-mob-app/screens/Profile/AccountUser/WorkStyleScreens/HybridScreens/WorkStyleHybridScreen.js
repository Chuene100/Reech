import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

//customs
import { COLORS } from "../../../../../constants";
import NavHeader from "@/components/Headers/NavHeader";

import { WorkStyleHybridNavigation } from "../../../../../Navigations";

const WorkStyleHybridScreen = () => {
  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerContentItem}>
          <NavHeader
            message="What would you like to do?"
          />
        </View>

        {/*top section text*/}
        <View style={styles.topContainerContent}>
          <View style={styles.topHeadingTextContainer}>
            <Text style={styles.topHeadingTextItem}>Work style</Text>
          </View>

          {/*sub heading text*/}
          <View style={styles.topSubheadingContainer}>
            <View style={styles.subheadingIconContainer}>
              <FontAwesome5 name="database" size={85} color={COLORS.pink} />
            </View>
            <View style={styles.subheadingTextContainer}>
              <Text style={styles.topSubheadingTextItem}>Hybrid</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  //render navigation
  function renderNavigationSection() {
    return (
      <View style={styles.navigationContainer}>
        <WorkStyleHybridNavigation />
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
    height: 200,
  },
  headerContentItem: {
    zIndex: 99,
  },
  screenContentContainer: {
    top: Platform.OS === "ios" ? 50 : 0,
  },

  //top section
  topContainerContent: {
    top: 10,
    padding: 10,
    height: 180,
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: COLORS.transparent,
  },
  topHeadingTextContainer: {
    bottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  topHeadingTextItem: {
    color: COLORS.darkGray,
    fontSize: 18,
    fontFamily: "PoppinsBold",
  },
  topSubheadingContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  subheadingIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  subheadingTextContainer: {
    marginLeft: 10,
  },
  topSubheadingTextItem: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "PoppinsBold",
  },

  //navigation section
  navigationContainer: {
    marginTop: Platform.OS === "ios" ? 80 : 30,
    flexDirection: "column",
    backgroundColor: COLORS.purple,
  },
});

export default WorkStyleHybridScreen;
