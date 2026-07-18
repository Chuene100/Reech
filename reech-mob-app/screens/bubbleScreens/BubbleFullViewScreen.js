import React, { useState, useEffect } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  View,
  Platform,
  ImageBackground,
} from "react-native";
import {
  AntDesign,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import ImageModal from "react-native-image-modal";
import Toast from "react-native-toast-message";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import io from "socket.io-client";

//import customs
import { COLORS, icons, images } from "../../constants";
import { useUpdateBubbleMutation } from "../../redux/api/bubble";
import { updateBubbleFeedLike } from "../../redux/features/bubble-slice";
import { updateBubbleFeedComment } from "../../redux/features/bubble-slice";
import { useSendNotificationMutation } from "../../redux/api/notification";
import { usePostCommentMutation } from "@/redux/api/comment";
import { useReadBubbleDetailsQuery } from "@/redux/api/bubble";
import NavHeader from "@/components/Headers/NavHeader";

///__________________Tracking database changes__________________
const SOCKET_SERVER_URL = "https://reech-node-api-7o3szyfdpq-uc.a.run.app/";
//`${process.env.REACT_APP_API_URL}${process.env.MAIN_API_BASE_PATH}`;

const BubbleFullViewScreen = ({ route }) => {
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const bub_Id = route.params.bubbleId;

  // const data = useSelector((state) => state.bubble.bubble_feed.find((bub) => bub._id === bub_Id));
  const current_user = useSelector((state) => state.user.current_user)
  const image = useSelector((state) => state.bubble_images.bubbleImages);

  const [modalRender, setRenderModal] = useState(false);
  const [toggleText, setToggleText] = useState(false);
  const [moreOptionModal, setOptionModal] = useState(false);
  const [data, setData] = useState({})
  const [userComment, setUserComment] = useState("");

  const [updateBubbleFn] = useUpdateBubbleMutation();
  const [sendNotificationFn] = useSendNotificationMutation();
  const { data: bubble_item, refetch } = useReadBubbleDetailsQuery(bub_Id)
  const [postCommentFn, { isLoading: loading_comment }] = usePostCommentMutation();

  useEffect(() => {
    setData(bubble_item)
  }, [bubble_item])

  useEffect(() => {
    const connectSocket = async () => {
      const socket = io(SOCKET_SERVER_URL, {
        transports: ["websocket"],
        extraHeaders: {
          "Svc-Tkn": `Bearer ${process.env.SvcTkn_Main_API}`,
        },
      });
      socket.on("bubble-updated", () => {
        refetch();
      });
    };
    connectSocket();
  }, []);

  const showError = (res) =>
    Toast.show({
      type: "error",
      text1: "Error",
      text2: res.error.data?.error ?? "Something went wrong. Please try again",
    });

  //appreciation count function - show 1000 count as 1k
  const transformLike = (val) => {
    const lookupList = [
      { previousValue: 1e12, value: 1e9, symbol: "B" },
      { previousValue: 1e9, value: 1e6, symbol: "M" },
      { previousValue: 1e6, value: 1e3, symbol: "K" },
      { previousValue: 1e3, value: 1, symbol: "" },
    ];

    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;

    lookupList.forEach((lookup) => {
      if (!isNaN(val)) {
        val >= lookup.value && val < lookup.previousValue
          ? (val =
            (val / lookup.value).toFixed(1).replace(rx, "$1") + lookup.symbol)
          : "0";
      } else {
        val >= lookup.value && val < lookup.previousValue
          ? (val =
            (val / lookup.value).toFixed(1).replace(rx, "$1") + lookup.symbol)
          : "0";
      }
    });
    return val;
  };

  const onLikeClicked = async () => {
    const experienceLikeArr = data?.experienceLikeArray;
    const arr = [...experienceLikeArr];

    arr.push({ userId: current_user?._id });

    const body = {
      experienceLikeArray: arr,
      experienceLikeCount: arr.length,
    };

    const notify_body = {
      fromUserId: current_user?._id,
      toUserId: data?.userId,
      toProfileId: data?.profileId,
      feedId: data?._id,
      status: "appreciate",
    };

    const bubbleId = bub_Id;
    dispatch(
      updateBubbleFeedLike({
        bubble: { id: bubbleId, arr: body.experienceLikeArray },
      })
    );

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

    sendNotification(notify_body);
  };

  const onComment = async (item) => {
    const payload = {
      userId: current_user?._id,
      commentAbout: "Bubble",
      commentAboutId: item?._id,
      message: userComment,
    }

    const notify_body = {
      fromUserId: current_user?._id,
      toUserId: item?.userId,
      toProfileId: item?.profileId,
      feedId: item?._id,
      message: userComment,
      status: "comment",
    };
    
    await postCommentFn(payload)
      .then((res) => {
        if (res.error) {
          showError(res)
          return
        }
        setUserComment('')
        showToast(res?.data?.message)
      }).catch(err => console.log(err))

    sendNotification(notify_body);
  }

  const sendNotification = (notify_body) => {
    sendNotificationFn(notify_body)
      .then((res) => {
        if (res.error) {
          console.log("error: ", res);
          return;
        }
        console.log(res.data?.message);
      })
      .catch((err) => console.log(err));
  };

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

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <NavHeader
          icon={<Ionicons name="add-circle" size={24} color={COLORS.white} />}
          bubbleModal={true}
        />
      </View>
    );
  }

  //render bubble image
  function renderBubbleImageSection() {
    return (
      <View style={styles.bubbleImageContainer}>
        <ImageModal
          swipeToDismiss={true}
          resizeMode={"cover"}
          imageBackgroundColor={COLORS.black}
          style={styles.bubblePostImage}
          modalImageStyle={{
            resizeMode: "contain",
          }}
          source={{ uri: image[data?.experienceImage] ?? data?.experienceImage }}
        />
      </View>
    );
  }

  //bubble post action section
  function renderActionSection() {
    return (
      <View style={styles.actionContainer}>
        {/*share button option*/}
        <Pressable
          onPress={() => console.log("share button clicked")}
          style={[styles.actionContentItem, { marginRight: 20 }]}
        >
          <Text style={styles.actionShareOption}>
            {data?.experienceShareCount}
          </Text>
          <FontAwesome name="share-square-o" size={20} color={COLORS.white} />
        </Pressable>

        {/*appreciate button option*/}
        <Pressable
          onPress={() => onLikeClicked()}
          style={styles.actionContentItem}
        >
          <Text style={styles.actionAppreciateOption}>
            {transformLike(data?.experienceLikeCount)}
          </Text>
          <MaterialCommunityIcons
            name="hand-clap"
            size={20}
            color={COLORS.white}
          />
        </Pressable>

        {/*more button option*/}
        <Pressable onPress={() => setOptionModal(true)}>
          <Text style={styles.actionMoreOption}>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={21}
              color={COLORS.white}
            />
          </Text>
        </Pressable>
      </View>
    );
  }

  //bubble post more option trigger
  function renderMoreOptionPopUpModalSection() {
    return (
      <Modal
        transparent={true}
        animationType="slide"
        visible={moreOptionModal}
        statusBarTranslucent={true}
        style={styles.moreOptionModalContainer}
      >
        {/*more option modal content*/}
        <ImageBackground
          source={icons.popupBg}
          style={styles.innerMoreModalContainer}
        >
          {/*modal close action section*/}
          <View style={styles.innerMoreModalContent}>
            <Pressable onPress={() => setOptionModal(false)}>
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
                  See more from {data?.userId?.firstName} {data?.userId?.lastName}
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
                  Take a break from {data?.userId?.firstName} {data?.userId?.lastName}
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
                  Remove {data?.userId?.firstName} from your bubble
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
                <Text style={styles.moreModalOptionHeaderText}>Mute</Text>
                <Text style={styles.moreModalOptionInfoText}>
                  Do you feel violated by this post?
                </Text>
              </View>
            </Pressable>
          </View>
        </ImageBackground>
      </Modal>
    );
  }

  //profile information section
  function renderProfileInformationSection() {
    return (
      <View style={styles.profileInfoContainer}>
        {/*profile image section*/}
        <ImageBackground
          source={images.userFrame}
          style={styles.profileImageContainer}
        >
          <Image
            source={
              data?.userId?.profileImage
                ? {
                  uri:
                    image[data?.userId?.profileImage] ??
                    data?.userId?.profileImage,
                }
                : images.defaultRounded
            }
            style={styles.profileImageItem}
          />
        </ImageBackground>

        {/*bubble post info section*/}
        <View style={styles.bubblePostInfoContainer}>
          {/*top bubble info section*/}
          <View style={styles.bubblePostInfoContent}>
            <Text
              onPress={() =>
                navigation.navigate("BubbleMateProfileViewScreen", {
                  profileId: data?.profileId,
                  userId: data?.userId._id,
                })
              }
              style={styles.bubblePostUserItem}
            >
              {data?.userId?.firstName} {data?.userId?.lastName}{" "}
            </Text>
            <Text style={styles.bubblePostAddedText}>added </Text>
            <Text style={styles.bubblePostExperienceText}>
              {data?.cardType === "Events & Conferences" && "an event"}
              {data?.cardType === "What qualifies me" && "a qualification"}
              {data?.cardType === "What I'm working on" && "a project"}
              {data?.cardType === "Where I've worked" && "a work experience"}
              {data?.cardType === "Beyond work" && "a life experience"}
              {data?.cardType === "My community engagements" && "a community engagement"}
              {data?.cardType === "How To" && "a how-to video"}
              {data?.cardType === "My bloopers" && "a blooper"}
              {data?.cardType === "Thought" && "a thought"}
              {!data?.cardType && "an experience"}
            </Text>
          </View>

          {/*bottom bubble info section*/}
          <View style={styles.bubblePostInfoContent}>
            <Ionicons name="location-sharp" size={14} color={COLORS.white} />
            <Text style={styles.bubblePostLocationItem}>
              {" "}
              {data?.address}
              {"  "}
            </Text>
            <MaterialIcons
              name="access-time"
              size={14}
              color={COLORS.white}
              style={styles.bubbleInfoIconStyle}
            />
            <Text style={styles.bubblePostLocationItem}>
              {" "}
              {moment(data?.createdAt).startOf("m").fromNow()}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  //latest comment section
  function renderLatestCommentSection() {
    return (
      <View style={styles.latestCommentContainer}>
        <>
          {data?.commentIds?.map((commentList, i) => (
            <View key={i}>
              {i < 3 && (
                <View style={styles.commentContentSection}>
                  {/*user comment images*/}
                  <ImageBackground
                    source={images.userFrame}
                    style={styles.userCommentLatestGradient}
                  >
                    <Image
                      source={
                        commentList?.userId?.profileImage ? { uri: commentList?.userId?.profileImage }
                          : images.defaultRounded
                      }
                      style={styles.commentUserImageItem}
                    />
                  </ImageBackground>

                  {/*comment item section*/}
                  <View style={styles.commentUser}>
                    <Text numberOfLines={1} style={styles.userNameItem}>
                      {"  "}
                      {commentList?.userId?.firstName +
                        " " +
                        commentList?.userId?.lastName}
                    </Text>
                    <View style={styles.commentContentsContainer}>
                      <Text numberOfLines={1} style={styles.userCommentItem}>
                        {"  "}
                        {commentList?.message}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          ))}
        </>

        {/*view more comment section*/}
        <View style={styles.moreCommentOptionContainer}>
          <Text
            onPress={() => setRenderModal(true)}
            style={styles.moreCommentOptionText}
          >
            View {data?.commentIds?.length}{" "}
            {data?.commentIds?.length <= 1 ? "comment" : "comments"}
          </Text>
          <View style={styles.commentLiner} />
        </View>
      </View>
    );
  }

  //comment modal section
  function renderCommentModalCollection() {
    return (
      <Modal
        visible={modalRender}
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        style={styles.commentCollectionModalContainer}
      >
        <View style={styles.commentInnerModalContainer}>
          {/*modal close action section*/}
          <View style={styles.innerCommentModalContent}>
            <Pressable onPress={() => setRenderModal(false)}>
              <AntDesign name="closecircle" size={20} color={COLORS.white} />
            </Pressable>
          </View>

          {/*comment user info section*/}
          <View style={styles.userProfileCommentContent}>
            {/*bubble user image section*/}
            <ImageBackground
              source={images.userFrame}
              style={styles.userCommentGradientModal}
            >
              <Image
                source={
                  data?.userId?.profileImage
                    ? {
                      uri:
                        image[data?.userId?.profileImage] ??
                        data?.userId?.profileImage,
                    }
                    : images.defaultRounded
                }
                style={styles.userCommentImageItem}
              />
            </ImageBackground>

            {/*bubble post info section*/}
            <View style={styles.bubblePostInfoContainer}>
              {/*top bubble info section*/}
              <View style={styles.bubblePostInfoContent}>
                <Text style={styles.bubblePostUserItem}>
                  {data?.userId?.firstName} {data?.userId?.lastName}{" "}
                </Text>
                <Text style={styles.bubblePostAddedText}>added </Text>
                <Text style={styles.bubblePostExperienceText}>
                  {data?.cardType === "Events & Conferences" && "an event"}
                  {data?.cardType === "What qualifies me" && "a qualification"}
                  {data?.cardType === "What I'm working on" && "a project"}
                  {data?.cardType === "Where I've worked" && "a work experience"}
                  {data?.cardType === "Beyond work" && "a life experience"}
                  {data?.cardType === "My community engagements" && "a community engagement"}
                  {data?.cardType === "How To" && "a how-to video"}
                  {data?.cardType === "My bloopers" && "a blooper"}
                  {data?.cardType === "Thought" && "a thought"}
                  {!data?.cardType && "an experience"}
                </Text>
              </View>

              {/*bottom bubble info section*/}
              <View style={styles.bubblePostInfoContent}>
                <Ionicons
                  name="location-sharp"
                  size={14}
                  color={COLORS.white}
                />
                <Text style={styles.bubblePostLocationItem}>
                  {" "}
                  {data?.address}{" "}
                </Text>
                <MaterialIcons
                  name="access-time"
                  size={14}
                  color={COLORS.white}
                  style={styles.bubbleInfoIconStyle}
                />
                <Text style={styles.bubblePostLocationItem}>
                  {" "}
                  {moment(data?.createdAt).startOf("m").fromNow()}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.commentModalLiner} />

          {/*scrolling comments section*/}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollCommentContainer}
          >
            <>
              {data?.commentIds?.map((userCommentContent, i) => (
                <View key={i} style={styles.commentContentsContainer}>
                  <ImageBackground
                    source={images.userFrame}
                    style={styles.commentUserGradientContainer}
                  >
                    <Image
                      source={userCommentContent?.userId?.profileImage ? { uri: userCommentContent?.userId?.profileImage }
                        : images.defaultRounded}
                      style={styles.commentUserImage}
                    />
                  </ImageBackground>

                  {/*user comment content*/}
                  <View style={styles.commentContentItems}>
                    <Text style={styles.commentUsernameItem}>
                      {userCommentContent?.userId?.firstName +
                        " " +
                        userCommentContent?.userId?.lastName}
                    </Text>

                    <Text
                      onPress={() => setToggleText(!toggleText)}
                      numberOfLines={toggleText ? undefined : 3}
                      style={styles.commentTextItem}
                    >
                      {userCommentContent?.message}
                    </Text>

                    <View style={styles.userTimesStamp}>
                      <Text style={styles.commentUserTime}>
                        {moment(userCommentContent?.createdAt)
                          .startOf("m")
                          .fromNow()}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </>
          </ScrollView>

          {/*bottom comment form section*/}
          <View style={styles.bottomActionContainer}>
            <View style={styles.bottomActionContent}>
              <View style={styles.bottomActionItem}>
                <>
                  <View
                    style={[
                      styles.comm_container,
                      {
                        backgroundColor: COLORS.black,
                        borderColor: COLORS.darkGray,
                      },
                    ]}
                  >
                    <TextInput
                      value={userComment}
                      onChangeText={setUserComment}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType={"default"}
                      placeholder={"Add comment..."}
                      placeholderTextColor={COLORS.white}
                      style={styles.comm_input}
                      enablesReturnKeyAutomatically
                    />
                  </View>
                </>

                {/*add comment button*/}
                <Pressable
                  onPress={() => onComment(data)}
                  style={styles.commentContainer}
                >
                  <LinearGradient
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    colors={[
                      COLORS.purpleDarker,
                      COLORS.purpleDark,
                      COLORS.purple,
                    ]}
                    style={styles.commentGradientContainer}
                  >
                    {loading_comment ?
                      <ActivityIndicator size={'small'} color={"#fff"} />
                      :
                      <Text style={styles.commentTextItems}>
                        <FontAwesome name="send" size={20} color={COLORS.white} />
                        {"  "}
                        Comment
                      </Text>}
                  </LinearGradient>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  //render screen content
  return (
    <View style={styles.container}>
      {renderHeaderSection()}
      {renderBubbleImageSection()}
      {renderActionSection()}
      {renderMoreOptionPopUpModalSection()}
      {renderProfileInformationSection()}
      {renderLatestCommentSection()}
      {renderCommentModalCollection()}
    </View>
  );
};

//custom styles
const styles = StyleSheet.create({
  //screen content
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //header section
  headerContainer: {
    top: Platform.OS === "ios" ? 50 : 0,
    zIndex: 99,
  },

  //bubble image section
  bubbleImageContainer: {
    top: -40,
    width: "110%",
  },
  bubblePostImage: {
    width: Platform.OS === "ios" ? 450 : 360,
    height: Platform.OS === "ios" ? 520 : 345,
    borderRadius: 0,
  },

  //action section
  actionContainer: {
    top: Platform.OS === "ios" ? -20 : -30,
    right: 10,
    width: "100%",
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  actionContentItem: {
    top: 5,
    flexDirection: "row",
  },
  actionShareOption: {
    right: 10,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  actionAppreciateOption: {
    right: 5,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  actionMoreOption: {
    top: 5,
    left: 10,
  },

  //more option modal
  moreOptionModalContainer: {
    marginTop: 10,
  },
  innerMoreModalContainer: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? "125%" : "125%",
    padding: "4%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  innerMoreModalContent: {
    right: 0,
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

  //profile info section
  profileInfoContainer: {
    top: -20,
    width: "100%",
    flexDirection: "row",
    marginHorizontal: 10,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderColor: COLORS.black,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImageItem: {
    top: 2,
    left: 2,
    width: 75,
    height: 75,
    resizeMode: "cover",
    borderRadius: 8,
    borderColor: COLORS.black,
    borderWidth: 2,
  },
  bubblePostInfoContainer: {
    width: "80%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    marginHorizontal: 10,
  },
  bubblePostInfoContent: {
    top: 5,
    width: "100%",
    flexDirection: "row",
    marginBottom: 10,
  },
  bubblePostUserItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  bubblePostAddedText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  bubbleInfoIconStyle: {
    top: 1,
  },
  bubblePostExperienceText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  bubblePostLocationItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  commentModalLiner: {
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth * 3,
  },

  //latest comment section
  latestCommentContainer: {
    top: 0,
    marginHorizontal: 15,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  commentContentSection: {
    flexDirection: "row",
    marginHorizontal: 15,
    marginBottom: 10,
  },
  userCommentLatestGradient: {
    width: 42,
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  commentUserImageItem: {
    top: 1.5,
    left: 0,
    width: 37,
    height: 37,
    resizeMode: "cover",
    borderRadius: 8,
  },
  commentUser: {
    width: "100%",
    marginLeft: 10,
  },
  userNameItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  userCommentItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    bottom: 5,
  },
  comm_input: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 14,
  },
  comm_container: {
    backgroundColor: COLORS.black,
    width: "100%",
    height: 40,
    padding: 10,
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: 1,
    marginVertical: 8,
  },
  commentContainer: {
    marginTop: 5,
    marginBottom: 10,
  },
  commentGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    height: 45,
    width: "100%",
  },
  commentTextItems: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },

  //more comment option section
  moreCommentOptionContainer: {
    marginTop: 10,
    width: "100%",
    zIndex: 9,
  },
  moreCommentOptionText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  commentLiner: {
    marginTop: 15,
    borderRadius: 20,
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth * 3,
  },

  //comment modal collection section
  commentCollectionModalContainer: {
    marginTop: 10,
  },
  commentInnerModalContainer: {
    flex: 1,
    marginTop: "100%",
    padding: "4%",
    backgroundColor: COLORS.black,
  },
  innerCommentModalContent: {
    right: 5,
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  //top modal user info section
  userProfileCommentContent: {
    top: 10,
    width: "100%",
    flexDirection: "row",
    marginBottom: 15,
    paddingVertical: 5,
  },
  userProfileImageContainer: {
    width: 75,
    height: 75,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  userCommentGradientModal: {
    width: 70,
    height: 70,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  userCommentImageItem: {
    top: 1.5,
    left: 2,
    width: 66,
    height: 66,
    resizeMode: "cover",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.black,
  },

  //comment scroll view items
  scrollCommentContainer: {
    width: "100%",
    height: "25%",
    flexDirection: "column",
    paddingHorizontal: "2%",
  },
  commentContentsContainer: {
    width: "80%",
    flexDirection: "row",
    marginVertical: "2%",
  },
  commentUserGradientContainer: {
    width: 55,
    height: 55,
    borderRadius: 8,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  commentUserImage: {
    top: 3,
    left: 2.5,
    width: 51,
    height: 51,
    overflow: "hidden",
    resizeMode: "cover",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.black,
  },
  commentContentItems: {
    flexDirection: "column",
    marginHorizontal: 20,
  },
  commentUsernameItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
    marginBottom: 5,
  },
  commentTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  commentUserTime: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    marginTop: 6,
    right: 10,
  },
  userTimesStamp: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: 150,
    left: Platform.OS === "ios" ? 170 : 130,
  },

  //bottom action section
  bottomActionContainer: {
    flex: 1,
  },
  bottomActionContent: {
    flex: 1,
    flexDirection: "column-reverse",
  },
  bottomActionItem: {
    width: "100%",
  },
});

export default BubbleFullViewScreen;
