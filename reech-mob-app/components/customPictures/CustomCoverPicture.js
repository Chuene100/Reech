import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
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

const CustomCoverPicture = ({ control, name, rules = {}, user }) => {
  const { height } = useWindowDimensions();

  const [hasGalleryPermission, setHasGalleryPermission] = useState("false");
  const [profilePicture, setProfilePicture] = useState(null);

  const image = useSelector((state) => state.profile_images.profileImages);

  const [updateUserFn, { isLoading }] = useUpdateUserMutation();
  const [uploadFn, { isLoading: isLoadingFile }] = useUploadSingleFileMutation();

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
        "You can always change your cover photo at a later stage. You can continue to use this cover photo."
      );
    }

    if (!chosenImage.canceled) {
      updateUser(chosenImage.uri);
    }
  };

  const updateUser = async (imgUri) => {
    setProfilePicture(imgUri);

    const body = { coverImage: "" };
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
      body.coverImage = url;
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
          <View>
            {profilePicture ? (
              <Image
                onChange={onChange}
                value={value}
                source={{
                  uri: profilePicture,
                }}
                style={styles.imageCover}
                resizeMode="cover"
              />
            ) : (
              <Image
                onChange={onChange}
                value={value}
                source={
                  user?.coverImage
                    ? { uri: image[user?.coverImage] ?? user?.coverImage }
                    : images.bg5
                }
                style={styles.imageCover}
                resizeMode="cover"
              />
            )}
            <View style={styles.nameSection}>
              {isLoading || isLoadingFile ? (
                <ActivityIndicator size={"small"} color="white" />
              ) : (
                <Text style={styles.userName}>
                  {/* {user?.firstName} {user?.lastName} */}
                </Text>
              )}
            </View>
            <View style={styles.coverCamera}>
              <Ionicons
                name="camera"
                size={Platform.OS === "ios" ? 28 : 22}
                color={COLORS.white}
                style={{ marginLeft: "-100%" }}
                onPress={() => pickImage()}
              />
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

export default CustomCoverPicture;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  touchPicture: {
    zIndex: 10,
    marginBottom: -80,
    marginLeft: 140,
  },
  logo: {
    width: Platform.OS == "android" ? 146 : 164,
    maxWidth: 160,
    maxHeight: 160,
  },
  profileImage: {
    marginTop: SIZES.padding * 2,
    borderRadius: 100,
  },

  imageCover: {
    width: "100%",
    height: 260,
    borderRadius: 0,
  },
  nameSection: {
    alignItems: "center",
    marginTop: -160,
  },
  userName: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 20,
  },
  coverCamera: {
    marginLeft: "95%",
    marginTop: 98,
  },
});
