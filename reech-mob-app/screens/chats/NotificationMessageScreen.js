import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
  TextInput,
  ImageBackground,
  Pressable,
  Alert,
} from "react-native";
import { MaterialCommunityIcons, FontAwesome, Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

//import customs
import { COLORS, images } from "../../constants";
import { CustomAccountMessage, EmptyFlatlistComponent, LoadingComponent } from "../../components";
import { LinearGradient } from "expo-linear-gradient";
import { useReadRequestsQuery } from "../../redux/api/api-slice";
import { useUpdateUserMutation, useUpdateForeignUserMutation } from "../../redux/api/api-slice";
import { useListMyNotificationQuery } from "../../redux/api/notification";
import { useReadUserQuery } from "../../redux/api/api-slice";

///__________________Tracking database changes__________________
import io from "socket.io-client";
const SOCKET_SERVER_URL = "https://reech-node-api-7o3szyfdpq-uc.a.run.app/";
//`${process.env.REACT_APP_API_URL}${process.env.MAIN_API_BASE_PATH}`;

const NotificationMessageScreen = () => {
  const navigation = useNavigation();

  const [notificationList, setNotification] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [searchList, setSearch] = useState([]);
  const [filterList, setFilterList] = useState([]);

  const curr_user = useSelector((state) => state.user.current_user);

  const { data: current_user, refetch: refetch_user } = useReadUserQuery(curr_user?._id);
  const { data: requests, refetch: refetch_requests, isFetching: fetching, isLoading: LoadingReq } = useReadRequestsQuery(current_user?._id);
  const { data: notifications, refetch, isFetching, isLoading } = useListMyNotificationQuery(current_user?._id);

  const [updateUserFn] = useUpdateUserMutation();
  const [updateForeignUserFn] = useUpdateForeignUserMutation();

  React.useEffect(() => {
    const connectSocket = async () => {
      const socket = io(SOCKET_SERVER_URL, {
        transports: ["websocket"],
        extraHeaders: {
          "Svc-Tkn": `Bearer ${process.env.SvcTkn_Main_API}`,
        },
      });
      // eslint-disable-next-line no-unused-vars
      socket.on("notification-updated", (data) => {
        refetch_requests();
        refetch();
      });
      // eslint-disable-next-line no-unused-vars
      socket.on("user-updated", (data) => {
        refetch_requests();
        refetch();
      });
    };
    connectSocket();
  }, []);

  React.useEffect(() => {
    const reqArr = requests?.filter((doc) => doc?.status === "Request");
    setNotification(notifications?.data?.concat(reqArr ?? []));
    setSearch(notifications?.data?.concat(reqArr ?? []));
    setFilterList(notifications?.data?.concat(reqArr ?? []));
  }, [notifications, requests, current_user]);

  const showError = (res) =>
    Toast.show({
      type: "error",
      text1: "Error",
      text2: res.error.data?.error ?? "Something went wrong. Please try again",
    });

  const updateUser = async ({ body, userId }) => {
    await updateUserFn({ body, userId }).then((res) => {
      if (res.error) {
        showError(res);
        return;
      }
      refetch_user();
    });
  };

  const updateForeignUser = async ({ mate_body, m_userId }) => {
    await updateForeignUserFn({ body: mate_body, userId: m_userId }).then(
      (res) => {
        if (res.error) {
          showError(res);
          return;
        }
        refetch_user();
      }
    );
  };

  const RejectBubbleMate = (mate) => {
    const msg = `You are about to remove  ${mate.firstName} from your bubble mates request, 
    Would you like to continue?`;
    const arr = [...(current_user?.bubbleMates ?? null)];
    const mate_arr = [...(mate?.bubbleMates ?? null)];

    const body = {
      bubbleMates: arr?.filter((obj) => obj.userId !== mate._id),
    };
    const mate_body = {
      bubbleMates: mate_arr?.filter((obj) => obj.userId !== current_user?._id),
    };

    Alert.alert(`Confirmation`, `\n${msg}`, [
      {
        text: "Yes",
        onPress: async () => {
          try {
            await updateUser({ body, userId: current_user?._id });
            await updateForeignUser({ mate_body, m_userId: mate?._id });
          } catch (err) {
            console.log(err);
          }
        },
        style: "destructive",
      },
      {
        text: "Cancel",
        onPress: () => console.log("Close Pressed"),
        style: "cancel",
      },
    ]);
  };

  const AcceptBubbleMate = async (mate) => {
    const msg = `You are about to add ${mate.firstName} to your bubble mates.`;
    const arr = [...(current_user?.bubbleMates ?? null)];
    const mate_arr = [...(mate?.bubbleMates ?? null)];

    const _arr = arr.map((m) => {
      if (m.userId === mate._id) {
        return { ...m, status: "Mate" };
      } else return m;
    });

    const _mate_arr = mate_arr.map((_m) => {
      if (_m.userId === current_user?._id) {
        return { ..._m, status: "Mate" };
      } else return _m;
    });

    const body = {
      bubbleMates: _arr,
    };
    const mate_body = {
      bubbleMates: _mate_arr,
    };

    Alert.alert(`Confirmation`, `\n${msg}`, [
      {
        text: "Accept",
        onPress: async () => {
          try {
            await updateUser({ body, userId: current_user?._id });
            await updateForeignUser({ mate_body, m_userId: mate?._id });
          } catch (err) {
            console.log(err);
          }
        },
        style: "default",
      },
      {
        text: "Cancel",
        onPress: () => { },
        style: "cancel",
      },
    ]);
  };

  //a method used to filter data according to the username
  const searchUsername = (text) => {
    if (!text) {
      setSearch(notificationList);
      return
    }
    let filteredData = notificationList?.filter((x) =>
      String(x?.userId?.firstName.toLowerCase()).includes(text.toLowerCase()) ||
      String(x?.userId?.lastName.toLowerCase()).includes(text.toLowerCase()) ||
      String(x?.fromUserId?.firstName.toLowerCase()).includes(text.toLowerCase()) ||
      String(x?.fromUserId?.lastName.toLowerCase()).includes(text.toLowerCase())
    );
    setSearch(filteredData);
  };

  const filterNotifications = (filt) => {
    if (filt.type === "All") {
      setFilterList(notificationList);
      return
    }
    let filteredData = notificationList?.filter((notif) =>
      filt.id === notif?.toProfileId
    );
    setFilterList(filteredData);
  };

  function renderScreenContent() {
    return (
      <View style={styles.searchComponent}>
        <SafeAreaView style={styles.searchContainer}>
          <View style={styles.innerSearchContainer}>
            <View style={styles.textInputContainer}>
              <TextInput
                onChangeText={(text) => searchUsername(text)}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Search"
                placeholderTextColor={COLORS.white}
                style={styles.inputNotifi}
                enablesReturnKeyAutomatically
              />
            </View>
            <View style={styles.inputIconContainer}>
              <FontAwesome name="search" size={16} color={COLORS.purpleDark} />
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  function renderProfileCollection() {
    return (
      <View style={styles.accountComponent}>
        <CustomAccountMessage
          filter={({ filter }) => {
            filterNotifications(filter)
          }}
        />
      </View>
    );
  }

  function renderMessageCollection() {
    return (
      <>
        <SafeAreaView style={styles.messageContainer}>
          <View>
            {isLoading || LoadingReq ? (
              <View style={styles.loadingContainer}>
                <LoadingComponent />
              </View>
            ) : (
              <FlatList
                data={filterList}//notificationList
                keyExtractor={(item, index) => index.toString()}
                onRefresh={refetch || refetch_requests}
                refreshing={isFetching || fetching}
                renderItem={({ item }) => {
                  const tmp_user = item?.userId ?? item?.fromUserId;
                  const day = moment(
                    item?.createdAt ?? item?.addedOn
                  ).format("HH:mm");
                  return (
                    <View style={styles.messageContent}>
                      <TouchableOpacity
                        style={styles.messageItems}
                        onPress={() => {
                          // console.log("item: ", item)
                          navigation.navigate("BubbleFullViewScreen", {
                            bubbleId: item?.feedId,
                          })
                        }}

                      >
                        <ImageBackground
                          source={images.userFrame}
                          style={styles.imageItem}
                        >
                          <Image
                            source={
                              tmp_user?.profileImage
                                ? { uri: tmp_user?.profileImage }
                                : images.u1
                            }
                            resizeMode="cover"
                            style={styles.userPic}
                          />
                        </ImageBackground>

                        <View
                          style={
                            item.status === "Request" || item.status === "vouch"
                              ? styles.textContainers
                              : styles.textContainer
                          }
                        >
                          <Text style={styles.username}>
                            {tmp_user?.firstName} {tmp_user?.lastName}
                          </Text>
                          <Text
                            style={styles.userMessage}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {/*icons*/}
                            {(item.status === "appreciate" && item?.count > 1) && item?.count}{" "}
                            {item.status === "comment" && (
                              <MaterialCommunityIcons
                                name="comment-account"
                                size={14}
                                color={COLORS.white}
                              />
                            )}
                            {item.status === "share" && (
                              <FontAwesome
                                name="share-square-o"
                                size={14}
                                color={COLORS.white}
                              />
                            )}
                            {item.status === "appreciate" && (
                              <MaterialCommunityIcons
                                name="hand-clap"
                                size={14}
                                color={COLORS.white}
                              />
                            )}
                            {item.status === "Request" && (
                              <Entypo
                                name="add-user"
                                size={14}
                                color={COLORS.white}
                              />
                            )}
                            {item.status === "vouch" && (
                              <MaterialCommunityIcons
                                name="card-account-details-star"
                                size={14}
                                color={COLORS.white}
                              />
                            )}{" "}
                            {item.status === "comment" &&
                              " Commented on your experience."}
                            {item.status === "appreciate" &&
                              " Appreciated your bubble post."}
                            {item.status === "share" &&
                              " Shared your opportunity card."}
                            {item.status === "vouch" && " Vouched for you."}
                            {item.status === "Request" &&
                              " Sent you a bubble mate Request."}
                          </Text>

                          {/*buttons*/}
                          {item.status === "Request" && (
                            <View style={styles.buttons}>
                              {/*gradient button item*/}
                              <Pressable
                                onPress={() => AcceptBubbleMate(item?.userId)}
                                style={styles.gradientContainer}
                              >
                                <LinearGradient
                                  start={{ x: 0, y: 0.5 }}
                                  end={{ x: 1, y: 0.5 }}
                                  colors={[
                                    COLORS.purpleDarker,
                                    COLORS.purpleDark,
                                    COLORS.purple,
                                  ]}
                                  style={styles.buttonGradientContainer}
                                >
                                  <Text style={styles.gradientTextItem}>Add</Text>
                                </LinearGradient>
                              </Pressable>

                              <Text> </Text>

                              <Pressable
                                onPress={() => RejectBubbleMate(item?.userId)}
                                style={styles.gradientContainer}
                              >
                                <View style={styles.buttonNormalContainer}>
                                  <Text style={styles.gradientTextItem}>
                                    Remove
                                  </Text>
                                </View>
                              </Pressable>
                            </View>
                          )}

                          {item.status === "vouch" && (
                            <View style={styles.buttons}>
                              {/*gradient button item*/}
                              <Pressable
                                onPress={() => console.log("add pressed")}
                                style={styles.gradientContainer}
                              >
                                <LinearGradient
                                  start={{ x: 0, y: 0.5 }}
                                  end={{ x: 1, y: 0.5 }}
                                  colors={[
                                    COLORS.purpleDarker,
                                    COLORS.purpleDark,
                                    COLORS.purple,
                                  ]}
                                  style={styles.buttonGradientContainer}
                                >
                                  <Text style={styles.gradientTextItem}>
                                    Accept
                                  </Text>
                                </LinearGradient>
                              </Pressable>

                              <Text> </Text>

                              <Pressable
                                onPress={() => console.log("reject pressed")}
                                style={styles.gradientContainer}
                              >
                                <View style={styles.buttonNormalContainer}>
                                  <Text style={styles.gradientTextItem}>
                                    Reject
                                  </Text>
                                </View>
                              </Pressable>
                            </View>
                          )}
                        </View>

                        <View style={styles.dateContainer}>
                          <Text style={styles.timeFrame}>
                            {day === "a few seconds" ? "seconds ago" : day}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                }}
                ListFooterComponent={
                  <View style={{ marginBottom: "10%" }}></View>
                }
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <EmptyFlatlistComponent />
                  </View>
                }
                decelerationRate="fast"
              />)}
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <View style={styles.container}>
      {renderScreenContent()}
      {renderProfileCollection()}
      {renderMessageCollection()}
    </View>
  );
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "2.5%",
    justifyContent: "space-between",
    flexDirection: "column",
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  //search
  searchComponent: {
    paddingVertical: "10%",
    paddingHorizontal: "5%",
    marginBottom: -25,
  },
  accountComponent: {
    top: 0,
    bottom: 0,
    paddingVertical: Platform.OS === "ios" ? "10%" : "5%",
    paddingBottom: Platform.OS === "ios" ? "21.3%" : "26%",
    paddingHorizontal: "5%",
  },
  searchContainer: {
    position: "relative",
    marginHorizontal: Platform.OS === "android" ? "0%" : "0%",
    marginTop: "-13%",
    width: "100%",
  },
  innerSearchContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    height: 40,
    paddingHorizontal: 20,
    top: 10,
    marginBottom: 8,
    borderColor: COLORS.reechGray,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: COLORS.reechGray,
  },
  textInputContainer: {
    width: "92%",
    alignItems: "center",
  },
  inputIconContainer: {
    alignItems: "flex-end",
    width: "8%",
  },
  inputNotifi: {
    fontFamily: "PoppinsLight",
    color: COLORS.white,
    fontSize: 15,
    alignItems: "center",
  },

  //message collection
  loadingContainer: {
    flex: 1,
    position: "absolute",
    top: 80,
    left: "20%",
  },
  messageContainer: {
    flex: 1,
    top: Platform.OS === "ios" ? 420 : 380,
    marginBottom: Platform.OS === "android" ? "-70%" : "-70%",
    marginTop: "-100%",
  },
  messageContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "column",
  },
  messageItems: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imageItem: {
    width: Platform.OS === "ios" ? 80 : 68,
    height: Platform.OS === "ios" ? 80 : 68,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  userPic: {
    width: Platform.OS === "ios" ? 72 : 60,
    height: Platform.OS === "ios" ? 72 : 60,
    borderRadius: 8,
    borderColor: COLORS.black,
  },
  textContainers: {
    width: "60%",
    flexDirection: "column",
    marginTop: "0%",
    marginLeft: "3%",
  },
  textContainer: {
    width: "60%",
    flexDirection: "column",
    marginTop: "5%",
    marginLeft: "3%",
  },
  username: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  userMessage: {
    marginTop: "2%",
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  buttons: {
    marginTop: 3,
    flexDirection: "row",
    width: "50%",
  },
  //gradient button
  gradientContainer: {
    top: 8,
    width: "100%",
  },
  buttonGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    height: 30,
    width: "90%",
  },
  buttonNormalContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    height: 30,
    width: "90%",
    backgroundColor: COLORS.darkGray,
  },
  gradientTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  dateContainer: {
    width: "20%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? "-3%" : "-3%",
    marginLeft: 5,
  },
  timeFrame: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
});

export default NotificationMessageScreen;
