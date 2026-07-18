import React, { useState, useEffect } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Platform,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";
import { FlatList } from "react-native-gesture-handler";
import io from "socket.io-client";

//customs
import { driverDummyHomeScreenData } from "../../../assets/data/DriverDataList";
import { COLORS, icons, images } from "../../../constants";
import {
  EmptyFlatlistComponent,
  LoadingComponent,
  SortAndFilter,
} from "../../../components";
import { useRideFeedQuery } from "@/redux/api/ride";

//track database changes
const SOCKET_SERVER_URL = "https://reech-node-api-7o3szyfdpq-uc.a.run.app/";
//`${process.env.REACT_APP_API_URL}${process.env.MAIN_API_BASE_PATH}/`

const NowOpportunityCardsScreen = () => {
  const navigation = useNavigation();
  const { height } = useWindowDimensions();
  const dispatch = useDispatch();

  const [feedSort, setFeedSort] = useState({});
  const [feedFilter, setFeedFilter] = useState({});

  const current_user = useSelector((state) => state.user.current_user);
  const image = useSelector((state) => state.opportunity_images.opportunityImages);

  const { data, refetch, isLoading } = useRideFeedQuery({
    sortField: feedSort.field,
    sortDirection: feedSort.direction,
    filter: feedFilter,
  })


  //_______________________ Recommendations _______________________
  // const {data: recomendations, refetch: refetchML, isLoading: loadingBeReeched,} = useBeReechedQuery({ _id: current_profile?._id, n: 7 });
  // const { data: oppRecommended, isLoading: loadingOpp } = useListOppsByIdArrayQuery({
  //   body: oppIdArr,
  //   sortField: feedSort.field,
  //   sortDirection: feedSort.direction,
  //   filter: feedFilter,
  // });

  // useEffect(() => {
  //   setOppIdArr(recomendations);
  // }, [recomendations]);

  // useEffect(() => {
  //   console.log('data: ', data?.data)
  // },[data])

  //_________________ Handle Refetch _________________
  useEffect(() => {
    const focusHandler = navigation.addListener("focus", () => {
      refetch();
    });
    return focusHandler;
  }, [navigation]);

  useEffect(() => {
    const connectSocket = async () => {
      const socket = io(SOCKET_SERVER_URL, {
        transports: ["websocket"],
        extraHeaders: {
          "Svc-Tkn": `Bearer ${process.env.SvcTkn_Main_API}`,
        },
      });

      socket.on("ride-updated", (data) => {
        refetch();
      });
    };
    connectSocket();
  }, []);


  const isBubbleMate = (mateId) => {
    const bub = current_user?.bubbleMates?.findIndex((obj) => obj.userId === mateId);
    return bub >= 0;
  };

  //_________________ Money separator _________________
  function formatMoney(n) {
    return (Math.round(n * 100) / 100)
      .toLocaleString("en-US")
      .replace(",", " ");
  }

  //state handlers
  const [urgentPassengerTrip, setUrgentPassengerTrip] = useState(false);

  {
    /*
      1. The driver needs to receive trip notifications while on or off the app
      1.1. We need to show a pop-up that alerts a driver that a passenger has accepted their offer
      1.1.1. Messages need to read : "An urgent trip! {'\n'} 3km from you {'\n'} 20km trip {'\n'} R250 offer"
      1.2. Pop-up needs to have two buttons - "Decline" and "View Trip"
    */
  }

  //top sort and filter section
  function renderTopSortAndFilterSection() {
    return (
      <View style={styles.sortAndFilterOpportunityContainer}>
        <SortAndFilter
          sort={feedSort}
          onSort={({ field, direction }) => {
            console.error("field: ", field, "\ndirection: ", direction);
            if (
              feedSort.field === field &&
              typeof feedSort.direction === "number"
            ) {
              setFeedSort({ field, direction: feedSort.direction * -1 });
            } else {
              setFeedSort({ field, direction });
            }
          }}
          onFilter={({ filter }) => {
            console.log("Filter: ", filter);
            setFeedFilter(filter);
          }}
        />
      </View>
    );
  }

  //opportunity cards section
  const renderOpportunitiesCards = ({ item, index }) => {
    const cardImage = !item?.verified ? item?.oppImage : item?.adImage;

    if (driverDummyHomeScreenData) {
      return (
        <View style={styles.flatListCardContainer}>
          <View style={styles.flatListCardContent}>
            {/*opportunity image section*/}
            <View style={styles.opportunityBackgroundImageContainer}>
              <ImageBackground
                style={styles.opportunityBackgroundImageItem}
                source={
                  item?.dropOffLocation?.includes("Norwood Mall")
                    ? {
                      uri: "https://fastly.4sqi.net/img/general/600x600/SpQQ7kzU5cyr8wB7Hm43QXcxyki4JMQU_66W9oe7vQg.jpg",
                    }
                    : item?.dropOffLocation?.includes("N17 Netcare Hospital")
                      ? {
                        uri: "https://tagi.co.za/wp-content/uploads/2018/10/Netcare_N17_Hospital_main.jpg",
                      }
                      : item?.dropOffLocation?.includes("Germiston High School")
                        ? {
                          uri: "https://www.germistonhs.co.za/wp-content/uploads/2022/02/cropped-WhatsApp-Image-2022-02-07-at-15.48.17-1.jpeg",
                        }
                        : item?.dropOffLocation?.includes("Fourways Mall")
                          ? {
                            uri: "https://arcarchitects.co.za/wp-content/uploads/2019/08/sneak-peek-the-new-fourways-mall-is-going-to-blow-your-mind-4.jpg",
                          }
                          : {
                            uri: "https://arcarchitects.co.za/wp-content/uploads/2019/08/sneak-peek-the-new-fourways-mall-is-going-to-blow-your-mind-4.jpg",
                          }
                }
              >
                {/*account image or icon section*/}
                {isBubbleMate(item?.userId?._id) ? (
                  <ImageBackground
                    source={images.userFrame}
                    style={styles.opportunityIconUserImageContainer}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        if (item?.userId?._id === current_user?._id)
                          navigation.navigate("LoggedInAccountUserScreen");
                        else
                          navigation.navigate("AccountFullViewScreen", {
                            userId: item?.userId?._id,
                          });
                      }}
                    >
                      <Image
                        source={{ uri: item?.userId?.profileImage }}
                        style={styles.opportunityUserImageItem}
                      />
                    </TouchableOpacity>
                  </ImageBackground>
                ) : (
                  <ImageBackground
                    source={images.userFrame}
                    style={styles.opportunityIconUserImageContainer}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        console.log(
                          "redirect to this picked up users account screen"
                        );
                      }}
                    >
                      <Image
                        source={images.u1}
                        style={styles.opportunityUserImageItem}
                      />
                    </TouchableOpacity>
                  </ImageBackground>
                )}

                {/*passenger drop-off info text section*/}
                <View style={styles.opportunityDropOffTextInfoContainer}>
                  <View style={styles.opportunityDropOffTextInfo}>
                    {/*passenger pick location*/}
                    <Text style={styles.opportunityDropOffLocationNormalText}>
                      {item?.pickupLocation?.split("|")?.[0]}
                    </Text>
                    <Text style={[styles.opportunityDropOffTextItem, {marginBottom: 0}]}>
                      To
                    </Text>
                    {/*passenger drop-off location*/}
                    <Text
                      style={
                        styles.opportunityDropOffLocationTextItemWithShadow
                      }
                    >
                      {item?.dropOffLocation?.split("|")?.[0]}
                    </Text>

                    {/*passenger rate*/}
                    {/* <Text style={styles.opportunityDropOffTextItem}>
                      {item?.rateCurrency?.split("|")?.[1]}
                      {Number(item?.rate)
                        ? `${formatMoney(item?.rate)}`
                        : ""}
                    </Text> */}
                  </View>
                </View>

                {/*gradient opportunity section*/}
                <View style={styles.opportunityGradientContainer}>
                  <LinearGradient
                    colors={[COLORS.purple, COLORS.transparent, COLORS.purple]}
                    start={{ x: 0.99, y: 0.0 }}
                    end={{ x: 0.01, y: 0.0 }}
                    style={styles.linearGradientContentContainer}
                  >
                    {/*name and info section*/}
                    <View style={styles.opportunityNameContainer}>
                      {/*opportunity name*/}
                      <View style={styles.opportunityNameContent}>
                        <Text
                          numberOfLines={1}
                          style={styles.opportunityNameTextItem}
                        >
                          {item?.carName}
                        </Text>
                      </View>

                      {/*opportunity info trigger*/}
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          navigation.navigate(
                            "DriverPassengerOpportunityFullViewScreen",
                            { data: item }
                          );
                        }}
                        style={styles.opportunityInfoContent}
                      >
                        <MaterialIcons
                          name="info"
                          size={25}
                          color={COLORS.white}
                        />
                      </TouchableOpacity>
                    </View>

                    {/*location section*/}
                    <View style={styles.opportunityLocationContainer}>
                      <Text
                        numberOfLines={1}
                        style={styles.opportunityLocationTextItem}
                      >
                        {item?.pickupLocation?.split("|")?.[0]}
                      </Text>
                    </View>

                    {/*rate section section*/}
                    <View style={styles.opportunityRateContainer}>
                      <Text style={styles.opportunityRateTextItem}>
                        {item?.rateCurrency?.split("|")?.[1]}
                        {Number(item?.rate)
                          ? `${formatMoney(item?.rate)}`
                          : ""}
                      </Text>
                    </View>
                  </LinearGradient>
                </View>
              </ImageBackground>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View style={!item?.careerAd ? styles.flatListCardContainer : null}>
          <View style={styles.flatListCardContent}>
            {/*opportunity image section*/}
            {!item?.careerAd ? (
              <ImageBackground
                source={{
                  uri: image[cardImage] ?? images?.[cardImage] ?? cardImage,
                }}
                style={styles.opportunityBackgroundImageContainer}
              >
                {/*account image or icon section*/}
                <ImageBackground
                  source={
                    item?.verified ? images.businessFrame : images.userFrame
                  }
                  style={styles.opportunityIconUserImageContainer}
                >
                  {item?.verified ? (
                    //business account image
                    <TouchableOpacity
                      onPress={() =>
                        console.log("redirect to business account screen")
                      }
                    >
                      <Image
                        source={item?.adIcon ? { uri: item?.adIcon } : images.b2}
                        style={styles.opportunityUserImageItem}
                      />
                    </TouchableOpacity>
                  ) : (
                    //user account image
                    <TouchableOpacity
                      onPress={() => {
                        if (item?.userId?._id === current_user?._id)
                          navigation.navigate("LoggedInAccountUserScreen");
                        else
                          navigation.navigate("AccountFullViewScreen", {
                            userId: item?.userId?._id,
                          });
                      }}
                    >
                      <Image
                        source={
                          item?.userId.profileImage
                            ? {
                              uri:
                                image[item?.userId.profileImage] ??
                                item?.userId.profileImage,
                            }
                            : images.u1
                        }
                        style={styles.opportunityUserImageItem}
                      />
                    </TouchableOpacity>
                  )}
                </ImageBackground>

                {/*gradient opportunity section*/}
                {item?.verified ? (
                  //teal gradient info
                  <View style={styles.opportunityGradientContainer}>
                    <LinearGradient
                      colors={["transparent", COLORS.teal, "transparent"]}
                      start={{ x: 0.99, y: 0.0 }}
                      end={{ x: 0.01, y: 0.0 }}
                      style={styles.linearGradientContentContainer}
                    >
                      {/*name and info section*/}
                      <View style={styles.opportunityNameContainer}>
                        {/*opportunity name*/}
                        <View style={styles.opportunityNameContent}>
                          <Text
                            numberOfLines={1}
                            style={styles.opportunityNameTextItem}
                          >
                            {item?.jobTitle}
                          </Text>
                        </View>

                        {/*opportunity info trigger*/}
                        <TouchableOpacity
                          onPress={() => {
                            item?.isVideo
                              ? navigation.navigate("HomeScreenCardFullView", {
                                data: item,
                                idx: index,
                                userId: current_user?._id,
                              })
                              : navigation.navigate("HomeScreenCardFullView", {
                                data: item,
                                idx: index,
                                userId: current_user?._id,
                              });
                          }}
                          style={styles.opportunityInfoContent}
                        >
                          {!item?.isVideo ? (
                            <MaterialIcons
                              name="info"
                              size={25}
                              color={COLORS.white}
                            />
                          ) : (
                            <AntDesign
                              name="play"
                              size={24}
                              color={COLORS.white}
                            />
                          )}
                        </TouchableOpacity>
                      </View>

                      {/*location section*/}
                      <View style={styles.opportunityLocationContainer}>
                        <Text
                          numberOfLines={1}
                          style={styles.opportunityLocationTextItem}
                        >
                          {item?.adLocation}
                        </Text>
                      </View>

                      {/*rate section section*/}
                      <View style={styles.opportunityRateContainer}>
                        <Text style={styles.opportunityRateTextItem}>
                          {[
                            "Collaborator",
                            "Mentor",
                            "Volunteer",
                            undefined,
                          ].includes(item?.rateFrequency)
                            ? ""
                            : "$"}
                          $
                          {Number(item?.rate)
                            ? `${formatMoney(item?.rate)}`
                            : ""}{" "}
                          {`${item?.adExtra ?? ""}`.trim()}
                        </Text>
                      </View>
                    </LinearGradient>
                  </View>
                ) : (
                  //purple gradient info
                  <View style={styles.opportunityGradientContainer}>
                    <LinearGradient
                      colors={["transparent", COLORS.purple, "transparent"]}
                      start={{ x: 0.99, y: 0.0 }}
                      end={{ x: 0.01, y: 0.0 }}
                      style={styles.linearGradientContentContainer}
                    >
                      {/*name and info section*/}
                      <View style={styles.opportunityNameContainer}>
                        {/*opportunity name*/}
                        <View style={styles.opportunityNameContent}>
                          <Text
                            numberOfLines={1}
                            style={styles.opportunityNameTextItem}
                          >
                            {item?.jobTitle}
                          </Text>
                        </View>

                        {/*opportunity info trigger*/}
                        <TouchableOpacity
                          onPress={() => {
                            if (item?.userId?._id === current_user?._id) {
                              navigation.navigate("EditOpportunityCardScreen", {
                                opp: item,
                              });
                            } else {
                              navigation.navigate("HomeScreenCardFullView", {
                                data: item,
                                idx: index,
                                userId: current_user?._id,
                              });
                            }
                          }}
                          style={styles.opportunityInfoContent}
                        >
                          <MaterialIcons
                            name="info"
                            size={25}
                            color={COLORS.white}
                          />
                        </TouchableOpacity>
                      </View>

                      {/*location section*/}
                      <View style={styles.opportunityLocationContainer}>
                        <Text
                          numberOfLines={1}
                          style={styles.opportunityLocationTextItem}
                        >
                          {item?.address}
                        </Text>
                      </View>

                      {/*rate section section*/}
                      <View style={styles.opportunityRateContainer}>
                        <Text style={styles.opportunityRateTextItem}>
                          {[
                            "Collaborator",
                            "Mentor",
                            "Volunteer",
                            undefined,
                          ].includes(item?.rateFrequency)
                            ? ""
                            : `${item?.rateCurrency}`.split("|")[1]}
                          {Number(item?.rate)
                            ? `${formatMoney(item?.rate)}`
                            : ""}{" "}
                          {`${item?.rateFrequency ?? ""}`.trim()}
                        </Text>
                      </View>
                    </LinearGradient>
                  </View>
                )}
              </ImageBackground>
            ) : item?.careerAd ? null : (
              //no content found
              <EmptyFlatlistComponent />
            )}
          </View>
        </View>
      );
    }
  };

  //opportunity card list section
  function renderOpportunityCardListSection() {
    return (
      <View style={[styles.opportunityCardListContainer, { height: height }]}>
        {
          isLoading ? (
            <View style={styles.loadingComponentContainer}>
              <LoadingComponent />
            </View>
          ) :
            driverDummyHomeScreenData && (
              <FlatList
                data={data?.data}
                keyExtractor={(index) => index.toString()}
                renderItem={renderOpportunitiesCards}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={<EmptyFlatlistComponent msg={"Sorry, there are no opportunities for this profile at the moment. Please use a different profile or come back later."} />}
                ListFooterComponent={<View style={styles.flatListFooterStyle} />}
              />
            )}
      </View>
    );
  }

  //urgent trip modal
  function renderUrgentTripPopUpModal() {
    return (
      <Modal
        visible={urgentPassengerTrip}
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        style={styles.driverTripNotificationContainer}
      >
        <ImageBackground
          source={icons.popupBg}
          style={styles.driverNotificationInnerModalContainer}
          resizeMode="cover"
        >
          <View style={styles.driverNotificationTripInnerModalContent}>
            {/*modal heading section*/}
            <View style={styles.modalHeadingSectionContainer}>
              <Text style={styles.modalMainHeadingTextItem}>
                An urgent trip!{"\n"}
              </Text>
            </View>

            <View style={styles.modalTextSectionContainer}>
              <Text style={styles.modalTripTextItem}>3km from you</Text>
              <Text style={styles.modalTripTextItem}>20km trip</Text>
              <Text style={styles.modalTripTextItem}>R270 offer</Text>
            </View>

            {/*modal button section*/}
            <View style={styles.modalTripButtonSectionContainer}>
              <View style={styles.modalTripButtonSectionContent}>
                {/*cancel offer section*/}
                <TouchableOpacity
                  onPress={() => {
                    setUrgentPassengerTrip(false);
                    console.log(
                      "send passenger notification that driver declined trip"
                    );
                  }}
                  style={styles.modalTripButtonContainerText}
                >
                  <Text style={styles.modalTripButtonTextItem}>Decline</Text>
                </TouchableOpacity>

                {/*line section*/}
                <View style={styles.modalTripButtonLiner} />

                {/*send offer section*/}
                <TouchableOpacity
                  onPress={() => {
                    console.log(
                      "navigate driver to this screen: DriverPickingUpPassengerScreen"
                    );
                  }}
                  style={styles.modalTripButtonContainerText}
                >
                  <Text style={styles.modalTripButtonTextItem}>View trip</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      </Modal>
    );
  }

  //screen content list section
  function renderScreenContentList() {
    return (
      <>
        {renderTopSortAndFilterSection()}
        {renderOpportunityCardListSection()}
        {renderUrgentTripPopUpModal()}
      </>
    );
  }

  //screen content renderer section
  return (
    <View style={styles.nowScreenContainer}>{renderScreenContentList()}</View>
  );
};

const styles = StyleSheet.create({
  nowScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //sort and filter section
  sortAndFilterOpportunityContainer: {
    marginTop: 10,
    zIndex: 999,
  },

  //opportunity card list section
  opportunityCardListContainer: {
    marginTop: 50,
  },
  loadingComponentContainer: {
    flex: 0.6,
    justifyContent: "center",
    alignItems: "center",
  },

  //flat list content section
  flatListCardContainer: {
    height: 395,
  },
  flatListCardContent: {
    width: "100%",
    flexDirection: "column",
  },

  //opportunity card info section
  opportunityBackgroundImageContainer: {
    width: "100%",
    height: 350,
    borderRadius: 20,
    overflow: "hidden",
  },
  opportunityBackgroundImageItem: {
    width: "100%",
    height: 350,
    resizeMode: "cover",
    borderRadius: 20,
    overflow: "hidden",
  },
  opportunityIconUserImageContainer: {
    width: 80,
    height: 80,
    marginTop: 20,
    marginLeft: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  opportunityUserImageItem: {
    width: 73,
    height: 73,
    resizeMode: "cover",
    borderRadius: 8,
  },

  //drop-off info text section
  opportunityDropOffTextInfoContainer: {
    marginTop: 15,
    height: 130,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.transparent,
  },
  opportunityDropOffTextInfo: {
    flexDirection: "column",
    paddingTop: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  opportunityDropOffLocationTextItemWithShadow: {
    backgroundColor: COLORS.transparent,
    color: COLORS.white,
    fontSize: 22,
    textAlign: "center",
    fontFamily: "PoppinsBold",
    textShadowColor: COLORS.black,
    textShadowOffset: { width: 5, height: 5 },
    textShadowRadius: 8,
    marginBottom: 10,
  },
  opportunityDropOffLocationNormalText: {
    color: COLORS.white,
    fontSize: 15,
    textAlign: "center",
    fontFamily: "PoppinsBold",
    textShadowColor: COLORS.black,
    textShadowOffset: { width: 5, height: 5 },
    textShadowRadius: 8,
  },
  opportunityDropOffTextItem: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "PoppinsBold",
    textShadowColor: COLORS.black,
    textShadowOffset: { width: 5, height: 5 },
    textShadowRadius: 8,
    marginBottom: 10,
  },

  //gradient section
  opportunityGradientContainer: {
    marginTop: 25,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  linearGradientContentContainer: {
    height: 80,
    paddingHorizontal: 10,
    justifyContent: "center",
    flexDirection: "column",
  },
  opportunityNameContainer: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  opportunityNameContent: {
    width: "85%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  opportunityNameTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  opportunityInfoContent: {
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  opportunityLocationContainer: {
    width: "100%",
    justifyContent: "center",
    flexDirection: "column",
    marginBottom: 2.5,
  },
  opportunityLocationTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  opportunityRateContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  opportunityRateTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //driver notification of trip acceptance
  driverTripNotificationContainer: {
    flexDirection: "column",
  },
  driverNotificationInnerModalContainer: {
    height: Platform.OS === "ios" ? 197 : 192,
    marginTop: Platform.OS === "ios" ? "87%" : "95%",
    marginHorizontal: 5,
    borderRadius: 15,
    overflow: "hidden",
  },
  driverNotificationTripInnerModalContent: {
    height: "100%",
    flexDirection: "column",
    backgroundColor: COLORS.reechGray,
  },
  modalHeadingSectionContainer: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalMainHeadingTextItem: {
    textAlign: "center",
    color: COLORS.white,
    fontSize: 20,
    fontFamily: "PoppinsBold",
  },
  modalTextSectionContainer: {
    marginTop: -10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTripTextItem: {
    textAlign: "center",
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
    marginBottom: 2.5,
  },
  modalTripButtonSectionContainer: {
    height: 52,
    marginTop: 32,
    backgroundColor: COLORS.reechGray,
  },
  modalTripButtonSectionContent: {
    height: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: COLORS.reechGray,
  },
  modalTripButtonContainerText: {
    width: "49%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTripButtonTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  modalTripButtonLiner: {
    width: 0.4,
    backgroundColor: COLORS.darkGray,
  },

  //footer section
  flatListFooterStyle: {
    marginBottom: "68%",
  },
});

export default NowOpportunityCardsScreen;
