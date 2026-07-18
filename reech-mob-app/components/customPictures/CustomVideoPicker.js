import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";
import { Controller } from "react-hook-form";
import * as VideoPicker from "expo-image-picker";
import * as VideoThumbnails from "expo-video-thumbnails";
import { Ionicons } from "@expo/vector-icons";

//import dependencies
import { COLORS, SIZES } from "../../constants";

const CustomVideoPicker = ({ control, name, rules = {} }) => {
  const { height } = useWindowDimensions();

  const [hasGalleryPermission, setHasGalleryPermission] = useState("false");
  const [selectedVideoItem, setSelectedVideoItem] = useState(null);

  //video thumbnail
  const [videoThumbnail, setVideoThumbnail] = useState(null);

  useEffect(() => {
    async () => {
      const galleryStatus = await VideoPicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    };
  }, []);

  const pickVideo = async (onChange) => {
    let chosenVideo = await VideoPicker.launchImageLibraryAsync({
      mediaTypes: VideoPicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (chosenVideo.canceled) {
      return alert("You can always change your file later on.");
    }

    if (!chosenVideo.canceled) {
      setSelectedVideoItem(chosenVideo.uri);
      onChange(chosenVideo.uri)
      generateThumbnail(chosenVideo.uri)
    }
  };

  if (hasGalleryPermission === false) {
    return alert("Permission to access your gallery is required!");
  }

  const generateThumbnail = async (video) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(
        "https://player.vimeo.com/external/445636626.sd.mp4?s=55c18176076a373ff73cfec0968f075b6476b46a&profile_id=165&oauth2_token_id=57447761", // replace
        {
          time: 15000,
        }
      );

      setVideoThumbnail(uri);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <View
            style={[
              styles.container,
              { borderColor: error ? COLORS.purple : COLORS.gray },
            ]}
          >
            <TouchableOpacity
              style={styles.touchPicture}
              onPress={() => pickVideo(onChange)}
            >
              {videoThumbnail ? (
                <Image
                  onChange={onChange}
                  value={value}
                  source={{
                    uri: videoThumbnail,
                  }}
                  style={[
                    styles.VideoPicker,
                    styles.images,
                    { height: height * 0.73, borderWidth: 1 },
                  ]}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.VideoPicker}>
                  <View
                    style={[
                      styles.VideoPicker,
                      styles.images,
                      { height: height * 0.73 },
                    ]}
                  >
                    <Text style={styles.imageText}>Add your video</Text>
                    <Text style={styles.videoBlurbWarningItem}>
                      (max size 15mb)
                    </Text>
                    <Ionicons
                      name="add-sharp"
                      size={125}
                      color={COLORS.white}
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {error && (
            <Text
              style={{
                color: COLORS.purple,
                alignSelf: "stretch",
                fontSize: SIZES.body5,
                padding: SIZES.padding - 22,
                marginTop: 15,
                marginHorizontal: SIZES.padding * 3,
              }}
            >
              {error.message || "Oops, something went wrong!"}
            </Text>
          )}
        </>
      )}
    />
  );
};

export default CustomVideoPicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    marginHorizontal: 10,
  },
  touchPicture: {
    zIndex: 10,
  },
  VideoPicker: {
    width: Platform.OS === "android" ? 170 : 410,
  },
  images: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 8,
  },
  imageText: {
    fontSize: 16,
    color: COLORS.white,
    fontFamily: "PoppinsLight",
  },
  videoBlurbWarningItem: {
    marginVertical: 20,
    fontSize: 14,
    color: COLORS.darkGray,
    fontFamily: "PoppinsLight",
  },
});
