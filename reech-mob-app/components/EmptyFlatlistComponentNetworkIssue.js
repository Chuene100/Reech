import React from "react";
import { StyleSheet, Image, Text, View, Platform } from "react-native";

//custom
import { COLORS, FONTS, images } from "../constants";

const EmptyFlatlistComponentNetworkIssue = () => {
  return (
    <View style={styles.bottomContainer}>
      <Text style={styles.bottomText}>
        {Platform.OS === "ios"
          ? "Oops! There seems to be a problem with your network."
          : "Something Amazing Is Coming Soon."}
      </Text>
      {Platform.OS === "android" ? (
        <View style={styles.imageContainer}>
          <Image source={images.error404} style={styles.bottomImage} />
        </View>
      ) : (
        <Image source={images.error404} style={styles.bottomImage} />
      )}
      <Text style={styles.bottomText}>
        {Platform.OS === "ios" ? "Please try again later." : ""}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {
    top: "30%",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomImage: {
    width: 250,
    height: 280,
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 50,
  },
  bottomText: {
    ...FONTS.body5,
    color: COLORS.white,
  },
  imageContainer: {
    height: 400,
  },
});

export default EmptyFlatlistComponentNetworkIssue;
