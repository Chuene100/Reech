import React, { useState, useRef } from "react";
import {
  Image,
  ImageBackground,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  AntDesign,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  Foundation,
} from "@expo/vector-icons";
import { Video } from "expo-av";
import { FlatList } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";

//customs
import {
  reechRecommendationThought,
  suggestedThoughtChannelData,
  recommendedThoughtsVideosData,
} from "../../assets/data/howTo/howToVideoData";
import { COLORS, icons, images } from "../../constants";

const ThoughtChannelScreen = () => {
  const [moreModal, setMoreModal] = useState(false);

  const item = reechRecommendationThought;

  const [following, setFollowing] = useState(item.isFollow);
  const [isSaved, setIsSaved] = useState(item.saved);
  const [isAppreciated, setIsAppreciated] = useState(item.isAppreciated);
  const [shareModal, setShareModal] = useState(false);

  const navigation = useNavigation();

  //video player config
  const videoRef = useRef(null);
  const [status, setStatus] = useState(0);

  //render recommend video or image section
  function renderRecommendedMediaItem() {
    return (
      <>
        {!item[0].isVideo ? (
          <BlurView intensity={40} style={styles.imageContent}>
            <Image
              blurRadius={5}
              source={item[0].video}
              style={styles.imageItem}
            />
          </BlurView>
        ) : (
          <Video
            ref={videoRef}
            usePoster={true}
            resizeMode="cover"
            shouldPlay={false}
            isPlaying={true}
            volume={1.0}
            rate={1.0}
            isMuted={false}
            playsInSilentLockedModeIOS={false}
            onPlaybackStatusUpdate={(status) => setStatus(() => status)}
            source={item[1].video}
            posterSource={item[1].video}
            style={styles.videoContent}
            ignoreSilentSwitch={"ignore"}
            contentType="video/mp4"
            selectedAudioTrack={{
              type: "mp4",
              value: item[1].video,
            }}
            isExternalPlaybackActive={false}
            isLooping
          />
        )}
      </>
    );
  }

  //item info description
  function renderVideoOrImageDescriptionItems() {
    return (
      <>
        <Text style={styles.actionBlurbText}>🔥 Trending</Text>
        <Text numberOfLines={1} style={styles.actionText}>
          {item[0].videoName}
        </Text>
      </>
    );
  }

  function renderTouchableActionSection() {
    return (
      <>
        {/*empty placeholder*/}
        <Text>
          <FontAwesome name="" size={24} color={COLORS.black} />
        </Text>

        {/*play and pause video function section*/}
        {!item[0].isVideo ? null : (
          <TouchableOpacity
            onPress={() =>
              status.isPlaying
                ? videoRef.current.pauseAsync()
                : videoRef.current.playAsync()
            }
            style={styles.buttonPlay}
          >
            <View style={styles.icon}>
              {status.isPlaying ? (
                <Foundation
                  name="pause"
                  size={24}
                  color={COLORS.white}
                  style={{ right: 3 }}
                />
              ) : (
                <FontAwesome name="play" size={24} color={COLORS.white} />
              )}
            </View>
          </TouchableOpacity>
        )}

        {/*see more info about thumbnail video poster*/}
        <Text
          onPress={() => setMoreModal(true)}
          style={styles.actionTextSeeMore}
        >
          see more...
        </Text>
      </>
    );
  }

  function renderSeeMoreModalSection() {
    return (
      <Modal
        visible={moreModal}
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        style={styles.modalContainer}
      >
        <View style={styles.innerModalContainer}>
          {/*top action section*/}
          <View style={styles.innerModalHeader}>
            {/*close action section*/}
            <Pressable onPress={() => setMoreModal(false)}>
              <AntDesign name="closecircle" size={18} color={COLORS.white} />
            </Pressable>

            <Pressable>
              <AntDesign name="" size={25} color={COLORS.white} />
            </Pressable>

            {/*see more action section*/}
            <Pressable onPress={() => console.log("more option clicked")}>
              <MaterialIcons name="more-vert" size={18} color={COLORS.white} />
            </Pressable>
          </View>

          <View style={styles.modalLiner}></View>

          {/*user image section*/}
          <View style={styles.userVideoDetailsContainer}>
            <ImageBackground
              source={images.userFrame}
              style={styles.gradientColorContainerThoughtScreen}
            >
              <Image
                source={item[0].userAccountImage}
                style={styles.commentAccountImage}
              />
            </ImageBackground>

            {/*poster details: text*/}
            <View style={styles.commentAccountTextContainer}>
              <Text
                onPress={() =>
                  navigation.navigate(
                    "AccountFullViewScreen",
                    setMoreModal(false)
                  )
                }
                style={styles.commentAccountNameText}
              >
                {item[0].userTitle}
              </Text>

              <Text style={styles.commentAccountProfileText}>
                {item[0].userProfileName}
              </Text>

              <Text
                numberOfLines={2}
                style={[
                  styles.commentAccountProfileText,
                  {
                    maxWidth: "74%",
                  },
                ]}
              >
                {item[0].blurb}
              </Text>

              {/* top account actions*/}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Text
                  onPress={() => setFollowing(!following)}
                  style={[
                    styles.commentAccountProfileText,
                    {
                      color: following ? COLORS.darkGray : COLORS.purple,
                      fontFamily: "PoppinsBold",
                      width: "50%",
                    },
                  ]}
                >
                  {following ? "Unfollow" : "Follow"}
                </Text>

                <Text
                  style={[
                    styles.commentAccountProfileText,
                    {
                      color: COLORS.darkGray,
                      fontFamily: "PoppinsBold",
                      width: "50%",
                    },
                  ]}
                >
                  {item[0].totalVideos} videos posted
                </Text>
              </View>
            </View>
          </View>

          {/*poster details: description*/}
          <View style={styles.modalDescriptionContainer}>
            <Text style={styles.commentAccountNameText}>
              {item[0].videoName}
            </Text>

            <Text numberOfLines={7} style={styles.modalDescriptionItem}>
              {item[0].description}
            </Text>
          </View>

          {/*tip buttons*/}
          <View style={styles.btnContainer}>
            {/*channel item*/}
            <View style={styles.btnContentDollar}>
              <Image source={icons.arrowIcon} style={styles.btnImgItem} />
              <Text
                onPress={() => {
                  navigation.navigate("ThoughtSingleChannelCategoryScreen", {
                    item: item[0],
                  });
                  setMoreModal(false);
                }}
                style={styles.btnTextItem}
              >
                {item[0].videoChannel} Channel
              </Text>
            </View>

            {/*tip button item*/}
            <Pressable
              onPress={() => {
                navigation.navigate("TipCreatorScreen", {
                  profilePicture: item[0].userAccountImage,
                  title: item[0].userTitle,
                  userName: item[0].userProfileName,
                  video: item[0].videoName,
                });
                setMoreModal(false);
              }}
              style={styles.btnContentTip}
            >
              <Image source={images.tipButton} />
            </Pressable>
          </View>

          {/*video reaction section*/}
          <View style={styles.btnContainerAction}>
            {/*appreciate video*/}
            <Pressable
              onPress={() => setIsAppreciated(!isAppreciated)}
              style={styles.btnContentTipAction}
            >
              <Text style={styles.btnTextItemAction}>
                {isAppreciated
                  ? item[0].appreciationCount + 1
                  : item[0].appreciationCount}
                {"   "}
                <MaterialCommunityIcons
                  name="hand-clap"
                  size={16}
                  color={COLORS.white}
                />
              </Text>
            </Pressable>

            {/*share video*/}
            <Pressable
              onPress={() => setShareModal(!shareModal)}
              style={styles.btnContentTipAction}
            >
              <Text style={styles.btnTextItemAction}>
                {shareModal ? "Shared" : "Share"}
                {"   "}
                <FontAwesome
                  name="share-square-o"
                  size={16}
                  color={COLORS.white}
                />
              </Text>
            </Pressable>

            {/*save video*/}
            <Pressable
              onPress={() => setIsSaved(!isSaved)}
              style={styles.btnContentTipAction}
            >
              <Text style={styles.btnTextItemAction}>
                {isSaved ? "Saved" : "Save"}
                {"   "}
                {isSaved ? (
                  <Ionicons
                    name="md-bookmarks"
                    size={16}
                    color={COLORS.white}
                  />
                ) : (
                  <FontAwesome5
                    name="bookmark"
                    size={16}
                    color={COLORS.white}
                  />
                )}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }

  //header section
  function renderScreenItemListSection() {
    return (
      <View style={styles.videoItemContainer}>
        {/*show video or image thought*/}
        {renderRecommendedMediaItem()}

        {/*title & action section*/}
        <View style={styles.actionContainer}>
          {renderVideoOrImageDescriptionItems()}

          {/*screen play content section*/}
          <View style={styles.actionOptions}>
            {renderTouchableActionSection()}

            {/*tip creator modal*/}
            {renderSeeMoreModalSection()}
          </View>
        </View>
      </View>
    );
  }

  //channel recommendations
  function renderChannelRecommendationsSection() {
    return (
      <>
        <Text style={styles.categoryText}>Channels recommended for you</Text>

        <FlatList
          horizontal
          data={suggestedThoughtChannelData}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  item.isVideo && status.isPlaying
                    ? videoRef.current.pauseAsync()
                    : navigation.navigate("PostOpScreen", { idx: 1 })
                }
                style={styles.suggestionContainer}
              >
                <Image
                  source={item.channelImage}
                  style={styles.channelImageItem}
                />
                <View style={styles.channelNameItemContainer}>
                  <Text style={styles.channelNameItem}>{item.channelName}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </>
    );
  }

  //watch or viewed content section
  function renderWatchedOrViewedThoughtsSection() {
    return (
      <>
        <Text style={styles.categoryText}>
          Because you {item[0].isVideo ? "watched" : "viewed"} a{" "}
          {item[0].isVideo ? "video" : "thought"} on art of war
        </Text>

        <FlatList
          horizontal
          data={recommendedThoughtsVideosData}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  status.isPlaying
                    ? videoRef.current.pauseAsync()
                    : navigation.navigate("PostOpScreen", { idx: 1 })
                }
                style={styles.recommendContainer}
              >
                <Image
                  source={item.channelImage}
                  style={styles.channelImageRecommend}
                />
                <View style={styles.channelNameItemRecommend}>
                  <Text numberOfLines={2} style={styles.channelNameItemText}>
                    {item.recommendationName}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </>
    );
  }

  //below button section
  function belowButtonNavigationSection() {
    return (
      <View style={styles.iconSections}>
        {/*go back*/}
        <Pressable onPress={() => navigation.goBack()}>
          <Image source={icons.howToIcon} style={styles.howToIconItem} />
        </Pressable>

        {/*add how to image*/}
        <Pressable
          onPress={() => [
            status.isPlaying
              ? videoRef.current.pauseAsync()
              : navigation.navigate("AddThoughtScreen"),
          ]}
        >
          <Image source={images.plus2} style={styles.plusIcon} />
        </Pressable>

        {/*show channels image*/}
        <Pressable
          onPress={() => navigation.navigate("ThoughtsChannelCategoryScreen")}
        >
          <Image source={icons.arrowIcon} style={styles.howToIconItem} />
        </Pressable>
      </View>
    );
  }

  //scrollable section
  function renderScrollableSection() {
    return (
      <ScrollView
        style={styles.categoriesContainer}
        showsVerticalScrollIndicator={false}
      >
        {/*channels section*/}
        {renderChannelRecommendationsSection()}

        {/*recommendations section*/}
        {renderWatchedOrViewedThoughtsSection()}

        {/*navigation section*/}
        {belowButtonNavigationSection()}
      </ScrollView>
    );
  }

  return (
    <View style={styles.screenContainer}>
      {renderScreenItemListSection()}
      {renderScrollableSection()}
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: COLORS.black,
  },
  videoItemContainer: {
    width: "100%",
    height: "45%",
    marginBottom: 25,
  },
  videoContent: {
    width: "100%",
    height: "100%",
    position: "absolute",
    backgroundColor: COLORS.transparent,
  },
  imageContent: {
    width: "100%",
    height: "100%",
    position: "absolute",
    backgroundColor: COLORS.transparent,
  },
  imageItem: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },

  //action section
  actionContainer: {
    flexDirection: "column",
    top: Platform.OS === "ios" ? "78%" : "75%",
    paddingHorizontal: 10,
    zIndex: 1,
  },
  actionBlurbText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    marginBottom: 5,
  },
  actionText: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: "PoppinsLight",
  },
  actionOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  buttonPlay: {
    overflow: "hidden",
    top: Platform.OS === "ios" ? 20 : 12,
    padding: 10,
    left: Platform.OS === "ios" ? 40 : 35,
    width: "13%",
    borderRadius: 50,
    borderColor: COLORS.white,
    borderWidth: 0.2,
    backgroundColor: COLORS.reechGray,
  },
  icon: {
    alignSelf: "center",
    left: 3,
  },
  actionTextSeeMore: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },

  //tip modal section
  modalContainer: {
    height: "0%",
    marginTop: 10,
  },
  innerModalContainer: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? "100%" : "85%",
    padding: "4%",
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    backgroundColor: COLORS.black,
  },
  innerModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalLiner: {
    alignSelf: "center",
    width: "40%",
    marginTop: Platform.OS === "ios" ? "2.5%" : 0,
    marginBottom: "5%",
    borderRadius: 20,
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth * 3,
  },
  userVideoDetailsContainer: {
    flexDirection: "row",
    paddingTop: 5,
  },
  commentAccountTextContainer: {
    flexDirection: "column",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  commentAccountNameText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
    paddingTop: 5,
  },
  commentAccountProfileText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    paddingTop: 5,
  },
  gradientColorContainerThoughtScreen: {
    width: Platform.OS === "ios" ? 110 : 100,
    height: Platform.OS === "ios" ? 110 : 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  commentAccountImage: {
    height: Platform.OS === "ios" ? 100 : 90,
    width: Platform.OS === "ios" ? 100 : 90,
    borderRadius: 8,
  },
  modalDescriptionContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  modalDescriptionItem: {
    top: 5,
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },

  //share button section
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
    paddingHorizontal: 5,
  },
  btnContentDollar: {
    flexDirection: "row",
    width: "45%",
  },
  btnImgItem: {
    width: 40,
    height: 40,
    resizeMode: "cover",
  },
  btnTextItem: {
    bottom: 2,
    left: 5,
    alignSelf: "center",
    color: COLORS.darkGray,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  btnContentTip: {
    flexDirection: "row",
    justifyContent: "center",
    width: "40%",
    padding: 5,
  },
  btnTextItemTip: {
    left: 5,
    alignSelf: "center",
    color: COLORS.purple,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  btnContainerAction: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 5,
  },
  btnContentTipAction: {
    flexDirection: "row",
    justifyContent: "center",
    width: "32%",
    height: 40,
    padding: 5,
    backgroundColor: COLORS.reechGray,
    borderRadius: 20,
  },
  btnTextItemAction: {
    alignSelf: "center",
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //categories section
  categoriesContainer: {
    padding: 5,
    flexDirection: "column",
    maxHeight: "49%",
  },
  categoryText: {
    color: COLORS.darkGray,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  channelImageItem: {
    width: 148,
    height: 140,
    resizeMode: "cover",
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 5,
    marginTop: 10,
  },
  channelNameItemContainer: {
    bottom: 90,
    marginBottom: -25,
    right: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  channelNameItem: {
    padding: 5,
    opacity: 1,
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    backgroundColor: COLORS.transparent,
    textAlign: "center",
  },
  suggestionContainer: {
    backgroundColor: COLORS.transparent,
    justifyContent: "center",
    alignItems: "center",
  },
  recommendContainer: {
    backgroundColor: COLORS.transparent,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 160,
  },
  channelNameItemRecommend: {
    width: "97%",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 34,
    marginRight: 10,
  },
  channelImageRecommend: {
    width: 145,
    height: 140,
    resizeMode: "cover",
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginRight: 10,
    marginBottom: 5,
    marginTop: 10,
  },
  channelNameItemText: {
    bottom: 2,
    textAlign: "center",
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    width: "60%",
  },

  //icon section
  iconSections: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Platform.OS === "ios" ? "0%" : "9%",
  },
  howToIconItem: {
    width: 30,
    height: 30,
    resizeMode: "cover",
  },
  plusIcon: {
    width: 60,
    height: 60,
    resizeMode: "cover",
    marginHorizontal: 25,
  },
});

export default ThoughtChannelScreen;
