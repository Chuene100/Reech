import React from "react";
import { StyleSheet, View, Image } from "react-native";

import { COLORS } from "../../constants";

const ComingSoonInAppScreen = () => {
  return (
    <View style={styles.comingSoonContainer}>
      <Image
        style={styles.img}
        source={{
          uri: "https://cdn.dribbble.com/users/553939/screenshots/3156301/coming-soon-dribbble.gif",
        }}
      />
    </View>
  );
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  comingSoonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: 400,
    height: 400,
    resizeMode: "contain",
  },
});

export default ComingSoonInAppScreen;
