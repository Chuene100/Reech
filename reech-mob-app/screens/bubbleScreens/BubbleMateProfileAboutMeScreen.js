import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  FontAwesome5,
  Ionicons,
  Entypo,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import ImageModal from "react-native-image-modal";
import { LinearGradient } from "expo-linear-gradient";
import { SimpleAccordion } from "react-native-simple-accordion";
import { useSocket } from "@/utils/socket";
import { useCreateChatRoomMutation } from "@/redux/api/chat";
import Toast from "react-native-toast-message";

//customs
import { COLORS, icons, images } from "../../constants";
import NavHeader from "@/components/Headers/NavHeader";
import { useSelector } from "react-redux";
import { Pressable } from "react-native";

const BubbleMateProfileAboutMeScreen = ({ route }) => {
  const navigation = useNavigation();
  const socket = useSocket();
  const { user, profile } = route.params;

  const current_user = useSelector((state) => state.user.current_user);
  const image = useSelector((state) => state.bubble_images.bubbleImages);

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
      profileId: profile?._id,
    });
  };

  const onVouchesPress = () => {
    navigation.navigate("ProfileBubbleVouchScreen", { profileId: profile?._id });
  };

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
      <View style={styles.headerContainer}>
        <NavHeader
          message="What would you like to do?"
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
            marginTop: current_user?._id === user?._id ?
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
          {current_user?._id === user?._id ? <View style={styles.moreModalOptionContent}>
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
          <Text style={styles.profileNameTextItem}>
            {profile?.jobTitleId?.jobTitle}
          </Text>
          <View style={styles.underLinerItem} />
        </View>

        {/*notes section*/}
        <TouchableOpacity
          onPress={() => {
            {
              current_user?._id === user?._id ?
                (navigation.navigate("LoggedInBubbleProfileNotesScreen", { profile: profile }))
                :
                null
            }
          }}
          style={styles.tabsContainer}
        >
          {current_user?._id === user?._id &&
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
            <View style={styles.userActionSectionsContainer}>
              {/*save to drafts action section*/}
              <TouchableOpacity style={styles.actionTextsContainer}>
                <Text
                  onPress={onSavedToDraftsPressed}
                  style={styles.actionTextItem}
                >
                  See your drafts
                </Text>
              </TouchableOpacity>
            </View> :
            <View style={styles.userActionSectionContainer}>
              <TouchableOpacity style={styles.actionTextContainer}>
                <Text
                  onPress={() => handleChat(current_user, user)}
                  style={styles.actionTextItem}
                >
                  Message
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionTextContainer}>
                <Text
                  onPress={() =>
                    navigation.navigate("VouchForSingleBubbleMateScreen", { selectedMate: user, profileId: profile?._id })
                  }
                  style={styles.actionTextItem}
                >
                  Vouch
                </Text>
              </TouchableOpacity>
            </View>
          }
        </View>

        {/*user profile picture section*/}
        <TouchableOpacity
          onPress={() => navigation.navigate("BubbleMateProfileAboutMeScreen")}
          style={styles.userProfilePictureSection}
        >
          <ImageModal
            swipeToDismiss={true}
            resizeMode={"cover"}
            imageBackgroundColor={COLORS.transparent}
            style={styles.userProfilePictureItem}
            modalImageStyle={{
              resizeMode: "contain",
            }}
            source={
              profile?.profileImage
                ? { uri: image[profile?.profileImage] ?? profile?.profileImage }
                : images.defaultRounded
            }
          />
        </TouchableOpacity>

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

  //interest section
  function renderInterestSection() {
    return (
      <View style={styles.interestSectionContainer}>
        {/*top text section*/}
        <View style={styles.interestTopTextContainer}>
          <Text style={
            profile.commitmentLevel === "Side gig" ?
              styles.interestBottomTextItem : styles.interestTopTextItem}>
            Side gig
          </Text>
          <Text style={
            profile.commitmentLevel === "Main job" || profile.commitmentLevel === "Professional" ?
              styles.interestBottomTextItem : styles.interestTopTextItem}>
            Professional
          </Text>
        </View>

        {/*border line section*/}
        <View style={styles.borderLineContainer}>
          <View style={styles.borderLineItem} />
          <Entypo
            name="dot-single"
            size={60}
            color={COLORS.purple}
            style={{
              right:
                profile.commitmentLevel === "Side gig"
                  ? "44%"
                  : profile.commitmentLevel === "Interest" ||
                    profile.commitmentLevel === "Passion project"
                    ? "0%"
                    : profile.commitmentLevel === "Main job" ||
                      profile.commitmentLevel === "Professional"
                      ? "-44%"
                      : "44%",
            }}
          />
        </View>

        {/*bottom text section*/}
        <View style={styles.interestBottomTextContainer}>
          <Text style={
            profile.commitmentLevel === "Interest" || profile.commitmentLevel === "Passion project" ?
              styles.interestBottomTextItem : styles.interestTopTextItem}>
            Passion project
          </Text>
        </View>
      </View>
    );
  }

  //profession section
  function renderProfileSection() {
    return (
      <View style={styles.profileSectionContainer}>
        <View style={styles.profileContentContainer}>
          <Text style={styles.profileHeadingTextItem}>Professional</Text>
        </View>
        <View style={styles.profileContentContainer}>
          <Text style={styles.profileHeadingTextItem}>
            Years of experience:{" "}
            <Text style={styles.profileUserInfoItem}>{profile.experience}</Text>
          </Text>
        </View>
        <View style={styles.profileContentContainer}>
          <Text style={styles.profileSubHeadingTextItem}>Speciality: </Text>
          <Text style={styles.profileUserInfoItem}>Climate change</Text>
        </View>
        <View style={styles.profileContentContainer}>
          <Text style={styles.profileSubHeadingTextItem}>Organization: </Text>
          <Text style={styles.profileUserInfoItem}>SANDBI, Intaka Island</Text>
        </View>
        <View style={styles.profileContentContainer}>
          <Text style={styles.profileSubHeadingTextItem}>Current title: </Text>
          <Text style={styles.profileUserInfoItem}>
            {profile?.jobTitleId?.jobTitle}
          </Text>
        </View>
        <View style={styles.profileContentContainer}>
          <Text style={styles.profileHeadingTextItem}>Education: </Text>
          <Text style={styles.profileUserInfoItem}>
            University of California
          </Text>
        </View>
        <View style={styles.profileContentContainer}>
          <Text style={styles.profileHeadingTextItem}>Qualification: </Text>
          <Text style={styles.profileUserInfoItem}>{profile.education}</Text>
        </View>
      </View>
    );
  }

  //skills section
  function renderSkillsSection() {
    return (
      <View style={styles.skillsSectionContainer}>
        <View style={styles.profileContentContainer}>
          <Text style={styles.profileHeadingTextItem}>Skills</Text>
        </View>

        {/*bubble top section*/}
        <View style={styles.bubbleItemsContentContainer}>
          <View style={styles.bubbleItemsContainer}>
            <View style={styles.bubbleItem}>
              <Text style={styles.bubbleText}>Public speaking</Text>
            </View>
          </View>

          <View style={styles.bubbleItemsMediumContainer}>
            <View style={styles.bubbleMediumItem}>
              <Text style={styles.bubbleMediumText}>Campaigning</Text>
            </View>
          </View>
        </View>

        {/*bubble bottom section*/}
        <View style={styles.bubbleItemsBottomContentContainer}>
          <View style={styles.bubbleItemsBottomContainer}>
            <View style={styles.bubbleBottomItem}>
              <Text style={styles.bubbleBottomText}>Legal knowledge</Text>
            </View>
          </View>

          <View style={styles.bubbleItemsMediumBottomContainer}>
            <View style={styles.bubbleMediumBottomItem}>
              <Text style={styles.bubbleMediumBottomText}>
                Critical thinking
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  //faq section
  function renderFAQSection() {
    return (
      <View style={styles.faqSectionContainer}>
        {/*FAQ section*/}
        <SimpleAccordion
          title={"Frequently asked questions"}
          bannerStyle={styles.bannerStyle}
          showArrows={true}
          arrowColor={styles.arrowColor}
          titleStyle={styles.faqTextStyle}
          viewContainerStyle={styles.viewContainerStyle}
          viewInside={
            <View style={styles.faqTextContainer}>
              <Text style={styles.faqTextItemQ}>
                Q: What can individuals do to make a difference for the
                environment?{"\n"}
              </Text>
              <Text style={styles.faqTextItemA}>
                A: Reduce waste: Recycle, compost, and choose products with
                minimal packaging. Avoid single-use items like plastic straws,
                bags, and utensils.
              </Text>

              <Text style={styles.faqTextItemQ}>
                Q: How can we balance economic growth with environmental
                protection?{"\n"}
              </Text>
              <Text style={styles.faqTextItemA}>
                A: Implement environmental regulations: Regulations and
                standards can help ensure that businesses operate in an
                environmentally responsible manner.
              </Text>
            </View>
          }
        />
      </View>
    );
  }

  //screen content list
  function renderScreenContentSection() {
    return (
      <>
        {headerSection()}
        {renderMoreOptionSection()}
        {renderProfileNameSection()}
        {renderNameAndProfileSection()}
        {renderExperienceVouchSection()}
        {renderProfileMoreOptionModal()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollViewContentContainer}
        >
          {renderInterestSection()}
          {renderProfileSection()}
          {renderSkillsSection()}
          {renderFAQSection()}
        </ScrollView>
      </>
    );
  }

  return <View style={styles.container}>{renderScreenContentSection()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerContainer: {
    marginTop: Platform.OS === "ios" ? "12%" : "0%",
    zIndex: 99,
  },

  //scroll view section
  scrollViewContentContainer: {
    top: 0,
    marginBottom: "14%",
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
  userActionSectionsContainer: {
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
  actionTextsContainer: {
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
    left: Platform.OS === "ios" ? 10 : 0,
  },
  userAccountPictureContainer: {
    top: Platform.OS === "ios" ? 95 : 80,
    right: 95,
    zIndex: 99,
  },
  userAccountPictureItem: {
    width: 60,
    height: 60,
    resizeMode: "cover",
    borderRadius: 8,
    borderColor: COLORS.black,
    borderWidth: 2,
  },

  //interest section
  interestSectionContainer: {
    paddingVertical: 10,
    marginVertical: 20,
    height: 100,
    bottom: 10,
  },
  interestTopTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  interestTopTextItem: {
    color: COLORS.darkGray,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  borderLineContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  borderLineItem: {
    top: 30,
    width: "90%",
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
  },
  interestBottomTextContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: -8,
  },
  interestBottomTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },

  //profile section
  profileSectionContainer: {
    paddingBottom: 10,
    paddingHorizontal: 5,
  },
  profileContentContainer: {
    marginVertical: 8,
    flexDirection: "row",
  },
  profileHeadingTextItem: {
    color: COLORS.darkGray,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  profileSubHeadingTextItem: {
    color: COLORS.darkGray,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  profileUserInfoItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
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
    backgroundColor: COLORS.transparent,
    width: "98%",
    height: "89%",
    justifyContent: "center",
    alignItems: "center",
  },
  vouchesLinearContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    height: 47,
    width: "35%",
    zIndex: 99,
  },
  actionTextItemButton: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //skills section
  skillsSectionContainer: {
    marginBottom: 25,
    height: 270,
  },
  bubbleItemsContentContainer: {
    flexDirection: "row",
    width: "100%",
    marginTop: 10,
    marginLeft: Platform.OS === "ios" ? 10 : 0,
  },
  bubbleItemsContainer: {
    paddingVertical: 10,
    marginHorizontal: 10,
    height: 200,
    top: 10,
  },
  bubbleItem: {
    justifyContent: "center",
    alignItems: "center",
    width: 180,
    height: 180,
    borderRadius: 100,
    backgroundColor: "#6F2DA8",
  },
  bubbleText: {
    textAlign: "center",
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
  },
  bubbleItemsMediumContainer: {
    paddingVertical: 10,
    marginHorizontal: 10,
    right: 35,
    bottom: 10,
  },
  bubbleMediumItem: {
    justifyContent: "center",
    alignItems: "center",
    width: 140,
    height: 140,
    borderRadius: 100,
    backgroundColor: COLORS.darkPurple,
  },
  bubbleMediumText: {
    textAlign: "center",
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
  },
  bubbleItemsContentBottomContainer: {
    flexDirection: "row",
    width: "100%",
  },
  bubbleItemsBottomContainer: {
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  bubbleBottomItem: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 100,
    borderRadius: 100,
    left: Platform.OS === "ios" ? 150 : 130,
    bottom: Platform.OS === "ios" ? 80 : 85,
    backgroundColor: "#8F00FF",
  },
  bubbleBottomText: {
    textAlign: "center",
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
  },
  bubbleItemsMediumBottomContainer: {
    paddingVertical: 10,
    marginHorizontal: 10,
    left: 230,
    backgroundColor: COLORS.transparent,
  },
  bubbleMediumBottomItem: {
    justifyContent: "center",
    alignItems: "center",
    width: 120,
    height: 120,
    borderRadius: 100,
    left: Platform.OS === "ios" ? 13 : -5,
    bottom: 230,
    backgroundColor: "#9966CB",
  },
  bubbleMediumBottomText: {
    width: "50%",
    textAlign: "center",
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
  },

  //faq section
  faqSectionContainer: {
    marginTop: 10,
    borderWidth: 3,
    borderRadius: 10,
    borderColor: COLORS.purple,
    backgroundColor: COLORS.black,
  },
  bannerStyle: {
    backgroundColor: COLORS.black,
  },
  arrowColor: {
    color: COLORS.black,
  },
  faqTextStyle: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  faqTextContainer: {
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: COLORS.black,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "102%",
  },
  faqTextItemQ: {
    top: 2,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    color: COLORS.purple,
  },
  faqTextItemA: {
    fontSize: 12,
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    marginTop: -8,
    marginBottom: 10,
  },
  viewContainerStyle: {
    backgroundColor: COLORS.black,
  },
});

export default BubbleMateProfileAboutMeScreen;
