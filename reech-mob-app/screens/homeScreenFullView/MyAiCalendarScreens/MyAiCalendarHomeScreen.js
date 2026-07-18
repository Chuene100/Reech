import React, { useEffect, useState } from "react";
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";

//customs
import { COLORS, images } from "../../../constants";
import NavHeader from "@/components/Headers/NavHeader";
import { useListMyProfilesQuery } from "../../../redux/api/api-slice";
import { setProfileImage } from "../../../redux/features/profile-image-slice";
import CustomCalendarRangerPicker from "@/components/CustomCalendarRangerPicker";

const MyAiCalendarHomeScreen = () => {
  const navigation = useNavigation();

  const { control } = useForm();

  const dispatch = useDispatch();
  const [myProfiles, setMyProfiles] = useState([]);

  const user = useSelector((state) => state.user.current_user);
  const image = useSelector((state) => state.profile_images.profileImages);

  const cache_profiles = useSelector((state) => state.profiles.user_profiles);

  const { data: fetched_profiles } = useListMyProfilesQuery(user?._id);

  useEffect(() => { setMyProfiles(fetched_profiles?.data ?? cache_profiles) }, [cache_profiles, fetched_profiles]);

  useEffect(() => {
    if (user) { if (!image[user?.profileImage] && user?.profileImage?.startsWith("http")) _loadImage(user?.profileImage); }
  }, [user]);

  const _loadImage = async (url) => {
    try {
      if (url) {
        const response = await fetch(url);

        const blob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          dispatch(setProfileImage({ url, data: reader.result }));
        };
      }
    } catch (error) {
      console.error(`Error loading image: ${error}`);
    }
  };

  //header section
  function headerComponentSection() {
    return (
      <View style={styles.headerComponentContentContainer}>
        <NavHeader message="What would you like to do?" />

        <View style={styles.headerSubTitleContainer}>
          <Text style={styles.headerSubTitleTextItem}>My Reech calendar</Text>
        </View>
      </View>
    );
  }

  //profiles section
  function renderUserProfileCollectionSection() {
    return (
      <View style={styles.profileItemsContainer}>
        {myProfiles.map((profile, i) => (
          <TouchableOpacity onPress={() => navigation.navigate("MyAiCalendarPreviewScreen")}
            key={i}
            style={styles.profileItemContent}>
            {/*profile image item*/}
            <View style={styles.profileMapImageContainer}>
              <Image
                source={
                  profile.profileImage
                    ? {
                      uri:
                        image[profile.profileImage] ?? profile.profileImage,
                    }
                    : images.defaultRounded
                }
                style={styles.profileMapImageItem}
              />
            </View>

            {/*profile name item*/}
            <View style={styles.profileMapNameContainer}>
              <Text numberOfLines={1} style={styles.profileMapNameTextItem}>
                {profile?.jobTitleId?.jobTitle}
              </Text>
            </View>

            {/*profile color item*/}
            <View style={styles.profileMapColorContainer}>
              <View style={[styles.profileMapColorItem, {
                backgroundColor: i === 0 ? COLORS.amber : i === 1 ? COLORS.purple : i === 2 ? COLORS.teal : COLORS.coralRed,
              }]} />
            </View>

            {/*profile visibility item*/}
            <View style={styles.profileMapVisibilityContainer}>
              <FontAwesome name={i === 0 || i === 3 ? "eye-slash" : "eye"} size={20} color={COLORS.white} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  //profile calendar data
  function renderProfileCalenderDataSection() {
    return (
      <View style={styles.profileCalendarDataContainer}>
        <CustomCalendarRangerPicker
          control={control}
          name={"duration"}
          noDate={true}
          rules={{
            require: "Please add a duration for this opportunity",
          }}
        />
      </View>
    )
  }

  //credit section
  function renderCreditsSection() {
    return (
      <View style={styles.creditsMainContainer}>
        {/*credits section*/}
        <View style={styles.creditsTextContainer}>
          <Text style={styles.creditsTextColorItem}>Credits: R20</Text>
          <Text style={styles.creditsTextGrayItem}>Use credits to boost your availability</Text>
        </View>

        {/*credits button*/}
      </View>
    )
  }

  //get credits section
  function renderGetCreditsButtonSection() {
    return (
      <View style={styles.getCreditsButtonContainer}>
        <View style={styles.getCreditsContent}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ActivityDashboardScreen")}
            style={styles.getCreditsContainer}
          >
            <LinearGradient
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
              style={styles.getCreditsGradientContainer}
            >
              <Text style={styles.getCreditsTextItem}>
                Get more credits
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  //screen content section
  function screenContentListSection() {
    return (
      <>
        {headerComponentSection()}
        {renderUserProfileCollectionSection()}
        {renderProfileCalenderDataSection()}
        {renderCreditsSection()}
        {renderGetCreditsButtonSection()}
      </>
    );
  }

  return (
    <View style={styles.calendarContentContainer}>
      {screenContentListSection()}
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContentContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerComponentContentContainer: {
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },
  headerSubTitleContainer: {
    marginTop: 15,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "flex-start"
  },
  headerSubTitleTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight"
  },

  //profiles selector item
  profileItemsContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
    flexDirection: "column",
    marginBottom: 15,
  },
  profileItemContent: {
    width: "100%",
    flexDirection: "row",
    marginBottom: 15,
  },
  profileMapImageContainer: {
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  profileMapImageItem: {
    width: 40,
    height: 40,
    resizeMode: "cover",
    borderRadius: 40,
  },
  profileMapNameContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 10,
  },
  profileMapNameTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight"
  },
  profileMapColorContainer: {
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  profileMapColorItem: {
    width: 35,
    height: 20,
    borderRadius: 20,
  },
  profileMapVisibilityContainer: {
    width: "10%",
    justifyContent: "center",
    alignItems: "flex-end",
  },

  //profile calendar data
  profileCalendarDataContainer: {
    width: "95%",
    paddingVertical: 10,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: COLORS.reechGray,
  },

  //credit section
  creditsMainContainer: {
    width: "100%",
    marginTop: 10,
    paddingHorizontal: 15,
    flexDirection: "column",
  },
  creditsTextContainer: {
    flexDirection: "row",
  },
  creditsTextColorItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
    marginRight: 10,
  },
  creditsTextGrayItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    opacity: 0.5,
  },

  //get button section
  getCreditsButtonContainer: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  getCreditsContent: {
    width: "35%",
  },
  getCreditsContainer: {
    top: 10,
  },
  getCreditsGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    height: 45,
    width: "100%",
  },
  getCreditsTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
});

export default MyAiCalendarHomeScreen;
