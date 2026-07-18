import React, { useState, useEffect } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  FontAwesome,
  Entypo,
  EvilIcons,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

//import customs
import { oppCardResponders } from "../../assets/data/opportunityRespondersData";
import { COLORS, icons, images } from "../../constants";
import {
  LoadingComponent,
  CustomInputTextAreaOpportunity,
  EmptyFlatlistComponent,
} from "../../components";
import NavHeader from "@/components/Headers/NavHeader";
import { useReadOpportunityDetailsQuery } from "../../redux/api/opportunity";
import { useListOppApplicationsQuery } from "../../redux/api/application";

///__________________Tracking database changes__________________
import io from "socket.io-client";
import DropDown from "@/components/UI/DropDown";
import { scheduleOptions } from "@/assets/data/dropDownData";

const SOCKET_SERVER_URL = "https://reech-node-api-7o3szyfdpq-uc.a.run.app/";
//`${process.env.REACT_APP_API_URL}${process.env.MAIN_API_BASE_PATH}`;

const MyOpportunityResponders = ({ route }) => {
  const navigation = useNavigation();

  // eslint-disable-next-line no-unsafe-optional-chaining
  const { item } = route?.params;
  const current_user = useSelector((state) => state.user.current_user);

  const { control, handleSubmit } = useForm({});

  //state handlers
  const [opp, setOpp] = useState({});
  const [itemCollection, setItemCollection] = useState(oppCardResponders);
  const [isFetching, setIsFetching] = useState(false);
  const [expandedResponders, setExpandedResponders] = useState({});
  const [responderModal, setResponderModal] = useState(false);
  const [selectedResponder, setSelectedResponder] = useState([]);
  const [respArr, setResp] = useState([]);

  const image = useSelector((state) => state.opportunity_images.opportunityImages);

  const { data, refetch, isLoading } = useReadOpportunityDetailsQuery(item?._id);
  const { data: responders, refetch: refetch_responders } = useListOppApplicationsQuery(item?._id);

  useEffect(() => {
    setOpp(data?.data);
  }, [data]);

  useEffect(() => {
    const connectSocket = async () => {
      const socket = io(SOCKET_SERVER_URL, {
        transports: ["websocket"],
        extraHeaders: {
          "Svc-Tkn": `Bearer ${process.env.SvcTkn_Main_API}`,
        },
      });

      socket.on("opportunity-updated", (data) => {
        refetch();
        refetch_responders();
      });
    };
    connectSocket();
  }, []);

  //send response to user
  const onResponsePressed = () => {
    setResponderModal(false);
  };

  //refresh function
  const fetchData = () => {
    setItemCollection(itemCollection);
    setIsFetching(false);
  };
  const onRefresh = () => {
    setIsFetching(true);
    fetchData(itemCollection);
  };

  //money separator function
  function formatMoney(n) {
    //adds space separator
    return (Math.round(n * 100) / 100)
      .toLocaleString("en-US")
      .replace(",", " ");
  }

  // Function to toggle expansion of a responder item
  function toggleExpansion(responderId) {
    setExpandedResponders((prevExpanded) => ({
      ...prevExpanded,
      [responderId]: !prevExpanded[responderId],
    }));
  }

  //toggle the see more option
  function toggleSelection({ responderId, responder }) {
    if (selectedResponder.includes(responderId)) {
      setSelectedResponder((prevSelected) =>
        prevSelected.filter((id) => id !== responderId)
      );
    } else {
      setSelectedResponder((prevSelected) => [...prevSelected, responderId]);
    }

    updateResponders(responder);
  }

  //respond to applicants
  const updateResponders = (item) => {
    var idx = respArr.findIndex((obj) => obj._id === item?._id);
    if (idx !== -1) {
      setResp(respArr.filter((data) => data._id != item._id));
    } else if (idx === -1) {
      setResp([...respArr, { ...item }]);
    } else {
      console.log("You can only select up to four items.");
    }
  };

  //screen header
  function renderHeaderSection() {
    return (
      <View style={styles.contentContainerMyRespondersOpp}>
        <NavHeader
          message="What would you like to do?"
        />
      </View>
    );
  }

  //opportunity top info
  function renderOpportunityTopSection() {
    return (
      <View style={styles.opportunityTopInfoContainer}>
        <ImageBackground
          source={{
            uri:
              image[opp?.oppImage] ?? images?.[opp?.oppImage] ?? opp?.oppImage,
          }}
          style={styles.bgOpportunityImageItem}
        >
          {/*message icons section*/}
          <View style={styles.chatIconContainer}>
            <View style={styles.chatIconContent}>
              <Image source={icons.messageIcon} style={styles.chatIconItem} />
              <View style={styles.chatIconTextItemContainer}>
                <Text style={styles.chatIconTextItem}>
                  {responders?.data?.length ?? 0}
                </Text>
              </View>
            </View>
          </View>

          {/*opportunity info section*/}
          <View style={styles.opportunityInfoCardContainer}>
            <LinearGradient
              colors={[COLORS.purple, COLORS.transparent, COLORS.purple]}
              start={{ x: 0.99, y: 0.0 }}
              end={{ x: 0.01, y: 0.0 }}
            >
              {/*opportunity card info items*/}
              <View style={styles.opportunityInfoItemsContainer}>
                <View style={styles.opportunityCardInfoContainer}>
                  <Text
                    numberOfLines={1}
                    style={styles.opportunityInfoTextName}
                  >
                    {opp?.jobTitle}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("EditOpportunityCardScreen", {
                        opp: opp,
                      })
                    }
                    style={styles.opportunityPencilContainer}
                  >
                    <EvilIcons
                      name="pencil"
                      size={24}
                      color={COLORS.purple}
                      style={{ paddingBottom: 2 }}
                    />
                  </TouchableOpacity>
                </View>
                <Text
                  numberOfLines={1}
                  style={styles.opportunityInfoTextLocation}
                >
                  {opp?.address}
                </Text>
                <Text numberOfLines={1} style={styles.opportunityInfoTextPrice}>
                  {["Collaborator", "Mentor", "Volunteer", undefined].includes(
                    opp?.rateFrequency
                  )
                    ? ""
                    : `${opp?.rateCurrency}`.split("|")[1]}
                  {`${formatMoney(opp?.rate) ?? ""} ${opp?.rateFrequency?.toLowerCase() ?? ""
                    }`.trim()}
                </Text>
              </View>
            </LinearGradient>
          </View>
        </ImageBackground>
      </View>
    );
  }

  //screen middle button section
  function renderMiddleButtonScreenSection() {
    return (
      <View style={styles.middleButtonSectionContainer}>
        <View style={styles.middleHeaderContainer}>
          <Text style={styles.middleHeaderTextItem}>Responders</Text>
        </View>

        {/*reech button section*/}
        <View style={styles.reechButtonContainer}>
          <TouchableOpacity
            style={{ height: 50, width: 250 }}
            onPress={() => setResponderModal(true)}
          >
            <Image
              source={icons.reechButton}
              style={{ height: 50, width: 250 }}
            />
          </TouchableOpacity>
          <Text style={styles.reechTextItem}>
            Click on button to connect with selected candidates
          </Text>
        </View>
      </View>
    );
  }

  //sort and filter section
  function renderSortAndFilterSection() {
    return (
      <View style={styles.sortAndFilterContainer}>
        {/*sort section*/}
        <TouchableOpacity
          onPress={() => console.log("sort option clicked")}
          style={styles.sortContainer}
        >
          <Text style={styles.sortTextItem}>Sort{"     "}</Text>
          <Entypo name="chevron-down" size={24} color={COLORS.white} />
        </TouchableOpacity>

        {/*filter section*/}
        <TouchableOpacity
          onPress={() => console.log("filter option clicked")}
          style={styles.filterContainer}
        >
          <Text style={styles.filterTextItem}>Filter{"     "}</Text>
          <Entypo name="chevron-down" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    );
  }

  //responders section
  function renderRespondersSection() {
    return (
      <View style={styles.responderSectionContainer}>
        <FlatList
          data={responders?.data ?? []}
          keyExtractor={(item, index) => index.toString()}
          onRefresh={onRefresh}
          refreshing={isFetching}
          nestedScrollEnabled={true}
          renderItem={({ item }) => {
            const isSelected = selectedResponder.includes(item._id);
            const isExpanded = expandedResponders[item._id];

            return (
              <>
                <View style={styles.respondersContentItemContainer}>
                  {/*responder image section*/}
                  <View style={styles.respondersImageContainer}>
                    <ImageBackground
                      source={images.userFrame}
                      style={styles.responderImageLinearGradientContainer}
                    >
                      <View style={styles.respondersImageBorder}>
                        <Image
                          source={{ uri: item?.userId?.profileImage }}
                          style={styles.respondersImageItem}
                        />
                      </View>
                    </ImageBackground>
                  </View>

                  {/*responder info section*/}
                  <View style={styles.respondersInfoSectionContainer}>
                    <Text style={styles.respondersTextNameItem}>
                      {item?.userId?.firstName} {item?.userId?.lastName}
                    </Text>

                    {/*description section*/}
                    <View style={styles.respondersDescriptionTextContainer}>
                      <Text
                        numberOfLines={isExpanded ? undefined : 2}
                        style={styles.respondersDescriptionTextItem}
                      >
                        {item?.applicationNote}
                      </Text>
                    </View>

                    {/*see more section*/}
                    <View style={styles.seeMoreTextContainer}>
                      <Text
                        onPress={() => toggleExpansion(item._id)}
                        style={styles.seeMoreTextItem}
                      >
                        {isExpanded ? "...hide" : "...see more"}
                      </Text>
                    </View>

                    {/*location section*/}
                    <View style={styles.responderLocationSectionContainer}>
                      {/*responders info location section*/}
                      <View style={styles.responderLocationSectionContent}>
                        <View style={styles.respondersLocationContainer}>
                          <Ionicons
                            name="md-location-outline"
                            size={16}
                            color={COLORS.white}
                          />
                          <Text
                            numberOfLines={1}
                            style={styles.respondersLocationItem}
                          >
                            {item?.userId?.address}
                          </Text>
                        </View>

                        <View style={styles.respondersExperienceContainer}>
                          <MaterialCommunityIcons
                            name="timer-outline"
                            size={16}
                            color={COLORS.white}
                          />
                          <Text style={styles.respondersLocationItem}>
                            {item?.profileId?.experience === 1
                              ? `${item?.profileId?.experience} year`
                              : `${item?.profileId?.experience} years`}{" "}
                            {"experience"}
                          </Text>
                        </View>
                      </View>

                      {/*responders status section*/}
                      <View style={styles.respondersStatusSectionContainer}>
                        <TouchableOpacity
                          onPress={() =>
                            toggleSelection({
                              responderId: item._id,
                              responder: item,
                            })
                          }
                          style={[
                            styles.respondersStatusSection,
                            {
                              backgroundColor: isSelected
                                ? COLORS.darkGray
                                : COLORS.darkGray,
                            },
                          ]}
                        >
                          <FontAwesome
                            name={isSelected ? "check" : ""}
                            size={18}
                            color={isSelected ? COLORS.white : COLORS.purple}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </>
            );
          }}
          ListFooterComponent={
            <View
              style={{ marginBottom: Platform.OS === "ios" ? "7%" : "18%" }}
            />
          }
          ListEmptyComponent={
            <View style={{ maxHeight: "18%" }}>
              <EmptyFlatlistComponent />
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }

  //responders modal
  function renderRespondersModal() {
    return (
      <Modal
        visible={responderModal}
        transparent={true}
        animationType="slide"
        statusBarTranslucent={true}
        style={styles.respondersModalContainer}
      >
        <View style={styles.respondersModalContentContainer}>
          {/*modal close action section*/}
          <View style={styles.innerActionModalContent}>
            <TouchableOpacity onPress={() => setResponderModal(false)}>
              <Ionicons name="close" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {/*heading section*/}
          <View style={styles.modalHeadingContainer}>
            <Text style={styles.modalHeadingTextItem}>
              {`Let's help you connect!`}
            </Text>

            {/*profile pictures of people you responding to*/}
            <View style={styles.peopleYouRespondingToContainer}>
              {respArr?.map((item, index) => (
                <View style={styles.peopleImageContainer} key={index}>
                  <View style={styles.peopleImageContent}>
                    {index < 5 && (
                      <Image
                        style={styles.peopleImageItem}
                        source={{ uri: item?.userId.profileImage }}
                      />
                    )}
                  </View>

                  {respArr?.length > 5 && (
                    <LinearGradient
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      colors={[
                        COLORS.purpleDarker,
                        COLORS.purpleDark,
                        COLORS.purple,
                      ]}
                      style={styles.peopleImageTextContainer}
                    >
                      {respArr?.length >= 99 ? (
                        <Text style={styles.peopleImageText}>+99</Text>
                      ) : (
                        <Text style={styles.peopleImageText}>
                          +{respArr?.length - 5}
                        </Text>
                      )}
                    </LinearGradient>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/*sub heading section*/}
          <View style={styles.modalSubheadingContainer}>
            <View style={styles.modalSubheadingContent}>
              <Text style={styles.modalSubheadingTextItem}>
                {current_user.firstName}, confirming that you would like to
                reech {selectedResponder.length} individuals?
              </Text>
            </View>

            {/*status section*/}
            <View style={styles.modalStatusSectionContainer}>
              <View style={styles.modalStatusSection}>
                <FontAwesome name="check" size={18} color={COLORS.white} />
              </View>
            </View>
          </View>

          {/*schedule send section*/}
          <View style={styles.scheduleContainer}>
            <Text style={styles.scheduleTextItem}>Choose when to send:</Text>
            <DropDown
              rules={{
                required: "Please select the required schedule",
              }}
              data={scheduleOptions}
              name="scheduleSender"
              control={control}
              placeholder={"Scheduled send"}
              textAlign={'center'}
              iconColor='purple'
            />
          </View>

          {/*message section*/}
          <View style={styles.messageSectionContainer}>
            <Text style={styles.messageHeadingTextItem}>
              {`Type out your message below (use 'name', wherever you wish tor refer to a candidate's name if sending this message to more than 1 candidate)`}
            </Text>

            {/*text are section*/}

            <View style={styles.messageTextAreaContainer}>
              <CustomInputTextAreaOpportunity
                name="respondentMessage"
                control={control}
                rules={{
                  required:
                    "Please enter a message to share with your respondent(s)",
                }}
                placeholder={
                  "Hi ‹Name> \n\nThank you for showing interest in our program. We would love to get to Know you better as we think vou may be a good fit. Are vou available for an interview sometime this week?"
                }
              />
            </View>
          </View>

          {/*response action section*/}
          <View style={styles.responseActionSectionContainer}>
            <TouchableOpacity onPress={handleSubmit(onResponsePressed)}>
              <Image
                source={icons.reechButton}
                style={{ height: 50, width: 250 }}
              />
            </TouchableOpacity>
            <Text style={styles.responseActionTextItem}>
              Click button to send
            </Text>
          </View>
        </View>
      </Modal>
    );
  }

  //screen content list
  function renderScreenContentList() {
    return (
      <>
        {renderHeaderSection()}
        {isLoading ?
          <View style={styles.loadingContainer}>
            <LoadingComponent />
          </View>
          :
          <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={styles.mainContentContainer}
          >
            {renderOpportunityTopSection()}
            {renderMiddleButtonScreenSection()}
            {renderSortAndFilterSection()}
            {renderRespondersSection()}
            {renderRespondersModal()}
          </ScrollView>
        }
      </>
    );
  }

  //screen content
  return <View style={styles.container}>{renderScreenContentList()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  mainContentContainer: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? -50 : -32,
    height: "100%",
  },
  //loading section
  loadingContainer: {
    flex: 1,
  },

  //heading section
  contentContainerMyRespondersOpp: {
    top: Platform.OS === "android" ? "0%" : "5%",
    zIndex: 1,
  },

  //opportunity top section
  opportunityTopInfoContainer: {
    marginTop: 100,
    bottom: 95,
    flexDirection: "column",
  },
  bgOpportunityImageItem: {
    width: "100%",
    height: Platform.OS === "ios" ? 400 : 370,
  },
  chatIconContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? "65%" : "63%",
    width: "100%",
  },
  chatIconContent: {
    position: "relative",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    paddingHorizontal: 12,
    right: 10,
  },
  chatIconItem: {
    position: "absolute",
    width: 50,
    height: 50,
  },
  chatIconTextItemContainer: {
    position: "relative",
    alignItems: "center",
    width: 40,
    left: 8,
    bottom: 14,
  },
  chatIconTextItem: {
    color: COLORS.purple,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },

  //opportunity card info
  opportunityInfoCardContainer: {
    top: Platform.OS === "ios" ? 294 : 263,
    height: 100,
    backgroundColor: COLORS.transparent,
  },
  opportunityInfoCardContent: {
    paddingVertical: 15,
    flexDirection: "column",
  },
  opportunityInfoItemsContainer: {
    paddingVertical: 19,
    paddingHorizontal: 10,
  },
  opportunityCardInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  opportunityInfoTextName: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
    width: "80%",
  },
  opportunityPencilContainer: {
    width: 25,
    height: 25,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  opportunityInfoTextLocation: {
    paddingVertical: 2,
    paddingBottom: 4,
    width: "80%",
    color: COLORS.white,
    fontSize: 13,
    fontFamily: "PoppinsLight",
  },
  opportunityInfoTextPrice: {
    color: COLORS.white,
    fontSize: 13,
    fontFamily: "PoppinsLight",
  },

  //button middle section
  middleButtonSectionContainer: {
    paddingVertical: 5,
    bottom: 95,
  },
  middleHeaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  middleHeaderTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
    marginBottom: 5,
  },
  reechButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  reechTextItem: {
    marginTop: 8,
    color: COLORS.darkGray,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },

  //sort and filter section
  sortAndFilterContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    bottom: 80,
    width: "100%",
  },
  sortContainer: {
    width: "50%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  sortTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  filterContainer: {
    width: "50%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  filterTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },

  //responders section
  responderSectionContainer: {
    flexDirection: "column",
    paddingHorizontal: 10,
    height: "50.5%",
    bottom: 60,
  },
  respondersContentItemContainer: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginTop: 5,
    marginBottom: 15,
    borderRadius: 15,
    backgroundColor: "#0d0d0d",
  },
  responderImageLinearGradientContainer: {
    padding: 4,
    borderRadius: 8,
    zIndex: 1,
  },
  respondersImageContainer: {
    width: "30%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  respondersImageBorder: {
    borderColor: COLORS.black,
    borderWidth: 1,
    borderRadius: 8,
  },
  respondersImageItem: {
    width: Platform.OS === "ios" ? 100 : 85,
    height: Platform.OS === "ios" ? 100 : 85,
    borderRadius: 8,
    borderColor: COLORS.purple,
  },
  respondersInfoSectionContainer: {
    width: "70%",
    flexDirection: "column",
    paddingHorizontal: 10,
  },
  respondersTextNameItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
    marginBottom: 5,
  },
  respondersDescriptionTextContainer: {
    flexDirection: "row",
  },
  respondersDescriptionTextItem: {
    color: COLORS.lightGray,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  seeMoreTextContainer: {
    marginTop: 5,
    alignSelf: "flex-end",
  },
  seeMoreTextItem: {
    color: COLORS.darkGray,
    fontSize: 10,
    fontFamily: "PoppinsLight",
  },
  responderLocationSectionContainer: {
    flexDirection: "row",
    marginTop: 10,
    width: "100%",
  },
  responderLocationSectionContent: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "80%",
  },
  respondersLocationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  respondersLocationItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    left: 5,
  },
  respondersExperienceContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  respondersStatusSectionContainer: {
    justifyContent: "center",
    alignItems: "center",
    left: 20,
  },
  respondersStatusSection: {
    width: 28,
    height: 28,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },

  //responders modal
  respondersModalContainer: {
    flexDirection: "column",
  },
  respondersModalContentContainer: {
    flex: 1,
    marginTop: "20%",
    padding: 15,
    flexDirection: "column",
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    backgroundColor: COLORS.black,
  },
  innerActionModalContent: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 10,
  },
  modalHeadingContainer: {
    marginTop: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  modalHeadingTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  peopleYouRespondingToContainer: {
    marginTop: 15,
    marginBottom: 5,
    width: "40%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  peopleImageContainer: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: 18,
  },
  peopleImageContent: {
    maxWidth: 22,
    flexDirection: "row",
  },
  peopleImageItem: {
    width: 25,
    height: 25,
    borderRadius: 25,
  },
  peopleImageTextContainer: {
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  peopleImageText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  modalSubheadingContainer: {
    marginTop: 10,
    width: "100%",
    flexDirection: "row",
  },
  modalSubheadingContent: {
    width: "75%",
  },
  modalSubheadingTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  modalStatusSectionContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    left: 0,
    width: "25%",
  },
  modalStatusSection: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 28,
    backgroundColor: COLORS.darkGray,
  },
  scheduleContainer: {
    marginTop: 30,
    width: "100%",
  },
  scheduleTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  messageSectionContainer: {
    flexDirection: "column",
    marginTop: Platform.OS === "ios" ? 20 : 15,
  },
  messageHeadingTextItem: {
    color: COLORS.darkGray,
    fontSize: 11,
    fontFamily: "PoppinsLight",
  },
  messageTextAreaContainer: {
    marginTop: 20,
    width: "100%",
    borderRadius: 20,
  },
  responseActionSectionContainer: {
    marginTop: 30,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  responseActionTextItem: {
    marginTop: 10,
    color: COLORS.darkGray,
    fontSize: 10,
    fontFamily: "PoppinsLight",
  },
});

export default MyOpportunityResponders;
