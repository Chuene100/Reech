import React, { useEffect, useState } from "react";
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

//import customs
import { COLORS } from "../../constants";
import {
  CustomAccountToggler,
  CustomLocationVouch,
  CustomDatePickerVouch,
  CustomImagePickerMain,
  CustomInputDescriptionAddMain,
} from "../../components";
import { usePostBubbleMutation } from "../../redux/api/bubble";
import { useUploadSingleFileMutation } from "../../redux/api/api-slice";
import { useListMyProfilesQuery } from "../../redux/api/api-slice";
import { useSelector } from "react-redux";
import NavHeader from "@/components/Headers/NavHeader";
import DropDown from "@/components/UI/DropDown";
import { experience } from "@/assets/data/dropDownData";

const AddExperienceScreen = () => {
  const {
    control,
    handleSubmit,
  } = useForm();

  const navigation = useNavigation();
  const [myProfiles, setMyProfiles] = useState([]);

  const user = useSelector((state) => state.user.current_user);
  const current_profile = useSelector(
    (state) => state.currentProfile.current_profile
  );
  const cache_profiles = useSelector((state) => state.profiles.user_profiles);

  const {data: fetched_profiles} = useListMyProfilesQuery(user?._id ?? null);
  const [uploadFn, { isLoading: isLoadingFile }] = useUploadSingleFileMutation();
  const [postBubbleFn, { isLoading }] = usePostBubbleMutation();

  useEffect(() => {
    setMyProfiles(cache_profiles.data ?? fetched_profiles.data);
  }, [cache_profiles, fetched_profiles]);

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
    const profile_details = data.profileSelected.split("|");

    const payload = {
      cardType: data.cardType,
      experienceDate: data.experienceDate,
      experiencedDescription: data.experiencedDescription,
      experienceImage: data.vouchImage,
      address: loc[0],
      location: { type: "Point", coordinates: [loc[2], loc[1]] },
      notifyBubble: data.notifyBubble,

      //User and profile
      profileId: profile_details[1],
      username: user?.firstName + " " + user?.lastName,
      userProPic: current_profile.profileImage,
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
          <Text style={styles.headingText}>Work experience</Text>
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
        <CustomImagePickerMain
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
              name="experienceDate"
              rules={{ required: "Please pick a date" }}
            />

            <View style={styles.spaceLiner} />

            {/*description component*/}
            <View style={styles.formTextDescriptionContainer}>
              <Text style={styles.formTextDescription}>Description</Text>
            </View>
            <CustomInputDescriptionAddMain
              control={control}
              name="experiencedDescription"
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

            {/*select profile component*/}
            <DropDown
              name="userTitle"
              control={control}
              data={myProfiles.map(
                (profile) => `${profile?.jobTitleId?.jobTitle}|${profile?._id}`
              )}
              rules={{ required: "Please select a profile" }}
              placeholder={"Select a profile"}
              minimal={true}
            />

            {/*experience type component*/}
            <DropDown
              control={control}
              data={experience}
              rowText={'name'}
              name="experience"
              rules={{ required: " Please choose your years of experience" }}
              minimal={true}
            />

            <View style={styles.locationComponentContainer}>
              <CustomLocationVouch
                control={control}
                name="address"
                placeholder="Search for a location"
                rules={{ required: "Please choose a location" }}
              />
              <View style={styles.spaceLiner} />
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
                "Add"
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

  return <View style={styles.container}>{screenContentList()}</View>;
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
    marginTop: Platform.OS === "ios" ? 15 : 10,
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
    marginBottom: "65%",
    zIndex: 9,
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

export default AddExperienceScreen;
