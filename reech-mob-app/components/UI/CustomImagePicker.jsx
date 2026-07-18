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
import ErrorMessage from "./ErrorMessage";

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
            className={`flex justify-center items-center`}
          >
            <TouchableOpacity
              className={`z-10 mb-[-50] ml-[100]`}
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
                className={`w-[${Platform.OS == 'android' ? 135 : 164}] max-h-[160] mt-[${SIZES.padding}] rounded-[100] h-[${height*0.19}]`}
                resizeMode="cover"
              />
            ) : (
              <Image
                onChange={onChange}
                value={value}
                source={images.defaultRounded}
                className={`w-[${Platform.OS == 'android' ? 135 : 164}] max-h-[160] mt-[${SIZES.padding}] rounded-[100] h-[${height*0.19}]`}
                resizeMode="cover"
              />
            )}

            <View className='absolute'>
              {(isLoading || isLoadingFile) && (
                <ActivityIndicator size={"large"} color="white" />
              )}
            </View>
          </View>
            {error && (
              <ErrorMessage error={error} />
            )}
        </>
      )}
    />
  );
};

export default CustomImagePicker;
