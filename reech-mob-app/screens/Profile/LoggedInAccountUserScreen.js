import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  Animated,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Entypo, MaterialCommunityIcons, Fontisto, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

//import dependencies
import { COLORS, icons, images } from "../../constants";
import { CustomButton, EmptyFlatlistComponent, LoadingComponent } from "../../components";
import { useReadUserQuery, useListMyProfilesQuery } from "../../redux/api/api-slice";
import { useReadBubbleMatesQuery } from "../../redux/api/api-slice";
import { setUsersImage } from "../../redux/features/all-user-image-slice";
import { useSelector, useDispatch } from "react-redux";

///__________________Tracking database changes__________________
import io from "socket.io-client";
import NavHeader from "@/components/Headers/NavHeader";

const SOCKET_SERVER_URL = "https://reech-node-api-7o3szyfdpq-uc.a.run.app/";
//`${process.env.REACT_APP_API_URL}${process.env.MAIN_API_BASE_PATH}`;

const LoggedInAccountUserScreen = () => {
  const navigation = useNavigation();

  const dispatch = useDispatch();
  
  const [myProfiles, setMyProfiles] = useState([]);
  const [mates_arr, setMateArr] = useState([])

  const image = useSelector((state) => state.users_images.usersImages);
  const current_user = useSelector((state) => state.user.current_user);
  const cache_profiles = useSelector((state) => state.profiles.user_profiles);

  const userId = current_user._id;

  const {
    data: user,
    refetch,
    error: fetchError,
    isLoading,
  } = useReadUserQuery(userId ?? null);

  const { data: fetched_profiles } = useListMyProfilesQuery(user?._id);
  const { data: all_mates } = useReadBubbleMatesQuery(mates_arr ?? []);

  useEffect(() => {
    if (user) {
      !image[user?.profileImage] && _loadImage(user?.profileImage);
      !image[user?.coverImage] && _loadImage(user?.coverImage);
      setMateArr(user?.bubbleMates)
    }
  }, [user]);

  // useEffect(() => {
  //   console.log("all mates: ", all_mates?.data)
  // }, [all_mates]);

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

  useEffect(() => {
    setMyProfiles(fetched_profiles?.data ?? cache_profiles);
  }, [cache_profiles, fetched_profiles]);

  ///-----------user status update function
  useEffect(() => {
    const connectSocket = async () => {
      const socket = io(SOCKET_SERVER_URL, {
        transports: ["websocket"],
        extraHeaders: {
          "Svc-Tkn": `Bearer ${process.env.SvcTkn_Main_API}`,
        },
      });
      socket.on("user-updated", () => {
        refetch();
      });
    };
    connectSocket();
  }, []);

  const onLocationPress = () => {
    console.log("show google maps screen");
  };

  const onOpportunityPress = () => {
    navigation.navigate("MyOpportunityCardScreen");
  };

  const viewBubbleMatesClicked = () => {
    navigation.navigate("BubbleMateListScreen", {
      user: user,
    });
  };

  const onEditAccountPress = () => {
    navigation.navigate("ProfileScreen");
  };

  const onVouchedForPress = () => {
    navigation.navigate("IVouchForScreen");
  };

  const onSavedDraftsPress = () => {
    navigation.navigate("SavedToDraftsScreen");
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
          to="ManageProfileScreen"
          to_params={{ user: user, user_profiles: myProfiles }}
          message="What would you like to do?"
          icon={<FontAwesome5 name="users-cog" size={18} color={COLORS.white} />}
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
            navigation.navigate("LoggedInAccountAboutMeScreen", {
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
            <Text style={styles.aboutMeTextItem}>Edit about me</Text>
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
        {/*blurb section*/}
        <View style={styles.blurbContainer}>
          <Text
            style={styles.blurbTextItem}
            numberOfLines={6}
            onPress={() => [
              popOutSideMenuItems(),
              navigation.navigate("LoggedInAccountAboutMeScreen", {
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
          <View style={styles.addBubbleMateActionItem}></View>

          {/*bubble mates section*/}
          <View style={styles.bubblePicturesContainer}>
            {/*bubble mates picture section*/}
            <View style={styles.bubblePictures}>
              {/*show bubble mate image list*/}
              {all_mates?.data?.map((bub_mate, i) => (
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
              {user?.bubbleMates?.length >= 4 ? (
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
                    {user?.bubbleMates?.length >= 99 ? (
                      <Text style={styles.gradientTextItem}>+99</Text>
                    ) : (
                      <Text style={styles.gradientTextItem}>
                        +{user?.bubbleMates?.length - 3}
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
              {user?.bubbleMates?.length <= 1
                ? user?.bubbleMates?.length + " bubble mate"
                : user?.bubbleMates?.length >= 2
                  ? user?.bubbleMates?.length + " bubble mates"
                  : user?.bubbleMates?.length > 99
                    ? user?.bubbleMates?.length + " bubble mates"
                    : "Bubble mates"}
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
          <View style={styles.bubbleMatesSpacer} />
        </View>

        <View style={styles.dividerItem} />

        {/*bubble mates list screen section*/}
        <View style={styles.userActionContainer}>
          <CustomButton
            type="ACCOUNTBUBBLE"
            text="Edit profiles"
            onPress={onEditAccountPress}
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

          <CustomButton
            type="ACCOUNTBUBBLE"
            text="Saved drafts"
            onPress={onSavedDraftsPress}
          />
        </View>

        {/*social graph icon  section*/}
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
      {isLoading
        ? loadingComponent()
        : fetchError
          ? <EmptyFlatlistComponent />
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
    top: Platform.OS === "ios" ? 43 : 0,
  },

  //loading component
  loadingComponent: {
    flex: 1,
  },

  //header section
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },

  //half screen content
  halfScreenContainer: {
    top: Platform.OS === "ios" ? 35 : 45,
    flexDirection: "column",
  },

  //image section container
  imageSectionContainer: {
    bottom: 40,
    width: "100%",
    height: "100%",
    flexDirection: "column",
  },
  userProfilePictureItem: {
    height: Platform.OS === "ios" ? "68%" : "71%",
    width: "100%",
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
    top: "-4%",
    height: Platform.OS === "ios" ? "76%" : "80%",
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

  //about me  button
  aboutMeContainer: {
    top: Platform.OS === "ios" ? "60%" : "64%",
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
  topUserNameContainer: {
    marginTop: -25,
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
    top: 40,
    marginTop: Platform.OS === "ios" ? 65 : 40,
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
    width: "86%",
    height: Platform.OS === "ios" ? 140 : 125,
    backgroundColor: COLORS.transparent,
  },
  addBubbleMateActionItem: {
    marginBottom: 40,
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
    width: Platform.OS === "ios" ? 13 : 15,
    height: Platform.OS === "ios" ? 13 : 15,
    resizeMode: "contain",
  },
  bubbleMatesSpacer: {
    marginBottom: Platform.OS === "ios" ? 20 : 15,
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

  //popup modal
  touchLogo: {
    top: 3.5,
    height: 45,
    width: 44,
  },
  touchLogoItem: {
    right: Platform.OS === "ios" ? 35 : 25,
  },
  modalTopContainer: {
    flex: 1,
    height: "50%",
    justifyContent: "center",
  },
  imgBg: {
    overflow: "hidden",
    width: "100%",
    height: "auto",
    resizeMode: "cover",
    borderRadius: 10,
  },
  topContainer: {
    flexDirection: "column",
    marginBottom: "10%",
    borderRadius: 10,
    backgroundColor: COLORS.transparent,
  },
  topBackIcon: {
    top: 10,
    right: 10,
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  textTopContainer: {
    marginHorizontal: 15,
    padding: 10,
  },
  textTopContent: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  textTopItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  textTopSubItem: {
    top: 10,
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  textContainer: {
    marginHorizontal: 15,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  textContent: {
    height: 40,
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 10,
    backgroundColor: COLORS.white,
  },
  textItem: {
    color: COLORS.black,
    left: 10,
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  modalBtnImage: {
    width: 35,
    height: 35,
    resizeMode: "cover",
    borderRadius: 100,
    borderColor: COLORS.purple,
    borderWidth: 1,
  },
});

export default LoggedInAccountUserScreen;
