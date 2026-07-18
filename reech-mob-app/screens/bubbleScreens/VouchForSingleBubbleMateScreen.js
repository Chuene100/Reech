import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import { useUploadSingleFileMutation } from "@/redux/api/api-slice";
import { usePostVouchMutation } from "@/redux/api/vouch";
import { useSelector } from "react-redux";

//import customs
import { COLORS } from "../../constants";
import {
  CustomAccountToggler,
  CustomDatePickerVouch,
  CustomImagePickerBubbleFullWidth,
  CustomLocationVouch,
  CustomInputDescriptionAddMain,
} from "../../components";
import NavHeader from "@/components/Headers/NavHeader";

const VouchForSingleBubbleMateScreen = ({ route }) => {
  const { control, handleSubmit } = useForm();
  const navigation = useNavigation();
  const { selectedMate, profileId } = route.params 

  const current_user = useSelector((state) => state.user.current_user);
  const current_profile = useSelector((state) => state.currentProfile.current_profile);

  const [postVouchFn, { isLoading }] = usePostVouchMutation();
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

  const vouchCreated = async (data) => {

    const loc = data.address.split("|");
    const payload = {
      ...data,
      userId: current_user?._id,
      profileId: current_profile?._id,
      address: loc[0],
      location: { type: "Point", coordinates: [loc[2], loc[1]] },
      vouchFor: {
        userId: selectedMate._id,
        profileId: profileId,
        userImage: selectedMate.profileImage,
        username: selectedMate.firstName + " " + selectedMate.lastName,
        blurb: selectedMate.blurb,
      },
    };
    const fileName = data.vouchImage.split("/").pop();
    const file = {
      name: "_vouch-" + fileName,
      uri: data.vouchImage,
      type: "image/jpg",
    };

    console.log("payload: ", payload);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await uploadFn(formData);
      const url = data.data;
      payload.vouchImage = url;
    } catch (error) {
      console.error(error);
      return;
    }

    postVouchFn(payload)
      .then((res) => {
        if (res.error) {
          showError(res);
          return;
        }
        showToast(res?.data?.message);
        navigation.goBack();
      })
      .catch((err) => {
        console.error(err);
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
          <Text style={styles.headingText}>Vouch for</Text>
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
        <CustomImagePickerBubbleFullWidth
          name="vouchImage"
          control={control}
          rules={{ required: "Please choose a experience image" }}
          mainText={"Add media"}
          warningText={"max size 5mb"}
        />
      </View>
    );
  }

  //form items section
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
              name="vouchDate"
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

            {/*description component*/}
            <View style={styles.formTextDescriptionContainer}>
              <Text style={styles.formTextDescription}>Description</Text>
            </View>
            <CustomInputDescriptionAddMain
              control={control}
              name="description"
              placeholder="Write a description..."
              multiline={true}
              rules={{
                required: "Please provide a description",
                maxLength: {
                  value: 2500,
                  message: "Description must be at least 2500 characters long",
                },
              }}
            />

            <View style={styles.spaceLiner} />
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
          onPress={handleSubmit(vouchCreated)}
          style={styles.submitItemContainer}
        >
          <View style={styles.submitGradientContainer}>
            <Text style={styles.submitTextItem}>
              {isLoading||isLoadingFile ? (
                <ActivityIndicator size={30} color={COLORS.white} />
              ) : (
                "Vouch"
              )}
            </Text>
          </View>
        </Pressable>
      </View>
    );
  }

  //screen list content
  function renderScreenContentList() {
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

  //render screen content section
  return <View style={styles.container}>{renderScreenContentList()}</View>;
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
    marginTop: Platform.OS === "ios" ? "9.5%" : "0%",
  },
  headerComponent: {
    zIndex: 1,
    flexDirection: "column",
  },
  headerContentContainer: {
    marginTop: 50,
    marginHorizontal: 15,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
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
    marginHorizontal: 5,
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
    height: "32%",
    marginBottom: 10,
  },

  //scrolling form section
  scrollingFormContainer: {
    maxHeight: Platform.OS === "ios" ? "34%" : "43%",
  },
  formItemContainer: {
    flexDirection: "column",
  },
  formDateContainer: {
    flexDirection: "column",
  },
  formTextDescriptionContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  formTextDescription: {
    marginBottom: -10,
    paddingHorizontal: 15,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  locationComponentContainer: {
    zIndex: 9,
  },
  spaceLiner: {
    width: "100%",
    borderColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth * 1,
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

export default VouchForSingleBubbleMateScreen;
