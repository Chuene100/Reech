import React, { useState, useEffect } from "react";
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Octicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";

//custom
import { COLORS, icons, images } from "../../../../constants";
import { EmptyFlatlistComponent, LoadingComponent } from "../../../../components";
import NavHeader from "@/components/Headers/NavHeader";
import { useListMyProfilesQuery, useReadBubbleMatesQuery } from "../../../../redux/api/api-slice";
import { useSelector } from "react-redux";

///__________________Tracking database changes__________________
import io from "socket.io-client";
const SOCKET_SERVER_URL = "https://reech-node-api-7o3szyfdpq-uc.a.run.app/";
//`${process.env.REACT_APP_API_URL}${process.env.MAIN_API_BASE_PATH}`;

const BubbleMateListScreen = ({ route }) => {
  const { user } = route.params;

  const { value } = useForm();

  const navigation = useNavigation();
  const [bubbleMates, setBubbleMates] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);

  const image = useSelector((state) => state.users_images.usersImages);
  const current_user = useSelector((state) => state.user.current_user);

  const mates_arr = user?.bubbleMates?.filter((m) => m.status === "Mate");

  const {
    
    data: myProfiles, isLoading: isLoadingProfile, error: profileError } = useListMyProfilesQuery(user?._id ?? null);
  const { data, refetch, isLoading, error } = useReadBubbleMatesQuery(mates_arr);

  const sharedBubbleMates = (mate) => {
    const mateSet = new Set(
      mate?.bubbleMates
        ?.map((obj) => {
          if (obj.status === "Mate") return obj.userId;
          return undefined;
        })
        .filter(Boolean)
    );

    const myMateList = current_user?.bubbleMates
      ?.filter((obj) => {
        if (obj.status === "Mate") return mateSet?.has(obj.userId);
        return undefined;
      })
      .filter(Boolean);

    return myMateList;
  };

  const extractTitle = (user) => {
    let titles = [];
    user?.profileID?.forEach((profile) => {
      const p = profile.jobTitleId;
      titles.push(p.jobTitle);
    });
    return titles;
  };

  useEffect(() => {
    setBubbleMates(data?.data);
    let titles = [];
    data?.data?.forEach((user) => {
      user?._id !== current_user?._id &&
        user?.profileID?.forEach((profile) => {
          const p = profile.jobTitleId;
          titles.push(p.jobTitle);
        });
    });
    setJobTitles(titles);
  }, [data]);

  useEffect(() => {
    const connectSocket = async () => {
      const socket = io(SOCKET_SERVER_URL, {
        transports: ["websocket"],
        extraHeaders: {
          "Svc-Tkn": `Bearer ${process.env.SvcTkn_Main_API}`,
        },
      });

      
      socket.on("user-updated", (data) => {
        refetch();
      });
    };
    connectSocket();
  }, []);

  //filter data according to the username
  const searchBubbleMates = (text) => {
    console.log(text);
  };

  //screen loading component
  const loadingComponent = () => (
    <View style={styles.loadingComponent}>
      <LoadingComponent />
    </View>
  );

  //render header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <NavHeader message="What would you like to do?" />
      </View>
    );
  }

  //render header section
  function renderHeaderContentSection() {
    return (
      <View style={styles.headerContentContainer}>
        {/*top image & header section*/}
        <View style={styles.headerImageSectionContainer}>
          <Image source={icons.bubbleList} style={styles.bubbleIconItem} />
          <Text style={styles.bubbleMateHeadingTextItem}>Bubble mates</Text>
        </View>

        {/*search component section*/}
        <View style={styles.searchContainer}>
          <View style={styles.innerSearchContainer}>
            <View style={styles.searchTextContainer}>
              <TextInput
                value={value}
                onChangeText={(text) => searchBubbleMates(text)}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Search"
                placeholderTextColor={COLORS.white}
                style={styles.inputBubList}
                enablesReturnKeyAutomatically
                textAlign="center"
              />
            </View>
            <FontAwesome name="search" size={16} color={COLORS.purple} style={{ top: Platform.OS === "ios" ? 0 : 5 }} />
          </View>
        </View>
      </View>
    );
  }

  //filter section
  function renderFilterSection() {
    return (
      <>
        <View style={styles.filterSectionContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("BubbleMateFilterScreen")}
            style={styles.filterTextSectionContainer}
          >
            <Text style={styles.filterTextItem}>Filter</Text>
            <FontAwesome name={"chevron-down"} size={14} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <View style={styles.filterLineDivider} />
      </>
    );
  }

  //search result section
  function renderResultScreenSection() {
    const jobTitleSet = new Set(jobTitles);
    return (
      <View style={styles.scrollResultContainer}>
        <>
          {/*bubble mate items*/}
          <View style={styles.countryContainer}>
            <FlatList
              // eslint-disable-next-line no-unsafe-optional-chaining
              data={[...jobTitleSet?.keys()] ?? []}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item: jobTitle }) => {
                return (
                  //horizontal scroll section
                  <View style={{ marginHorizontal: 10, marginBottom: 20 }}>
                    <Text style={styles.imageText}>{jobTitle}</Text>
                    <View>
                      <FlatList
                        horizontal
                        data={bubbleMates}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => {
                          return (
                            <>
                              {extractTitle(item)?.includes(jobTitle) && (
                                <View>
                                  {item._id !== current_user._id && (
                                    <TouchableOpacity
                                      key={index}
                                      onPress={() =>
                                        navigation.navigate(
                                          "AccountFullViewScreen",
                                          {
                                            userId: item._id,
                                          }
                                        )
                                      }
                                      style={styles.imageContainer}
                                    >
                                      {/*user profile picture*/}
                                      <View style={styles.imageActiveContainer}>
                                        <Image
                                          source={
                                            item?.profileImage
                                              ? {
                                                uri:
                                                  image[item.profileImage] ??
                                                  item.profileImage,
                                              }
                                              : images.defaultRounded
                                          }
                                          style={styles.bubbleImages}
                                        />

                                        {/*active icon status*/}
                                        <View
                                          style={styles.activeIconItemContainer}
                                        >
                                          <Octicons
                                            name="dot-fill"
                                            size={26}
                                            color={
                                              item?.isOnline
                                                ? COLORS.greenActive
                                                : COLORS.transparent
                                            }
                                          />
                                        </View>
                                      </View>

                                      {/*bubble mate name*/}
                                      <Text style={styles.bubbleMateName}>
                                        {item?.firstName}
                                      </Text>
                                      <Text style={styles.sharedBubbleMateText}>
                                        {sharedBubbleMates(item)?.length} shared
                                        mates
                                      </Text>
                                    </TouchableOpacity>
                                  )}
                                </View>
                              )}
                            </>
                          );
                        }}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                      />
                      <View style={styles.dividerItem} />
                    </View>
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              ListFooterComponent={
                <View
                  style={{
                    marginBottom: Platform.OS === "ios" ? "2%" : "5%",
                  }}
                ></View>
              }
            />
          </View>
        </>
      </View>
    );
  }

  //render screen content
  function renderScreenItems() {
    return (
      <View style={styles.screenContentContainer}>
        {renderHeaderSection()}
        {renderHeaderContentSection()}
        {renderFilterSection()}
        {renderResultScreenSection()}
      </View>
    );
  }

  //render screen content
  return (
    <View style={styles.container}>
      {isLoading || isLoadingProfile
        ? loadingComponent()
        : error || profileError
          ? EmptyFlatlistComponent()
          : renderScreenItems()}
    </View>
  );
};

const styles = StyleSheet.create({
  //screen container
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //loading component
  loadingComponent: {
    flex: 1,
    top: 0,
  },

  //screen content container
  screenContentContainer: {
    top: Platform.OS === "ios" ? 43 : 0,
  },
  headerContainer: {
    zIndex: 99,
  },

  //render header section
  headerContentContainer: {
    marginTop: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  headerImageSectionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  bubbleIconItem: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  bubbleMateHeadingTextItem: {
    marginHorizontal: 10,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //header section
  searchContainer: {
    marginTop: 10,
    flexDirection: "column",
    paddingHorizontal: 15,
    backgroundColor: COLORS.transparent,
  },
  innerSearchContainer: {
    flexDirection: "row",
    paddingVertical: Platform.OS === "ios" ? 10 : 5,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: COLORS.reechGray,
    marginBottom: 10,
  },
  searchTextContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "93%",
  },
  inputBubList: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 14,
    width: "100%",
    alignItems: "center",
  },

  //filter container
  filterSectionContainer: {
    height: 40,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  filterTextSectionContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  filterTextItem: {
    marginRight: 30,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  filterLineDivider: {
    width: "95%",
    alignSelf: "center",
    marginVertical: 10,
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
  },

  //scroll result section
  scrollResultContainer: {
    top: 10,
    padding: 5,
    height: "68%",
    marginHorizontal: 5,
    backgroundColor: COLORS.transparent,
  },
  countryContainer: {
    paddingVertical: 0,
  },
  imageText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  bubbleMateContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  imageContainer: {
    marginTop: 20,
    marginRight: 18,
  },
  imageActiveContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  bubbleImagesContainer: {
    width: 82,
    height: 82,
  },
  bubbleImages: {
    top: 2,
    left: 2,
    width: 78,
    height: 78,
    borderRadius: 8,
    borderWidth: 3,
  },
  activeIconItemContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    left: 40,
    bottom: 18,
    zIndex: 1,
  },
  bubbleMateName: {
    textAlign: "center",
    marginBottom: 15,
    marginTop: -15,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  sharedBubbleMateText: {
    textAlign: "center",
    marginBottom: 15,
    marginTop: -12,
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  dividerItem: {
    marginTop: 10,
    width: "100%",
    alignSelf: "center",
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth * 3,
  },
});

export default BubbleMateListScreen;
