import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

//custom
import { COLORS } from "../../../../constants";
import NavHeader from "@/components/Headers/NavHeader";

const ReechBankDetailsScreen = () => {
  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <NavHeader message="What would you like to do?" />
      </View>
    );
  }

  //screen section
  function renderScreenContent() {
    return (
      <View style={styles.screenContainer}>
        <View style={styles.renderScreenContent}>
          <Text style={styles.screenText}>Banking Information</Text>
        </View>

        <View style={styles.screenDetailsSection}>
          {/*bank section*/}
          <View style={styles.screenDetailsContent}>
            <Text style={styles.screenDetailsHeading}>Bank</Text>
            <Text style={styles.screenDetailsText}>Standard Bank</Text>
          </View>
          <View style={styles.screenLiner} />

          {/*Account holder section*/}
          <View style={styles.screenDetailsContent}>
            <Text style={styles.screenDetailsHeading}>Account holder:</Text>
            <Text style={styles.screenDetailsText}>Reecheble (Pty) Ltd</Text>
          </View>
          <View style={styles.screenLiner} />

          {/*ID/Reg Number section*/}
          <View style={styles.screenDetailsContent}>
            <Text style={styles.screenDetailsHeading}>ID/Reg Number:</Text>
            <Text style={styles.screenDetailsText}>2022/228001/07</Text>
          </View>
          <View style={styles.screenLiner} />

          {/*Account type section*/}
          <View style={styles.screenDetailsContent}>
            <Text style={styles.screenDetailsHeading}>Account type:</Text>
            <Text style={styles.screenDetailsText}>Current</Text>
          </View>
          <View style={styles.screenLiner} />

          {/*Account number section*/}
          <View style={styles.screenDetailsContent}>
            <Text style={styles.screenDetailsHeading}>Account number</Text>
            <Text style={styles.screenDetailsText}>10 17 309 917 1</Text>
          </View>
          <View style={styles.screenLiner} />

          {/*Branch section*/}
          <View style={styles.screenDetailsContent}>
            <Text style={styles.screenDetailsHeading}>Branch:</Text>
            <Text style={styles.screenDetailsText}>Sandton City</Text>
          </View>
          <View style={styles.screenLiner} />

          {/*Branch code section*/}
          <View style={styles.screenDetailsContent}>
            <Text style={styles.screenDetailsHeading}>Branch code:</Text>
            <Text style={styles.screenDetailsText}>8105</Text>
          </View>
          <View style={styles.screenLiner} />

          {/*SWIFT code section*/}
          <View style={styles.screenDetailsContent}>
            <Text style={styles.screenDetailsHeading}>SWIFT code:</Text>
            <Text style={styles.screenDetailsText}>SBZAZAJJ</Text>
          </View>
          <View style={styles.screenLiner} />

          {/*Date account opened section*/}
          <View style={styles.screenDetailsContent}>
            <Text style={styles.screenDetailsHeading}>
              Date account opened:
            </Text>
            <Text style={styles.screenDetailsText}>11 May 2022</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeaderSection()}
      {renderScreenContent()}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerContainer: {
    zIndex: 99,
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },

  //screen container
  screenContainer: {
    flexDirection: "column",
    marginHorizontal: 15,
  },
  renderScreenContent: {
    top: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  screenText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //details section
  screenDetailsSection: {
    top: 25,
    flexDirection: "column",
    paddingHorizontal: 5,
    borderRadius: 10,
    backgroundColor: COLORS.transparent,
  },
  screenDetailsContent: {
    padding: 10,
  },
  screenDetailsHeading: {
    color: COLORS.purple,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  screenDetailsText: {
    opacity: 0.6,
    marginTop: 10,
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  screenLiner: {
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
  },
});

export default ReechBankDetailsScreen;
