import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  ScrollView,
  Pressable,
  ActivityIndicator,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { FontAwesome } from "@expo/vector-icons";
import AutoComplete from "react-native-autocomplete-input";
import { useSelector } from "react-redux";

//import customs
import { COLORS, images } from "../../../constants";
import {
  CustomAccountToggler,
  CustomDatePickerVouch,
  CustomImagePickerBubbleFullWidth,
  CustomInputDescriptionAddMain,
  CustomLocationVouch,
} from "../../../components";
import { useReadBubbleMatesQuery } from "../../../redux/api/api-slice";
import { usePostVouchMutation } from "../../../redux/api/vouch";
import { useUploadSingleFileMutation } from "../../../redux/api/api-slice";

const VouchForPlacesScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigation = useNavigation();

  const [bubbleMates, setBubbleMates] = useState([]);
  const [filteredMates, setFilteredMates] = useState([]);
  const [selectedMate, setMate] = useState({});

  const user = useSelector((state) => state.user.current_user);
  const current_profile = useSelector(
    (state) => state.currentProfile.current_profile
  );

  const image = useSelector((state) => state.bubble_images.bubbleImages);

  const mates_arr = user?.bubbleMates?.filter((m) => m.status === "Mate");

  const { data } = useReadBubbleMatesQuery(mates_arr);
  const [postVouchFn, { isLoading }] = usePostVouchMutation();
  const [uploadFn, { isLoading: isLoadingFile }] =
    useUploadSingleFileMutation();

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

  useEffect(() => {
    setBubbleMates(data?.data ?? []);
  }, [data]);

  const filterMates = (mates, item) => {
    const new_mates = mates.filter((m) => {
      return m.firstName
        .toUpperCase()
        .trim()
        .includes(item.toUpperCase().trim());
    });
    setMate({ ...selectedMate, firstName: item });
    item ? setFilteredMates(new_mates) : setFilteredMates({});
  };

  const vouchClicked = async (data) => {
    console.log("vouch for this location using this data: \n", data);

    // if (!selectedMate) {
    //   Toast.show({
    //     type: "error",
    //     text: "Error",
    //     text2: "You should select a bubble mate to vouch for.",
    //   });
    //   return;
    // }

    // const loc = data.address.split("|");
    // const payload = {
    //   ...data,
    //   userId: user?._id,
    //   profileId: current_profile?._id,
    //   address: loc[0],
    //   location: { type: "Point", coordinates: [loc[2], loc[1]] },
    //   vouchFor: {
    //     userId: selectedMate._id,
    //     userImage: selectedMate.profileImage,
    //     username: selectedMate.firstName + " " + selectedMate.lastName,
    //     blurb: selectedMate.blurb,
    //   },
    // };
    // const fileName = data.vouchImage.split("/").pop();
    // const file = {
    //   name: "_vouch-" + fileName,
    //   uri: data.vouchImage,
    //   type: "image/jpg",
    // };

    // const formData = new FormData();
    // formData.append("file", file);
    // try {
    //   const { data } = await uploadFn(formData);
    //   const url = data.data;
    //   payload.vouchImage = url;
    // } catch (error) {
    //   console.error(error);
    //   return;
    // }

    // postVouchFn(payload)
    //   .then((res) => {
    //     if (res.error) {
    //       showError(res);
    //       return;
    //     }
    //     showToast(res?.data?.message);
    //     navigation.goBack();
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });
  };

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
          rules={{ required: "Please choose a vouch image" }}
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

            {/*new search field*/}
            <View style={styles.inputContentSearch}>
              <View style={styles.inputComponentContainerSearch}>
                <AutoComplete
                  data={filteredMates}
                  value={selectedMate.firstName}
                  placeholder={"Search for a place"}
                  placeholderTextColor={COLORS.white}
                  icon={
                    <FontAwesome name="search" size={24} color={COLORS.white} />
                  }
                  onChangeText={(item) => filterMates(bubbleMates, item)}
                  inputContainerStyle={styles.searchInputContainer}
                  listContainerStyle={{ height: 8 }}
                  style={styles.searchInput}
                  rules={{
                    required: "Search for a place to vouch for",
                  }}
                  flatListProps={{
                    keyExtractor: (_, idx) => idx,
                    scrollEnabled: true,
                    style: styles.searchListContainer,

                    renderItem: ({ item }) => {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            setMate(item);
                            setFilteredMates([]);
                          }}
                        >
                          <View style={styles.searchUserContentContainer}>
                            <ImageBackground
                              source={images.userFrame}
                              style={styles.searchUserImageContainer}
                            >
                              <Image
                                source={
                                  item.profileImage
                                    ? {
                                      uri:
                                        image[item.profileImage] ??
                                        item.profileImage,
                                    }
                                    : images.defaultRounded
                                }
                                style={styles.searchUserImage}
                              />
                            </ImageBackground>
                            <View style={styles.searchUserItems}>
                              <Text style={styles.searchUserText}>
                                {item.firstName} {item.lastName}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    },
                  }}
                />
              </View>
            </View>

            <View style={styles.spaceLiner} />

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
          onPress={handleSubmit(vouchClicked)}
          style={styles.submitItemContainer}
        >
          <View style={styles.submitGradientContainer}>
            <Text style={styles.submitTextItem}>
              {isLoading || isLoadingFile ? (
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

  //screen content list
  function renderScreenContentList() {
    return (
      <>
        {renderNotifyBubbleSection()}
        <View style={styles.imagePickerMainContainer}>
          {renderImagePickerSection()}
        </View>
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
    marginTop: "2%",
  },

  //notify action
  notifyActionContainer: {
    flexDirection: "column",
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
  imagePickerMainContainer: {
    marginTop: 10,
    maxHeight: Platform.OS === "ios" ? "44%" : "39%",
    marginBottom: 5,
  },
  imagePickerComponentContainer: {
    height: "100%",
  },

  //scrolling form section
  scrollingFormContainer: {
    marginTop: "0%",
  },
  formItemContainer: {
    flexDirection: "column",
  },
  formDateContainer: {
    flexDirection: "column",
  },
  inputContentSearch: {
    flexDirection: "row",
    width: "100%",
    marginTop: 10,
    zIndex: 10,
  },
  inputComponentContainerSearch: {
    zIndex: 20,
    width: "100%",
  },
  searchInputContainer: {
    borderColor: COLORS.transparent,
    width: "100%",
    height: 40,
  },
  searchInput: {
    backgroundColor: COLORS.black,
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    paddingLeft: 14,
    fontSize: 12,
  },
  searchUserImageContainer: {
    width: 38,
    height: 38,
  },
  searchUserImage: {
    top: 4,
    left: 4,
    width: 30,
    height: 30,
    overflow: "hidden",
    resizeMode: "cover",
    borderRadius: 5,
  },
  searchUserItems: {
    flexDirection: "column",
    marginHorizontal: 20,
  },
  searchUserContentContainer: {
    width: "80%",
    alignItems: "center",
    flexDirection: "row",
  },
  searchUserText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  searchListContainer: {
    maxHeight: 130,
    padding: 10,
    backgroundColor: COLORS.black,
  },
  formTextDescriptionContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  formTextDescription: {
    marginBottom: -20,
    paddingHorizontal: 15,
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
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

  //button section
  submitButtonContainer: {
    marginTop: Platform.OS === "ios" ? "10%" : 0,
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

export default VouchForPlacesScreen;
