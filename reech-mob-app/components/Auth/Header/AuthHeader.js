import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

//customs
import { COLORS, FONTS } from "../../../constants";
import Header from "./Header";

//header section
const AuthHeader = ({ words }) => {
  const navigation = useNavigation();
  const goBackIcon = () => {
    navigation.goBack();
  };
  return (
    <View>
      <View>
        <Header />
        <View style={styles.content}>
          <Pressable style={styles.goBack}>
            <Ionicons
              name="chevron-back"
              size={26}
              color={COLORS.white}
              onPress={goBackIcon}
            />
          </Pressable>

          <View style={styles.headingContainer}>
            <Text style={styles.headingText}>{words}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AuthHeader;

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    marginTop: Platform.OS === "android" ? 70 : 90,
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
    marginLeft: 10,
  },
  headingText: {
    color: COLORS.white,
    ...FONTS.body3,
  },
});
