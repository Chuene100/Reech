import React, { useState, useEffect } from "react";
import {
  Image,
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
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { FlatList } from "react-native-gesture-handler";

//customs
import { COLORS, images } from "../../../constants";
import {
  EmptyFlatlistComponent,
  LoadingComponent,
  SortAndFilter,
} from "../../../components";
import { useBeReechedQuery } from "../../../redux/ml-api/recommendation";
import { useListOppsByIdArrayQuery } from "../../../redux/api/opportunity";

//track database changes
const SOCKET_SERVER_URL = "https://reech-node-api-7o3szyfdpq-uc.a.run.app/";
//`${process.env.REACT_APP_API_URL}${process.env.MAIN_API_BASE_PATH}/`

const LaterOpportunityCardsScreen = () => {
  const navigation = useNavigation();
  const { height } = useWindowDimensions();

  const user = useSelector((state) => state.user.current_user);
  const current_profile = useSelector((state) => state.currentProfile.current_profile);
  const image = useSelector((state) => state.opportunity_images.opportunityImages);

  //_______________________ State handlers _______________________
  const [feedSort, setFeedSort] = useState({});
  const [feedFilter, setFeedFilter] = useState({});
  const [oppIdArr, setOppIdArr] = useState([]);

  //_______________________ Recommendations _______________________
  const { data: recomendations, refetch: refetchML, isLoading: loadingBeReeched } = useBeReechedQuery({ _id: current_profile?._id, n: 7 });
  const { data: oppRecommended, isLoading, refetch, isFetching } = useListOppsByIdArrayQuery({
    body: oppIdArr,
    sortField: feedSort.field,
    sortDirection: feedSort.direction,
    filter: feedFilter,
  });


  useEffect(() => {
    setOppIdArr(recomendations);
  }, [recomendations]);

  useEffect(() => {
    const focusHandler = navigation.addListener("focus", () => {
      refetch();
      refetchML();
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

      socket.on("opportunity-updated", (data) => {
        refetch();
        refetchML();
      });
    };
    connectSocket();
  }, []);

  //_________________ Money separator _________________
  function formatMoney(n) {
    return (Math.round(n * 100) / 100)
      .toLocaleString("en-US")
      .replace(",", " ");
  }

  //top sort and filter section
  function renderTopSortAndFilterSection() {
    return (
      <View style={styles.sortAndFilterOpportunityContainer}>
        <SortAndFilter
          sort={feedSort}
          onSort={({ field, direction }) => {
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
            setFeedFilter(filter);
          }}
        />
      </View>
    );
  }

  //opportunity cards section
  const renderOpportunitiesCards = ({ item, index }) => {
    const cardImage = !item.verified ? item.oppImage : item.adImage;
    return (
      <View
        style={
          !item.careerAd
            ? styles.flatListCardContainer
            : styles.careerOpportunityContainer
        }
      >
        <View style={styles.flatListCardContent}>
          {/*opportunity image section*/}
          {!item.careerAd ? (
            <ImageBackground
              source={{
                uri: image[cardImage] ?? images?.[cardImage] ?? cardImage,
              }}
              style={styles.opportunityBackgroundImageItem}
            >
              {/*account image or icon section*/}
              <ImageBackground
                source={item.verified ? images.businessFrame : images.userFrame}
                style={styles.opportunityIconUserImageContainer}
              >
                {item.verified ? (
                  //business account image
                  <TouchableOpacity
                    onPress={() =>
                      console.log("redirect to business account screen")
                    }
                  >
                    <Image
                      source={item.adIcon ? { uri: item.adIcon } : images.b2}
                      style={styles.opportunityUserImageItem}
                    />
                  </TouchableOpacity>
                ) : (
                  //user account image
                  <TouchableOpacity
                    onPress={() => {
                      if (item.userId?._id === user?._id)
                        navigation.navigate("LoggedInAccountUserScreen");
                      else
                        navigation.navigate("AccountFullViewScreen", {
                          userId: item.userId?._id,
                        });
                    }}
                  >
                    <Image
                      source={
                        item.userId.profileImage
                          ? {
                            uri:
                              image[item.userId.profileImage] ??
                              item.userId.profileImage,
                          }
                          : images.u1
                      }
                      style={styles.opportunityUserImageItem}
                    />
                  </TouchableOpacity>
                )}
              </ImageBackground>

              {/*gradient opportunity section*/}
              {item.verified ? (
                //teal gradient info
                <View style={styles.opportunityGradientContainer}>
                  <LinearGradient
                    colors={[COLORS.teal, COLORS.transparent, COLORS.teal]}
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
                          {item.jobTitle}
                        </Text>
                      </View>

                      {/*opportunity info trigger*/}
                      <TouchableOpacity
                        onPress={() => {
                          item.isVideo
                            ? navigation.navigate("HomeScreenCardFullView", {
                              data: oppRecommended,
                              idx: index,
                              userId: user?._id,
                            })
                            : navigation.navigate("HomeScreenCardFullView", {
                              data: oppRecommended,
                              idx: index,
                              userId: user?._id,
                            });
                        }}
                        style={styles.opportunityInfoContent}
                      >
                        {!item.isVideo ? (
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
                        {item.adLocation}
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
                        ].includes(item.rateFrequency)
                          ? ""
                          : "$"}
                        ${Number(item?.rate) ? `${formatMoney(item.rate)}` : ""}{" "}
                        {`${item.adExtra ?? ""}`.trim()}
                      </Text>
                    </View>
                  </LinearGradient>
                </View>
              ) : (
                //purple gradient info
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
                          {item.jobTitle}
                        </Text>
                      </View>

                      {/*opportunity info trigger*/}
                      <TouchableOpacity
                        onPress={() => {
                          if (item.userId?._id === user?._id) {
                            navigation.navigate("EditOpportunityCardScreen", {
                              opp: item,
                            });
                          } else {
                            navigation.navigate("HomeScreenCardFullView", {
                              data: oppRecommended,
                              idx: index,
                              userId: user?._id,
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
                        {item.address}
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
                        ].includes(item.rateFrequency)
                          ? ""
                          : `${item.rateCurrency}`.split("|")[1]}
                        {Number(item?.rate) ? `${formatMoney(item.rate)}` : ""}{" "}
                        {`${item.rateFrequency ?? ""}`.trim()}
                      </Text>
                    </View>
                  </LinearGradient>
                </View>
              )}
            </ImageBackground>
          ) : item.careerAd ? (
            //career opportunity section
            <View style={styles.careerOpportunityContainer}>
              <View style={styles.careerOpportunityContentItem}>
                <LinearGradient
                  end={{ x: 0.7, y: 0.1 }}
                  locations={[0.5, 0.3, 0.5]}
                  colors={
                    item.careerType === "Nationality"
                      ? ["#181818", "#212121", "#3d3d3d"]
                      : ["#1c4966", "#296d98", "#3792cb"]
                  }
                  style={[
                    styles.linearGradientCareerOpportunityContainer,
                    {
                      backgroundColor:
                        item.careerType === "Nationality"
                          ? "#212121"
                          : "#1c4966",
                    },
                  ]}
                >
                  {/*career ad content*/}
                  <View
                    style={[
                      styles.careerAdContentContainer,
                      {
                        backgroundColor:
                          item.careerType === "Nationality"
                            ? "#212121"
                            : "#1c4966",
                      },
                    ]}
                  >
                    {/*career top section*/}
                    <View style={styles.careerAdTopSectionContainer}>
                      {/*career ad company image*/}
                      <View style={styles.careerAdLogoImageContainer}>
                        <View style={styles.careerAdLogoImageContent}>
                          <Image
                            source={{ uri: item.careerIcon }}
                            style={styles.careerAdLogoImageItem}
                          />
                        </View>
                      </View>

                      {/*career ad company name*/}
                      <View style={styles.careerAdLogoTextContainer}>
                        <Text style={styles.careerAdLogoTextItem}>
                          {item.jobTitle}
                        </Text>
                      </View>
                    </View>

                    {/*career ad middle image*/}
                    <View style={styles.careerAdImageContainer}>
                      <Image
                        source={{ uri: item.careerImage }}
                        style={styles.careerAdImageItem}
                      />

                      {/*career ad info section*/}
                      <View style={styles.careerAdInfoSectionContainer}>
                        {/*career ad info icon section*/}
                        <View style={styles.careerAdIconContainer}>
                          <TouchableOpacity
                            onPress={() =>
                              console.log("show career ad info screen")
                            }
                          >
                            <MaterialIcons
                              name="info"
                              size={25}
                              color={COLORS.white}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>

                    {/*career ad type text section*/}
                    <View style={styles.careerAdTypeContainer}>
                      {/*career ad info text section*/}
                      <View style={styles.careerAdTypeTextContent}>
                        <Text style={styles.careerAdTypeTextItem}>
                          Career Ad
                        </Text>
                      </View>

                      {/*career ad info description section*/}
                      <View style={styles.careerAdTypeDescriptionContainer}>
                        <Text style={styles.careerAdTypeDescriptionTextItem}>
                          Shown to you because of your{" "}
                        </Text>
                        <Text style={styles.careerAdTypeShownTextItem}>
                          {item.careerType}
                        </Text>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </View>
          ) : (
            //no content found
            <EmptyFlatlistComponent />
          )}
        </View>
      </View>
    );
  };

  //opportunity card list section
  function renderOpportunityCardListSection() {
    return (
      <View style={[styles.opportunityCardListContainer, { height: height }]}>
        {isLoading || loadingBeReeched ? (
          <View style={styles.loadingComponentContainer}>
            <LoadingComponent />
          </View>
        ) : (
          <FlatList
            data={oppRecommended}
            onRefresh={refetch}
            isFetching={isFetching}
            keyExtractor={(index) => index.toString()}
            renderItem={renderOpportunitiesCards}
            windowSize={11} // Reduce the window size
            initialNumToRender={5} // Reduce initial render amount
            removeClippedSubviews={true} // Unmount components when outside of window
            maxToRenderPerBatch={6} // Reduce number in each render batch (every scroll)
            updateCellsBatchingPeriod={100} // Increase time between renders in (milliseconds)
            ListEmptyComponent={<EmptyFlatlistComponent msg={"Sorry, there are no opportunities for this profile at the moment. Please use a different profile or come back later."} />}
            ListFooterComponent={<View style={styles.flatListFooterStyle} />}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>
    );
  }

  //screen content list section
  function renderScreenContentList() {
    return (
      <>
        {renderTopSortAndFilterSection()}
        {renderOpportunityCardListSection()}
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

  //gradient section
  opportunityGradientContainer: {
    marginTop: 170,
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

  //career opportunity section
  careerOpportunityContainer: {
    height: Platform.OS === "ios" ? 620 : 530,
    marginBottom: 30,
  },
  careerOpportunityContentItem: {
    height: "100%",
    flexDirection: "column",
    borderRadius: 8,
  },
  linearGradientCareerOpportunityContainer: {
    flexDirection: "column",
    paddingVertical: 25,
    borderRadius: 5,
  },
  careerAdContentContainer: {
    width: "100%",
    flexDirection: "column",
    paddingTop: 15,
    paddingHorizontal: 10,
  },
  careerAdTopSectionContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  careerAdLogoImageContainer: {
    width: "30%",
  },
  careerAdLogoImageContent: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  careerAdLogoImageItem: {
    width: 73,
    height: 73,
    resizeMode: "cover",
  },
  careerAdLogoTextContainer: {
    width: "50%",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  careerAdLogoTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  careerAdImageContainer: {
    height: 360,
    marginTop: 10,
  },
  careerAdImageItem: {
    width: "105%",
    height: "100%",
    right: 10,
    resizeMode: "cover",
  },
  careerAdInfoSectionContainer: {
    marginVertical: -40,
    flexDirection: "column",
  },
  careerAdIconContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  careerAdTypeContainer: {
    marginTop: 20,
    flexDirection: "column",
  },
  careerAdTypeTextContent: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  careerAdTypeTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  careerAdTypeDescriptionContainer: {
    marginTop: 10,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  careerAdTypeDescriptionTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  careerAdTypeShownTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //footer section
  flatListFooterStyle: {
    marginBottom: "68%",
  },
});

export default LaterOpportunityCardsScreen;
