import React from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

//customs
import NavHeader from "@/components/Headers/NavHeader";
import { COLORS, images } from "../../../../../constants";

const TransactionErrorScreen = () => {
  const navigation = useNavigation();

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <NavHeader message="What would you like to do?" />
      </View>
    );
  }

  function renderScreenContent() {
    return (
      <View style={styles.screenContentContainer}>
        <Text style={styles.screenHeading}>{`Oops! Let's try that again.`}</Text>
        <View style={styles.imageContainer}>
          <Image source={images.reechieGeneral} style={styles.warningImage} />
        </View>

        <Text style={styles.screenInfoText}>
          Seems like you do not have sufficient funds in your account. Please
          top-up your wallet to complete this payment.
        </Text>

        <Text style={styles.screenHeading}>
          Here are our{" "}
          <Text
            onPress={() => navigation.navigate("ReechBankDetailsScreen")}
            style={styles.bankingDetails}
          >
            Banking Details
          </Text>
        </Text>
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

export default TransactionErrorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerContainer: {
    marginTop: Platform.OS === "android" ? "0%" : "10%",
  },

  //screen content
  screenContentContainer: {
    flex: 0.8,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  screenHeading: {
    textAlign: "center",
    marginVertical: 10,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  warningImage: {
    width: 200,
    height: 200,
  },
  screenInfoText: {
    textAlign: "center",
    marginHorizontal: 15,
    marginVertical: 10,
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  bankingDetails: {
    color: COLORS.purple,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
});
