import React from "react";
import { Image, StyleSheet, View } from "react-native";

//customs
import { images } from "../constants";

const LoadingComponent = () => {
  return (
    <View style={styles.loadingContainer}>
      <Image source={images.loadingApproved} style={styles.loadingImageItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  //loading content
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingImageItem: {
    width: 250,
    height: 250,
  },
});

export default LoadingComponent;
