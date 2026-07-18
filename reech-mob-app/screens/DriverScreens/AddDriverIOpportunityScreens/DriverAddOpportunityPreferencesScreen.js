import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import {
  Feather,
  FontAwesome,
  FontAwesome5,
  Entypo,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { Image } from "react-native";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";

//custom
import { COLORS, icons } from "../../../constants";
import { CustomOpportunityDriverDescriptionInput } from "../../../components";
import NavHeader from "@/components/Headers/NavHeader";
import { usePostRideMutation } from "@/redux/api/ride";

const DriverAddOpportunityPreferencesScreen = ({ route }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigation = useNavigation();
  const prevData = route.params.data;

  const current_user = useSelector((state) => state.user.current_user);

  const [postRideFn, { isLoading }] = usePostRideMutation();

  //main state handlers
  const [showPreference, setShowPreference] = useState(false);
  const [talkative, setTalkative] = useState(false);
  const [quiet, setQuiet] = useState(false);
  const [anySpeech, setAnySpeech] = useState(false);
  const [warm, setWarm] = useState(false);
  const [cool, setCool] = useState(false);
  const [anyTemperature, setAnyTemperature] = useState(false);
  const [myMusic, setMyMusic] = useState(false);
  const [yourMusic, setYourMusic] = useState(false);
  const [noMusic, setNoMusic] = useState(false);
  const [luggageAdded, setLuggageAdded] = useState(false);

  //state handlers: talkative
  const setTalkativeProp = () => {
    setTalkative(true);
    setQuiet(false);
    setAnySpeech(false);
  };
  const setQuietProp = () => {
    setTalkative(false);
    setQuiet(true);
    setAnySpeech(false);
  };
  const setAnySpeechProp = () => {
    setTalkative(false);
    setQuiet(false);
    setAnySpeech(true);
  };

  //state handler: temperature
  const setWarmProp = () => {
    setWarm(true);
    setCool(false);
    setAnyTemperature(false);
  };
  const setCoolProp = () => {
    setWarm(false);
    setCool(true);
    setAnyTemperature(false);
  };
  const setAnyTempProp = () => {
    setWarm(false);
    setCool(false);
    setAnyTemperature(true);
  };

  //state handler: music
  const setMyMusicProp = () => {
    setMyMusic(true);
    setYourMusic(false);
    setNoMusic(false);
  };
  const setYourMusicProp = () => {
    setMyMusic(false);
    setYourMusic(true);
    setNoMusic(false);
  };
  const setNoMusicProp = () => {
    setMyMusic(false);
    setYourMusic(false);
    setNoMusic(true);
  };

  const showError = (res) =>
    Toast.show({
      type: "error",
      text1: "Error",
      text2: res.error.data?.error ?? "Something went wrong. Please try again",
    });

  const showToast = (message) =>
    Toast.show({
      type: "success",
      text1: "Success",
      text2: message,
    });

  //submit data
  const submitDriverData = (data) => {
    const payload = {
      ...data,
      ...prevData,
      userId: current_user?._id,
      tripDuration: Math.round(Number(data.tripDuration)),
      rideStatus: "Requested",
      talkative: talkative ? "Talkative" : quiet ? "Quiet" : "Any",
      temperature: warm ? "Warm" : cool ? "Cool" : "Any",
      playMusic: myMusic ? "My music" : yourMusic ? "Your music" : "No music",
      luggageOrParcels: luggageAdded
        ? data.luggageOrParcels
        : "No luggage or parcels",
    };
    if (!payload.luggageOrParcels) delete payload.luggageOrParcels

    postRideFn(payload)
      .then((res) => {
        if (res.error) {
          showError(res);
          return;
        }
        showToast(res?.data?.message);
        navigation.navigate("WelcomeScreen");
      })
      .catch((err) => {
        console.error(err);
      });

    // navigation.navigate("DriverOpportunityPreviewScreen", {
    //   data: payload,
    // });
  };

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerComponentContainer}>
        <NavHeader
          message="What would you like to do?"
        />
      </View>
    );
  }

  //top heading section
  function renderHeadingTopSection() {
    return (
      <View style={styles.headingContentContainer}>
        <View style={styles.headingTopLinearItem} />
        <Pressable
          onPress={() => setShowPreference(!showPreference)}
          style={styles.headerPressableContainer}
        >
          <Text style={styles.headingTextItem}>Preferences</Text>
          <View style={styles.headingIconContainer}>
            {showPreference ? (
              <Entypo name="chevron-up" size={24} color={COLORS.white} />
            ) : (
              <Entypo name="chevron-down" size={24} color={COLORS.white} />
            )}
          </View>
        </Pressable>
      </View>
    );
  }

  //preference item list
  function renderPreferenceListItemsSection() {
    return (
      <View style={styles.preferenceListContainer}>
        {showPreference ? (
          <View style={styles.preferenceListContent}>
            {/*talkative section*/}
            <View style={styles.preferenceItemContainer}>
              <View style={styles.preferenceIconIdContainer}>
                <FontAwesome name="volume-up" size={20} color={COLORS.white} />
              </View>

              {/*talkative item*/}
              <TouchableOpacity
                onPress={() => setTalkativeProp()}
                style={styles.preferenceItemContentContainer}
              >
                <Text style={styles.preferenceItemTextItem}>Talkative</Text>
                {talkative ? (
                  <Feather
                    name="check-circle"
                    size={24}
                    color={COLORS.purple}
                  />
                ) : (
                  <Entypo name="circle" size={24} color={COLORS.purple} />
                )}
              </TouchableOpacity>

              {/*quiet item*/}
              <TouchableOpacity
                onPress={() => setQuietProp()}
                style={styles.preferenceItemContentContainer}
              >
                <Text style={styles.preferenceItemTextItem}>Quiet</Text>
                {quiet ? (
                  <Feather
                    name="check-circle"
                    size={24}
                    color={COLORS.purple}
                  />
                ) : (
                  <Entypo name="circle" size={24} color={COLORS.purple} />
                )}
              </TouchableOpacity>

              {/*any item*/}
              <TouchableOpacity
                onPress={() => setAnySpeechProp()}
                style={styles.preferenceItemAnyContentContainer}
              >
                <Text style={styles.preferenceItemTextItem}>Any</Text>
                {anySpeech ? (
                  <Feather
                    name="check-circle"
                    size={24}
                    color={COLORS.purple}
                  />
                ) : (
                  <Entypo name="circle" size={24} color={COLORS.purple} />
                )}
              </TouchableOpacity>
            </View>

            {/*temperature section*/}
            <View style={styles.preferenceItemContainer}>
              <View style={styles.preferenceIconIdContainer}>
                <FontAwesome5
                  name="temperature-low"
                  size={24}
                  color={COLORS.white}
                />
              </View>

              {/*warm item*/}
              <TouchableOpacity
                onPress={() => setWarmProp()}
                style={styles.preferenceItemContentContainer}
              >
                <Text style={styles.preferenceItemTextItem}>Warm</Text>
                {warm ? (
                  <Feather
                    name="check-circle"
                    size={24}
                    color={COLORS.purple}
                  />
                ) : (
                  <Entypo name="circle" size={24} color={COLORS.purple} />
                )}
              </TouchableOpacity>

              {/*cool item*/}
              <TouchableOpacity
                onPress={() => setCoolProp()}
                style={styles.preferenceItemContentContainer}
              >
                <Text style={styles.preferenceItemTextItem}>Cool</Text>
                {cool ? (
                  <Feather
                    name="check-circle"
                    size={24}
                    color={COLORS.purple}
                  />
                ) : (
                  <Entypo name="circle" size={24} color={COLORS.purple} />
                )}
              </TouchableOpacity>

              {/*any item*/}
              <TouchableOpacity
                onPress={() => setAnyTempProp()}
                style={styles.preferenceItemAnyContentContainer}
              >
                <Text style={styles.preferenceItemTextItem}>Any</Text>
                {anyTemperature ? (
                  <Feather
                    name="check-circle"
                    size={24}
                    color={COLORS.purple}
                  />
                ) : (
                  <Entypo name="circle" size={24} color={COLORS.purple} />
                )}
              </TouchableOpacity>
            </View>

            {/*music section*/}
            <View style={styles.preferenceItemContainer}>
              <View style={styles.preferenceIconIdContainer}>
                <SimpleLineIcons
                  name="music-tone-alt"
                  size={24}
                  color={COLORS.white}
                />
              </View>

              {/*my music item*/}
              <TouchableOpacity
                onPress={() => setMyMusicProp()}
                style={styles.preferenceItemContentContainer}
              >
                <Text style={styles.preferenceItemTextItem}>My music</Text>
                {myMusic ? (
                  <Feather
                    name="check-circle"
                    size={24}
                    color={COLORS.purple}
                  />
                ) : (
                  <Entypo name="circle" size={24} color={COLORS.purple} />
                )}
              </TouchableOpacity>

              {/*your music item*/}
              <TouchableOpacity
                onPress={() => setYourMusicProp()}
                style={styles.preferenceItemContentContainer}
              >
                <Text style={styles.preferenceItemTextItem}>Your music</Text>
                {yourMusic ? (
                  <Feather
                    name="check-circle"
                    size={24}
                    color={COLORS.purple}
                  />
                ) : (
                  <Entypo name="circle" size={24} color={COLORS.purple} />
                )}
              </TouchableOpacity>

              {/*none item*/}
              <TouchableOpacity
                onPress={() => setNoMusicProp()}
                style={styles.preferenceItemAnyContentContainer}
              >
                <Text style={styles.preferenceItemTextItem}>None</Text>
                {noMusic ? (
                  <Feather
                    name="check-circle"
                    size={24}
                    color={COLORS.purple}
                  />
                ) : (
                  <Entypo name="circle" size={24} color={COLORS.purple} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.noPreferenceShownContainer}>
            <Text style={styles.noPreferenceShownTextItem}>
              Select preferences for your trip.
            </Text>
          </View>
        )}
        <View style={styles.screenLiner} />
      </View>
    );
  }

  //luggage info section
  function renderLuggageOrParcelsSection() {
    return (
      <View style={styles.luggageContainer}>
        {/*luggage selector section*/}
        <View style={styles.luggageHeadingContainer}>
          <View style={styles.luggageHeadingIconContainer}>
            <FontAwesome5 name="luggage-cart" size={24} color={COLORS.white} />
          </View>

          <View style={styles.luggageHeadingTextContainer}>
            <Text style={styles.luggageHeadingTextItem}>Luggage/Parcels?</Text>
          </View>

          <TouchableOpacity
            onPress={() => setLuggageAdded(!luggageAdded)}
            style={styles.luggageHeadingCheckContainer}
          >
            {luggageAdded ? (
              <Feather name="check-circle" size={24} color={COLORS.purple} />
            ) : (
              <Entypo name="circle" size={24} color={COLORS.purple} />
            )}
          </TouchableOpacity>
        </View>

        {/*luggage specifier section*/}
        <View style={styles.luggageTextAreaContainer}>
          {luggageAdded && (
            <CustomOpportunityDriverDescriptionInput
              name="luggageOrParcels"
              control={control}
              rules={{
                required: "",
                maxLength: {
                  value: 500,
                  message:
                    "Description cannot contain more than 500 characters",
                },
              }}
              placeholder={"If you have luggage/parcels, please specify."}
            />
          )}
        </View>
      </View>
    );
  }

  //submit section
  function renderSubmitSection() {
    return (
      <View
        style={[
          styles.submitContainer,
          {
            marginTop:
              !showPreference && Platform.OS === "ios"
                ? 166.7
                : !showPreference && Platform.OS === "android"
                  ? 170
                  : 20,
          },
        ]}
      >
        <Text style={styles.submitTextMessageTextItem}>
          Click button to request driver
        </Text>

        <TouchableOpacity
          onPress={handleSubmit(submitDriverData)}
          style={styles.buttonContainer}
        >
          {isLoading ? <ActivityIndicator size={"large"} color="white" /> :
            <Image source={icons.reechButton} style={styles.buttonItem} />
          }
        </TouchableOpacity>
      </View>
    );
  }

  //screen list section
  function renderScreenContentList() {
    return (
      <>
        {renderHeaderSection()}
        <View style={styles.screenContentContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            style={styles.scrollingSectionContainer}
          >
            {renderHeadingTopSection()}
            {renderPreferenceListItemsSection()}
            {renderLuggageOrParcelsSection()}
            {renderSubmitSection()}
          </ScrollView>
        </View>
      </>
    );
  }

  //screen content list
  return <View style={styles.container}>{renderScreenContentList()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  //header section
  headerComponentContainer: {
    zIndex: 99,
    marginTop: Platform.OS === "ios" ? "10%" : "0%",
  },

  //screen content container
  screenContentContainer: {
    marginTop: 60,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: "#141414",
  },
  scrollingSectionContainer: {
    height: Platform.OS === "ios" ? 790 : 620,
    marginVertical: 20,
    paddingHorizontal: 20,
  },

  //heading top section
  headingContentContainer: {
    marginBottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  headingTopLinearItem: {
    width: "15%",
    marginBottom: 15,
    borderBottomColor: COLORS.white,
    borderBottomWidth: StyleSheet.hairlineWidth * 7,
  },
  headerPressableContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 10,
  },
  headingTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  headingIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },

  //preference section
  preferenceListContainer: {
    marginTop: 10,
  },
  preferenceListContent: {
    flexDirection: "column",
  },
  preferenceItemContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
  },
  preferenceIconIdContainer: {
    width: "8%",
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  preferenceItemContentContainer: {
    width: "26%",
    marginHorizontal: Platform.OS === "ios" ? 10 : 7,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  preferenceItemAnyContentContainer: {
    width: "20%",
    marginHorizontal: Platform.OS === "ios" ? 10 : 7,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  preferenceItemTextItem: {
    width: "78%",
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  noPreferenceShownContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  noPreferenceShownTextItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  screenLiner: {
    width: "100%",
    borderBottomColor: COLORS.darkGray,
    borderBottomWidth: StyleSheet.hairlineWidth * 0.5,
  },

  //luggage container
  luggageContainer: {
    marginTop: 40,
    flexDirection: "column",
  },
  luggageHeadingContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  luggageHeadingIconContainer: {
    width: "14%",
    justifyContent: "center",
    alignItems: "center",
  },
  luggageHeadingTextContainer: {
    width: "70%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  luggageHeadingTextItem: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  luggageHeadingCheckContainer: {
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  luggageTextAreaContainer: {
    height: Platform.OS === "ios" ? 180 : 160,
    marginVertical: 20,
  },

  //submit section
  submitContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  submitTextMessageTextItem: {
    color: COLORS.darkGray,
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  buttonContainer: {
    marginTop: 10,
  },
  buttonItem: {
    height: 55,
    width: 280,
  }
});

export default DriverAddOpportunityPreferencesScreen;
