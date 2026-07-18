import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  ImageBackground,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import { FontAwesome5 } from "@expo/vector-icons";

//import customs
import { COLORS, icons, images } from "../../constants";
import { useListMyOpportunitiesQuery } from "../../redux/api/opportunity";
import { useListApplicationsQuery } from "../../redux/api/application";
import { useSelector } from "react-redux";

///__________________Tracking database changes__________________
import io from "socket.io-client";
import NavHeader from "@/components/Headers/NavHeader";
const SOCKET_SERVER_URL = "https://reech-node-api-7o3szyfdpq-uc.a.run.app/";
//`${process.env.REACT_APP_API_URL}${process.env.MAIN_API_BASE_PATH}`;

const ReechingForScreen = () => {
  const navigation = useNavigation();

  const [responds, setRespond] = useState([]);

  const user = useSelector((state) => state.user.current_user);
  const image = useSelector(
    (state) => state.opportunity_images.opportunityImages
  );

  // const { data: responders, refetch: refetch_responders } = useListOppApplicationsQuery(oppId);
  const { data: responders, refetch: refetch_responders } =
    useListApplicationsQuery();

  const { data, refetch } = useListMyOpportunitiesQuery({
    activeProfileId: user?._id,
    sortField: {},
    sortDirection: {},
    filter: {},
  });

  useEffect(() => {
    setRespond(responders?.data);
  }, [responders]);

  useEffect(() => {
    const connectSocket = async () => {
      const socket = io(SOCKET_SERVER_URL, {
        transports: ["websocket"],
        extraHeaders: {
          "Svc-Tkn": `Bearer ${process.env.SvcTkn_Main_API}`,
        },
      });

      socket.on("opportunity-updated", () => {
        refetch();
        refetch_responders();
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

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.contentContainerHomeReeching}>
        <NavHeader />
      </View>
    );
  }

  //top image section
  function renderImageSection() {
    return (
      <View style={styles.imageSectionContainer}>
        <ImageBackground
          source={images.reechForBgImage}
          style={styles.bgImageItem}
        >
          {/*header text section*/}
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTextItem}>{`You're now Reeching for`}</Text>
          </View>

          {/*below text & button*/}
          <View style={styles.belowTextContainerSection}>
            <View style={styles.belowTextContentContainer}>
              <Text style={styles.belowTextItem}>
                Create an opportunity card
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("SearchCategoriesScreen")}
              style={styles.addIconContainer}
            >
              <Image source={icons.addIcon} style={styles.addIconItem} />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }

  //latest opportunity section
  function renderLatestOpportunitySection() {
    return (
      <View style={styles.latestOpportunityContainer}>
        {/*top opportunity section*/}
        <View style={styles.topOpportunityContainer}>
          <Text style={styles.opportunityTextItem}>My opportunity cards</Text>
          <Text
            onPress={() => navigation.navigate("MyOpportunityCardScreen")}
            style={styles.seeAllTextItem}
          >
            See all
          </Text>
        </View>

        {/*bottom opportunity section*/}
        <ScrollView
          horizontal
          scrollEnabled
          pagingEnabled
          snapToAlignment="center"
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.opportunityCardsContainer}
        >
          {data?.data.map((opportunity, index) => {
            const oppResponders = getResponders(opportunity?._id);
            return (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  navigation.navigate("MyOpportunityResponders", {
                    item: opportunity,
                  })
                }
                style={[
                  styles.bottomOpportunityCardContainer,
                  {
                    marginLeft: index === 0 ? Platform.OS === "ios" ? 0 : -10 : 10,
                  },
                ]}
              >
                {/*opportunity image section*/}
                <View style={styles.bottomOpportunityCard}>
                  <Image
                    source={{
                      uri:
                        opportunity?.oppImage ??
                        images?.[opportunity.oppImage] ??
                        opportunity.oppImage,
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
                        {!oppExpired(opportunity?.duration?.selectedEndDate)
                          ? "Live"
                          : "Expired"}
                      </Text>
                    </View>
                  </View>

                  {/*opportunity name section*/}
                  <View style={styles.opportunityNameContainer}>
                    <Text numberOfLines={2} style={styles.opportunityNameItem}>
                      {opportunity?.jobTitle}
                    </Text>
                  </View>

                  {/*opportunity info bottom section*/}
                  <View style={styles.bottomOpportunityInfoContainer}>
                    {/*opportunity date*/}
                    <View style={styles.opportunityDateContainer}>
                      <Text style={styles.opportunityDateItem}>
                        Posted:{" "}
                        {moment(
                          opportunity?.duration?.selectedStartDate
                        ).format("DD MMMM")}
                      </Text>
                    </View>

                    {/*responser section*/}
                    <View style={styles.responderCountImageContainer}>
                      {oppResponders?.length === 0 ? (
                        <View style={styles.responderCountEmptyContainer}>
                          <View style={styles.responderCountEmptyContent}>
                            <FontAwesome5
                              name="user-alt"
                              size={12}
                              color={COLORS.white}
                            />

                            <View style={styles.responderCountTextContent}>
                              <Text style={styles.responderCountTextItem}>
                                0
                              </Text>
                            </View>
                          </View>
                        </View>
                      ) : (
                        <View style={styles.responderCountImageContent}>
                          {oppResponders?.map((respond, i) => (
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
                                          respond?.userId?.profileImage
                                          ] ?? respond?.userId?.profileImage,
                                      }
                                      : images.defaultRounded
                                  }
                                  style={styles.responderImageItems}
                                />
                              )}
                            </View>
                          ))}

                          {oppResponders?.length > 2 && (
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
                          )}
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  //screen content section
  function renderScreenContentSection() {
    return (
      <>
        {renderHeaderSection()}
        {renderImageSection()}
        {renderLatestOpportunitySection()}
      </>
    );
  }

  //screen items
  return <View style={styles.container}>{renderScreenContentSection()}</View>;
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //heading section
  contentContainerHomeReeching: {
    marginTop: Platform.OS === "android" ? "0%" : "11%",
    zIndex: 1,
  },

  //image section
  imageSectionContainer: {
    flexDirection: "column",
    height: "60%",
  },
  bgImageItem: {
    bottom: 110,
    width: "100%",
    height: Platform.OS === "ios" ? "109%" : "112%",
  },
  headerTextContainer: {
    top: 170,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  belowTextContainerSection: {
    top: Platform.OS === "ios" ? "126%" : "120%",
    width: "100%",
    flexDirection: "row",
    paddingVertical: 5,
  },
  belowTextContentContainer: {
    marginHorizontal: 25,
    width: "65%",
  },
  belowTextItem: {
    top: 18,
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "PoppinsBold",
  },
  addIconContainer: {
    width: "35%",
  },
  addIconItem: {
    left: Platform.OS === "ios" ? "5%" : "0%",
    width: 65,
    height: 65,
  },

  //latest opportunity section
  latestOpportunityContainer: {
    flexDirection: "column",
    padding: 10,
    height: "35%",
  },
  topOpportunityContainer: {
    top: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    zIndex: 1,
  },
  opportunityTextItem: {
    width: "70%",
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  seeAllTextItem: {
    top: 2,
    color: COLORS.purple,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //bottom opportunity
  opportunityCardsContainer: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  bottomOpportunityCardContainer: {
    top: 40,
    width: Platform.OS === "ios" ? 400 : 340,
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
  responderCountEmptyContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    maxWidth: 80,
  },
  responderCountEmptyContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  responderCountTextContent: {
    marginLeft: 5,
    height: 15,
    width: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: COLORS.white,
  },
  responderCountTextItem: {
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
    borderRadius: 25,
  },
  moreRespondersTextContainer: {
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  moreRespondersText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
});

export default ReechingForScreen;
