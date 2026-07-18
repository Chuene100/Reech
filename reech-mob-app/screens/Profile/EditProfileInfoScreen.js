import React, { useState } from "react";
import { Alert, StyleSheet, ScrollView, View, Text, Platform, Pressable, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";

//import customs
import { COLORS } from "../../constants";
import { CustomAccountToggler, CustomImagePicker, CustomInput, CustomLocation } from "../../components";
import { useUpdateSeekerMutation } from "../../redux/api/profile";
import { useDeleteSeekerMutation } from "../../redux/api/profile";
import NavHeader from "@/components/Headers/NavHeader";
import DropDown from "@/components/UI/DropDown";
import { availability, experience, qualification } from "@/assets/data/dropDownData";

//edit profile information
const EditProfileInfoScreen = ({ route }) => {
  const navigation = useNavigation();

  const { control, handleSubmit } = useForm();

  const [selectedCategory, setCategory] = useState({});

  const profile = route.params.profile;
  const user = useSelector((state) => state.user.current_user);
  const job_category_list = useSelector((state) => state.job_title.job_titles);

  const [updateProfileFn, { isLoading }] = useUpdateSeekerMutation();
  const [removeSeekerFn, { isLoading: isLoadingRemove }] =
    useDeleteSeekerMutation();

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

  const onEditProfileInfoPress = (data) => {
    var body = data;
    if (body.address) {
      const loc = body.address.split("|");
      body = {
        ...body,
        address: loc[0],
        location: {
          type: "Point",
          coordinates: [Number(loc[2]), Number(loc[1])],
        },
        jobCategoryId: data?.jobCategoryId?._id,
        jobTitleId: data?.jobTitleId?._id,
      };
    }
    if (body.address === "") body.address = undefined;
    if (body?.experience) body.experience = body.experience?.value;

    const profileId = profile._id;

    updateProfileFn({ body, profileId })
      .then((res) => {
        if (res.error) {
          showError(res);
          return;
        }
        showToast(res.data?.message);
        // navigation.goBack();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const DeleteSeeker = () => {
    const profileId = profile._id;
    removeSeekerFn({ profileId })
      .then((res) => {
        if (res.error) {
          showError(res);
          return;
        }
        showToast(res.data?.message);
        navigation.navigate("WelcomeScreen");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onRemoveProfilePress = () => {
    Alert.alert(
      "Are you sure?",
      "\n" + `${user?.firstName}` + "\n\n" + '"Let us talk about this..."',
      [
        {
          text: "✅ I am sure",
          onPress: () => {
            DeleteSeeker();
          },
        },
        {
          text: "🗣 How to improve your app",
          onPress: () => navigation.navigate("SupportChatScreen"),
        },
        {
          text: "🙅 Go back",
          onPress: () => console.log("Cancel process..."),
          style: "Cancel",
        },
      ]
    );
  };

  //header component
  function renderHeaderComponent() {
    return (
      <View style={styles.headerComponentContainer}>
        <NavHeader message="What would you like to do?" />
      </View>
    );
  }

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.content}>
        <Text style={styles.headingText}>Edit profile info</Text>
      </View>
    );
  }

  //profile data set section
  function renderFormSection() {
    return (
      <View style={styles.formContainer}>
        {/*profile picker section*/}
        <View style={styles.formImageContainer}>
          <CustomImagePicker name="profileImage" control={control} profile={profile} />
        </View>

        {/*form scrolling section*/}
        <ScrollView
          style={styles.formFieldsContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"

          nestedScrollEnabled={true}
        >
          {/*form visibility*/}
          <View style={styles.formTogglerItems}>
            <Text style={styles.formTogglerText}>Profile visibility:</Text>
            <View style={styles.formTogglerItem}>
              <CustomAccountToggler name="accountVisibility" control={control} invalue={profile.accountVisibility} />
            </View>
          </View>
          <View style={styles.formLiner} />

          {/*form category*/}
          <DropDown
            name="jobCategoryId"
            data={job_category_list}
            invalue={profile?.jobTitleId?.jobCategory}
            control={control}
            placeholder="Job category"
            notifyChange={({ value }) => { setCategory(value); }}
            rowText={`jobCategory`}
            minimal={true}
          />

          {/*form job title*/}
          <DropDown
            name="jobTitleId"
            data={selectedCategory.jobTitle}
            invalue={profile?.jobTitleId?.jobTitle}
            control={control}
            placeholder="Job title"
            type="title"
            rowText={`jobTitle`}
            minimal={true}
          />

          {/*form job type needed*/}
          <DropDown
            name="commitmentLevel"
            placeholder={'Availability'}
            data={availability}
            invalue={profile.commitmentLevel}
            control={control}
            minimal={true}
          />

          {/*form earnings*/}
          <CustomInput
            name="earning"
            invalue={profile.earning.toString()}
            keyboardType="number-pad"
            control={control}
            rules={{
              pattern: { value: /^[0-9\b]+$/, message: "Your entry cannot contain strings or special characters" },
            }}
            placeholder="How much are you earning per month?"
          />

          {/*form rate*/}
          <CustomInput
            name="rate"
            keyboardType="number-pad"
            invalue={profile.rate.toString()}
            control={control}
            rules={{
              pattern: { value: /^[0-9\b]+$/, message: "Your entry cannot contain strings or special characters" },
            }}
            placeholder="What are your salary expectations per month?"
          />

          {/*form experience level*/}
          <DropDown
            data={experience}
            name="experience"
            placeholder={'Experience'}
            invalue={profile.experience}
            control={control}
            rowText={'name'}
            minimal={true}
          />

          {/*form education level*/}
          <View style={{ zIndex: 10 }}>
            <DropDown
              data={qualification}
              control={control}
              invalue={profile.education}
              name="education"
              placeholder={'Education'}
              minimal={true}
            />
          </View>

          {/*form user profile location*/}
          <View style={[styles.formLocationContainer, { zIndex: 9 }]}>
            <CustomLocation name="address" control={control} invalue={profile.address} placeholder="Street, State, Country" />
          </View>
        </ScrollView>

        {/*submit button section*/}
        <View style={styles.buttonContainer}>
          {/*disable profile*/}
          <View style={styles.buttonIconContent}>
            <Pressable
              onPress={() => onRemoveProfilePress()}
              style={styles.actionButtonContainer}
            >
              <LinearGradient
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
                style={styles.actionButtonGradientContainer}
              >
                <Text style={styles.actionButtonTextItem}>
                  {isLoadingRemove ? (
                    <ActivityIndicator size={"small"} color="white" />
                  ) : (
                    "Disable profile"
                  )}
                </Text>
              </LinearGradient>
            </Pressable>
          </View>

          {/*update profile*/}
          <View style={styles.buttonIconContent}>
            <Pressable
              onPress={handleSubmit(onEditProfileInfoPress)}
              style={styles.actionButtonContainer}
            >
              <LinearGradient
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
                style={styles.actionButtonGradientContainer}
              >
                <Text style={styles.actionButtonTextItem}>
                  {isLoading ? (
                    <ActivityIndicator size={"small"} color="white" />
                  ) : (
                    "Update profile"
                  )}
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeaderComponent()}
      {renderHeaderSection()}
      {renderFormSection()}
    </View>
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
  headerComponentContainer: {
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },

  //header navigation section
  content: {
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
  },
  headingText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //form screen section
  formContainer: {
    flex: 1,
  },
  formImageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "5%",
  },
  formImageItem: {
    width: 120,
    height: 120,
    maxHeight: 120,
    maxWidth: 120,
    borderRadius: 200,
  },
  formFieldsContainer: {
    marginTop: Platform.OS === "ios" ? "3%" : "4%",
    marginHorizontal: "6%",
  },
  formLiner: {
    marginTop: Platform.OS === "ios" ? "3%" : "0%",
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth * 2.5,
  },
  formTogglerItems: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "5%",
    marginHorizontal: "2%",
    alignSelf: "flex-start",
  },
  formTogglerText: {
    marginTop: Platform.OS === "ios" ? 10 : 14,
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight"
  },
  formTogglerItem: {
    marginLeft: Platform.OS === "ios" ? "63%" : "60%",
  },
  formLocationContainer: {
    marginBottom: "80%",
  },
  buttonContainer: {
    marginHorizontal: 10,
    width: "90%",
    flexDirection: "row",
    left: 15,
    justifyContent: "space-between",
  },
  buttonIconContent: {
    width: "45%",
    marginBottom: Platform.OS === "ios" ? "10%" : "5%",
  },
  actionButtonContainer: {
    top: "20%",
    zIndex: 10,
  },
  actionButtonGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    height: 45,
    width: "100%",
  },
  actionButtonTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
});

export default EditProfileInfoScreen;
