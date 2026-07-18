import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";

//import customs
import { COLORS, icons } from "../../../constants";
import { Platform } from "react-native";

const Header = ({ words }) => {
  const navigation = useNavigation();
  const { height } = useWindowDimensions();

  const goBackButton = () => {
    navigation.goBack();
  };

  function renderHeaderImageSection() {
    return (
      <View style={styles.imageLogoContainer}>
        <Image source={icons.logoPurpleAndWhite} style={styles.logoItem} />
      </View>
    );
  }

  function renderTextSection() {
    return (
      <View style={styles.textItemContainer}>
        <TouchableOpacity
          onPress={goBackButton}
          style={styles.navigationContainer}
        >
          <Entypo name="chevron-left" size={25} color={COLORS.white} />
        </TouchableOpacity>

        <View style={styles.screenTextContainer}>
          <Text style={styles.screenTextItem}>{words}</Text>
        </View>

        <View style={styles.emptyContainer} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeaderImageSection()}
      {renderTextSection()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },

  //image logo section
  imageLogoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logoItem: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },

  //text area section
  textItemContainer: {
    marginTop: Platform.OS === "ios" ? "-2%" : "-3%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  navigationContainer: {
    width: "10%",
  },
  screenTextContainer: {
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
  },
  screenTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  emptyContainer: {
    width: "10%",
  },
});

export default Header;
