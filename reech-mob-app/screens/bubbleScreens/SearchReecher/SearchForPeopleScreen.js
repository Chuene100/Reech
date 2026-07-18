import React, { useState, useEffect } from "react";
import {
  FlatList,
  Image,
  Alert,
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Pressable,
  TextInput,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

//import customs
import { COLORS, images } from "../../../constants";
import {
  CustomButton,
  EmptyFlatlistComponentNetworkIssue,
  LoadingComponent,
} from "../../../components";
import { useReadAllUserQuery } from "../../../redux/api/api-slice";
import {
  useUpdateUserMutation,
  useUpdateForeignUserMutation,
  useReadUserQuery,
} from "../../../redux/api/api-slice";
import { setUsersList } from "../../../redux/features/all-user-slice";
import { setCurrentUser } from "../../../redux/features/user-slice";
import { setUsersImage } from "../../../redux/features/all-user-image-slice";
import { useDispatch, useSelector } from "react-redux";

///__________________Tracking database changes__________________
import io from "socket.io-client";
const SOCKET_SERVER_URL = "https://reech-node-api-7o3szyfdpq-uc.a.run.app/";
//`${process.env.REACT_APP_API_URL}${process.env.MAIN_API_BASE_PATH}`;

const SearchForPeopleScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.current_user);
  const image = useSelector((state) => state.users_images.usersImages);
  
  const allUsers = useSelector((state) => state.allUser.read_users);

  const {data, isLoading, error: fetchError, refetch, isFetching} = useReadAllUserQuery();

  const [updateUserFn] = useUpdateUserMutation();
  const [updateForeignUserFn] = useUpdateForeignUserMutation();
  const { data: current_user, refetch: refetchUser } = useReadUserQuery(user?._id);

  useEffect(() => {
    const connectSocket = async () => {
      const socket = io(SOCKET_SERVER_URL, {
        transports: ["websocket"],
        extraHeaders: {
          "Svc-Tkn": `Bearer ${process.env.SvcTkn_Main_API}`,
        },
      });
      
      socket.on("user-updated", (data) => {
        refetchUser();
        refetch();
      });
    };
    connectSocket();
  }, []);

  useEffect(() => {
    dispatch(setUsersList({ read_users: data?.data }));
  }, [data]);

  useEffect(() => {
    dispatch(setCurrentUser({ current_user: current_user }));
  }, [current_user]);

  useEffect(() => {
    if (data?.data)
      for (var dt in data?.data) {
        const df = data?.data[dt];
        if (!image[df.profileImage] && df.profileImage?.startsWith("http"))
          _loadImage(df.profileImage);

        if (!image[df.coverImage] && df.coverImage?.startsWith("http"))
          _loadImage(df.coverImage);
      }
  }, [data]);

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

  const showError = (res) =>
    Toast.show({
      type: "error",
      text1: "Error",
      text2: res.error.data?.error ?? "Something went wrong. Please try again",
    });

  ///________________________________Add/Remove bubble mate____________________________________
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

  const isBubbleMate = (mate) => {
    const bub = user?.bubbleMates?.findIndex((obj) => obj.userId === mate._id);
    if (bub >= 0) return user.bubbleMates[bub]?.status;

    return "Add";
  };

  const isMateOrRequest = (mate, status) => {
    const bub = current_user?.bubbleMates?.findIndex(
      (obj) => obj.userId === mate._id
    );
    if (bub >= 0 && status === "Mate") {
      return current_user?.bubbleMates[bub]?.status === "Mate";
    }
    if (bub >= 0 && status === "Requested") {
      return current_user?.bubbleMates[bub]?.status === "Requested";
    }
    if (bub >= 0 && status === "Request") {
      return current_user?.bubbleMates[bub]?.status === "Request";
    }

    return false;
  };

  const updateUser = async ({ body, userId }) => {
    await updateUserFn({ body, userId }).then((res) => {
      if (res.error) {
        showError(res);
        return;
      }
    });
  };

  const updateForeignUser = async ({ mate_body, m_userId }) => {
    await updateForeignUserFn({ body: mate_body, userId: m_userId }).then(
      (res) => {
        if (res.error) {
          showError(res);
          return;
        }
      }
    );
  };

  const removeBubbleMate = (mate, msg) => {
    const arr = [...(user?.bubbleMates ?? null)];
    const mate_arr = [...(mate?.bubbleMates ?? null)];

    const body = {
      bubbleMates: arr.filter((obj) => obj.userId !== mate._id),
    };
    const mate_body = {
      bubbleMates: mate_arr.filter((obj) => obj.userId !== user?._id),
    };

    Alert.alert(`Confirmation`, `\n${msg}`, [
      {
        text: "Yes",
        onPress: async () => {
          try {
            await updateUser({ body, userId: user?._id });
            await updateForeignUser({ mate_body, m_userId: mate?._id });
          } catch (err) {
            console.log(err);
          }
        },
      },
      {
        text: "Close",
        onPress: () => console.log("Close Pressed"),
        style: "cancel",
      },
    ]);
  };

  const addBubbleMate = async (mate) => {
    const arr = [...(user?.bubbleMates ?? null)];
    const mate_arr = [...(mate?.bubbleMates ?? null)];

    const temp = {
      userId: mate._id,
      username: `${mate.firstName} ${mate.lastName}`,
      bubbleMateImage: mate.profileImage,
      status: "Requested",
    };
    const mate_temp = {
      userId: user?._id,
      username: `${user?.firstName} ${user?.lastName}`,
      bubbleMateImage: user?.profileImage,
      status: "Request",
    };

    arr.push(temp);
    mate_arr.push(mate_temp);

    const body = {
      bubbleMates: arr,
    };
    const mate_body = {
      bubbleMates: mate_arr,
    };

    try {
      await updateUser({ body, userId: user?._id });
      await updateForeignUser({ mate_body, m_userId: mate?._id });
    } catch (err) {
      console.log(err);
    }
  };

  const acceptBubbeMate = async (mate) => {
    const arr = [...(user?.bubbleMates ?? null)];
    const mate_arr = [...(mate?.bubbleMates ?? null)];

    const _arr = arr.map((m) => {
      if (m.userId === mate._id) {
        return { ...m, status: "Mate" };
      } else return m;
    });

    const _mate_arr = mate_arr.map((_m) => {
      if (_m.userId === user?._id) {
        return { ..._m, status: "Mate" };
      } else return _m;
    });

    const body = {
      bubbleMates: _arr,
    };
    const mate_body = {
      bubbleMates: _mate_arr,
    };

    try {
      await updateUser({ body, userId: user?._id });
      await updateForeignUser({ mate_body, m_userId: mate?._id });
    } catch (err) {
      console.log(err);
    }
  };

  const acceptRejectMate = async (mate, msg) => {
    Alert.alert(`Confirmation`, `\n${msg}`, [
      {
        text: "Accept",
        onPress: async () => {
          try {
            acceptBubbeMate(mate);
          } catch (err) {
            console.log(err);
          }
        },
        style: "default",
      },
      {
        text: "Reject",
        onPress: () => {
          try {
            removeBubbleMate(
              mate,
              `You are about to remove  ${mate.firstName} from your bubble mates request.`
            );
          } catch (err) {
            console.log(err);
          }
        },
        style: "destructive",
      },
    ]);
  };

  const bubbleMateClicked = (mate) => {
    if (isMateOrRequest(mate, "Mate")) {
      removeBubbleMate(
        mate,
        `Are you sure you want to remove ${mate.firstName} from your bubble mates`
      );
    }
    if (isMateOrRequest(mate, "Requested")) {
      removeBubbleMate(
        mate,
        `Do you want to cancel your bubble mate request with ${mate.firstName}?`
      );
    } else if (isMateOrRequest(mate, "Request")) {
      acceptRejectMate(
        mate,
        `You are about to add ${mate.firstName} to your bubble mates.`
      );
    } else {
      addBubbleMate(mate);
    }
  };

  //search users
  const [userData, setUserData] = useState();

  //a method used to filter data according to the username
  const searchUser = (text) => {
    let filteredData = data?.data.filter(
      (x) =>
        String(x.firstName.toLowerCase()).includes(text.toLowerCase()) ||
        String(x.address.toLowerCase()).includes(text.toLowerCase()) ||
        String(x.blurb.toLowerCase()).includes(text.toLowerCase()) ||
        String(x.empStatus.toLowerCase()).includes(text.toLowerCase())
    );
    text ? setUserData(filteredData) : setUserData([]);
  };
  ///__________________________________END__________________________________

  //search component
  function renderSearchSection() {
    return (
      <View style={styles.searchTextItem}>
        <View style={styles.innerSearchContainer}>
          <View style={styles.textInputContainer}>
            <TextInput
              onChangeText={(text) => searchUser(text)}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Search"
              placeholderTextColor={COLORS.white}
              style={styles.inputsSearchPeopleFor}
              enablesReturnKeyAutomatically
              textAlign="center"
            />
          </View>
          <FontAwesome name="search" size={16} color={COLORS.purple} style={{ top: Platform.OS === "ios" ? 0 : 5 }} />
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
            onPress={() => navigation.navigate("SearchPeopleFilterScreen")}
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

  //people search results
  function renderPeopleResultSection() {
    return (
      <>
        <View style={styles.userVouchListContainer}>
          <View style={styles.userVouchContent}>
            <FlatList
              data={userData}
              keyExtractor={(item, index) => index.toString()}
              onRefresh={refetch}
              refreshing={isFetching}
              renderItem={({ item }) => {
                return (
                  <>
                    {item._id !== user?._id && (
                      <View style={styles.flatListContainer}>
                        <View style={styles.flatListContent}>
                          <View style={styles.imageItemContainer}>
                            {/*user image section*/}
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate("AccountFullViewScreen", {
                                  userId: item._id,
                                })
                              }
                            >
                              <ImageBackground
                                source={images.userFrame}
                                style={styles.userImageContainer}
                              >
                                <Image
                                  source={
                                    item.profileImage
                                      ? {
                                        uri:
                                          image[item.profileImage] ??
                                          item.profileImage,
                                      }
                                      : images.defaultRounded
                                  }
                                  style={styles.imageItem}
                                />
                              </ImageBackground>
                            </TouchableOpacity>

                            {/*vouch user info section*/}
                            <View style={styles.imageTextContainer}>
                              <TouchableOpacity
                                onPress={() =>
                                  navigation.navigate("AccountFullViewScreen", {
                                    userId: item._id,
                                  })
                                }
                              >
                                <Text style={styles.imageTextName}>
                                  {item.firstName} {item.lastName}
                                </Text>

                                <Text style={styles.imageLocation}>
                                  {item.address}
                                </Text>

                                <Text
                                  style={styles.imageTextBlurb}
                                  numberOfLines={2}
                                >
                                  {item.blurb}
                                </Text>
                              </TouchableOpacity>

                              <View style={styles.imageTextButtonContainer}>
                                <Text style={styles.imageText}></Text>
                                <View style={styles.imageButtonContainer}>
                                  <CustomButton
                                    text={
                                      isBubbleMate(item) === "Requested"
                                        ? "Request sent"
                                        : isBubbleMate(item) === "Request"
                                          ? "Accept | Reject"
                                          : isBubbleMate(item) === "Add"
                                            ? "Add bubble mate"
                                            : isBubbleMate(item) === "Mate"
                                              ? "Bubble mate"
                                              : ""
                                    }
                                    type={
                                      isBubbleMate(item) === "Requested"
                                        ? "REQUEST"
                                        : isBubbleMate(item) === "Request"
                                          ? "ACTIVE"
                                          : isBubbleMate(item) === "Add"
                                            ? "BUBBLE"
                                            : isBubbleMate(item) === "Mate"
                                              ? "MATE"
                                              : ""
                                    }
                                    onPress={() => bubbleMateClicked(item)}
                                  />
                                </View>
                              </View>
                            </View>
                          </View>

                          {/*bubble mate section*/}
                          <View style={styles.userBubbleMatesContainer}>
                            {item.bubbleMates && (
                              <View style={styles.useBubbleImageContainer}>
                                {sharedBubbleMates(item)?.map((bub_mate, i) => (
                                  <View style={styles.imageContainer} key={i}>
                                    {i < 3 && (
                                      <Image
                                        source={
                                          bub_mate?.bubbleMateImage
                                            ? {
                                              uri:
                                                image[
                                                bub_mate.bubbleMateImage
                                                ] ??
                                                bub_mate?.bubbleMateImage,
                                            }
                                            : images.defaultRounded
                                        }
                                        style={styles.userBubbleMateImage}
                                      />
                                    )}
                                  </View>
                                ))}

                                {/* */}
                              </View>
                            )}

                            <View style={styles.useBubbleTextContainer}>
                              {sharedBubbleMates(item) && (
                                <Text style={styles.userBubbleCountText}>
                                  {sharedBubbleMates(item)?.length <= 1
                                    ? sharedBubbleMates(item)?.length +
                                    " shared bubble mate"
                                    : sharedBubbleMates(item)?.length >= 2
                                      ? sharedBubbleMates(item)?.length +
                                      " shared bubble mates"
                                      : sharedBubbleMates(item)?.length >= 99
                                        ? sharedBubbleMates(item)?.length +
                                        "+99 shared bubble mates"
                                        : "Shared bubble mates"}
                                </Text>
                              )}
                            </View>
                          </View>

                          <View style={styles.horizontalLine}></View>
                        </View>

                        <View style={styles.flatListBottom}></View>
                      </View>
                    )}
                  </>
                );
              }}
              ListFooterComponent={
                <View
                  style={{
                    marginBottom: Platform.OS === "ios" ? "10%" : "10%",
                  }}
                />
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyContent}>
                    <FontAwesome
                      name="search"
                      size={100}
                      color={COLORS.purpleDark}
                    />
                    <Text style={styles.emptyTextItem}>
                      Please click the search bar to start searching
                    </Text>
                  </View>
                  {/* <EmptyFlatlistComponent /> */}
                </View>
              }
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </>
    );
  }

  //render social icons
  function renderSocialIconSection() {
    return (
      <View style={styles.socialMediaIconsContainer}>
        <View style={styles.socialMediaContent}>
          <View style={styles.socialText}>
            <Text style={styles.socialTextItem}>
              Send an invitation to join reech
            </Text>
          </View>

          {/*social icons*/}
          <View style={styles.socialIconContainer}>
            <Pressable
              onPress={() => console.log("facebook clicked")}
              style={styles.iconClickContainer}
            >
              <Image source={images.fb} style={styles.socialIconItem} />
            </Pressable>

            <Pressable
              onPress={() => console.log("whatsapp clicked")}
              style={styles.iconClickContainer}
            >
              <Image
                source={images.wa}
                style={[styles.socialIconItem, { borderRadius: 0 }]}
              />
            </Pressable>

            <Pressable
              onPress={() => console.log("link clicked")}
              style={styles.iconClickContainer}
            >
              <Image source={images.link} style={styles.socialIconItem} />
            </Pressable>

            <Pressable
              onPress={() => console.log("link clicked")}
              style={styles.iconClickContainer}
            >
              <Image
                source={images.ms}
                style={[styles.socialIconItem, { borderRadius: 0 }]}
              />
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  //render screen content
  function renderScreenContent() {
    return (
      <>
        {renderSearchSection()}
        {renderFilterSection()}
        {renderPeopleResultSection()}
        {renderSocialIconSection()}
      </>
    );
  }

  function renderLoadingComponent() {
    return (
      <View style={styles.loadingContainer}>
        <LoadingComponent />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {isLoading
        ? renderLoadingComponent()
        : fetchError
          ? EmptyFlatlistComponentNetworkIssue()
          : renderScreenContent()}
    </SafeAreaView>
  );
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  //empty list
  emptyContainer: {
    marginBottom: "100%",
  },
  emptyContent: {
    height: "55%",
    marginBottom: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTextItem: {
    top: 20,
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },

  //loading container
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  //search section
  searchTextItem: {
    marginTop: 10,
    flexDirection: "column",
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
  textInputContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "93%",
  },
  inputsSearchPeopleFor: {
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
  },
  filterTextItem: {
    marginRight: 35,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  filterLineDivider: {
    marginVertical: 10,
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
  },

  //user vouch list section
  userVouchListContainer: {
    maxHeight: Platform.OS === "ios" ? 458 : 330,
    marginTop: 10,
  },
  userVouchContent: {
    width: "100%",
    flexDirection: "column",
  },

  //flatlist section
  flatListContainer: {
    flex: 1,
  },
  flatListContent: {
    marginTop: 0,
    flexDirection: "column",
  },
  imageItemContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: "2%",
  },
  userImageContainer: {
    width: 75,
    height: 75,
    justifyContent: "center",
    alignItems: "center",
  },
  imageItem: {
    width: 66,
    height: 66,
    resizeMode: "cover",
    borderRadius: 6,
  },
  imageTextContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    marginLeft: "2%",
    width: "100%",
  },
  imageTextName: {
    width: "80%",
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  imageLocation: {
    width: "80%",
    marginVertical: 4,
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  imageTextBlurb: {
    width: Platform.OS === "ios" ? "80%" : "75%",
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    marginBottom: "1%",
  },
  imageTextButtonContainer: {
    width: "100%",
    height: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  imageButtonContainer: {
    width: "50%",
    right: 55,
  },

  //bubble mate section
  userBubbleMatesContainer: {
    bottom: 0,
    flexDirection: "row",
    height: "20%",
  },
  useBubbleImageContainer: {
    width: "28%",
    left: 0,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: COLORS.transparent,
  },
  imageContainer: {
    width: 22,
  },
  userBubbleMateImage: {
    width: 30,
    height: 30,
    resizeMode: "cover",
    borderRadius: 50,
    borderWidth: 2,
    borderColor: COLORS.black,
  },
  useBubbleTextContainer: {
    width: "65%",
    right: 18,
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: COLORS.transparent,
  },
  userBubbleCountText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
  },

  //social media section
  socialMediaIconsContainer: {
    width: "100%",
  },
  socialMediaContent: {
    marginBottom: "20%",
    justifyContent: "flex-end",
    flexDirection: "column",
  },
  socialText: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  socialTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
  },
  socialIconContainer: {
    width: "100%",
    paddingVertical: 10,
    justifyContent: "center",
    flexDirection: "row",
  },
  socialIconItem: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  iconClickContainer: {
    marginHorizontal: 10,
  },

  //bottom liner section
  horizontalLine: {
    marginTop: 5,
    marginVertical: "4%",
    borderBottomColor: COLORS.gray,
    borderBottomWidth: StyleSheet.hairlineWidth * 1,
  },
  flatListBottom: {
    marginBottom: "2.5%",
  },
});

export default SearchForPeopleScreen;
