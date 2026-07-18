import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Pressable,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Entypo,
  Fontisto,
  Foundation,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

//import dependencies
import { COLORS, icons, images } from "../constants";
import { CustomButton } from "../components";
import { useListJobCategoryQuery } from "../redux/api/job-category";
import { setJobTitle } from "../redux/features/job-title-slice";
import { setCurrentUser } from "../redux/features/user-slice";
import { useReadUserQuery } from "../redux/api/api-slice";
import { useSelector, useDispatch } from "react-redux";
import { useListMyProfilesQuery } from "../redux/api/api-slice";
import { setProfiles } from "@/redux/features/profiles-slice";

///__________________Tracking database changes__________________
import io from "socket.io-client";
const SOCKET_SERVER_URL = "https://reech-node-api-7o3szyfdpq-uc.a.run.app/";
//`${process.env.REACT_APP_API_URL}${process.env.MAIN_API_BASE_PATH}`;

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.current_user);
  const { data, refetch } = useListJobCategoryQuery();
  const { data: current_user } = useReadUserQuery(user?._id);

  const { data: fetched_profiles } = useListMyProfilesQuery(user?._id);

  useEffect(() => {
    dispatch(setProfiles({ user_profiles: fetched_profiles?.data }))
  }, [fetched_profiles])

  useEffect(() => {
    dispatch(setJobTitle({ job_titles: data?.data }));
    current_user && dispatch(setCurrentUser({ current_user: current_user }));
  }, [data]);

  ///-----------update categories
  useEffect(() => {
    const connectSocket = async () => {
      const socket = io(SOCKET_SERVER_URL, {
        transports: ["websocket"],
        extraHeaders: {
          "Svc-Tkn": `Bearer ${process.env.SvcTkn_Main_API}`,
        },
      });
      socket.on("category-updated", (data) => {
        refetch();
        dispatch(setJobTitle({ job_titles: data?.data }));
      });
    };
    connectSocket();
  }, []);

  //custom navigation
  const onReechingForPressed = () => {
    navigation.navigate("ReechingForHomeScreen");
  };

  const onBeReechedPressed = () => {
    navigation.navigate("ProfileSelectorScreen");
  };

  //state handlers
  const [menuDropDown, setMenuDropDown] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [shortcutScreenListData, setShortcutScreenListData] = useState([
    {
      id: 1,
      screenNameIdentifier: "Reech Ride",
      screenURI: "DriverAddOpportunityHomeScreen",
    }
  ]);

  //get user current location
  useEffect(() => {
    getLocationAsync();
  }, []);

  const getLocationAsync = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status === "granted") {
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      fetchLocationName(location.coords.latitude, location.coords.longitude);
    } else {
      console.log("Location permission denied");
    }
  };

  const fetchLocationName = async (latitude, longitude) => {
    const map_api_key = process.env.GOOGLE_PLACES_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${map_api_key}`;

    try {
      const response = await axios.get(url);
      const result = response.data.results[0];
      if (result) {
        setLocationName(result.formatted_address);
      }
    } catch (error) {
      console.error("Error fetching location name:", error);
    }
  };

  // Load data from AsyncStorage when the component mounts
  useEffect(() => {
    const focusHandler = navigation.addListener("focus", () => {
      async function loadAsyncData() {
        try {
          const data = await AsyncStorage.getItem("shortcutScreenListData");
          if (data) {
            let parsedData = JSON.parse(data || []);

            let shortcutArr = [
              {
                id: 1,
                screenNameIdentifier: "Reech Ride",
                screenURI: "DriverAddOpportunityHomeScreen",
              },
              ...parsedData
            ];

            setShortcutScreenListData(shortcutArr);
          }
        } catch (error) {
          console.error("Error loading data from AsyncStorage:", error);
        }
      }
      loadAsyncData();
    });
    return focusHandler;
  }, [navigation]);

  //background image changing function
  const imgArray = [images.welcome, images.welcome];

  const date = new Date();
  const time = date.getHours();
  const [counter, setCounter] = useState(0);

  const dayTime = time;
  dayTime.toLocaleString();

  useEffect(() => {
    if (dayTime < 6 || dayTime >= 18) {
      //nighttime
      setCounter(1);
    } else if (dayTime >= 6 && dayTime < 18) {
      //daytime
      setCounter(0);
    }
  }, [dayTime]);

  // `image` is derived state from the image array
  const image = imgArray[counter];

  //top navigation section
  function renderTopNavigationSection() {
    return (
      <View style={styles.topNavigationContainer}>
        {/*menu section*/}
        <View style={styles.topMenuContainer}>
          {menuDropDown ? (
            <Pressable onPress={() => setMenuDropDown(!menuDropDown)}>
              <Image source={icons.menuX} style={styles.burgerMenu} />
            </Pressable>
          ) : (
            <Pressable onPress={() => setMenuDropDown(!menuDropDown)}>
              <Image source={icons.burgerMenu} style={styles.burgerMenu} />
            </Pressable>
          )}
        </View>

        {/*logo section*/}
        <View style={styles.topLogoContainer}>
          <Image
            source={require("../assets/reechLogo.png")}
            style={styles.logoImageItem}
          />

          {/*logo item section*/}
          {location ? (
            <View style={styles.locationContainer}>
              <Entypo name="location-pin" size={18} color={COLORS.white} />
              <Text style={styles.locationTextItem}>{locationName}</Text>
            </View>
          ) : (
            <View style={styles.locationContainer}>
              <Entypo name="location-pin" size={18} color={COLORS.white} />
              <Text style={styles.locationTextItem}>
                {" "}
                Western Cape, Cape Town
              </Text>
            </View>
          )}
        </View>

        {/*user picture with mask section*/}
        <Pressable
          onPress={() => navigation.navigate("LoggedInAccountUserScreen")}
          style={styles.userAccountImageContainer}
        >
          <ImageBackground
            source={images.userFrame}
            style={styles.maskViewLinearGradientContainer}
          >
            <Image
              source={
                user?.profileImage
                  ? { uri: user?.profileImage }
                  : images.defaultRounded
              }
              style={styles.userAccountImageItem}
            />
          </ImageBackground>
        </Pressable>
      </View>
    );
  }

  function menuItemSection() {
    return (
      <View style={styles.menuItemContainer}>
        {menuDropDown ? (
          <View style={styles.menuContainer}>
            <Pressable onPress={() => navigation.navigate("BubbleScreen")}>
              <Image source={icons.bubbleIcon} style={styles.iconItem} />
            </Pressable>
            <Pressable onPress={() => navigation.navigate("ChatroomScreen")}>
              <Image source={icons.chatIcon} style={styles.iconItem} />
            </Pressable>
            <Pressable onPress={() => navigation.navigate("PostOpScreen")}>
              <Image source={icons.howToIcon} style={styles.iconItem} />
            </Pressable>
          </View>
        ) : null}
      </View>
    );
  }

  //bottom section
  function renderBottomTextSection() {
    return (
      <View style={styles.bottomSectionContainer}>
        <Text style={styles.bottomTextItem}>What would you</Text>
        <Text style={styles.bottomTextItem}>like to do today?</Text>
      </View>
    );
  }

  //bottom buttons
  function renderBottomButtons() {
    return (
      <View style={styles.bottomButtonContainer}>
        <CustomButton
          onPress={onReechingForPressed}
          text="Reech for"
          type="WELCOME"
        />

        <CustomButton
          onPress={onBeReechedPressed}
          text="be Reeched"
          type="WELCOME"
        />
      </View>
    );
  }

  //short cut section
  function renderShortCutSection() {
    return (
      <View style={styles.shortCutContainer}>
        {/*header section*/}
        <View style={styles.shortCutHeaderContainer}>
          <Text style={styles.shortCutHeaderItem}>Shortcuts</Text>
        </View>

        {/*short cut item container*/}
        <FlatList
          data={shortcutScreenListData}
          keyExtractor={(item, index) => index.toString()}
          numColumns={4}
          columnWrapperStyle={styles.shortcutItemsContainer}
          contentContainerStyle={styles.shortcutItemWrapper}
          renderItem={({ item }) => {
            return (
              <View style={styles.shortcutItemContainer}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(`${item.screenURI}`, {
                      jobTitleId: item.jobTitleId,
                      reechImg: item.reechImg,
                    })
                  }
                  style={styles.shortcutItemContentContainer}
                >
                  {/*short cut icon representor*/}
                  <View style={styles.shortcutItemIconContainer}>
                    {item.screenNameIdentifier === "Reech Ride" ? (
                      <FontAwesome5
                        name="car-side"
                        size={Platform.OS === "ios" ? 35 : 28}
                        strokeWidth={0}
                        color={COLORS.white}
                      />
                    ) : item.screenNameIdentifier === "My wallet" ? (
                      <Fontisto
                        name="wallet"
                        size={Platform.OS === "ios" ? 35 : 28}
                        strokeWidth={0}
                        color={COLORS.white}
                      />
                    ) : item.screenNameIdentifier === "Dog walker" ? (
                      <Foundation
                        name="guide-dog"
                        size={Platform.OS === "ios" ? 40 : 28}
                        strokeWidth={0}
                        color={COLORS.white}
                      />
                    ) : item.screenNameIdentifier === "My rewards" ? (
                      <SimpleLineIcons
                        name="present"
                        size={Platform.OS === "ios" ? 35 : 28}
                        strokeWidth={0}
                        color={COLORS.white}
                      />
                    ) : item.screenNameIdentifier === "My wishlist" ? (
                      <FontAwesome
                        name="star"
                        size={Platform.OS === "ios" ? 35 : 28}
                        strokeWidth={0}
                        color={COLORS.white}
                      />
                    ) : item.screenNameIdentifier === "My dashboard" ? (
                      <Fontisto
                        name="pie-chart-2"
                        size={Platform.OS === "ios" ? 35 : 28}
                        color={COLORS.white}
                      />
                    ) : item.screenNameIdentifier === "Yoga instructor" ? (
                      <MaterialCommunityIcons
                        name="yoga"
                        size={Platform.OS === "ios" ? 35 : 28}
                        strokeWidth={0}
                        color={COLORS.white}
                      />
                    ) : item.screenNameIdentifier === "Gardener" ? (
                      <MaterialCommunityIcons
                        name="spade"
                        size={Platform.OS === "ios" ? 35 : 28}
                        strokeWidth={0}
                        color={COLORS.white}
                      />
                    ) : item.screenNameIdentifier === "Cleaner" ? (
                      <MaterialCommunityIcons
                        name="silverware-clean"
                        size={Platform.OS === "ios" ? 35 : 28}
                        strokeWidth={0}
                        color={COLORS.white}
                      />
                    ) : item.screenNameIdentifier === "Tutor" ? (
                      <FontAwesome5
                        name="book-reader"
                        size={Platform.OS === "ios" ? 35 : 28}
                        strokeWidth={0}
                        color={COLORS.white}
                      />
                    ) : item.screenNameIdentifier === "My QR Code" ? (
                      <MaterialCommunityIcons
                        name="qrcode-scan"
                        size={Platform.OS === "ios" ? 35 : 28}
                        strokeWidth={0}
                        color={COLORS.white}
                      />
                    ) : item.screenNameIdentifier === "Car washer" ? (
                      <MaterialIcons
                        name="local-car-wash"
                        size={Platform.OS === "ios" ? 35 : 28}
                        strokeWidth={0}
                        color={COLORS.white}
                      />
                    ) : item.screenNameIdentifier === "Barber" ? (
                      <FontAwesome
                        name="scissors"
                        size={Platform.OS === "ios" ? 35 : 28}
                        strokeWidth={0}
                        color={COLORS.white}
                      />
                    ) : item.screenNameIdentifier === "Dentist" ? (
                      <FontAwesome5
                        name="tooth"
                        size={Platform.OS === "ios" ? 35 : 28}
                        strokeWidth={0}
                        color={COLORS.white}
                      />
                    ) : item.screenNameIdentifier === "Baker" ? (
                      <MaterialCommunityIcons
                        name="cupcake"
                        size={Platform.OS === "ios" ? 35 : 28}
                        strokeWidth={0}
                        color={COLORS.white}
                      />
                    ) : item.screenNameIdentifier === "Au pair" ? (
                      <MaterialIcons
                        name="child-friendly"
                        size={Platform.OS === "ios" ? 35 : 28}
                        strokeWidth={0}
                        color={COLORS.white}
                      />
                    ) : item.screenNameIdentifier === "Accountant" ? (
                      <MaterialCommunityIcons
                        name="account-cash-outline"
                        size={Platform.OS === "ios" ? 35 : 28}
                        strokeWidth={0}
                        color={COLORS.white}
                      />
                    ) : item.screenNameIdentifier === "Forklift driver" ? (
                      <MaterialCommunityIcons
                        name="forklift"
                        size={Platform.OS === "ios" ? 35 : 28}
                        strokeWidth={0}
                        color={COLORS.white}
                      />
                    ) : null}
                  </View>

                  {/*short cut name item*/}
                  <View style={styles.shortcutItemTextContainer}>
                    <Text numberOfLines={1} style={styles.shortcutItemTextItem}>
                      {item.screenNameIdentifier}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />

        {/*add new shortcut item: max 8*/}
        <View
          style={
            shortcutScreenListData.length === 8
              ? null
              : styles.removeIconContentContainer
          }
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("AddShortCutScreen");
            }}
            style={styles.addIconContainer}
          >

            <Image source={icons.addIcon} style={styles.addIconItem} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  //screen overlay
  function renderOverLaySection() {
    return (
      <LinearGradient
        style={styles.overLayItem}
        colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.8)"]}
        start={{ x: 0.0, y: 0 }}
        end={{ x: 0.0, y: 1 }}
      />
    );
  }

  //render screen content
  return (
    <ImageBackground source={image} style={styles.imageBackground}>
      {renderTopNavigationSection()}
      {menuItemSection()}
      <View style={styles.mainBottomSectionContainer}>
        {renderBottomTextSection()}
        {renderBottomButtons()}
        {renderShortCutSection()}
      </View>
      {renderOverLaySection()}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  //render screen content
  imageBackground: {
    width: "100%",
    height: "100%",
  },

  //top navigation
  topNavigationContainer: {
    top: Platform.OS === "ios" ? 50 : 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    zIndex: 90,
    height: "10%",
  },
  topMenuContainer: {
    width: "10%",
  },
  burgerMenu: {
    width: 57,
    height: 80,
  },

  //logo section
  topLogoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logoImageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logoImageItem: {
    width: Platform.OS === "ios" ? 140 : 120,
    height: Platform.OS === "ios" ? 140 : 120,
    resizeMode: "contain",
  },
  locationContainer: {
    flexDirection: "row",
    bottom: Platform.OS === "ios" ? 15 : 15,
  },
  locationTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
    textAlign: "center",
    maxWidth: Platform.OS === "ios" ? 200 : 180,
  },

  //menu items
  menuItemContainer: {
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 90,
  },
  menuContainer: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: `rgba(232, 236, 241, 0.3)`,
    paddingHorizontal: 15,
    flexDirection: "column",
    marginTop: Platform.OS === "ios" ? "30%" : "15%",
    marginLeft: "-2%",
  },
  iconItem: {
    width: 28,
    height: 28,
    resizeMode: "contain",
    marginVertical: Platform.OS === "ios" ? 20 : 15,
  },
  userAccountImageContainer: {
    width: 0,
    height: 0,
    marginRight: "10%",
    marginTop: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  maskViewLinearGradientContainer: {
    width: 61,
    height: 61,
    padding: 5,
  },
  userAccountImageItem: {
    bottom: 1.5,
    right: 1.5,
    width: 54,
    height: 54,
    borderRadius: 8,
    borderColor: COLORS.purple,
  },

  //bottom section
  mainBottomSectionContainer: {
    position: "absolute",
    alignSelf: "center",
    flexDirection: "column",
    zIndex: 90,
    bottom: Platform.OS === "ios" ? "0%" : "5%",
    width: "100%",
    height: "65%",
  },
  bottomSectionContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginBottom: Platform.OS === "ios" ? "10%" : "5%",
  },
  bottomTextItem: {
    marginBottom: 5,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  bottomButtonContainer: {
    marginHorizontal: "5%",
    marginBottom: "20%",
    width: "90%",
  },

  //short cut section
  shortCutContainer: {
    flexDirection: "column",
    height: Platform.OS === "ios" ? "40%" : "45%",
  },
  shortCutHeaderContainer: {
    flexDirection: "column",
    width: "100%",
    marginBottom: "0%",
    paddingHorizontal: Platform.OS === "ios" ? 20 : 20,
  },
  shortCutHeaderItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  shortcutItemsContainer: {
    width: "100%",
    maxHeight: Platform.OS === "ios" ? "47%" : "60%",
  },
  shortcutItemWrapper: {
    flexDirection: "column",
  },
  shortcutItemContainer: {
    height: Platform.OS === "ios" ? 70 : 55,
    width: "25%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 0,
  },
  shortcutItemContentContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  shortcutItemIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    minHeight: Platform.OS === "ios" ? 45 : 30,
  },
  shortcutItemTextContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  shortcutItemTextItem: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: "PoppinsLight",
  },
  removeIconContentContainer: {
    top: Platform.OS === "ios" ? 15 : 0,
    justifyContent: "center",
    alignItems: "center",
  },
  addIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  addIconItem: {
    top: Platform.OS === "ios" ? 0 : -10,
    width: Platform.OS === "ios" ? 60 : 55,
    height: Platform.OS === "ios" ? 60 : 55,
  },

  //overlay section
  overLayItem: {
    height: 600,
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
});

export default WelcomeScreen;
