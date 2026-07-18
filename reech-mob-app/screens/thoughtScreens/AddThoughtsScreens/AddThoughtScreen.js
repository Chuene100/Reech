import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  useWindowDimensions,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";

//import customs
import { COLORS, icons } from "../../../constants";
import {
  DescriptionComponent,
  CustomAccountToggler,
  CustomLocationMain,
  CustomTextInputMain,
} from "../../../components";
import { useListMyProfilesQuery } from "../../../redux/api/api-slice";
import NavHeader from "@/components/Headers/NavHeader";
import DropDown from "@/components/UI/DropDown";
import { citedReference } from "@/assets/data/dropDownData";
import { useReadBubbleMatesQuery } from "redux-standby/api/api-slice";
import { useListChannelsQuery } from "@/redux/api/channel";


const AddThoughtScreen = () => {
  const navigation = useNavigation();
  const { height } = useWindowDimensions();

  const { control, handleSubmit, watch } = useForm();

  //image picker code
  const [hasGalleryPermission, setHasGalleryPermission] = useState("false");
  const [thoughtMedia, setThoughtMedia] = useState(null);
  const [selectedChannel, setChannel] = useState({});
  const [myProfiles, setMyProfiles] = useState([]);
  const [bubbleMates, setBubbleMates] = useState([]);

  const user = useSelector((state) => state.user.current_user);
  const cache_profiles = useSelector((state) => state.profiles.user_profiles);

  const mates_arr = user?.bubbleMates?.filter((m) => m.status === "Mate");

  const { data } = useReadBubbleMatesQuery(mates_arr);
  const { data: fetched_profiles } = useListMyProfilesQuery(user?._id ?? null);
  const { data: channels } = useListChannelsQuery();

  useEffect(() => {
    setMyProfiles(cache_profiles?.data ?? fetched_profiles?.data);
  }, [cache_profiles, fetched_profiles]);

  useEffect(() => {
    setBubbleMates(data?.data ?? []);
  }, [data]);

  const [watchThoughtType] = watch(["thoughtType"]);
  useEffect(() => {
    async () => {
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    };
  }, []);

  const pickImage = async () => {
    let chosenImage = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (chosenImage.canceled) {
      return alert(
        "You haven't chosen any image file.\n Do you wanna try again?"
      );
    }

    if (!chosenImage.canceled) {
      setThoughtMedia(chosenImage.assets[0]);
    }
  };

  if (hasGalleryPermission === false) {
    return alert("Permission to access your gallery is required!");
  }

  //handle data
  const nextButtonPressed = (data) => {
    const fileName = thoughtMedia?.uri?.split("/").pop();
    const loc = data.location.split("|");

    const newData = {
      notifyBubble: data.notifyBubble == undefined ? false : data.notifyBubble,
      fileLink: {
        name: "_thoughtMedia-" + fileName,
        uri: thoughtMedia?.uri,
        type: thoughtMedia?.type,
      },
      fileType: "",
      profileId: data.profile?.split("|")?.[1],
      userId: user?._id,
      title: data.title,
      address: loc[0],
      location: { type: "Point", coordinates: [loc[2], loc[1]] },
      description: data.description,
      channelId: data?.channel?._id,
      subChannelId: data?.subChannel?._id,
      tags: [{ userId: data.thoughtTags?.split("|")?.[1] }],
      thoughtType: data?.thoughtType,
      thoughtReference: data?.thoughtType === "Original" ? null : [{ userId: data.thoughtReference?.split("|")?.[1] }],
    };

    navigation.navigate("AddThoughtDescriptionScreen", {
      data: newData,
    });
  };

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <NavHeader message="What would you like to do?" />
      </View>
    );
  }

  {
    /*
  Please note: This bubble notifications should only be a notification 
  sent to your bubble’s message/chat section
 */
  }
  function renderNotifySection() {
    return (
      <View style={styles.topSectionContent}>
        <View style={styles.topSectionTextContainer}>
          <Text style={styles.topSectionText}>Notify bubble</Text>
        </View>

        <View style={styles.notifier}>
          <CustomAccountToggler name="notifyBubble" control={control} />
        </View>
      </View>
    );
  }

  //image picker section
  function renderImagePickerSection() {
    return (
      <View style={styles.imagePickerContainer}>
        <>
          <View style={styles.imageContainer}>
            <TouchableOpacity
              style={styles.touchPicture}
              onPress={() => pickImage()}
            >
              {thoughtMedia?.uri ? (
                <View style={styles.imagePicker}>
                  <Image
                    source={{
                      uri: thoughtMedia?.uri,
                    }}
                    style={[
                      styles.imagePicker,
                      styles.images,
                      { height: height * 0.26, borderWidth: 0 },
                    ]}
                    resizeMode="cover"
                  />
                </View>
              ) : (
                <View style={styles.imagePicker}>
                  <View
                    style={[
                      styles.imagePicker,
                      styles.images,
                      { height: height * 0.26 },
                    ]}
                  >
                    <Text style={styles.imageText}>Add a cover or video</Text>
                    <Text style={styles.imageSubText}>(max size 5mb)</Text>
                    <Image
                      source={icons.addIconPicture}
                      style={styles.addIconPicture}
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </>
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
            name="profile"
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
            name="title"
            control={control}
            placeholder={"Add a title"}
            rules={{ required: "Please provide a thought title" }}
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
              rowText={'subChannel'}
              minimal={true}
            />
          </View>
        </View>

        {/*tag people or places section*/}
        <View style={styles.formItemTagContent}>
          <DropDown
            name="thoughtTags"
            control={control}
            data={bubbleMates && bubbleMates.map(
              (user) => `${user?.firstName + " " + user?.lastName}|${user?._id}`
            )}
            placeholder="Tag people or places"
            rules={{ required: "Please select a tag" }}
            minimal={true}
          />
        </View>

        {/*reference dropdown section*/}
        <View style={styles.formItemTitleContent}>
          <DropDown
            name="thoughtType"
            data={citedReference}
            control={control}
            placeholder="Is this an original thought or is it cited?"
            rules={{ required: "Please select a thought type" }}
            minimal={true}
          />

          {watchThoughtType === "Cited" ? (
            <View style={styles.formReferenceComponentItem}>
              <DropDown
                name="thoughtReference"
                data={bubbleMates && bubbleMates.map(
                  (user) => `${user?.firstName + " " + user?.lastName}|${user?._id}`
                )}//{thoughtReference}
                control={control}
                placeholder="     Add your references"
                rules={{ required: "Please select a reference" }}
                minimal={true}
              />
            </View>
          ) : null}
        </View>
      </View>
    );
  }

  //next button section
  function renderNextButtonSection() {
    return (
      <View style={styles.buttonItemContainer}>
        <Pressable
          onPress={handleSubmit(nextButtonPressed)}
          style={styles.buttonContainer}
        >
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
            style={styles.buttonGradientContainer}
          >
            <Text style={styles.buttonTextItem}>Next</Text>
          </LinearGradient>
        </Pressable>
      </View>
    );
  }

  //screen list content
  return (
    <View style={styles.container}>
      {renderHeaderSection()}
      {renderNotifySection()}
      {renderImagePickerSection()}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollingFormContainer}
      >
        {renderFormItemSection()}
      </ScrollView>
      {renderNextButtonSection()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  scrollingFormContainer: {
    maxHeight: "47%",
  },

  //header section
  headerContainer: {
    zIndex: 99,
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },

  //notifier
  topSectionContent: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: Platform.OS === "android" ? "5%" : "4%",
  },
  topSectionTextContainer: {
    marginTop: "1%",
  },
  topSectionText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  notifier: {
    marginTop: "0%",
  },

  //image picker section
  imagePickerContainer: {
    marginTop: 15,
    width: "100%",
    height: "26.5%",
  },
  imageContainer: {
    flex: 1,
    marginLeft: "8%",
  },
  touchPicture: {
    zIndex: 10,
  },
  imagePicker: {
    right: Platform.OS === "ios" ? 15 : 8,
    width: Platform.OS === "ios" ? 420 : 335,
  },
  images: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 1,
  },
  imageText: {
    fontSize: 16,
    color: COLORS.white,
    fontFamily: "PoppinsLight",
    marginBottom: 2,
  },
  imageSubText: {
    fontSize: 16,
    color: COLORS.darkGray,
    fontFamily: "PoppinsLight",
  },
  addIconPicture: {
    height: 80,
    width: 80,
    marginTop: 20,
  },

  //form item section
  formItemContainer: {
    flexDirection: "column",
    paddingHorizontal: 5,
  },
  formItemProfileContent: {
    marginBottom: -10,
    zIndex: 1,
  },
  formItemLocationContent: {
    marginBottom: 0,
    zIndex: 99,
  },
  formItemTitleTopContent: {
    marginBottom: -10,
  },
  formItemTitleContent: {
    marginVertical: 0,
  },
  formSubComponent: {
    marginTop: -10,
    marginBottom: -5,
  },
  formItemDescriptionContent: {
    marginTop: 0,
  },
  formTextTitleItemContainer: {
    marginTop: 8,
    marginLeft: 18,
  },
  formTextTitleItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  formDescriptionComponentItem: {
    paddingTop: 5,
    paddingHorizontal: 10,
    height: Platform.OS === "ios" ? 80 : 50,
  },
  lineSpacerContainer: {
    marginVertical: 5,
  },
  horizontalLine: {
    alignSelf: "center",
    width: "100%",
    borderBottomColor: COLORS.reechGray,
    borderBottomWidth: 1,
  },
  formItemTagContent: {
    marginTop: 0,
    marginBottom: 0,
    zIndex: 1,
  },
  formReferenceComponentItem: {
    height: 50,
  },

  //next button section
  buttonItemContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginHorizontal: 10,
    height: Platform.OS === "ios" ? 50 : 0,
    marginTop: Platform.OS === "ios" ? 25 : 40,
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
});

export default AddThoughtScreen;
