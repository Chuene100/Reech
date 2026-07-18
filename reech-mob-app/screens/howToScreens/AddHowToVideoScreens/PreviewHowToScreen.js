import React, { useState, useRef } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { Video } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

//import customs
import { COLORS, icons } from "../../../constants";
import NavHeader from "@/components/Headers/NavHeader";
import { useUploadSingleFileMutation } from "../../../redux/api/api-slice";
import { usePostHowToMutation } from "../../../redux/api/how-to";

const PreviewHowToScreen = ({ route }) => {
  const navigation = useNavigation();

  const { handleSubmit } = useForm();

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const payload = route.params.data;
  const subChannel = route.params.subChannel;

  const [uploadFn, { isLoading: isUploadingImage }] = useUploadSingleFileMutation();
  const [createFn, { isLoading }] = usePostHowToMutation();


  //video config
  const videoRef = useRef(null);
  
  const [status, setStatus] = useState(0);
  const [toggleText, setToggleText] = useState(false);

  const showError = (res) =>
    Toast.show({
      type: "error",
      text1: "Error",
      text2: res.error.data?.error ?? "Something went wrong. Please try again",
    });

  const showToast = (message) =>
    Toast.show({
      type: "success",
      text1: "Success",
      text2: message,
    });

  
  const submitButtonPressed = async (data) => {
    const file = {
      name: payload.video.name,
      uri: payload.video.uri,
      type: 'video',
    };

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await uploadFn(formData);
      const url = data.data;
      payload.video = url;
    } catch (error) {
      console.error(error);
      return;
    }

    createFn(payload)
      .then(async (res) => {
        if (res.error) {
          showError(res);
          return;
        }

        showToast(res?.data?.message)
        navigation.navigate("HowToChannelTogglerScreen", { idx: 0 })
      })
      .catch((err) => {
        var error = err.response.data
          ? err.response.data.error
          : "Network error, please try again later";
        console.log(error)
      });
  };


  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <NavHeader
          message="What would you like to do?"
        />
      </View>
    );
  }

  //video display section
  function renderVideoDisplaySection() {
    return (
      <View
        style={[
          { width: windowWidth, height: windowHeight },
          styles.videoContainer,
        ]}
      >
        <TouchableOpacity activeOpacity={0.8} style={styles.videoContent}>
          <Video
            ref={videoRef}
            usePoster={true}
            resizeMode="cover"
            shouldPlay
            useNativeControls
            isLooping
            volume={1.0}
            rate={1.0}
            playsInSilentLockedModeIOS={false}
            onPlaybackStatusUpdate={(status) => setStatus(() => status)}
            source={{ uri: payload.video.uri }}
            style={styles.videoContent}
            ignoreSilentSwitch={"ignore"}
          />
        </TouchableOpacity>
      </View>
    );
  }

  //user description content
  function renderUserDescriptionContentSection() {
    return (
      <View style={[styles.imageTopContainer, { width: windowHeight }]}>
        {/*video name section*/}
        <View style={styles.imageTouch}>
          <View style={styles.imageContainer}>
            <View style={styles.textContainer}>
              <Text numberOfLines={1} style={styles.userTitleText}>
                {payload.title}
              </Text>
            </View>
          </View>
        </View>

        {/*video location section*/}
        <View style={styles.imageTouch}>
          <View style={styles.imageContainer}>
            <View style={styles.textContainer}>
              <Text numberOfLines={1} style={styles.userLocationText}>
                <MaterialIcons
                  name="location-on"
                  size={14}
                  color={COLORS.white}
                />{" "}
                {payload.address}
              </Text>
            </View>
          </View>
        </View>

        {/*video description section*/}
        <View style={styles.imageTouch}>
          <View style={styles.imageContainer}>
            <View style={styles.textContainer}>
              <Text
                numberOfLines={toggleText ? undefined : 1}
                style={styles.userDescriptionText}
              >
                {payload.description}
              </Text>
            </View>
          </View>
        </View>

        {/*video see more section*/}
        <View style={styles.seeMoreTextContainer}>
          <Text
            onPress={() => setToggleText(!toggleText)}
            numberOfLines={1}
            style={styles.userDescriptionText}
          >
            {!toggleText ? "See more" : "Hide"}
          </Text>
        </View>

        {/*video channel section*/}
        <View style={styles.imageTouch}>
          <View style={styles.imageContainer}>
            <View style={styles.textsContainer}>
              <Image source={icons.arrowIcon} style={styles.moreOptionImage} />
              <Text
                numberOfLines={toggleText ? 10 : 1}
                style={styles.userChannelText}
              >
                {subChannel?.channel} Channel
              </Text>
            </View>
          </View>
        </View>

        {/*submit button content*/}
        <View style={styles.submitButtonContentContainer}>
          {renderButtonSubmitSection()}
        </View>
      </View>
    );
  }

  //submit button section
  function renderButtonSubmitSection() {
    return (
      <Pressable
        onPress={handleSubmit(submitButtonPressed)}
        style={styles.buttonContainer}
      >
        <LinearGradient
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
          style={styles.buttonGradientContainer}
        >
          <Text style={styles.buttonTextItem}>
            {isLoading || isUploadingImage ?
              <ActivityIndicator size={30} color={COLORS.white} /> :
              "Post"}
          </Text>
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeaderSection()}
      {renderVideoDisplaySection()}
      {renderUserDescriptionContentSection()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //header section
  headerContainer: {
    marginTop: Platform.OS === "ios" ? "11%" : "0%",
    zIndex: 99,
  },

  //video display section
  videoContainer: {
    bottom: 85,
    position: "relative",
  },
  videoContent: {
    width: "100%",
    height: Platform.OS === "ios" ? "100%" : "103%",
    position: "absolute",
    zIndex: -5,
    backgroundColor: COLORS.transparent,
  },

  //user description section
  imageTopContainer: {
    position: "absolute",
    zIndex: 1,
    bottom: Platform.OS === "ios" ? 10 : -40,
    padding: 10,
    marginBottom: 0,
  },
  imageContainer: {
    width: 100,
    flexDirection: "row",
    alignItems: "center",
  },
  imageContent: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderColor: COLORS.transparent,
    borderWidth: 2,
    margin: 10,
  },
  userNameImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 100,
  },
  textContainer: {
    marginLeft: 10,
    bottom: 55,
    flexDirection: "column",
  },
  userTitleText: {
    minWidth: 350,
    color: COLORS.white,
    fontSize: 20,
    fontFamily: "PoppinsLight",
  },
  userLocationText: {
    marginVertical: 10,
    minWidth: 350,
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  userDescriptionText: {
    minWidth: Platform.OS === "ios" ? 350 : 300,
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  seeMoreTextContainer: {
    marginTop: 5,
    marginLeft: Platform.OS === "ios" ? "32%" : "36%",
    bottom: 55,
  },
  moreOptionImage: {
    marginLeft: 4,
    width: 40,
    height: 40,
    resizeMode: "cover",
  },
  textsContainer: {
    marginLeft: 10,
    bottom: 55,
    flexDirection: "row",
  },
  userChannelText: {
    left: 10,
    minWidth: 255,
    alignSelf: "center",
    fontSize: 16,
    fontFamily: "PoppinsBold",
    color: COLORS.white,
  },

  //button submit section
  submitButtonContentContainer: {
    width: "50%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingHorizontal: Platform.OS === "ios" ? 50 : 5,
    bottom: 50,
  },
  buttonContainer: {
    width: "50%",
  },
  buttonGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    height: 45,
    width: "100%",
  },
  buttonTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
});

export default PreviewHowToScreen;
