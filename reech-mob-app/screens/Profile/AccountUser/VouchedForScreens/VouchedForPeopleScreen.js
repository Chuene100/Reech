import React, {useEffect} from "react";
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Alert,
  Text,
  Platform,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import Toast from "react-native-toast-message";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import { FlatList } from "react-native-gesture-handler";

//import customs
import { COLORS, images } from "../../../../constants";
import { CustomButton, EmptyFlatlistComponent, LoadingComponent } from "../../../../components";
import { useListMyVouchesQuery } from "../../../../redux/api/vouch";
import { useUpdateUserMutation, useUpdateForeignUserMutation } from "../../../../redux/api/api-slice";

///__________________Tracking database changes__________________
const SOCKET_SERVER_URL = "https://reech-node-api-7o3szyfdpq-uc.a.run.app/";
//`${process.env.REACT_APP_API_URL}${process.env.MAIN_API_BASE_PATH}`;

const VouchedForPeopleScreen = ({ userId }) => {
  const navigation = useNavigation();

  const current_user = useSelector((state) => state.user.current_user);
  const { data, refetch, isLoading, isFetching } = useListMyVouchesQuery(userId);

  const [updateUserFn] = useUpdateUserMutation();
  const [updateForeignUserFn] = useUpdateForeignUserMutation();

  useEffect(() => {
    const connectSocket = async () => {
      const socket = io(SOCKET_SERVER_URL, {
        transports: ["websocket"],
        extraHeaders: {
          "Svc-Tkn": `Bearer ${process.env.SvcTkn_Main_API}`,
        },
      });
      socket.on("vouch-updated", () => {
        refetch();
      });
    };
    connectSocket();
  }, []);

  const showError = (res) =>
    Toast.show({
      type: "error",
      text1: "Error",
      text2: res.error.data?.error ?? "Something went wrong. Please try again",
    });

  ///________________________________Add/Remove bubble mate____________________________________
  const isBubbleMate = (mate) => {
    const bub = current_user?.bubbleMates?.findIndex((obj) => obj.userId === mate._id);
    if (bub >= 0) return current_user.bubbleMates[bub]?.status;
    return "Add";
  };

  const isMateOrRequest = (mate, status) => {
    const bub = current_user?.bubbleMates?.findIndex((obj) => obj.userId === mate._id);
    if (bub >= 0 && status === "Mate") { return current_user?.bubbleMates[bub]?.status === "Mate" }
    if (bub >= 0 && status === "Requested") { return current_user?.bubbleMates[bub]?.status === "Requested" }
    if (bub >= 0 && status === "Request") { return current_user?.bubbleMates[bub]?.status === "Request" }
    return false;
  };

  const updateUser = async ({ body, userId }) => {
    await updateUserFn({ body, userId }).then((res) => {
      if (res.error) { showError(res); return; }
    });
  };

  const updateForeignUser = async ({ mate_body, m_userId }) => {
    await updateForeignUserFn({ body: mate_body, userId: m_userId }).then(
      (resp) => {
        if (resp.error) { showError(resp); return; }
      }
    );
  };

  const removeBubbleMate = (mate, msg) => {
    const arr = [...(current_user?.bubbleMates ?? null)];
    const mate_arr = [...(mate?.bubbleMates ?? null)];

    const body = { bubbleMates: arr.filter((obj) => obj.userId !== mate._id) };
    const mate_body = { bubbleMates: mate_arr.filter((obj) => obj.userId !== current_user?._id) };

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
      },
      {
        text: "Close",
        onPress: () => console.log("Close Pressed"),
        style: "cancel",
      },
    ]);
  };

  const addBubbleMate = async (mate) => {
    const arr = [...(current_user?.bubbleMates ?? null)];
    const mate_arr = [...(mate?.bubbleMates ?? null)];

    const temp = {
      userId: mate._id,
      username: `${mate.firstName} ${mate.lastName}`,
      bubbleMateImage: mate.profileImage,
      status: "Requested",
    };

    const mate_temp = {
      userId: current_user?._id,
      username: `${current_user?.firstName} ${current_user?.lastName}`,
      bubbleMateImage: current_user?.profileImage,
      status: "Request",
    };

    arr.push(temp);
    mate_arr.push(mate_temp);

    const body = { bubbleMates: arr };
    const mate_body = { bubbleMates: mate_arr };

    try {
      await updateUser({ body, userId: current_user?._id });
      await updateForeignUser({ mate_body, m_userId: mate?._id });
    }
    catch (err) { console.log(err) }
  };

  const acceptBubbeMate = async (mate) => {
    const arr = [...(current_user?.bubbleMates ?? null)];
    const mate_arr = [...(mate?.bubbleMates ?? null)];

    const _arr = arr.map((m) => {
      if (m.userId === mate._id) { return { ...m, status: "Mate" } } else return m;
    });

    const _mate_arr = mate_arr.map((_m) => {
      if (_m.userId === current_user?._id) { return { ..._m, status: "Mate" } } else return _m;
    });

    const body = { bubbleMates: _arr };
    const mate_body = { bubbleMates: _mate_arr };

    try {
      await updateUser({ body, userId: current_user?._id });
      await updateForeignUser({ mate_body, m_userId: mate?._id });
    }
    catch (err) { console.log(err) }
  };

  const acceptRejectMate = async (mate, msg) => {
    Alert.alert(`Confirmation`, `\n${msg}`, [
      {
        text: "Accept",
        onPress: async () => {
          try { acceptBubbeMate(mate) }
          catch (err) { console.log(err) }
        },
        style: "default",
      },
      {
        text: "Reject",
        onPress: () => {
          try {
            removeBubbleMate(mate,
              `You are about to remove  ${mate.firstName} from your bubble mates request.`
            );
          }
          catch (err) { console.log(err) }
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
  ///__________________________________END__________________________________

  //screen loading component
  const loadingComponent = () => (
    <View style={styles.loadingComponent}>
      <LoadingComponent />
    </View>
  );

  function renderUserVouchListSection() {
    return (
      <View style={styles.userVouchListContainer}>
        <View style={styles.userVouchContent}>
          <FlatList
            data={data?.data}
            keyExtractor={(item, index) => index.toString()}
            onRefresh={refetch}
            refreshing={isFetching}
            renderItem={({ item }) => {
              return (
                <View style={styles.flatListContainer}>
                  <View style={styles.flatListContent}>
                    <View style={styles.imageItemContainer}>
                      {/*user image*/}
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("AccountFullViewScreen", {
                            userId: item.vouchFor?.userId?._id,
                          })
                        }
                      >
                        <ImageBackground
                          source={images.userFrame}
                          style={styles.gradientColorContainerPeopleVouched}
                        >
                          <Image
                            source={{
                              uri: item.vouchFor?.userId?.profileImage,
                            }}
                            style={styles.imageItem}
                          />
                        </ImageBackground>
                      </TouchableOpacity>

                      {/*vouch user info section*/}
                      <View style={styles.imageTextContainer}>
                        {/*user name*/}
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("AccountFullViewScreen", {
                              userId: item.vouchFor?.userId?._id,
                            })
                          }
                        >
                          <Text style={styles.imageTextName}>
                            {item.vouchFor?.userId?.firstName}{" "}
                            {item.vouchFor?.userId?.lastName}
                          </Text>
                        </TouchableOpacity>

                        {/*blurb*/}
                        <Text numberOfLines={3} style={styles.imageTextBlurb}>
                          {item.vouchFor?.userId?.blurb}
                        </Text>

                        <View style={styles.imageTextButtonContainer}>
                          <Text style={styles.imageText}>
                            {moment(item.vouchDate).format("MMM yyyy")}
                          </Text>
                          <View style={styles.imageButtonContainer}>
                            <CustomButton
                              text={
                                isBubbleMate(item.vouchFor?.userId) ===
                                  "Requested"
                                  ? "Request sent"
                                  : isBubbleMate(item.vouchFor?.userId) ===
                                    "Request"
                                    ? "Accept | Reject"
                                    : isBubbleMate(item.vouchFor?.userId) ===
                                      "Add"
                                      ? "Add bubble mate"
                                      : isBubbleMate(item.vouchFor?.userId) ===
                                        "Mate"
                                        ? "Bubble mate"
                                        : ""
                              }
                              type={
                                isBubbleMate(item.vouchFor?.userId) ===
                                  "Requested"
                                  ? "REQUEST"
                                  : isBubbleMate(item.vouchFor?.userId) ===
                                    "Request"
                                    ? "ACTIVE"
                                    : isBubbleMate(item.vouchFor?.userId) ===
                                      "Add"
                                      ? "BUBBLE"
                                      : isBubbleMate(item.vouchFor?.userId) ===
                                        "Mate"
                                        ? "MATE"
                                        : ""
                              }
                              onPress={() =>
                                bubbleMateClicked(item.vouchFor?.userId)
                              }
                            />
                          </View>
                        </View>
                      </View>
                    </View>

                    {/*vouch message section*/}
                    <View style={styles.vouchMessageContainer}>
                      <Text style={styles.vouchMessage}>
                        {item.description}
                      </Text>
                    </View>

                    {/*vouch image section*/}
                    {item.vouchImage && (
                      <View style={styles.vouchImageContainer}>
                        <Image
                          source={{ uri: item.vouchImage }}
                          style={styles.vouchImageAttachmentItem}
                        />
                      </View>
                    )}

                    <View style={styles.horizontalLine}></View>
                  </View>

                  <View style={styles.flatListBottom}></View>
                </View>
              );
            }}
            ListFooterComponent={
              <View
                style={{
                  marginBottom: Platform.OS === "ios" ? "15%" : "20%",
                }}
              ></View>
            }
            ListEmptyComponent={<EmptyFlatlistComponent />}
          />
        </View>
      </View>
    );
  }

  return (
    <>
      {isLoading ? (
        loadingComponent()
      ) : (
        <View style={styles.contentContainerFilterPeople}>
          {renderUserVouchListSection()}
        </View>
      )}
    </>
  );
};

{
  /* custom styles */
}
const styles = StyleSheet.create({
  contentContainerFilterPeople: {
    flex: 1,
    flexDirection: "column",
  },

  //loading component
  loadingComponent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  //user vouch list section
  userVouchListContainer: {
    flex: 1,
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
    flexDirection: "column",
  },
  imageItemContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  gradientColorContainerPeopleVouched: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  imageItem: {
    width: 72,
    height: 72,
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
  imageTextBlurb: {
    width: Platform.OS === "ios" ? "76%" : "75%",
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    marginBottom: 2,
  },
  imageTextButtonContainer: {
    backgroundColor: COLORS.transparent,
    flexDirection: "row",
    alignItems: "center",
    height: 25,
    justifyContent: "space-between",
    width: "100%",
  },
  imageText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  imageButtonContainer: {
    width: "50%",
    right: 50,
  },
  vouchMessageContainer: {
    marginTop: 8,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  vouchMessage: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  vouchImageContainer: {
    width: "100%",
    marginTop: "3%",
  },
  vouchImageAttachmentItem: {
    width: "100%",
    height: 360,
    resizeMode: "cover",
    borderRadius: 10,
  },

  horizontalLine: {
    marginVertical: "5%",
    borderBottomColor: COLORS.gray,
    borderBottomWidth: StyleSheet.hairlineWidth * 1,
  },
  flatListBottom: {
    marginBottom: "2.5%",
  },
});

export default VouchedForPeopleScreen;
