import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { Controller } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";

//import dependencies
import { COLORS, icons } from "../../constants";
import { FlatList } from "react-native-gesture-handler";

const CustomImagePickerMainAllTypes = ({
  control,
  name,
  rules = {},
  mainText,
  warningText,
}) => {
  const [hasGalleryPermission, setHasGalleryPermission] = useState("false");
  const [beyondWorkImages, setBeyondWorkImages] = useState([]);

  useEffect(() => {
    (async () => {
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();
  }, []);

  const pickImage = async (onChange) => {
    let chosenImage = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 0.5,
      allowsMultipleSelection: true,
      selectionLimit: 6,
    });

    if (chosenImage.canceled) {
      return alert("You can always change your file later on.");
    }

    if (!chosenImage.canceled) {
      const newImages = chosenImage.assets.map((image) => image.uri);

      setBeyondWorkImages(newImages);
      onChange(newImages);
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
              {beyondWorkImages.length > 1 ? (
                <FlatList
                  data={beyondWorkImages}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={3}
                  renderItem={({ item }) => (
                    <View style={styles.thumbnailImageContainer}>
                      <Image
                        onChange={onChange}
                        value={value}
                        source={{ uri: item }}
                        style={styles.thumbnailImage}
                      />
                    </View>
                  )}
                  showsVerticalScrollIndicator={false}
                />
              ) : beyondWorkImages.length === 1 ? (
                <Image
                  onChange={onChange}
                  value={value}
                  source={{ uri: beyondWorkImages[0] }}
                  style={styles.singleImagePicked}
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
        </>
      )}
    />
  );
};

export default CustomImagePickerMainAllTypes;

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
  thumbnailImageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  thumbnailImage: {
    width: 130,
    height: 155,
    margin: 5,
    resizeMode: "cover",
    borderRadius: 8,
  },
  singleImagePicked: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 8,
  },
});
