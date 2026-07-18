import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  useWindowDimensions,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { LinearGradient } from "expo-linear-gradient";
import * as VideoPicker from "expo-image-picker";
import * as VideoThumbnails from "expo-video-thumbnails";

//import customs
import { COLORS, icons } from "../../../constants";
import { CustomAccountToggler } from "../../../components";
import NavHeader from "@/components/Headers/NavHeader";

const HowToAddVideoScreen = () => {
  const navigation = useNavigation();
  const { height } = useWindowDimensions();

  const { control, handleSubmit } = useForm();

  //video picker
  const [hasGalleryPermission, setHasGalleryPermission] = useState(false);
  const [selectedVideoItem, setSelectedVideoItem] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  //require user access to media files
  useEffect(() => {
    (async () => {
      const galleryStatus =
        await VideoPicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();
  }, []);

  //video picker function
  const pickVideo = async () => {
    let chosenVideo = await VideoPicker.launchImageLibraryAsync({
      mediaTypes: VideoPicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      videoQuality: VideoPicker.UIImagePickerControllerQualityType.Medium,
      videoExportPreset: VideoPicker.VideoExportPreset.H264_960x540,
    });

    if (chosenVideo.canceled) {
      return alert(
        "You haven't chosen any video file.\n Do you wanna try again?"
      );
    }

    if (!chosenVideo.canceled) {
      setSelectedVideoItem(chosenVideo.uri);
      generateThumbnail(chosenVideo.uri);
    }
  };

  //generate video thumbnail
  const generateThumbnail = async (chosenVideo) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(chosenVideo, {
        time: 15000,
      });
      // setSelectedVideoItem(uri);
      setThumbnail(uri)
    } catch (e) {
      console.warn(e);
    }
  };

  //prompt user to if not given access to media files
  if (hasGalleryPermission === false) {
    return alert("Permission to access your gallery is required!");
  }

  //handle data
  const nextButtonPressed = async (data) => {
    const fileName = selectedVideoItem.split("/").pop();
    const newData = {
      notifyBubble: data.notifyBubble === undefined ? false : data.notifyBubble,
      video: {
        name: "_howto-" + fileName,
        uri: selectedVideoItem,
        type: "video",
      },
    };

    // console.log("first batch data: ", newData);

    navigation.navigate("AddMoreHowToVideoInfoScreen", {
      data: newData,
    });
  };

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <NavHeader message="What would you like to do?" />
      </View>
    );
  }

  {
    /*
  Please note: This bubble notifications should only be a notification 
  sent to your bubble’s message/chat section
 */
  }
  function renderNotifySection() {
    return (
      <View style={styles.topSectionContainer}>
        <View style={styles.topSectionContent}>
          <View style={styles.topSectionTextContainer}>
            <Text style={styles.topSectionText}>Notify bubble</Text>
          </View>

          <View style={styles.notifier}>
            <CustomAccountToggler name="notifyBubble" control={control} />
          </View>
        </View>
      </View>
    );
  }

  //video selector section
  function renderVideoSelectorSection() {
    return (
      <View style={styles.videoPickerContainer}>
        <>
          <View style={styles.videoPickerContent}>
            <TouchableOpacity
              style={styles.videoTouchableContainer}
              onPress={() => pickVideo()}
            >
              {selectedVideoItem ? (
                <View style={styles.VideoPicker}>
                  <Image
                    source={{ uri: thumbnail }}
                    style={[
                      styles.VideoPicker,
                      styles.videoOutcomeItem,
                      {
                        height:
                          Platform.OS === "ios" ? height * 0.74 : height * 0.79,
                        borderWidth: 0,
                      },
                    ]}
                    resizeMode="cover"
                  />
                </View>
              ) : (
                <View style={styles.VideoPicker}>
                  <View
                    style={[
                      styles.VideoPicker,
                      styles.videoOutcomeItem,
                      {
                        height:
                          Platform.OS === "ios" ? height * 0.74 : height * 0.79,
                      },
                    ]}
                  >
                    <Text style={styles.videoTextItem}>Add your video</Text>
                    <Text style={styles.videoWarningTextItem}>
                      (max size 15mb)
                    </Text>
                    <Image
                      source={icons.addIconPicture}
                      style={styles.addIconPicture}
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </>
      </View>
    );
  }

  //next button section
  function renderNextButtonSection() {
    return (
      <View style={styles.nextButtonContainer}>
        <View style={styles.nextButtonContent}>
          <Pressable
            onPress={handleSubmit(nextButtonPressed)}
            style={styles.nextContainer}
          >
            <LinearGradient
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
              style={styles.nextGradientContainer}
            >
              <Text style={styles.nextTextItem}>Next</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    );
  }

  //screen list content
  return (
    <View style={styles.container}>
      {renderHeaderSection()}
      {renderNotifySection()}
      {renderVideoSelectorSection()}
      {renderNextButtonSection()}
    </View>
  );
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //header section
  headerContainer: {
    zIndex: 99,
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },

  //notifier
  topSectionContainer: {
    flexDirection: "column",
  },
  topSectionContent: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: Platform.OS === "android" ? "5%" : "4%",
  },
  topSectionTextContainer: {
    marginTop: "1%",
  },
  topSectionText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "PoppinsLight",
  },
  notifier: {
    marginTop: "0%",
  },

  //video picker section
  videoPickerContainer: {
    marginTop: 10,
  },
  videoPickerContent: {
    flex: 1,
    marginLeft: "8%",
  },
  videoTouchableContainer: {
    zIndex: 10,
  },
  VideoPicker: {
    right: Platform.OS === "ios" ? 15 : 8,
    width: Platform.OS === "ios" ? 420 : 338,
  },
  videoOutcomeItem: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 8,
  },
  videoTextItem: {
    fontSize: 16,
    color: COLORS.white,
    fontFamily: "PoppinsLight",
  },
  videoWarningTextItem: {
    marginVertical: 20,
    fontSize: 14,
    color: COLORS.darkGray,
    fontFamily: "PoppinsLight",
  },
  addIconPicture: {
    height: 100,
    width: 100,
    marginTop: 0,
  },

  //next button section
  nextButtonContainer: {
    flex: 1,
    position: "absolute",
    width: "30%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    right: 15,
    bottom: Platform.OS === "ios" ? 50 : 0,
  },
  nextButtonContent: {
    width: "100%",
  },
  nextContainer: {
    zIndex: 10,
  },
  nextGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    height: 45,
    width: "100%",
  },
  nextTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
});

export default HowToAddVideoScreen;
