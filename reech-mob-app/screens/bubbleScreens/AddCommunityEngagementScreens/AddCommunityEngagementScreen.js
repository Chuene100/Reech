import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Platform,
  Pressable,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Form, useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import { FontAwesome } from "@expo/vector-icons";
import { useSelector } from "react-redux";

//import customs
import { communityMemberListItems } from "../../../assets/data/communityEngagementData";
import { COLORS } from "../../../constants";
import {
  CustomAccountToggler,
  CustomLocationVouch,
  CustomDatePickerVouch,
  CustomInputMain,
  CustomImagePickerCommunity,
  CustomInputDescriptionAddMain,
} from "../../../components";
import { usePostCommunityMutation } from "@/redux/api/communityEngagement";
import { useUploadSingleFileMutation } from "@/redux/api/api-slice";
import NavHeader from "@/components/Headers/NavHeader";

const AddCommunityEngagementScreen = ({ route }) => {
  const { control, handleSubmit } = useForm();

  const navigation = useNavigation();

  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [selectedAdminTeamMembers, setSelectedAdminTeamMembers] = useState([]);

  const user = useSelector((state) => state.user.current_user);
  const current_profile = useSelector((state) => state.currentProfile.current_profile);

  const [uploadFn, { isLoading: isLoadingFile }] = useUploadSingleFileMutation();
  const [createCommunityFn, { isLoading }] = usePostCommunityMutation();

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

  // Retrieve selected team members from the route params and update the state
  useEffect(() => {
    if (route.params?.selectedTeamMembers) {
      setSelectedTeamMembers(route.params.selectedTeamMembers);
    }
  }, [route.params?.selectedTeamMembers]);

  // Retrieve selected admin members from the route params and update the state
  useEffect(() => {
    if (route.params?.selectAdminTeamMembers) {
      setSelectedAdminTeamMembers(route.params.selectAdminTeamMembers);
    }
  }, [route.params?.selectAdminTeamMembers]);

  const communityEngagementCreated = async (data) => {
    let team = selectedTeamMembers.map(obj => obj._id)
    let admins = selectedAdminTeamMembers.map(obj => obj._id)
    team.push(user._id)
    admins.push(user._id)
    const loc = data.location.split("|")

    const payload = {
      ...data,
      team: team,
      admins: admins,
      address: loc[0],
      userId: user._id,
      profileId: current_profile._id,
      location: { type: "Point", coordinates: [loc[2], loc[1]] },
    }

    const fileName = data.communityImage.split("/").pop();
    const file = {
      name: "_profile-" + fileName,
      uri: data.communityImage,
      type: "image/jpg",
    };

    const formData = new FormData();
    formData.append("file", file);
    try {
      const { data } = await uploadFn(formData);
      const url = data.data;
      payload.communityImage = url;
    } catch (error) {
      console.error(error);
      return;
    }

    createCommunityFn(payload)
      .then((res) => {
        if (res.error) {
          showError(res);
          return;
        }
        showToast(res.data?.message);
        navigation.goBack();
      })
      .catch((err) => {
        console.log(err);
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
          rules={{ required: "Please choose a community cover Image." }}
          mainText={"Add a cover for your community engagement"}
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
                name="location"
                placeholder="Location"
                rules={{ required: "Please choose a location" }}
              />
              <View style={styles.spaceLiner} />
            </View>

            {/*title component*/}
            <CustomInputMain
              control={control}
              name="title"
              placeholder="Add a community title"
              multiline={true}
              rules={{
                required: "Please provide a description",
                maxLength: {
                  value: 100,
                  message: "Description must be at least 100 characters long",
                },
              }}
            />

            <View style={styles.spaceLiner} />

            {/*add team component section*/}
            <View style={styles.formTextTeamContainer}>
              <View style={styles.formTextTeamContent}>
                <Text style={styles.formTextTeam}>Add team{" "}
                  {selectedTeamMembers && (
                    <Text style={styles.formInfoTeamText}>
                      (Add people who are part of this engagement)
                    </Text>
                  )}</Text>
                <View style={styles.formIconItemContainer}>
                  <FontAwesome
                    onPress={() =>
                      navigation.navigate("AssignTeamMemberScreen", {
                        selectedTeamMembers: selectedTeamMembers,
                      })
                    }
                    name="chevron-down"
                    size={16}
                    color={COLORS.darkGray}
                    style={styles.formIconItem}
                  />
                </View>
              </View>

              {/*Render selected member details based on memberId*/}
              <ScrollView
                scrollEnabled
                showsHorizontalScrollIndicator={false}
                style={styles.formInfoTeamContainer}
              >
                <View style={styles.formInfoTeamTextContainer}>
                  {selectedTeamMembers.map((memberId, idx) => {
                    return (
                      <View
                        key={idx}
                        style={styles.formInfoTeamTextContent}
                      >
                        {/*user image*/}
                        <Image
                          source={{ uri: memberId?.profileImage }}
                          style={styles.formInfoTeamImage}
                        />

                        {/*user name item*/}
                        <Text style={styles.formInfoTeamText}>
                          {memberId?.firstName} {memberId?.lastName}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            </View>

            {/*add admin component section*/}
            <View style={styles.formTextAdminContainer}>
              <View style={styles.formTextTeamContent}>
                <Text style={styles.formTextTeam}>Assign admins</Text>
                <View style={styles.formIconItemContainer}>
                  <FontAwesome
                    onPress={() =>
                      navigation.navigate("AssignAdminMemberScreen", {
                        selectedAdminTeamMembers: selectedAdminTeamMembers,
                        members: selectedTeamMembers,
                      })
                    }
                    name="chevron-down"
                    size={16}
                    color={COLORS.darkGray}
                    style={styles.formIconItem}
                  />
                </View>
              </View>

              {/*Render selected member details based on memberId*/}
              <ScrollView
                scrollEnabled
                showsHorizontalScrollIndicator={false}
                style={styles.formInfoTeamContainer}
              >
                <View style={styles.formInfoTeamTextContainer}>
                  {selectedAdminTeamMembers.map((memberId, idx) => {
                    return (
                      <View
                        key={idx}
                        style={styles.formInfoTeamTextContent}
                      >
                        <Image
                          source={{ uri: memberId?.profileImage }}
                          style={styles.formInfoTeamImage}
                        />

                        {/*user name item*/}
                        <Text style={styles.formInfoTeamText}>
                          {memberId?.firstName} {memberId?.lastName}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
              <Text style={styles.formInfoTeamText}></Text>
            </View>
            <View style={styles.spaceLiner} />

            {/*description area*/}
            <View style={styles.formDescriptionContainer}>
              <Text style={styles.formDescriptionTextItem}>Description</Text>
              <CustomInputDescriptionAddMain
                control={control}
                name="description"
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
          onPress={handleSubmit(communityEngagementCreated)}
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
  locationComponentContainer: {
    zIndex: 9,
  },
  spaceLiner: {
    marginVertical: 0,
    width: "100%",
    borderColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth * 1,
  },
  formTextTeamContainer: {
    height: "18%",
  },
  formTextAdminContainer: {
    height: "20%",
  },
  formTextTeamContent: {
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  formTextTeam: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    width: "90%",
    paddingHorizontal: 15,
  },
  formIconItemContainer: {
    width: "10%",
    right: 20,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  formIconItem: {
    left: Platform.OS === "ios" ? 3 : 8,
    alignItems: "center",
  },
  formInfoTeamContainer: {
    flexDirection: "row",
  },
  formInfoTeamTextContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  formInfoTeamTextContent: {
    width: "auto",
    margin: 5,
    paddingVertical: 2.5,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.purple,
  },
  formInfoTeamImage: {
    width: 20,
    height: 20,
    resizeMode: "cover",
    borderRadius: 20,
  },
  formInfoTeamText: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: "PoppinsLight",
    opacity: 0.4,
    marginHorizontal: 5,
  },
  formDescriptionContainer: {
    marginTop: 10,
    height: "20%",
  },
  formDescriptionTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    marginHorizontal: 15,
    marginBottom: 5,
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

export default AddCommunityEngagementScreen;
