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
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

//import dependencies
import { COLORS, SIZES, images } from "../../constants";

const CustomImageOppPicker = ({ control, name, rules = {} }) => {
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
    const chosenImage = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (chosenImage.canceled) {
      return alert(
        "You can alternatively use our library by clicking on 'use reech library'"
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
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
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
                  <MaterialCommunityIcons
                    name={"image-edit-outline"}
                    size={18}
                    color={COLORS.white}
                  />
                ) : (
                  <MaterialIcons
                    name={"image-search"}
                    size={18}
                    color={COLORS.white}
                  />
                )}

                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: 14,
                    fontFamily: "PoppinsLight",
                    marginLeft: 12,
                  }}
                >
                  {profilePicture ? "Change image" : "Select image"}
                </Text>
              </TouchableOpacity>
            </View >
          </>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  touchPicture: {
    zIndex: 10,
    width: "90%",
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 25,
    backgroundColor: COLORS.purpleDark,
  },
  logo: {
    width: Platform.OS == "android" ? 146 : 164,
    maxHeight: 160,
  },
  profileImage: {
    marginTop: SIZES.padding * 2,
    borderRadius: 100,
  },
});

export default CustomImageOppPicker;
