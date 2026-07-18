import React from "react";
import { StyleSheet, View, SafeAreaView, ImageBackground } from "react-native";

import { COLORS } from "../../constants";

const ComingSoonScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.img}
        source={{
          uri: "https://cdn.dribbble.com/users/553939/screenshots/3156301/coming-soon-dribbble.gif",
        }}
      ></ImageBackground>
    </SafeAreaView>
  );
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: COLORS.black,
    marginTop: 330,
  },
  img: {
    width: "100%",
    height: 400,
  },
});

export default ComingSoonScreen;
