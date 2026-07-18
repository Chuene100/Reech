import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { Controller } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";

//import dependencies
import { COLORS, icons } from "../../constants";

const CustomImagePickerMain = ({
  control,
  name,
  rules = {},
  mainText,
  warningText,
}) => {
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
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.8,
      allowsMultipleSelection: true,
    });

    if (chosenImage.canceled) {
      return alert("You can always change your file later on.");
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
                  style={[styles.imagePicker, { borderWidth: 0 }]}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.imagePicker}>
                  <Text style={styles.imageText}>{mainText}</Text>
                  <Text style={styles.limitItemText}>
                    {warningText ? `(${warningText})` : null}
                  </Text>
                  <Image
                    source={icons.addIconPicture}
                    style={styles.addIconItem}
                  />
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

export default CustomImagePickerMain;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  touchPicture: {
    zIndex: 10,
  },
  imagePicker: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    width: "100%",
    height: "100%",
  },
  addIconItem: {
    height: 80,
    width: 80,
  },
  imageText: {
    fontSize: 16,
    color: COLORS.white,
    fontFamily: "PoppinsBold",
  },
  limitItemText: {
    fontSize: 14,
    color: COLORS.white,
    fontFamily: "PoppinsLight",
    opacity: 0.4,
    marginBottom: 20,
  },
  errorMessageItem: {
    color: COLORS.purple,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    alignSelf: "center",
    bottom: "20%",
  },
});
