import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  FlatList,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
  FontAwesome5,
  SimpleLineIcons,
  Entypo,
  AntDesign,
} from "@expo/vector-icons";

//import dependencies
import { COLORS, icons, images } from "../../constants";
import { useUpdateUserMutation } from "../../redux/api/api-slice";
import { removeCredentials } from "../../redux/features/auth-slice";
import { removeCurrentProfile } from "../../redux/features/current_profile-slice";
import { useListMyProfilesQuery } from "../../redux/api/api-slice";
import NavHeader from "@/components/Headers/NavHeader";

const ManageProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { user, user_profiles } = route.params;
  const [profiles, setProfiles] = useState(user_profiles);

  const image = useSelector((state) => state.profile_images.profileImages);

  const {
    data: fetched_profiles,
    refetch,
    isFetching,
  } = useListMyProfilesQuery(user?._id);
  const [updateUserFn] = useUpdateUserMutation();

  useEffect(() => {
    fetched_profiles && setProfiles(fetched_profiles?.data);
  }, [fetched_profiles]);

  const onHomeScreenPress = () => {
    navigation.navigate("WelcomeScreen");
  };

  const onAppSettingPress = () => {
    navigation.navigate("AppSettingScreen");
  };

  const onAccountPress = () => {
    navigation.navigate("AccountSettingScreen", {
      user: user,
      profileCount: profiles.length,
    });
  };

  const onPersonalDashboard = () => {
    navigation.navigate("ActivityDashboardScreen");
  };

  const onHelpPress = () => {
    navigation.navigate("HelpScreen");
  };

  const onPolicyPress = () => {
    navigation.navigate("PrivacyOptionScreen");
  };

  const onAdSettingsPress = () => {
    navigation.navigate("AdSettingScreen");
  };

  const onSignOutPress = () => {
    const userId = user?._id;
    const body = { isOnline: false };

    updateUserFn({ body, userId }).then((res) => {
      if (res.error) {
        console.log(res.error.data?.message);
        return;
      }
      console.log(res.data?.message);

      dispatch(removeCredentials());
      dispatch(removeCurrentProfile());
    })
      .catch((err) => { console.log(err); });
  };

  const onProfileBenefitPress = () => {
    navigation.navigate("ProfileBenefitsScreen");
  };

  const onAddNewProfilePress = () => {
    navigation.navigate("AddProfileScreen", { user: user });
  };

  //header component
  function renderHeaderComponent() {
    return (
      <View style={styles.headerComponentContainer}>
        <NavHeader
          icon={<AntDesign name="qrcode" size={24} color={COLORS.white} />}
          message="What would you like to do?"
          to="AccountQRCodeScreen"
          to_params={{ user: user }}
        />
      </View>
    );
  }

  //screen heading section
  function renderScreenHeadingSection() {
    return (
      <View style={styles.headingContentContainer}>
        {/*navigation content*/}
        <TouchableOpacity
          onPress={() => null}
          style={styles.headingNavigationContainer}
        >
          <Ionicons name="" size={24} color={COLORS.white} />
        </TouchableOpacity>

        {/*heading text content*/}
        <View style={styles.headingTextContainer}>
          <Text style={styles.headingTextItem}>Manage account & profiles</Text>
        </View>

        {/*empty container*/}
        <View style={styles.headingNavigationContainer}>
          <Ionicons name="" size={24} color={COLORS.white} />
        </View>
      </View>
    );
  }

  //profile collection list
  function renderProfileCollectionListSection() {
    return (
      <View style={styles.profileCollectionContainer}>
        <FlatList
          horizontal
          data={[...profiles, { plusImage: true }]}
          keyExtractor={(item, index) => index.toString()}
          onRefresh={refetch}
          refreshing={isFetching}
          renderItem={({ item, index }) => {
            //plus image item
            if (item.plusImage && profiles?.length < 4) {
              return (
                <TouchableOpacity
                  onPress={onAddNewProfilePress}
                  style={styles.addActionContainer}
                >
                  <View style={styles.addImageContainer}>
                    <Image source={icons.plusBtn} style={styles.addImageItem} />
                  </View>

                  <View style={styles.addImageTextItemContainer}>
                    <Text style={styles.addImageTextItem}>Add profile</Text>
                  </View>
                </TouchableOpacity>
              );
            }

            //user profile collection
            if (index < 4) {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("EditProfileInfoScreen", {
                      profile: item,
                    })
                  }
                  style={styles.profileInfoContainer}
                >
                  <View style={styles.profileImageContentContainer}>
                    <FontAwesome5
                      name="user-cog"
                      size={15}
                      color={COLORS.white}
                      style={styles.profileIconItem}
                    />
                    <Image
                      source={
                        item.profileImage
                          ? {
                            uri:
                              image[item.profileImage] ?? item.profileImage,
                          }
                          : images.defaultRounded
                      }
                      style={styles.profileImageItem}
                    />
                  </View>

                  <View style={styles.profileImageTextItemContainer}>
                    <Text numberOfLines={1} style={styles.profileImageTextItem}>
                      {item?.jobTitleId?.jobTitle}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }
          }}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }

  //screen subheading section
  function renderScreenSubheadingSection() {
    return (
      <View style={styles.subheadingContainer}>
        <Entypo
          name="cog"
          size={18}
          color={COLORS.darkGray}
          style={styles.subheadingIconItem}
        />
        <Text style={styles.subheadingTextItem}>Manage settings</Text>
      </View>
    );
  }

  //screen management options
  function renderManagementOptionSection() {
    return (
      <View style={styles.managementOptionContainer}>
        <View style={styles.managementOptionContent}>
          {/*home option item*/}
          <View style={styles.managementOptionItemContainer}>
            <View style={styles.managementOptionIconContainer}>
              <Ionicons name="home" size={24} color={COLORS.darkGray} />
            </View>
            <View style={styles.managementOptionTextContainer}>
              <Text
                style={styles.managementOptionTextItem}
                onPress={onHomeScreenPress}
              >
                Home
              </Text>
            </View>
          </View>

          {/*account option item*/}
          <View style={styles.managementOptionItemContainer}>
            <View style={styles.managementOptionIconContainer}>
              <FontAwesome name="user" size={24} color={COLORS.darkGray} />
            </View>
            <View style={styles.managementOptionTextContainer}>
              <Text
                style={styles.managementOptionTextItem}
                onPress={onAccountPress}
              >
                Account
              </Text>
            </View>
          </View>

          {/*dashboard option item*/}
          <View style={styles.managementOptionItemContainer}>
            <View style={styles.managementOptionIconContainer}>
              <FontAwesome name="dashboard" size={24} color={COLORS.darkGray} />
            </View>
            <View style={styles.managementOptionTextContainer}>
              <Text
                style={styles.managementOptionTextItem}
                onPress={onPersonalDashboard}
              >
                Personal dashboard
              </Text>
            </View>
          </View>

          {/*App settings option item*/}
          <View style={styles.managementOptionItemContainer}>
            <View style={styles.managementOptionIconContainer}>
              <MaterialIcons
                name="app-settings-alt"
                size={24}
                color={COLORS.darkGray}
              />
            </View>
            <View style={styles.managementOptionTextContainer}>
              <Text
                style={styles.managementOptionTextItem}
                onPress={onAppSettingPress}
              >
                App settings
              </Text>
            </View>
          </View>

          {/*ad settings option item*/}
          <View style={styles.managementOptionItemContainer}>
            <View style={styles.managementOptionIconContainer}>
              <MaterialCommunityIcons
                name="card-bulleted-settings"
                size={24}
                color={COLORS.darkGray}
              />
            </View>
            <View style={styles.managementOptionTextContainer}>
              <Text
                style={styles.managementOptionTextItem}
                onPress={onAdSettingsPress}
              >
                Ad settings
              </Text>
            </View>
          </View>

          {/*help option item*/}
          <View style={styles.managementOptionItemContainer}>
            <View style={styles.managementOptionIconContainer}>
              <MaterialIcons
                name="support-agent"
                size={24}
                color={COLORS.darkGray}
              />
            </View>
            <View style={styles.managementOptionTextContainer}>
              <Text
                style={styles.managementOptionTextItem}
                onPress={onHelpPress}
              >
                Help
              </Text>
            </View>
          </View>

          {/*privacy option item*/}
          <View style={styles.managementOptionItemContainer}>
            <View style={styles.managementOptionIconContainer}>
              <MaterialIcons name="policy" size={24} color={COLORS.darkGray} />
            </View>
            <View style={styles.managementOptionTextContainer}>
              <Text
                style={styles.managementOptionTextItem}
                onPress={onPolicyPress}
              >
                Privacy Policy & Terms of Service
              </Text>
            </View>
          </View>

          {/*sign out option item*/}
          <View style={styles.managementOptionItemContainer}>
            <View style={styles.managementOptionIconContainer}>
              <SimpleLineIcons
                name="logout"
                size={24}
                color={COLORS.darkGray}
              />
            </View>
            <View style={styles.managementOptionTextContainer}>
              <Text
                style={styles.managementOptionTextItem}
                onPress={onSignOutPress}
              >
                Sign out
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  //footer section
  function renderFooterSection() {
    return (
      <View style={styles.footerSectionContainer}>
        <TouchableOpacity
          onPress={onProfileBenefitPress}
          style={styles.privacyButtonContainer}
        >
          <Text style={styles.privacyButtonItem}>
            Profile benefits & Pricing
          </Text>
        </TouchableOpacity>

        <View style={styles.versionTextContainer}>
          <Text style={styles.versionTextItem}>version 1.0.0</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeaderComponent()}
      {renderScreenHeadingSection()}
      {renderProfileCollectionListSection()}
      {renderScreenSubheadingSection()}
      {renderManagementOptionSection()}
      {renderFooterSection()}
    </View>
  );
};

//custom style
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerComponentContainer: {
    height: Platform.OS === "ios" ? "5%" : "6%",
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
    marginHorizontal: 5,
  },

  //heading section
  headingContentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: Platform.OS === "ios" ? "5%" : "6%",
  },
  headingNavigationContainer: {
    width: "10%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headingTextContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
  },
  headingTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //profile collection section
  profileCollectionContainer: {
    marginTop: 10,
    height: Platform.OS === "ios" ? "10%" : "14%",
    marginHorizontal: 5,
  },
  addActionContainer: {
    flexDirection: "column",
  },
  addImageContainer: {
    top: Platform.OS === "ios" ? 0 : 3,
    justifyContent: "center",
    alignItems: "center",
  },
  addImageItem: {
    width: Platform.OS === "ios" ? 74 : 78,
    height: Platform.OS === "ios" ? 74 : 78,
    resizeMode: "cover",
  },
  addImageTextItemContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? -2 : 0,
  },
  addImageTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  profileInfoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  profileImageContentContainer: {
    flexDirection: "column",
    marginHorizontal: 15,
  },
  profileImageItem: {
    width: 70,
    height: 70,
    borderRadius: 50,
    resizeMode: "cover",
  },
  profileIconItem: {
    top: 50,
    zIndex: 99,
    marginBottom: -17,
    alignSelf: "flex-end",
  },
  profileImageTextItemContainer: {
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "92%",
  },
  profileImageTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //sub heading section
  subheadingContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  subheadingIconItem: {
    marginRight: 5,
  },
  subheadingTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //management option section
  managementOptionContainer: {
    marginTop: 20,
    height: Platform.OS === "ios" ? "40%" : "52%",
    marginHorizontal: Platform.OS === "ios" ? 0 : 10,
  },
  managementOptionContent: {
    flexDirection: "column",
  },
  managementOptionItemContainer: {
    flexDirection: "row",
    marginVertical: 8,
    width: "100%",
  },
  managementOptionIconContainer: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  managementOptionTextContainer: {
    width: "80%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  managementOptionTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //footer section
  footerSectionContainer: {
    top: Platform.OS === "ios" ? "13%" : 20,
    height: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  privacyButtonContainer: {
    flexDirection: "column",
  },
  privacyButtonItem: {
    color: COLORS.lightBlue,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  versionTextContainer: {
    marginTop: 10,
  },
  versionTextItem: {
    color: COLORS.darkGray,
    fontSize: 10,
    fontFamily: "PoppinsLight",
  },
});

export default ManageProfileScreen;
