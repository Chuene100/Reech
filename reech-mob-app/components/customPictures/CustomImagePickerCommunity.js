import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { Controller } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";

//import dependencies
import { COLORS, icons } from "../../constants";

const CustomImagePickerCommunity = ({
  control,
  name,
  rules = {},
  mainText,
  warningText,
  communityImage,
}) => {
  const [hasGalleryPermission, setHasGalleryPermission] = useState("false");
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    async () => {
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    };
  }, []);

  const pickImage = async (onChange) => {
    let chosenImage = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      allowsMultipleSelection: false,
    });

    if (chosenImage.canceled) {
      return alert("You can always change your file later on.");
    }

    if (!chosenImage.canceled) {
      setProfilePicture(chosenImage.assets[0].uri);
      onChange(chosenImage.assets[0].uri);
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
              styles.container
            ]}
          >
            <TouchableOpacity
              style={styles.imageTouchFunctionContainer}
              onPress={() => pickImage(onChange)}
            >
              {profilePicture ? (
                <Image
                  onChange={onChange}
                  value={value}
                  source={{ uri: profilePicture }}
                  style={[communityImage ? styles.commImage : styles.imagePicker, { borderWidth: 0 }]}
                  resizeMode="cover"
                />
              ) : (
                <View style={[communityImage ? styles.commImage : styles.imagePicker, { borderColor: error ? COLORS.purple : COLORS.white }]}>
                  <Text style={styles.imageText}>{mainText}</Text>
                  <Text style={styles.limitItemText}>{warningText ? `(${warningText})` : null} </Text>
                  <Image source={icons.addIconPicture} style={styles.addIconItem} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    />
  );
};

export default CustomImagePickerCommunity;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  imageTouchFunctionContainer: {
    zIndex: 10,
  },
  imagePicker: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    borderRadius: 40,
    borderWidth: 1,
    width: "100%",
    height: "100%",
  },
  commImage: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderColor: COLORS.white,
    borderRadius: 0,
    borderWidth: 1,
    width: "100%",
    height: "100%",
  },
  addIconItem: {
    height: 80,
    width: 80,
  },
  imageText: {
    fontSize: 14,
    color: COLORS.white,
    fontFamily: "PoppinsBold",
  },
  limitItemText: {
    fontSize: 12,
    color: COLORS.white,
    fontFamily: "PoppinsLight",
    opacity: 0.4,
    marginBottom: 20,
  },
});
