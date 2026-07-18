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
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

//import dependencies
import { COLORS, SIZES, icons } from "../../constants";

const CustomImagePickerBubble = ({ control, name, rules = {} }) => {
  const { height } = useWindowDimensions();

  const [hasGalleryPermission, setHasGalleryPermission] = useState("false");
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    async () => {
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    };
  }, []);

  const pickImage = async (onChange) => {
    let chosenImage = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    console.log(JSON.stringify(chosenImage.uri));

    if (chosenImage.canceled) {
      return alert(
        "You can always change your profile picture at a later stage. You can continue to use this profile picture."
      );
    }

    if (!chosenImage.canceled) {
      setProfilePicture(chosenImage.uri);
      onChange(chosenImage.uri);
    }
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
              onPress={() => pickImage(onChange)}
            >
              {profilePicture ? (
                <Image
                  onChange={onChange}
                  value={value}
                  source={{
                    uri: profilePicture,
                  }}
                  style={[
                    styles.imagePickerChosen,
                    styles.images,
                    { height: height * 0.26, borderWidth: 0 },
                  ]}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.imagePicker}>
                  <View
                    style={[
                      styles.imagePicker,
                      styles.images,
                      { height: height * 0.26 },
                    ]}
                  >
                    <Text style={styles.imageText}>Add media</Text>
                    <Text style={styles.imageSubText}>(max size 5mb)</Text>
                    <Image
                      source={icons.addIconPicture}
                      style={styles.addIconItem}
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {error && (
            <Text style={styles.errorMessageItem}>
              {error.message || "Oops, something went wrong!"}
            </Text>
          )}
        </>
      )}
    />
  );
};

export default CustomImagePickerBubble;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: "8%",
  },
  touchPicture: {
    zIndex: 10,
  },
  imagePickerChosen: {
    right: 29,
    width: 420,
  },
  imagePicker: {
    right: 15,
    width: 420,
  },
  images: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 1,
  },
  imageText: {
    fontSize: 16,
    color: COLORS.white,
    fontFamily: "PoppinsLight",
    marginBottom: 2,
  },
  imageSubText: {
    fontSize: 16,
    color: COLORS.reechGray,
    fontFamily: "PoppinsLight",
  },
  addIconItem: {
    top: 10,
    height: 80,
    width: 80,
  },
  errorMessageItem: {
    color: COLORS.purple,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    alignSelf: "center",
    bottom: "20%",
  },
});
