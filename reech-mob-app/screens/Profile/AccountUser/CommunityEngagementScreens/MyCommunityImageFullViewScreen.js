import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator,
  ImageBackground,
  Platform,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, FontAwesome, Ionicons, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";
import moment from "moment";
import io from "socket.io-client";

//customs
import { COLORS, icons, images } from "../../../../constants";
import NavHeader from "@/components/Headers/NavHeader";
import { usePostCommentMutation } from "@/redux/api/comment";
import { useReadCommunityPostQuery } from "@/redux/api/community-post";

///__________________Tracking database changes__________________
const SOCKET_SERVER_URL = "https://reech-node-api-7o3szyfdpq-uc.a.run.app/";
//`${process.env.REACT_APP_API_URL}${process.env.MAIN_API_BASE_PATH}`;

const MyCommunityImageFullViewScreen = ({ route }) => {
  const { item: itm } = route.params;
  const navigation = useNavigation();

  //state handlers
  const [toggleText, setToggleText] = useState(false);
  const [communityMoreOptionModal, setCommunityMoreOptionModal] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const [userComment, setUserComment] = useState("");
  const [item, setItem] = useState(itm)

  const current_user = useSelector((state) => state.user.current_user);

  const [postCommentFn, { isLoading }] = usePostCommentMutation()
  const { data: read_post, refetch } = useReadCommunityPostQuery(itm?._id)

  useEffect(() => {
    setItem(read_post)
  }, [read_post])

  useEffect(() => {
    const connectSocket = async () => {
      const socket = io(SOCKET_SERVER_URL, {
        transports: ["websocket"],
        extraHeaders: {
          "Svc-Tkn": `Bearer ${process.env.SvcTkn_Main_API}`,
        },
      });
      socket.on("comment-updated", () => {
        refetch();
        console.log("comment-updated")
      });
    };
    connectSocket();
  }, []);

  const showError = (res) =>
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "Something went wrong. Please try again",
    });


  const showToast = (message) =>
    Toast.show({
      type: "success",
      text1: "Success",
      text2: message,
    });

  const onRemovePressed = () => {
    console.log("onRemovePressed");
  };

  const addComment = () => {
    const payload = {
      userId: current_user?._id,
      commentAbout: "CommunityPost",
      commentAboutId: item?._id,
      message: userComment,
    }

    postCommentFn(payload)
      .then((res) => {
        if (res.error) {
          showError(res)
          return
        }
        setUserComment('')
        showToast(res?.data?.message)
      })
      .catch(err => console.log(err))
  }

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <NavHeader message="What would you like to do?" />
      </View>
    );
  }

  //community image section
  function renderCommunityImageSection() {
    return (
      <View style={styles.communityImageContainer}>
        <Image style={styles.communityImageItem} source={{ uri: item?.postImage }} />
      </View>
    );
  }

  //community action section
  function renderCommunityActionSection() {
    return (
      <View style={styles.actionContainer}>
        {/*share button option*/}
        <Pressable onPress={() => console.log("share button clicked")} style={styles.actionContentItem}>
          <FontAwesome name="share-square-o" size={18} color={COLORS.white} style={{ right: "80%" }} />
          <Text style={styles.actionShareOption}>{item?.postShareCount}</Text>
        </Pressable>

        {/*appreciate button option*/}
        <Pressable onPress={() => console.log("appreciate button clicked")} style={styles.actionContentItem}>
          <MaterialCommunityIcons name="hand-clap" size={18} color={COLORS.white} />
          <Text style={styles.actionAppreciateOption}>{item?.postLikeArray?.length ?? 0}</Text>
        </Pressable>

        {/*more button option*/}
        <Pressable onPress={() => setCommunityMoreOptionModal(true)}>
          <View style={styles.actionMoreOption}><MaterialCommunityIcons name="dots-vertical" size={21} color={COLORS.white} /></View>
        </Pressable>
      </View>
    );
  }

  //community more option trigger
  function renderCommunityMoreOptionSection() {
    return (
      <Modal
        transparent={true}
        animationType="slide"
        visible={communityMoreOptionModal}
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
            <Pressable onPress={() => setCommunityMoreOptionModal(false)}>
              <Ionicons name="close" size={20} color={COLORS.white} />
            </Pressable>
          </View>

          {/*more modal option section */}
          <View style={styles.moreModalOptionContent}>
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
                <Text style={styles.moreModalOptionHeaderText}>Report</Text>
                <Text style={styles.moreModalOptionInfoText}>
                  Report {item?.userId?.firstName} {item?.userId?.lastName} of this community
                </Text>
              </View>
            </Pressable>
          </View>
        </ImageBackground>
      </Modal>
    );
  }

  //description section
  function renderCommunityDescriptionSection() {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[
          styles.descriptionTextContainer,
          {
            maxHeight:
              toggleText && Platform.OS === "ios"
                ? 85
                : toggleText && Platform.OS === "android"
                  ? 65
                  : Platform.OS === "android"
                    ? 58
                    : 65,
          },
        ]}
      >
        <Text
          onPress={() => setToggleText(!toggleText)}
          numberOfLines={toggleText ? undefined : 3}
          style={styles.descriptionTextItem}
        >
          {item?.description}
        </Text>

        {/*show more text*/}
        <View style={styles.showMoreTextContainer}>
          <Text
            onPress={() => setToggleText(!toggleText)}
            style={styles.showMoreTextItem}
          >
            {toggleText ? "..hide" : "...see more"}
          </Text>
        </View>
      </ScrollView>
    );
  }

  //admin profile section
  function renderAdminProfileSection() {
    return (
      <View style={styles.profileInfoContainer}>
        {/*profile image section*/}
        <ImageBackground
          source={images.userFrame}
          style={styles.profileImageContainer}
        >
          <Image
            source={
              item?.userId?.profileImage ? { uri: item?.userId?.profileImage } : images.defaultRounded
            }
            style={styles.profileImageItem}
          />
        </ImageBackground>

        {/*community info section*/}
        <View style={styles.bubblePostInfoContainer}>
          {/*top community info section*/}
          <View style={styles.bubblePostInfoContent}>
            <Text
              onPress={() => {
                if (item?.userId?._id === current_user?._id)
                  navigation.navigate("LoggedInAccountUserScreen", {
                    userId: current_user?._id,
                  });
                else
                  navigation.navigate("AccountFullViewScreen", {
                    userId: item?.userId?._id,
                  })
              }}
              style={styles.bubblePostUserItem}
            >
              {item?.userId?.firstName} {item?.userId?.lastName}{" "}
              {/* {item.teamMemberName}{" "} */}
            </Text>
            <Text style={styles.bubblePostAddedText}>added </Text>
            <Text style={styles.bubblePostExperienceText}>an engagement</Text>
          </View>

          {/*bottom community info section*/}
          <View style={styles.bubblePostInfoContent}>
            <Ionicons name="location-sharp" size={14} color={COLORS.white} />
            <Text style={styles.bubblePostLocationItem}>
              {" "}
              {item?.address}{" "}
            </Text>
            <MaterialIcons
              name="access-time"
              size={14}
              color={COLORS.white}
              style={styles.bubbleInfoIconStyle}
            />
            <Text style={styles.bubblePostLocationItem}>
              {" "}
              {moment(item?.createdAt).format("DD-MM-YYYY")}
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
          {item?.commentIds?.map((commentList, i) => (
            <View key={i}>
              {i < 3 && (
                <View style={styles.commentContentSection}>
                  {/*user comment images*/}
                  <ImageBackground
                    source={images.userFrame}
                    style={styles.userCommentLatestGradient}
                  >
                    <Image
                      source={commentList?.userId?.profileImage ? { uri: commentList?.userId?.profileImage }
                        : images.defaultRounded
                      }
                      style={styles.commentUserImageItem}
                    />
                  </ImageBackground>

                  {/*comment item section*/}
                  <View style={styles.commentUser}>
                    <Text numberOfLines={1} style={styles.userNameItem}>
                      {"  "}
                      {commentList?.userId?.firstName} {commentList?.userId?.lastName}
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
            onPress={() => setCommentModal(true)}
            style={styles.moreCommentOptionText}
          >
            View {item?.commentIds?.length}{" "}
            {item?.commentIds?.length <= 1
              ? "comment"
              : "comments"}
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
        visible={commentModal}
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        style={styles.commentCollectionModalContainer}
      >
        <View style={styles.commentInnerModalContainer}>
          {/*modal close action section*/}
          <View style={styles.innerCommentModalContent}>
            <Pressable onPress={() => setCommentModal(false)}>
              <AntDesign name="closecircle" size={16} color={COLORS.white} />
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
                  item?.userId?.profileImage ? { uri: item?.userId?.profileImage } : images.defaultRounded
                }
                style={styles.userCommentImageItem}
              />
            </ImageBackground>

            {/*bubble post info section*/}
            <View style={styles.bubblePostInfoContainer}>
              {/*top bubble info section*/}
              <View style={styles.bubblePostInfoContent}>
                <Text style={styles.bubblePostUserItem}>
                  {item?.userId?.firstName} {item?.userId?.lastName}{" "}
                </Text>
                <Text style={styles.bubblePostAddedText}>added </Text>
                <Text
                  adjustsFontSizeToFit={true}
                  numberOfLines={1}
                  style={styles.bubblePostExperienceText}
                >
                  an engagement
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
                  {item?.address}{" "}
                </Text>
                <MaterialIcons
                  name="access-time"
                  size={14}
                  color={COLORS.white}
                  style={styles.bubbleInfoIconStyle}
                />
                <Text style={styles.bubblePostLocationItem}>
                  {" "}
                  {moment(item?.createdAt).format("DD-MM-YYYY")}
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
              {item?.commentIds?.map((userCommentContent, i) => (
                <View key={i} style={styles.commentContentItemContainer}>
                  <ImageBackground
                    source={images.userFrame}
                    style={styles.commentUserGradientContainer}
                  >
                    <Image
                      source={userCommentContent?.userId?.profileImage ?
                        { uri: userCommentContent?.userId?.profileImage } : images.defaultRounded}
                      style={styles.commentUserImage}
                    />
                  </ImageBackground>

                  {/*user comment content*/}
                  <View style={styles.commentContentItems}>
                    <Text style={styles.commentUsernameItem}>
                      {userCommentContent?.userId?.firstName} {userCommentContent?.userId?.lastName}
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
                        {moment(userCommentContent?.createdAt).fromNow()}
                      </Text>
                    </View>
                  </View>
                </View>
              )
              )}
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
                      multiline
                    />
                  </View>
                </>

                {/*add comment button*/}
                <Pressable
                  onPress={() => addComment()}
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
                    {isLoading ?
                      <ActivityIndicator size={'small'} color={"#fff"} />
                      :
                      <Text style={styles.commentTextItems}>
                        <FontAwesome name="send" size={20} color={COLORS.white} />
                        {"  "}
                        Add comment
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

  //screen content section
  function renderScreenContentListSection() {
    return (
      <>
        {renderHeaderSection()}
        {renderCommunityImageSection()}
        {renderCommunityActionSection()}
        {renderCommunityMoreOptionSection()}
        {renderCommunityDescriptionSection()}
        {renderAdminProfileSection()}
        {renderLatestCommentSection()}
        {renderCommentModalCollection()}
      </>
    );
  }

  return (
    <View style={styles.container}>{renderScreenContentListSection()}</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //header section
  headerContainer: {
    top: Platform.OS === "ios" ? 45 : 0,
    zIndex: 99,
  },

  //community image section
  communityImageContainer: {
    top: -40,
    width: "100%",
  },
  communityImageItem: {
    width: Platform.OS === "ios" ? 440 : 355,
    height: Platform.OS === "ios" ? 440 : 340,
    borderRadius: 0,
  },

  //action section
  actionContainer: {
    marginTop: "-25%",
    top: Platform.OS === "ios" ? 80 : 55,
    right: 20,
    width: "100%",
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  actionContentItem: {
    top: 5,
    flexDirection: "row",
  },
  actionShareOption: {
    right: "45%",
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  lottieAnimation: {
    width: 40,
    height: 40,
    left: 3,
    bottom: Platform.OS === "android" ? 5 : 3.5,
  },
  actionAppreciateOption: {
    left: 8,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  actionMoreOption: {
    top: 5,
    left: 20,
  },

  //community more option modal
  moreOptionModalContainer: {
    marginTop: 10,
  },
  innerMoreModalContainer: {
    flex: 1,
    marginTop: "174%",
    padding: "4%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  innerMoreModalContent: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  moreModalOptionContent: {
    left: Platform.OS === "ios" ? 18 : 30,
    flexDirection: "column",
  },
  moreModalOptionContainer: {
    top: 10,
    marginBottom: 25,
    flexDirection: "row",
  },
  moreModalOptionIconContainer: {
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  moreModalOptionTextContainer: {
    left: Platform.OS === "ios" ? 20 : 10,
    width: "70%",
    flexDirection: "column",
  },
  moreModalOptionHeaderText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  moreModalOptionInfoText: {
    marginTop: Platform.OS === "ios" ? 5 : 2,
    opacity: 0.8,
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },

  //description section
  descriptionTextContainer: {
    top: Platform.OS === "ios" ? "11%" : "9.5%",
    marginHorizontal: 5,
  },
  descriptionTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  showMoreTextContainer: {
    marginVertical: 1,
    marginHorizontal: 10,
    alignItems: "flex-end",
  },
  showMoreTextItem: {
    color: COLORS.darkGray,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },

  //admin profile info section
  profileInfoContainer: {
    marginTop: Platform.OS === "ios" ? 35 : 5,
    top: 70,
    width: Platform.OS === "ios" ? "95%" : "93%",
    flexDirection: "row",
    marginHorizontal: 10,
  },
  profileImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 8,
    borderColor: COLORS.black,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    right: 5,
  },
  profileImageItem: {
    top: 2.5,
    left: 2,
    width: 66,
    height: 66,
    resizeMode: "cover",
    borderRadius: 4,
    borderColor: COLORS.black,
    borderWidth: 2,
  },
  bubblePostInfoContainer: {
    width: Platform.OS === "ios" ? "80%" : "78%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  bubblePostInfoContent: {
    top: 5,
    width: Platform.OS === "ios" ? "100%" : "100%",
    flexDirection: "row",
    marginBottom: 5,
  },
  commentModalLiner: {
    bottom: 10,
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth * 3,
  },
  bubblePostUserItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
  },
  bubblePostAddedText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  bubbleInfoIconStyle: {
    top: 1,
  },
  bubblePostExperienceText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
  },
  bubblePostLocationItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
  },

  //latest comment section
  latestCommentContainer: {
    top: 80,
    marginHorizontal: 15,
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: 100,
  },
  commentContentSection: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 5,
    marginTop: Platform.OS === "ios" ? 3 : 0.5,
  },
  userCommentLatestGradient: {
    width: 45,
    height: 45,
    borderRadius: 8,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    right: 15,
  },
  commentUserImageItem: {
    top: 3,
    left: 3,
    width: 41,
    height: 41,
    resizeMode: "cover",
    borderRadius: 4,
    borderColor: COLORS.black,
    borderWidth: 1,
  },
  commentUser: {
    width: "100%",
    marginLeft: 0,
  },
  commentContentsContainer: {
    flexDirection: "column",
    width: "91.5%",
  },
  userNameItem: {
    marginTop: 2,
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  userCommentItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    bottom: Platform.OS === "ios" ? 0 : 2,
  },

  //more comment option section
  moreCommentOptionContainer: {
    top: Platform.OS === "ios" ? 10 : 10,
    width: "100%",
    zIndex: 9,
  },
  moreCommentOptionText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  commentLiner: {
    marginTop: 5,
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
    marginTop: Platform.OS === "ios" ? "100%" : "95%",
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
    top: 0,
    width: "100%",
    flexDirection: "row",
    marginBottom: 15,
    paddingVertical: 5,
  },
  userCommentGradientModal: {
    width: 75,
    height: 75,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  userCommentImageItem: {
    top: 1.8,
    left: 2,
    width: 70,
    height: 70,
    resizeMode: "cover",
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.black,
  },

  //comment scroll view items
  scrollCommentContainer: {
    width: "100%",
    height: Platform.OS === "ios" ? "10%" : "5%",
    flexDirection: "column",
    paddingHorizontal: "2%",
    marginBottom: Platform.OS === "ios" ? 25 : 20,
  },
  commentContentItemContainer: {
    width: "80%",
    flexDirection: "row",
    marginVertical: Platform.OS === "ios" ? 2 : 0,
  },
  commentUserGradientContainer: {
    width: 60,
    height: 60,
    borderRadius: 4,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  commentUserImage: {
    top: 3,
    left: 3,
    width: 57,
    height: 57,
    overflow: "hidden",
    resizeMode: "cover",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.black,
  },
  commentContentItems: {
    flexDirection: "column",
    marginHorizontal: 12,
  },
  commentUsernameItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
    marginBottom: 3,
  },
  commentTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  commentUserTime: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: "PoppinsLight",
    padding: 2,
  },
  userTimesStamp: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: 150,
    marginTop: 10,
    left: Platform.OS === "ios" ? 165 : 95,
  },

  //bottom action section
  bottomActionContainer: {
    flex: 0.5,
    top: Platform.OS === "ios" ? 0 : 20,
  },
  bottomActionContent: {
    flex: 1,
    flexDirection: "column-reverse",
  },
  comm_input: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 15,
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
  bottomActionItem: {
    width: "100%",
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
});

export default MyCommunityImageFullViewScreen;
