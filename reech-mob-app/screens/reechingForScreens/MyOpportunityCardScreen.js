import React, { useState, useEffect } from "react";
import { FlatList, Image, StyleSheet, Text, View, Platform, TouchableOpacity, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import moment from "moment";
import { useSelector } from "react-redux";

//import customs
import { COLORS, SIZES, images } from "../../constants";
import { EmptyFlatlistComponent, LoadingComponent, SortAndFilter } from "../../components";
import NavHeader from "@/components/Headers/NavHeader";
import { useListMyOpportunitiesQuery } from "../../redux/api/opportunity";
import { useListApplicationsQuery } from "../../redux/api/application";

///__________________Tracking database changes__________________
import io from "socket.io-client";
const SOCKET_SERVER_URL = "https://reech-node-api-7o3szyfdpq-uc.a.run.app/";
//`${process.env.REACT_APP_API_URL}${process.env.MAIN_API_BASE_PATH}`;

const MyOpportunityCardScreen = () => {
  const navigation = useNavigation();

  const user = useSelector((state) => state.user.current_user);
  const image = useSelector(
    (state) => state.opportunity_images.opportunityImages
  );

  const [oppData, setOppData] = useState({});

  const [feedSort, setFeedSort] = useState({});
  const [feedFilter, setFeedFilter] = useState({});
  const [responds, setRespond] = useState([]);


  const { data: responders, refetch: refetch_responders } = useListApplicationsQuery();

  const { data, refetch, isFetching, isLoading } = useListMyOpportunitiesQuery({
    activeProfileId: user?._id,
    sortField: feedSort.field,
    sortDirection: feedSort.direction,
    filter: feedFilter,
  });

  useEffect(() => {
    setRespond(responders?.data);
  }, [responders]);

  useEffect(() => {
    setOppData(data?.data);
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
      });
    };
    connectSocket();
  }, []);

  const getResponders = (oppId) => {
    const data = responds?.filter((dt) => dt?.opportunityId === oppId);
    return data;
  };

  const oppExpired = (visibilityEndDate) => {
    var expired = moment(visibilityEndDate).diff(moment(new Date()), "days");
    return expired < 0 ?? false;
  };

  //a method used to filter data according to the jobTitle
  const searchOpportunity = (df, text) => {
    const filt = df?.filter((opp) =>
      opp.jobTitle.toLowerCase().includes(text.toLowerCase())
    );
    setOppData(filt);
  };

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.contentContainerMyOpp}>
        <NavHeader
          message="What would you like to do?"
        />
      </View>
    );
  }

  //top heading section
  function renderHeadingTopSection() {
    return (
      <View style={styles.headingContentContainer}>
        <View style={styles.headingTopLinearItem} />
        <Text style={styles.headingTextItem}>My opportunity cards</Text>
      </View>
    );
  }

  //search section
  function renderSearchComponentSection() {
    return (
      <View style={styles.searchComponentContainer}>
        <View style={styles.searchComponentContents}>
          {/*search component*/}
          <View style={styles.searchComponentItemContainer}>
            <TextInput
              onChangeText={(text) => searchOpportunity(data?.data, text)}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Search"
              placeholderTextColor={COLORS.white}
              style={styles.SearchInputItem}
              enablesReturnKeyAutomatically
              textAlign="center"
            />
          </View>
          <FontAwesome
            name="search"
            size={18}
            color={COLORS.purpleDark}
            style={{ top: Platform.OS === "ios" ? 0 : 5 }}
          />
        </View>
      </View>
    );
  }

  //sort and filter section
  function renderSortAndFilterSection() {
    return (
      <View style={styles.sortAndFilterContainer}>
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

  const rideDummy = [{
    "N_views": 0,
    "NumberOfPassengers": 3,
    "_id": "655ce6b4600b3b3a587e9862",
    "appliedCards": [],
    "bubbleMatesOnly": true,
    "businessOnly": false,
    "carImage": "https://www.freepnglogos.com/uploads/honda-car-png/honda-car-honda-specs-trims-colors-carsm-26.png",
    "carName": "SUV",
    "createdAt": "2023-11-21T17:19:48.915Z",
    "dropOffLocation": "Sandton Drive, Sandhurst, Sandton, South Africa|-26.1034189|28.0426253",
    "embedding": [],
    "learned_embedding": [],
    "luggageOrParcels": "1 bag and 2 suitcase.",
    "partiallyInitialised": true,
    "pickupLocation": "Randburg Sports Club, Praegville, Randburg, South Africa|-26.0955607|27.9849155",
    "pinnedCards": [],
    "playMusic": "My music",
    "rate": 70,
    "rateCurrency": "ZAR|R",
    "requestedWhen": "now",
    "rideStatus": "Requested",
    "score": 2,
    "talkative": "Talkative",
    "temperature": "Cool",
    "tripDistance": "7.968",
    "tripDuration": null,
    "tripType": "General",
    "updatedAt": "2023-11-21T17:19:48.915Z",
    "userId": { "__v": 1, "_id": "641fcf8b0e2a2ab3f721d269", "address": "New Orleans, LA, USA", "blurb": "I consider myself an organisational psychologist who has loves to help others and also make sure that people are always getting the best value for their money. During my spare time I am talent acquisition specialist for an NPO.", "bubbleMateRequest": [Array], "bubbleMates": [Array], "coverImage": "https://storage.googleapis.com/reech-gcp-assets-repo/1cf897a2-8fae-4e1d-996a-2427f6437fb3-_profile-29113F87-DC4A-424C-B625-CD052A4CE912.jpg", "createdAt": "2023-03-26T04:52:27.991Z", "dateOfBirth": "1990-03-25T18:04:10.000Z", "email": "debora12@gmail.com", "empStatus": "unemployed", "firstName": "Debora", "followers": [Array], "identityNumber": "45678654323456", "isOnline": false, "lastName": "Bueksman", "location": [Object], "myHowToIds": [Array], "myThoughtsIds": [Array], "password": "$2b$10$q/.w4ZLoorzFgur/Ib04TukXf/jeqI6/rek6STlO8FOBfor7NW7ai", "phoneNumber": "0785543524", "profileID": [Array], "profileImage": "https://storage.googleapis.com/reech-gcp-assets-repo/3d7f30b4-d649-41df-bee0-eb076e00ebd0-_profile-CE5E8CF7-8A4C-48A6-93D0-9962B5387177.jpg", "updatedAt": "2023-03-26T04:52:27.991Z", "verified": false }
  }
  ];

  //opportunity card collection section
  function renderOpportunityCardCollection() {
    return (
      <View style={styles.opportunityCardCollectionContainer}>
        <FlatList
          data={oppData}
          keyExtractor={(item, index) => index.toString()}
          onRefresh={refetch}
          refreshing={isFetching}
          ListEmptyComponent={<EmptyFlatlistComponent />}
          contentContainerStyle={styles.flatListContentContainer}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled={true}
          renderItem={({ item }) => {
            const oppResponders = getResponders(item?._id);
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("MyOpportunityResponders", {
                    item: item,
                  })
                }
                style={styles.latestOpportunityContainer}
              >
                {/*bottom opportunity section*/}
                <View style={styles.bottomOpportunityCardContainer}>
                  {/*opportunity image section*/}
                  <View style={styles.bottomOpportunityCard}>
                    <Image
                      source={{
                        uri:
                          image[item.oppImage] ??
                          images?.[item.oppImage] ??
                          item.oppImage,
                      }}
                      style={styles.bottomCardImageItem}
                    />
                  </View>

                  {/*opportunity info section*/}
                  <View style={styles.opportunityInfoSectionContainer}>
                    {/*opportunity status section*/}
                    <View style={styles.opportunityStatusContainer}>
                      <View style={styles.opportunityStatusContent}>
                        <Text style={styles.opportunityStatusItem}>
                          {!oppExpired(item?.duration?.selectedEndDate)
                            ? "Live"
                            : "Expired"}
                        </Text>
                      </View>
                    </View>

                    {/*opportunity name section*/}
                    <View style={styles.opportunityNameContainer}>
                      <Text
                        numberOfLines={2}
                        style={styles.opportunityNameItem}
                      >
                        {item.jobTitle}
                      </Text>
                    </View>

                    {/*opportunity info bottom section*/}
                    <View style={styles.bottomOpportunityInfoContainer}>
                      {/*opportunity date*/}
                      <View style={styles.opportunityDateContainer}>
                        <Text style={styles.opportunityDateItem}>
                          Posted:{" "}
                          {moment(item?.duration?.selectedStartDate).format(
                            "DD MMMM"
                          )}
                        </Text>
                      </View>

                      {/*responser section*/}
                      <View style={styles.responderCountImageContainer}>
                        {oppResponders?.length === 0 ? (
                          <View style={styles.responderCountCardEmptyContainer}>
                            <View style={styles.responderCountCardEmptyContent}>
                              <FontAwesome5
                                name="user-alt"
                                size={12}
                                color={COLORS.white}
                              />

                              <View
                                style={styles.responderCountCardTextContent}
                              >
                                <Text style={styles.responderCountCardTextItem}>
                                  0
                                </Text>
                              </View>
                            </View>
                          </View>
                        ) : (
                          <View style={{ flexDirection: "row" }}>
                            {oppResponders && (
                              <View style={styles.responderCountImageContent}>
                                {oppResponders.map((respond, i) => (
                                  <View
                                    key={i}
                                    style={{
                                      maxWidth: 22,
                                      flexDirection: "row",
                                    }}
                                  >
                                    {i < 2 && (
                                      <Image
                                        source={
                                          respond?.userId?.profileImage
                                            ? {
                                              uri:
                                                image[
                                                respond?.userId
                                                  ?.profileImage
                                                ] ??
                                                respond?.userId?.profileImage,
                                            }
                                            : images.defaultRounded
                                        }
                                        style={styles.responderImageItems}
                                      />
                                    )}
                                  </View>
                                ))}
                              </View>
                            )}

                            {oppResponders?.length > 2 ? (
                              <View style={{ left: 26 }}>
                                <LinearGradient
                                  start={{ x: 0, y: 0.5 }}
                                  end={{ x: 1, y: 0.5 }}
                                  colors={[
                                    COLORS.purpleDarker,
                                    COLORS.purpleDark,
                                    COLORS.purple,
                                  ]}
                                  style={styles.moreRespondersTextContainer}
                                >
                                  {oppResponders?.length >= 99 ? (
                                    <Text style={styles.moreRespondersText}>
                                      +99
                                    </Text>
                                  ) : (
                                    <Text style={styles.moreRespondersText}>
                                      +{oppResponders?.length - 2}
                                    </Text>
                                  )}
                                </LinearGradient>
                              </View>
                            ) : null}
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={
            <View
              style={{ marginBottom: Platform.OS === "ios" ? "40%" : "45%" }}
            />
          }
        />
      </View>
    );
  }

  //screen content list
  function renderScreenContentList() {
    return (
      <>
        {renderHeaderSection()}
        {isLoading ? (
          LoadingComponent()
        ) : (
          <View style={styles.screenContentContainer}>
            {renderHeadingTopSection()}
            {renderSearchComponentSection()}
            {renderSortAndFilterSection()}
            {renderOpportunityCardCollection()}
          </View>
        )}
      </>
    );
  }

  //screen content items
  return <View style={styles.container}>{renderScreenContentList()}</View>;
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  contentContainerMyOpp: {
    marginTop: Platform.OS === "android" ? "0%" : "10%",
  },

  //screen content container
  screenContentContainer: {
    marginTop: 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: "#141414",
  },

  //heading top section
  headingContentContainer: {
    marginTop: 25,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headingTopLinearItem: {
    width: "15%",
    marginBottom: 15,
    borderBottomColor: COLORS.white,
    borderBottomWidth: StyleSheet.hairlineWidth * 3,
  },
  headingTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //search section
  searchComponentContainer: {
    flexDirection: "column",
    paddingHorizontal: 15,
    backgroundColor: COLORS.transparent,
  },
  searchComponentContents: {
    flexDirection: "row",
    paddingVertical: Platform.OS === "ios" ? 10 : 5,
    paddingHorizontal: 25,
    borderRadius: 20,
    backgroundColor: COLORS.reechGray,
    marginBottom: 20,
  },
  searchComponentItemContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "93%",
  },
  SearchInputItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    width: "100%",
    alignItems: "center",
  },

  //sort and filter section
  sortAndFilterContainer: {
    marginBottom: 20,
  },

  //opportunity card collection
  opportunityCardCollectionContainer: {
    paddingHorizontal: 0,
    height: "80%",
    backgroundColor: COLORS.transparent,
  },
  flatListContentContainer: {
    paddingHorizontal: SIZES.padding,
  },
  //latest opportunity section
  latestOpportunityContainer: {
    flexDirection: "column",
    padding: 10,
    bottom: 40,
    backgroundColor: COLORS.transparent,
  },

  //bottom opportunity
  bottomOpportunityCardContainer: {
    top: 40,
    width: "100%",
    borderRadius: 15,
    flexDirection: "row",
    backgroundColor: "#0d0d0d",
  },
  bottomOpportunityCard: {
    width: "36%",
  },
  bottomCardImageItem: {
    width: "100%",
    height: 150,
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
    overflow: "hidden",
  },

  //opportunity info section
  opportunityInfoSectionContainer: {
    width: "64%",
    flexDirection: "column",
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  opportunityStatusContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  opportunityStatusContent: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    borderRadius: 15,
    paddingVertical: 2.5,
    backgroundColor: COLORS.darkGray,
  },
  opportunityStatusItem: {
    color: COLORS.white,
    fontSize: 12,
  },
  opportunityNameContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    maxHeight: 50,
  },
  opportunityNameItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
    textAlign: "center",
  },
  bottomOpportunityInfoContainer: {
    top: 30,
    width: "112%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.transparent,
  },
  opportunityDateContainer: {
    width: "60%",
    alignItems: "flex-start",
  },
  opportunityDateItem: {
    color: COLORS.darkGray,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  responderCountImageContainer: {
    width: "40%",
  },
  responderCountCardEmptyContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    maxWidth: 80,
  },
  responderCountCardEmptyContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  responderCountCardTextContent: {
    marginLeft: 5,
    height: 15,
    width: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: COLORS.white,
  },
  responderCountCardTextItem: {
    color: COLORS.black,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  responderCountImageContent: {
    flexDirection: "row",
    alignItems: "flex-end",
    maxWidth: 10,
  },
  responderImageItems: {
    width: 25,
    height: 25,
    borderRadius: 30,
  },
  moreRespondersTextContainer: {
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  moreRespondersText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
});

export default MyOpportunityCardScreen;
