import React from "react";
import { StyleSheet, View, Platform } from "react-native";

//customs
import { NotificationNavigation } from "../Navigations";
import { COLORS } from "../constants";
import NavHeader from "../components/Headers/NavHeader";

const ChatroomScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <NavHeader
          message="What will make you happy today?"
        />
        <NotificationNavigation />
      </View>
    </View>
  );
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? "5%" : "5%",
    backgroundColor: COLORS.black,
  },
  headerContainer: {
    flex: 1,
    marginTop: Platform.OS === "android" ? "5%" : "5%",
  },
  navContainer: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? "-140%" : "-150%",
  },
});

export default ChatroomScreen;
