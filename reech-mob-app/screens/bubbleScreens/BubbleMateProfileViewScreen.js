import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Modal,
  Pressable,
  ImageBackground,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  FontAwesome5,
  Entypo,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SliderBox } from "react-native-image-slider-box";
import { useSocket } from "@/utils/socket";
import { useCreateChatRoomMutation } from "@/redux/api/chat";
import Toast from "react-native-toast-message";

//customs
import { COLORS, icons, images } from "../../constants";
import NavHeader from "@/components/Headers/NavHeader";
import { useReadSeekerQuery } from "../../redux/api/profile";
import { useReadUserQuery } from "../../redux/api/api-slice";
import { useSelector } from "react-redux";

//image slider content
const imageSliderCollection = [
  require("../../assets/images/people/p1.jpg"),
  require("../../assets/images/people/p2.jpg"),
  require("../../assets/images/people/p3.jpg"),
  require("../../assets/images/people/p6.jpg"),
  require("../../assets/images/people/p10.jpg"),
];

const BubbleMateProfileViewScreen = ({ route }) => {
  const navigation = useNavigation();
  const socket = useSocket();
  const { userId, profileId } = route.params;

  const image = useSelector((state) => state.bubble_images.bubbleImages);
  const current_user = useSelector((state) => state.user.current_user);

  const { data: profile } = useReadSeekerQuery(profileId);
  const { data: user } = useReadUserQuery(userId);
  const [createChatRoomFn] = useCreateChatRoomMutation();

  const showError = (res) =>
    Toast.show({
      type: "error",
      text1: "Error",
      text2: res.error.data?.error ?? "Something went wrong. Please try again",
    });

  // navigate to inbox
  const navigateToChat = (item) => {
    navigation.navigate("MainMessageFullViewScreen", {
      id: item?._id,
      name: item?.name,
      avatar: item?.avatar
    });
  }

  const handleChat = (chatter, chattee) => {
    const payload = {
      userIds: [chattee._id],
      name: `${chattee.firstName} ${chattee.lastName}`,
      initiatorsName: `${chatter.firstName} ${chatter.lastName}`,
      chatInitiator: chatter._id,
      avatar: chattee.profileImage,
      initiatorsAvatar: chatter.profileImage,
    };

    createChatRoomFn(payload)
      .then((res) => {
        if (res.error) {
          showError(res);
          return;
        }
        navigateToChat(res?.data?.data);
      })
      .catch((err) => {
        console.error(err);
      })
    socket.emit("create-room", payload)
  }

  const onSavedToDraftsPressed = () => {
    navigation.navigate("SavedToDraftsScreen");
  };

  const onExperiencesPressed = () => {
    navigation.navigate("ProfileBubbleExperienceScreen", {
      profileId: profileId,
      userId: userId,
    });
  };

  const onVouchesPress = () => {
    navigation.navigate("ProfileBubbleVouchScreen", { profileId: profileId });
  };

  //screen scroll animation
  let AnimatedHeaderValue = new Animated.Value(0);
  const Header_Min_Height = 40; // min height of the header
  const Header_Max_Height = 40; // max height of the header

  const animatedHeaderBackgroundColor = AnimatedHeaderValue.interpolate({
    inputRange: [0, Header_Max_Height - Header_Min_Height],
    outputRange: [COLORS.transparent, COLORS.transparent],
    extrapolate: "clamp",
  });

  const animateHeaderHeight = AnimatedHeaderValue.interpolate({
    inputRange: [0, Header_Max_Height - Header_Min_Height],
    outputRange: [Header_Max_Height, Header_Min_Height],
    extrapolate: "clamp",
  });

  const [moreOptionModal, setMoreOptionModal] = useState(false);

  const onPrioritiesPressed = () => {
    console.log("onPrioritiesPressed");
  };

  const onMutePressed = () => {
    console.log("onMutePressed");
  };

  const onRemovePressed = () => {
    console.log("onRemovePressed");
  };

  const onReportPressed = () => {
    console.log("onReportPressed");
  };

  //render screen header
  function headerSection() {
    return (
      <Animated.View
        style={[
          styles.headerContainer,
          {
            height: animateHeaderHeight,
            backgroundColor: animatedHeaderBackgroundColor,
          },
        ]}
      >
        <View style={styles.headerContainerComponent}>
          <NavHeader message="What would you like to do?" />
        </View>
      </Animated.View>
    );
  }

  //profile slider section
  function renderProfileSliderSection() {
    return (
      <View style={styles.sliderImageContainer}>
        <SliderBox
          images={imageSliderCollection}
          firstItem={0}
          autoplay={true}
          autoplayInterval={3000}
          paginationBoxVerticalPadding={10}
          dotColor={COLORS.purple}
          inactiveDotColor={COLORS.darkGray}
          dotStyle={styles.sliderDotStyle}
          ImageComponentStyle={styles.sliderImageItem}
          imageLoadingColor={COLORS.purple}
          circleLoop={false}
          onCurrentImagePressed={(index) => console.log(index + 1)}
        />
      </View>
    );
  }

  //more option section
  function renderMoreOptionSection() {
    return (
      <View style={styles.moreOptionContainer}>
        <Entypo
          onPress={() => setMoreOptionModal(true)}
          name="dots-three-vertical"
          size={18}
          color={COLORS.white}
        />
      </View>
    );
  }

  //more option modal section
  function renderProfileMoreOptionModal() {
    return (
      <Modal
        visible={moreOptionModal}
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        style={styles.moreModalContainer}
      >
        <ImageBackground
          source={icons.popupBg}
          style={[styles.moreInnerModalContainer, {
            marginTop: current_user?._id === userId ?
              Platform.OS === "ios" ? "185%" : "175%" :
              Platform.OS === "ios" ? "135%" : "125%",
          }]}
        >
          {/*modal close action section*/}
          <View style={styles.moreInnerModalContent}>
            <Pressable onPress={() => setMoreOptionModal(false)}>
              <Ionicons name="close" size={18} color={COLORS.white} />
            </Pressable>
          </View>

          {/*more modal option section */}
          {current_user?._id === userId ? <View style={styles.moreModalOptionContent}>
            {/*edit profile option*/}
            <Pressable
              onPress={() => {
                navigation.navigate("EditProfileInfoScreen", {
                  profile: profile,
                });
                setMoreOptionModal(false);
              }}
              style={styles.moreModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.moreModalOptionIconContainer}>
                <FontAwesome5 name="user-edit" size={24} color={COLORS.white} />
              </View>

              {/*modal option text section*/}
              <View style={styles.moreModalOptionTextContainer}>
                <Text style={styles.moreModalOptionHeaderText}>Edit my profile</Text>
                <Text style={styles.moreModalOptionInfoText}>
                  Click to edit your {profile?.jobTitleId?.jobTitle} profile
                </Text>
              </View>
            </Pressable>
          </View> :
            <View style={styles.moreModalOptionContent}>
              {/*prior option*/}
              <Pressable
                onPress={() => onPrioritiesPressed()}
                style={styles.moreModalOptionContainer}
              >
                {/*icon section*/}
                <View style={styles.moreModalOptionIconContainer}>
                  <Image
                    source={icons.noHeart}
                    style={{ width: 25, height: 25 }}
                  />
                </View>

                {/*modal option text section*/}
                <View style={styles.moreModalOptionTextContainer}>
                  <Text style={styles.moreModalOptionHeaderText}>Prioritise</Text>
                  <Text style={styles.moreModalOptionInfoText}>
                    See more from {user?.firstName} {user?.lastName}
                  </Text>
                </View>
              </Pressable>

              {/*mute option*/}
              <Pressable
                onPress={() => onMutePressed()}
                style={styles.moreModalOptionContainer}
              >
                {/*icon section*/}
                <View style={styles.moreModalOptionIconContainer}>
                  <FontAwesome5
                    name="volume-mute"
                    size={22}
                    color={COLORS.white}
                  />
                </View>

                {/*modal option text section*/}
                <View style={styles.moreModalOptionTextContainer}>
                  <Text style={styles.moreModalOptionHeaderText}>Mute</Text>
                  <Text style={styles.moreModalOptionInfoText}>
                    Take a break from {user?.firstName} {user?.lastName}
                  </Text>
                </View>
              </Pressable>

              {/*remove option*/}
              <Pressable
                onPress={() => onRemovePressed()}
                style={styles.moreModalOptionContainer}
              >
                {/*icon section*/}
                <View style={styles.moreModalOptionIconContainer}>
                  <Image
                    source={icons.noUser}
                    style={{ width: 25, height: 25 }}
                  />
                </View>

                {/*modal option text section*/}
                <View style={styles.moreModalOptionTextContainer}>
                  <Text style={styles.moreModalOptionHeaderText}>Remove</Text>
                  <Text style={styles.moreModalOptionInfoText}>
                    Remove {user?.firstName} {user?.lastName} from your bubble
                  </Text>
                </View>
              </Pressable>

              {/*report option*/}
              <Pressable
                onPress={() => onReportPressed()}
                style={styles.moreModalOptionContainer}
              >
                {/*icon section*/}
                <View style={styles.moreModalOptionIconContainer}>
                  <Image
                    source={icons.noFlag}
                    style={{ width: 25, height: 25 }}
                  />
                </View>

                {/*modal option text section*/}
                <View style={styles.moreModalOptionTextContainer}>
                  <Text style={styles.moreModalOptionHeaderText}>Report</Text>
                  <Text style={styles.moreModalOptionInfoText}>
                    {`Do you want to hide ${user?.firstName}'s posts?`}
                  </Text>
                </View>
              </Pressable>
            </View>
          }
        </ImageBackground>
      </Modal>
    );
  }

  //more option section
  function renderProfileNameSection() {
    return (
      <View style={styles.profileNameAndTabsContainer}>
        {/*empty item section*/}
        <View style={styles.emptyContainer} />

        {/*profile name section*/}
        <View style={styles.profileNameContainer}>
          {/**/}
          <Text style={styles.profileNameTextItem}>
            {profile?.jobTitleId?.jobTitle}{" "}
          </Text>
          <View style={styles.underLinerItem} />
        </View>

        {/*notes section*/}

        <TouchableOpacity
          onPress={() => {
            {
              current_user?._id === userId ?
                (navigation.navigate("LoggedInBubbleProfileNotesScreen", { profile: profile }))
                :
                null
            }
          }}
          style={styles.tabsContainer}
        >
          {current_user?._id === userId &&
            <MaterialCommunityIcons
              name="clipboard-text-multiple-outline"
              size={22}
              color={COLORS.white}
            />}
        </TouchableOpacity>
      </View>
    );
  }

  //name and picture section
  function renderNameAndProfileSection() {
    return (
      <View style={styles.userNameAndProfileContainer}>
        {/*user name text section*/}
        <View style={styles.userNameSectionContainer}>
          <Text style={styles.userNameTextItem}>
            {user?.firstName} {user?.lastName}
          </Text>

          {/*user action section*/}
          {current_user?._id === user?._id ?
            <View style={styles.userActionsSectionContainer}>
              {/*save to drafts action section*/}
              <TouchableOpacity style={styles.actionsTextContainer}>
                <Text
                  onPress={onSavedToDraftsPressed}
                  style={styles.actionTextItem}
                >
                  See your drafts
                </Text>
              </TouchableOpacity>
            </View> :
            <View style={styles.userActionSectionContainer}>
              {/*message action section*/}
              <TouchableOpacity style={styles.actionTextContainer}>
                <Text
                  onPress={() => handleChat(current_user, user)}
                  style={styles.actionTextItem}
                >
                  Message
                </Text>
              </TouchableOpacity>

              {/*vouch action section*/}
              <TouchableOpacity style={styles.actionTextContainer}>
                <Text
                  onPress={() =>
                    navigation.navigate("VouchForSingleBubbleMateScreen", { selectedMate: user, profileId: profileId })
                  }
                  style={styles.actionTextItem}
                >
                  Vouch
                </Text>
              </TouchableOpacity>
            </View>}
        </View>

        {/*user profile picture section*/}
        <View style={styles.userProfilePictureSection}>
          <Image
            source={
              profile?.profileImage
                ? { uri: image[profile?.profileImage] ?? profile?.profileImage }
                : images.defaultRounded
            }
            style={styles.userProfilePictureItem}
          />
        </View>

        {/*user account picture section*/}
        <View style={styles.userAccountPictureContainer}>
          <Image
            source={
              user?.profileImage
                ? { uri: image[user?.profileImage] ?? user?.profileImage }
                : images.defaultRounded
            }
            style={styles.userAccountPictureItem}
          />
        </View>
      </View>
    );
  }

  //render experience buttons
  function renderExperienceVouchSection() {
    return (
      <View style={styles.experienceActionSectionContainer}>
        {/*experience section*/}
        <LinearGradient
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
          style={styles.experienceLinearContainer}
        >
          <TouchableOpacity
            onPress={onExperiencesPressed}
            style={styles.textActionContainer}
          >
            <Text style={styles.actionTextItemButton}>Experiences</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/*vouches section*/}
        <LinearGradient
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
          style={styles.vouchesLinearContainer}
        >
          <TouchableOpacity
            onPress={onVouchesPress}
            style={styles.textActionContainer}
          >
            <Text onPress={onVouchesPress} style={styles.actionTextItemButton}>
              Vouches
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  //render profile info icon
  function renderProfileMoreInfoSection() {
    return (
      <View style={styles.profileMoreInfoIconContainer}>
        <FontAwesome5
          onPress={() =>
            navigation.navigate("BubbleMateProfileAboutMeScreen", {
              profile: profile,
              user: user,
            })
          }
          name="arrow-circle-right"
          size={33}
          color={COLORS.white}
        />
      </View>
    );
  }

  //screen content list
  function renderScreenContentSection() {
    return (
      <>
        {headerSection()}
        <View
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: AnimatedHeaderValue } } }],
            { useNativeDriver: false }
          )}
          style={styles.screenViewContentContainer}
        >
          {renderProfileSliderSection()}
          {renderMoreOptionSection()}
          {renderProfileNameSection()}
          {renderNameAndProfileSection()}
          {renderExperienceVouchSection()}
          {renderProfileMoreInfoSection()}
          {renderProfileMoreOptionModal()}
        </View>
      </>
    );
  }

  //screen content section
  return <View style={styles.container}>{renderScreenContentSection()}</View>;
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerContainer: {
    marginTop: "12%",
    zIndex: 99,
  },
  headerContainerComponent: {
    top: Platform.OS === "ios" ? -5 : -45,
  },
  loadingContainer: {
    flex: 1,
  },

  //slider image section
  sliderImageContainer: {
    top: 0,
  },
  sliderDotStyle: {
    height: 5,
    width: Platform.OS === "ios" ? 70 : 58,
  },
  sliderImageItem: {
    height: Platform.OS === "ios" ? 480 : 360,
    width: "100%",
    resizeMode: "cover",
  },

  //screen view section
  screenViewContentContainer: {
    top: -90,
  },

  //more option
  moreOptionContainer: {
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingVertical: 10,
  },

  //more modal section
  moreModalContainer: {
    marginTop: 10,
  },
  moreInnerModalContainer: {
    flex: 1,
    padding: "4%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  moreInnerModalContent: {
    right: 5,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  moreModalOptionContent: {
    left: Platform.OS === "ios" ? 18 : 30,
    flexDirection: "column",
  },
  moreModalOptionContainer: {
    top: 15,
    marginBottom: 25,
    flexDirection: "row",
  },
  moreModalOptionIconContainer: {
    width: "15%",
    justifyContent: "center",
    alignItems: "center",
  },
  moreModalOptionTextContainer: {
    left: Platform.OS === "ios" ? 20 : 20,
    width: "65%",
    flexDirection: "column",
  },
  moreModalOptionHeaderText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  moreModalOptionInfoText: {
    marginTop: 2,
    opacity: 0.8,
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },

  //profile name section
  profileNameAndTabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    width: "100%",
  },
  emptyContainer: {
    width: "15%",
  },
  profileNameContainer: {
    flexDirection: "column",
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
  },
  profileNameTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  underLinerItem: {
    width: "60%",
    marginTop: 10,
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
  },
  tabsContainer: {
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
  },

  //userName and picture section
  userNameAndProfileContainer: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: 5,
  },
  userNameSectionContainer: {
    width: "50%",
    paddingVertical: 5,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  userNameTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
    textAlign: "center",
  },
  userActionsSectionContainer: {
    width: "100%",
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  userActionSectionContainer: {
    width: "100%",
    marginTop: 20,
    flexDirection: "row",
  },
  actionsTextContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  actionTextContainer: {
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  actionTextItem: {
    color: COLORS.purple,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  userProfilePictureSection: {
    width: "50%",
    paddingVertical: 5,
    flexDirection: "row",
  },
  userProfilePictureItem: {
    width: Platform.OS === "ios" ? 140 : 120,
    height: Platform.OS === "ios" ? 140 : 120,
    resizeMode: "cover",
    borderRadius: 140,
    alignSelf: "center",
    left: 10,
  },
  userAccountPictureContainer: {
    top: Platform.OS === "ios" ? 95 : 80,
    right: 95,
  },
  userAccountPictureItem: {
    width: 60,
    height: 60,
    resizeMode: "cover",
    borderRadius: 8,
    borderColor: COLORS.black,
    borderWidth: 2,
  },

  //experience section
  experienceActionSectionContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    paddingVertical: 10,
    marginTop: 20,
  },
  experienceLinearContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    height: 47,
    width: "63.5%",
  },
  textActionContainer: {
    width: "98%",
    height: "89%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  vouchesLinearContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    height: 47,
    width: "35%",
  },
  actionTextItemButton: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //profile more info icon section
  profileMoreInfoIconContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? 10 : 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});
export default BubbleMateProfileViewScreen;
