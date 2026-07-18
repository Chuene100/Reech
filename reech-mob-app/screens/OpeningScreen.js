import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  useWindowDimensions,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

//import dependencies
import { images, icons } from "../constants";
import { CustomButton } from "../components";

const OpeningScreen = () => {
  const { height } = useWindowDimensions();
  const navigation = useNavigation();

  const onSignInPressed = () => {
    navigation.navigate("SignInScreen");
  };

  return (
    <ImageBackground source={images.bg} style={styles.imageBackground}>
      <View style={styles.container}>
        <Image
          source={icons.logoPurpleAndWhite}
          style={[styles.logo, { height: height * 0.59 }]}
          resizeMode="contain"
        />
        <View style={styles.button}>
          <CustomButton
            onPress={onSignInPressed}
            text="Get Started"
            type="SECONDARY"
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageBackground: {
    width: "100%",
    height: "100%",
  },
  logo: {
    marginTop: 200,
    width: "60%",
    maxWidth: 300,
    maxHeight: 200,
  },
  button: {
    marginTop: 200,
    width: "90%",
  },
});

export default OpeningScreen;
