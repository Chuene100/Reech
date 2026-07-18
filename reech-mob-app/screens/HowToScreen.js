import React from "react";
import { StyleSheet, View, Platform, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

//customs
import { HowToNavigation } from "../Navigations";
import { COLORS } from "../constants";

const HowToScreen = ({ route }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.howToMainScreenContainer}>
      {/*back icon with tabs*/}
      <View style={styles.howToMainNavigationContainer}>
        {/*back button*/}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.navigationBackContainer}
        >
          <Ionicons name="chevron-back" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/*tab buttons*/}
      <HowToNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  howToMainScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  howToMainNavigationContainer: {
    zIndex: 99,
    width: "7%",
    flexDirection: "row",
  },
  navigationBackContainer: {
    top: Platform.OS === "ios" ? 110 : 70,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
});

export default HowToScreen;
