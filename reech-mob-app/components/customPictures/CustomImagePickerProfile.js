import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Controller } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

//import dependencies
import { COLORS, SIZES, images } from "../../constants";
import {
  useUpdateUserMutation,
  useUploadSingleFileMutation,
} from "../../redux/api/api-slice";
import { useSelector } from "react-redux";

const CustomImagePickerProfile = ({ control, name, rules = {}, user }) => {
  const { height } = useWindowDimensions();

  const [hasGalleryPermission, setHasGalleryPermission] = useState("false");
  const [profilePicture, setProfilePicture] = useState(null);

  const image = useSelector((state) => state.profile_images.profileImages);

  const [updateUserFn, { isLoading }] = useUpdateUserMutation();
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
        "You can always change your profile picture at a later stage. You can continue to use this profile picture."
      );
    }

    if (!chosenImage.canceled) {
      updateUser(chosenImage.uri);
    }
  };

  const updateUser = async (imgUri) => {
    setProfilePicture(imgUri);

    const body = { profileImage: "" };
    const userId = user?._id;

    const fileName = imgUri.split("/").pop();
    const file = {
      name: "_profile-" + fileName,
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

    updateUserFn({ body, userId })
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
              <Ionicons
                name="camera"
                size={Platform.OS === "ios" ? 30 : 25}
                color={COLORS.white}
              />
            </TouchableOpacity>

            {profilePicture ? (
              <Image
                onChange={onChange}
                value={value}
                source={{
                  uri: profilePicture,
                }}
                style={styles.logo}
                resizeMode="cover"
              />
            ) : (
              <Image
                onChange={onChange}
                value={value}
                source={
                  user?.profileImage
                    ? { uri: image[user?.profileImage] ?? user?.profileImage }
                    : images.defaultRounded
                }
                style={styles.logo}
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

export default CustomImagePickerProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  touchPicture: {
    zIndex: 10,
    top: 50,
    marginLeft: Platform.OS === "ios" ? 120 : 110,
  },
  loading: {
    top: 60,
    position: "absolute",
  },
  logo: {
    marginBottom: 230,
    width: Platform.OS === "ios" ? 120 : 110,
    height: Platform.OS === "ios" ? 120 : 110,
    resizeMode: "cover",
    borderRadius: 15,
    borderColor: COLORS.black,
    borderWidth: 3,
  },
});
