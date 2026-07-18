import React, { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, Image, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Video } from "expo-av";
import { FontAwesome5, Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";

//customs
import { COLORS, icons } from "../../constants";

const SingleHowToVideo = ({ item, index, currentIndex }) => {
  const navigation = useNavigation();

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  //video config
  const videoRef = useRef(null);
  const [status, setStatus] = useState(false);

  //video actions
  const [muted, setMuted] = useState(false);
  const [toggleText, setToggleText] = useState(false);

  //controls video should play if current index
  useEffect(() => {
    if (index === currentIndex) {
      setStatus(true);
    } else {
      setStatus(false);
    }
  }, [index, currentIndex]);

  //controls the video mute icon
  useEffect(() => {
    if (muted) {
      videoRef.current && videoRef.current.setIsMutedAsync(true);
    } else {
      videoRef.current && videoRef.current.setIsMutedAsync(false);
    }
  }, [muted]);

  useEffect(() => {
    const unsubscribeBlur = navigation.addListener('blur', () => {
      if (videoRef.current && index === currentIndex) {
        videoRef.current.pauseAsync();
      }
    });

    const unsubscribeFocus = navigation.addListener('focus', () => {
      if (videoRef.current && index === currentIndex) {
        videoRef.current.playAsync(); // Resume playing the video
      }
    });

    return () => {
      unsubscribeBlur();
      unsubscribeFocus();
    };
  }, [navigation, index, currentIndex]);



  //video playing section
  function renderVideoPlayingSection() {
    return (
      <View style={{ width: windowWidth, height: windowHeight - 50 }}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.videoItemPlayingContainer}
          onPress={() => {
            setStatus(!status)
          }}
        >
          <Video
            ref={videoRef}
            source={{ uri: item?.video }}
            contentType="video/mp4"
            selectedAudioTrack={{
              type: "video",
              value: item?.video,
            }}
            posterSource={item?.video}
            usePoster={true}
            shouldPlay={status}
            isExternalPlaybackActive={false}
            useNativeControls={false}
            isLooping={true}
            volume={1.0}
            rate={1.0}
            isMuted={muted}
            playsInSilentLockedModeIOS={false}
            ignoreSilentSwitch={"ignore"}
            style={[styles.videoItemPlayingContainer]}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    );
  }

  //video info section
  function renderVideoInfoSection() {
    return (
      <View style={[styles.videoInfoPlayerContainer, { width: windowWidth }]}>
        <View style={styles.videoInfoPlayerContent}>
          {/*pause and play button*/}
          {status ? null :
            <TouchableOpacity
              onPress={() => { setStatus(!status) }}
              style={styles.videoPlayerActionContentContainer}
            >
              <View style={styles.videoPlayerActionContent}>
                <Ionicons name="play" size={22} color={COLORS.white} />
              </View>
            </TouchableOpacity>
          }

          {/*Video name*/}
          <View style={styles.videoInfoNameContainer}>
            <Text
              numberOfLines={1}
              style={styles.videoInfoNameItem}
            >
              {item?.title}
            </Text>
          </View>

          {/*video location*/}
          <View style={styles.videoLocationItemContainer}>
            <Text numberOfLines={1} style={styles.videoLocationItemText}>
              <MaterialIcons
                name="location-on"
                size={12}
                color={COLORS.white}
              />{" "}
              {item.address}
            </Text>
          </View>

          {/*video description section*/}
          <View style={[styles.videoInfoDescriptionContainer, { marginBottom: item?.description?.length > 53 ? 0 : 22 }]}>
            <Text
              numberOfLines={toggleText ? undefined : 1}
              style={styles.videoInfoDescriptionItem}
            >
              {item?.description}
            </Text>

            {/*see more toggler*/}
            {item?.description?.length > 53 && <TouchableOpacity
              onPress={() => setToggleText(!toggleText)}
              style={styles.seeMoreToggleContainer}
            >
              <Text style={styles.seeMoreToggleItem}>
                {!toggleText ? "See more" : "Hide"}
              </Text>
            </TouchableOpacity>}
          </View>

          {/*see sub channel screen*/}
          <View style={styles.videoSubChannelContainer}>
            {/*channel image*/}
            <View style={styles.videoSubChannelImageContainer}>
              <Image
                source={icons.arrowIcon}
                style={styles.videoSubChannelImageItem}
              />
            </View>

            {/*channel name*/}
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("HowToSingleChannelCategoryScreen", {
                  item: item,
                })
              }
              style={styles.videoSubChannelTextContainer}
            >
              <Text style={styles.videoSubChannelText}>
                {item?.channelId?.channel} Channel
              </Text>
            </TouchableOpacity>
          </View>

          {/*marquee section*/}
          <View style={styles.marqueePlayerContainer}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("HowToChannelTogglerScreen", {
                  idx: 0,
                })
              }
              style={styles.marqueeTextContent}
            >
              <Text style={styles.marqueeTextItem}>🔥 {`See what's trending`}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  //video action section
  function renderVideoActionSection() {
    return (
      <View style={styles.videoActionContainerSection}>
        {/*mute video action*/}
        <TouchableOpacity
          onPress={() => setMuted(!muted)}
          style={styles.videoMuteContainer}
        >
          {muted ? (
            <FontAwesome5 name="volume-mute" size={20} color={COLORS.white} />
          ) : (
            <Octicons name="unmute" size={20} color={COLORS.white} />
          )}
        </TouchableOpacity>

        {/*reech logo pop-up modal action*/}
        <TouchableOpacity
          onPress={() => navigation.navigate("HowToVideoMoreInfoScreen", { item: item })}
          style={styles.reechLogoModalContainer}
        >
          <Image
            source={require("../../assets/appIcon.png")}
            style={styles.reechLogoImageItem}
          />
        </TouchableOpacity>

        {/*add new how-to video*/}
        <TouchableOpacity
          onPress={() => navigation.navigate("HowToAddVideoScreen")}
          style={styles.reechAddHowToContainer}
        >
          <Image
            source={icons.addIcon}
            style={styles.reechAddHowToImageItem}
          />
        </TouchableOpacity>
      </View>
    );
  }



  //screen content list
  function renderScreenContentList() {
    return (
      <>
        {renderVideoPlayingSection()}
        {renderVideoInfoSection()}
        {renderVideoActionSection()}
      </>
    );
  }

  return (
    <View
      key={index}
      style={[
        styles.videoContentContainer,
        {
          width: windowWidth,
          height: windowHeight - 45,
        },
      ]}
    >
      {renderScreenContentList()}
    </View>
  );
};

const styles = StyleSheet.create({
  videoContentContainer: {
    position: "relative",
  },

  //video playing item
  videoItemPlayingContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },

  //video info section
  videoInfoPlayerContainer: {
    position: "absolute",
    padding: 10,
    zIndex: 1,
    bottom: Platform.OS === "ios" ? 50 : 10,
  },
  videoInfoPlayerContent: {
    flexDirection: "column",
  },
  videoPlayerActionContentContainer: {
    bottom: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  videoPlayerActionContent: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    backgroundColor: COLORS.reechGray,
  },
  videoInfoNameContainer: {
    width: "90%",
  },
  videoInfoNameItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  videoLocationItemContainer: {
    width: "80%",
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  videoLocationItemText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  videoInfoDescriptionContainer: {
    width: "80%",
    flexDirection: "column",
  },
  videoInfoDescriptionItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  seeMoreToggleContainer: {
    marginTop: 5,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  seeMoreToggleItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
    opacity: 0.5,
  },
  videoSubChannelContainer: {
    width: "82%",
    flexDirection: "row",
  },
  videoSubChannelImageContainer: {
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  videoSubChannelImageItem: {
    height: 35,
    width: 35,
    resizeMode: "cover",
  },
  videoSubChannelTextContainer: {
    width: "95%",
    marginLeft: "2.5%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  videoSubChannelText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  marqueePlayerContainer: {
    width: "44%",
    marginTop: 10,
    paddingVertical: 4,
    justifyContent: "center",
    borderRadius: 30,
    borderColor: COLORS.darkGray,
    backgroundColor: COLORS.reechGray,
  },
  marqueeTextContent: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  marqueeTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },

  //video action section
  videoActionContainerSection: {
    position: "absolute",
    right: 8,
    alignItems: "center",
    flexDirection: "column",
    zIndex: 1,
    bottom: Platform.OS === "ios" ? 56 : 10,
  },
  videoMuteContainer: {
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  reechLogoModalContainer: {
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  reechLogoImageItem: {
    width: 60,
    height: 60,
    resizeMode: "cover",
    borderRadius: 50,
    borderColor: COLORS.purple,
    borderWidth: 2,
  },
  reechAddHowToContainer: {
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  reechAddHowToImageItem: {
    width: 65,
    height: 65,
    resizeMode: "cover",
    borderRadius: 50,
  },
});

export default SingleHowToVideo;
