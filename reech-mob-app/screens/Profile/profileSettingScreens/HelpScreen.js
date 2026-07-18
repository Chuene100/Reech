import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Platform, ScrollView, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Entypo, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

//import customs
import { requestHelpData } from "@/assets/data/requestHelpData";
import { COLORS } from "../../../constants";
import NavHeader from "@/components/Headers/NavHeader";

const HelpScreen = () => {
  const navigation = useNavigation();

  //header section
  function renderHeaderComponent() {
    return (
      <View style={styles.headerComponentContainer}>
        <NavHeader message="What would you like to do?" />

        {/*screen header title*/}
        <View style={styles.screenHeaderTitleContainer}>
          <Text style={styles.screenHeaderTitleTextItem}>Request Help</Text>

          <View style={styles.screenHeaderSubTextContainer}>
            <Text style={styles.screenHeaderSubTextItem}>
              Get all the assistance you need by watching our videos, reading our FAQ, or
              interacting with one of our support employees or our chatbot.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  //help option section
  function renderHelpOptionsSection() {
    return (
      <ScrollView
        scrollEnabled
        showsVerticalScrollIndicator={false}
        style={styles.helpOptionsContainer}
      >
        <View style={styles.helpOptionContent}>
          {/*option tutorial section*/}
          {requestHelpData.map((item, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => navigation.navigate(item.screenNavigation)}
              style={styles.helpOptionItemContainer}
            >
              <ImageBackground
                blurRadius={Platform.OS === "ios" ? 5 : 10}
                source={{ uri: item.backgroundImage }}
                style={styles.helpOptionImageItem}
              >
                <View style={styles.helpOptionIconContainer}>
                  {item.screenTitle.includes("Tutorials") ?
                    <Entypo name="video" size={24} color={COLORS.white} />
                    : item.screenTitle.includes("FAQ") ?
                      <MaterialCommunityIcons name="head-question" size={26} color={COLORS.white} />
                      : item.screenTitle.includes("Customer") ?
                        <MaterialIcons name="support-agent" size={26} color={COLORS.white} />
                        : item.screenTitle.includes("Chatbot") ?
                          <FontAwesome5 name="robot" size={24} color={COLORS.white} />
                          : null}
                </View>

                <Text style={styles.helpOptionImageTextItem}>{item.screenTitle}</Text>

                <View style={styles.helpOptionsTextInfoContainer}>
                  <Text style={styles.helpOptionsTextInfoItem}>
                    {item.screenDescription}
                  </Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView >
    )
  }

  return (
    <View style={styles.container}>
      {renderHeaderComponent()}
      {renderHelpOptionsSection()}
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
  screenHeaderTitleContainer: {
    marginVertical: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  screenHeaderTitleTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold"
  },
  screenHeaderSubTextContainer: {
    marginTop: 10,
    paddingHorizontal: 26,
  },
  screenHeaderSubTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    textAlign: "center"
  },

  //help options section
  helpOptionsContainer: {
    width: "100%",
    flexDirection: "column",
    marginBottom: Platform.OS === "ios" ? 40 : 0,
  },
  helpOptionContent: {
    paddingHorizontal: 15,
    flexDirection: "column",
  },
  helpOptionItemContainer: {
    flexDirection: "column",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
  },
  helpOptionImageItem: {
    width: "100%",
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "cover",
    borderRadius: 20,
    overflow: "hidden",
  },
  helpOptionIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  helpOptionImageTextItem: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: "PoppinsBold",
    textAlign: "center"
  },
  helpOptionsTextInfoContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  helpOptionsTextInfoItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    textAlign: "center",
  },
});

export default HelpScreen;
