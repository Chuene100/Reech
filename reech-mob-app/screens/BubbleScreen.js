import React, { useState, useEffect } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  View,
  useWindowDimensions,
  Platform,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  AntDesign,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";

//custom 
import { COLORS, icons, images, SIZES } from "../constants";
import NavHeader from "@/components/Headers/NavHeader";
import { EmptyFlatlistComponent, LoadingComponent } from "../components";
import { useBubbleFeedQuery } from "../redux/api/bubble";
import { useUpdateBubbleMutation } from "../redux/api/bubble";
import { setBubbleFeed } from "../redux/features/bubble-slice";
import { setBubbleImage } from "../redux/features/bubble-image-slice";
import { updateBubbleFeedLike } from "../redux/features/bubble-slice";
import { useSendNotificationMutation } from "../redux/api/notification";
import { usePostCommentMutation } from "@/redux/api/comment";
import BubbleModal from "@/components/Modals/BubbleModal";


///__________________Tracking database changes__________________
const SOCKET_SERVER_URL = "https://reech-node-api-7o3szyfdpq-uc.a.run.app/";
//`${process.env.REACT_APP_API_URL}${process.env.MAIN_API_BASE_PATH}`;

const BubbleScreen = () => {
  const { height } = useWindowDimensions();
  const navigation = useNavigation();

  const [modalRender, setRenderModal] = useState(false);
  const [moreOptionModal, setOptionModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleModal = () => setIsModalVisible(() => !isModalVisible);
  const closeModal = () => setIsModalVisible(() => !isModalVisible);

  const [selectedItem, setSelectedItem] = useState({});
  const [selectedItemComments, setSelectedItemComments] = useState({});
  const [toggleText, setToggleText] = useState(false);
  const [userComment, setUserComment] = useState("");

  const dispatch = useDispatch();

  const current_user = useSelector((state) => state.user.current_user);
  const cached_bubble = useSelector((state) => state.bubble.bubble_feed);
  const image = useSelector((state) => state.bubble_images.bubbleImages);

  const { data: bubbleFeed, refetch, isLoading, isFetching } = useBubbleFeedQuery();
  const [postCommentFn, { isLoading: loading_comment }] = usePostCommentMutation();
  const [sendNotificationFn] = useSendNotificationMutation();
  const [updateBubbleFn] = useUpdateBubbleMutation();

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

  useEffect(() => {
    if (bubbleFeed?.data) {
      dispatch(setBubbleFeed({ bubble_feed: bubbleFeed?.data }));
      for (var dt in bubbleFeed?.data) {
        !image[bubbleFeed?.data[dt]?.experienceImage] &&
          _loadImage(bubbleFeed?.data[dt]?.experienceImage);
      }
    }
  }, [bubbleFeed]);

  useEffect(() => {
    if (bubbleFeed?.data)
      for (var dt in bubbleFeed?.data) {
        !image[bubbleFeed?.data[dt]?.userProPic] &&
          _loadImage(bubbleFeed?.data[dt]?.userProPic);
      }
  }, [bubbleFeed]);

  useEffect(() => {
    const focusHandler = navigation.addListener("focus", () => {
      refetch();
    });
    return focusHandler;
  }, [navigation, bubbleFeed]);

  const _loadImage = async (url) => {
    try {
      if (url) {
        const response = await fetch(url);

        const blob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          dispatch(setBubbleImage({ url, data: reader.result }));
        };
      }
    } catch (error) {
      console.error(`Error loading image: ${error}`);
    }
  };

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

  const onLikeClicked = async (item) => {
    const arr = [...(item?.experienceLikeArray ?? null)];

    const bubbleId = item?._id;
    arr.push({ userId: current_user?._id });

    const body = {
      experienceLikeArray: arr,
      experienceLikeCount: arr.length,
    };

    const notify_body = {
      fromUserId: current_user?._id,
      toUserId: item?.userId,
      toProfileId: item?.profileId,
      feedId: item?._id,
      status: "appreciate",
    };

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

  //report options
  const moreOptions = (_moreOptionModal) => (
    <Modal
      visible={_moreOptionModal}
      statusBarTranslucent={true}
      animationType="slide"
      transparent={true}
      style={styles.modalMoreContainer}
    >
      <ImageBackground
        source={icons.popupBg}
        style={styles.innerMoreModalContainer}
      >
        <View style={styles.innerMoreModalHeader}>
          <Pressable
            onPress={() => {
              setOptionModal(false);
              setSelectedItem(null);
            }}
          >
            <Ionicons name="close" size={18} color={COLORS.white} />
          </Pressable>
        </View>

        {/*options section*/}
        <View style={styles.moreOptionContainer}>
          <View style={styles.moreOptionContent}>
            {/*priority option*/}
            <TouchableOpacity
              onPress={() => onPrioritiesPressed()}
              style={styles.moreOptionItem}
            >
              <View style={styles.moreOptionIcon}>
                <Image
                  source={icons.noHeart}
                  style={{ height: 25, width: 25 }}
                />
              </View>
              <View style={styles.moreOptionTextContainer}>
                <Text style={styles.moreOptionTextHeading}>Prioritise</Text>
                <Text style={styles.moreOptionTextInfo}>
                  See more from{" "}
                  {selectedItem.verified
                    ? selectedItem.businessName
                    : selectedItem.username}
                </Text>
              </View>
            </TouchableOpacity>

            {/*mute option*/}
            <TouchableOpacity
              onPress={() => onMutePressed()}
              style={styles.moreOptionItem}
            >
              <View style={styles.moreOptionIcon}>
                <Image
                  source={icons.noSound}
                  style={{ height: 25, width: 25 }}
                />
              </View>
              <View style={styles.moreOptionTextContainer}>
                <Text style={styles.moreOptionTextHeading}>Mute</Text>
                <Text style={styles.moreOptionTextInfo}>
                  Take a break from{" "}
                  {selectedItem.verified
                    ? selectedItem.businessName
                    : selectedItem.username}
                </Text>
              </View>
            </TouchableOpacity>

            {/*remove option*/}
            <TouchableOpacity
              onPress={() => onRemovePressed()}
              style={styles.moreOptionItem}
            >
              <View style={styles.moreOptionIcon}>
                <Image
                  source={icons.noUser}
                  style={{ height: 25, width: 25 }}
                />
              </View>
              <View style={styles.moreOptionTextContainer}>
                <Text style={styles.moreOptionTextHeading}>Remove</Text>
                <Text style={styles.moreOptionTextInfo}>
                  Remove{" "}
                  {selectedItem.verified
                    ? selectedItem.businessName
                    : `${selectedItem.username}`}{" "}
                  from your bubble
                </Text>
              </View>
            </TouchableOpacity>

            {/*report option*/}
            <TouchableOpacity
              onPress={() => onReportPressed()}
              style={styles.moreOptionItem}
            >
              <View style={styles.moreOptionIcon}>
                <Image
                  source={icons.noFlag}
                  style={{ height: 25, width: 25 }}
                />
              </View>
              <View style={styles.moreOptionTextContainer}>
                <Text style={styles.moreOptionTextHeading}>Report</Text>
                <Text style={styles.moreOptionTextInfo}>
                  Do you feel violated by this post?
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </Modal>
  );

  //bubble comments
  const ItemComments = (_modalRender) => {
    const comments = selectedItemComments?.verified
    ? selectedItemComments?.userCommentsBusiness
    : selectedItemComments?.commentIds;
    return (
      <Modal
        visible={_modalRender}
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        style={styles.modalContainer}
      >
        <View style={styles.innerModalContainer}>
          {/*modal action section*/}
          <View style={styles.innerModalHeader}>
            <Pressable
              onPress={() => {
                setRenderModal(false);
                setSelectedItemComments(null);
              }}
            >
              <AntDesign name="closecircle" size={20} color={COLORS.white} />
            </Pressable>
            <Text style={styles.innerModalHeaderText}>
              {selectedItemComments?.verified
                ? selectedItemComments?.userCommentsBusiness.length
                : selectedItemComments?.commentIds.length}{" "}
              Comments
            </Text>
            <View></View>
          </View>

          {/*comment content*/}
          <View style={styles.commentHeaderUnderline}></View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.commentReaderContainer}
          >
            <View>
              {comments?.map((userCommentContent, i) => (
                <View key={i} style={styles.commentReaderItems}>
                  <Pressable
                    onPress={() => {
                      if (userCommentContent?.userId?._id === current_user?._id)
                        navigation.navigate("LoggedInAccountUserScreen", {
                          userId: current_user?._id,
                        });
                      else
                        navigation.navigate("AccountFullViewScreen", {
                          userId: userCommentContent?.userId?._id,
                        })
                      setRenderModal(false);
                    }}
                  >
                    <ImageBackground
                      source={images.userFrame}
                      style={styles.commentUserGradientContainer}
                    >
                      <Image
                        source={
                          userCommentContent?.userId?.profileImage
                            ? { uri: userCommentContent?.userId?.profileImage }
                            : images.defaultRounded
                        }
                        style={styles.commentUserImage}
                        resizeMode="cover"
                      />
                    </ImageBackground>
                  </Pressable>

                  <View
                    style={{ flexDirection: "column", width: "100%", left: 5 }}
                  >
                    <Text style={styles.commentUserName}>
                      {userCommentContent?.userId?.firstName +
                        " " +
                        userCommentContent?.userId?.lastName}
                    </Text>
                    <Text style={styles.commentUserText}>
                      {userCommentContent?.message}
                    </Text>
                    <Text style={styles.commentUserTimeStamp}>
                      {moment(userCommentContent?.createdAt)
                        .startOf("m")
                        .fromNow()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>

          {/*add comment section - action*/}
          <View style={styles.commentActionContainer}>
            <View style={styles.commentActionContent}>
              <View style={styles.commentInput}>
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
                      multiline
                    />
                  </View>
                </>

                {/*add comment button*/}
                <Pressable
                  onPress={() => onComment(selectedItemComments)}
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
  //business content
  const adComponent = (item) => (
    <View style={styles.cardContentContainer} key={item?.id}>
      <View style={styles.topSection}>
        {/*business profile icon section*/}
        <View style={styles.headingInfoSection}>
          <View style={styles.headingProfile}>
            <TouchableOpacity
              onPress={() => console.log("profile clicked, show screen")}
            >
              {/*ad header info*/}
              <Text style={styles.headingText}>
                <Image
                  source={
                    item?.businessIcon ? item?.businessIcon : item?.experienceIcon
                  }
                  style={styles.businessIconSmall}
                  resizeMode={"cover"}
                />
                {"  "}
                {item?.businessName}{" "}
                <Text
                  style={{
                    fontFamily: "PoppinsLight",
                    marginTop: "2.3%",
                  }}
                >
                  shared{" "}
                  <Text
                    style={{
                      fontFamily: "PoppinsBold",
                    }}
                  >
                    {item?.cardType === "Events & Conferences" && "an event"}
                    {item?.cardType === "What qualifies me" && "a qualification"}
                    {item?.cardType === "What I'm working on" && "a project"}
                    {item?.cardType === "Where I've worked" && "a work experience"}
                    {item?.cardType === "Beyond work" && "a life experience"}
                    {item?.cardType === "My community engagements" && "a community engagement"}
                    {item?.cardType === "How To" && "a how-to video"}
                    {item?.cardType === "My bloopers" && "a blooper"}
                    {item?.cardType === "Thought" && "a thought"}
                    {!item?.cardType && "an experience"}
                  </Text>
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/*location header info*/}
        <View style={styles.headingLocationSection}>
          <Text style={styles.headingLocation2}>
            <Ionicons name="location-sharp" size={16} color={COLORS.white} />{" "}
            {item?.adLocation}
            {"  "}
          </Text>

          <MaterialIcons
            name="access-time"
            size={17}
            color={COLORS.white}
            style={{ top: 2 }}
          />
          <Text style={styles.headingTime}> {item?.createdTime}</Text>
        </View>
      </View>

      {/*image & info section*/}
      <View style={styles.middleSection}>
        {/*experience ad image*/}
        <View style={styles.businessAdImageContainer}>
          <TouchableOpacity
            onPress={() => console.log("verified clicked, show screen")}
          >
            <Image
              source={item?.adImage}
              style={styles.businessAdImageItem}
              resizeMode={"cover"}
            />
          </TouchableOpacity>
        </View>

        {/*business icon section*/}
        <View style={styles.businessIconContainer}>
          <Image
            source={item?.businessIcon}
            style={styles.businessIconItem}
            resizeMode={Platform.OS === "android" ? "cover" : "contain"}
          />
          <Text style={styles.verified}>
            <AntDesign name="checkcircle" size={18} color={COLORS.white} />
          </Text>
        </View>

        {/*business icon special section*/}
        <View style={styles.businessIconSpecialContainer}>
          <View style={styles.businessIconSpecialItem}>
            <Text
              style={[
                styles.adSpecialPrice,
                {
                  transform: [{ rotateX: "25deg" }, { rotateZ: "0.385398rad" }],
                },
              ]}
            >
              Only{"\n"}${item?.adPrice}
            </Text>
          </View>
        </View>

        {/*business info section*/}
        <View style={styles.businessInfoContainer}>
          <LinearGradient
            style={styles.businessInfoItems}
            colors={["transparent", COLORS.teal, "transparent"]}
            start={{
              x: 1.0,
              y: 0.0,
            }}
            end={{
              x: 0.0,
              y: 2.0,
            }}
          >
            <Text style={styles.adPriceTitle}>
              {item?.adCategoryDescription}
            </Text>
            <Text style={styles.adPrice}>
              ${item?.adPrice} / {item?.adExtra}
            </Text>
            <Text style={styles.adPrice}>{item?.adLocation}</Text>

            <View style={styles.infoIcon}>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    `${item?.adCategoryDescription}`,
                    "\nDescription: \n\n" + `${item?.adDescription}`,
                    [
                      {
                        text: "View profile",
                        onPress: () => console.log("view Pressed"),
                      },
                      {
                        text: "Close",
                        onPress: () => console.log("Close Pressed"),
                        style: "cancel",
                      },
                    ]
                  );
                }}
              >
                <MaterialIcons name="info" size={23} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/*business ad action section*/}
        <View style={styles.adActionContainer}>
          <View style={styles.adActionContent}>
            <Text style={styles.adActionText}>{item?.cardType}</Text>
            <View style={styles.adActionButtonsContainer}>
              {/*share options*/}
              <TouchableOpacity onPress={() => console.log("share clicked")}>
                <Text style={styles.adActionShareItem}>
                  {item?.adShareCount}
                  {"  "}
                  <FontAwesome
                    name="share-square-o"
                    size={20}
                    color={COLORS.white}
                  />
                </Text>
              </TouchableOpacity>

              {/*appreciate options*/}
              <TouchableOpacity onPress={() => onLikeClicked(item)}>
                <Text style={styles.adActionLikeItem}>
                  {transformLike(item?.adLikeCountDisplay)}
                  {"  "}
                  <MaterialCommunityIcons
                    name="hand-clap"
                    size={20}
                    color={COLORS.white}
                  />
                </Text>
              </TouchableOpacity>

              {/*more options*/}
              <TouchableOpacity
                onPress={() => {
                  setOptionModal(true);
                  setSelectedItem(item);
                }}
              >
                <Text style={styles.adActionMoreItem}>
                  <MaterialCommunityIcons
                    name="dots-vertical"
                    size={21}
                    color={COLORS.white}
                  />
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {moreOptionModal && moreOptions(moreOptionModal)}

      {/*comment pop-up trigger*/}
      <View style={styles.bottomSection}>
        <View styles={styles.adDescription}>
          <Text
            style={styles.adDescriptionContent}
            numberOfLines={toggleText ? undefined : 4}
            onPress={() => setToggleText(!toggleText)}
          >
            {item?.adDescription}
          </Text>
        </View>
        <View>
          <TouchableOpacity
            style={styles.touchableOpacity}
            onPress={() => {
              setRenderModal(true);
              setSelectedItemComments(item);
            }}
          >
            <Text style={styles.adCommentText}>
              View {item?.userCommentsBusiness.length}{" "}
              {item?.userCommentsBusiness.length <= 1 ? "comment" : "comments"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View key={item?.id}>{modalRender && ItemComments(modalRender)}</View>

      {/*bottom flatlist section*/}
      <View style={styles.bottomSectionFlatlist}></View>
    </View >
  );

  //user content
  const userComponent = (item) => (
    <View style={styles.cardContentContainer} key={item?._id}>
      {/*top location section*/}
      <View style={styles.topSection}>
        {/*heading section*/}
        <View style={styles.headingInfoSection}>
          <View style={styles.headingProfile}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("BubbleMateProfileViewScreen", {
                  profileId: item?.profileId,
                  userId: item?.userId._id,
                });
              }}
            >
              {/*user header info*/}
              <Text style={styles.headingText}>
                <Image
                  source={
                    item?.userId?.profileImage
                      ? {
                        uri:
                          image[item?.userId?.profileImage] ??
                          item?.userId?.profileImage,
                      }
                      : images.defaultRounded
                  }
                  style={styles.businessIconSmall}
                  resizeMode="cover"
                />
                {"  "}
                {item?.userId.firstName} {item?.userId.lastName}{" "}
                <Text
                  style={{
                    fontFamily: "PoppinsLight",
                    marginTop: "2.3%",
                  }}
                >
                  shared{" "}
                  <Text
                    style={{
                      fontFamily: "PoppinsBold",
                      textTransform: "lowercase",
                    }}
                  >
                    {item?.cardType === "Events & Conferences" && "an event"}
                    {item?.cardType === "What qualifies me" && "a qualification"}
                    {item?.cardType === "What I'm working on" && "a project"}
                    {item?.cardType === "Where I've worked" && "a work experience"}
                    {item?.cardType === "Beyond work" && "a life experience"}
                    {item?.cardType === "My community engagements" && "a community engagement"}
                    {item?.cardType === "How To" && "a how-to video"}
                    {item?.cardType === "My bloopers" && "a blooper"}
                    {item?.cardType === "Thought" && "a thought"}
                    {!item?.cardType && "an experience"}
                  </Text>
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/*location header info*/}
        <View style={styles.headingLocationSection}>
          <Text style={styles.headingLocation2}>
            <Ionicons name="location-sharp" size={16} color={COLORS.white} />{" "}
            {item?.address}
            {"  "}
          </Text>

          <MaterialIcons
            name="access-time"
            size={16}
            color={COLORS.white}
            style={{ top: 0 }}
          />
          <Text style={styles.headingTime}>
            {" "}
            {moment(item?.createdAt).endOf("s").fromNow()}
          </Text>
        </View>
      </View>

      {/*image & info section*/}
      <View style={styles.middleSection}>
        {/*bubble post image*/}
        <View style={styles.businessAdImageContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("BubbleFullViewScreen", {
                bubbleId: item?._id,
              })
            }
          >
            <Image
              source={{
                uri: image[item?.experienceImage] ?? item?.experienceImage,
              }}
              style={styles.businessAdImageItem}
              resizeMode={"cover"}
            />
          </TouchableOpacity>
        </View>

        {/*like functions*/}
        <View style={styles.adActionContainer}>
          <View style={styles.adActionContent}>
            <Text style={styles.adActionText}>{item?.cardType}</Text>
            <View style={styles.adActionButtonsContainer}>
              <TouchableOpacity onPress={() => console.log("share clicked")}>
                <Text style={styles.adActionShareItem}>
                  {item?.experienceShareCount}
                  {"  "}
                  <FontAwesome
                    name="share-square-o"
                    size={20}
                    color={COLORS.white}
                  />
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => onLikeClicked(item)}>
                <Text style={styles.adActionLikeItem}>
                  {transformLike(item?.experienceLikeCount)}
                  {"  "}
                  <MaterialCommunityIcons
                    name="hand-clap"
                    size={20}
                    color={COLORS.white}
                  />
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setOptionModal(true);
                  setSelectedItem(item);
                }}
              >
                <Text style={styles.adActionMoreItem}>
                  <MaterialCommunityIcons
                    name="dots-vertical"
                    size={21}
                    color={COLORS.white}
                  />
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {moreOptionModal && moreOptions(moreOptionModal)}

      {/*description & comment section*/}
      <View style={styles.bottomSection}>
        <View key={item} styles={styles.adDescription}>
          <Text
            style={styles.adDescriptionContent}
            numberOfLines={toggleText ? undefined : 4}
            onPress={() => setToggleText(!toggleText)}
          >
            {item?.experiencedDescription}
          </Text>
        </View>
        <View>
          {/*comment pop-up trigger*/}
          <TouchableOpacity
            style={styles.touchableOpacity}
            onPress={() => {
              setRenderModal(true);
              setSelectedItemComments(item);
            }}
          >
            <Text style={styles.adCommentText}>
              View {item?.commentIds?.length}{" "}
              {item?.commentIds?.length <= 1 ? "comment" : "comments"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>{modalRender && ItemComments(modalRender)}</View>

      {/*bottom flatlist section*/}
      <View style={styles.bottomSectionFlatlist}></View>
    </View >
  );

  //render bubble feed
  function renderAdSection() {
    return (
      <>
        <View style={[styles.cardSectionContainer, { height: height }]}>
          <View style={styles.commentModalPopup}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <LoadingComponent />
              </View>
            ) : (
              <FlatList
                data={bubbleFeed?.data ?? cached_bubble}
                keyExtractor={(item, index) => index.toString()}
                onRefresh={refetch}
                refreshing={isFetching}
                renderItem={({ item }) => {
                  return (
                    <View key={item?.id}>
                      {item?.verified ? adComponent(item) : userComponent(item)}
                    </View>
                  );
                }}
                ListFooterComponent={
                  <View
                    style={{
                      marginBottom: Platform.OS === "ios" ? "15%" : "10%",
                    }}
                  ></View>
                }
                ListEmptyComponent={<EmptyFlatlistComponent />}
                contentContainerStyle={{ paddingHorizontal: SIZES.padding * 2 }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                // Performance settings
                removeClippedSubviews={true} // Unmount components when outside of window
                maxToRenderPerBatch={6} // Reduce number in each render batch (every scroll)
                updateCellsBatchingPeriod={100} // Increase time between renders in (milliseconds)
                initialNumToRender={5} // Reduce initial render amount
                windowSize={11} // Reduce the window size
              />
            )}
          </View>
        </View>
      </>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/*top header component section*/}
        <View style={styles.headerContentTop}>
          <NavHeader message="What would you like to do?" />
        </View>

        {/*screen content feed list*/}
        {renderAdSection()}

        {/*add new experience button section*/}
        <View style={styles.addExperienceButtonContainer}>
          <TouchableOpacity
            onPress={handleModal}
            style={styles.addExperienceButtonContentContainer}
          >
            <LinearGradient
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
              style={styles.addExperienceButtonContent}
            >
              <AntDesign name="plus" size={24} color={COLORS.white} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <BubbleModal
          styles={styles}
          isModalVisible={isModalVisible}
          navigation={navigation}
          closeModal={closeModal}
        />
      </View>
    </View>
  );
};

//custom style
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerContainer: {
    flex: 1,
    top: Platform.OS === "ios" ? "4%" : "0%",
  },
  headerContentTop: {
    marginTop: Platform.OS === "ios" ? "2.5%" : 0,
    marginBottom: "5%",
  },

  //add experience section
  addExperienceButtonContainer: {
    width: "15%",
    marginTop: Platform.OS === "ios" ? -18 : -55,
    bottom: Platform.OS === "ios" ? 120 : 55,
    alignSelf: "flex-end",
    backgroundColor: COLORS.transparent,
  },
  addExperienceButtonContentContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  addExperienceButtonContent: {
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: COLORS.purpleTrans,
  },

  //modal
  headerTopContainer: {
    width: "100%",
    padding: 2,
  },
  headerTopContent: {
    top: Platform.OS === "ios" ? -33 : -80,
    paddingHorizontal: Platform.OS === "ios" ? 20 : 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  reechImageLogoContainer: {
    right: 15,
  },
  reechImageLogo: {
    width: Platform.OS === "ios" ? 100 : 80,
    height: 25,
    resizeMode: "contain",
  },

  //middle navigation content
  middleNavigationContentContainer: {
    flexDirection: "column",
    marginTop: Platform.OS === "ios" ? 50 : -45,
    padding: 2,
    paddingHorizontal: Platform.OS === "ios" ? 20 : 10,
  },
  navigationContentItems: {
    flexDirection: "column",
    marginBottom: 50,
  },
  navigationContainer: {
    backgroundColor: COLORS.reechGray,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  navigationTextItem: {
    alignSelf: "center",
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  navigationImageItem: {
    width: 30,
    height: 30,
    resizeMode: "cover",
  },
  navigationDescriptionTextItem: {
    marginTop: 10,
    color: COLORS.darkGray,
    fontSize: 10,
    fontFamily: "PoppinsLight",
  },

  //moreOption
  modalMoreContainer: {
    marginTop: 10,
  },
  innerMoreModalContainer: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? "135%" : "125%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  innerMoreModalHeader: {
    marginTop: 10,
    right: 15,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  moreOptionContainer: {
    left: Platform.OS === "ios" ? 18 : 0,
    flexDirection: "column",
  },
  moreOptionContent: {
    flexDirection: "column",
  },
  moreOptionItem: {
    top: 30,
    marginBottom: 25,
    flexDirection: "row",
  },
  moreOptionIcon: {
    width: "15%",
    justifyContent: "center",
    alignItems: "center",
  },
  moreOptionTextContainer: {
    left: Platform.OS === "ios" ? 20 : 20,
    width: "65%",
    flexDirection: "column",
  },
  moreOptionTextHeading: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  moreOptionTextInfo: {
    marginTop: 3,
    opacity: 0.8,
    color: COLORS.white,
    fontSize: Platform.OS === "ios" ? 14 : 14,
    fontFamily: "PoppinsLight",
  },

  //loading section
  loadingContainer: {
    flex: 1,
    marginBottom: 80,
  },

  //comment modal
  modalContainer: {
    height: "50%",
    marginTop: 10,
  },
  commentModalPopup: {
    flex: 1,
  },
  innerModalContainer: {
    flex: 1,
    marginTop: "100%",
    padding: "4%",
    backgroundColor: COLORS.black,
  },
  innerModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  innerModalHeaderText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  commentHeaderUnderline: {
    marginTop: "2.5%",
    marginBottom: 10,
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  commentReaderContainer: {
    flexDirection: "column",
    marginTop: "0%",
    width: "100%",
    height: "50%",
    paddingHorizontal: "2%",
    marginBottom: "15%",
  },
  commentReaderItems: {
    width: "80%",
    flexDirection: "row",
    marginVertical: "2%",
  },
  commentUserGradientContainer: {
    width: 58,
    height: 58,
    borderRadius: 8,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  commentUserImage: {
    top: 3,
    left: 3,
    height: 50,
    width: 50,
    borderRadius: 8,
  },
  commentUserName: {
    width: "100%",
    marginHorizontal: 10,
    marginBottom: 5,
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  commentUserText: {
    width: "100%",
    marginHorizontal: 10,
    color: COLORS.white,
    fontSize: 13,
    fontFamily: "PoppinsLight",
  },
  commentUserTimeStamp: {
    left: 20,
    marginTop: 10,
    alignSelf: "flex-end",
    color: COLORS.white,
    fontSize: 13,
    fontFamily: "PoppinsLight",
  },

  //comment actions section
  commentActionContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    top: Platform.OS === "ios" ? "0%" : "15%",
    marginBottom: "10%",
  },
  commentActionContent: {
    flex: 1,
    width: "100%",
    flexDirection: "column-reverse",
  },
  commentInput: {
    width: "100%",
  },
  comm_input: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 15,
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
  comm_container: {
    backgroundColor: COLORS.black,
    width: "100%",
    height: 40,
    padding: 10,
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: 1,
    marginVertical: 8,
  },
  cardSectionContainer: {
    flex: 1,
  },
  cardContentContainer: {
    flexDirection: "column",
  },

  //top section FlatList
  topSection: {
    flexDirection: "column",
  },
  headingInfoSection: {
    flexDirection: "row",
  },
  headingProfile: {
    flexDirection: "row",
  },
  headingText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  businessIconSmall: {
    width: 20,
    height: 20,
    borderRadius: 50,
    overflow: "hidden",
  },
  headingLocationSection: {
    flexDirection: "row",
    marginTop: "2%",
    marginBottom: "5%",
  },
  headingLocation: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  headingLocation2: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  headingTime: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },

  //middle section FlatList
  middleSection: {
    width: "100%",
  },
  businessAdImageContainer: {
    position: "relative",
  },
  businessAdImageItem: {
    alignSelf: "center",
    width: Platform.OS === "ios" ? "110%" : "106%",
    height: 360,
    borderRadius: 10,
    overflow: "hidden",
  },
  businessIconContainer: {
    flex: 1,
  },
  iconItem: {
    width: "100%",
    height: 100,
    position: "absolute",
    overflow: "hidden",
    marginTop: Platform.OS === "ios" ? "-88%" : "-95.5%",
  },
  itemSpecialContainer: {
    width: Platform.OS === "ios" ? 90 : 80,
    height: Platform.OS === "ios" ? 350 : 340,
    alignItems: "center",
    position: "absolute",
    overflow: "hidden",
    padding: Platform.OS === "ios" ? 15 : 10,
    marginTop: Platform.OS === "ios" ? "-88%" : "-95.5%",
    left: Platform.OS === "ios" ? 280 : 265,
    borderRadius: 50,
    backgroundColor: COLORS.teal,
  },
  itemSpecialContent: {
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: Platform.OS === "ios" ? "20deg" : "18deg" }],
  },
  itemSpecialText: {
    color: COLORS.white,
    fontSize: 17,
    fontFamily: "PoppinsBold",
    paddingBottom: 8,
    left: 3,
  },
  itemSpecialTextPrice: {
    color: COLORS.white,
    fontSize: 17,
    fontFamily: "PoppinsBold",
  },
  businessIconItem: {
    position: "absolute",
    width: "100%",
    height: 100,
    maxHeight: 80,
    maxWidth: 80,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.teal,
    marginTop: Platform.OS === "ios" ? "-88%" : "-100%",
    left: "0%",
  },
  businessIconSpecialContainer: {
    flex: 1,
  },
  verified: {
    display: "none",
    marginLeft: Platform.OS === "ios" ? "21%" : "23%",
    marginTop: Platform.OS === "ios" ? "-82%" : "-87%",
  },
  businessIconSpecialItem: {
    position: "absolute",
    width: "100%",
    height: 200,
    maxHeight: 90,
    maxWidth: 90,
    borderRadius: 50,
    marginTop: Platform.OS === "ios" ? "-88%" : "-100%",
    right: "0%",
    backgroundColor: COLORS.teal,
    justifyContent: "center",
  },
  businessInfoContainer: {
    flex: 1,
    bottom: Platform.OS === "ios" ? "23%" : "23%",
  },
  businessInfoItems: {
    position: "absolute",
    flexDirection: "column",
    alignSelf: "center",
    width: Platform.OS === "ios" ? "115%" : "106%",
    padding: 15,
    paddingTop: 5,
    paddingLeft: 20,
  },
  adSpecialPrice: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
    alignSelf: "center",
  },
  adItem: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "PoppinsBold",
  },
  adPrice: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "PoppinsBold",
  },
  adPriceTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontFamily: "PoppinsBold",
  },
  infoIcon: {
    alignSelf: "center",
    marginLeft: "90%",
    bottom: Platform.OS === "ios" ? "90%" : "100%",
    marginBottom: Platform.OS === "android" ? -30 : -20,
    opacity: 1,
  },

  //ad action section
  adActionContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: "1%",
    marginTop: "1%",
  },
  adActionContent: {
    flexDirection: "row",
  },
  adActionText: {
    display: "none",
    marginVertical: "3%",
    color: COLORS.black,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  adActionText2: {
    marginVertical: "3%",
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  adActionButtonsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignSelf: "center",
    marginTop: "1%",
    marginRight: Platform.OS === "ios" ? "3%" : "3%",
  },
  adActionShareItem: {
    marginVertical: "5%",
    marginRight: "5%",
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  adActionLikeItem: {
    marginVertical: "5%",
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },

  adActionMoreItem: {
    top: 3.5,
    left: 15,
    marginVertical: "5%",
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },

  //bottom section FlatList
  bottomSection: {
    flex: 1,
  },
  adDescription: {
    top: "3%",
  },
  adDescriptionContent: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  touchableOpacity: {
    marginTop: "2%",
  },
  adCommentText: {
    marginBottom: "5%",
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //bottom end flatlist
  bottomSectionFlatlist: {
    marginBottom: "5%",
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default BubbleScreen;
