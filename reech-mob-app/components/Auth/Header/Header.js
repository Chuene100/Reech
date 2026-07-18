import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";

//import customs
import { COLORS, icons } from "../../../constants";

const Header = ({ words }) => {
  const navigation = useNavigation();
  const { height } = useWindowDimensions();

  const goBackButton = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Image
        source={icons.logoPurpleAndWhite}
        style={[styles.logo, { height: height * 0.2 }]}
        resizeMode="contain"
      />

      <View style={styles.textButton}>
        <View style={styles.arrow}>
          <Entypo
            name="chevron-left"
            size={25}
            color={COLORS.white}
            onPress={goBackButton}
          />
        </View>
        <Text style={styles.textStyle}>{words}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    marginTop: 10,
  },
  logo: {
    marginTop: -38,
    maxWidth: 180,
    maxHeight: 180,
    marginBottom: -40,
    alignSelf: "center",
  },
  textStyle: {
    flexGrow: 1,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: -14,
    // marginRight: 80,
    justifyContent: "center",
    padding: 10,
    color: COLORS.white,
  },
  arrow: {
    marginTop: -5,
    marginRight: 0,
  },
  textButton: {
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "stretch",
    marginBottom: 20,
    width: "100%",
  },
});

export default Header;
