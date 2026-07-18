import React from "react";
import { StyleSheet, View, Text, Platform } from "react-native";

//import customs
import { COLORS } from "../../constants";
import { ComingSoonInAppScreen } from "../../components";
import NavHeader from "@/components/Headers/NavHeader";

const ChatbotScreen = () => {
  //header section
  function renderHeaderComponent() {
    return (
      <View style={styles.headerComponentContainer}>
        <NavHeader message="What would you like to do?" />
      </View>
    );
  }

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.chatbotHeaderContent}>
        <Text style={styles.chatbotHeaderTextItem}>Chatbot</Text>
      </View>
    );
  }

  function renderComingSoon() {
    return (
      <View style={styles.chatbotComingSoonComponent}>
        <ComingSoonInAppScreen />
      </View>
    );
  }

  return (
    <View style={styles.chatbotContainer}>
      {renderHeaderComponent()}
      {renderHeaderSection()}
      {renderComingSoon()}
    </View>
  );
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  chatbotContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerComponentContainer: {
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },

  //header text
  chatbotHeaderContent: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  chatbotHeaderTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  chatbotComingSoonComponent: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatbotScreen;
