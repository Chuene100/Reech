import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { OpportunityCardsNavigation } from "../Navigations";
import { COLORS, images } from "../constants";
import NavHeader from "@/components/Headers/NavHeader";
import { useSelector } from "react-redux";

const HomeScreen = () => {
  const navigation = useNavigation();
  const current_profile = useSelector((state) => state.currentProfile.current_profile);

  const image = useSelector((state) => state.profile_images.profileImages);

  //header component section
  function renderHeaderComponentSection() {
    return (
      <View style={styles.headerContentTopSection}>
        <NavHeader
          message="What would you like to do?"
          profileModal={true}
          icon={
            <Image
              source={
                current_profile?.profileImage
                  ? {
                    uri:
                      image[current_profile.profileImage] ??
                      current_profile?.profileImage,
                  }
                  : images.defaultRounded
              }
              resizeMode="cover"
              style={styles.headerProfileItem}
            />
          }
        />
      </View>
    );
  }

  //my calender AI section
  function renderMyAICalendarSection() {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("MyAiCalendarHomeScreen")}
        style={styles.myAiCalenderContainer}
      >
        {/*empty view*/}
        <View style={styles.emptyViewContainerSection} />

        {/*text section*/}
        <View style={styles.myAiTextContainer}>
          <Text style={styles.myAiTextItem}>My AI Calendar</Text>
        </View>

        {/*icon section*/}
        <View style={styles.myAiIconContainer}>
          <Ionicons name="md-calendar-sharp" size={22} color={COLORS.white} />
        </View>
      </TouchableOpacity>
    );
  }

  //opportunity card navigator
  function renderOpportunityCardNavigatorSection() {
    return (
      <View style={styles.opportunityNavigationMainContainer}>
        <OpportunityCardsNavigation />
      </View>
    );
  }

  //screen content list
  function renderScreenContentList() {
    return (
      <>
        {renderHeaderComponentSection()}
        {renderMyAICalendarSection()}
        {renderOpportunityCardNavigatorSection()}
      </>
    );
  }

  //render screen content
  return (
    <View style={styles.homeScreenContainer}>{renderScreenContentList()}</View>
  );
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  homeScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //screen header section
  headerContentTopSection: {
    marginTop: Platform.OS === "ios" ? "10%" : "1%",
    marginRight: Platform.OS === "ios" ? "0%" : "2%",
  },

  //my ai calendar section
  myAiCalenderContainer: {
    height: 40,
    marginTop: 15,
    marginHorizontal: 15,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 30,
    borderWidth: 0.8,
    borderTopWidth: 0,
    borderColor: COLORS.purple,
    backgroundColor: COLORS.purpleDark,
  },
  emptyViewContainerSection: {
    width: "15%",
  },
  myAiTextContainer: {
    width: "65%",
    justifyContent: "center",
    alignItems: "center",
  },
  myAiTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  myAiIconContainer: {
    width: "15%",
    justifyContent: "center",
    alignItems: "center",
  },

  //navigation main container section
  opportunityNavigationMainContainer: {
    marginTop: Platform.OS === "ios" ? 65 : 30,
  },
  headerProfileItem: {
    width: 37,
    height: 37,
    borderRadius: 40,
    resizeMode: "cover",
  },
});

export default HomeScreen;
