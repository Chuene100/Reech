import React from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Platform,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

//import customs
import { COLORS } from "../../constants";
import {
  CustomAccountToggler,
  CustomLocationVouch,
  CustomDatePickerVouch,
  CustomInputDescriptionAddMain,
  CustomImagePickerMainAllTypes,
} from "../../components";
import { usePostBubbleMutation } from "../../redux/api/bubble";
import { useUploadSingleFileMutation } from "../../redux/api/api-slice";
import NavHeader from "@/components/Headers/NavHeader";

const AddBeyondWorkScreen = () => {
  const { control, handleSubmit } = useForm();

  const navigation = useNavigation();

  const user = useSelector((state) => state.user.current_user);
  const current_profile = useSelector((state) => state.currentProfile.current_profile);

  const [uploadFn, { isLoading: isLoadingFile }] = useUploadSingleFileMutation();
  const [postBubbleFn, { isLoading }] = usePostBubbleMutation();

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
    const loc = data.beyondWorkLocation.split("|");

    const payload = {
      cardType: "Beyond work",
      experienceDate: data.beyondWorkDate,
      experiencedDescription: data.beyondWorkDescription,
      experienceImage: data.vouchImage,
      address: loc[0],
      location: { type: "Point", coordinates: [loc[2], loc[1]] },
      notifyBubble: data.notifyBubble,

      //User and profile
      profileId: current_profile?._id,
      userId: user?._id,
    };

    const fileName = data.vouchImage.split("/").pop();
    const file = {
      name: "_bubble-" + fileName,
      uri: data.vouchImage,
      type: "image/jpg",
    };

    const formData = new FormData();
    formData.append("file", file);
    try {
      const { data } = await uploadFn(formData);
      const url = data.data;
      payload.experienceImage = url;
    } catch (error) {
      console.error(error);
      return;
    }

    postBubbleFn(payload)
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
          <Text style={styles.headingText}>Beyond work</Text>
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
        <CustomImagePickerMainAllTypes
          name="vouchImage"
          control={control}
          rules={{ required: "Please choose experience Image." }}
          mainText={"Add multiple images or videos"}
          warningText={"max of 6 items and max of size 5mb"}
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
              name="beyondWorkDate"
              rules={{ required: "Please pick a date" }}
            />

            <View style={styles.spaceLiner} />

            <View style={styles.locationComponentContainer}>
              <CustomLocationVouch
                control={control}
                name="beyondWorkLocation"
                placeholder="Search for a location"
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
              name="beyondWorkDescription"
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
          onPress={handleSubmit(experienceCreated)}
          style={styles.submitItemContainer}
        >
          <View style={styles.submitGradientContainer}>
            <Text style={styles.submitTextItem}>
              {isLoading || isLoadingFile ? (
                <ActivityIndicator size={30} color={COLORS.white} />
              ) : (
                "Add"
              )}
            </Text>
          </View>
        </Pressable>
      </View>
    );
  }

  //render screen content list
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
    height: "35%",
    marginBottom: 10,
  },

  //scrolling form section
  scrollingFormContainer: {
    maxHeight: Platform.OS === "ios" ? "36%" : "43%",
  },
  formItemContainer: {
    flexDirection: "column",
  },
  formDateContainer: {
    flexDirection: "column",
  },
  locationComponentContainer: {
    // marginBottom: "65%",
    zIndex: 9,
  },
  formTextDescriptionContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  formTextDescription: {
    marginBottom: -10,
    paddingHorizontal: 15,
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  spaceLiner: {
    marginVertical: 0,
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

export default AddBeyondWorkScreen;
