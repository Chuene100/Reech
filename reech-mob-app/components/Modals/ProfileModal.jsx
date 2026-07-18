import React, { useEffect } from "react";
import { FlatList, Image, ImageBackground, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, icons, images } from "../../constants";
import { AntDesign, Octicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentProfile } from "@/redux/features/current_profile-slice";
import { useListMyProfilesQuery } from "@/redux/api/api-slice";
import { setProfileImage } from "@/redux/features/profile-image-slice";

const ProfileModal = ({isModalVisible, closeModal }) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.current_user);
  const current_profile = useSelector(
    (state) => state.currentProfile.current_profile
  );
  const cache_profiles = useSelector((state) => state.profiles.user_profiles);
  const image = useSelector((state) => state.profile_images.profileImages);

  const {
    data: fetched_profiles,
    isLoading,
    error: fetchError,
  } = useListMyProfilesQuery(user?._id);

  useEffect(() => {
    if (fetched_profiles?.data) {
      dispatch(setProfileImage({ user_profiles: fetched_profiles?.data }));
    }
  }, [fetched_profiles]);

  useEffect(() => {
    if (!current_profile || Object.keys(current_profile).length === 0) {
      dispatch(
        setCurrentProfile({ current_profile: fetched_profiles?.data[0] })
      );
    }
  }, [fetched_profiles]);

  useEffect(() => {
    if (fetched_profiles?.data)
      for (var dt in fetched_profiles?.data) {
        const df = fetched_profiles?.data[dt];
        if (!image[df.profileImage] && df.profileImage?.startsWith("http"))
          _loadImage(df.profileImage);
      }
  }, [fetched_profiles]);

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

  const changeCurrentProfile = (profile) => {
    dispatch(setCurrentProfile({ current_profile: profile }));
  };

  return (
      <Modal
          visible={isModalVisible}
          statusBarTranslucent={true}
          animationType="slide"
          transparent={true}
          style={styles.profileContainerModal}
      >
          <ImageBackground
            src={icons.popupBg}
            style={styles.profileModalContainer}
          >
            <View style={styles.profileModalHeader}>
              <Pressable onPress={closeModal}>
                <AntDesign
                  name="closecircle"
                  size={18}
                  color={COLORS.white}
                />
              </Pressable>
            </View>
            <View style={styles.profileLiner}></View>

            <Text style={styles.modalHeader}>
              Would you like to switch profiles?
            </Text>

            {isLoading ? (
              <Text style={styles.placeholder}> Loading...</Text>
            ) : fetchError ? (
              <Text style={styles.placeholder}>No internet connection!</Text>
            ) : (
              <FlatList
                data={cache_profiles?.data ?? fetched_profiles?.data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => {
                  return (
                    <>
                      <View style={styles.profileContainer}>
                        <ScrollView
                          showsVerticalScrollIndicator={false}
                          style={styles.profileContent}
                        >
                          <View style={styles.profileItem}>
                            {item._id === current_profile?._id ? (
                              <LinearGradient
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                colors={[
                                  COLORS.purpleDarker,
                                  COLORS.purpleDark,
                                  COLORS.purple,
                                ]}
                                style={styles.gradientColorContainer}
                              >
                                <TouchableOpacity
                                  onPress={() => changeCurrentProfile(item)}
                                  style={styles.profileIconActive}
                                >
                                  <Image
                                    source={
                                      item.profileImage
                                        ? {
                                            uri:
                                              image[item.profileImage] ??
                                              item.profileImage,
                                          }
                                        : images.defaultRounded
                                    }
                                    style={styles.profilePictureItemActive}
                                  />
                                </TouchableOpacity>
                              </LinearGradient>
                            ) : (
                              <TouchableOpacity
                                onPress={() => changeCurrentProfile(item)}
                                style={styles.profileIcon}
                              >
                                <Image
                                  source={
                                    item.profileImage
                                      ? {
                                          uri:
                                            image[item.profileImage] ??
                                            item.profileImage,
                                        }
                                      : images.defaultRounded
                                  }
                                  style={styles.profilePictureItem}
                                />
                              </TouchableOpacity>
                            )}

                            {/*profile name section*/}
                            <View
                              style={
                                item._id === current_profile?._id
                                  ? styles.profileTextContainerActive
                                  : styles.profileTextContainer
                              }
                            >
                              <Text style={styles.profileTextHeading}>
                                {item?.jobTitleId?.jobTitle}
                                {"  "}
                                {item._id === current_profile?._id ? (
                                  <Octicons
                                    name="dot-fill"
                                    size={16}
                                    color={COLORS.purple}
                                  />
                                ) : null}
                              </Text>
                            </View>
                          </View>
                        </ScrollView>
                      </View>
                    </>
                  );
                }}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
              />
            )}
          </ImageBackground>
      </Modal>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: "column",
    marginBottom: "10%",
    borderRadius: 10,
    backgroundColor: COLORS.transparent,
  },
  textContainer: {
    marginHorizontal: 25,
    padding: 5,
  },

  //profile modal
  placeholder: {
    fontSize: 23,
    top: 50,
    textAlign: "center",
    position: "relative",
    color: COLORS.gray,
  },
  profileContainerModal: {
    height: "50%",
    marginTop: 10,
  },
  profileModalContainer: {
    flex: 1,
    top: 22,
    width: "112%",
    right: "6%",
    marginTop: Platform.OS === "ios" ? "110%" : "115%",
    padding: "6%",
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    backgroundColor: COLORS.black,
  },
  profileModalHeader: {
    left: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  profileLiner: {
    alignSelf: "center",
    width: "40%",
    marginTop: "2.5%",
    marginBottom: "5%",
    borderRadius: 20,
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth * 3,
  },
  modalHeader: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
    alignSelf: "center",
    paddingBottom: 30,
  },
  profileContainer: {
    flex: 1,
  },
  profileContent: {
    flexDirection: "column",
  },
  profileItem: {
    marginBottom: "5%",
    flexDirection: "row",
  },
  gradientColorContainer: {
    width: Platform.OS === "ios" ? 80 : 60,
    height: Platform.OS === "ios" ? 80 : 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    borderWidth: 1,
  },
  profileIconActive: {
    width: "90%",
  },
  profileIcon: {
    width: "15%",
  },
  profilePictureItem: {
    width: Platform.OS === "ios" ? 80 : 60,
    height: Platform.OS === "ios" ? 80 : 60,
    resizeMode: "cover",
    borderRadius: 50,
  },
  profilePictureItemActive: {
    width: Platform.OS === "ios" ? 70 : 52,
    height: Platform.OS === "ios" ? 70 : 52,
    resizeMode: "cover",
    borderRadius: 50,
    borderWidth: 2,
  },
  profileTextContainerActive: {
    flexDirection: "column",
    justifyContent: "center",
    left: Platform.OS === "ios" ? "25%" : "36%",
    width: "56.6%",
  },
  profileTextContainer: {
    flexDirection: "column",
    justifyContent: "center",
    left: "52%",
    width: "56%",
  },
  profileTextHeading: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "400",
  },
  profileButtonContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    top: 16,
    left: 15,
    width: 100,
    height: 50,
  },
});

export default ProfileModal;