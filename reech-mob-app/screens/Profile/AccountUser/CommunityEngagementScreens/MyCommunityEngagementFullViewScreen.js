import React, { useState, useEffect } from "react";
import {
  Alert,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  FlatList,
  ScrollView,
  Modal,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { Entypo, FontAwesome5, Fontisto, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import NavHeader from "@/components/Headers/NavHeader";
import moment from "moment";
import io from "socket.io-client";

//customs
import { COLORS, images } from "../../../../constants";
import { EmptyFlatlistComponent } from "../../../../components";
import { useReadCommunityDetailsQuery } from "@/redux/api/communityEngagement";

///__________________Tracking database changes__________________
const SOCKET_SERVER_URL = "https://reech-node-api-7o3szyfdpq-uc.a.run.app/";
//`${process.env.REACT_APP_API_URL}${process.env.MAIN_API_BASE_PATH}`;

const MyCommunityEngagementFullViewScreen = ({ route }) => {
  const navigation = useNavigation();

  const { userId, item: itm } = route.params;


  const [toggleText, setToggleText] = useState(false);
  const [requestToJoin, setRequestToJoin] = useState(false);
  const [_item, setItem] = useState(itm ?? {});

  //privacy modal function
  const [privacyModal, setPrivacyModal] = useState(false);
  const [publicSettingValue, setPublicSettingValue] = useState(false);
  const [privateSettingValue, setPrivateSettingValue] = useState(false);

  const current_user = useSelector((state) => state.user.current_user);
  const { data, refetch } = useReadCommunityDetailsQuery(itm?._id)

  //privacy setting handlers
  const setPublic = () => {
    setPublicSettingValue(true);
    setPrivateSettingValue(false);
  };
  const setPrivate = () => {
    setPublicSettingValue(false);
    setPrivateSettingValue(true);
  };

  useEffect(() => {
    setItem(data ?? itm)
  }, [data, itm])

  useEffect(() => {
    const connectSocket = async () => {
      const socket = io(SOCKET_SERVER_URL, {
        transports: ["websocket"],
        extraHeaders: {
          "Svc-Tkn": `Bearer ${process.env.SvcTkn_Main_API}`,
        },
      });
      socket.on("community-post-updated", () => {
        refetch();
      });
      socket.on("community-updated", () => {
        refetch();
      });
    };
    connectSocket();
  }, []);

  //cancel request to join
  const cancelRequestToJoin = () => {
    Alert.alert(
      "Are you sure?",
      "You do not want to join this community anymore?",
      [
        {
          text: "Confirm",
          style: "OK",
          onPress: () => {
            console.log("canceled request to join");
            setRequestToJoin(false);
          },
        },
        {
          text: "Close",
          style: "OK",
        },
      ]
    );
  };

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerComponentContainer}>
          <NavHeader message="What would you like to do?" />

          {/*navigation text section*/}
          <View style={styles.headerTextContainer}>
            <View style={styles.headingTextContainer}>
              <Text style={styles.headingTextItem}>Community engagements</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  //top image screen
  function renderTopImageSection() {
    return (
      <View style={styles.topImageContainer}>
        <Image source={{ uri: _item?.communityImage }} style={styles.topImageItem} />

        {/*show button to edit engagement.*/}
        {_item?.userId?._id === current_user?._id ? (
          <MaterialCommunityIcons
            name="pencil-outline"
            size={24}
            color={COLORS.white}
            onPress={() => console.log("pencil action pressed")}
            style={styles.editEngagementButtonItem}
          />
        ) : null}

        {/*community engagement title section*/}
        <View style={styles.topTitleContainer}>
          <Text style={styles.topTitleItem}>{_item?.title}</Text>
        </View>
      </View>
    );
  }

  //community details section
  function renderCommunityDetailsSection() {
    return (
      <View style={styles.contentDetailsContainer}>
        {/*date and location section*/}
        <View style={styles.contentDateContainer}>
          <View style={styles.contentDateContent}>
            <MaterialCommunityIcons
              name="clock-time-four-outline"
              size={16}
              color={COLORS.white}
            />
            <Text style={styles.contentDateItem}>
              Last updated {moment(_item?.communityDate).format('DD-MM-YYYY')}
            </Text>
          </View>

          {/*location*/}
          <View style={styles.contentLocationContent}>
            <MaterialIcons name="location-on" size={16} color={COLORS.white} />
            <Text style={styles.contentLocationItem}>
              {_item?.address}
            </Text>
          </View>
        </View>

        {/*team member section*/}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("MyCommunityTeamMemberScreen", {
              item: _item,
            })
          }
          style={styles.contentTeamContainer}
        >
          <Text style={styles.contentTeamTextItem}>Team</Text>

          {/*map team member image*/}
          <View style={styles.contentTeamImageContainer}>
            {_item?.team && (
              <View style={styles.contentTeamMapContainer}>
                {_item?.team.map((teamMembers, i) => (
                  <View style={styles.contentMapImageContainer} key={i}>
                    {i < 2 && (
                      <Image
                        source={teamMembers?.profileImage ? { uri: teamMembers?.profileImage } : images.defaultRounded}
                        style={styles.contentTeamImageItem}
                      />
                    )}
                  </View>
                ))}
              </View>
            )}

            {_item?.team.length >= 3 ? (
              <View style={styles.gradientImageContainer}>
                <LinearGradient
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  colors={[
                    COLORS.purpleDarker,
                    COLORS.purpleDark,
                    COLORS.purple,
                  ]}
                  style={styles.gradientTextContainer}
                >
                  {_item?.team.length >= 9 ? (
                    <Text style={styles.gradientTextItem}>+9</Text>
                  ) : (
                    <Text style={styles.gradientTextItem}>
                      +{_item?.team.length - 2}
                    </Text>
                  )}
                </LinearGradient>
              </View>
            ) : null}
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  //description section
  function renderDescriptionSection() {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        style={[
          styles.topDescriptionContainer,
          {
            maxHeight:
              toggleText && Platform.OS === "ios"
                ? 120
                : toggleText && Platform.OS === "android"
                  ? 85
                  : Platform.OS === "android"
                    ? 45
                    : 55,
          },
        ]}
      >
        <Text
          onPress={() => setToggleText(!toggleText)}
          numberOfLines={toggleText ? undefined : 3}
          style={styles.topDescriptionItem}
        >
          {_item?.description}
        </Text>

        {/*show more text*/}
        <View style={styles.showMoreTextContainer}>
          <Text
            onPress={() => setToggleText(!toggleText)}
            style={styles.showMoreTextItem}
          >
            {toggleText ? "Hide" : toggleText <= 3 ? null : "See more"}
          </Text>
        </View>
      </ScrollView>
    );
  }

  function renderPrivacyModalPopUp() {
    return (
      <Modal
        transparent={true}
        animationType="fade"
        visible={privacyModal}
        statusBarTranslucent={true}
        style={styles.privacyModalContainer}
      >
        {/*inner modal content*/}
        <View style={styles.innerPrivacyModalContainer}>
          <View style={styles.modalHeaderContainer}>
            <Text style={styles.modalHeaderTextItem}>Privacy settings</Text>
          </View>
          <View style={styles.privacyModalLiner} />

          {/*set public handler*/}
          <View style={styles.modalSubheaderContainer}>
            <Text
              onPress={() => [setPublic(), setPrivacyModal(false)]}
              style={[
                styles.modalSubheaderTextItem,
                { color: publicSettingValue ? COLORS.purple : COLORS.white },
              ]}
            >
              Make public
            </Text>
            <Text style={styles.modalSubHeaderDescriptionTextItem}>
              Anyone can view this engagement
            </Text>
          </View>
          <View style={styles.privacyModalLiner} />

          {/*set private handler*/}
          <View style={styles.modalSubheaderContainer}>
            <Text
              onPress={() => [setPrivate(), setPrivacyModal(false)]}
              style={[
                styles.modalSubheaderTextItem,
                { color: privateSettingValue ? COLORS.purple : COLORS.white },
              ]}
            >
              Make private
            </Text>
            <Text style={styles.modalSubHeaderDescriptionTextItem}>
              Only members can view this engagement
            </Text>
          </View>
          <View style={styles.privacyModalLiner} />

          {/*modal close action section*/}
          <View style={styles.innerPrivacyModalContent}>
            <Pressable onPress={() => setPrivacyModal(false)}>
              <Entypo name="chevron-up" size={20} color={COLORS.white} />
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }

  //request button section
  function renderRequestButtonSection() {
    if (_item?.userId?._id === current_user?._id) {
      return (
        //show if user logged in is previewing
        <Pressable
          onPress={() => setPrivacyModal(true)}
          style={styles.requestButtonContainer}
        >
          <View
            style={[
              styles.privacyButtonContainer,
              {
                backgroundColor: privacyModal
                  ? COLORS.transparent
                  : COLORS.greyRgba,
              },
            ]}
          >
            <Text style={styles.requestPrivacyTextItem}></Text>
            <Text style={styles.requestPrivacyTextItem}>
              {privacyModal ? "" : "Privacy settings"}
            </Text>
            {privacyModal ? (
              ""
            ) : (
              <Entypo name="chevron-down" size={16} color={COLORS.white} />
            )}
          </View>
        </Pressable>
      );
    } else if (_item?.private) {
      return (
        //show if community is private
        <Pressable
          onPress={() => console.log("request button pressed")}
          style={styles.requestButtonContainer}
        >
          <View style={styles.privateButtonContainer}>
            <Text style={styles.requestTextItem}>
              <FontAwesome5 name="lock" size={16} color={COLORS.white} />
              {"   "}
              Private
            </Text>
          </View>
        </Pressable>
      );
    } else if (requestToJoin) {
      return (
        //show if request is sent but user wants to cancel
        <Pressable
          onPress={() => [
            cancelRequestToJoin(),
            console.log("request button pressed"),
          ]}
          style={styles.requestButtonContainer}
        >
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
            style={styles.requestGradientContainer}
          >
            <Text style={styles.requestTextItem}>
              <FontAwesome5 name="user-clock" size={16} color={COLORS.white} />

              {"  "}
              {requestToJoin ? "Request sent" : "Request to join"}
            </Text>
          </LinearGradient>
        </Pressable>
      );
    } else {
      return (
        //show if request is sent or request to join
        <Pressable
          onPress={() => [
            setRequestToJoin(!requestToJoin),
            console.log("request button pressed"),
          ]}
          style={styles.requestButtonContainer}
        >
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
            style={styles.requestGradientContainer}
          >
            <Text style={styles.requestTextItem}>
              {requestToJoin ? (
                <FontAwesome5
                  name="user-clock"
                  size={16}
                  color={COLORS.white}
                />
              ) : null}
              {"  "}
              {requestToJoin ? "Waiting for admin approval" : "Request to join"}
            </Text>
          </LinearGradient>
        </Pressable>
      );
    }
  }

  //related post images
  function renderRelatedPostImagesSection() {
    return (
      <View style={{ height: 300 }}>
        <FlatList
          data={[..._item?.posts, { addMedia: true }]}//relatedPostImages
          keyExtractor={(item, index) => index.toString()}
          nestedScrollEnabled={true}
          renderItem={({ item }) => {
            if (item.addMedia && _item?.userId?._id === current_user?._id) {
              return (
                //function to add media items
                <View style={styles.mediaImageContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("AddCommunityEngagementPostScreen", { communityId: _item?._id })
                    }
                    style={styles.mediaTextContentContainer}
                  >
                    <View style={styles.mediaTextContainer}>
                      <Text style={styles.mediaTextItem}>Add media</Text>
                      <Fontisto name="plus-a" size={24} color={COLORS.white} />
                    </View>
                  </TouchableOpacity>
                </View>
              );
            } else {
              return (
                //engagement media images shared by admins
                <View style={styles.relatedImagesContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("MyCommunityImageFullViewScreen", {
                        userId: userId,
                        item: item,
                      })
                    }
                    style={styles.relatedImageContent}
                  >
                    <Image
                      source={{ uri: item?.postImage }}
                      style={styles.relatedImageItem}
                    />
                  </TouchableOpacity>
                </View>
              );
            }
          }}
          numColumns={3}
          columnWrapperStyle={styles.flatListColumnWrapperContainer}
          contentContainerStyle={styles.flatListContentContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ marginBottom: "10%" }}>
              <></>
              {/* <EmptyFlatlistComponent /> */}
            </View>
          }
        />
      </View>
    );
  }

  //screen content list
  function renderContentSection() {
    return (
      <>
        {renderTopImageSection()}
        {renderCommunityDetailsSection()}
        {renderDescriptionSection()}
        {renderPrivacyModalPopUp()}
        {renderRequestButtonSection()}
        <View
          style={[
            styles.relatedImagePostContainer,
            {
              maxHeight:
                toggleText && Platform.OS === "ios"
                  ? "34%"
                  : toggleText && Platform.OS === "android"
                    ? "20%"
                    : Platform.OS === "ios"
                      ? "34%"
                      : Platform.OS === "android"
                        ? "30%"
                        : "34%",
            },
          ]}
        >
          {renderRelatedPostImagesSection()}
        </View>
      </>
    );
  }

  //screen items collection
  return (
    <View style={styles.container}>
      {renderHeaderSection()}
      <ScrollView
        nestedScrollEnabled={true}
        style={styles.screenListContentContainer}
      >
        {renderContentSection()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  screenListContentContainer: {
    height: "81%",
  },
  relatedImagePostContainer: {
    marginTop: Platform.OS === "ios" ? 10 : 0,
    maxWidth: "100%",
  },

  //header section
  headerContainer: {
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },
  headerComponentContainer: {
    marginTop: 0,
  },
  headerTextContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20,
    zIndex: 99,
  },
  headingTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 40,
    marginLeft: 10,
  },
  headingTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },

  //top image section
  topImageContainer: {
    flexDirection: "column",
    height: 250,
  },
  topImageItem: {
    width: "100%",
    height: Platform.OS === "ios" ? 250 : 200,
    resizeMode: "cover",
    borderRadius: 20,
  },
  editEngagementButtonItem: {
    alignSelf: "flex-end",
    bottom: 40,
    right: 20,
  },
  topTitleContainer: {
    padding: 5,
    top: -130,
    marginHorizontal: 10,
  },
  topTitleItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //community details section
  contentDetailsContainer: {
    padding: 5,
    marginTop: Platform.OS === "ios" ? 10 : -35,
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contentDateContainer: {
    padding: 2,
    width: "70%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  contentDateContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  contentDateItem: {
    marginLeft: 5,
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  contentLocationContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  contentLocationItem: {
    marginLeft: 5,
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
  },
  contentTeamContainer: {
    top: -4,
    padding: 2,
    width: "20%",
    left: Platform.OS === "ios" ? 10 : 0,
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  contentTeamTextItem: {
    marginBottom: 5,
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  contentTeamImageContainer: {
    width: "100%",
    flexDirection: "row",
  },
  contentTeamMapContainer: {
    flexDirection: "row",
    width: 45,
  },
  contentMapImageContainer: {
    width: 25,
  },
  contentTeamImageItem: {
    width: 30,
    height: 30,
    resizeMode: "cover",
    borderRadius: 30,
  },
  gradientImageContainer: {
    flexDirection: "row",
    height: 30,
    width: 30,
  },
  gradientTextContainer: {
    height: 30,
    width: 30,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  gradientTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  topDescriptionContainer: {
    margin: 10,
  },
  topDescriptionItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  showMoreTextContainer: {
    marginVertical: 5,
    marginHorizontal: 10,
    alignItems: "flex-end",
  },
  showMoreTextItem: {
    color: COLORS.darkGray,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //modal privacy section
  privacyModalContainer: {
    marginTop: 10,
  },
  modalHeaderContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalHeaderTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  modalSubheaderContainer: {
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalSubheaderTextItem: {
    marginBottom: 10,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  modalSubHeaderDescriptionTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  innerPrivacyModalContainer: {
    height: 240,
    marginTop: "136%",
    padding: "4%",
    backgroundColor: COLORS.greyRgba,
    borderRadius: 40,
  },
  innerPrivacyModalContent: {
    right: 5,
    bottom: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  privacyModalLiner: {
    width: "75%",
    marginTop: 8,
    alignSelf: "center",
    borderRadius: 20,
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth * 3,
    opacity: 0.6,
  },

  //request button section
  requestButtonContainer: {
    marginTop: 5,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  privateButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    borderRadius: 30,
    backgroundColor: COLORS.darkGray,
  },
  privacyButtonContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
    height: 40,
    borderRadius: 30,
  },
  requestPrivacyTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  requestGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    borderRadius: 30,
  },
  requestTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },

  //related images section
  flatListColumnWrapperContainer: {
    width: Platform.OS === "ios" ? "98%" : "100%",
  },
  flatListContentContainer: {
    justifyContent: "space-between",
    marginHorizontal: 10,
    width: Platform.OS === "ios" ? "98%" : "95%",
  },
  relatedImagesContainer: {
    width: Platform.OS === "ios" ? "34%" : "34%",
    height: Platform.OS === "ios" ? 150 : 120,
    marginTop: 5,
    marginBottom: 10,
  },
  relatedImageContent: {
    width: "80%",
  },
  relatedImageItem: {
    height: Platform.OS === "ios" ? 150 : 125,
    width: Platform.OS === "ios" ? 130 : 105,
    resizeMode: "cover",
  },

  //media image section
  mediaImageContainer: {
    width: "100%",
    height: 150,
    marginTop: 5,
    marginBottom: 10,
  },
  mediaTextContentContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: Platform.OS === "ios" ? "31.5%" : "31%",
    height: Platform.OS === "ios" ? 150 : 125,
    borderColor: COLORS.white,
    borderWidth: 1,
  },
  mediaTextContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mediaTextItem: {
    marginBottom: 10,
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
});

export default MyCommunityEngagementFullViewScreen;
