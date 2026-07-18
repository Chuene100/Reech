import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  TextInput,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { setUsersImage } from "../../../redux/features/all-user-image-slice";
import { useDispatch } from "react-redux";
import { MaterialIcons, MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useForm } from "react-hook-form";
import io from "socket.io-client";

//customs
import { COLORS, images } from "../../../constants";
import { EmptyFlatlistComponent, LoadingComponent } from "../../../components";
import { useReadUserQuery } from "../../../redux/api/api-slice";
import NavHeader from "@/components/Headers/NavHeader";
import { useListMyCommunityQuery } from "@/redux/api/communityEngagement";
import moment from "moment";


///__________________Tracking database changes__________________
const SOCKET_SERVER_URL = "https://reech-node-api-7o3szyfdpq-uc.a.run.app/";
//`${process.env.REACT_APP_API_URL}${process.env.MAIN_API_BASE_PATH}`;

const MyCommunityEngageScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { value } = useForm();

  const { userId } = route.params;
  const [communityItems, setCommunityItems] = useState([]);
  const image = useSelector((state) => state.users_images.usersImages);

  const { data: user } = useReadUserQuery(userId ?? null);
  const { data: communityData, isLoading, refetch } = useListMyCommunityQuery(userId)

  useEffect(() => {
    if (user) {
      !image[user?.profileImage] && _loadImage(user?.profileImage);
    }
  }, [user]);

  useEffect(() => {
    setCommunityItems(communityData?.data)
  }, [communityData])

  const _loadImage = async (url) => {
    try {
      if (url) {
        const response = await fetch(url);

        const blob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          dispatch(setUsersImage({ url, data: reader.result }));
        };
      }
    } catch (error) {
      console.error(`Error loading image: ${error}`);
    }
  };

  const searchCommunityName = (text) => {
    let filteredData = communityData?.data?.filter((x) =>
      String(x.title.toLowerCase()).includes(text.toLowerCase()) ||
      String(x.address.toLowerCase()).includes(text.toLowerCase())
    );
    setCommunityItems(filteredData);
  };

  useEffect(() => {
    const connectSocket = async () => {
      const socket = io(SOCKET_SERVER_URL, {
        transports: ["websocket"],
        extraHeaders: {
          "Svc-Tkn": `Bearer ${process.env.SvcTkn_Main_API}`,
        },
      });
      socket.on("community-updated", () => {
        refetch();
      });
      socket.on("community-post-updated", () => {
        refetch();
      });
    };
    connectSocket();
  }, []);

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerComponentContainer}>
          <NavHeader
            message="What would you like to do?"
          />

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

  //search section
  function renderSearchFunctionSection() {
    return (
      <View style={styles.searchFunctionContainer}>
        <View style={styles.textInputContainer}>
          <View style={styles.innerTextSearchContainer}>
            <TextInput
              value={value}
              onChangeText={(text) => searchCommunityName(text)}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Search"
              placeholderTextColor={COLORS.white}
              style={styles.inputEngage}
              enablesReturnKeyAutomatically
              textAlign="center"
            />
          </View>
          <FontAwesome name="search" size={16} color={COLORS.purpleDark} style={{ top: Platform.OS === "ios" ? 0 : 5 }} />
        </View>
      </View>
    );
  }

  //content section
  function renderContentSection() {
    return (
      <>
        {isLoading ?
          <View style={styles.loadingContainer}>
            <LoadingComponent />
          </View> :
          <FlatList
            data={communityItems ?? []}
            keyExtractor={(index) => index.toString()}
            renderItem={({ item }) => {
              return (
                <View style={styles.contentSectionContainer}>
                  {/*create an engagement as a community admin*/}
                  <Pressable
                    onPress={() =>
                      navigation.navigate("MyCommunityEngagementFullViewScreen", {
                        userId: userId,
                        item: item,
                      })
                    }
                    style={styles.contentListContainer}
                  >
                    <Image
                      source={{ uri: item.communityImage }}
                      style={styles.contentImageItem}
                    />

                    {/*community engagement title section*/}
                    <View style={styles.contentTitleContainer}>
                      <Text style={styles.contentTitleItem}>
                        {item.title}
                      </Text>
                    </View>

                    {/*community engagement description section*/}
                    <View style={styles.contentDetailsContainer}>
                      {/*date and location section*/}
                      <View style={styles.contentDateContainer}>
                        {/*date*/}
                        <View style={styles.contentDateContent}>
                          <MaterialCommunityIcons
                            name="clock-time-four-outline"
                            size={14}
                            color={COLORS.white}
                          />
                          <Text style={styles.contentDateItem}>
                            {moment(item.communityDate).format('DD-MM-YYYY')}
                          </Text>
                        </View>

                        {/*location*/}
                        <View style={styles.contentLocationContent}>
                          <MaterialIcons
                            name="location-on"
                            size={14}
                            color={COLORS.white}
                          />
                          <Text style={styles.contentLocationItem}>
                            {item.address}
                          </Text>
                        </View>
                      </View>

                      {/*team member section*/}
                      <View style={styles.contentTeamContainer}>
                        <Text style={styles.contentTeamTextItem}>Team</Text>

                        {/*map team member image*/}
                        <View style={styles.contentTeamImageContainer}>
                          {item.team && (
                            <View style={styles.contentTeamMapContainer}>
                              {item.team.map((teamMembers, i) => (
                                <View
                                  style={styles.contentMapImageContainer}
                                  key={i}
                                >
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

                          {item.team.length >= 3 ? (
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
                                {item.team.length >= 9 ? (
                                  <Text style={styles.gradientTextItem}>+9</Text>
                                ) : (
                                  <Text style={styles.gradientTextItem}>
                                    +{item.team.length - 2}
                                  </Text>
                                )}
                              </LinearGradient>
                            </View>
                          ) : null}
                        </View>
                      </View>
                    </View>
                  </Pressable>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<EmptyFlatlistComponent />}
          />}
      </>
    );
  }

  //screen content
  function renderScreenContent() {
    return (
      <>
        {renderHeaderSection()}
        {renderSearchFunctionSection()}
        <View style={styles.flatListContainer}>{renderContentSection()}</View>
      </>
    );
  }

  return <View style={styles.container}>{renderScreenContent()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  flatListContainer: {
    marginTop: 5,
    height: Platform.OS === "ios" ? "75%" : "77%",
  },

  //loading container
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    paddingHorizontal: 15,
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

  //search section
  searchFunctionContainer: {
    flexDirection: "column",
    paddingHorizontal: 15,
    backgroundColor: COLORS.transparent,
  },
  textInputContainer: {
    flexDirection: "row",
    paddingVertical: Platform.OS === "ios" ? 10 : 5,
    paddingHorizontal: 25,
    borderRadius: 20,
    backgroundColor: COLORS.reechGray,
    marginBottom: 10,
  },
  innerTextSearchContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "93%",
  },
  inputEngage: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 14,
    width: "100%",
    alignItems: "center",
  },

  //screen content section
  contentSectionContainer: {
    marginTop: 0,
    height: 270,
  },
  contentListContainer: {
    flexDirection: "column",
    height: 270,
  },
  contentImageItem: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    borderRadius: 20,
  },
  contentTitleContainer: {
    padding: 5,
    top: -130,
    marginHorizontal: 10,
  },
  contentTitleItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  contentDetailsContainer: {
    padding: 5,
    top: -100,
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
    fontSize: 14,
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
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  contentTeamContainer: {
    padding: 2,
    width: "20%",
    left: Platform.OS === "ios" ? 10 : -2,
    justifyContent: "flex-start",
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
});

export default MyCommunityEngageScreen;
