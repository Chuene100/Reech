import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

//import dependencies
import { COLORS, FONTS, images } from "../../../constants";
import { HeaderImage } from "../../../components";

const AuthRenderPersonalisationScreen = ({ route }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const data = route.params.data;

  async function startLoading() {
    await new Promise((res, err) => {
      setTimeout(() => (setLoading(true), res()), 5000);
    }).then(() => {
      navigation.navigate("SignInScreen")
    });
      setLoading(false);
  }

  useEffect(() => {
    startLoading();
  });

  //render function
  function renderScreenLoaderText() {
    return (
      <View style={styles.loaderContent}>
        <Text style={styles.textItem}>Personalising your profile</Text>
        <View style={styles.loaderIcon}>
          {loading && <ActivityIndicator size="large" color="#9e69c9" />}
        </View>
      </View>
    );
  }

  return (
    <ImageBackground source={images.loaderBg} style={styles.imageBackground}>
      <HeaderImage />
      <View style={styles.container}>{renderScreenLoaderText()}</View>
    </ImageBackground>
  );
};

export default AuthRenderPersonalisationScreen;

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
  loaderContent: {
    flexDirection: "column",
    marginTop: -350,
  },
  textItem: {
    ...FONTS.h3,
  },
  loaderIcon: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
});
