import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  View,
  Alert,
  Text,
  TouchableOpacity,
  FlatList,
  Platform,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import Toast from "react-native-toast-message";
import io from "socket.io-client";
import { useSelector } from "react-redux";

//import customs
import { COLORS, images } from "../../../constants";
import { EmptyFlatlistComponent, LoadingComponent } from "../../../components";
import { useListVouchesForQuery } from "@/redux/api/vouch";
import { useUpdateUserMutation, useUpdateForeignUserMutation } from "../../../redux/api/api-slice";
import NavHeader from "@/components/Headers/NavHeader";

///__________________Tracking database changes__________________
const SOCKET_SERVER_URL = "https://reech-node-api-7o3szyfdpq-uc.a.run.app/";
//`${process.env.REACT_APP_API_URL}${process.env.MAIN_API_BASE_PATH}`;

const ProfileBubbleVouchScreen = ({ route }) => {
  const { profileId } = route.params;

  const navigation = useNavigation();

  const current_user = useSelector((state) => state.user.current_user);
  const { data, refetch, isLoading, isFetching } = useListVouchesForQuery(profileId);

  const [updateUserFn] = useUpdateUserMutation();
  const [updateForeignUserFn] = useUpdateForeignUserMutation();

  const [toggleText, setToggleText] = useState(false);

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
      if (res.error) {
        showError(res);
        return;
      }
    });
  };

  const updateForeignUser = async ({ mate_body, m_userId }) => {
    await updateForeignUserFn({ body: mate_body, userId: m_userId }).then(
      (resp) => { if (resp.error) { showError(resp); return; } }
    );
  };

  const removeBubbleMate = (mate, msg) => {
    const arr = [...(current_user?.bubbleMates ?? null)];
    const mate_arr = [...(mate?.bubbleMates ?? null)];

    const body = {
      bubbleMates: arr.filter((obj) => obj.userId !== mate._id),
    };
    const mate_body = {
      bubbleMates: mate_arr.filter((obj) => obj.userId !== current_user?._id),
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

    const body = {
      bubbleMates: arr,
    };
    const mate_body = {
      bubbleMates: mate_arr,
    };

    try {
      await updateUser({ body, userId: current_user?._id });
      await updateForeignUser({ mate_body, m_userId: mate?._id });
    } catch (err) {
      console.log(err);
    }
  };

  const acceptBubbleMate = async (mate) => {
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

    try {
      await updateUser({ body, userId: current_user?._id });
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
            acceptBubbleMate(mate);
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
  ///__________________________________END__________________________________

  //screen loading component
  const loadingComponent = () => (
    <View style={styles.loadingComponent}>
      <LoadingComponent />
    </View>
  )

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.contentContainerBubbleVouch}>
        <NavHeader message="What would you like to do?" />

        <View style={styles.headingContainer}>
          <Text style={styles.headingText}>Vouches</Text>
        </View>
      </View>
    );
  }

  function renderContentSection() {
    return (
      <View style={styles.contentListContainer}>
        <FlatList
          data={data?.data}
          keyExtractor={(item, index) => index.toString()}
          onRefresh={refetch}
          refreshing={isFetching}
          renderItem={({ item, index }) => {
            return (
              <View key={index} style={styles.vouchesContentContainer}>
                <View style={styles.vouchesContentItemContainer}>
                  {/*vouch image section*/}
                  <View style={styles.vouchImageAndDescriptionContainer}>
                    {/*vouch user image item*/}
                    <TouchableOpacity
                      onPress={() => {
                        if (item?.userId?._id === current_user?._id)
                          navigation.navigate("LoggedInAccountUserScreen");
                        else
                          navigation.navigate("AccountFullViewScreen", {
                            userId: item?.userId?._id,
                          });
                      }}
                      style={styles.vouchUserImageContainer}
                    >
                      <ImageBackground source={images.userFrame} style={styles.vouchUserImageContent}>
                        <Image
                          source={{ uri: item?.userId?.profileImage }}
                          style={styles.vouchUserImageItem}
                        />
                      </ImageBackground>
                    </TouchableOpacity>

                    {/*vouch user name section*/}
                    <View style={styles.vouchUserNameContainer}>
                      {/*vouch user name item*/}
                      <TouchableOpacity
                        onPress={() => {
                          if (item?.userId?._id === current_user?._id)
                            navigation.navigate("LoggedInAccountUserScreen");
                          else
                            navigation.navigate("AccountFullViewScreen", {
                              userId: item?.userId?._id,
                            });
                        }}
                        style={styles.vouchUserNameContent}
                      >
                        <Text numberOfLines={1} style={styles.vouchUserNameItem}>
                          {item?.userId?.firstName}{" "}
                          {item?.userId?.lastName}
                        </Text>
                      </TouchableOpacity>

                      {/*vouch blurb item*/}
                      <View style={styles.vouchUserNameContent}>
                        <Text numberOfLines={2} style={styles.vouchUserBlurbItem}>
                          {item?.userId?.blurb}
                        </Text>
                      </View>

                      {/*vouch date & add bubble section*/}
                      <View style={styles.vouchDateAndActionContainer}>
                        {/*vouch date item*/}
                        <View style={styles.vouchDateContainer}>
                          <Text style={styles.vouchDateItem}>
                            {moment(item?.vouchDate).format("MMM YYYY")}
                          </Text>
                        </View>

                        {/*vouch bubble item*/}
                        {item?.userId?._id === current_user?._id ? null
                          : <View style={styles.vouchActionButtonContainer}>
                            <TouchableOpacity
                              onPress={() =>
                                bubbleMateClicked(item?.userId)
                              }
                            >
                              <Text style={[styles.vouchActionButtonTextItem, {
                                color: isBubbleMate(item?.userId) === "Requested"
                                  ? COLORS.orange
                                  : isBubbleMate(item?.userId) === "Request"
                                    ? COLORS.greenActive
                                    : isBubbleMate(item?.userId) === "Add"
                                      ? COLORS.purple
                                      : isBubbleMate(item?.userId) === "Mate"
                                        ? COLORS.darkGray
                                        : COLORS.transparent
                              }]}>
                                {
                                  isBubbleMate(item?.userId) === "Requested"
                                    ? "Request sent"
                                    : isBubbleMate(item?.userId) === "Request"
                                      ? "Accept | Reject"
                                      : isBubbleMate(item?.userId) === "Add"
                                        ? "Add bubble mate"
                                        : isBubbleMate(item?.userId) === "Mate"
                                          ? "Bubble mate"
                                          : ""
                                }
                              </Text>
                            </TouchableOpacity>
                          </View>}
                      </View>
                    </View>
                  </View>

                  {/*vouch description section*/}
                  <View style={styles.vouchDescriptionContentContainer}>
                    <Text numberOfLines={toggleText ? undefined : 2} style={styles.vouchDescriptionTextItem}>
                      {item?.description}
                    </Text>

                    {/*see more toggler*/}
                    {item?.description?.length > 150 && <TouchableOpacity
                      onPress={() => setToggleText(!toggleText)}
                      style={styles.textToggleContainer}
                    >
                      <Text style={styles.textToggleItem}>
                        {!toggleText ? "..see more" : "..hide"}
                      </Text>
                    </TouchableOpacity>}
                  </View>

                  {/*vouch image section*/}
                  <View style={styles.vouchImageAttachmentContainer}>
                    <Image
                      source={{ uri: item?.vouchImage }}
                      style={styles.vouchImageAttachmentItem}
                    />
                    <View style={styles.vouchLineSeparator} />
                  </View>
                </View>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={styles.vouchContentFooter} />}
          ListEmptyComponent={
            <View style={styles.emptyComponentContainer}>
              <EmptyFlatlistComponent msg={"There are currently no vouches on this profile."} />
            </View>
          }
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        loadingComponent()
      ) : (
        <>
          {renderHeaderSection()}
          {renderContentSection()}
        </>
      )}
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

  //loading component
  loadingComponent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyComponentContainer: {
    marginTop: "25%",
  },

  //header section
  contentContainerBubbleVouch: {
    marginTop: Platform.OS === "ios" ? "10%" : 0,
    marginBottom: 19,
  },
  headingContainer: {
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  headingText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  //vouch content list section
  contentListContainer: {
    width: "100%",
    flexDirection: "column",
  },
  vouchesContentContainer: {
    paddingHorizontal: 10,
    flexDirection: "column",
  },
  vouchesContentItemContainer: {
    marginBottom: 30,
  },

  //vouch user image section
  vouchImageAndDescriptionContainer: {
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  vouchUserImageContainer: {
    width: "20%",
  },
  vouchUserImageContent: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  vouchUserImageItem: {
    width: 72,
    height: 72,
    resizeMode: "cover",
    borderRadius: 6,
  },
  vouchUserNameContainer: {
    width: Platform.OS === "ios" ? "77%" : "72%",
    flexDirection: "column",
  },
  vouchUserNameContent: {
    width: "100%",
  },
  vouchUserNameItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  vouchUserBlurbItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  vouchDateAndActionContainer: {
    width: "100%",
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  vouchDateContainer: {
    width: "50%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  vouchDateItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  vouchActionButtonContainer: {
    width: "50%",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  vouchActionButtonTextItem: {
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },

  //vouch description section
  vouchDescriptionContentContainer: {
    width: "100%",
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  vouchDescriptionTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  textToggleContainer: {
    marginTop: 5,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  textToggleItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
    opacity: 0.5,
  },

  //vouch image section
  vouchImageAttachmentContainer: {
    width: "100%",
    flexDirection: "column",
  },
  vouchImageAttachmentItem: {
    width: "100%",
    height: 350,
    resizeMode: "cover",
    borderRadius: 6,
  },
  vouchLineSeparator: {
    width: "100%",
    marginTop: 15,
    alignSelf: "center",
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
  },
  vouchContentFooter: {
    marginBottom: Platform.OS === "ios" ? "33%" : "20%"
  },
});

export default ProfileBubbleVouchScreen;
