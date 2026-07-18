import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

//import customs
import { COLORS, FONTS } from "../../../constants";
import {
  ComingSoonInAppScreen,
} from "../../../components";
import NavHeader from "@/components/Headers/NavHeader";

const SupportMessageFullViewScreen = () => {
  const navigation = useNavigation();

  //render header
  function renderHeaderComponent() {
    return (
      <View style={styles.headerComponentContainer}>
        <NavHeader
          message="What would you like to do?"
        />
      </View>
    );
  }

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.content}>
        <TouchableOpacity style={styles.goBack}>
          <Ionicons
            name="chevron-back"
            size={26}
            color={COLORS.white}
            onPress={() => navigation.goBack()}
          />
        </TouchableOpacity>

        <View style={styles.headingContainer}>
          <Text style={styles.headingText}>Support Full Message</Text>
        </View>
      </View>
    );
  }

  function renderComingSoon() {
    return (
      <View style={styles.comingSoon}>
        <ComingSoonInAppScreen />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerComponentContainer: {
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },

  //header text
  content: {
    zIndex: 99,
    flexDirection: "row",
    marginTop: Platform.OS === "ios" ? 50 : 40,
  },
  goBack: {
    width: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  headingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 40,
  },
  headingText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  comingSoon: {
    justifyContent: "center",
    alignItems: "flex-start",
    margin: 10,
    bottom: 50,
  },
});

export default SupportMessageFullViewScreen;
