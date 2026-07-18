import React, { useEffect, useState, useRef } from "react";
import {
  Alert,
  Image,
  Modal,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  useWindowDimensions,
  FlatList,
  Dimensions,
  Platform,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Video } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useForm } from "react-hook-form";
import moment from "moment";
import * as DocumentPickerFunction from "expo-document-picker";

import Toast from "react-native-toast-message";

//import customs
import { images, COLORS, icons } from "../../constants";
import {
  EmptyFlatlistComponent,
  CustomInputTextAreaNote,
  EmojiPicker,
} from "../../components";
import { useUploadSingleFileNoAuthMutation } from "../../redux/api/api-slice";
import { useSubmitApplicationMutation } from "../../redux/api/application";
import { useSelector } from "react-redux";
import NavHeader from "@/components/Headers/NavHeader";

const HomeScreenCardFullView = ({ route }) => {
  //form control: validate
  const {
    control,
    watch,
    handleSubmit,
    setValue,
  } = useForm();

  const videoRef = useRef(null);
  const navigation = useNavigation();
  const { height } = useWindowDimensions();

  const { data } = route.params;

  const user = useSelector((state) => state.user.current_user);
  const current_profile = useSelector((state) => state.currentProfile.current_profile);
  const image = useSelector((state) => state.opportunity_images.opportunityImages);

  const [uploadNoAuthFn, { isLoading: isLoadingFile }] = useUploadSingleFileNoAuthMutation();
  const [submitApplicationFn, { isLoading }] = useSubmitApplicationMutation();

  const { idx } = route.params;
  const scrollRef = useRef();


  const scrollToIndex = () => {
    scrollRef?.current?.scrollToIndex({
      animated: false,
      index: idx,
    });
  };
  setTimeout(() => scrollToIndex(), 100);

  const [moreModal, setModal] = useState(false);
  const [moreModalVer, setModalVer] = useState(false);
  const [itemInfo, setItemInfo] = useState({});
  const [itemInfoVer, setItemInfoVer] = useState({});

  const [status, setStatus] = useState(false);

  //file attachment: business opportunity note
  const [BusinessFileAttachmentURI, SetBusinessFileAttachmentURI] = useState("");
  const [BusinessFileAttachmentName, SetBusinessFileAttachmentName] = useState("");
  const [BusinessFileAttachmentSize, SetBusinessFileAttachmentSize] = useState("");
  const [BusinessFileAttachmentType, SetBusinessFileAttachmentType] = useState("");

  const fileAttachmentItemTriggerBusiness = async () => {
    try {
      let result = await DocumentPickerFunction.getDocumentAsync({
        type: "*/*",
        multiple: true,
      });
      console.log(result);
      if (result.type !== "cancel") {
        SetBusinessFileAttachmentURI(result.uri);
        SetBusinessFileAttachmentName(result.name);
        SetBusinessFileAttachmentSize(result.size);
        SetBusinessFileAttachmentType(result.mimeType);

        let formatByteBusiness = (result.size / 1000).toFixed(0);
        SetBusinessFileAttachmentSize(formatByteBusiness);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //file attachment: individual opportunity note
  const [IndividualFileAttachmentURI, SetIndividualFileAttachmentURI] = useState("");
  const [IndividualFileAttachmentName, SetIndividualFileAttachmentName] = useState("");
  const [IndividualFileAttachmentSize, SetIndividualFileAttachmentSize] = useState(0);
  const [IndividualFileAttachmentType, SetIndividualFileAttachmentType] = useState("");

  const fileAttachmentItemTrigger = async () => {
    try {
      let result = await DocumentPickerFunction.getDocumentAsync({
        type: "*/*",
        multiple: false,
      });
      if (result.type !== "cancel") {
        SetIndividualFileAttachmentURI(result.assets[0].uri);
        SetIndividualFileAttachmentName(result.assets[0].name);
        SetIndividualFileAttachmentSize(result.assets[0].size);
        SetIndividualFileAttachmentType(result.assets[0].mimeType);

        let formatByte = (result.assets[0].size / 1000).toFixed(0);
        SetIndividualFileAttachmentSize(formatByte);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //emoji attachment
  const [personalNoteVerifiedTrigger, setPersonalNoteVerifiedTrigger] = useState(false);

  const [emojiVerifiedTrigger, setEmojiVerifiedTrigger] = useState(false);

  const [personalNoteTrigger, setPersonalNoteTrigger] = useState(false);

  const [emojiTrigger, setEmojiTrigger] = useState(false);

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
    const focusHandler = navigation.addListener("focus", () => {
      SetIndividualFileAttachmentURI("");
      SetIndividualFileAttachmentName("");
      SetIndividualFileAttachmentSize("");
      SetIndividualFileAttachmentType("");
      setValue("personalNote", "");
    });
    return focusHandler;
  }, [navigation]);


  const applyButtonClicked = () => {
    console.log("send note of application to poster: \n");

    setPersonalNoteVerifiedTrigger(!personalNoteVerifiedTrigger);
    setModalVer(false);
  };

  const respondButtonClicked = async ({ item }) => {
    if (!IndividualFileAttachmentURI) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Attachment file is required.",
      });
      return;
    }

    const applicationNote = watch("personalNote");
    const imgUri = IndividualFileAttachmentURI;
    const imgType = IndividualFileAttachmentType;

    const payload = {
      userId: user?._id,
      profileId: current_profile?._id,
      opportunityId: item?._id,
      attachment: "",
      applicationNote: applicationNote,
    };

    const fileName = imgUri.split("/").pop();
    const file = {
      name: "application-" + fileName,
      uri: imgUri,
      type: imgType,
    };

    const formData = new FormData();
    formData.append("file", file);
    try {
      const { data } = await uploadNoAuthFn(formData);
      const url = data.data;
      payload.attachment = url;
    } catch (error) {
      console.error(error);
      return;
    }

    await submitApplicationFn(payload)
      .then((res) => {
        if (res.error) {
          showError(res);
        }
        showToast(res.data?.message);

        setModal(false);
        SetIndividualFileAttachmentName("");
        SetIndividualFileAttachmentURI("");
        setPersonalNoteTrigger(!personalNoteTrigger);
        setValue("personalNote", "");
      })
      .catch((error) => console.log(error));
  };

  {
    /*individual icon section*/
  }
  //pin long press function
  const onLongPinPress = () => {
    Alert.alert(
      "Please note",
      "Should you click on this icon, you will be pinning this opportunity so that you can look at it later on.",
      [
        {
          text: "Hide forever",
          style: "OK",
          onPress: () => {
            console.log("decline not interested option select");
            setHideForeverPinAlert(true);
          },
        },
        {
          text: "Close",
          style: "OK",
        },
      ]
    );
  };
  const [pinOpportunity, setPinOpportunity] = useState(false);
  const [hideForeverPinAlert, setHideForeverPinAlert] = useState(false);

  //share long pressed function
  const onLongSharePress = () => {
    Alert.alert(
      "Please note",
      "You will be able to share this opportunity card with your fellow Reech bubble mates, should you click on this icon.",
      {
        text: "Close",
        style: "OK",
      }
    );
  };
  const [renderShareModal, setRenderShareModal] = useState(false);

  const oppExpired = (visibilityEndDate) => {
    var expired = moment(visibilityEndDate).diff(moment(new Date()), "days");
    return expired < 0 ?? false;
  };

  //share pop-up modal
  function renderSharePopupModal() {
    return (
      <Modal
        transparent={true}
        animationType="slide"
        visible={renderShareModal}
        statusBarTranslucent={true}
        style={styles.reportOptionModalContainer}
      >
        {/*report option modal content*/}
        <View style={styles.shareOptionModalContent}>
          <Pressable onPress={() => setRenderShareModal(false)}>
            <AntDesign name="closecircle" size={20} color={COLORS.white} />
          </Pressable>
          <View style={styles.reportOptionModalLiner} />

          <Text style={styles.reportModalHeadingTextItem}>Share via</Text>

          {/*modal option items section*/}
          <View style={styles.reportModalOptionContent}>
            {/*whatsapp option*/}
            <Pressable
              onPress={() => console.log("whatsapp option triggered")}
              style={styles.reportModalOptionContainer}
            >
              {/*image section*/}
              <View style={styles.reportModalOptionIconContainer}>
                <Image
                  source={images.wa}
                  style={styles.reportImageOptionItem}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.reportModalOptionTextContainer}>
                <Text style={styles.reportModalOptionHeaderText}>WhatsApp</Text>
              </View>
            </Pressable>

            {/*facebook option*/}
            <Pressable
              onPress={() => console.log("facebook option triggered")}
              style={styles.reportModalOptionContainer}
            >
              {/*image section*/}
              <View style={styles.reportModalOptionIconContainer}>
                <Image
                  source={images.fb}
                  style={{ maxWidth: 22, height: 20 }}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.reportModalOptionTextContainer}>
                <Text style={styles.reportModalOptionHeaderText}>Facebook</Text>
              </View>
            </Pressable>

            {/*twitter option*/}
            <Pressable
              onPress={() => console.log("twitter option triggered")}
              style={styles.reportModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.reportModalOptionIconContainer}>
                <Image
                  source={images.tw}
                  style={{ maxWidth: 25, height: 25 }}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.reportModalOptionTextContainer}>
                <Text style={styles.reportModalOptionHeaderText}>Twitter</Text>
              </View>
            </Pressable>

            {/*instagram option*/}
            <Pressable
              onPress={() => console.log("instagram option triggered")}
              style={styles.reportModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.reportModalOptionIconContainer}>
                <Image
                  source={images.In}
                  style={styles.reportImageOptionItem}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.reportModalOptionTextContainer}>
                <Text style={styles.reportModalOptionHeaderText}>
                  Instagram
                </Text>
              </View>
            </Pressable>

            {/*linkedin option*/}
            <Pressable
              onPress={() => console.log("linkedin option triggered")}
              style={styles.reportModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.reportModalOptionIconContainer}>
                <Image
                  source={images.linkedin}
                  style={styles.reportImageOptionItem}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.reportModalOptionTextContainer}>
                <Text style={styles.reportModalOptionHeaderText}>LinkedIn</Text>
              </View>
            </Pressable>

            {/*tiktok option*/}
            <Pressable
              onPress={() => console.log("tiktok option triggered")}
              style={styles.reportModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.reportModalOptionIconContainer}>
                <Image
                  source={images.tiktok}
                  style={styles.reportImageOptionItem}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.reportModalOptionTextContainer}>
                <Text style={styles.reportModalOptionHeaderText}>TikTok</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }

  //not interested long pressed function
  const [notInterested, setNotInterested] = useState(false);
  const onLongNotInterestedPress = () => {
    Alert.alert(
      "Please note",
      "You will be remove such opportunity cards in future should you decide to click on this icon. Are you sure you would like to proceed with this action?",
      {
        text: "Close",
        style: "OK",
      }
    );
  };
  const onLongNotInterestedResponsePress = () => {
    Alert.alert(
      "Confirmation",
      "We'll try to show you less of this opportunity type in the future.",
      [
        {
          text: "Accept",
          style: "OK",
          onPress: () => {
            console.log("accept not interested option select");
            setNotInterested(true);
          },
        },
        {
          text: "Close",
          style: "Cancel",
          onPress: () => {
            console.log("decline not interested option select");
            setNotInterested(false);
          },
        },
      ]
    );
  };

  //copy link long pressed function
  const [copiedOpportunityLink, setCopiedOpportunityLink] = useState(false);
  const onLongCopyLinkPress = () => {
    Alert.alert(
      "Please note",
      "You will be given privileges to save the opportunity link and share it with others.",
      {
        text: "Close",
        style: "OK",
      }
    );
  };

  //report long pressed function
  const [renderReportModal, setRenderReportModal] = useState(false);
  const onLongReportPress = () => {
    Alert.alert(
      "Please note",
      "You will be reporting this opportunity post as an anonymous individual.\n\n Did this post harm you in some way?",
      {
        text: "Close",
        style: "OK",
      }
    );
  };

  //report pop-up modal
  function renderReportPopupModal() {
    return (
      <Modal
        transparent={true}
        animationType="slide"
        visible={renderReportModal}
        statusBarTranslucent={true}
        style={styles.reportOptionModalContainer}
      >
        {/*report option modal content*/}
        <ImageBackground
          src={icons.popupBg}
          style={styles.reportOptionModalContent}
        >
          <Pressable onPress={() => setRenderReportModal(false)}>
            <AntDesign name="closecircle" size={20} color={COLORS.white} />
          </Pressable>
          <View style={styles.reportOptionModalLiner} />

          {/*modal option items section*/}
          <View style={styles.reportModalOptionContent}>
            {/*nudity option*/}
            <Pressable
              onPress={nudityOptionPressed}
              style={styles.reportModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.reportModalOptionIconContainer}>
                <FontAwesome name="intersex" size={25} color={COLORS.purple} />
              </View>

              {/*modal option text section*/}
              <View style={styles.reportModalOptionTextContainer}>
                <Text style={styles.reportModalOptionHeaderText}>
                  Nudity or sexual activity
                </Text>
              </View>
            </Pressable>

            {/*hate option*/}
            <Pressable
              onPress={hateOptionPressed}
              style={styles.reportModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.reportModalOptionIconContainer}>
                <MaterialCommunityIcons
                  name="text-to-speech-off"
                  size={25}
                  color={COLORS.purple}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.reportModalOptionTextContainer}>
                <Text style={styles.reportModalOptionHeaderText}>
                  Hate speech or symbols
                </Text>
              </View>
            </Pressable>

            {/*violence option*/}
            <Pressable
              onPress={violenceOptionPressed}
              style={styles.reportModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.reportModalOptionIconContainer}>
                <Ionicons
                  name="warning-sharp"
                  size={25}
                  color={COLORS.purple}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.reportModalOptionTextContainer}>
                <Text style={styles.reportModalOptionHeaderText}>
                  Violent or dangerous organization
                </Text>
              </View>
            </Pressable>

            {/*false option*/}
            <Pressable
              onPress={falseInfoOptionPressed}
              style={styles.reportModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.reportModalOptionIconContainer}>
                <MaterialCommunityIcons
                  name="information-off"
                  size={25}
                  color={COLORS.purple}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.reportModalOptionTextContainer}>
                <Text style={styles.reportModalOptionHeaderText}>
                  False information
                </Text>
              </View>
            </Pressable>

            {/*other option*/}
            <Pressable
              onPress={otherOptionPressed}
              style={styles.reportModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.reportModalOptionIconContainer}>
                <MaterialCommunityIcons
                  name="email"
                  size={25}
                  color={COLORS.purple}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.reportModalOptionTextContainer}>
                <Text style={styles.reportModalOptionHeaderText}>Other</Text>
              </View>
            </Pressable>
          </View>
        </ImageBackground>
      </Modal>
    );
  }

  //nudity option function
  const nudityOptionPressed = () => {
    Alert.alert(
      "Thank you",
      "We are sorry for the experience you faced with this opportunity card. We will be dealing with this matter on our end. You will not see this persons opportunity cards in future.",
      {
        text: "Close",
        style: "OK",
      }
    );
    setRenderReportModal(false);
  };

  //hate option function
  const hateOptionPressed = () => {
    Alert.alert(
      "Thank you",
      "We apologies for the hate speech used by this user. We will be dealing with this matter right away. You will not see this persons opportunity cards in future.",
      {
        text: "Close",
        style: "OK",
      }
    );
    setRenderReportModal(false);
  };

  //violence option function
  const violenceOptionPressed = () => {
    Alert.alert(
      "Thank you",
      "We are sorry for the experience you faced with this opportunity card. We will be dealing with this matter ASAP. You will not see this persons opportunity cards in future.",
      {
        text: "Close",
        style: "OK",
      }
    );
    setRenderReportModal(false);
  };

  //false info option function
  const falseInfoOptionPressed = () => {
    Alert.alert(
      "Thank you",
      "We sincerely apologies for the misinformation shared with you. We will be dealing with this matter ASAP. You will not see this persons opportunity cards in future.",
      {
        text: "Close",
        style: "OK",
      }
    );
    setRenderReportModal(false);
  };

  //other option function
  const otherOptionPressed = () => {
    navigation.navigate("SupportMessageFullViewScreen");
    setRenderReportModal(false);
  };

  {
    /*business icon section*/
  }
  //pin long press function
  const onBusinessLongPinPress = () => {
    Alert.alert(
      "Please note",
      "Should you click on this icon, you will be pinning this opportunity so that you can look at it later on.",
      [
        {
          text: "Hide forever",
          style: "OK",
          onPress: () => {
            console.log("decline not interested option select");
            setBusinessHideForeverPinAlert(true);
          },
        },
        {
          text: "Close",
          style: "OK",
        },
      ]
    );
  };
  const [pinBusinessOpportunity, setPinBusinessOpportunity] = useState(false);
  const [businessHideForeverPinAlert, setBusinessHideForeverPinAlert] =
    useState(false);

  //share long pressed function
  const onBusinessLongSharePress = () => {
    Alert.alert(
      "Please note",
      "You will be able to share this opportunity card with your fellow Reech bubble mates, should you click on this icon.",
      {
        text: "Close",
        style: "OK",
      }
    );
  };
  const [businessRenderShareModal, setBusinessRenderShareModal] =
    useState(false);

  //share pop-up modal
  function renderBusinessSharePopupModal() {
    return (
      <Modal
        transparent={true}
        animationType="slide"
        visible={businessRenderShareModal}
        statusBarTranslucent={true}
        style={styles.reportOptionModalContainer}
      >
        {/*report option modal content*/}
        <View style={styles.shareOptionModalContent}>
          <Pressable onPress={() => setBusinessRenderShareModal(false)}>
            <AntDesign name="closecircle" size={20} color={COLORS.white} />
          </Pressable>

          <View style={styles.reportOptionModalLiner} />

          <Text style={styles.reportModalHeadingTextItem}>Share via</Text>

          {/*modal option items section*/}
          <View style={styles.reportModalOptionContent}>
            {/*whatsapp option*/}
            <Pressable
              onPress={() => console.log("whatsapp option triggered")}
              style={styles.reportModalOptionContainer}
            >
              {/*image section*/}
              <View style={styles.reportModalOptionIconContainer}>
                <Image
                  source={images.wa}
                  style={styles.reportImageOptionItem}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.reportModalOptionTextContainer}>
                <Text style={styles.reportModalOptionHeaderText}>WhatsApp</Text>
              </View>
            </Pressable>

            {/*facebook option*/}
            <Pressable
              onPress={() => console.log("facebook option triggered")}
              style={styles.reportModalOptionContainer}
            >
              {/*image section*/}
              <View style={styles.reportModalOptionIconContainer}>
                <Image
                  source={images.fb}
                  style={{ maxWidth: 22, height: 20 }}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.reportModalOptionTextContainer}>
                <Text style={styles.reportModalOptionHeaderText}>Facebook</Text>
              </View>
            </Pressable>

            {/*twitter option*/}
            <Pressable
              onPress={() => console.log("twitter option triggered")}
              style={styles.reportModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.reportModalOptionIconContainer}>
                <Image source={images.tw} style={{ width: 25, height: 25 }} />
              </View>

              {/*modal option text section*/}
              <View style={styles.reportModalOptionTextContainer}>
                <Text style={styles.reportModalOptionHeaderText}>Twitter</Text>
              </View>
            </Pressable>

            {/*instagram option*/}
            <Pressable
              onPress={() => console.log("instagram option triggered")}
              style={styles.reportModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.reportModalOptionIconContainer}>
                <Image
                  source={images.In}
                  style={styles.reportImageOptionItem}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.reportModalOptionTextContainer}>
                <Text style={styles.reportModalOptionHeaderText}>
                  Instagram
                </Text>
              </View>
            </Pressable>

            {/*linkedin option*/}
            <Pressable
              onPress={() => console.log("linkedin option triggered")}
              style={styles.reportModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.reportModalOptionIconContainer}>
                <Image
                  source={images.linkedin}
                  style={styles.reportImageOptionItem}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.reportModalOptionTextContainer}>
                <Text style={styles.reportModalOptionHeaderText}>LinkedIn</Text>
              </View>
            </Pressable>

            {/*tiktok option*/}
            <Pressable
              onPress={() => console.log("tiktok option triggered")}
              style={styles.reportModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.reportModalOptionIconContainer}>
                <Image
                  source={images.tiktok}
                  style={styles.reportImageOptionItem}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.reportModalOptionTextContainer}>
                <Text style={styles.reportModalOptionHeaderText}>TikTok</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }

  //not interested long pressed function
  const [businessNotInterested, setBusinessNotInterested] = useState(false);
  const onBusinessLongNotInterestedPress = () => {
    Alert.alert(
      "Please note",
      "You will be remove such opportunity cards in future should you decide to click on this icon. Are you sure you would like to proceed with this action?",
      {
        text: "Close",
        style: "OK",
      }
    );
  };
  const onBusinessLongNotInterestedResponsePress = () => {
    Alert.alert(
      "Confirmation",
      "We'll try to show you less of this opportunity type in the future.",
      [
        {
          text: "Accept",
          style: "OK",
          onPress: () => {
            console.log("accept not interested option select");
            setBusinessNotInterested(true);
          },
        },
        {
          text: "Close",
          style: "Cancel",
          onPress: () => {
            console.log("decline not interested option select");
            setBusinessNotInterested(false);
          },
        },
      ]
    );
  };

  //copy link long pressed function
  const [copiedBusinessOpportunityLink, setCopiedBusinessOpportunityLink] =
    useState(false);
  const onBusinessLongCopyLinkPress = () => {
    Alert.alert(
      "Please note",
      "You will be given privileges to save the opportunity link and share it with others.",
      {
        text: "Close",
        style: "OK",
      }
    );
  };

  //report long pressed function
  const [renderBusinessReportModal, setRenderBusinessReportModal] =
    useState(false);
  const onBusinessLongReportPress = () => {
    Alert.alert(
      "Please note",
      "You will be reporting this opportunity post as an anonymous individual.\n\n Did this post harm you in some way?",
      {
        text: "Close",
        style: "OK",
      }
    );
  };

  //report pop-up modal
  function renderBusinessReportPopupModal() {
    return (
      <Modal
        transparent={true}
        animationType="slide"
        visible={renderBusinessReportModal}
        statusBarTranslucent={true}
        style={styles.reportOptionModalContainer}
      >
        {/*report option modal content*/}
        <View style={styles.reportOptionModalContent}>
          <Pressable onPress={() => setRenderBusinessReportModal(false)}>
            <AntDesign name="closecircle" size={20} color={COLORS.white} />
          </Pressable>
          <View style={styles.reportOptionModalLiner} />

          {/*modal option items section*/}
          <View style={styles.reportModalOptionContent}>
            {/*nudity option*/}
            <Pressable
              onPress={nudityBusinessOptionPressed}
              style={styles.reportModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.reportModalOptionIconContainer}>
                <FontAwesome name="intersex" size={25} color={COLORS.purple} />
              </View>

              {/*modal option text section*/}
              <View style={styles.reportModalOptionTextContainer}>
                <Text style={styles.reportModalOptionHeaderText}>
                  Nudity or sexual activity
                </Text>
              </View>
            </Pressable>

            {/*hate option*/}
            <Pressable
              onPress={hateBusinessOptionPressed}
              style={styles.reportModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.reportModalOptionIconContainer}>
                <MaterialCommunityIcons
                  name="text-to-speech-off"
                  size={25}
                  color={COLORS.purple}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.reportModalOptionTextContainer}>
                <Text style={styles.reportModalOptionHeaderText}>
                  Hate speech or symbols
                </Text>
              </View>
            </Pressable>

            {/*violence option*/}
            <Pressable
              onPress={violenceBusinessOptionPressed}
              style={styles.reportModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.reportModalOptionIconContainer}>
                <Ionicons
                  name="warning-sharp"
                  size={25}
                  color={COLORS.purple}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.reportModalOptionTextContainer}>
                <Text style={styles.reportModalOptionHeaderText}>
                  Violent or dangerous organization
                </Text>
              </View>
            </Pressable>

            {/*false option*/}
            <Pressable
              onPress={falseInfoBusinessOptionPressed}
              style={styles.reportModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.reportModalOptionIconContainer}>
                <MaterialCommunityIcons
                  name="information-off"
                  size={25}
                  color={COLORS.purple}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.reportModalOptionTextContainer}>
                <Text style={styles.reportModalOptionHeaderText}>
                  False information
                </Text>
              </View>
            </Pressable>

            {/*other option*/}
            <Pressable
              onPress={otherBusinessOptionPressed}
              style={styles.reportModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.reportModalOptionIconContainer}>
                <MaterialCommunityIcons
                  name="email"
                  size={25}
                  color={COLORS.purple}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.reportModalOptionTextContainer}>
                <Text style={styles.reportModalOptionHeaderText}>Other</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }

  //nudity option function
  const nudityBusinessOptionPressed = () => {
    Alert.alert(
      "Thank you",
      "We are sorry for the experience you faced with this opportunity card. We will be dealing with this matter on our end. You will not see this persons opportunity cards in future.",
      {
        text: "Close",
        style: "OK",
      }
    );
    setRenderBusinessReportModal(false);
  };

  //hate option function
  const hateBusinessOptionPressed = () => {
    Alert.alert(
      "Thank you",
      "We apologies for the hate speech used by this user. We will be dealing with this matter right away. You will not see this persons opportunity cards in future.",
      {
        text: "Close",
        style: "OK",
      }
    );
    setRenderBusinessReportModal(false);
  };

  //violence option function
  const violenceBusinessOptionPressed = () => {
    Alert.alert(
      "Thank you",
      "We are sorry for the experience you faced with this opportunity card. We will be dealing with this matter ASAP. You will not see this persons opportunity cards in future.",
      {
        text: "Close",
        style: "OK",
      }
    );
    setRenderBusinessReportModal(false);
  };

  //false info option function
  const falseInfoBusinessOptionPressed = () => {
    Alert.alert(
      "Thank you",
      "We sincerely apologies for the misinformation shared with you. We will be dealing with this matter ASAP. You will not see this persons opportunity cards in future.",
      {
        text: "Close",
        style: "OK",
      }
    );
    setRenderBusinessReportModal(false);
  };

  //other option function
  const otherBusinessOptionPressed = () => {
    navigation.navigate("SupportMessageFullViewScreen");
    setRenderBusinessReportModal(false);
  };

  //animated menu icon function
  const [pinIconItemSection] = useState(new Animated.Value(0));
  const [shareIconItemSection] = useState(new Animated.Value(0));
  const [notInterestedIconItemSection] = useState(new Animated.Value(0));
  const [copyLinkIconItemSection] = useState(new Animated.Value(0));
  const [reportIconItemSection] = useState(new Animated.Value(0));

  const [popVideoIcon, setPopVideoIcons] = useState(false);

  //animate in video icons
  const popInVideoIcons = () => {
    setPopVideoIcons(true);

    Animated.timing(pinIconItemSection, {
      toValue: 138,
      duration: 500,
      useNativeDriver: false,
    }).start();

    Animated.timing(shareIconItemSection, {
      toValue: 150,
      duration: 500,
      useNativeDriver: false,
    }).start();

    Animated.timing(notInterestedIconItemSection, {
      toValue: 110,
      duration: 500,
      useNativeDriver: false,
    }).start();

    Animated.timing(copyLinkIconItemSection, {
      toValue: 55,
      duration: 500,
      useNativeDriver: false,
    }).start();

    Animated.timing(reportIconItemSection, {
      toValue: 35,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  //animate out video icons
  const popOutVideoIcons = () => {
    setPopVideoIcons(false);

    Animated.timing(pinIconItemSection, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();

    Animated.timing(shareIconItemSection, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();

    Animated.timing(notInterestedIconItemSection, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();

    Animated.timing(copyLinkIconItemSection, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();

    Animated.timing(reportIconItemSection, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  {
    /*business video icon section*/
  }
  //pin business video long press function
  const onBusinessVideoLongPinPress = () => {
    Alert.alert(
      "Please note",
      "Should you click on this icon, you will be pinning this opportunity so that you can look at it later on.",
      [
        {
          text: "Hide forever",
          style: "OK",
          onPress: () => {
            console.log("decline not interested option select");
            setBusinessVideoHideForeverPinAlert(true);
          },
        },
        {
          text: "Close",
          style: "OK",
        },
      ]
    );
  };
  const [pinBusinessVideoOpportunity, setPinBusinessVideoOpportunity] =
    useState(false);
  const [
    businessVideoHideForeverPinAlert,
    setBusinessVideoHideForeverPinAlert,
  ] = useState(false);

  //share business video long pressed function
  const onBusinessVideoLongSharePress = () => {
    Alert.alert(
      "Please note",
      "You will be able to share this opportunity card with your fellow Reech bubble mates, should you click on this icon.",
      {
        text: "Close",
        style: "OK",
      }
    );
  };
  const [businessVideoRenderShareModal, setBusinessVideoRenderShareModal] =
    useState(false);

  //share business video pop-up modal
  function renderBusinessVideoSharePopupModal() {
    return (
      <Modal
        transparent={true}
        animationType="slide"
        visible={businessVideoRenderShareModal}
        statusBarTranslucent={true}
        style={styles.reportOptionModalContainer}
      >
        {/*report option modal content*/}
        <View style={styles.shareOptionModalContent}>
          <Pressable onPress={() => setBusinessVideoRenderShareModal(false)}>
            <AntDesign name="closecircle" size={20} color={COLORS.white} />
          </Pressable>

          <View style={styles.reportOptionModalLiner} />

          <Text style={styles.reportModalHeadingTextItem}>Share via</Text>

          {/*modal option items section*/}
          <View style={styles.reportModalOptionContent}>
            {/*whatsapp option*/}
            <Pressable
              onPress={() => console.log("whatsapp option triggered")}
              style={styles.reportModalOptionContainer}
            >
              {/*image section*/}
              <View style={styles.reportModalOptionIconContainer}>
                <Image
                  source={images.wa}
                  style={styles.reportImageOptionItem}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.reportModalOptionTextContainer}>
                <Text style={styles.reportModalOptionHeaderText}>WhatsApp</Text>
              </View>
            </Pressable>

            {/*facebook option*/}
            <Pressable
              onPress={() => console.log("facebook option triggered")}
              style={styles.reportModalOptionContainer}
            >
              {/*image section*/}
              <View style={styles.reportModalOptionIconContainer}>
                <Image
                  source={images.fb}
                  style={{ maxWidth: 22, height: 20 }}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.reportModalOptionTextContainer}>
                <Text style={styles.reportModalOptionHeaderText}>Facebook</Text>
              </View>
            </Pressable>

            {/*twitter option*/}
            <Pressable
              onPress={() => console.log("twitter option triggered")}
              style={styles.reportModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.reportModalOptionIconContainer}>
                <Image source={images.tw} style={{ width: 25, height: 25 }} />
              </View>

              {/*modal option text section*/}
              <View style={styles.reportModalOptionTextContainer}>
                <Text style={styles.reportModalOptionHeaderText}>Twitter</Text>
              </View>
            </Pressable>

            {/*instagram option*/}
            <Pressable
              onPress={() => console.log("instagram option triggered")}
              style={styles.reportModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.reportModalOptionIconContainer}>
                <Image
                  source={images.In}
                  style={styles.reportImageOptionItem}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.reportModalOptionTextContainer}>
                <Text style={styles.reportModalOptionHeaderText}>
                  Instagram
                </Text>
              </View>
            </Pressable>

            {/*linkedin option*/}
            <Pressable
              onPress={() => console.log("linkedin option triggered")}
              style={styles.reportModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.reportModalOptionIconContainer}>
                <Image
                  source={images.linkedin}
                  style={styles.reportImageOptionItem}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.reportModalOptionTextContainer}>
                <Text style={styles.reportModalOptionHeaderText}>LinkedIn</Text>
              </View>
            </Pressable>

            {/*tiktok option*/}
            <Pressable
              onPress={() => console.log("tiktok option triggered")}
              style={styles.reportModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.reportModalOptionIconContainer}>
                <Image
                  source={images.tiktok}
                  style={styles.reportImageOptionItem}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.reportModalOptionTextContainer}>
                <Text style={styles.reportModalOptionHeaderText}>TikTok</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }

  //not interested business video long pressed function
  const [businessVideoNotInterested, setBusinessVideoNotInterested] =
    useState(false);
  const onBusinessVideoLongNotInterestedPress = () => {
    Alert.alert(
      "Please note",
      "You will be remove such opportunity cards in future should you decide to click on this icon. Are you sure you would like to proceed with this action?",
      {
        text: "Close",
        style: "OK",
      }
    );
  };
  const onBusinessVideoLongNotInterestedResponsePress = () => {
    Alert.alert(
      "Confirmation",
      "We'll try to show you less of this opportunity type in the future.",
      [
        {
          text: "Accept",
          style: "OK",
          onPress: () => {
            console.log("accept not interested option select");
            setBusinessVideoNotInterested(true);
          },
        },
        {
          text: "Close",
          style: "Cancel",
          onPress: () => {
            console.log("decline not interested option select");
            setBusinessVideoNotInterested(false);
          },
        },
      ]
    );
  };

  //copy link business video long pressed function
  const [
    copiedBusinessVideoOpportunityLink,
    setCopiedBusinessVideoOpportunityLink,
  ] = useState(false);
  const onBusinessVideoLongCopyLinkPress = () => {
    Alert.alert(
      "Please note",
      "You will be given privileges to save the opportunity link and share it with others.",
      {
        text: "Close",
        style: "OK",
      }
    );
  };

  //report business video long pressed function
  const [renderBusinessVideoReportModal, setRenderBusinessVideoReportModal] =
    useState(false);
  const onBusinessVideoLongReportPress = () => {
    Alert.alert(
      "Please note",
      "You will be reporting this opportunity post as an anonymous individual.\n\n Did this post harm you in some way?",
      {
        text: "Close",
        style: "OK",
      }
    );
  };

  //report pop-up modal
  function renderBusinessVideoReportPopupModal() {
    return (
      <Modal
        transparent={true}
        animationType="slide"
        visible={renderBusinessVideoReportModal}
        statusBarTranslucent={true}
        style={styles.reportOptionModalContainer}
      >
        {/*report option modal content*/}
        <ImageBackground
          src={icons.popupBg}
          style={styles.reportOptionModalContent}
        >
          <Pressable onPress={() => setRenderBusinessVideoReportModal(false)}>
            <AntDesign name="closecircle" size={20} color={COLORS.white} />
          </Pressable>
          <View style={styles.reportOptionModalLiner} />

          {/*modal option items section*/}
          <View style={styles.reportModalOptionContent}>
            {/*nudity option*/}
            <Pressable
              onPress={nudityBusinessVideoOptionPressed}
              style={styles.reportModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.reportModalOptionIconContainer}>
                <FontAwesome name="intersex" size={25} color={COLORS.purple} />
              </View>

              {/*modal option text section*/}
              <View style={styles.reportModalOptionTextContainer}>
                <Text style={styles.reportModalOptionHeaderText}>
                  Nudity or sexual activity
                </Text>
              </View>
            </Pressable>

            {/*hate option*/}
            <Pressable
              onPress={hateBusinessVideoOptionPressed}
              style={styles.reportModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.reportModalOptionIconContainer}>
                <MaterialCommunityIcons
                  name="text-to-speech-off"
                  size={25}
                  color={COLORS.purple}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.reportModalOptionTextContainer}>
                <Text style={styles.reportModalOptionHeaderText}>
                  Hate speech or symbols
                </Text>
              </View>
            </Pressable>

            {/*violence option*/}
            <Pressable
              onPress={violenceBusinessVideoOptionPressed}
              style={styles.reportModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.reportModalOptionIconContainer}>
                <Ionicons
                  name="warning-sharp"
                  size={25}
                  color={COLORS.purple}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.reportModalOptionTextContainer}>
                <Text style={styles.reportModalOptionHeaderText}>
                  Violent or dangerous organization
                </Text>
              </View>
            </Pressable>

            {/*false option*/}
            <Pressable
              onPress={falseInfoBusinessVideoOptionPressed}
              style={styles.reportModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.reportModalOptionIconContainer}>
                <MaterialCommunityIcons
                  name="information-off"
                  size={25}
                  color={COLORS.purple}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.reportModalOptionTextContainer}>
                <Text style={styles.reportModalOptionHeaderText}>
                  False information
                </Text>
              </View>
            </Pressable>

            {/*other option*/}
            <Pressable
              onPress={otherBusinessVideoOptionPressed}
              style={styles.reportModalOptionContainer}
            >
              {/*icon section*/}
              <View style={styles.reportModalOptionIconContainer}>
                <MaterialCommunityIcons
                  name="email"
                  size={25}
                  color={COLORS.purple}
                />
              </View>

              {/*modal option text section*/}
              <View style={styles.reportModalOptionTextContainer}>
                <Text style={styles.reportModalOptionHeaderText}>Other</Text>
              </View>
            </Pressable>
          </View>
        </ImageBackground>
      </Modal>
    );
  }

  //nudity option function
  const nudityBusinessVideoOptionPressed = () => {
    Alert.alert(
      "Thank you",
      "We are sorry for the experience you faced with this opportunity card. We will be dealing with this matter on our end. You will not see this persons opportunity cards in future.",
      {
        text: "Close",
        style: "OK",
      }
    );
    setRenderBusinessVideoReportModal(false);
  };

  //hate option function
  const hateBusinessVideoOptionPressed = () => {
    Alert.alert(
      "Thank you",
      "We apologies for the hate speech used by this user. We will be dealing with this matter right away. You will not see this persons opportunity cards in future.",
      {
        text: "Close",
        style: "OK",
      }
    );
    setRenderBusinessVideoReportModal(false);
  };

  //violence option function
  const violenceBusinessVideoOptionPressed = () => {
    Alert.alert(
      "Thank you",
      "We are sorry for the experience you faced with this opportunity card. We will be dealing with this matter ASAP. You will not see this persons opportunity cards in future.",
      {
        text: "Close",
        style: "OK",
      }
    );
    setRenderBusinessVideoReportModal(false);
  };

  //false info option function
  const falseInfoBusinessVideoOptionPressed = () => {
    Alert.alert(
      "Thank you",
      "We sincerely apologies for the misinformation shared with you. We will be dealing with this matter ASAP. You will not see this persons opportunity cards in future.",
      {
        text: "Close",
        style: "OK",
      }
    );
    setRenderBusinessVideoReportModal(false);
  };

  //other option function
  const otherBusinessVideoOptionPressed = () => {
    navigation.navigate("SupportMessageFullViewScreen");
    setRenderBusinessVideoReportModal(false);
  };

  //money separator function
  function formatMoney(n) {
    //add space between values
    return (Math.round(n * 100) / 100)
      .toLocaleString("en-US")
      .replace(",", " ");
  }

  //map images
  const imageMap = [
    {
      id: 1,
      imageUrl: images.Simphiwe,
    },
    {
      id: 2,
      imageUrl: images.Bronwin,
    },
    {
      id: 3,
      imageUrl: images.Pm,
    },
    {
      id: 4,
      imageUrl: images.Simphiwe,
    },
    {
      id: 5,
      imageUrl: images.Bronwin,
    },
    {
      id: 6,
      imageUrl: images.Pm,
    },
    {
      id: 7,
      imageUrl: images.Simphiwe,
    },
    {
      id: 8,
      imageUrl: images.Bronwin,
    },
    {
      id: 9,
      imageUrl: images.Pm,
    },
  ];
  const individualImageCollection = imageMap;

  const imagesMap = [
    {
      id: 1,
      imageUrl: images.sup7,
    },
    {
      id: 2,
      imageUrl: images.sup2,
    },
    {
      id: 3,
      imageUrl: images.sup10,
    },
  ];
  const businessImageCollection = imagesMap;

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <NavHeader message="What would you like to do?" />
      </View>
    );
  }

  // verified - business
  const verifiedModal = (moreModVer, item) => (
    <Modal
      visible={moreModVer}
      statusBarTranslucent={true}
      animationType="slide"
      transparent={false}
      style={styles.modalMoreContainer}
    >
      <View style={styles.innerMoreModalContainer}>
        {/*opp top action section*/}
        <View style={styles.innerMoreModalHeader}>
          <Pressable
            onPress={() => {
              SetIndividualFileAttachmentURI("");
              SetIndividualFileAttachmentName("");
              SetIndividualFileAttachmentSize("");
              SetIndividualFileAttachmentType("");
              setValue("personalNote", "");

              setModalVer(false);
              setItemInfoVer(null);
            }}
          >
            <AntDesign name="closecircle" size={25} color={COLORS.white} />
          </Pressable>
        </View>

        <View style={styles.cardInfoContainer}>
          {/*opp image section*/}
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri:
                  image[item.adImage] ?? images?.[item.adImage] ?? item.adImage,
              }}
              style={styles.imageItem}
            />
          </View>

          {/*opp gradient info section*/}
          <View style={styles.oppDescriptionContainer}>
            <LinearGradient
              colors={["transparent", COLORS.teal, "transparent"]}
              start={{
                x: 1.0,
                y: 0.0,
              }}
              end={{
                x: 0.0,
                y: 2.0,
              }}
              style={styles.descriptionContent}
            >
              <Text style={styles.oppUsername}>{item.jobTitle}</Text>
              <Text style={styles.address}>{item.adLocation}</Text>
              <Text style={styles.oppJobName}></Text>
            </LinearGradient>
          </View>

          {/*opp detail section*/}
          <ScrollView
            style={styles.oppDescriptionScrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/*opp overview section*/}
            <View style={styles.cardInfoContent}>
              {/*opp overview top section*/}
              <View style={styles.cardInfoItems}>
                <Text style={styles.cardHeading}>
                  Overview {"\n"}
                  {/*rate item*/}
                  <Text style={styles.cardInfoText}>{"\n"}Rate: </Text>
                  <Text style={styles.cardInfoTextItem}>
                    {[
                      "Collaborator",
                      "Mentor",
                      "Volunteer",
                      undefined,
                    ].includes(item.rate)
                      ? ""
                      : `${item.rateCurrency}`.split("|")[1]}
                    {`${formatMoney(item.rate)} ${item.adExtra.toLowerCase() ?? ""
                      }`.trim()}
                  </Text>
                  {/*experience item*/}
                  <Text style={styles.cardInfoText}>{"\n"}Experience: </Text>
                  <Text style={styles.cardInfoTextItem}>
                    {item.experience === 0
                      ? "Not required"
                      : item.experience === 1
                        ? item.experience + " year"
                        : item.experience > 1
                          ? item.experience + " years"
                          : "Not required"}
                  </Text>
                  {/*education item*/}
                  <Text style={styles.cardInfoText}>{"\n"}Education: </Text>
                  <Text style={styles.cardInfoTextItem}>
                    {item.educationLevel}
                  </Text>
                  {/*start date item*/}
                  <Text style={styles.cardInfoText}>{"\n"}Start date: </Text>
                  <Text style={styles.cardInfoTextItem}>
                    {moment(item.duration.selectedStartDate).format(
                      "Do MMMM YYYY"
                    )}{" "}
                    - {moment(item.duration.selectedStartDate).format("dddd")}
                  </Text>
                  {/*end date item*/}
                  <Text style={styles.cardInfoTextDark}>
                    {"\n"}This opportunity{" "}
                    {oppExpired(item.duration.selectedEndDate)
                      ? "ends"
                      : "ended"}{" "}
                  </Text>
                  <Text style={styles.cardInfoTextItemDark}>
                    {moment(item.duration.selectedEndDate)
                      .endOf("day")
                      .fromNow()}{" "}
                  </Text>
                </Text>
              </View>
            </View>

            {/*opp requirements section*/}
            <View style={styles.cardInfoContentDescription}>
              <View style={styles.cardInfoContext}>
                <Text style={styles.cardHeading}>Description:</Text>
              </View>
              <View style={styles.cardInfoTextItemsContainer}>
                <Text style={styles.cardInfoText}>Who am I?</Text>
                <Text style={styles.cardInfoTextItems}>
                  {item.adDescription}
                </Text>
              </View>

              <View style={styles.cardInfoTextItemsContainer}>
                <Text style={styles.cardInfoText}>Where do you fit in?</Text>
                <Text style={styles.cardInfoTextItems}>
                  {/* {item.oppDescriptionSkill} */}
                </Text>
              </View>

              <View style={styles.cardInfoTextItemsContainer}>
                <Text style={styles.cardInfoText}>
                  What will help you succeed (requirements)?
                </Text>
                <Text style={styles.cardInfoTextItems}>
                  {/* {item.oppDescriptionRequirements} */}
                </Text>
              </View>
            </View>

            {/*bottom personalisation action*/}
            {personalNoteVerifiedTrigger && (
              <>
                <View style={styles.personalNoteContainer}>
                  <ImageBackground
                    source={images.userFrame}
                    style={styles.personalNoteIconContainer}
                  >
                    <Image
                      source={
                        user?.profileImage
                          ? {
                            uri:
                              image[user?.profileImage] ?? user?.profileImage,
                          }
                          : images.defaultRounded
                      }
                      style={styles.personalNoteIcon}
                      resizeMode={"cover"}
                    />
                  </ImageBackground>

                  {/*im interested section*/}
                  <Text style={styles.personNoteHeading}>
                    {`I'm interested because...`}
                  </Text>

                  {/*textarea section*/}
                  <CustomInputTextAreaNote
                    name="personalNoteVerified"
                    control={control}
                    rules={{
                      required: "Please enter a text before submitting!",
                      pattern: {
                        value: /^[a-zA-Z]+$/,
                        message:
                          "Your entry cannot contain numbers or special characters",
                      },
                    }}
                    placeholder="Write personal note here"
                  />

                  {/*file and emoji attachment section*/}
                  <View style={styles.iconContainer}>
                    {/*emoji icon section*/}
                    <FontAwesome5
                      onPress={() => [
                        console.log("emoji icon clicked"),
                        // setEmojiVerifiedTrigger(!emojiVerifiedTrigger),
                      ]}
                      name=""
                      size={24}
                      color={COLORS.purple}
                    />

                    {/*clip icon section*/}
                    <Entypo
                      onPress={fileAttachmentItemTriggerBusiness}
                      name="attachment"
                      size={24}
                      color={COLORS.purple}
                      style={{ bottom: 25 }}
                    />
                  </View>
                </View>

                {/*emoji trigger section*/}
                {emojiVerifiedTrigger ? (
                  <View
                    style={[
                      styles.emojiContainer,
                      {
                        marginTop: emojiVerifiedTrigger ? 10 : 0,
                        height: emojiVerifiedTrigger ? 200 : 0,
                      },
                    ]}
                  >
                    <EmojiPicker />
                  </View>
                ) : null}

                {/*emoji result content*/}
                {BusinessFileAttachmentName ? (
                  <View style={styles.clipIconInfoContainer}>
                    {/*attachment header section*/}
                    <View style={styles.attachmentHeaderContainer}>
                      <Text style={styles.attachmentHeader}>
                        <Ionicons
                          name="document-attach"
                          size={18}
                          color={COLORS.white}
                        />
                        {"  "}
                        Your file attachments
                      </Text>
                    </View>

                    {/*attachment info section*/}
                    <View style={styles.clipIconResultContent}>
                      {/*attachment type item*/}
                      <View style={styles.attachContentItems}>
                        <Text style={styles.attachmentIdentifierText}>
                          Image:{" "}
                        </Text>
                        <Image
                          source={
                            BusinessFileAttachmentType ===
                              "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                              BusinessFileAttachmentType === "application/msword"
                              ? images.word
                              : BusinessFileAttachmentType ===
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                ? images.excel
                                : BusinessFileAttachmentType === "application/pdf"
                                  ? images.pdf
                                  : BusinessFileAttachmentType ===
                                    "application/vnd.ms-powerpoint" ||
                                    BusinessFileAttachmentType ===
                                    "application/vnd.openxmlformats-officedocument.presentationml.presentation"
                                    ? images.ppt
                                    : IndividualFileAttachmentType === "video/mp4" ||
                                      IndividualFileAttachmentType === "video/mpeg"
                                      ? images.video
                                      : { uri: BusinessFileAttachmentURI }
                          }
                          style={styles.clipImageResultItem}
                        />
                      </View>

                      {/*file name item*/}
                      <View style={styles.attachContentItems}>
                        <Text style={styles.attachmentIdentifierText}>
                          Filename:{" "}
                        </Text>
                        <Text style={styles.fileAttachmentNameItem}>
                          {BusinessFileAttachmentName}
                        </Text>
                      </View>

                      {/*file size item*/}
                      <View style={styles.attachContentItems}>
                        <Text style={styles.attachmentIdentifierText}>
                          File size:{" "}
                        </Text>
                        <Text style={styles.fileAttachmentNameItem}>
                          {BusinessFileAttachmentSize > 1000
                            ? (BusinessFileAttachmentSize / 1000).toFixed(1) +
                            " MB"
                            : BusinessFileAttachmentSize + " KB"}
                        </Text>
                      </View>

                      {/*file type item*/}
                      <View style={styles.attachContentItems}>
                        <Text style={styles.attachmentIdentifierText}>
                          File type:{" "}
                        </Text>
                        <Text style={styles.fileAttachmentNameItem}>
                          {BusinessFileAttachmentType}
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : null}
              </>
            )}
          </ScrollView>

          {/*bottom button action*/}
          {personalNoteVerifiedTrigger == false ? (
            <View style={styles.bottom}>
              <Pressable
                onPress={() =>
                  setPersonalNoteVerifiedTrigger(!personalNoteVerifiedTrigger)
                }
                style={styles.buttonContainer2}
              >
                <Image
                  source={icons.reechButton}
                  style={{
                    alignSelf: "center",
                    marginBottom: 10,
                    height: 50,
                    width: 250,
                  }}
                />
              </Pressable>
              <Text style={styles.buttonText2}>Click here to apply</Text>
            </View>
          ) : (
            <View style={styles.bottom}>
              <Pressable
                onPress={() => {
                  handleSubmit(respondButtonClicked({ item }));
                }}
                style={styles.buttonContainer2}
              >
                <Image
                  source={icons.reechButton}
                  style={{
                    alignSelf: "center",
                    marginBottom: 10,
                    height: 50,
                    width: 250,
                  }}
                />
              </Pressable>
              <Text style={styles.buttonText2}>Click here to respond</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  //not verified - users
  const notVerifiedModal = (moreMod, item) => (
    <Modal
      visible={moreMod}
      statusBarTranslucent={true}
      animationType="slide"
      transparent={false}
      style={styles.modalMoreContainer}
    >
      <View style={styles.innerMoreModalContainer}>
        {/*opp top action section*/}
        <View style={styles.innerMoreModalHeader}>
          <Pressable
            onPress={() => {
              SetIndividualFileAttachmentURI("");
              SetIndividualFileAttachmentName("");
              SetIndividualFileAttachmentSize("");
              SetIndividualFileAttachmentType("");
              setValue("personalNote", "");

              setModal(false);
              setItemInfo(null);
            }}
          >
            <AntDesign name="closecircle" size={18} color={COLORS.white} />
          </Pressable>
        </View>

        <View style={styles.cardInfoContainer}>
          {/*opp image section*/}
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri:
                  image[item.oppImage] ??
                  images?.[item.oppImage] ??
                  item.oppImage,
              }}
              style={styles.imageItem}
            />
          </View>

          {/*opp gradient info section*/}
          <View style={styles.oppDescriptionContainer}>
            <LinearGradient
              colors={[COLORS.purple, COLORS.transparent, COLORS.purple]}
              start={{ x: 1.0, y: 0.0 }}
              end={{ x: 0.0, y: 2.0 }}
              style={styles.descriptionNotVerifiedContent}
            >
              <Text style={styles.oppUsername}>{item.jobTitle}</Text>
              <Text style={styles.address}>{item.address}</Text>
              <Text style={styles.oppJobName}></Text>
            </LinearGradient>
          </View>

          {/*opp detail section*/}
          <ScrollView
            style={styles.oppDescriptionScrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="interactive"
          >
            {/*opp overview section*/}
            <View style={styles.cardInfoContent}>
              {/*opp overview top section*/}
              <View style={styles.cardInfoItems}>
                <Text style={styles.cardHeading}>
                  Overview {"\n"}
                  {/*rate item*/}
                  <Text style={styles.cardInfoText}>{"\n"}Rate: </Text>
                  <Text style={styles.cardInfoTextItem}>
                    {[
                      "Collaborator",
                      "Mentor",
                      "Volunteer",
                      undefined,
                    ].includes(item.rateFrequency)
                      ? ""
                      : `${item.rateCurrency}`.split("|")[1]}
                    {`${formatMoney(item.rate) ?? ""} ${item.rateFrequency?.toLowerCase() ?? ""
                      }`.trim()}
                  </Text>
                  {/*experience item*/}
                  <Text style={styles.cardInfoText}>{"\n"}Experience: </Text>
                  <Text style={styles.cardInfoTextItem}>
                    {item.experience === 0
                      ? "Not required"
                      : item.experience === 1
                        ? item.experience + " year"
                        : item.experience > 1
                          ? item.experience + " years"
                          : "Not required"}
                  </Text>
                  {/*education item*/}
                  <Text style={styles.cardInfoText}>{"\n"}Education: </Text>
                  <Text style={styles.cardInfoTextItem}>
                    {item.educationLevel}
                  </Text>
                  {/*start data item*/}
                  <Text style={styles.cardInfoText}>{"\n"}Start date: </Text>
                  <Text style={styles.cardInfoTextItem}>
                    {moment(item.duration.selectedStartDate).format(
                      "Do MMMM YYYY"
                    )}{" "}
                    - {moment(item.duration.selectedStartDate).format("dddd")}
                  </Text>
                  {/*end date item*/}
                  <Text style={styles.cardInfoTextDark}>
                    {"\n"}This opportunity{" "}
                    {oppExpired(item.duration.selectedEndDate)
                      ? "ended"
                      : "ends"}{" "}
                  </Text>
                  <Text style={styles.cardInfoTextItemDark}>
                    {moment(item.duration.selectedEndDate)
                      .endOf("day")
                      .fromNow()}
                  </Text>
                </Text>
              </View>
            </View>

            {/*opp requirements section*/}
            <View style={styles.cardInfoContentDescription}>
              <View style={styles.cardInfoContext}>
                <Text style={styles.cardHeading}>Description:</Text>
              </View>
              <View style={styles.cardInfoTextItemsContainer}>
                <Text style={styles.cardInfoText}>Who am I?</Text>
                <Text style={styles.cardInfoTextItems}>
                  {item?.description?.whoIam}
                </Text>
              </View>

              <View style={styles.cardInfoTextItemsContainer}>
                <Text style={styles.cardInfoText}>Where do you fit in?</Text>
                <Text style={styles.cardInfoTextItems}>
                  {item?.description?.whereFitIn}
                </Text>
              </View>

              <View style={styles.cardInfoTextItemsContainer}>
                <Text style={styles.cardInfoText}>
                  What will help you succeed (requirements)?
                </Text>
                <Text style={styles.cardInfoTextItems}>
                  {item?.description?.helpYouSucceed}
                </Text>
              </View>
            </View>

            {/*bottom personalisation action*/}
            {personalNoteTrigger && (
              <>
                <View
                  style={[
                    styles.personalNoteContainer,
                    {
                      marginBottom: IndividualFileAttachmentName
                        ? 0
                        : Platform.OS === "ios"
                          ? 150
                          : 113,
                    },
                  ]}
                >
                  {/*user account picture section*/}
                  <ImageBackground
                    source={images.userFrame}
                    style={styles.personalNoteIconContainer}
                  >
                    <Image
                      source={
                        user?.profileImage
                          ? {
                            uri:
                              image[user?.profileImage] ?? user?.profileImage,
                          }
                          : images.defaultRounded
                      }
                      style={styles.personalNoteIcon}
                      resizeMode={"cover"}
                    />
                  </ImageBackground>

                  {/*im interested section*/}
                  <Text style={styles.personNoteHeading}>
                    {`I'm interested because...`}
                  </Text>

                  {/*textarea section*/}
                  <CustomInputTextAreaNote
                    name="personalNote"
                    control={control}
                    rules={{
                      required: "Please enter a text before submitting!",
                      pattern: {
                        value: /^[a-zA-Z]+$/,
                        message:
                          "Your entry cannot contain numbers or special characters",
                      },
                    }}
                    placeholder="Write personal note here"
                  />

                  {/*file and emoji attachment section*/}
                  <View style={styles.iconContainer}>
                    {/*emoji icon section*/}
                    <FontAwesome5
                      onPress={() => [
                        console.log("emoji icon clicked"),
                        // setEmojiTrigger(!emojiTrigger),
                      ]}
                      name=""
                      size={24}
                      color={COLORS.purple}
                    />

                    {/*clip icon section*/}
                    <Entypo
                      onPress={fileAttachmentItemTrigger}
                      name="attachment"
                      size={24}
                      color={COLORS.purple}
                      style={{ bottom: 25 }}
                    />
                  </View>
                </View>

                {/*emoji trigger section*/}
                {emojiTrigger ? (
                  <View
                    style={[
                      styles.emojiContainer,
                      {
                        marginTop: emojiTrigger ? 10 : 0,
                        height: emojiTrigger ? 200 : 0,
                      },
                    ]}
                  >
                    <EmojiPicker />
                  </View>
                ) : null}

                {/*emoji result content*/}
                {IndividualFileAttachmentName ? (
                  <View style={styles.clipIconInfoContainer}>
                    {/*attachment header section*/}
                    <View style={styles.attachmentHeaderContainer}>
                      <Text style={styles.attachmentHeader}>
                        <Ionicons
                          name="document-attach"
                          size={18}
                          color={COLORS.white}
                        />
                        {"  "}
                        Your file attachments
                      </Text>
                    </View>

                    {/*attachment info section*/}
                    <View style={styles.clipIconResultContent}>
                      {/*attachment type item*/}
                      <View style={styles.attachContentItems}>
                        <Text style={styles.attachmentIdentifierText}>
                          Image:{" "}
                        </Text>

                        {/*image attachment*/}
                        <Image
                          source={
                            IndividualFileAttachmentType ===
                              "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                              IndividualFileAttachmentType ===
                              "application/msword"
                              ? images.word
                              : IndividualFileAttachmentType ===
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                ? images.excel
                                : IndividualFileAttachmentType ===
                                  "application/pdf"
                                  ? images.pdf
                                  : IndividualFileAttachmentType ===
                                    "application/vnd.ms-powerpoint" ||
                                    IndividualFileAttachmentType ===
                                    "application/vnd.openxmlformats-officedocument.presentationml.presentation"
                                    ? images.ppt
                                    : IndividualFileAttachmentType === "video/mp4" ||
                                      IndividualFileAttachmentType === "video/mpeg"
                                      ? images.video
                                      : { uri: IndividualFileAttachmentURI }
                          }
                          style={styles.clipImageResultItem}
                        />
                      </View>

                      {/*file name item*/}
                      <View style={styles.attachContentItems}>
                        <Text style={styles.attachmentIdentifierText}>
                          Filename:{" "}
                        </Text>
                        <Text style={styles.fileAttachmentNameItem}>
                          {IndividualFileAttachmentName}
                        </Text>
                      </View>

                      {/*file size item*/}
                      <View style={styles.attachContentItems}>
                        <Text style={styles.attachmentIdentifierText}>
                          File size:{" "}
                        </Text>
                        <Text style={styles.fileAttachmentNameItem}>
                          {IndividualFileAttachmentSize > 1000
                            ? (IndividualFileAttachmentSize / 1000).toFixed(1) +
                            " MB"
                            : IndividualFileAttachmentSize + " KB"}
                        </Text>
                      </View>

                      {/*file type item*/}
                      <View style={styles.attachContentItems}>
                        <Text style={styles.attachmentIdentifierText}>
                          File type:{" "}
                        </Text>
                        <Text style={styles.fileAttachmentNameItem}>
                          {IndividualFileAttachmentType}
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : null}
              </>
            )}
          </ScrollView>

          {/*bottom button action*/}
          {personalNoteTrigger == false ? (
            <View style={styles.bottom}>
              <Pressable
                onPress={() => setPersonalNoteTrigger(!personalNoteTrigger)}
                style={styles.buttonContainer2}
              >
                <Image
                  source={icons.reechButton}
                  style={{
                    alignSelf: "center",
                    marginBottom: 10,
                    height: 50,
                    width: 250,
                  }}
                />
              </Pressable>
              <Text style={styles.buttonText2}>Click here to apply</Text>
            </View>
          ) : (
            <View style={styles.bottom}>
              <Pressable
                onPress={() => handleSubmit(respondButtonClicked({ item }))}
                style={styles.buttonContainer2}
              >
                {isLoading || isLoadingFile ? (
                  <ActivityIndicator size="large" color="#9e69c9" />
                ) : (
                  <Image
                    source={icons.reechButton}
                    style={{
                      alignSelf: "center",
                      marginBottom: 10,
                      height: 50,
                      width: 250,
                    }}
                  />
                )}
              </Pressable>
              <Text style={styles.buttonText2}>Click here to respond</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  //verified full image info
  const verifiedInfo = (item) => (
    <View style={styles.container}>
      {item.isVideo ? (
        <View key={item._id} style={styles.textVideoContainer}>
          {/*video image section*/}
          <View style={styles.videoCardContainer}>
            <Image
              source={{ uri: item.videoIcon }}
              style={styles.videoCardLogoItem}
            />
          </View>

          {/*menu icons*/}
          <View style={styles.menuVideoIconsContainer}>
            {/*icon pin section*/}
            <Animated.View
              style={[
                styles.iconVideoItemContainer,
                { bottom: pinIconItemSection },
              ]}
            >
              <Pressable
                onPress={() =>
                  setPinBusinessVideoOpportunity(!pinBusinessVideoOpportunity)
                }
                onLongPress={
                  businessVideoHideForeverPinAlert
                    ? null
                    : onBusinessVideoLongPinPress
                }
              >
                <AntDesign
                  name="pushpin"
                  size={12}
                  color={COLORS.white}
                  style={{ alignSelf: "center" }}
                />
                <Text style={styles.iconVideoText}>
                  {pinBusinessVideoOpportunity ? "Pinned" : "Pin"}
                </Text>
              </Pressable>
            </Animated.View>

            {/*share pin section*/}
            <Animated.View
              style={[
                styles.iconVideoItemContainer,
                {
                  bottom: shareIconItemSection,
                  right: popVideoIcon === false ? 0 : 117,
                },
              ]}
            >
              <Pressable
                onPress={() => setBusinessVideoRenderShareModal(true)}
                onLongPress={onBusinessVideoLongSharePress}
              >
                <FontAwesome
                  name="share-square-o"
                  size={12}
                  color={COLORS.white}
                  style={{ alignSelf: "center" }}
                />
                <Text style={styles.iconVideoText}>Share</Text>
              </Pressable>
            </Animated.View>

            {/*not interested section*/}
            <Animated.View
              style={[
                styles.iconVideoItemContainer,
                {
                  bottom: notInterestedIconItemSection,
                  right: popVideoIcon === false ? 0 : 160,
                },
              ]}
            >
              <Pressable
                onPress={onBusinessVideoLongNotInterestedResponsePress}
                onLongPress={onBusinessVideoLongNotInterestedPress}
              >
                <FontAwesome5
                  name="eye-slash"
                  size={12}
                  color={COLORS.white}
                  style={{ alignSelf: "center" }}
                />
                <Text style={styles.iconVideoText}>
                  {businessVideoNotInterested ? "Hidden" : "Hide"}
                </Text>
              </Pressable>
            </Animated.View>

            {/*copy link section*/}
            <Animated.View
              style={[
                styles.iconVideoItemContainer,
                {
                  bottom: copyLinkIconItemSection,
                  right: popVideoIcon === false ? 0 : 160,
                },
              ]}
            >
              <Pressable
                onPress={() =>
                  setCopiedBusinessVideoOpportunityLink(
                    !copiedBusinessVideoOpportunityLink
                  )
                }
                onLongPress={onBusinessVideoLongCopyLinkPress}
              >
                <FontAwesome
                  name="link"
                  size={12}
                  color={COLORS.white}
                  style={{ alignSelf: "center" }}
                />

                <Text style={styles.iconVideoText}>
                  {copiedBusinessVideoOpportunityLink ? "Copied" : "Copy link"}
                </Text>
              </Pressable>
            </Animated.View>

            {/*report section*/}
            <Animated.View
              style={[
                styles.iconVideoItemContainer,
                { right: popVideoIcon === false ? 0 : 160 },
              ]}
            >
              <Pressable
                onPress={() => setRenderBusinessVideoReportModal(true)}
                onLongPress={onBusinessVideoLongReportPress}
              >
                <MaterialCommunityIcons
                  name="message-alert-outline"
                  size={12}
                  color={COLORS.white}
                  style={{ alignSelf: "center" }}
                />
                <Text style={styles.iconVideoText}>Report</Text>
              </Pressable>
            </Animated.View>

            {/*animated main icons*/}
            <Pressable
              onPress={() => {
                popVideoIcon === false ? popInVideoIcons() : popOutVideoIcons();
              }}
              style={styles.menuVideoIconMainContainer}
            >
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={24}
                color={COLORS.white}
              />
            </Pressable>
          </View>

          {/*video banner section*/}
          <View style={styles.textVideoContent}>
            <Text style={styles.textVideoItem} numberOfLines={1}>
              {item.jobTitle}
            </Text>
            <Text style={styles.textVideoItemLocation} numberOfLines={1}>
              {item.adLocation}
            </Text>
            <View style={styles.priceVideoContainer}>
              <Text style={styles.textVideoItemPrice}>
                {["Collaborator", "Mentor", "Volunteer", undefined].includes(
                  formatMoney(item.rate)
                )
                  ? ""
                  : `${item.rateCurrency}`.split("|")[1]}
                {item.rate} {item.adExtra}
              </Text>
              <Text
                style={styles.textVideoItemMore}
                onPress={() => {
                  setModalVer(true);
                  setItemInfoVer(item);
                }}
              >
                see more...
              </Text>
            </View>
          </View>

          {moreModalVer && verifiedModal(moreModalVer, itemInfoVer)}
        </View>
      ) : item.verified ? (
        <View style={styles.textContainer}>
          {/*icon action section*/}
          <View style={styles.iconActionSection}>
            {/*icon pin section*/}
            <Pressable
              onPress={() => setPinBusinessOpportunity(!pinBusinessOpportunity)}
              onLongPress={
                businessHideForeverPinAlert ? null : onBusinessLongPinPress
              }
              style={styles.iconItemContainer}
            >
              <AntDesign
                name="pushpin"
                size={30}
                color={pinBusinessOpportunity ? COLORS.purple : COLORS.white}
              />
              <Text style={styles.iconTextItem}>
                {pinBusinessOpportunity ? "Pinned" : "Pin"}
              </Text>
            </Pressable>

            {/*icon share section*/}
            <Pressable
              onPress={() => setBusinessRenderShareModal(true)}
              onLongPress={onBusinessLongSharePress}
              style={styles.iconItemContainer}
            >
              <FontAwesome
                name="share-square-o"
                size={30}
                color={COLORS.white}
              />
              <Text style={styles.iconTextItem}>Share</Text>
            </Pressable>

            {/*icon not interested section*/}
            <Pressable
              onPress={onBusinessLongNotInterestedResponsePress}
              onLongPress={onBusinessLongNotInterestedPress}
              style={styles.iconItemContainer}
            >
              <FontAwesome5
                name="eye-slash"
                size={30}
                color={businessNotInterested ? COLORS.purple : COLORS.white}
              />
              <Text style={styles.iconTextItem}>
                {businessNotInterested ? "Hidden" : "Hide"}
              </Text>
            </Pressable>

            {/*icon copy link section*/}
            <Pressable
              onPress={() =>
                setCopiedBusinessOpportunityLink(!copiedBusinessOpportunityLink)
              }
              onLongPress={onBusinessLongCopyLinkPress}
              style={styles.iconItemContainer}
            >
              <FontAwesome
                name="link"
                size={30}
                color={
                  copiedBusinessOpportunityLink ? COLORS.purple : COLORS.white
                }
              />

              <Text style={styles.iconTextItem}>
                {copiedBusinessOpportunityLink ? "Copied" : "Copy link"}
              </Text>
            </Pressable>

            {/*icon report section*/}
            <Pressable
              onPress={() => setRenderBusinessReportModal(true)}
              onLongPress={onBusinessLongReportPress}
              style={styles.iconItemContainer}
            >
              <MaterialCommunityIcons
                name="message-alert-outline"
                size={30}
                color={renderBusinessReportModal ? COLORS.purple : COLORS.white}
              />
              <Text style={styles.iconTextItem}>Report</Text>
            </Pressable>
          </View>

          {/*render opportunity card options*/}
          <View style={styles.bubbleImageContainer}>
            {/*bubble mate image map*/}
            {businessImageCollection && (
              <View style={styles.bubbleImageSectionContainer}>
                {businessImageCollection.map((imgUri, i) => (
                  <Pressable
                    onPress={() =>
                      console.log("user image")
                    }
                    key={i}
                    style={styles.bubbleImageSectionContent}
                  >
                    {i < 3 && (
                      <Image
                        source={{ uri: imgUri.imageUrl }}
                        style={styles.bubbleMateImageItem}
                      />
                    )}
                  </Pressable>
                ))}
              </View>
            )}

            {/*bubble mate text section*/}
            <View style={styles.bubbleMateTextContainer}>
              <Text style={styles.bubbleMateTextItem}>
                {imagesMap.length} of your Bubble mates are connected with this
                poster
              </Text>
            </View>
          </View>

          <LinearGradient
            colors={[COLORS.teal, COLORS.transparent, COLORS.teal]}
            start={{ x: 0.99, y: 0.0 }}
            end={{ x: 0.01, y: 0.0 }}
            style={styles.textContent}
          >
            <Text style={styles.textItem}>{item.jobTitle}</Text>
            <Text style={styles.textItemLocation}>{item.adLocation}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.textItemPrice}>
                {["Collaborator", "Mentor", "Volunteer", undefined].includes(
                  item.rate
                )
                  ? ""
                  : `${item.rateCurrency}`.split("|")[1]}
                {formatMoney(item.rate)} {item.adExtra}
              </Text>
              <Text
                style={styles.textItemMore}
                onPress={() => {
                  setModalVer(true);
                  setItemInfoVer(item);
                }}
              >
                see more...
              </Text>
            </View>
          </LinearGradient>

          {moreModalVer && verifiedModal(moreModalVer, itemInfoVer)}
        </View>
      ) : null}
    </View>
  );

  //not verified full image info
  const notVerifiedInfo = (item) => (
    <View style={styles.container}>
      {/*bottom see more section*/}
      <View style={styles.textContainer}>
        {/*icon action section*/}
        <View style={styles.iconActionSection}>
          {/*icon pin section*/}
          <Pressable
            onPress={() => [
              setPinOpportunity(!pinOpportunity),
              console.log("pin icon clicked"),
            ]}
            onLongPress={hideForeverPinAlert ? null : onLongPinPress}
            style={styles.iconItemContainer}
          >
            <AntDesign
              name="pushpin"
              size={25}
              strokeWidth={0}
              color={pinOpportunity ? COLORS.purple : COLORS.white}
            />
            <Text style={styles.iconTextItem}>
              {pinOpportunity ? "Pinned" : "Pin"}
            </Text>
          </Pressable>

          {/*icon share section*/}
          <Pressable
            onPress={() => [
              setRenderShareModal(true),
              console.log("share icon clicked"),
            ]}
            onLongPress={onLongSharePress}
            style={styles.iconItemContainer}
          >
            <FontAwesome
              name="share-square-o"
              size={25}
              strokeWidth={0}
              color={COLORS.white}
            />
            <Text style={styles.iconTextItem}>Share</Text>
          </Pressable>

          {/*icon not interested section*/}
          <Pressable
            onPress={onLongNotInterestedResponsePress}
            onLongPress={onLongNotInterestedPress}
            style={styles.iconItemContainer}
          >
            <FontAwesome5
              name="eye-slash"
              size={25}
              strokeWidth={0}
              color={notInterested ? COLORS.purple : COLORS.white}
            />
            <Text style={styles.iconTextItem}>
              {notInterested ? "Hidden" : "Hide"}
            </Text>
          </Pressable>

          {/*icon copy link section*/}
          <Pressable
            onPress={() => [
              setCopiedOpportunityLink(!copiedOpportunityLink),
              console.log("copy link icon clicked"),
            ]}
            onLongPress={onLongCopyLinkPress}
            style={styles.iconItemContainer}
          >
            <FontAwesome
              name="link"
              size={25}
              strokeWidth={0}
              color={copiedOpportunityLink ? COLORS.purple : COLORS.white}
            />

            <Text style={styles.iconTextItem}>
              {copiedOpportunityLink ? "Copied" : "Copy link"}
            </Text>
          </Pressable>

          {/*icon report section*/}
          <Pressable
            onPress={() => [
              setRenderReportModal(true),
              console.log("report icon clicked"),
            ]}
            onLongPress={onLongReportPress}
            style={styles.iconItemContainer}
          >
            <MaterialCommunityIcons
              name="message-alert-outline"
              size={25}
              strokeWidth={0}
              color={renderReportModal ? COLORS.purple : COLORS.white}
            />
            <Text style={styles.iconTextItem}>Report</Text>
          </Pressable>
        </View>

        {/*render opportunity card options*/}
        <View style={styles.bubbleImageContainer}>
          {/*bubble mate image map*/}
          {individualImageCollection && (
            <View style={styles.bubbleImageSectionContainer}>
              {individualImageCollection.map((imgUri, i) => (
                <Pressable
                  onPress={() =>
                    console.log("user image")
                  }
                  key={i}
                  style={styles.bubbleImageSectionContent}
                >
                  {i < 3 && (
                    <Image
                      source={{ uri: imgUri.imageUrl }}
                      style={styles.bubbleMateImageItem}
                    />
                  )}
                </Pressable>
              ))}
            </View>
          )}

          {/*bubble mate text section*/}
          <View style={styles.bubbleMateTextContainer}>
            <Text style={styles.bubbleMateTextItem}>
              {imageMap.length} of your Bubble mates are connected with this
              poster
            </Text>
          </View>
        </View>

        {/*opportunity info below section*/}
        <LinearGradient
          colors={[COLORS.purple, COLORS.transparent, COLORS.purple]}
          start={{ x: 0.99, y: 0.0 }}
          end={{ x: 0.01, y: 0.0 }}
          style={[
            styles.textNotVerifiedContent,
            {
              bottom: Platform.OS === "ios" ? -100 : -70,
            },
          ]}
        >
          <Text style={styles.textItem}>{item.jobTitle}</Text>
          <Text style={styles.textItemLocation}>{item.address}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.textItemPrice}>
              {["Collaborator", "Mentor", "Volunteer", undefined].includes(
                item.rateFrequency
              )
                ? ""
                : `${item.rateCurrency}`.split("|")[1]}
              {`${formatMoney(item.rate) ?? ""} ${item.rateFrequency?.toLowerCase() ?? ""
                }`.trim()}
            </Text>
            <Text
              style={styles.textItemMore}
              onPress={() => {
                setModal(true);
                setItemInfo(item);
              }}
            >
              see more...
            </Text>
          </View>
        </LinearGradient>

        {moreModal && notVerifiedModal(moreModal, itemInfo)}
      </View>
    </View>
  );

  //image background section
  const imgBackground = (item) => {
    const cardImage = !item.verified ? item.oppImage : item.adImage;
    return (
      <>
        {item.isVideo ? (
          <View style={styles.imageBackground}>
            {renderHeaderSection()}
            <TouchableOpacity
              onPress={() => {
                setStatus(!status)
              }}
              style={[styles.videoContent, { height: height / 3 }]}>
              <Video
                ref={videoRef}
                source={{ uri: item.videoPlayerItem }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="contain"
                isLooping={false}
                autoPlay={false}
                shouldPlay={status}
                posterSource={item.videoItem}
                useNativeControls
                playsInSilentModeIOS={true}
                contentType="video/mp4"
                usePoster={true}
                style={styles.videoItem}
                selectedAudioTrack={{
                  type: "video",
                  value: item.videoPlayerItem,
                }}
                isExternalPlaybackActive={false}
                ignoreSilentSwitch={"ignore"}
              />

              {item.verified ? verifiedInfo(item) : notVerifiedInfo(item)}
              {renderBusinessSharePopupModal()}
              {renderBusinessReportPopupModal()}
            </TouchableOpacity>
          </View>
        ) : item.careerAd ? null : (
          <ImageBackground
            source={{
              uri: image[cardImage] ?? images?.[cardImage] ?? cardImage,
            }}
            style={styles.imageBackground}
            resizeMode="cover"
          >
            {renderHeaderSection()}
            {!item.verified ? notVerifiedInfo(item) : verifiedInfo(item)}
            {renderSharePopupModal()}
            {renderReportPopupModal()}
            {renderBusinessSharePopupModal()}
            {renderBusinessReportPopupModal()}
            {renderBusinessVideoSharePopupModal()}
            {renderBusinessVideoReportPopupModal()}
            <LinearGradient
              style={styles.overLayItem}
              colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.8)"]}
              start={{ x: 0.0, y: 0 }}
              end={{ x: 0.0, y: 1 }}
            />
          </ImageBackground>
        )}
      </>
    );
  };

  //render screen content section
  return (
    <>
      <View style={styles.screenContainer}>
        <FlatList
          data={data}
          ref={scrollRef}
          initialNumToRender={data.length}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 500));
            wait.then(() => {
              scrollRef.current?.scrollToIndex({
                index: info.index,
                animated: false,
              });
            });
          }}
          keyExtractor={(item, index) => index.toString()}
          snapToAlignment="start"
          decelerationRate="fast"
          snapToInterval={Dimensions.get("window").height}
          renderItem={({ item }) => {
            return <View key={item._id}>{imgBackground(item)}</View>;
          }}
          contentContainerStyle={{ paddingHorizontal: 0 }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={<EmptyFlatlistComponent />}
          maxToRenderPerBatch={10}
        />
      </View>
    </>
  );
};

//custom style
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
    flexDirection: "column",
  },
  headerContainer: {
    zIndex: 99,
    position: "absolute",
    top: Platform.OS === "ios" ? 48 : 0,
  },
  container: {
    flex: 1,
    zIndex: 20,
    left: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
  },

  //screen content
  imageBackground: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  videoContent: {
    width: Platform.OS === "ios" ? "110%" : "100%",
  },
  videoItem: {
    top: 25,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 1.6,
  },

  //overlay section
  overLayItem: {
    height: 800,
    width: "100%",
    position: "absolute",
    bottom: 0,
  },

  //video card container info
  textVideoContainer: {
    alignItems: "flex-start",
    flexDirection: "row",
    width: "100%",
    marginTop: Platform.OS === "ios" ? "70%" : "108%",
  },
  videoCardContainer: {
    width: "20%",
    height: Platform.OS === "ios" ? 60 : 90,
    alignItems: "center",
    justifyContent: "center",
    bottom: 12,
    backgroundColor: COLORS.white,
  },
  videoCardLogoItem: {
    marginTop: Platform.OS === "ios" ? 2 : 5,
    width: "100%",
    height: 100,
    resizeMode: "contain",
    alignSelf: "center",
  },
  textVideoContent: {
    right: 2,
    bottom: Platform.OS === "ios" ? 5 : -4.5,
    position: "absolute",
    flexDirection: "column",
    width: "76%",
    padding: 10,
  },
  priceVideoContainer: {
    flexDirection: "row",
  },
  textVideoItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  textVideoItemLocation: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  textVideoItemPrice: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  textVideoItemMore: {
    top: 0,
    left: 6,
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //menu video icons section
  menuVideoIconsContainer: {
    flex: 1,
    padding: 5,
    top: -50,
  },
  menuVideoIconMainContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    bottom: 0,
    right: 60,
    borderRadius: 50 / 2,
    backgroundColor: COLORS.purple,
  },
  iconVideoItemContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    bottom: 0,
    right: 60,
    borderRadius: 50 / 2,
    backgroundColor: COLORS.purple,
  },
  iconVideoText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    textAlign: "center",
    marginTop: 2,
  },

  //normal card container info
  textContainer: {
    marginTop: "55%",
    alignItems: "flex-start",
    width: "100%",
    opacity: 1,
  },

  //icon actions section
  iconActionSection: {
    flexDirection: "column",
    alignSelf: "flex-end",
    padding: 5,
    top: Platform.OS === "ios" ? "2%" : 0,
    width: "23%",
    right: 15,
  },
  iconItemContainer: {
    padding: 5,
    marginVertical: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  iconTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
    marginTop: 5,
    textAlign: "center",
  },

  //icon modal style
  reportOptionModalContainer: {
    flex: 1,
    height: "50%",
  },
  reportOptionModalContent: {
    flex: 1,
    marginTop: "125%",
    padding: "4%",
    width: "100%",
    backgroundColor: COLORS.black,
  },
  shareOptionModalContent: {
    flex: 1,
    marginTop: "110%",
    padding: "4%",
    width: "100%",
    backgroundColor: COLORS.black,
  },
  reportOptionModalLiner: {
    width: "40%",
    marginTop: 15,
    alignSelf: "center",
    borderRadius: 20,
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth * 15,
  },
  reportModalHeadingTextItem: {
    color: COLORS.white,
    fontFamily: "PoppinsBold",
    fontSize: 18,
    alignSelf: "center",
    marginTop: 10,
  },
  reportModalOptionContent: {
    right: 18,
    flexDirection: "column",
  },
  reportModalOptionContainer: {
    top: 30,
    marginBottom: 30,
    flexDirection: "row",
  },
  reportModalOptionIconContainer: {
    width: "15%",
    height: "120%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  reportImageOptionItem: {
    maxWidth: 20,
    height: 20,
  },
  reportModalOptionTextContainer: {
    width: "85%",
    flexDirection: "row",
    textAlign: "center",
  },
  reportModalOptionHeaderText: {
    color: COLORS.white,
    fontSize: 17,
    fontFamily: "PoppinsBold",
    alignSelf: "center",
  },

  //user image section
  bubbleImageContainer: {
    flexDirection: "row",
    padding: 5,
    bottom: Platform.OS === "ios" ? 10 : 35,
    width: "75%",
  },
  bubbleImageSectionContainer: {
    flexDirection: "row",
    paddingHorizontal: 2,
    width: "33%",
  },
  bubbleImageSectionContent: {
    maxWidth: 22,
    flexDirection: "row",
  },
  bubbleMateImageItem: {
    width: 46,
    height: 46,
    borderRadius: 46,
  },
  bubbleMateTextContainer: {
    width: "67%",
    paddingHorizontal: 2,
    justifyContent: "center",
    left: Platform.OS === "ios" ? 0 : 10,
  },
  bubbleMateTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //bottom linear gradient
  textContent: {
    opacity: 0.8,
    position: "absolute",
    flexDirection: "column",
    alignSelf: "center",
    width: Platform.OS === "ios" ? "106%" : "108%",
    padding: 25,
    paddingTop: 12,
    paddingLeft: 20,
    bottom: Platform.OS === "ios" ? -100 : -90,
  },
  textNotVerifiedContent: {
    position: "absolute",
    flexDirection: "column",
    alignSelf: "center",
    width: Platform.OS === "ios" ? "106%" : "108%",
    padding: 25,
    paddingTop: 12,
    paddingLeft: 20,
  },
  priceContainer: {
    flexDirection: "row",
  },
  textItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  textItemLocation: {
    marginVertical: 2,
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  textItemPrice: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  textItemMore: {
    left: 8,
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //modal section
  modalMoreContainer: {
    marginTop: 10,
  },
  innerMoreModalContainer: {
    flex: 1,
    paddingTop: "10%",
    padding: "4%",
    backgroundColor: COLORS.black,
  },
  innerMoreModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    zIndex: 99,
    top: Platform.OS === "ios" ? 50 : 38,
    left: 25,
  },

  //card info
  cardInfoContainer: {
    width: "100%",
    flexDirection: "column",
  },
  cardInfoContent: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  cardInfoContentDescription: {
    width: "100%",
    minHeight: "20%",
  },
  cardInfoContext: {
    paddingVertical: 10,
    flexDirection: "column",
  },
  cardInfoTextItemsContainer: {
    flexDirection: "column",
    paddingBottom: 5,
  },
  cardInfoTextItems: {
    paddingVertical: 10,
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    marginBottom: 15,
  },
  imageContainer: {
    position: "relative",
    bottom: 50,
    width: "105%",
    justifyContent: "center",
    alignItems: "center",
  },
  imageItem: {
    right: 10,
    width: 450,
    height: 320,
    borderRadius: 0,
    resizeMode: "cover",
  },
  oppDescriptionScrollContainer: {
    paddingHorizontal: Platform.OS === "ios" ? 0 : 5,
    bottom: Platform.OS === "android" ? 150 : 140,
    right: 17,
    width: "109%",
    flexDirection: "column",
    height: Platform.OS === "android" ? 330 : 480,
  },
  oppDescriptionContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    bottom: Platform.OS === "ios" ? 140 : 127,
    opacity: 1,
  },
  descriptionContent: {
    right: 17,
    padding: 12,
    paddingTop: 12,
    marginTop: 15.6,
    paddingLeft: 20,
    top: Platform.OS === "ios" ? -6 : -33,
    width: "109%",
  },
  descriptionNotVerifiedContent: {
    right: 17,
    padding: 12,
    paddingTop: 12,
    marginTop: 15.6,
    paddingLeft: 20,
    top: Platform.OS === "ios" ? -6 : -33,
    width: "109%",
  },
  oppUsername: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
    marginBottom: 2,
  },
  address: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  oppJobName: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: "PoppinsBold",
  },
  cardInfoItems: {
    marginVertical: 0,
    flexDirection: "row",
    width: "100%",
  },
  cardHeading: {
    color: COLORS.purple,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  cardInfoTextDark: {
    color: COLORS.darkGray,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  cardInfoTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  cardInfoTextItemDark: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
  },
  cardInfoText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  cardDescription: {
    width: "100%",
    height: Platform.OS === "ios" ? "20%" : "15%",
  },
  cardDescription2: {
    width: "100%",
    height: Platform.OS === "ios" ? "35%" : "23%",
  },

  //button section
  buttonContainer: {
    marginHorizontal: "25%",
    flexDirection: "column",
    bottom: Platform.OS === "ios" ? 10 : 10,
  },
  buttonImage: {
    width: Platform.OS === "ios" ? 100 : 65,
    height: Platform.OS === "ios" ? 45 : 14,
    resizeMode: Platform.OS === "ios" ? "contain" : "contain",
  },
  buttonText: {
    bottom: Platform.OS === "ios" ? 10 : 0,
    alignSelf: "center",
    color: COLORS.darkGray,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  bottom: {
    bottom: 120,
  },
  buttonContainer2: {
    marginHorizontal: "25%",
    flexDirection: "column",
    bottom: Platform.OS === "ios" ? 10 : 0,
  },
  buttonImage2: {
    width: Platform.OS === "ios" ? 100 : 80,
    height: Platform.OS === "ios" ? 45 : 15,
    resizeMode: Platform.OS === "ios" ? "contain" : "contain",
  },
  buttonText2: {
    bottom: Platform.OS === "ios" ? 10 : 0,
    alignSelf: "center",
    color: COLORS.darkGray,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },

  //personal note
  personalNoteContainer: {
    top: 0,
    position: "relative",
    height: 150,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 15,
    backgroundColor: COLORS.reechGray,
  },
  personalNoteIconContainer: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1.5,
  },
  personalNoteIcon: {
    top: 2,
    left: 2,
    position: "absolute",
    width: 55,
    height: 55,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: COLORS.black,
  },
  personNoteHeading: {
    color: COLORS.purple,
    fontSize: 16,
    fontFamily: "PoppinsBold",
    marginLeft: 70,
    marginTop: -60,
    marginBottom: -13,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 5,
    bottom: 0,
  },

  //clip section
  clipIconInfoContainer: {
    justifyContent: "center",
    left: 10,
    width: "95%",
    marginTop: 10,
    padding: 5,
    backgroundColor: COLORS.transparent,
  },
  attachmentHeaderContainer: {
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  attachmentHeader: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  clipIconResultContent: {
    flexDirection: "column",
  },
  attachContentItems: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  attachmentIdentifierText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  clipImageResultItem: {
    height: 25,
    width: 25,
    resizeMode: "cover",
    borderRadius: 5,
  },
  fileAttachmentNameItem: {
    color: COLORS.purple,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  fileAttachmentLinkItem: {
    color: COLORS.white,
    fontSize: 11,
    fontFamily: "PoppinsLight",
  },
  emojiContainer: {
    flex: 1,
    zIndex: 9,
  },
});

export default HomeScreenCardFullView;
