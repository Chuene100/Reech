import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Controller } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

//import dependencies
import { COLORS, SIZES, images } from "../../constants";
import { useUpdateSeekerMutation } from "../../redux/api/profile";
import { useUploadSingleFileMutation } from "../../redux/api/api-slice";
import { useSelector } from "react-redux";

const CustomImagePicker = ({ control, name, rules = {}, profile }) => {
  const { height } = useWindowDimensions();
  const navigation = useNavigation();

  const [hasGalleryPermission, setHasGalleryPermission] = useState("false");
  const [profilePicture, setProfilePicture] = useState(null);

  const image = useSelector((state) => state.profile_images.profileImages);

  const [updateSeekerFn, { isLoading }] = useUpdateSeekerMutation();
  const [uploadFn, { isLoading: isLoadingFile }] =
    useUploadSingleFileMutation();

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

  useEffect(() => {
    async () => {
      setProfilePicture(profile.profileImage);
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    };
  }, []);

  const pickImage = async () => {
    let chosenImage = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (chosenImage.canceled) {
      return alert(
        "You can always change your profile picture at a later stage. You can continue to use this profile picture 😊."
      );
    }

    if (!chosenImage.canceled) {
      updateProfile(chosenImage.uri);
    }
  };

  const updateProfile = async (imgUri) => {
    setProfilePicture(imgUri);

    const body = { profileImage: "" };
    const profileId = profile._id;

    const fileName = imgUri.split("/").pop();
    const file = {
      name: "_seeker-" + fileName,
      uri: imgUri,
      type: "image/jpg",
    };

    const formData = new FormData();
    formData.append("file", file);
    try {
      const { data } = await uploadFn(formData);
      const url = data.data;
      body.profileImage = url;
    } catch (error) {
      console.error(error);
      return;
    }

    updateSeekerFn({ body, profileId })
      .then((res) => {
        if (res.error) {
          showError(res);
          return;
        }
        showToast(res.data?.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (hasGalleryPermission === false) {
    return alert("Permission to access your gallery is required!");
  }

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
              onPress={() => pickImage()}
            >
              <Ionicons name="pencil-outline" size={22} color={COLORS.white} />
            </TouchableOpacity>

            {profilePicture || profile.profileImage ? (
              <Image
                onChange={onChange}
                value={value}
                source={{
                  uri:
                    profilePicture ??
                    image[profile.profileImage] ??
                    profile.profileImage,
                }}
                style={[
                  styles.logo,
                  styles.profileImage,
                  { height: height * 0.19 },
                ]}
                resizeMode="cover"
              />
            ) : (
              <Image
                onChange={onChange}
                value={value}
                source={images.defaultRounded}
                style={[
                  styles.logo,
                  styles.profileImage,
                  { height: height * 0.19 },
                ]}
                resizeMode="cover"
              />
            )}

            <View style={styles.loading}>
              {(isLoading || isLoadingFile) && (
                <ActivityIndicator size={"large"} color="white" />
              )}
            </View>
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

export default CustomImagePicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  touchPicture: {
    zIndex: 10,
    marginBottom: -50,
    marginLeft: 100,
  },
  logo: {
    width: Platform.OS == "android" ? 135 : 164,
    maxHeight: 160,
  },
  profileImage: {
    marginTop: SIZES.padding * 2,
    borderRadius: 100,
  },
  loading: {
    position: "absolute",
  },
});
