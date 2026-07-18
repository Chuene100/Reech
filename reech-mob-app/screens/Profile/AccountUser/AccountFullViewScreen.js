import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
  Pressable,
  Animated,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Entypo, MaterialCommunityIcons, Fontisto, Octicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";
import { useSocket } from "@/utils/socket";

//import dependencies
import { COLORS, icons, images } from "../../../constants";
import { CustomButton, EmptyFlatlistComponent, LoadingComponent } from "../../../components";
import { useReadUserQuery, useListMyProfilesQuery, useUpdateForeignUserMutation } from "../../../redux/api/api-slice";
import { useCreateChatRoomMutation } from "@/redux/api/chat";
import { setUsersImage } from "../../../redux/features/all-user-image-slice";
import { useUpdateUserMutation } from "../../../redux/api/api-slice";
import { useReadBubbleMatesQuery } from "../../../redux/api/api-slice";
import { useSelector, useDispatch } from "react-redux";

///__________________Tracking database changes__________________
import io from "socket.io-client";
import NavHeader from "@/components/Headers/NavHeader";
const SOCKET_SERVER_URL = "https://reech-node-api-7o3szyfdpq-uc.a.run.app/";
//`${process.env.REACT_APP_API_URL}${process.env.MAIN_API_BASE_PATH}`;

const AccountFullViewScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const socket = useSocket();

  const { userId } = route.params;

  const image = useSelector((state) => state.users_images.usersImages);
  const current_user = useSelector((state) => state.user.current_user);

  const [mates_arr] = useState(current_user?.bubbleMates ?? [])

  const { data: user, refetch, error: fetchError, isLoading } = useReadUserQuery(userId ?? null);
  const { data: myProfiles, isLoading: isLoadingProfile, error: profileError } = useListMyProfilesQuery(userId ?? null);

  const [updateUserFn] = useUpdateUserMutation();
  const [updateForeignUserFn] = useUpdateForeignUserMutation();
  const { data: all_mates } = useReadBubbleMatesQuery(mates_arr ?? []);
  const [createChatRoomFn] = useCreateChatRoomMutation();


  useEffect(() => {
    if (user) {
      !image[user?.profileImage] && _loadImage(user?.profileImage);
      !image[user?.coverImage] && _loadImage(user?.coverImage);
    }
  }, [user]);

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

  ///-----------user status update function
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

  const showError = (res) =>
    Toast.show({
      type: "error",
      text1: "Error",
      text2: res.error.data?.error ?? "Something went wrong. Please try again",
    });

  // navigate to inbox
  const navigateToChat = (item) => {
    navigation.navigate("MainMessageFullViewScreen", {
      id: item?._id,
      name: item?.name,
      avatar: item?.avatar
    });
  }

  const handleChat = (chatter, chattee) => {
    const payload = {
      userIds: [chattee._id],
      name: `${chattee.firstName} ${chattee.lastName}`,
      initiatorsName: `${chatter.firstName} ${chatter.lastName}`,
      chatInitiator: chatter._id,
      avatar: chattee.profileImage,
      initiatorsAvatar: chatter.profileImage,
    };
    
    createChatRoomFn(payload)
      .then((res) => {
        if (res.error) {
          showError(res);
          return;
        }
        navigateToChat(res?.data?.data);
      })
      .catch((err) => {
        console.error(err);
      })
    socket.emit("create-room", payload)
  }

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

  const getMateInfo = (myMateList) => {
    const mate_set = new Set(myMateList.map(m => m.userId))

    const all_bub_mates = all_mates?.data
      ?.filter((obj) => {
        return mate_set?.has(obj._id);
      })
      .filter(Boolean);

    return all_bub_mates
  }

  const isBubbleMate = (mate) => {
    const bub = current_user?.bubbleMates?.findIndex(
      (obj) => obj.userId === mate._id
    );
    if (bub >= 0) return current_user.bubbleMates[bub]?.status;

    return "Add";
  };

  const isMateOrRequest = (mate, status) => {
    const bub = current_user?.bubbleMates?.findIndex((obj) => obj.userId === mate._id);
    if (bub >= 0 && status === "Mate") { return current_user?.bubbleMates[bub]?.status === "Mate"; }
    if (bub >= 0 && status === "Requested") { return current_user?.bubbleMates[bub]?.status === "Requested"; }
    if (bub >= 0 && status === "Request") { return current_user?.bubbleMates[bub]?.status === "Request"; }

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
      (resp) => {
        if (resp.error) {
          showError(resp);
          return;
        }
      }
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

  const acceptBubbeMate = async (mate) => {
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
  ///__________________________________END__________________________________

  const onLocationPress = () => {
    console.log("show google maps screen");
  };

  const onOpportunityPress = () => {
    navigation.navigate("AccountOpportunityScreen", { user: user });
  };

  const viewBubbleMatesClicked = () => {
    navigation.navigate("BubbleMateListScreen", {
      user: user,
    });
  };

  const onActiveProfilePress = () => {
    navigation.navigate("AccountActiveProfilesScreen", {
      myProfiles: myProfiles?.data,
      user: user,
    });
  };

  const onVouchedForPress = () => {
    navigation.navigate("VouchedForScreen", { userId: user?._id });
  };

  //screen loading component
  const loadingComponent = () => (
    <View style={styles.loadingComponent}>
      <LoadingComponent />
    </View>
  );

  //side panel trigger functions
  const [sidePanelMenuCollection] = useState(new Animated.Value(0));

  const [popSideMenuSection, setPopSideMenuSection] = useState(false);

  const popInSideMenuItems = () => {
    setPopSideMenuSection(true);

    Animated.timing(sidePanelMenuCollection, {
      toValue: 100,
      duration: 500,
      useNativeDriver: false,
    });
  };

  const popOutSideMenuItems = () => {
    setPopSideMenuSection(false);

    Animated.timing(sidePanelMenuCollection, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    });
  };

  //render header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerContainer}>
        <NavHeader
          icon={<Feather name="more-vertical" size={24} color={COLORS.white} />}
          accountModal={true}
          paramUser={user}
          message={"What would you like to do?"}
        />
      </View>
    );
  }

  //screen account user name section
  function renderTopUserNameSection() {
    return (
      <View style={styles.topUserNameContainer}>
        {/*top username content section*/}
        <View style={styles.userNameContainer}>
          <Octicons
            name="dot-fill"
            size={14}
            color={user?.isOnline ? COLORS.greenActive : COLORS.darkGray}
          />
          <Text style={styles.usernameTextItem}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.userPronounItem}>They/Them</Text>
        </View>

        {/*location item section*/}
        <View style={styles.userLocationContainer}>
          <MaterialCommunityIcons
            name="map-marker"
            size={14}
            color={COLORS.white}
            onPress={onLocationPress}
            style={{ right: 4 }}
          />
          <Text style={styles.userLocationText}>
            {user?.address ? user?.address : "Location"}
          </Text>
        </View>
      </View>
    );
  }

  //side panel trigger section
  function renderSidePanelMenuItem() {
    return (
      <View style={styles.sidePanelMenuContainer}>
        {/*side panel trigger*/}
        <View style={styles.sidePanelMenuIconContainer}>
          {popSideMenuSection ? (
            <View style={styles.sidePanelIconContainer}>
              <Entypo
                name={"chevron-right"}
                size={30}
                color={COLORS.white}
                style={{
                  bottom: Platform.OS === "ios" ? 380 : 320,
                  top: 0,
                  right: 0,
                  zIndex: 999,
                }}
                onPress={() => popOutSideMenuItems()}
              />
            </View>
          ) : (
            <Entypo
              name={"chevron-left"}
              size={30}
              color={COLORS.white}
              style={{
                bottom: 0,
                top: Platform.OS === "ios" ? 380 : 320,
                right: Platform.OS === "ios" ? 3 : 5,
                zIndex: 999,
              }}
              onPress={() => popInSideMenuItems()}
            />
          )}
        </View>

        {/*show side panel content*/}
        {popSideMenuSection ? (
          <View style={styles.innerSidePanelContainer}>
            {renderScreenButtonSection()}
          </View>
        ) : null}
      </View>
    );
  }

  //render image screen
  function renderImageSection() {
    return (
      <View style={styles.imageSectionContainer}>
        {/*about me button item*/}
        <Pressable
          onPress={() => [
            popOutSideMenuItems(),
            navigation.navigate("AccountAboutMeScreen", {
              userId: user?._id,
            }),
          ]}
          style={styles.aboutMeContainer}
        >
          <LinearGradient
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            colors={[COLORS.purpleDarker, COLORS.purpleDark, COLORS.purple]}
            style={styles.AboutMeGradientContainer}
          >
            <Text style={styles.aboutMeTextItem}>About me</Text>
          </LinearGradient>
        </Pressable>

        {/*user account image item*/}
        <Image
          style={styles.userProfilePictureItem}
          source={
            user?.profileImage
              ? { uri: image[user?.profileImage] ?? user?.profileImage }
              : images.defaultRounded
          }
        />

        {renderSidePanelMenuItem()}
      </View>
    );
  }

  //render button info screen
  function renderScreenButtonSection() {
    return popSideMenuSection ? (
      <Animated.View style={styles.buttonInfoSectionContainer}>
        {/*message icon section*/}
        <TouchableOpacity
          onPress={() => handleChat(current_user, user)}
          style={styles.messageIconContainer}
        >
          <Image source={icons.chatIcon} style={styles.messageIconItem} />
          <Text style={styles.messageIconTextItem}>Chat</Text>
        </TouchableOpacity>

        {/*blurb section*/}
        <View style={styles.blurbContainer}>
          <Text
            style={styles.blurbTextItem}
            numberOfLines={6}
            onPress={() => [
              popOutSideMenuItems(),
              navigation.navigate("AccountAboutMeScreen", {
                userId: user?._id,
              }),
            ]}
          >
            {user.blurb ? user.blurb : ""}
          </Text>
        </View>

        <View style={styles.dividerItem} />

        {/*bubble mate section*/}
        <View style={styles.bubbleMateSectionContainer}>
          {/*add bubble mate section*/}
          <View style={styles.addBubbleMateActionItem}>
            <CustomButton
              text={
                isBubbleMate(user) === "Requested"
                  ? "Request sent"
                  : isBubbleMate(user) === "Request"
                    ? "Accept | Reject"
                    : isBubbleMate(user) === "Add"
                      ? "Add bubble mate"
                      : isBubbleMate(user) === "Mate"
                        ? "Bubble mate"
                        : ""
              }
              type={
                isBubbleMate(user) === "Requested"
                  ? "REQUEST"
                  : isBubbleMate(user) === "Request"
                    ? "ACTIVE"
                    : isBubbleMate(user) === "Add"
                      ? "BUBBLE"
                      : isBubbleMate(user) === "Mate"
                        ? "MATE"
                        : ""
              }
              onPress={() => [popOutSideMenuItems(), bubbleMateClicked(user)]}
            />
          </View>

          {/*bubble mates section*/}
          <View style={styles.bubblePicturesContainer}>
            {/*bubble mates picture section*/}
            <View style={styles.bubblePictures}>
              {/*show bubble mate image list*/}
              {all_mates?.data && getMateInfo(sharedBubbleMates(user))?.map((bub_mate, i) => (
                <View key={i} style={styles.imageContainer}>

                  {i < 3 && (
                    <Image
                      source={
                        bub_mate?.profileImage
                          ? {
                            uri:
                              image[bub_mate.profileImage] ??
                              bub_mate?.profileImage,
                          }
                          : images.defaultRounded
                      }
                      style={styles.bubbleImages}
                    />
                  )}
                </View>
              ))}

              {/*plus gradient circle indicator*/}
              {sharedBubbleMates(user).length >= 4 ? (
                <View style={styles.plusIconContainer}>
                  <LinearGradient
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    colors={[
                      COLORS.purpleDarker,
                      COLORS.purpleDark,
                      COLORS.purple,
                    ]}
                    style={styles.gradientContainer}
                  >
                    {/*show appropriate value count*/}
                    {sharedBubbleMates(user).length >= 99 ? (
                      <Text style={styles.gradientTextItem}>+99</Text>
                    ) : (
                      <Text style={styles.gradientTextItem}>
                        +{sharedBubbleMates(user).length - 3}
                      </Text>
                    )}
                  </LinearGradient>
                </View>
              ) : null}
            </View>
          </View>

          {/*shared bubble mates section*/}
          <View style={styles.bubbleTextContainer}>
            <Text style={styles.bubbleText}>
              {sharedBubbleMates(user)?.length <= 1
                ? sharedBubbleMates(user)?.length + " shared bubble mate"
                : sharedBubbleMates(user)?.length >= 2
                  ? sharedBubbleMates(user)?.length + " shared bubble mates"
                  : sharedBubbleMates(user)?.length > 99
                    ? sharedBubbleMates(user)?.length + " shared bubble mates"
                    : "Shared bubble mates"}
            </Text>
          </View>

          {/*bubble mates list screen section*/}
          <View style={styles.bubbleMateButtonContainer}>
            <CustomButton
              type="ACCOUNTBUBBLE"
              onPress={() => [viewBubbleMatesClicked(), popOutSideMenuItems()]}
              text={"  Bubble mates"}
              icon={
                <Image
                  source={icons.bubbleIcon}
                  style={styles.buttonIconItem}
                />
              }
            />
          </View>
          <View style={{ marginBottom: 20 }} />
        </View>

        <View style={styles.dividerItem} />

        {/*bubble mates list screen section*/}
        <View style={styles.userActionContainer}>
          <CustomButton
            type="ACCOUNTBUBBLE"
            text="Active profiles"
            onPress={onActiveProfilePress}
          />

          <CustomButton
            type="ACCOUNTBUBBLE"
            text="Cards posted"
            onPress={onOpportunityPress}
          />

          <CustomButton
            type="ACCOUNTBUBBLE"
            text="I vouch for"
            onPress={onVouchedForPress}
          />
        </View>

        {/*social graph icon section*/}
        <View style={styles.socialIconContainer}>
          <Fontisto
            name="graphql"
            size={24}
            color={COLORS.white}
            onPress={() => console.log("goto social graph")}
          />
        </View>
      </Animated.View>
    ) : null;
  }

  //render screen content
  function renderHalfScreenContent() {
    return (
      <View style={styles.halfScreenContainer}>
        {renderTopUserNameSection()}
        {renderImageSection()}
      </View>
    );
  }

  //render screen items
  function renderScreenItems() {
    return (
      <View style={styles.screenContentContainer}>
        {renderHeaderSection()}
        {renderHalfScreenContent()}
      </View>
    );
  }

  //render screen content
  return (
    <View style={styles.container}>
      {isLoading || isLoadingProfile
        ? loadingComponent()
        : fetchError || profileError
          ? EmptyFlatlistComponent()
          : renderScreenItems()}
    </View>
  );
};

//custom styles
const styles = StyleSheet.create({
  //screen container
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //screen content container
  screenContentContainer: {
    top: 45,
  },

  //loading component
  loadingComponent: {
    flex: 1,
    top: 0,
  },

  //half screen content
  headerContainer: {
    marginTop: Platform.OS === "ios" ? 0 : -50,
    zIndex: 99,
  },
  halfScreenContainer: {
    top: 50,
    flexDirection: "column",
    backgroundColor: COLORS.transparent,
  },

  //image section container
  imageSectionContainer: {
    bottom: 40,
    width: "100%",
    height: "100%",
    flexDirection: "column",
  },
  userProfilePictureItem: {
    height: Platform.OS === "ios" ? "75%" : "80%",
    width: 430,
    resizeMode: "cover",
    zIndex: -10,
  },

  //side panel menu
  sidePanelMenuContainer: {
    flex: 1,
    padding: 5,
    position: "absolute",
    zIndex: 19,
    right: 0,
    top: Platform.OS === "ios" ? "-4%" : "-4.3%",
    height: Platform.OS === "ios" ? "84%" : "100%",
    backgroundColor: COLORS.opacityBlack,
  },
  sidePanelMenuIconContainer: {
    height: 80,
    width: 20,
    zIndex: 99,
  },
  sidePanelIconContainer: {
    width: 30,
    height: 80,
    right: 35,
    top: Platform.OS === "ios" ? 355 : 299,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.opacityBlack,
  },
  innerSidePanelContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.transparent,
  },

  //about me button
  aboutMeContainer: {
    top: Platform.OS === "ios" ? "62%" : "72%",
    bottom: 0,
    marginHorizontal: 20,
    zIndex: 10,
  },
  AboutMeGradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    height: 45,
    width: "100%",
  },
  aboutMeTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },

  //button info section
  buttonInfoSectionContainer: {
    width: "55%",
    bottom: 100,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  messageIconContainer: {
    flexDirection: "column",
    padding: 5,
    left: Platform.OS === "ios" ? 95 : 75,
    top: Platform.OS === "ios" ? 30 : 30,
  },
  messageIconItem: {
    top: 8,
    width: 25,
    height: 25,
  },
  messageIconTextItem: {
    top: 15,
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
  },
  topUserNameContainer: {
    marginTop: Platform.OS === "ios" ? -40 : -30,
    height: "9%",
    justifyContent: "center",
    alignItems: "center",
  },
  userNameContainer: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  usernameTextItem: {
    marginBottom: 5,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
    left: 5,
  },
  userPronounItem: {
    marginBottom: 5,
    color: COLORS.darkGray,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    left: 5,
  },
  userLocationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  userLocationText: {
    textAlign: "center",
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
  },
  dividerItem: {
    marginVertical: 10,
    width: "160%",
    alignSelf: "center",
    borderBottomColor: COLORS.gray,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
  },

  //blurb container
  blurbContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: Platform.OS === "ios" ? 135 : 120,
    minWidth: Platform.OS === "ios" ? 200 : 170,
    top: 30,
    marginTop: Platform.OS === "ios" ? 40 : 13,
    marginBottom: 25,
    paddingHorizontal: 10,
    backgroundColor: COLORS.transparent,
  },
  blurbTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    textAlign: "center",
  },

  //bubble mate section
  bubbleMateSectionContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.transparent,
    width: "86%",
    height: Platform.OS === "ios" ? 140 : 135,
    left: 0,
  },
  addBubbleMateActionItem: {
    width: "192%",
  },
  bubblePicturesContainer: {
    bottom: 13,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  bubblePictures: {
    flexDirection: "row",
  },
  imageContainer: {
    maxWidth: 22,
  },
  bubbleImages: {
    width: 30,
    height: 30,
    borderRadius: 30,
  },
  plusIconContainer: {
    top: 0,
  },
  gradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    height: 30,
    width: 30,
  },
  gradientTextItem: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: "PoppinsLight",
  },
  bubbleTextContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: 20,
  },
  bubbleText: {
    right: 3,
    width: "100%",
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  bubbleMateButtonContainer: {
    width: "192%",
  },
  buttonIconItem: {
    width: Platform.OS === "ios" ? 13 : 10,
    height: Platform.OS === "ios" ? 13 : 10,
    resizeMode: "contain",
  },
  userActionContainer: {
    width: "170%",
  },
  socialIconContainer: {
    top: 10,
    marginBottom: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AccountFullViewScreen;
