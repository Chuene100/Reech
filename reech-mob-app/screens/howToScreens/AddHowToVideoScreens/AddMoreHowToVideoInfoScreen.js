import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Pressable, Platform, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";

//import customs
import { COLORS, icons } from "../../../constants";
import NavHeader from "@/components/Headers/NavHeader";
import { CustomLocationMain, CustomTextInputMain, DescriptionComponent } from "../../../components";
import DropDown from "@/components/UI/DropDown";
import { useListChannelsQuery } from "@/redux/api/channel";
import { useReadBubbleMatesQuery } from "../../../redux/api/api-slice";
import { useListMyProfilesQuery } from "redux-standby/api/api-slice";
import { ImageBackground } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const AddMoreHowToVideoInfoScreen = ({ route }) => {
  const { control, handleSubmit } = useForm();

  const navigation = useNavigation();
  const previousVideoData = route.params.data;

  const user = useSelector((state) => state.user.current_user);
  const current_profile = useSelector((state) => state.currentProfile.current_profile);

  const cache_profiles = useSelector((state) => state.profiles.user_profiles);
  const mates_arr = user?.bubbleMates?.filter((m) => m.status === "Mate");

  const [myProfiles, setMyProfiles] = useState([]);
  const [bubbleMates, setBubbleMates] = useState([]);
  const [selectedChannel, setChannel] = useState({});
  const [savedToDrafts, setSavedToDrafts] = useState(false);

  const { data } = useReadBubbleMatesQuery(mates_arr);
  const { data: fetched_profiles } = useListMyProfilesQuery(user?._id ?? null);
  const { data: channels } = useListChannelsQuery();

  useEffect(() => {
    setMyProfiles(cache_profiles?.data ?? fetched_profiles?.data);
  }, [cache_profiles, fetched_profiles]);

  useEffect(() => {
    setBubbleMates(data?.data ?? []);
  }, [data]);

  //handle data to be submitted
  const saveButtonPressed = async (data) => {
    navigation.navigate("HowToVideoSavedDraftsScreen", data);
    setSavedToDrafts(false);
  };

  //handle data to be submitted
  const previewButtonPressed = async (data) => {
    const loc = data.location.split("|");
    const payload = {
      userId: user?._id,
      profileId: current_profile?._id,
      title: data.videoName,
      address: loc[0],
      location: { type: "Point", coordinates: [loc[2], loc[1]] },
      description: data.description,
      channelId: data?.channel?._id,
      subChannelId: data?.subChannel?._id,
      tags: [{ userId: data.howToTags?.split("|")?.[1] }],
      notifyBubble: previousVideoData.notifyBubble,
      video: previousVideoData.video,
    }


    navigation.navigate("PreviewHowToScreen", { data: payload, subChannel: data?.subChannel });
  };

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <NavHeader message="What would you like to do?" />

        {/*header text item*/}
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitleItem}>How to...</Text>
        </View>
      </View>
    );
  }

  //form items section
  function renderFormItemSection() {
    return (
      <View style={styles.formItemContainer}>
        {/*select profile section*/}
        <View style={styles.formItemProfileContent}>
          <DropDown
            name="userTitle"
            control={control}
            data={myProfiles && myProfiles.map(
              (profile) => `${profile?.jobTitleId?.jobTitle}|${profile?._id}`
            )}
            rules={{ required: "Please select a profile" }}
            placeholder={"Select a profile"}
            minimal={true}
          />
        </View>

        {/*add title section*/}
        <View style={styles.formItemTitleTopContent}>
          <CustomTextInputMain
            name="videoName"
            control={control}
            placeholder={"Add a title"}
            rules={{ required: "Please provide a video title" }}
          />
        </View>

        {/*add location section*/}
        <View style={styles.formItemLocationContent}>
          <CustomLocationMain
            name="location"
            control={control}
            placeholder="Location"
            rules={{ required: "Please enter a location" }}
          />
        </View>

        {/*location spacer*/}
        <View style={styles.lineSpacerContainer}>
          <View style={styles.horizontalLine} />
        </View>

        {/*add description section*/}
        <View style={styles.formItemDescriptionContent}>
          <View style={styles.formTextTitleItemContainer}>
            <Text style={styles.formTextTitleItem}>Description</Text>
          </View>

          <View style={styles.formDescriptionComponentItem}>
            <DescriptionComponent
              name="description"
              control={control}
              rules={{
                required:
                  "Please ensure you provide a description for your thought.",
                maxLength: {
                  value: 200,
                  message: "Description must only be 200 characters long",
                },
              }}
              placeholder="Write a description (max 200 characters)..."
            />
          </View>

          <View style={styles.lineSpacerContainer}>
            <View style={styles.horizontalLine} />
          </View>
        </View>

        {/*add category section*/}
        <View style={styles.formItemTitleContent}>
          <DropDown
            name="channel"
            data={channels?.data ?? []}
            control={control}
            placeholder="Select a channel"
            rules={{ required: " Please select a thought channel" }}
            notifyChange={({ value }) => {
              setChannel(value);
            }}
            rowText={'channel'}
            minimal={true}
          />

          <View style={styles.formSubComponent}>
            <DropDown
              name="subChannel"
              data={selectedChannel?.subChannelId}
              control={control}
              type="title"
              placeholder="   Select a sub-channel"
              rules={{ required: " Please select a thought sub channel" }}
              notifyChange={({ value }) => {
                console.log(value);
              }}
              rowText={'subChannel'}
              minimal={true}
            />
          </View>
        </View>

        {/*tag people or places section*/}
        <View style={styles.formItemTagContent}>
          <DropDown
            name="howToTags"
            data={bubbleMates && bubbleMates.map(
              (user) => `${user?.firstName + " " + user?.lastName}|${user?._id}`
            )}
            control={control}
            placeholder="Tag people or places"
            rules={{ required: "Please select a tag" }}
            minimal={true}
          />
        </View>
      </View>
    );
  }

  //button section
  function renderSaveAndSubmitButtonSection() {
    return (
      <View style={styles.buttonItemsContainer}>
        {/*save to draft*/}
        <Pressable
          onPress={() => setSavedToDrafts(true)}
          style={styles.buttonContainer}
        >
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
            style={styles.buttonGradientContainer}
          >
            <Text style={styles.buttonTextItem}>Save to drafts</Text>
          </LinearGradient>
        </Pressable>

        <Pressable
          onPress={handleSubmit(previewButtonPressed)}
          style={styles.buttonContainer}
        >
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
            style={styles.buttonGradientContainer}
          >
            <Text style={styles.buttonTextItem}>Preview</Text>
          </LinearGradient>
        </Pressable>
      </View>
    );
  }

  //saved to drafts modal
  function renderSavedToDraftsModal() {
    return (
      <Modal
        visible={savedToDrafts}
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        style={styles.saveModalContainer}
      >
        <ImageBackground
          source={icons.popupBg}
          style={styles.saveInnerModalContainer}
        >
          {/*modal close action section*/}
          <View style={styles.saveInnerModalContent}>
            <Pressable onPress={() => setSavedToDrafts(false)}>
              <Ionicons name="close" size={18} color={COLORS.white} />
            </Pressable>
          </View>

          {/*modal option text section*/}
          <View style={styles.saveModalOptionContent}>
            {/*save option*/}
            <Pressable
              onPress={handleSubmit(saveButtonPressed)}
              style={styles.saveModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.saveModalOptionIconContainer}>
                <MaterialCommunityIcons name="content-save-all" size={25} color={COLORS.white} />
              </View>

              {/*modal option text section*/}
              <View style={styles.saveModalOptionTextContainer}>
                <Text style={styles.saveModalOptionHeaderText}>Save to drafts</Text>
                <Text style={styles.saveModalOptionInfoText}>
                  Fill out the form, store your info, and come back later to make changes.
                </Text>
              </View>
            </Pressable>
          </View>
        </ImageBackground>
      </Modal>
    )
  }

  return (
    <View style={styles.container}>
      {renderHeaderSection()}
      {renderFormItemSection()}
      {renderSaveAndSubmitButtonSection()}
      {renderSavedToDraftsModal()}
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
    marginHorizontal: 25,
  },
  headerTitleItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //form item section
  formItemContainer: {
    minHeight: Platform.OS === "ios" ? "75%" : "82%",
    marginHorizontal: 10,
  },
  formItemProfileContent: {
    marginBottom: -10,
    zIndex: 1,
  },
  formItemTitleTopContent: {
    marginBottom: -10,
  },
  formItemLocationContent: {
    height: 50,
    zIndex: 1,
  },
  formItemDescriptionContent: {
    marginTop: 0,
  },
  formTextTitleItemContainer: {
    marginTop: 8,
    marginLeft: 10,
  },
  formTextTitleItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  formDescriptionComponentItem: {
    paddingTop: 5,
    paddingHorizontal: 10,
    height: 90,
  },
  formItemTitleContent: {
    marginTop: -10,
  },
  formSubComponent: {
    marginTop: -10,
    marginBottom: -5,
  },
  lineSpacerContainer: {
    marginTop: 5,
    marginBottom: 10,
  },
  horizontalLine: {
    alignSelf: "center",
    width: "100%",
    borderBottomColor: COLORS.reechGray,
    borderBottomWidth: 1,
  },
  formItemTagContent: {
    marginBottom: 5,
    zIndex: 1,
  },

  //button section
  buttonItemsContainer: {
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: "45%",
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
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //saved to drafts modal
  saveModalContainer: {
    marginTop: 10,
  },
  saveInnerModalContainer: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? "185%" : "175%",
    padding: "4%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  saveInnerModalContent: {
    right: 5,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  saveModalOptionContent: {
    left: Platform.OS === "ios" ? 18 : 30,
    flexDirection: "column",
  },
  saveModalOptionContainer: {
    top: 15,
    marginBottom: 25,
    flexDirection: "row",
  },
  saveModalOptionIconContainer: {
    width: "15%",
    justifyContent: "center",
    alignItems: "center",
  },
  saveModalOptionTextContainer: {
    left: Platform.OS === "ios" ? 20 : 20,
    width: "65%",
    flexDirection: "column",
  },
  saveModalOptionHeaderText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  saveModalOptionInfoText: {
    marginTop: 2,
    opacity: 0.8,
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
});

export default AddMoreHowToVideoInfoScreen;
