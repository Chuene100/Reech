import React, { useState, useEffect } from "react";
import { Image, StyleSheet, View, Text, TouchableOpacity, Platform, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, Fontisto, FontAwesome } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";

//import customs
import { COLORS, images } from "../../../constants";
import NavHeader from "@/components/Headers/NavHeader";

const AccountSettingScreen = ({ route }) => {
  const navigation = useNavigation();

  const { user, profileCount } = route.params;

  const image = useSelector((state) => state.profile_images.profileImages);

  //state handlers
  const [requestResponse, setRequestResponse] = useState(false);

  // Function to hide the requestResponse text after 5 seconds
  useEffect(() => {
    if (requestResponse) {
      const timer = setTimeout(() => { setRequestResponse(false); }, 3000);
      return () => clearTimeout(timer);
    }
  }, [requestResponse]);

  //header component
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
      <View style={styles.screensHeaderTextContainer}>
        <Text style={styles.screenHeaderTextItem}>Account Settings</Text>
      </View>
    );
  }

  //account header section
  function renderAccountHeaderImageSection() {
    return (
      <>
        <View style={styles.accountHeaderImageContainer}>
          {/*header image section*/}
          <View style={styles.accountHeaderImageContent}>
            <ImageBackground
              source={images.userFrame}
              style={styles.accountHeaderImageContentContainer}
            >
              <Image
                source={
                  user.profileImage
                    ? { uri: image[user.profileImage] ?? user.profileImage }
                    : images.defaultRounded
                }
                style={styles.accountHeaderImageContentItem} />
            </ImageBackground>
          </View>

          {/*header account details section*/}
          <View style={styles.accountHeaderTextContainer}>
            {/*user name item*/}
            <View style={styles.accountHeaderNameTextContainer}>
              <Text style={styles.accountHeaderNameTextItem}>
                {user?.firstName} {user?.lastName}{"  "}
                <Fontisto name="radio-btn-active" size={12} color={COLORS.green} />
              </Text>
            </View>

            {/*user profile count item*/}
            <View style={styles.accountHeaderNameTextContainer}>
              <Text style={styles.accountHeaderProfileTextItem}>
                Current active profiles: {profileCount}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.contentLineSeparator} />
      </>
    );
  }

  //account settings option 
  function renderAccountSettingsOptionsSection() {
    return (
      <View style={styles.accountSettingsOptionContainer}>
        {/*edit account button*/}
        <TouchableOpacity
          onPress={() => navigation.navigate("AccountInformationScreen", { user: user })}
          style={styles.accountSettingOptionContainer}
        >
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={[COLORS.purpleDark, COLORS.transparent, COLORS.purpleDark]}
            style={styles.accountSettingOptionGradientContainer}
          >
            {/*icon and option header*/}
            <View style={styles.iconOptionContainer}>
              <Ionicons name="person" size={22} color={COLORS.white} />
            </View>

            {/*option description*/}
            <View style={styles.optionDescriptionContainer}>
              {/*option header*/}
              <View style={styles.optionDescriptionHeaderTextContainer}>
                <Text style={styles.optionDescriptionHeaderTextItem}>Account information</Text>
              </View>

              {/*option text*/}
              <View style={styles.optionDescriptionTextContainer}>
                <Text style={styles.optionDescriptionTextItem}>
                  Update registered credentials, request verification, deactivate account.
                </Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/*attach files to account button*/}
        <TouchableOpacity
          onPress={() => navigation.navigate("FileAttachmentScreen")}
          style={styles.accountSettingOptionContainer}
        >
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={[COLORS.purpleDark, COLORS.transparent, COLORS.purpleDark]}
            style={styles.accountSettingOptionGradientContainer}
          >
            {/*icon and option header*/}
            <View style={styles.iconOptionContainer}>
              <Ionicons name="md-document-attach" size={22} color={COLORS.white} />
            </View>

            {/*option description*/}
            <View style={styles.optionDescriptionContainer}>
              {/*option header*/}
              <View style={styles.optionDescriptionHeaderTextContainer}>
                <Text style={styles.optionDescriptionHeaderTextItem}>File Attachments</Text>
              </View>

              {/*option text*/}
              <View style={styles.optionDescriptionTextContainer}>
                <Text style={styles.optionDescriptionTextItem}>
                  Upload your certified copy of your ID, and other various file attachments here.
                </Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/*request report of account button*/}
        <TouchableOpacity
          onPress={() => setRequestResponse(true)}
          style={styles.accountSettingOptionContainer}
        >
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={[COLORS.purpleDark, COLORS.transparent, COLORS.purpleDark]}
            style={styles.accountSettingOptionGradientContainer}
          >
            {/*icon and option header*/}
            <View style={styles.iconOptionContainer}>
              <FontAwesome name="download" size={22} color={COLORS.white} />
            </View>

            {/*option description*/}
            <View style={styles.optionDescriptionContainer}>
              {/*option header*/}
              <View style={styles.optionDescriptionHeaderTextContainer}>
                <Text style={styles.optionDescriptionHeaderTextItem}>Request account info</Text>
              </View>

              {/*option text*/}
              <View style={styles.optionDescriptionTextContainer}>
                <Text style={styles.optionDescriptionTextItem}>
                  Get a generated a report of your account. Please keep in mind that your
                  in-app messages will not be included in this report.
                </Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/*request report feedback*/}
        {requestResponse && (
          <View style={styles.requestReportFeedbackContainer}>
            <Text style={styles.requestReportFeedbackTextItem}>
              Hey {user.firstName}! {"\n"}Your request has been acknowledged. Please check your email inbox for your report.
            </Text>
          </View>
        )}

        {/*request report of account button*/}
        <TouchableOpacity
          onPress={() => navigation.navigate("AboutReechScreen")}
          style={styles.accountSettingOptionContainer}
        >
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={[COLORS.purpleDark, COLORS.transparent, COLORS.purpleDark]}
            style={styles.accountSettingOptionGradientContainer}
          >
            {/*icon and option header*/}
            <View style={styles.iconOptionContainer}>
              <Ionicons name="md-phone-portrait" size={22} color={COLORS.white} />
            </View>

            {/*option description*/}
            <View style={styles.optionDescriptionContainer}>
              {/*option header*/}
              <View style={styles.optionDescriptionHeaderTextContainer}>
                <Text style={styles.optionDescriptionHeaderTextItem}>About Reech</Text>
              </View>

              {/*option text*/}
              <View style={styles.optionDescriptionTextContainer}>
                <Text style={styles.optionDescriptionTextItem}>
                  Get to learn more info about the Reech app you are currently using.
                </Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {renderHeaderComponent()}
      {renderHeaderSection()}
      {renderAccountHeaderImageSection()}
      {renderAccountSettingsOptionsSection()}
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

  //header text section
  screensHeaderTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: Platform.OS === "android" ? 10 : 10,
  },
  screenHeaderTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //account header section
  accountHeaderImageContainer: {
    width: "100%",
    marginTop: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
  },
  accountHeaderImageContent: {
    width: Platform.OS === "ios" ? "30%" : "35%"
  },
  accountHeaderImageContentContainer: {
    width: 90,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  accountHeaderImageContentItem: {
    width: 80,
    height: 80,
    resizeMode: "cover",
    borderRadius: 6,
  },
  accountHeaderTextContainer: {
    width: Platform.OS === "ios" ? "70%" : "65%",
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "column",
  },
  accountHeaderNameTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  accountHeaderNameTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold"
  },
  accountHeaderProfileTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight"
  },
  contentLineSeparator: {
    width: "84%",
    alignSelf: "center",
    marginVertical: 10,
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
  },

  //account settings option
  accountSettingsOptionContainer: {
    width: "100%",
    paddingHorizontal: 15,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  accountSettingOptionContainer: {
    width: "100%",
    marginVertical: 10,
  },
  accountSettingOptionGradientContainer: {
    width: "100%",
    padding: 5,
    flexDirection: "row",
    borderRadius: 20,
  },
  iconOptionContainer: {
    width: "10%",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  optionDescriptionContainer: {
    width: "85%",
    justifyContent: "flex-start",
    flexDirection: "column",
  },
  optionDescriptionHeaderTextContainer: {
    marginBottom: 5,
  },
  optionDescriptionHeaderTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  optionDescriptionTextContainer: {
    marginBottom: 5,
  },
  optionDescriptionTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  requestReportFeedbackContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  requestReportFeedbackTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    textAlign: "center",
  },
});

export default AccountSettingScreen;
