import React from "react";
import { StyleSheet, View, Text, Platform, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

//import customs
import { COLORS } from "../../../constants";
import { LinearGradient } from "expo-linear-gradient";
import NavHeader from "@/components/Headers/NavHeader";

const PrivacyOptionScreen = () => {
  const navigation = useNavigation();

  const onPrivacyPolicyPress = () => {
    navigation.navigate("PolicyScreen");
  };
  const onTermsOfServicePress = () => {
    navigation.navigate("TermsScreen");
  };

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
      <View style={styles.termsHeaderContainer}>
        <Text style={styles.termsHeaderTextItem}>
          Privacy Policy & Terms of Service
        </Text>
      </View>
    );
  }

  //image section
  function renderImageSection() {
    return (
      <View style={styles.termsDescriptionContainer}>
        <View style={styles.termsDescriptionContent}>
          <Text style={styles.termsDescriptionMainTextItem}>
            We respect your privacy and are committed to providing a transparent
            and secure online experience for all of our users at Reech.
          </Text>

          <Text style={styles.termsDescriptionMainTextItem}>
            Our Terms and Privacy Policy screen is intended to provide you with important information
            about how we collect, utilize, and safeguard your data. We urge you to carefully
            read this screen in order to understand your rights and obligations when using
            our services.
          </Text>

          <Text style={styles.termsDescriptionTextItem}>
            Find out more about our service terms and privacy policies.
            This information will be updated as regularly as possible.
          </Text>
        </View>

        {/*button items*/}
        <View style={styles.buttonItemContainer}>
          {/*terms button*/}
          <Pressable
            onPress={onTermsOfServicePress}
            style={styles.buttonItemContentContainer}
          >
            <LinearGradient
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
              style={styles.buttonGradientContainer}
            >
              <Text style={styles.buttonTextItem}>
                Terms of Service
              </Text>
            </LinearGradient>
          </Pressable>

          {/*privacy button*/}
          <Pressable
            onPress={onPrivacyPolicyPress}
            style={styles.buttonItemContentContainer}
          >
            <LinearGradient
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
              style={styles.buttonGradientContainer}
            >
              <Text style={styles.buttonTextItem}>
                Privacy policy
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeaderComponent()}
      {renderHeaderSection()}
      {renderImageSection()}
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
  termsHeaderContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  termsHeaderTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //text description section
  termsDescriptionContainer: {
    marginTop: 60,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  termsDescriptionContent: {
    justifyContent: "center",
  },
  termsDescriptionMainTextItem: {
    fontSize: 14,
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    textAlign: "center",
    marginBottom: 40,
  },
  termsDescriptionTextItem: {
    fontSize: 14,
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    textAlign: "center",
  },

  //button section
  buttonItemContainer: {
    marginTop: 30,
    paddingHorizontal: 40,
  },
  buttonItemContentContainer: {
    marginTop: 30,
    flexDirection: "column",
  },
  buttonGradientContainer: {
    height: 45,
    paddingHorizontal: 70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  buttonTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
});

export default PrivacyOptionScreen;
