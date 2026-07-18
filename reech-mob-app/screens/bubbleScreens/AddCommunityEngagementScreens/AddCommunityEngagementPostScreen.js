import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Platform,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import NavHeader from "@/components/Headers/NavHeader";
import { useSelector } from "react-redux";

//import customs
import { COLORS } from "../../../constants";
import { CustomAccountToggler, CustomDatePickerVouch, CustomImagePickerCommunity, CustomInputDescriptionAddMain, CustomLocationVouch } from "../../../components";
import { useUploadSingleFileMutation } from "../../../redux/api/api-slice";
import { useCreateCommunityPostMutation } from "@/redux/api/community-post";

const AddCommunityEngagementPostScreen = ({ route }) => {
  const { control, handleSubmit } = useForm();
  const navigation = useNavigation();

  const { communityId } = route.params
  const current_user = useSelector((state) => state.user.current_user);
  const current_profile = useSelector((state) => state.currentProfile.current_profile);

  const [uploadFn, { isLoading: isLoadingFile }] = useUploadSingleFileMutation();
  const [createPostFn, { isLoading }] = useCreateCommunityPostMutation();

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

  const experienceCreated = async (data) => {
    const loc = data.address.split("|");
    const payload = {
      userId: current_user?._id,
      profileId: current_profile?._id,
      communityId: communityId,
      description: data?.communityDescription,
      postImage: data?.communityImage,
      communityDate: data?.communityDate,
      notifyBubble: data?.notifyBubble,
      address: loc[0],
      location: { type: "Point", coordinates: [loc[2], loc[1]] },
    }

    const fileName = payload.postImage.split("/").pop();
    const file = {
      name: "_community-post-" + fileName,
      uri: payload.postImage,
      type: "image/jpg",
    };

    const formData = new FormData();
    formData.append("file", file);
    try {
      const { data } = await uploadFn(formData);
      const url = data.data;
      payload.postImage = url;
    } catch (error) {
      console.error(error);
      return;
    }

    createPostFn(payload)
      .then(async (res) => {
        if (res.error) {
          showError(res);
          return;
        }
        showToast(res?.data?.message)
        navigation.goBack();
      })
      .catch((err) => {
        var error = err.response.data ? err.response.data.error
          : "Network error, please try again later";
        console.log(error)
      });
  };

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        {/*screen header component*/}
        <View style={styles.headerComponent}>
          <NavHeader message="What would you like to do?" />
        </View>

        {/*screen header text*/}
        <View style={styles.headerContentContainer}>
          <Text style={styles.headingText}>Community engagement</Text>
        </View>
      </View>
    );
  }

  //notify bubble function
  function renderNotifyBubbleSection() {
    return (
      <View style={styles.notifyActionContainer}>
        <View style={styles.notifyActionContent}>
          <Text style={styles.notifyTextItem}>Notify bubble</Text>

          <View style={styles.notifyComponentContainer}>
            <CustomAccountToggler name="notifyBubble" control={control} />
          </View>
        </View>
      </View>
    );
  }

  //image picker section
  function renderImagePickerSection() {
    return (
      <View style={styles.imagePickerComponentContainer}>
        <CustomImagePickerCommunity
          name="communityImage"
          control={control}
          communityImage={true}
          rules={{ required: "Please choose an image for this community post." }}
          mainText={"Add media"}
        />
      </View>
    );
  }

  function renderFormItemSection() {
    return (
      <ScrollView
        keyboardShouldPersistTaps="always"
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        style={styles.scrollingFormContainer}
      >
        <View style={styles.formItemContainer}>
          {/*date picker component*/}
          <View style={styles.formDateContainer}>
            <CustomDatePickerVouch
              control={control}
              name="communityDate"
              rules={{ required: "Please pick a date" }}
            />

            <View style={styles.spaceLiner} />

            <View style={styles.locationComponentContainer}>
              <CustomLocationVouch
                control={control}
                name="address"
                placeholder="Location"
                rules={{ required: "Please choose a location" }}
              />
              <View style={styles.spaceLiner} />
            </View>

            {/*description area*/}
            <View style={styles.formDescriptionContainer}>
              <Text style={styles.formDescriptionTextItem}>Description</Text>
              <CustomInputDescriptionAddMain
                control={control}
                name="communityDescription"
                placeholder="Write a description..."
                multiline={true}
                rules={{
                  required: "Please provide a description",
                  maxLength: {
                    value: 2500,
                    message:
                      "Description must be at least 2500 characters long",
                  },
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  //submit action
  function renderSubmitButtonSection() {
    return (
      <View style={styles.submitButtonContainer}>
        <Pressable
          onPress={handleSubmit(experienceCreated)}
          style={styles.submitItemContainer}
        >
          <View style={styles.submitGradientContainer}>
            <Text style={styles.submitTextItem}>
              {isLoading || isLoadingFile ? (
                <ActivityIndicator size={30} color={COLORS.white} />
              ) : (
                "Create"
              )}
            </Text>
          </View>
        </Pressable>
      </View>
    );
  }

  //screen content list
  function screenContentList() {
    return (
      <>
        {renderHeaderSection()}
        {renderNotifyBubbleSection()}
        {renderImagePickerSection()}
        {renderFormItemSection()}
        {renderSubmitButtonSection()}
      </>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "height" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {screenContentList()}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //header section
  headerContainer: {
    height: Platform.OS === "ios" ? "8%" : "10%",
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },
  headerComponent: {
    zIndex: 99,
    flexDirection: "column",
  },
  headerContentContainer: {
    marginTop: 15,
    marginHorizontal: 15,
    flexDirection: "column",
  },
  headingText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //notify action
  notifyActionContainer: {
    height: "5%",
    justifyContent: "center",
  },
  notifyActionContent: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  notifyTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  notifyComponentContainer: {
    width: "50%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },

  //image picker
  imagePickerComponentContainer: {
    height: "30%",
    marginBottom: 10,
  },

  //form section
  scrollingFormContainer: {
    maxHeight: Platform.OS === "ios" ? "41%" : "48%",
  },
  formItemContainer: {
    marginBottom: "12%",
    flexDirection: "column",
  },
  formDateContainer: {
    flexDirection: "column",
  },
  spaceLiner: {
    marginVertical: 0,
    width: "100%",
    borderColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth * 1,
  },
  locationComponentContainer: {
    zIndex: 9,
  },
  formDescriptionContainer: {
    marginTop: 10,
    height: "30%",
  },
  formDescriptionTextItem: {
    height: 20,
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    marginHorizontal: 15,
    marginBottom: 0,
  },

  //button section
  submitButtonContainer: {
    height: Platform.OS === "ios" ? "6%" : "7%",
    justifyContent: "center",
    marginTop: 10,
  },
  submitItemContainer: {
    zIndex: 10,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  submitGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    borderColor: COLORS.purple,
    borderWidth: 2,
    height: 40,
    width: "35%",
    overflow: "hidden",
  },
  submitTextItem: {
    color: COLORS.purple,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
});

export default AddCommunityEngagementPostScreen;
