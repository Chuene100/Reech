import React from "react";
import { StyleSheet, View, Text, Pressable, Platform, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { LinearGradient } from "expo-linear-gradient";
import NavHeader from "@/components/Headers/NavHeader";
import { ImageBackground } from "react-native";

//import customs
import { COLORS } from "../../../constants";
import { useUploadSingleFileMutation } from "@/redux/api/api-slice"
import { usePostThoughtMutation } from "@/redux/api/thought";
import Toast from "react-native-toast-message";

const PreviewThoughtScreen = ({ route }) => {
  const navigation = useNavigation();

  const { handleSubmit } = useForm();

  const previousThoughtData = route.params.data;

  const [uploadFn, { isLoading: isUploadingImage }] = useUploadSingleFileMutation();
  const [createFn, { isLoading }] = usePostThoughtMutation();

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

  const submitButtonPressed = async (payload) => {
    payload = previousThoughtData;

    const file = {
      name: payload.fileLink.name,
      uri: payload.fileLink.uri,
      type: payload.fileLink.type,
    };
    payload.fileType = payload.fileLink.type;

    console.log("file: ", file)

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await uploadFn(formData);
      const url = data.data;
      payload.fileLink = url;
    } catch (error) {
      console.error(error);
      return;
    }

    createFn(payload)
      .then(async (res) => {
        if (res.error) {
          showError(res);
          return;
        }

        showToast(res?.data?.message)
        navigation.navigate("HowToChannelTogglerScreen", { idx: 1 })
      })
      .catch((err) => {
        console.error(err)
      });
  };

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <NavHeader
          message="What would you like to do?"
        />

        {/*header text item*/}
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitleItem}>Post your thought</Text>
        </View>
      </View>
    );
  }

  //image section
  function renderImageSection() {
    return (
      <View style={styles.imageContentContainer}>
        <ImageBackground
          style={styles.imageBackgroundItem}
          source={{ uri: previousThoughtData?.fileLink?.uri }}
          blurRadius={4}
        >
          {/*text section*/}
          <View style={styles.imageTextContainer}>
            <View style={styles.imageTextContent}>
              <Text numberOfLines={3} style={styles.imageTextDescription}>
                {previousThoughtData.description}
              </Text>
              <Text style={styles.imageText}>Read more...</Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }

  //next button section
  function renderNextButtonSection() {
    return (
      <View style={styles.buttonContentContainer}>
        <Pressable
          onPress={handleSubmit(submitButtonPressed)}
          style={styles.buttonContainer}
        >
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
            style={styles.buttonGradientContainer}
          >
            <Text style={styles.buttonTextItem}>
              {isLoading || isUploadingImage ?
                <ActivityIndicator size={30} color={COLORS.white} /> :
                "Post"}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeaderSection()}
      {renderImageSection()}
      {renderNextButtonSection()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //header section
  headerContainer: {
    zIndex: 99,
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },
  headerTitleContainer: {
    marginTop: 15,
    marginHorizontal: 20,
  },
  headerTitleItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //image content
  imageContentContainer: {
    marginTop: 80,
    flexDirection: "column",
  },
  imageBackgroundItem: {
    width: "100%",
    height: 300,
  },
  imageTextContainer: {
    zIndex: 1,
    top: "40%",
    justifyContent: "center",
    alignSelf: "center",
  },
  imageTextContent: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 25,
  },
  imageTextDescription: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
    textAlign: "center",
  },
  imageText: {
    color: COLORS.darkGray,
    fontSize: 16,
    fontFamily: "PoppinsLight",
    textAlign: "center",
  },

  buttonContentContainer: {
    top: Platform.OS === "ios" ? "35%" : "28%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  buttonContainer: {
    width: "50%",
  },
  buttonGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    height: 45,
    width: "100%",
  },
  buttonTextItem: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "PoppinsBold",
  },
});

export default PreviewThoughtScreen;
