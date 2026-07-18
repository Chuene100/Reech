import React, { useState, useEffect } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Platform,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  FontAwesome,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import moment from "moment";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

//import customs
import { COLORS, icons, images } from "../../../../constants";
import NavHeader from "@/components/Headers/NavHeader";
import { useUpdateBubbleMutation } from "../../../../redux/api/bubble";
import { updateBubbleFeedLike } from "../../../../redux/features/bubble-slice";
import { useSendNotificationMutation } from "../../../../redux/api/notification";

const ExperienceFullViewScreen = ({ route }) => {
  const dispatch = useDispatch();

  const { data } = route.params;

  const image = useSelector((state) => state.profile_images.profileImages);
  const user = useSelector((state) => state.user.current_user);
  const item = useSelector((state) =>
    state.bubble.bubble_feed.find((bub) => bub._id === data?._id)
  );

  const [updateBubbleFn] = useUpdateBubbleMutation();
  
  const [sendNotificationFn] = useSendNotificationMutation();

  
  const [isAppreciated, setAppreciated] = useState(false);

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

  const showError = (res) =>
    Toast.show({
      type: "error",
      text1: "Error",
      text2: res.error.data?.error ?? "Something went wrong. Please try again",
    });

  useEffect(() => {
    // eslint-disable-next-line no-unsafe-optional-chaining
    const arr = [...data?.experienceLikeArray];
    var idx = arr.findIndex((obj) => obj.userId === user?._id);
    if (idx !== -1) setAppreciated(true);
  }, [data]);

  const onLikeClicked = async () => {
    const experienceLikeArr = data?.experienceLikeArray;
    const arr = [...experienceLikeArr];

    var idx = arr.findIndex((obj) => obj.userId === user?._id);

    // if (idx === -1) arr.push({ userId: user?._id });
    // const body = {
    //   experienceLikeArray: idx === -1 ? arr : arr.filter((obj) => obj.userId !== user?._id),
    //   experienceLikeCount: (idx === -1 ? arr : arr.filter((obj) => obj.userId !== user?._id)).length,
    // };

    arr.push({ userId: user?._id });

    const body = {
      experienceLikeArray: arr,
      experienceLikeCount: arr.length,
    };

    const notify_body = {
      fromUserId: user?._id,
      toUserId: data?.userId,
      feedId: data?._id,
      status: "appreciate",
    };

    const bubbleId = data?._id;
    dispatch(
      updateBubbleFeedLike({
        bubble: { id: bubbleId, arr: body.experienceLikeArray },
      })
    );

    if (idx === -1) setAppreciated(true);
    else setAppreciated(false);

    await updateBubbleFn({ body, bubbleId })
      .then((res) => {
        if (res.error) {
          showError(res);
          return;
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // eslint-disable-next-line no-undef
    sendNotification(notify_body);
  };

  //header component section
  function renderHeaderComponentSection() {
    return (
      <View style={styles.headerContentTop}>
        <NavHeader
          message="What would you like to do?"
        />
      </View>
    );
  }

  //screen image section
  function renderImageSection() {
    return (
      <View style={styles.experienceImageContainer}>
        <Image
          source={{ uri: data?.experienceImage }}
          style={styles.experienceImageItem}
        />
      </View>
    );
  }

  //experience action section
  function renderExperienceActionSection() {
    return (
      <View style={styles.experienceActionContainer}>
        <View style={styles.experienceActionContent}>
          {/*share option action*/}
          <View style={styles.experienceActionItemContainer}>
            <TouchableOpacity
              style={styles.experienceActionItemContent}
              onPress={() => console.log("share button clicked")}
            >
              <FontAwesome
                name="share-square-o"
                size={20}
                color={COLORS.white}
              />
              <Text style={styles.experienceActionTextItem}>346</Text>
            </TouchableOpacity>
          </View>

          {/*like option action*/}
          <View style={styles.experienceActionItemContainer}>
            <TouchableOpacity
              style={styles.experienceActionItemContent}
              onPress={() => onLikeClicked(item)}
            >
              <MaterialCommunityIcons
                name="hand-clap"
                size={20}
                color={COLORS.white}
              />
              <Text style={styles.experienceActionTextItem}>
                {data?.experienceLikeArray.length}
              </Text>
            </TouchableOpacity>
          </View>

          {/*more option action*/}
          <View style={styles.experienceActionItemContainer}>
            <TouchableOpacity
              style={styles.experienceActionItemContent}
              onPress={() => setMoreOptionModal(true)}
            >
              <MaterialCommunityIcons
                name="dots-vertical"
                size={21}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  //more option modal
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
          style={styles.moreInnerModalContainer}
        >
          {/*modal close action section*/}
          <View style={styles.moreInnerModalContent}>
            <Pressable onPress={() => setMoreOptionModal(false)}>
              <Ionicons name="close" size={18} color={COLORS.white} />
            </Pressable>
          </View>

          {/*more modal option section */}
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
                  style={{ height: 25, width: 25 }}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.moreModalOptionTextContainer}>
                <Text style={styles.moreModalOptionHeaderText}>Prioritise</Text>
                <Text style={styles.moreModalOptionInfoText}>
                  See more from {data?.userId?.firstName}{" "}
                  {data?.userId?.lastName}
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
                <Image
                  source={icons.noSound}
                  style={{ height: 25, width: 25 }}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.moreModalOptionTextContainer}>
                <Text style={styles.moreModalOptionHeaderText}>Mute</Text>
                <Text style={styles.moreModalOptionInfoText}>
                  Take a break from {data?.userId?.firstName}{" "}
                  {data?.userId?.lastName}
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
                  style={{ height: 25, width: 25 }}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.moreModalOptionTextContainer}>
                <Text style={styles.moreModalOptionHeaderText}>Remove</Text>
                <Text style={styles.moreModalOptionInfoText}>
                  Remove {data?.userId?.firstName} {data?.userId?.lastName} from
                  your bubble
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
                  style={{ height: 25, width: 25 }}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.moreModalOptionTextContainer}>
                <Text style={styles.moreModalOptionHeaderText}>Report</Text>
                <Text style={styles.moreModalOptionInfoText}>
                  Do you want to hide {data?.userId?.firstName}{" "}
                  {`${data?.userId?.lastName}'s posts?`}
                </Text>
              </View>
            </Pressable>
          </View>
        </ImageBackground>
      </Modal>
    );
  }

  //experience profile section
  function renderExperienceInfoProfileSection() {
    return (
      <View style={styles.profileExperienceInfoContainer}>
        {/*profile image container*/}
        <View style={styles.profileImageExperienceContainer}>
          <ImageBackground
            source={images.userFrame}
            style={styles.profileImageContainer}
          >
            <Image
              source={{
                uri:
                  image[data?.userId?.profileImage] ??
                  data?.userId?.profileImage,
              }}
              style={styles.profileImageItem}
            />
          </ImageBackground>
        </View>

        {/*profile info container*/}
        <View style={styles.profileTextExperienceContainer}>
          {/*profile username and card type*/}
          <View style={styles.profileNameAndExperienceTypeContainer}>
            <Text style={styles.profileUsernameTextItem}>
              {data?.userId?.firstName} {data?.userId?.lastName}
            </Text>
            <Text style={styles.normalTextItem}>added</Text>
            <Text style={styles.profileUsernameTextItem}>
              {data?.cardType === "Events & Conferences"
                ? "an event"
                : data?.cardType === "What qualifies me" || data?.cardType === "My Qualifications"
                  ? "a qualification"
                  : data?.cardType === "What I'm working on" || data?.cardType === "My Projects"
                    ? "a project"
                    : data?.cardType === "Where I've worked"
                      ? "a work experience"
                      : data?.cardType === "Beyond work" || data?.cardType === "Life"
                        ? "a life experience"
                        : data?.cardType === "My community engagements" || data?.cardType === "Community engagements"
                          ? "a community engagement"
                          : data?.cardType === "How To"
                            ? "a how-to video"
                            : data?.cardType === "My bloopers"
                              ? "a blooper"
                              : data?.cardType === "Thoughts"
                                ? "a thought"
                                : "an experience"}
            </Text>
          </View>

          {/*experience location*/}
          <View style={styles.experienceLocationContainer}>
            {/*location item*/}
            <View style={styles.experienceLocationContent}>
              <Ionicons name="location-sharp" size={14} color={COLORS.white} />
              <Text style={styles.experienceLocationTextItem}>
                {" "}
                {data?.address}
              </Text>
            </View>

            {/*date item*/}
            <View style={styles.experienceDateContent}>
              <MaterialIcons
                name="access-time"
                size={14}
                color={COLORS.white}
              />
              <Text style={styles.experienceDateTextItem}>
                {" "}
                {moment(data?.createdAt).endOf("s").fromNow()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  //experience description section
  function renderExperienceDescriptionSection() {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.experienceDescriptionContainer}
      >
        <Text style={styles.experienceDescriptionTextItem}>
          {data?.experiencedDescription}
        </Text>

        <View style={styles.screenLiner} />
      </ScrollView>
    );
  }

  //screen content list
  function renderScreenContentList() {
    return (
      <>
        {renderHeaderComponentSection()}
        {renderImageSection()}
        {renderExperienceActionSection()}
        {renderProfileMoreOptionModal()}
        {renderExperienceInfoProfileSection()}
        {renderExperienceDescriptionSection()}
      </>
    );
  }

  return <View style={styles.container}>{renderScreenContentList()}</View>;
};

//custom component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerContentTop: {
    zIndex: 99,
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },

  //image section
  experienceImageContainer: {
    top: Platform.OS === "ios" ? -40 : 0,
    height: "45%",
  },
  experienceImageItem: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  //experience action
  experienceActionContainer: {
    width: "100%",
    marginTop: Platform.OS === "ios" ? -20 : 15,
    alignItems: "flex-end",
  },
  experienceActionContent: {
    flexDirection: "row",
    justifyContent: "center",
  },
  experienceActionItemContainer: {
    marginHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  experienceActionItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  experienceActionTextItem: {
    marginHorizontal: 10,
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //more modal section
  moreModalContainer: {
    marginTop: 10,
  },
  moreInnerModalContainer: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? "134%" : "125%",
    padding: "4%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  moreInnerModalContent: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  moreModalOptionContent: {
    left: Platform.OS === "ios" ? 18 : 30,
    flexDirection: "column",
  },
  moreModalOptionContainer: {
    top: 30,
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
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  moreModalOptionInfoText: {
    marginTop: 3,
    opacity: 0.8,
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },

  //profile experience info section
  profileExperienceInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  profileImageExperienceContainer: {
    width: "28%",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImageContainer: {
    height: Platform.OS === "ios" ? 85 : 75,
    width: Platform.OS === "ios" ? 85 : 75,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImageItem: {
    width: Platform.OS === "ios" ? 75 : 67,
    height: Platform.OS === "ios" ? 75 : 67,
    resizeMode: "cover",
    borderRadius: 8,
  },
  profileTextExperienceContainer: {
    width: "72%",
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "column",
  },
  profileNameAndExperienceTypeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 5,
  },
  profileUsernameTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  normalTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    marginHorizontal: 5,
  },
  experienceLocationContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  experienceLocationContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  experienceLocationTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  experienceDateContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 5,
  },
  experienceDateTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //description section
  experienceDescriptionContainer: {
    maxHeight: Platform.OS === "ios" ? "30%" : "34%",
    marginTop: 10,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  experienceDescriptionTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  screenLiner: {
    marginTop: 10,
    borderColor: COLORS.darkGray,
    borderWidth: StyleSheet.hairlineWidth * 1,
    width: "100%",
  },
});

export default ExperienceFullViewScreen;
