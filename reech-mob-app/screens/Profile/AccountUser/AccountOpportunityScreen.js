import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Text, View, Platform, TouchableOpacity, TextInput, ImageBackground, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import io from "socket.io-client";
import moment from "moment";

//import customs
import { COLORS, SIZES, images } from "../../../constants";
import { EmptyFlatlistComponent, LoadingComponent, SortAndFilter } from "../../../components";
import { useListMyOpportunitiesQuery } from "../../../redux/api/opportunity";
import NavHeader from "@/components/Headers/NavHeader";

//track database changes
const SOCKET_SERVER_URL = "https://reech-node-api-7o3szyfdpq-uc.a.run.app/";
//`${process.env.REACT_APP_API_URL}${process.env.MAIN_API_BASE_PATH}/`

const AccountOpportunityScreen = ({ route }) => {
  const navigation = useNavigation();

  const { value } = useForm();

  const { user } = route.params;

  const image = useSelector((state) => state.opportunity_images.opportunityImages);

  const [feedSort, setFeedSort] = useState({});
  const [feedFilter, setFeedFilter] = useState({});
  const [oppCardInfoModal, setOppCardInfoModal] = useState(false);

  const {
    data: myOpportunityCard,
    refetch,
    isFetching,
    isLoading,
  } = useListMyOpportunitiesQuery({
    activeProfileId: user?._id,
    sortField: feedSort.field,
    sortDirection: feedSort.direction,
    filter: feedFilter,
  });

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

  useEffect(() => {
    const focusHandler = navigation.addListener("focus", () => {
      refetch();
    });
    return focusHandler;
  }, [navigation]);

  const searchCards = (text) => {
    console.log(text);
  };

  const oppExpired = (visibilityEndDate) => {
    var expired = moment(visibilityEndDate).diff(moment(new Date()), "days");
    return expired < 0 ?? false;
  };

  function formatMoney(n) {
    return (Math.round(n * 100) / 100)
      .toLocaleString("en-US")
      .replace(",", " ");
  }

  const renderLoadingComponent = () => (
    <View style={styles.loadingComponent}>
      <LoadingComponent />
    </View>
  );

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContentTop}>
        <NavHeader message="What would you like to do?" />
      </View>
    );
  }

  //top heading section
  function renderHeadingTopSection() {
    return (
      <View style={styles.headingContentsContainer}>
        <View style={styles.headingTopLinearsItem} />
        <Text style={styles.headingTextsItem}>Opportunity cards posted</Text>
      </View>
    );
  }

  //search opportunity
  function renderSearchFunctionSection() {
    return (
      <View style={styles.searchComponentsContainer}>
        <View style={styles.searchComponentsContents}>
          {/*search component*/}
          <View style={styles.searchComponentsItemContainer}>
            <TextInput
              value={value}
              onChangeText={(text) => searchCards(text)}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Search"
              placeholderTextColor={COLORS.white}
              style={styles.SearchInputsItem}
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
      <View style={styles.sortAndFiltersContainer}>
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

  //screen content list
  function renderOpportunityCardCollection() {
    return (
      <View style={styles.opportunitysCardCollectionsContainer}>
        <FlatList
          data={myOpportunityCard?.data}
          keyExtractor={(item, index) => index.toString()}
          onRefresh={refetch}
          refreshing={isFetching}
          ListEmptyComponent={<EmptyFlatlistComponent />}
          contentContainerStyle={styles.flatListsContentsContainer}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled={true}
          renderItem={({ item, index }) => {
            return (
              <View style={styles.flatListsCardContainer}>
                <View style={styles.flatListsCardContent}>
                  {/*opportunity image section*/}
                  <View style={styles.opportunitysBackgroundImageContainer}>
                    <ImageBackground
                      style={styles.opportunitysBackgroundImageItem}
                      source={{
                        uri:
                          image[item.oppImage] ??
                          images?.[item.oppImage] ??
                          item.oppImage,
                      }}
                    >
                      {/*account image or icon section*/}
                      <View style={styles.opportunitysStatusAndImageContainer}>
                        {/*user profile picture section*/}
                        <ImageBackground
                          source={images.userFrame}
                          style={styles.opportunitysIconUserImageContainer}
                        >
                          <TouchableOpacity
                            onPress={() => navigation.goBack()}
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
                              style={styles.opportunitysUserImageItem}
                            />
                          </TouchableOpacity>
                        </ImageBackground>

                        {/*opportunity card status section*/}
                        <View style={styles.opportunitysStatusContainer}>
                          <View style={styles.opportunitysStatusContent}>
                            <Octicons
                              name="dot-fill"
                              size={16}
                              color={!oppExpired(item?.duration?.selectedEndDate) ? COLORS.greenActive : COLORS.red}
                            />
                            <Text style={styles.opportunitysStatusItem}>
                              {!oppExpired(item?.duration?.selectedEndDate)
                                ? "Live"
                                : "Expired"}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/*gradient opportunity section*/}
                      <View style={styles.opportunitysGradientContainer}>
                        <LinearGradient
                          colors={[COLORS.purple, COLORS.transparent, COLORS.purple]}
                          start={{ x: 0.99, y: 0.0 }}
                          end={{ x: 0.01, y: 0.0 }}
                          style={styles.linearsGradientContentContainer}
                        >
                          {/*name and info section*/}
                          <View style={styles.opportunitysNameContainer}>
                            {/*opportunity name*/}
                            <View style={styles.opportunitysNameContent}>
                              <Text
                                numberOfLines={1}
                                style={styles.opportunitysNameTextItem}
                              >
                                {item.jobTitle}
                              </Text>
                            </View>

                            {/*opportunity info trigger*/}
                            <TouchableOpacity
                              key={index}
                              onPress={() => {
                                oppExpired(item?.duration?.selectedEndDate)
                                  ? setOppCardInfoModal(true)
                                  : navigation.navigate("HomeScreenCardFullView", {
                                    data: myOpportunityCard?.data,
                                    idx: index,
                                    userId: user?._id,
                                  })
                              }
                              }
                              style={styles.opportunitysInfoContent}
                            >
                              <MaterialIcons
                                name="info"
                                size={25}
                                color={COLORS.white}
                              />
                            </TouchableOpacity>
                          </View>

                          {/*location section*/}
                          <View style={styles.opportunitysLocationContainer}>
                            <Text
                              numberOfLines={1}
                              style={styles.opportunitysLocationTextItem}
                            >
                              {item.address}
                            </Text>
                          </View>

                          {/*rate section section*/}
                          <View style={styles.opportunitysRateContainer}>
                            <Text style={styles.opportunitysRateTextItem}>
                              {["Collaborator", "Mentor", "Volunteer", undefined]
                                .includes(item.rateFrequency)
                                ? ""
                                : `${item.rateCurrency}`.split("|")[1]}
                              {Number(item?.rate)
                                ? `${formatMoney(item.rate)}`
                                : ""}{" "}
                              {`${item.rateFrequency ?? ""}`.trim()}
                            </Text>
                          </View>
                        </LinearGradient>
                      </View>
                    </ImageBackground>
                  </View>
                </View>

                {/*opportunity expired card info modal*/}
                {renderExpiredOpportunityPopupModal({ item })}
              </View>
            )
          }}
          ListFooterComponent={<View style={styles.flatListsFooterStyle} />}
        />
      </View>
    );
  }

  //opportunity expired modal section
  function renderExpiredOpportunityPopupModal({ item }) {
    return (
      <Modal
        visible={oppCardInfoModal}
        statusBarTranslucent={true}
        animationType="slide"
        transparent={true}
        style={styles.expiredOppModalContainer}
      >
        <View style={styles.expiredOppInnerModalContainer}>
          {/*modal close action section*/}
          <View style={styles.expiredOppInnerModalContent}>
            <TouchableOpacity onPress={() => setOppCardInfoModal(false)}>
              <Ionicons name="close" size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {/*more modal option section */}
          <View style={styles.expiredOppModalOptionContent}>
            {/*top section*/}
            <View style={styles.expiredOppHeadingTextContainer}>
              <Text style={styles.expiredOppHeadingTextItem}>Opportunity Card Expired</Text>
            </View>

            {/*info section*/}
            <View style={styles.expiredOppInfoTextContainer}>
              <Text style={styles.expiredOppInfoTextItem}>
                Please keep in mind that the <Text style={styles.expiredOppInfoTextBoldItem}>{item.jobTitle} </Text>
                opportunity card you attempted to apply for has already expired. Please try again or apply for
                another one with a live status.
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  function renderScreenContentList() {
    return (
      <>
        {renderHeaderSection()}
        {isLoading ? (
          renderLoadingComponent()
        ) : (
          <View style={styles.screenContentListsContainer}>
            {renderHeadingTopSection()}
            {renderSearchFunctionSection()}
            {renderSortAndFilterSection()}
            {renderOpportunityCardCollection()}
          </View>
        )}
      </>
    )
  }

  return (
    <View style={styles.container}>
      {renderScreenContentList()}
    </View>
  );
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerContentTop: {
    marginTop: Platform.OS === "ios" ? "10%" : 0,
  },

  //loading component
  loadingComponent: {
    flex: 1,
  },

  //screen content container
  screenContentListsContainer: {
    marginTop: 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: "#141414",
  },

  //heading top section
  headingContentsContainer: {
    marginTop: 25,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headingTopLinearsItem: {
    width: "15%",
    marginBottom: 15,
    borderBottomColor: COLORS.white,
    borderBottomWidth: StyleSheet.hairlineWidth * 3,
  },
  headingTextsItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //search section
  searchComponentsContainer: {
    flexDirection: "column",
    paddingHorizontal: 15,
    backgroundColor: COLORS.transparent,
  },
  searchComponentsContents: {
    flexDirection: "row",
    paddingVertical: Platform.OS === "ios" ? 10 : 5,
    paddingHorizontal: 25,
    borderRadius: 20,
    backgroundColor: COLORS.reechGray,
    marginBottom: 20,
  },
  searchComponentsItemContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "93%",
  },
  SearchInputsItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    width: "100%",
    alignItems: "center",
  },

  //sort and filter section
  sortAndFiltersContainer: {
    marginBottom: 20,
  },

  //opportunity card collection
  opportunitysCardCollectionsContainer: {
    paddingHorizontal: 0,
    height: "80%",
    backgroundColor: COLORS.transparent,
  },
  flatListsContentsContainer: {
    paddingHorizontal: SIZES.padding,
  },
  flatListsCardContainer: {
    height: 395,
  },
  flatListsCardContent: {
    width: "100%",
    flexDirection: "column",
  },

  //opportunity card info section
  opportunitysBackgroundImageContainer: {
    width: "100%",
    height: 350,
    borderRadius: 20,
    overflow: "hidden",
  },
  opportunitysBackgroundImageItem: {
    width: "100%",
    height: 350,
    resizeMode: "cover",
    borderRadius: 20,
    overflow: "hidden",
  },
  opportunitysStatusAndImageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  opportunitysIconUserImageContainer: {
    width: 80,
    height: 80,
    marginTop: 20,
    marginLeft: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  opportunitysUserImageItem: {
    width: 73,
    height: 73,
    resizeMode: "cover",
    borderRadius: 8,
  },
  opportunitysStatusContainer: {
    marginTop: 25,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 20,
  },
  opportunitysStatusContent: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: 75,
    borderRadius: 15,
    paddingVertical: 3,
    backgroundColor: COLORS.darkGray,
  },
  opportunitysStatusItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    marginLeft: 5,
  },

  //gradient section
  opportunitysGradientContainer: {
    marginTop: 170,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  linearsGradientContentContainer: {
    height: 80,
    paddingHorizontal: 10,
    justifyContent: "center",
    flexDirection: "column",
  },
  opportunitysNameContainer: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  opportunitysNameContent: {
    width: "85%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  opportunitysNameTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  opportunitysInfoContent: {
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  opportunitysLocationContainer: {
    width: "100%",
    justifyContent: "center",
    flexDirection: "column",
    marginBottom: 2.5,
  },
  opportunitysLocationTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  opportunitysRateContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  opportunitysRateTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //footer section
  flatListsFooterStyle: {
    marginBottom: "32%",
  },

  //expired opportunity pop-up modal
  expiredOppModalContainer: {
    marginTop: 10,
  },
  expiredOppInnerModalContainer: {
    marginTop: Platform.OS === "ios" ? "176%" : "166%",
    padding: "4%",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: COLORS.black,
  },
  expiredOppInnerModalContent: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  expiredOppModalOptionContent: {
    marginTop: 5,
    flexDirection: "column",
    marginBottom: Platform.OS === "ios" ? 30 : 20,
  },
  expiredOppHeadingTextContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  expiredOppHeadingTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  expiredOppInfoTextContainer: {
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  expiredOppInfoTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    textAlign: "center",
  },
  expiredOppInfoTextBoldItem: {
    fontFamily: "PoppinsBold",
  },
});

export default AccountOpportunityScreen;
