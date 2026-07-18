import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  ImageBackground,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";

//import dependencies
import { COLORS, SIZES, images, icons } from "../../constants";
import {
  EmptyFlatlistComponentNetworkIssue,
  LoadingComponent,
} from "../../components";
import { useListMyProfilesQuery } from "../../redux/api/api-slice";
import { setProfileImage } from "../../redux/features/profile-image-slice";
import NavHeader from "@/components/Headers/NavHeader";
import { FontAwesome5 } from "@expo/vector-icons";

const ProfileScreen = () => {
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const [myProfiles, setMyProfiles] = useState([]);

  const user = useSelector((state) => state.user.current_user);
  const image = useSelector((state) => state.profile_images.profileImages);

  const cache_profiles = useSelector((state) => state.profiles.user_profiles);
  const current_profile = useSelector(
    (state) => state.currentProfile.current_profile
  );

  const {
    data: fetched_profiles,
    refetch,
    isLoading,
    isFetching,
    error: fetchError,
  } = useListMyProfilesQuery(user?._id);

  useEffect(() => {
    setMyProfiles(fetched_profiles?.data ?? cache_profiles);
  }, [cache_profiles, fetched_profiles]);

  useEffect(() => {
    if (user) {
      if (!image[user?.profileImage] && user?.profileImage?.startsWith("http"))
        _loadImage(user?.profileImage);

      if (!image[user?.coverImage] && user?.coverImage?.startsWith("http"))
        _loadImage(user?.coverImage);
    }
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

  //add profile action section
  function onAddProfilePress() {
    navigation.navigate("AddProfileScreen", { user: user });
  }

  const EditProfileItem = (item) => {
    navigation.navigate("EditProfileInfoScreen", {
      profile: item,
    });
  };

  //loading component section
  function renderLoadingComponent() {
    return <LoadingComponent />;
  }

  //screen header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerComponentContainer}>
        <NavHeader
          to="ManageProfileScreen"
          to_params={{ user: user, user_profiles: myProfiles, }}
          message="What would you like to do?"
          icon={<FontAwesome5 name="users-cog" size={18} color={COLORS.white} />}
        />
      </View>
    );
  }

  //profile information section
  function renderUserProfileInfoSection() {
    return (
      <View style={styles.profileSectionContainer}>
        {/*user main profile picture*/}
        <ImageBackground
          source={images.userFrame}
          style={styles.mainProfileImageContainer}
        >
          <Image
            source={
              user?.profileImage
                ? { uri: image[user?.profileImage] ?? user?.profileImage }
                : images.defaultRounded
            }
            style={styles.mainProfileImageItem}
          />
        </ImageBackground>

        {/*user name and question section*/}
        <View style={styles.userTextContainer}>
          {/*user name items*/}
          <Text style={styles.userTextNameItem}>
            {user?.firstName} {user?.lastName}
          </Text>

          {/*question item text*/}
          <Text style={styles.questionTextItem}>Who would you like to be?</Text>
        </View>
      </View>
    );
  }

  // user profile list section
  function renderUserProfileListSection() {
    return (
      <View style={styles.userProfileListContainer}>
        <FlatList
          data={[...myProfiles, { plusImage: true }]}
          keyExtractor={(item, index) => index.toString()}
          onRefresh={refetch}
          refreshing={isFetching}
          numColumns={2}
          columnWrapperStyle={styles.flColumnWrapper}
          contentContainerStyle={styles.flContentContainer}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => {
            if (item.plusImage && myProfiles?.length < 4) {
              //return plus sign to add profile
              return (
                <Pressable
                  onPress={onAddProfilePress}
                  style={styles.plusIconContainer}
                >
                  {/*plus icon context section*/}
                  <View style={styles.plusIconContent}>
                    <Image
                      source={icons.plusBtn}
                      style={styles.plusIconImageItem}
                    />
                    <Text style={styles.plusIconTextItem}>Add profile</Text>
                  </View>
                </Pressable>
              );
            }

            //return user profile list when available
            if (index < 4) {
              return (
                <Pressable
                  onPress={() => EditProfileItem(item)}
                  style={styles.plusIconContainer}
                >
                  {/*user profile item content section*/}
                  <View style={styles.userProfileContent}>
                    {item._id === current_profile?._id ? (
                      <LinearGradient
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        colors={[
                          COLORS.purpleDarker,
                          COLORS.purpleDark,
                          COLORS.purple,
                        ]}
                        style={styles.gradientColorContainerProfileScreen}
                      >
                        <Image
                          source={
                            item?.profileImage
                              ? {
                                uri:
                                  image[item?.profileImage] ??
                                  item?.profileImage,
                              }
                              : images.defaultRounded
                          }
                          style={styles.profilePictureItemActive}
                        />
                      </LinearGradient>
                    ) : (
                      <Image
                        source={
                          item?.profileImage
                            ? {
                              uri:
                                image[item?.profileImage] ??
                                item?.profileImage,
                            }
                            : images.defaultRounded
                        }
                        style={styles.userProfileImageItem}
                      />
                    )}
                    <Text
                      style={[
                        styles.userProfileJobTitleName,
                        {
                          marginTop: item._id === current_profile?._id ? 5 : 15,
                        },
                      ]}
                    >
                      {item?.jobTitleId?.jobTitle}
                    </Text>
                  </View>
                </Pressable>
              );
            } else {
              <></>;
            }
          }}
        />
      </View>
    );
  }

  //render bottom section
  function renderBottomActionSection() {
    return (
      <Pressable
        onPress={() => navigation.navigate("ProfileBenefitsScreen")}
        style={styles.bottomActionContainer}
      >
        <Text style={styles.bottomActionTextItem}>
          Profile benefits & pricing
        </Text>
      </Pressable>
    );
  }

  //render screen content section
  function renderProfileSection() {
    return (
      <View style={styles.profileCententh}>
        {renderHeaderSection()}
        {renderUserProfileInfoSection()}
        {renderUserProfileListSection()}
        {renderBottomActionSection()}
      </View>
    );
  }

  //screen render presentation section
  return (
    <View style={styles.container}>
      {isLoading
        ? renderLoadingComponent()
        : fetchError
          ? EmptyFlatlistComponentNetworkIssue()
          : renderProfileSection()}
    </View>
  );
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  //screen container
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //loading container
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    top: "40%", // Please adjust this as required. Replace 40% with something solid
  },
  loadingImageItem: {
    width: 150,
    height: 150,
  },

  //header component
  headerComponentContainer: {
    marginBottom: "10%",
  },

  //profile container
  profileCententh: {
    top: Platform.OS === "ios" ? "5%" : "0%",
    marginHorizontal: 5,
  },

  //profile section
  profileSectionContainer: {
    top: 15,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  mainProfileImageContainer: {
    top: 10,
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  mainProfileImageItem: {
    top: 1.8,
    left: 2,
    width: 95,
    height: 95,
    resizeMode: "cover",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.black,
  },
  userTextContainer: {
    marginTop: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  userTextNameItem: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "PoppinsBold",
  },
  questionTextItem: {
    marginTop: 15,
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //user profile list section
  userProfileListContainer: {
    top: 35,
    paddingVertical: 5,
    minHeight: Platform.OS === "ios" ? "60%" : "55%",
  },
  flColumnWrapper: {
    justifyContent: "space-between",
    marginTop: Platform.OS === "ios" ? SIZES.padding : 10,
  },
  flContentContainer: {
    paddingHorizontal: SIZES.padding * 2,
    height: Platform.OS === "ios" ? "49.5%" : "100%",
  },
  plusIconContainer: {
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  plusIconContent: {
    flexDirection: "column",
  },
  plusIconImageItem: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    bottom: 10,
  },
  plusIconTextItem: {
    bottom: 5,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
    alignSelf: "center",
  },
  userProfileContent: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  gradientColorContainerProfileScreen: {
    width: 110,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    borderWidth: 1,
  },
  userProfileImageItem: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderRadius: 100,
  },
  profilePictureItemActive: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderRadius: 100,
    borderColor: COLORS.black,
    borderWidth: 3,
  },
  userProfileJobTitleName: {
    marginBottom: 15,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
    textAlign: "center",
    textTransform: "capitalize"
  },

  //bottom screen section
  bottomActionContainer: {
    top: Platform.OS === "ios" ? "-10%" : "0%",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomActionTextItem: {
    color: COLORS.lightBlue,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
});

export default ProfileScreen;
