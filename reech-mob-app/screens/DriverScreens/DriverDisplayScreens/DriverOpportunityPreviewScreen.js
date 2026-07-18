import React, { useState, useRef } from "react";
import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { FlatList } from "react-native-gesture-handler";
import CountDownTimer from "react-native-countdown-timer-hooks";

//custom
import { DriverDataList } from "../../../assets/data/DriverDataList";
import { COLORS, images } from "../../../constants";
import { EmptyFlatlistComponent } from "../../../components";
import NavHeader from "@/components/Headers/NavHeader";

const DriverOpportunityPreviewScreen = ({ route }) => {
  const opportunityData = route.params.data;

  //state handlers
  const [valueChange, setValueChange] = useState(opportunityData?.rate);
  const [seeMoreTrigger, setSeeMoreTrigger] = useState(false);
  const [driverDataCollection, setDriverDataCollection] = useState(DriverDataList);
  const [isFetching, setIsFetching] = useState(false);
  const [waitlistTrigger, setWaitlistTrigger] = useState([]);
  const [timerEnd, setTimerEnd] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const fetchData = () => {
    setDriverDataCollection(DriverDataList);
    setIsFetching(false);
  };

  const onRefresh = () => {
    setIsFetching(true);
    fetchData();
  };

  //money separator function
  function formatMoney(n) {
    return (Math.round(n * 100) / 100)
      .toLocaleString("en-US")
      .replace(",", " ");
  }

  // Setting timer flag to finished
  const refTimer = useRef();
  const timerCallbackFunc = (timerFlag) => {
    setTimerEnd(timerFlag);
    alert(
      "Driver offer has finished, do you want to restart the timer again?."
    );
  };

  //remover driver from list
  const removeItem = (itemId) => {
    const updatedData = driverDataCollection.filter(
      (item) => item.id !== itemId
    );
    setDriverDataCollection(updatedData);
  };

  // pin users by clicking waitlist button
  const waitListItem = (itemId) => {
    if (waitlistTrigger.includes(itemId)) {
      setWaitlistTrigger(waitlistTrigger.filter((id) => id !== itemId));
    } else {
      if (waitlistTrigger.length < 2) {
        setWaitlistTrigger([...waitlistTrigger, itemId]);
      }
    }
  };

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerComponentsContainer}>
        <NavHeader
          message="What would you like to do?"
        />
      </View>
    );
  }

  //top image section
  function renderTopImageInfoSection() {
    return (
      <ImageBackground
        style={styles.imageBackgroundContainer}
        source={{ uri: opportunityData.carImage }}
      >
        {/*opp card data*/}
        <LinearGradient
          colors={["transparent", COLORS.purple, "transparent"]}
          start={{ x: 0.99, y: 0.0 }}
          end={{ x: 0.01, y: 0.0 }}
          style={styles.opportunityGradientInfoContainer}
        >
          <View style={styles.opportunityInfoContainer}>
            {/*opp name section*/}
            <View style={styles.opportunityNameContainer}>
              <Text style={styles.opportunityNameItem}>
                {opportunityData.carName}
              </Text>
            </View>

            {/*opp location section*/}
            <View style={styles.opportunityNameContainer}>
              <Text
                numberOfLines={1}
                style={styles.opportunityLocationAndPriceItem}
              >
                {opportunityData.dropOffLocation.split("|")[0]}
              </Text>
            </View>

            {/*opp rate section*/}
            <View style={styles.opportunityNameContainer}>
              <Text style={styles.opportunityLocationAndPriceItem}>
                {opportunityData.rateCurrency[4]}
                {`${formatMoney(opportunityData.rate)}`}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    );
  }

  //trip value section
  function renderTripValueSection() {
    return (
      <View style={styles.tripValueSectionContainer}>
        {/*top trip section*/}
        <View style={styles.tripTextAreaContainer}>
          <View style={styles.emptyContainer} />

          <View style={styles.tripTextContainer}>
            <Text style={styles.tripTextItem}>Your trip</Text>
          </View>

          <TouchableOpacity
            onPress={onRefresh}
            style={styles.tripRefresherContainer}
          >
            <SimpleLineIcons name="reload" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/*middle trip value section*/}
        <View style={styles.tripMiddleSection}>
          {/*decrease value section*/}
          <View style={styles.tripValueActionContainer}>
            <TouchableOpacity
              onPress={() => setValueChange(valueChange - 5)}
              style={styles.tripValueLinearGradient}
            >
              <View style={styles.tripValueDecreaseContainer}>
                <Text style={styles.tripValueDecreaseTextItem}>
                  - {opportunityData.rateCurrency[4]}5
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/*show value section*/}
          <View style={styles.tripValueViewContainer}>
            <Text style={styles.tripValueTextItem}>Your offer</Text>
            <Text style={styles.tripValueText}>
              {opportunityData.rateCurrency[4]}
              {`${formatMoney(valueChange)}`}
            </Text>
          </View>

          {/*increase value section*/}
          <View style={styles.tripValueActionContainer}>
            <TouchableOpacity
              onPress={() => setValueChange(valueChange + 5)}
              style={styles.tripValueLinearGradient}
            >
              <View style={styles.tripValueDecreaseContainer}>
                <Text style={styles.tripValueDecreaseTextItem}>
                  + {opportunityData.rateCurrency[4]}5
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/*linear section*/}
        <View style={styles.screenLine} />
      </View>
    );
  }

  //available driver section
  function renderAvailableDriversListSection() {
    //sort initial data collection by firstName
    const sortedDataList = driverDataCollection
      .slice()
      .sort((a, b) => a.driverFirstName.localeCompare(b.driverFirstName));

    //pin and unpinned driver logic
    const pinnedDriversItems = sortedDataList.filter((item) =>
      waitlistTrigger.includes(item.id)
    );
    const unpinnedDriversItems = sortedDataList.filter(
      (item) => !waitlistTrigger.includes(item.id)
    );

    //render sorted, pinned, and unpinned driver list
    const showDriverDataList = [...pinnedDriversItems, ...unpinnedDriversItems];

    return (
      <View style={styles.availableDriverContainer}>
        <FlatList
          data={showDriverDataList}
          keyExtractor={(item, index) => index.toString()}
          onRefresh={onRefresh}
          refreshing={isFetching}
          renderItem={({ item, index }) => {
            return (
              <View key={index} style={styles.driverItemContentContainer}>
                {/*driver top info section*/}
                <View style={styles.driverItemContainer}>
                  {/*top driver information*/}
                  <View style={styles.topDriverInfoContainer}>
                    {/*driver image section*/}
                    <TouchableOpacity
                      onPress={() =>
                        console.log(
                          "view " +
                          item.driverName +
                          "'s account, unless logged in user is bubble mate with this " +
                          item.driverName +
                          " - then show this driver's profile view"
                        )
                      }
                      style={styles.driverImageContainer}
                    >
                      <ImageBackground
                        source={images.userFrame}
                        style={styles.driverImageBackgroundContainer}
                      >
                        <Image
                          style={styles.driverImageItem}
                          source={item.driverImage}
                        />
                      </ImageBackground>
                    </TouchableOpacity>

                    {/*driver details section*/}
                    <View style={styles.driverTextInfoContainer}>
                      {/*driver name section*/}
                      <View style={styles.driverNameTextContainer}>
                        <Text
                          onPress={() =>
                            console.log(
                              "view " +
                              item.driverName +
                              "'s account, unless logged in user is bubble mate with this " +
                              item.driverName +
                              " - then show this driver's profile view"
                            )
                          }
                          numberOfLines={1}
                          style={styles.driverNameTextItem}
                        >
                          {item.driverFirstName} {item.driverLastName}
                        </Text>

                        {/*show when driver added to waitlist*/}
                        {waitlistTrigger.includes(item.id) ? (
                          <SimpleLineIcons
                            name="pin"
                            size={18}
                            color={COLORS.white}
                          />
                        ) : null}
                      </View>

                      {/*driver blurb section*/}
                      <View style={styles.driverBlurbTextContainer}>
                        <Text
                          numberOfLines={seeMoreTrigger === item.id ? 5 : 2}
                          style={styles.driverBlurbTextItem}
                        >
                          {item.driverBlurb}
                        </Text>
                      </View>

                      {/*see more section*/}
                      <TouchableOpacity
                        key={item.id}
                        onPress={() => setSeeMoreTrigger(item.id)}
                        style={styles.driverSeeMoreTextContainer}
                      >
                        <Text
                          numberOfLines={2}
                          style={styles.driverSeeMoreTextItem}
                        >
                          {seeMoreTrigger === item.id ? "hide" : "...see more"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/*driver rating section*/}
                  <View style={styles.driverRatingContainer}>
                    <Text style={styles.driverRatingTextIdentifier}>
                      Rating
                    </Text>
                    <Text style={styles.driverRatingTextIdentifier}>
                      Overall: {item.driverOverallRating}
                    </Text>
                    <Text style={styles.driverRatingTextIdentifier}>
                      Last{item.driverTotalTrips === 1 || 0 ? null : " "}
                      {item.driverTotalTrips === 1 || 0
                        ? ""
                        : item.driverTotalTrips}{" "}
                      {item.driverTotalTrips === 1 || 0 ? "trip" : "trips"}:{" "}
                      {item.driverTotalTripRating}
                    </Text>
                  </View>
                </View>

                {/*driver offer section*/}
                <View style={styles.driverOfferContainer}>
                  {/*counter offer section*/}
                  <View style={styles.driverOfferCountContainer}>
                    <Text style={styles.driverOfferCountTextItem}>
                      {item.driverCounterOffer
                        ? "Counteroffer: " +
                        `${opportunityData.rateCurrency[4]}${item.driverCounterOfferValue}`
                        : "Counteroffer: none"}
                    </Text>
                  </View>

                  {/*offer count down section*/}
                  {opportunityData.requestedWhen === "now" && "Now" ? (
                    <View
                      style={[
                        styles.driverOfferCountTimerContainer,
                        {
                          backgroundColor: timerEnd ? COLORS.red : COLORS.green,
                        },
                      ]}
                    >
                      {!timerEnd ? (
                        <Text style={styles.driverOfferCountTextItem}>
                          Offer ends in{" "}
                          <CountDownTimer
                            ref={refTimer}
                            timestamp={item.driverOfferTime}
                            timerCallback={timerCallbackFunc}
                            containerStyle={
                              styles.driverTimerCountDownContainer
                            }
                            textStyle={styles.driverOfferCountTextItem}
                          />
                        </Text>
                      ) : (
                        <Text style={styles.driverOfferCountTextItem}>
                          Offer has ended
                        </Text>
                      )}
                    </View>
                  ) : null}
                </View>

                {/*driver acceptance action section*/}
                <View style={styles.driverAcceptContainer}>
                  {/*remove action button*/}
                  <TouchableOpacity
                    onPress={() => removeItem(item.id)}
                    style={styles.driverAcceptContent}
                  >
                    <Text style={styles.driverAcceptTextItem}>Reject</Text>
                  </TouchableOpacity>

                  {/*waitlist action button*/}
                  <TouchableOpacity
                    onPress={() => {
                      waitListItem(item.id);
                      console.log(
                        "waitlisted drivers will now receive notification about being waitlisted, then once you accept this drivers offer, they will be given a green light to fetch you, unselected drivers are told to 'move on'"
                      );
                    }}
                    style={styles.driverAcceptContent}
                  >
                    <Text style={styles.driverAcceptTextItem}>Waitlist</Text>
                  </TouchableOpacity>

                  {/*accept action button*/}
                  <TouchableOpacity
                    onPress={() => setSelectedItemId(item.id)}
                    style={[
                      styles.driverAcceptContent,
                      {
                        backgroundColor:
                          selectedItemId === item.id
                            ? COLORS.green
                            : COLORS.black,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.driverAcceptTextItem,
                        { opacity: selectedItemId === item.id ? 1 : 0.5 },
                      ]}
                    >
                      {selectedItemId === item.id ? "Accepted" : "Accept"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.screenLineBottom} />
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={styles.flatListBottom} />}
          ListEmptyComponent={
            <View style={styles.emptyFlatlistContainer}>
              <EmptyFlatlistComponent />
            </View>
          }
        />
      </View>
    );
  }

  //screen list section
  function renderScreenContentList() {
    return (
      <>
        {renderHeaderSection()}
        {renderTopImageInfoSection()}
        {renderTripValueSection()}
        {renderAvailableDriversListSection()}
      </>
    );
  }

  //screen content list
  return (
    <View style={styles.screenContainer}>{renderScreenContentList()}</View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //header section
  headerComponentsContainer: {
    zIndex: 99,
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },

  //top image section
  imageBackgroundContainer: {
    marginTop: Platform.OS === "ios" ? "-10%" : 0,
    width: Platform.OS === "ios" ? "100%" : "100%",
    height: 250,
    resizeMode: Platform.OS === "ios" ? "cover" : "contain",
    backgroundColor: COLORS.darkGray,
  },
  opportunityGradientInfoContainer: {
    top: 180,
    height: 70,
  },
  opportunityInfoContainer: {
    marginTop: 10,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  opportunityNameContainer: {
    marginBottom: 2,
    paddingHorizontal: 5,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  opportunityNameItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  opportunityLocationAndPriceItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //trip value section
  tripValueSectionContainer: {
    marginTop: 10,
    flexDirection: "column",
  },
  tripTextAreaContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  emptyContainer: {
    width: "10%",
  },
  tripTextContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
  },
  tripTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  tripRefresherContainer: {
    width: "10%",
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  tripMiddleSection: {
    width: "100%",
    marginTop: 10,
    paddingHorizontal: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tripValueActionContainer: {
    width: "20%",
  },
  tripValueLinearGradient: {
    justifyContent: "center",
    alignItems: "center",
  },
  tripValueDecreaseContainer: {
    height: 40,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 30,
    borderColor: COLORS.purple,
    backgroundColor: COLORS.black,
  },
  tripValueDecreaseTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  tripValueViewContainer: {
    width: "55%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  tripValueTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  tripValueText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "PoppinsBold",
  },
  screenLine: {
    width: "80%",
    marginTop: 15,
    alignSelf: "center",
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth * 0.5,
  },

  //available driver section
  availableDriverContainer: {
    marginTop: 15,
    height: Platform.OS === "ios" ? "60%" : "50%",
  },
  driverItemContentContainer: {
    flexDirection: "column",
  },
  driverItemContainer: {
    flexDirection: "column",
    borderRadius: 25,
    paddingHorizontal: Platform.OS === "ios" ? 20 : 30,
    paddingVertical: 15,
    borderColor: COLORS.reechGray,
    borderWidth: 0.5,
    backgroundColor: COLORS.reechGray,
  },
  topDriverInfoContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  driverImageContainer: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  driverImageBackgroundContainer: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  driverImageItem: {
    width: 70,
    height: 70,
    resizeMode: "cover",
    borderRadius: 8,
  },
  driverTextInfoContainer: {
    width: "73%",
    flexDirection: "column",
    paddingVertical: 5,
  },
  driverNameTextContainer: {
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexDirection: "row",
  },
  driverNameTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
    width: "90%",
  },
  driverBlurbTextContainer: {
    marginTop: 5,
  },
  driverBlurbTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    opacity: 0.5,
  },
  driverSeeMoreTextContainer: {
    marginTop: 5,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  driverSeeMoreTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    opacity: 0.5,
  },

  //rating section
  driverRatingContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  driverRatingTextIdentifier: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  driverOfferContainer: {
    marginTop: 15,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  driverOfferCountContainer: {
    width: "48%",
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.2,
    borderColor: COLORS.darkGray,
    borderRadius: 25,
    backgroundColor: COLORS.reechGray,
  },
  driverOfferCountTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    top: Platform.OS === "ios" ? 0 : 0,
  },
  driverTimerCountDownContainer: {
    height: Platform.OS === "ios" ? 20 : 13,
    width: 50,
    marginTop: Platform.OS === "ios" ? -5 : 0,
    justifyContent: "center",
  },
  driverOfferCountTimerContainer: {
    width: "48%",
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: COLORS.transparent,
    borderRadius: 25,
  },

  //accepting section
  driverAcceptContainer: {
    marginTop: 10,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  driverAcceptContent: {
    width: "27%",
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.2,
    borderColor: COLORS.darkGray,
    borderRadius: 25,
  },
  driverAcceptTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    opacity: 0.5,
  },
  screenLineBottom: {
    width: "85%",
    marginTop: 15,
    marginBottom: 10,
    alignSelf: "center",
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth * 0.5,
  },

  //flatlist section
  flatListBottom: {
    marginBottom: Platform.OS === "ios" ? "8%" : "2%",
  },
  emptyFlatlistContainer: {
    marginTop: -30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DriverOpportunityPreviewScreen;
