import React from "react";
import { StyleSheet, Image, Text, View, Platform } from "react-native";

//custom
import { COLORS, images } from "../constants";

const EmptyFlatlistComponent = ({ msg }) => {
  return (
    <View style={styles.bottomContainer}>
      {msg && <Text style={styles.bottomText}>
        {msg}
      </Text>}
      {!msg && <Text style={styles.bottomText}>
        {Platform.OS === "ios"
          ? "That's probably it for today."
          : "Something Amazing Is Coming Soon."}
      </Text>}
      {Platform.OS === "android" ? (
        <View style={styles.imageContainer}>
          <Image source={images.error404} style={styles.bottomImage} />
        </View>
      ) : (
        <Image source={images.error404} style={styles.bottomImage} />
      )}
      {!msg && <Text style={styles.bottomText}>
        {Platform.OS === "ios" ? "Something Amazing Is Coming Soon." : ""}
      </Text>}


    </View>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {
    top: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomImage: {
    width: 200,
    height: 250,
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 50,
  },
  bottomText: {
    paddingHorizontal: 80,
    color: COLORS.white,
    textAlign: "center",
    fontFamily: "PoppinsLight"
  },
  imageContainer: {
    height: 360,
  },
});

export default EmptyFlatlistComponent;
