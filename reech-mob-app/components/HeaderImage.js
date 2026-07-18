import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

//import dependencies
import { COLORS, SIZES, icons } from "../constants";

const HeaderImage = () => {
  const { height } = useWindowDimensions();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View
        style={{
          marginTop: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={icons.logoPurpleAndWhite}
          style={[styles.logo, { height: height * 2.5 }]}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={{
            height: 45,
            width: 45,
            marginLeft: 15,
            backgroundColor: COLORS.transparent,
          }}
          onPress={() => navigation.navigate("EditProfileScreen")}
        ></TouchableOpacity>
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
    marginRight: -50,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "50%",
    maxWidth: 160,
    maxHeight: 100,
    marginBottom: -10,
  },
});

export default HeaderImage;
